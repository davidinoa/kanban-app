import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal'
import { useState } from 'react'
import { api } from '~/utils/api'
import useAppStore from '~/zustand/app-store'
import Button from '../button'
import CreateTaskForm from '../forms/create-task-form'
import EditTaskForm from '../forms/edit-task-form'

type CreateEditTaskModalProps = (
  | {
      mode: 'create'
      taskId?: never
    }
  | {
      mode: 'edit'
      taskId: number
    }
) & { isOpen: boolean; onOpenChange: (isOpen: boolean) => void }

export default function CreateEditTaskModal({
  mode,
  isOpen,
  onOpenChange,
  taskId,
}: CreateEditTaskModalProps) {
  const board = useAppStore((state) => state.currentBoard)
  const isCreating = mode === 'create'
  const [{ isLoading, isValid, isDirty }, setFormState] = useState({
    isLoading: false,
    isValid: false,
    isDirty: false,
  })

  const taskQuery = api.tasks.get.useQuery(
    { id: taskId?.toString() ?? '' },
    { enabled: !isCreating && isOpen, staleTime: Infinity },
  )

  if (!isOpen || !board) return null
  if (!isCreating && taskQuery.isLoading) return <p>loading</p>
  if (!isCreating && !taskQuery.data) return <p>task not found</p>

  return (
    <Modal
      placement="center"
      scrollBehavior="inside"
      isOpen={isOpen}
      onOpenChange={(value) => onOpenChange(value)}
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
      classNames={{
        wrapper: 'p-4',
        base: 'max-w-[30rem] max-h-full !m-0',
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
              {isCreating ? (
                <CreateTaskForm
                  board={board}
                  onClose={onClose}
                  onFormStateChange={setFormState}
                />
              ) : (
                <EditTaskForm
                  task={taskQuery.data!}
                  onFormStateChange={setFormState}
                  onClose={onClose}
                />
              )}
            </ModalBody>
            <ModalFooter className="flex flex-col py-6">
              <Button
                variant="primary"
                className="w-full"
                type="submit"
                form={`${mode}-task-form`}
                isLoading={isLoading}
                isDisabled={!(isValid && isDirty)}
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
 * TODOs:
 * [ ] Fix scrolling issues
 * [ ] Set a max height for different screen sizes
 */
