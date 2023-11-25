'use client'

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import { Spinner } from '@nextui-org/spinner'
import { useEffect } from 'react'
import { api } from '~/utils/api'
import useAppStore from '~/zustand/app-store'

export default function HomePage() {
  const { isSignedIn, isLoaded: userIsLoaded } = useUser()

  const boardNamesQuery = api.boards.getAllNames.useQuery()
  const defaultBoardId = boardNamesQuery.data?.[0]?.id

  const currentBoardQuery = api.boards.getById.useQuery(
    { id: defaultBoardId! },
    { enabled: Boolean(defaultBoardId) },
  )

  const setCurrentBoard = useAppStore((state) => state.setCurrentBoard)

  useEffect(() => {
    if (currentBoardQuery.data) {
      setCurrentBoard(currentBoardQuery.data)
    }
  }, [currentBoardQuery.data, setCurrentBoard])

  if (!userIsLoaded) {
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
    <div className="flex flex-col text-white">
      {isSignedIn ? (
        <SignOutButton>Sign Out</SignOutButton>
      ) : (
        <SignInButton>Sign In</SignInButton>
      )}
    </div>
  )
}
