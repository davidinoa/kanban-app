import { useState } from 'react'
import AddIcon from '~/assets/icon-add-task-mobile.svg'
import Button from '../button'
import CreateEditBoardModal from '../modals/create-edit-board-modal'

export default function CreateBoardSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div className="h-full p-4">
      <div className="grid h-full place-items-center rounded-md border-4 border-dashed border-gray-100/25">
        <div className="flex flex-col items-center gap-6">
          <h3 className="text-gray-100 md:text-xl">
            Get started by creating a new board
          </h3>
          <Button
            size="large"
            className="px-6"
            onPress={() => setIsModalOpen(true)}
          >
            <AddIcon className="" />
            Create New Board
          </Button>
        </div>
        <CreateEditBoardModal
          mode="create"
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>
    </div>
  )
}
