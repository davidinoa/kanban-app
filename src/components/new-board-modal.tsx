import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal'
import CrossIcon from '~/assets/icon-cross.svg'
import Button from './button'

type NewBoardModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function NewBoardModal({
  isOpen,
  onOpenChange,
}: NewBoardModalProps) {
  return (
    <Modal
      classNames={{
        wrapper: 'p-4',
        base: 'max-w-[30rem] max-h-[90vh]',
      }}
      placement="center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 pt-6">
              Add New Board
            </ModalHeader>
            <ModalBody>
              <form className="flex flex-col gap-6">
                <label className="flex flex-col gap-2">
                  <span className="font-bold text-gray-100 text-sm">
                    Board Name
                  </span>
                  <input
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
              <Button variant="primary" className="w-full" onClick={onClose}>
                Create New Board
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
