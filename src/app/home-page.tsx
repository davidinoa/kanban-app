'use client'

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
// import { api } from '~/utils/api'

export default function HomePage() {
  const userData = useUser()
  // const userId = userData.user?.id ?? ''
  // const boards = api.boards.getAllBoardsForUser.useQuery(
  //   {
  //     userId: userId,
  //   },
  //   { staleTime: Infinity },
  // )

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="bg flex flex-col text-white">
        {userData.isSignedIn ? (
          <SignOutButton>Sign Out</SignOutButton>
        ) : (
          <SignInButton>Sign In</SignInButton>
        )}
      </div>
    </div>
  )
}
