import dynamic from 'next/dynamic'
import api from '~/trpc/server'

const Board = dynamic(() => import('../../components/board/board'), {
  ssr: false,
})

export default async function Page() {
  const board = await api.boards.getById.query({ id: 1 })
  if (!board) {
    return <div>Board not found</div>
  }
  return (
    <div className="h-full">
      <Board board={board} />
    </div>
  )
}
