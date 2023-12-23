import { type Metadata } from 'next'
import HomePage from '../../home-page'

export const metadata: Metadata = {
  title: 'Kanban',
}

type PageProps = { params: { id: string } }

export default function Page({ params }: PageProps) {
  return <HomePage boardId={params.id} />
}
