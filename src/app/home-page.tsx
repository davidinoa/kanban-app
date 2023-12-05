'use client'

import { useUser } from '@clerk/nextjs'
import { Spinner } from '@nextui-org/spinner'
import { notFound } from 'next/navigation'
import { useEffect } from 'react'
import CreateBoardSection from '~/components/board/create-board-section'
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
    { enabled: Boolean(boardId) && boardId !== 'new' },
  )

  const setCurrentBoard = useAppStore((state) => state.setCurrentBoard)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    useAppStore.persist.rehydrate()
  }, [])

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
    const { code } = currentBoardQuery.error.data ?? {}
    if (code === 'NOT_FOUND' || code === 'BAD_REQUEST') {
      return notFound()
    }
    return <div>{currentBoardQuery.error.message}</div>
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
