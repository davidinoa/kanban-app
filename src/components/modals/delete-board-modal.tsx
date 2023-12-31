import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
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
  const router = useRouter()
  const boardNamesQuery = api.boards.getAllNames.useQuery(undefined, {
    staleTime: Infinity,
  })
  const nextDefaultBoardId = boardNamesQuery?.data?.[1]?.id
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
      <ModalContent className="m-0 flex max-w-[30rem] flex-col gap-6 rounded-md p-6 @container dark:bg-gray-300 md:p-8">
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
            <ModalFooter className="flex flex-col gap-4 p-0 @[20rem]:flex-row">
              <Button
                variant="danger"
                className="w-full"
                isLoading={isLoading}
                onPress={() => {
                  const errorMessage = 'An error occurred'
                  const successMessage = 'Board deleted'
                  const redirectPath = `/boards/${nextDefaultBoardId ?? 'new'}`
                  mutate(
                    { id: board.id },
                    {
                      onError: (error) => {
                        toast.error(error.message ?? errorMessage)
                      },
                      onSuccess: () => {
                        apiUtils.boards.getAllNames
                          .invalidate()
                          .then(() => toast.success(successMessage))
                          .then(() => onClose())
                          .then(() => router.push(redirectPath))
                          .catch(() => toast.error(errorMessage))
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
                onPress={onClose}
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
