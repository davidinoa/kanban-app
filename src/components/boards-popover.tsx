'use client'

import { Button } from '@nextui-org/button'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { useState } from 'react'
import BoardIcon from '~/assets/icon-board.svg'
import ChevronDownIcon from '~/assets/icon-chevron-down.svg'
import ChevronUpIcon from '~/assets/icon-chevron-up.svg'
import NewBoardModal from './new-board-modal'
import ThemeSwitch from './theme-switch'

type Status = 'closed' | 'popoverOpen' | 'modalOpen'

export default function BoardsPopover() {
  const [status, setStatus] = useState<Status>('closed')
  const isPopoverOpen = status === 'popoverOpen'
  const isModalOpen = status === 'modalOpen'

  return (
    <>
      <Popover
        isOpen={isPopoverOpen}
        onOpenChange={() => setStatus(isPopoverOpen ? 'closed' : 'popoverOpen')}
        offset={36}
        placement="bottom-start"
      >
        <PopoverTrigger className="md:hidden mr-auto">
          <Button className="flex items-center gap-2 p-2 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-200 rounded-lg transition-colors">
            <h1 className="text-lg font-bold leading-tight truncate">
              Platform Launch
            </h1>
            {isPopoverOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="group w-[16.5rem] rounded-lg p-4 dark:bg-gray-300 items-start">
          {(titleProps) => (
            <>
              <nav className="w-full px-2 mb-4">
                <h2
                  className="uppercase heading-sm text-left mb-4"
                  {...titleProps}
                >
                  All Boards (3)
                </h2>
                <ul className="text-sm leading-tight text-gray-100 p-0 font-bold -ml-6">
                  <li className="py-4 px-6 text-white bg-purple-100 rounded-r-full flex gap-3 items-center">
                    <BoardIcon className="[&_path]:fill-white" />
                    Test Board
                  </li>
                  {['Platform Launch', 'Marketing Plan'].map((board) => (
                    <li
                      key={board}
                      className="py-4 px-6 flex gap-3 items-center"
                    >
                      <BoardIcon />
                      {board}
                    </li>
                  ))}
                  <li>
                    <Button
                      variant="ghost"
                      className="p-0 w-full justify-start rounded-none rounded-r-full gap-3 h-fit px-6 py-4 data-[focus-visible=true]:outline-0 data-[focus-visible=true]:ring-2 ring-inset ring-blue-600"
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
      <NewBoardModal
        isOpen={isModalOpen}
        onOpenChange={(isOpen: boolean) =>
          setStatus(isOpen ? 'modalOpen' : 'closed')
        }
      />
    </>
  )
}
