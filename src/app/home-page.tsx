'use client'

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import { Spinner } from '@nextui-org/spinner'
import { api } from '~/utils/api'

export default function HomePage() {
  const { isSignedIn, isLoaded: userIsLoaded } = useUser()

  const boardNamesQuery = api.boards.getAllNames.useQuery()
  const defaultBoardId = boardNamesQuery.data?.[0]?.id

  const currentBoardQuery = api.boards.getById.useQuery(
    { id: defaultBoardId! },
    { enabled: Boolean(defaultBoardId) },
  )

  console.info(currentBoardQuery.data)

  if (!userIsLoaded) {
    return (
      <div className="h-full w-full grid place-items-centers">
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
    <div className="bg flex flex-col text-white">
      {isSignedIn ? (
        <SignOutButton>Sign Out</SignOutButton>
      ) : (
        <SignInButton>Sign In</SignInButton>
      )}
    </div>
  )
}
