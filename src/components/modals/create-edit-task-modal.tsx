import { zodResolver } from '@hookform/resolvers/zod'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import CrossIcon from '~/assets/icon-cross.svg'
import { api } from '~/utils/api'
// import useAppStore from '~/zustand/app-store'
import Button from '../button'
import ColumnSelect from '../column-select'

const maxTitleLength = 255
const titleTooLongMessage = `Title must be at most ${maxTitleLength} characters long`

const subtaskSchema = z.union([
  z.object({
    subtaskId: z.string().optional(),
    subtaskTitle: z
      .string()
      .max(maxTitleLength, titleTooLongMessage)
      .optional(),
  }),
  z.object({
    subtaskTitle: z
      .string()
      .max(maxTitleLength, titleTooLongMessage)
      .optional(),
  }),
])

const formSchema = z.object({
  taskTitle: z
    .string()
    .min(1, 'Task title is required')
    .max(maxTitleLength, titleTooLongMessage),
  description: z.string().optional(),
  subtasks: z.array(subtaskSchema),
})

type FormValues = z.infer<typeof formSchema>

type CreateEditTaskModalProps = (
  | {
      mode: 'create'
    }
  | {
      mode: 'edit'
      taskId: string
    }
) & { isOpen: boolean; onOpenChange: (isOpen: boolean) => void }

export default function CreateEditTaskModal({
  mode,
  isOpen,
  onOpenChange,
}: CreateEditTaskModalProps) {
  // const apiUtils = api.useUtils()

  const createMutation = api.boards.create.useMutation()
  const editMutation = api.boards.edit.useMutation()
  const isLoading = createMutation.isLoading || editMutation.isLoading

  // const board = useAppStore((state) => state.currentBoard)
  const isCreating = mode === 'create'

  const { register, handleSubmit, formState, reset, control } =
    useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        taskTitle: '',
        description: '',
        subtasks: [{ subtaskTitle: '' }],
      },
      // : {
      //     taskTitle: board?.name ?? '',
      //     subtasks: board?.columns.length
      //       ? board.columns.map((column) => ({
      //           columnId: column.id,
      //           columnName: column.name,
      //         }))
      //       : [{ columnName: '' }],
      //   },
    })

  const {
    fields: columnFields,
    append,
    remove,
  } = useFieldArray({
    name: 'subtasks',
    control,
  })

  return (
    <Modal
      placement="center"
      onClose={reset}
      isOpen={isOpen}
      onOpenChange={(value) => onOpenChange(isLoading ? true : value)}
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
      classNames={{
        wrapper: 'p-4 overflow-hidden',
        base: 'max-w-[30rem] max-h-full overflow-y-auto',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 pt-6">
              <h2 className="heading-lg">
                {isCreating ? 'Add New Task' : 'Edit Task'}
              </h2>
            </ModalHeader>
            <ModalBody className="py-0">
              <form
                id="create-edit-task-form"
                className="flex flex-col gap-6 text-gray-100 dark:text-white"
                onSubmit={
                  () => {}
                  //   handleSubmit((data) => {
                  //   async function handleMutationSuccess() {
                  //     await apiUtils.boards.getAllNames.invalidate()
                  //     await apiUtils.boards.getById.invalidate()
                  //     if (data && data.columns.length === 0) {
                  //       data.columns.push({ columnName: '' })
                  //     }
                  //     reset(data)
                  //   }
                  //   const payload = {
                  //     boardName: data.boardName,
                  //     columns: data.columns.filter(
                  //       (c): c is { columnName: string } => Boolean(c.columnName),
                  //     ),
                  //   }
                  //   if (isCreating) {
                  //     return createMutation.mutate(payload, {
                  //       onSuccess: () => {
                  //         handleMutationSuccess()
                  //           .then(() => onClose())
                  //           .catch(() => undefined)
                  //       },
                  //     })
                  //   }
                  //   return editMutation.mutate(
                  //     {
                  //       ...payload,
                  //       boardId: board!.id,
                  //     },
                  //     {
                  //       onSuccess: () => {
                  //         handleMutationSuccess()
                  //           .then(() => onClose())
                  //           .catch(() => undefined)
                  //       },
                  //     },
                  //   )
                  // })
                }
              >
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-bold md:text-sm">Title</span>
                  <input
                    {...register('taskTitle', { required: true })}
                    type="text"
                    placeholder="e.g. Take coffee break"
                    className="rounded-sm border border-gray-100/25 bg-transparent px-4 py-2 placeholder:text-gray-100/50"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-bold md:text-sm">
                    Description
                  </span>
                  <textarea
                    {...register('description')}
                    placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little"
                    className="scrollbar-hidden h-[4.5rem] w-full resize-none rounded-sm border border-gray-100/25 bg-transparent px-4 py-2 leading-[1.75] placeholder:text-gray-100/50 sm:h-[7rem]"
                  />
                </label>
                <fieldset className="scrollbar-hidden flex flex-col gap-3 overflow-hidden">
                  <legend className="mb-2 text-xs font-bold md:text-sm">
                    Subtasks
                  </legend>
                  <div className="scrollbar-hidden flex max-h-24 flex-col gap-3 overflow-y-auto overflow-x-hidden sm:max-h-48">
                    {columnFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-2 pr-2"
                      >
                        <input
                          type="text"
                          placeholder="e.g. Todo"
                          className="grow rounded border border-gray-100/25 bg-transparent px-4 py-2 placeholder:text-gray-100/50 "
                          {...register(`subtasks.${index}.subtaskTitle`)}
                        />
                        <Button
                          variant="icon"
                          tabIndex={-1}
                          aria-label="delete column"
                          className="-mr-2 h-fit px-2 py-2"
                          disabled={columnFields.length === 1}
                          onClick={() => remove(index)}
                        >
                          <CrossIcon />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full flex-shrink-0"
                    onClick={() => append({ subtaskTitle: '' })}
                  >
                    + Add New Subtask
                  </Button>
                </fieldset>
                <ColumnSelect />
              </form>
            </ModalBody>
            <ModalFooter className="flex flex-col py-6">
              <Button
                variant="primary"
                className="w-full"
                type="submit"
                form="create-edit-task-form"
                isLoading={isLoading}
                disabled={!(formState.isValid && formState.isDirty)}
              >
                {isCreating ? 'Create New Task' : 'Save Changes'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

/**
 * TODOS:
 * - Display errors to the users
 * - Disable input after reaching limit
 * - Consider improving default state for column editing
 */