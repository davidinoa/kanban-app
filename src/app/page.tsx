import { auth } from '@clerk/nextjs'
import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import DemoLogin from '~/components/demo-login'
import api from '~/trpc/server'

export const metadata: Metadata = {
  title: 'Kanban',
}

export default async function Page() {
  const { userId } = auth()
  if (!userId) {
    return (
      <div className="grid h-screen w-screen place-items-center dark:bg-gray-200">
        {/* <SignIn /> */}
        <DemoLogin />
      </div>
    )
  }
  const boardNamesQuery = await api.boards.getAllNames.query()
  const defaultBoardId = boardNamesQuery[0]?.id

  if (defaultBoardId) {
    return redirect(`/boards/${defaultBoardId}`)
  }

  if (!defaultBoardId) {
    return redirect('/boards/new')
  }
}
