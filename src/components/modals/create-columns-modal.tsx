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
import toast from 'react-hot-toast'
import { z } from 'zod'
import CrossIcon from '~/assets/icon-cross.svg'
import { api } from '~/utils/api'
import Button from '../button'

const maxNameLength = 255
const formSchema = z.object({
  columns: z.array(
    z.object({
      name: z.string().max(maxNameLength, 'Name is too long'),
    }),
  ),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateColumnsModal({ boardId }: { boardId: number }) {
  const { isOpen, onOpenChange, onOpen } = useDisclosure()
  const apiUtils = api.useUtils()
  const createMutation = api.columns.create.useMutation()
  const { isLoading } = createMutation

  const { register, handleSubmit, formState, reset, control, watch } =
    useForm<FormValues>({
      mode: 'onChange',
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
                    const payload = {
                      boardId,
                      columns: data.columns.filter((c): c is { name: string } =>
                        Boolean(c.name),
                      ),
                    }

                    return createMutation.mutate(payload, {
                      onError: (error) => toast.error(error.message),
                      onSuccess: () => {
                        apiUtils.boards.getById
                          .invalidate()
                          .then(() => {
                            toast.success('Columns created successfully')
                            onClose()
                          })
                          .catch(() => toast.error('Something went wrong'))
                      },
                    })
                  })}
                >
                  <fieldset className="flex flex-col gap-3">
                    <legend className="mb-2 text-xs font-bold md:text-sm">
                      Board Columns
                    </legend>
                    {columnFields.map((field, index) => {
                      const fieldError = formState.errors.columns?.[index]?.name
                      return (
                        <div key={field.id} className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="e.g. Todo"
                              autoComplete="off"
                              maxLength={maxNameLength + 1}
                              aria-invalid={Boolean(fieldError)}
                              className="grow rounded border border-gray-100/25 bg-transparent px-4 py-2 placeholder:text-gray-100/50 aria-invalid:border-red-100"
                              {...register(`columns.${index}.name`)}
                            />
                            <Button
                              variant="icon"
                              aria-label="delete column"
                              className="-mr-2 h-fit px-2 py-2"
                              disabled={columnFields.length === 1}
                              onPress={() => remove(index)}
                            >
                              <CrossIcon />
                            </Button>
                          </div>
                          {fieldError && (
                            <p className="px-2 text-xs text-red-100">
                              {fieldError.message}
                            </p>
                          )}
                        </div>
                      )
                    })}
                    <Button
                      variant="secondary"
                      className="w-full"
                      isDisabled={
                        watch('columns').at(-1)?.name === '' ||
                        !formState.isValid
                      }
                      onPress={() => append({ name: '' })}
                    >
                      + Add New Column
                    </Button>
                  </fieldset>
                </form>
              </ModalBody>
              <ModalFooter className="flex flex-col pb-8">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
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
