'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { useState } from 'react'
import BoardIcon from '~/assets/icon-board.svg'
import ChevronDownIcon from '~/assets/icon-chevron-down.svg'
import ChevronUpIcon from '~/assets/icon-chevron-up.svg'
import Button from './button'
import ThemeSwitch from './theme-switch'

export default function NavPopover() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      backdrop="opaque"
      placement="bottom-start"
      offset={36}
    >
      <PopoverTrigger className="md:hidden mr-auto">
        <button className="outline-none focus-visible:ring-2 ring-offset-2 ring-blue-600 dark:ring-offset-gray-300 flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-200 rounded transition-colors">
          <h1 className="text-lg font-bold leading-tight truncate">
            Platform Launch
          </h1>
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[16.5rem] rounded-lg p-4 dark:bg-gray-300 items-start">
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
                  <li key={board} className="py-4 px-6 flex gap-3 items-center">
                    <BoardIcon />
                    {board}
                  </li>
                ))}
                <li>
                  <Button
                    variant="ghost"
                    className="p-0 w-full justify-start rounded-none rounded-r-full gap-3 h-fit px-6 py-4 data-[focus-visible=true]:outline-0 focus-visible:ring-2 ring-inset ring-blue-600"
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
  )
}
