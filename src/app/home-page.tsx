'use client'

import { SignOutButton, useUser } from '@clerk/nextjs'
import { Card, CardBody } from '@nextui-org/card'
import { Spinner } from '@nextui-org/spinner'
import { useEffect } from 'react'
import CreateColumnsModal from '~/components/modals/create-columns-modal'
import { api } from '~/utils/api'
import useAppStore from '~/zustand/app-store'
import Board from '../components/board/board'

type HomePageProps = {
  boardId: string
}

export default function HomePage({ boardId }: HomePageProps) {
  const { isLoaded: userIsLoaded } = useUser()

  const currentBoardQuery = api.boards.getById.useQuery(
    { id: Number(boardId) },
    { enabled: Boolean(boardId) },
  )

  const setCurrentBoard = useAppStore((state) => state.setCurrentBoard)

  useEffect(() => {
    if (currentBoardQuery.data) {
      setCurrentBoard(currentBoardQuery.data)
    }
  }, [currentBoardQuery.data, setCurrentBoard])

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

  return (
    <>
      <Board board={currentBoardQuery.data} />
      <div
        className="grid min-h-full grid-flow-col gap-6 p-6"
        style={{ gridAutoColumns: '19.5rem' }}
      >
        {currentBoardQuery.data.columns.map((column) => (
          <section key={column.id} className="flex flex-col">
            <h3 className="mb-6">{column.name}</h3>
            <ul className="flex grow flex-col gap-5 rounded-md p-4 dark:bg-gray-300/25">
              {column.tasks.map((task) => (
                <li key={task.id}>
                  <Card
                    isPressable
                    classNames={{
                      base: 'px-4 py-6 w-full',
                      body: 'p-0 flex flex-col gap-2',
                    }}
                  >
                    <CardBody>
                      <p className="font-bold leading-tight">{task.title}</p>
                      <span className="text-xs">
                        {task.subtasks.filter((s) => s.isCompleted).length} of{' '}
                        {task.subtasks.length} subtasks
                      </span>
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <CreateColumnsModal boardId={currentBoardQuery.data.id} />
      </div>
      <SignOutButton />
    </>
  )
}
