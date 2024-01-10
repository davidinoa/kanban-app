import { auth } from '@clerk/nextjs'
import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import DemoSignInButton from '~/components/demo-sign-in-button'
import api from '~/trpc/server'

export const metadata: Metadata = {
  title: 'Kanban',
  description: 'Minimalist task management app',
}

export default async function Page() {
  const { userId } = auth()
  if (!userId) return <DemoSignInButton />

  const boardNamesQuery = await api.boards.getAllNames.query()
  const defaultBoardId = boardNamesQuery[0]?.id

  if (defaultBoardId) {
    return redirect(`/boards/${defaultBoardId}`)
  }

  if (!defaultBoardId) {
    return redirect('/boards/new')
  }
}
