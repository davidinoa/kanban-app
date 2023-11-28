import { zodResolver } from '@hookform/resolvers/zod'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import CrossIcon from '~/assets/icon-cross.svg'
import { api } from '~/utils/api'
import Button from '../button'

const maxNameLength = 255
const nameTooLongMessage = `Name must be at most ${maxNameLength} characters long`

const formSchema = z.object({
  columns: z.array(
    z.object({
      name: z.string().max(maxNameLength, nameTooLongMessage).optional(),
    }),
  ),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateNewColumnsModal({
  boardId,
}: {
  boardId: number
}) {
  const { isOpen, onOpenChange, onOpen } = useDisclosure()
  const apiUtils = api.useUtils()
  const createMutation = api.columns.create.useMutation()
  const { isLoading } = createMutation

  const { register, handleSubmit, formState, reset, control, watch } =
    useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        columns: [{ name: '' }],
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
    <>
      <div className="pt-12">
        <Button
          onPress={onOpen}
          className="h-full w-full rounded-md bg-sky text-2xl font-bold text-gray-100 dark:bg-gray-300/25"
        >
          + New Column
        </Button>
      </div>
      <Modal
        scrollBehavior="inside"
        placement="center"
        onClose={reset}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
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
                <h2 className="heading-lg">Add New Columns</h2>
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
                        data.columns.push({ name: '' })
                      }
                      reset(data)
                    }

                    const payload = {
                      boardId,
                      columns: data.columns.filter((c): c is { name: string } =>
                        Boolean(c.name),
                      ),
                    }

                    return createMutation.mutate(payload, {
                      onSuccess: () => {
                        handleMutationSuccess()
                          .then(() => onClose())
                          .catch(() => undefined)
                      },
                    })
                  })}
                >
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
                          {...register(`columns.${index}.name`)}
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
                      disabled={
                        watch('columns').at(-1)?.name === '' ||
                        !formState.isValid
                      }
                      onClick={() => append({ name: '' })}
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
                  Create New {columnFields.length > 1 ? 'Columns' : 'Column'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

/**
 * TODOS:
 * - Display errors to the users
 * - Disable input after reaching limit
 * - Consider improving default state for column editing
 */
