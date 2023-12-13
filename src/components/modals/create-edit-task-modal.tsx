import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal'
import { useState } from 'react'
import useAppStore from '~/zustand/app-store'
import Button from '../button'
import CreateTaskForm from '../forms/create-task-form'

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
  const board = useAppStore((state) => state.currentBoard)
  const isCreating = mode === 'create'
  const [{ isLoading, isValid, isDirty }, setFormState] = useState({
    isLoading: false,
    isValid: false,
    isDirty: false,
  })

  if (!board) return null

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
            <ModalBody className="overflow-hidden py-0">
              <CreateTaskForm
                board={board}
                onClose={onClose}
                onFormStateChange={setFormState}
              />
            </ModalBody>
            <ModalFooter className="flex flex-col py-6">
              <Button
                variant="primary"
                className="w-full"
                type="submit"
                form="create-edit-task-form"
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
