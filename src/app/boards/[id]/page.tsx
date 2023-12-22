import { type Metadata } from 'next'
import api from '~/trpc/server'
import HomePage from '../../home-page'

export const metadata: Metadata = {
  title: 'Kanban',
}

type PageProps = { params: { id: string } }

export default async function Page({ params }: PageProps) {
  const boardNamesQuery = await api.boards.getAllNames.query()
  const defaultBoardId = params?.id ?? String(boardNamesQuery[0]?.id) ?? 'new'
  return <HomePage boardId={defaultBoardId} />
}
