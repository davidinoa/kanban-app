'use client'

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import { api } from '~/utils/api'

export default function HomePage() {
  const userData = useUser()
  const boards = api.boards.getFirst.useQuery()

  console.log({ boards })

  return (
    <div className="bg flex flex-col text-white">
      {userData.isSignedIn ? (
        <SignOutButton>Sign Out</SignOutButton>
      ) : (
        <SignInButton>Sign In</SignInButton>
      )}
    </div>
  )
}
