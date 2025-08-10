import { type Metadata } from 'next'
import HomePage from '../../home-page'

export const metadata: Metadata = {
  title: 'Kanban',
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <HomePage boardId={id} />
}
