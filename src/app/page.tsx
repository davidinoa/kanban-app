import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import api from '~/trpc/server'

export const metadata: Metadata = {
  title: 'Kanban',
  description: 'Minimalist task management app',
}

// This page reads cookies via tRPC server context, so force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function Page() {
  const boardNamesQuery = await api.boards.getAllNames.query()
  const defaultBoardId = boardNamesQuery[0]?.id ?? 24

  if (defaultBoardId) {
    return redirect(`/boards/${defaultBoardId}`)
  }

  if (!defaultBoardId) {
    return redirect('/boards/new')
  }
}
