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
import useAppStore from '~/zustand/app-store'
import Button from '../button'

const maxNameLength = 255
const nameTooLongMessage = `Name must be at most ${maxNameLength} characters long`

const columnSchema = z.union([
  z.object({
    columnId: z.string().optional(),
    columnName: z.string().max(maxNameLength, nameTooLongMessage).optional(),
  }),
  z.object({
    columnName: z.string().max(maxNameLength, nameTooLongMessage).optional(),
  }),
])

const formSchema = z.object({
  boardName: z
    .string()
    .min(1, 'Board name is required')
    .max(maxNameLength, nameTooLongMessage),
  columns: z.array(columnSchema),
})

type FormValues = z.infer<typeof formSchema>

type NewBoardModalProps = {
  mode: 'create' | 'edit'
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function CreateEditBoardModal({
  mode,
  isOpen,
  onOpenChange,
}: NewBoardModalProps) {
  const apiUtils = api.useUtils()

  const createMutation = api.boards.create.useMutation()
  const editMutation = api.boards.edit.useMutation()
  const isLoading = createMutation.isLoading || editMutation.isLoading

  const isCreating = mode === 'create'
  const board = useAppStore((state) => state.currentBoard)

  const { register, handleSubmit, formState, reset, control } =
    useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: isCreating
        ? {
            boardName: '',
            columns: [{ columnName: '' }],
          }
        : {
            boardName: board?.name ?? '',
            columns: board?.columns.length
              ? board.columns.map((column) => ({
                  columnId: column.id,
                  columnName: column.name,
                }))
              : [{ columnName: '' }],
          },
    })

  const {
    fields: columnFields,
    append,
    remove,
  } = useFieldArray({
    name: 'columns',
    control,
  })

  if (!isCreating && !board) {
    return null
  }

  return (
    <Modal
      scrollBehavior="inside"
      placement="center"
      onClose={reset}
      isOpen={isOpen}
      onOpenChange={(value) => onOpenChange(isLoading ? true : value)}
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
      classNames={{
        wrapper: 'p-4',
        base: 'max-w-[30rem] max-h-[70vh]',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 pt-6">
              <h2 className="heading-lg">
                {isCreating ? 'Add New Board' : 'Edit Board'}
              </h2>
            </ModalHeader>
            <ModalBody>
              <form
                id="create-edit-board-form"
                className="flex flex-col gap-6 text-gray-100 dark:text-white"
                onSubmit={handleSubmit((data) => {
                  async function handleMutationSuccess() {
                    await apiUtils.boards.getAllNames.invalidate()
                    await apiUtils.boards.getById.invalidate()
                    if (data && data.columns.length === 0) {
                      data.columns.push({ columnName: '' })
                    }
                    reset(data)
                  }

                  const payload = {
                    boardName: data.boardName,
                    columns: data.columns.filter(
                      (c): c is { columnName: string } => Boolean(c.columnName),
                    ),
                  }

                  if (isCreating) {
                    return createMutation.mutate(payload, {
                      onSuccess: () => {
                        handleMutationSuccess()
                          .then(() => onClose())
                          .catch(() => undefined)
                      },
                    })
                  }

                  return editMutation.mutate(
                    {
                      ...payload,
                      boardId: board!.id,
                    },
                    {
                      onSuccess: () => {
                        handleMutationSuccess()
                          .then(() => onClose())
                          .catch(() => undefined)
                      },
                    },
                  )
                })}
              >
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-bold md:text-sm">
                    Board Name
                  </span>
                  <input
                    {...register('boardName', { required: true })}
                    type="text"
                    placeholder="e.g. Web Design"
                    className="rounded-sm border border-gray-100/25 bg-transparent px-4 py-2 placeholder:text-gray-100/50"
                  />
                </label>
                <fieldset className="flex flex-col gap-3">
                  <legend className="mb-2 text-xs font-bold md:text-sm">
                    Board Columns
                  </legend>
                  {columnFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Todo"
                        className="grow rounded border border-gray-100/25 bg-transparent px-4 py-2 placeholder:text-gray-100/50 "
                        {...register(`columns.${index}.columnName`)}
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
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => append({ columnName: '' })}
                  >
                    + Add New Column
                  </Button>
                </fieldset>
              </form>
            </ModalBody>
            <ModalFooter className="flex flex-col pb-8">
              <Button
                variant="primary"
                className="w-full"
                type="submit"
                form="create-edit-board-form"
                isLoading={isLoading}
                disabled={!(formState.isValid && formState.isDirty)}
              >
                {isCreating ? 'Create New Board' : 'Save Changes'}
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
