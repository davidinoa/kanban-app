'use client'

import { Button } from '@nextui-org/button'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { ScrollShadow } from '@nextui-org/scroll-shadow'
import { useState } from 'react'
import BoardIcon from '~/assets/icon-board.svg'
import ChevronDownIcon from '~/assets/icon-chevron-down.svg'
import ChevronUpIcon from '~/assets/icon-chevron-up.svg'
import { api } from '~/utils/api'
import CreateEditBoardModal from './modals/create-edit-board-modal'
import ThemeSwitch from './theme-switch'

type Status = 'closed' | 'popoverOpen' | 'modalOpen'

export default function BoardsPopover() {
  const { data, isLoading, isError } = api.boards.getAllNames.useQuery()
  const [status, setStatus] = useState<Status>('closed')
  const isPopoverOpen = status === 'popoverOpen'
  const isModalOpen = status === 'modalOpen'

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Something went wrong 😰</div>

  return (
    <>
      <Popover
        isOpen={isPopoverOpen}
        onOpenChange={() => setStatus(isPopoverOpen ? 'closed' : 'popoverOpen')}
        offset={36}
        placement="bottom-start"
      >
        <PopoverTrigger className="mr-auto md:hidden">
          <Button className="flex items-center gap-2 rounded-lg bg-transparent p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-200">
            <h1 className="truncate text-lg font-bold leading-tight">
              Platform Launch
            </h1>
            {isPopoverOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="group w-[16.5rem] items-start rounded-lg p-4 dark:bg-gray-300">
          {(titleProps) => (
            <>
              <nav className="mb-4 w-full px-2">
                <h2
                  className="mb-4 text-left uppercase heading-sm"
                  {...titleProps}
                >
                  {`All Boards (${data.length})`}
                </h2>
                <ul className="-ml-6 p-0 text-sm font-bold leading-tight text-gray-100">
                  <ScrollShadow className="h-[20vh]" size={50}>
                    {data.map((board) => (
                      <li key={board.id}>
                        <a
                          href="/"
                          className="flex items-center gap-3 px-6 py-4"
                        >
                          <BoardIcon />
                          {board.name}
                        </a>
                      </li>
                    ))}
                  </ScrollShadow>
                  <li>
                    <Button
                      variant="ghost"
                      className="h-fit w-full justify-start gap-3 rounded-none rounded-r-full p-0 px-6 py-4 ring-inset ring-blue-600 data-[focus-visible=true]:outline-0 data-[focus-visible=true]:ring-2"
                      onClick={() => setStatus('modalOpen')}
                    >
                      <BoardIcon className="[&_path]:fill-purple-100" />+ Create
                      New Board
                    </Button>
                  </li>
                </ul>
              </nav>
              <ThemeSwitch />
            </>
          )}
        </PopoverContent>
      </Popover>
      <CreateEditBoardModal
        mode="create"
        isOpen={isModalOpen}
        onOpenChange={(isOpen: boolean) =>
          setStatus(isOpen ? 'modalOpen' : 'closed')
        }
      />
    </>
  )
}
