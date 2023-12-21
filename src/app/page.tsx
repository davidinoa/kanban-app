import { auth } from '@clerk/nextjs'
import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import api from '~/trpc/server'
import LandingPage from './landing-page'

export const metadata: Metadata = {
  title: 'Kanban',
}

export default async function Page() {
  const { userId } = auth()
  if (!userId) return <LandingPage />

  const boardNamesQuery = await api.boards.getAllNames.query()
  const defaultBoardId = boardNamesQuery[0]?.id

  if (defaultBoardId) {
    return redirect(`/boards/${defaultBoardId}`)
  }

  if (!defaultBoardId) {
    return redirect('/boards/new')
  }
}
