import { SignIn, auth } from '@clerk/nextjs'
import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import api from '~/trpc/server'

export const metadata: Metadata = {
  title: 'Kanban',
}

export default async function Page() {
  const { userId } = auth()
  if (!userId) {
    return (
      <div className="grid h-screen w-screen place-items-center dark:bg-gray-200">
        <SignIn />
      </div>
    )
  }
  const boardNamesQuery = await api.boards.getAllNames.query()
  const defaultBoardId = boardNamesQuery[0]?.id
  return redirect(`/boards/${defaultBoardId}`)
}
