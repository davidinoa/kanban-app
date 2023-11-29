import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import api from '~/trpc/server'

export const metadata: Metadata = {
  title: 'Kanban',
}

export default async function Page() {
  const boardNamesQuery = await api.boards.getAllNames.query()
  const defaultBoardId = boardNamesQuery[0]?.id
  redirect(`/boards/${defaultBoardId}`)
}
