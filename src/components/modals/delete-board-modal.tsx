import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal'
import { api } from '~/utils/api'
import useAppStore from '~/zustand/app-store'
import Button from '../button'

type DeleteBoardModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function DeleteBoardModal({
  isOpen,
  onOpenChange,
}: DeleteBoardModalProps) {
  const board = useAppStore((state) => state.currentBoard)
  const { mutate, isLoading } = api.boards.delete.useMutation()
  const apiUtils = api.useUtils()

  if (!board) return null

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!isLoading}
      placement="center"
      classNames={{ wrapper: 'p-4' }}
    >
      <ModalContent className="@container m-0 flex max-w-[30rem] flex-col gap-6 rounded-md p-6 dark:bg-gray-300 md:p-8">
        {(onClose) => (
          <>
            <ModalHeader className="p-0">
              <h2 className="text-lg font-bold text-red-100">
                Delete this board?
              </h2>
            </ModalHeader>
            <ModalBody className="p-0">
              <p className="text-sm leading-[1.75]">
                Are you sure you want to delete the <b>{board.name}</b> board?
                This action will remove all columns and tasks and cannot be
                reversed.
              </p>
            </ModalBody>
            <ModalFooter className="@[20rem]:flex-row flex flex-col gap-4 p-0">
              <Button
                variant="danger"
                className="w-full"
                isLoading={isLoading}
                onClick={() => {
                  mutate(
                    { id: board.id },
                    {
                      onSuccess: () => {
                        apiUtils.boards.getAllNames
                          .invalidate()
                          .then(() => onClose())
                          .catch(() => undefined)
                      },
                    },
                  )
                }}
              >
                Delete
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

/**
 * Todos:
 * [ ] Handle error states
 */
