'use client'

import { useUser } from '@clerk/nextjs'
import { Spinner } from '@nextui-org/spinner'
import { useEffect, useState } from 'react'
import AddIcon from '~/assets/icon-add-task-mobile.svg'
import Button from '~/components/button'
import CreateEditBoardModal from '~/components/modals/create-edit-board-modal'
import { api } from '~/utils/api'
import useAppStore from '~/zustand/app-store'
import Board from '../components/board/board'

type HomePageProps = {
  boardId: string
}

function CreateBoardSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div className="h-full p-4">
      <div className="grid h-full place-items-center rounded-md border-4 border-dashed">
        <div className="flex flex-col items-center gap-4">
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

export default function HomePage({ boardId }: HomePageProps) {
  const { isLoaded: userIsLoaded } = useUser()

  const currentBoardQuery = api.boards.getById.useQuery(
    { id: Number(boardId) },
    { enabled: Boolean(boardId) && boardId !== 'new' },
  )

  const setCurrentBoard = useAppStore((state) => state.setCurrentBoard)

  useEffect(() => {
    if (currentBoardQuery.data) {
      setCurrentBoard(currentBoardQuery.data)
    } else {
      setCurrentBoard(undefined)
    }
  }, [currentBoardQuery.data, setCurrentBoard])

  if (boardId === 'new') {
    return <CreateBoardSection />
  }

  if (currentBoardQuery.error) {
    return (
      <div>
        Something went wrong while loading the board. Please try again later.
      </div>
    )
  }

  if (!userIsLoaded || currentBoardQuery.isLoading) {
    return (
      <div className="place-items-centers grid h-full w-full">
        <Spinner
          classNames={{
            circle1: 'border-b-purple-100',
            circle2: 'border-b-purple-100',
          }}
        />
      </div>
    )
  }

  return <Board board={currentBoardQuery.data} />
}
