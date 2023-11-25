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

const columnSchema = z.object({
  columnName: z.string().max(maxNameLength, nameTooLongMessage).optional(),
})

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
  const { mutate, isLoading } = api.boards.create.useMutation()

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

  return (
    <Modal
      scrollBehavior="inside"
      placement="center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={reset}
      classNames={{
        wrapper: 'p-4',
        base: 'max-w-[30rem] max-h-[70vh]',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 pt-6">
              {isCreating ? 'Add New Board' : 'Edit Board'}
            </ModalHeader>
            <ModalBody>
              <form
                id="create-edit-board-form"
                className="flex flex-col gap-6"
                onSubmit={handleSubmit((data) => {
                  mutate(
                    {
                      boardName: data.boardName,
                      columns: data.columns.filter(
                        (column): column is { columnName: string } =>
                          Boolean(column.columnName),
                      ),
                    },
                    {
                      onSuccess: () => {
                        apiUtils.boards.getAllNames
                          .invalidate()
                          .then(() => {
                            reset()
                            onClose()
                          })
                          .catch(() => undefined)
                      },
                    },
                  )
                })}
              >
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-gray-100">
                    Board Name
                  </span>
                  <input
                    {...register('boardName', {
                      required: true,
                    })}
                    type="text"
                    placeholder="e.g. Web Design"
                    className="rounded-sm border border-gray-100/25 px-4 py-2 placeholder:text-gray-100/50"
                  />
                </label>
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-sm font-bold text-gray-100">
                    Board Columns
                  </legend>
                  {columnFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Todo"
                        className="grow rounded border border-gray-100/25 px-4 py-2 placeholder:text-gray-100/50 disabled:cursor-not-allowed"
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
                type="submit"
                form="create-edit-board-form"
                isLoading={isLoading}
                disabled={!(formState.isValid && formState.isDirty)}
                variant="primary"
                className="w-full"
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
 */
