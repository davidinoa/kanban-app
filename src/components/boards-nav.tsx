/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ComponentProps } from 'react'
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
  const pathname = usePathname()

  if (!data) return null

  return (
    <nav className={className} {...props}>
      {data.length !== 0 && (
        <h2 className="mb-4 px-6 text-left uppercase heading-sm md:mb-5">
          {`All Boards (${data.length})`}
        </h2>
      )}
      <ul className="text-sm font-bold leading-tight text-gray-100 lg:text-base">
        {data.map((board) => {
          const isLinkActive = pathname === `/boards/${board.id}`
          return (
            <li key={board.id}>
              <Link
                href={`/boards/${board.id}`}
                className={`lg: group flex items-center gap-3 rounded-r-full px-6 py-4 transition-colors lg:px-8 ${
                  isLinkActive
                    ? 'bg-purple-100 text-white'
                    : 'hover:bg-purple-100/10 hover:text-purple-100 focus-visible:bg-purple-100/10 focus-visible:text-purple-100'
                }`}
              >
                <BoardIcon
                  className={`${
                    isLinkActive
                      ? '[&_path]:fill-white'
                      : 'group-hover:[&_path]:fill-purple-100 group-focus-visible:[&_path]:fill-purple-100'
                  }`}
                />
                <span className="truncate">{board.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <Button
        variant="ghost"
        className="group w-full justify-start gap-3 rounded-none rounded-r-full px-6 py-4 text-purple-100 ring-inset ring-blue-600 hover:bg-purple-100/10 focus-visible:bg-purple-100/10 data-[focus-visible=true]:outline-0 data-[focus-visible=true]:ring-2 dark:hover:bg-purple-100/10 lg:px-8 lg:text-base"
        onClick={onCreateBoardClick}
      >
        <BoardIcon className="[&_path]:fill-purple-100" />+ Create New Board
      </Button>
    </nav>
  )
}

/**
 * Todos:
 * - [ ] Error and loading states
 * - [ ] Remove ring after clicking on a link
 * - [ ] Update link href
 * - [ ] Fix focus ring
 * - [ ] Show tooltip on hover for truncated text
 */
