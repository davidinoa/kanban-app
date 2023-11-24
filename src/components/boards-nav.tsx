import Link from 'next/link'
import { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import BoardIcon from '~/assets/icon-board.svg'
import { api } from '~/utils/api'
import Button from './button'

type BoardsNavProps = {
  onCreateBoardClick: () => void
} & ComponentProps<'nav'>

export default function BoardsNav({
  onCreateBoardClick,
  className,
  ...props
}: BoardsNavProps) {
  const { data } = api.boards.getAllNames.useQuery()

  if (!data) return null

  return (
    <nav className={twMerge(['md:pr-5 lg:pr-6', className])} {...props}>
      <h2 className="mb-4 px-6 text-left uppercase heading-sm md:mb-5">
        {`All Boards (${data.length})`}
      </h2>
      <ul className="text-sm font-bold leading-tight text-gray-100 lg:text-base">
        {data.map((board) => (
          <li key={board.id}>
            <Link
              href="/"
              className="lg: group flex items-center gap-3 rounded-r-full px-6 py-4 hover:bg-purple-100 hover:text-white lg:px-8"
            >
              <BoardIcon className="group-hover:[&_path]:fill-white" />
              {board.name}
            </Link>
          </li>
        ))}
      </ul>
      <Button
        variant="ghost"
        className="group w-full justify-start gap-3 rounded-none rounded-r-full p-0 px-6 py-4 text-purple-100 ring-inset ring-blue-600 hover:bg-purple-100 hover:text-white data-[focus-visible=true]:outline-0 data-[focus-visible=true]:ring-2 lg:px-8 lg:text-base"
        onClick={onCreateBoardClick}
        style={{ opacity: 1 }}
      >
        <BoardIcon className="[&_path]:fill-purple-100 group-hover:[&_path]:fill-white" />
        + Create New Board
      </Button>
    </nav>
  )
}

/**
 * Todos:
 * - [ ] Error and loading states
 */
