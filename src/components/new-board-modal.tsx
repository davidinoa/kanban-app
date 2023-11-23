import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal'
import { useForm } from 'react-hook-form'
import CrossIcon from '~/assets/icon-cross.svg'
import { api } from '~/utils/api'
import Button from './button'

type NewBoardModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function NewBoardModal({
  isOpen,
  onOpenChange,
}: NewBoardModalProps) {
  const apiUtils = api.useUtils()
  const { mutate, isLoading } = api.boards.create.useMutation()
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      name: '',
    },
  })

  return (
    <Modal
      placement="center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        wrapper: 'p-4',
        base: 'max-w-[30rem] max-h-[90vh]',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 pt-6">
              Add New Board
            </ModalHeader>
            <ModalBody>
              <form
                id="new-board-form"
                className="flex flex-col gap-6"
                onSubmit={handleSubmit((data) => {
                  mutate(
                    {
                      name: data.name,
                    },
                    {
                      onSuccess: () => {
                        apiUtils.boards.getAllNames
                          .invalidate()
                          .then(() => {
                            reset()
                            onClose()
                          })
                          .catch(console.error)
                      },
                    },
                  )
                })}
              >
                <label className="flex flex-col gap-2">
                  <span className="font-bold text-gray-100 text-sm">
                    Board Name
                  </span>
                  <input
                    {...register('name', {
                      required: true,
                    })}
                    type="text"
                    placeholder="e.g. Web Design"
                    className="border border-gray-100/25 rounded-sm placeholder:text-gray-100/50 py-2 px-4"
                  />
                </label>
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 font-bold text-gray-100 text-sm">
                    Board Columns
                  </legend>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="e.g. Todo"
                      className="rounded grow border border-gray-100/25 placeholder:text-gray-100/50 py-2 px-4"
                    />
                    <Button
                      variant="icon"
                      tabIndex={-1}
                      aria-label="delete column"
                      className="px-2 py-2 h-fit -mr-2"
                    >
                      <CrossIcon />
                    </Button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="e.g. Todo"
                      className="grow border border-gray-100/25 rounded placeholder:text-gray-100/50 py-2 px-4"
                    />
                    <Button
                      variant="icon"
                      tabIndex={-1}
                      aria-label="delete column"
                      className="px-2 py-2 h-fit -mr-2"
                    >
                      <CrossIcon />
                    </Button>
                  </div>
                  <Button variant="secondary" className="w-full">
                    + Add New Column
                  </Button>
                </fieldset>
              </form>
            </ModalBody>
            <ModalFooter className="flex flex-col pb-8">
              <Button
                type="submit"
                form="new-board-form"
                isLoading={isLoading}
                disabled={!formState.isValid}
                variant="primary"
                className="w-full"
              >
                Create New Board
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
