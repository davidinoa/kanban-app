import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { api } from '~/utils/api'
import useAppStore from '~/zustand/app-store'
import Button from '../button'

type DeleteTaskModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function DeleteTaskModal({
  isOpen,
  onOpenChange,
}: DeleteTaskModalProps) {
  const deleteButtonRef = useRef<HTMLButtonElement>(null)

  const { viewingTaskId, setViewingTaskId } = useAppStore((s) => ({
    viewingTaskId: s.viewingTaskId,
    setViewingTaskId: s.setViewingTaskId,
  }))

  const apiUtils = api.useUtils()
  const taskQuery = api.tasks.get.useQuery(
    { id: viewingTaskId! },
    { enabled: Boolean(viewingTaskId), staleTime: Infinity },
  )

  const deleteMutation = api.tasks.delete.useMutation()
  useEffect(() => {
    if (deleteMutation.status === 'error') {
      deleteButtonRef.current?.focus()
    }
  }, [deleteMutation.status])

  if (!taskQuery.data || !viewingTaskId) return null

  const { title } = taskQuery.data
  const isLoading = deleteMutation.isLoading || taskQuery.isLoading

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
                Delete this task?
              </h2>
            </ModalHeader>
            <ModalBody className="p-0">
              <p className="text-sm leading-[1.75]">
                Are you sure you want to delete the <b>{title}</b> task and its
                subtasks? This action cannot be reversed.
              </p>
            </ModalBody>
            <ModalFooter className="flex flex-col gap-4 p-0 @[20rem]:flex-row">
              <Button
                ref={deleteButtonRef}
                variant="danger"
                className="w-full"
                isLoading={isLoading}
                onPress={() => {
                  deleteMutation.mutate(
                    { id: viewingTaskId },
                    {
                      onError: (error) => {
                        toast.error(error.message)
                      },
                      onSuccess: () => {
                        apiUtils.boards.getById
                          .invalidate()
                          .then(() => {
                            setViewingTaskId(undefined)
                            toast.success('Task deleted successfully')
                            onClose()
                          })
                          .catch(() =>
                            toast.error('Failed to invalidate board cache'),
                          )
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
                isDisabled={isLoading}
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
