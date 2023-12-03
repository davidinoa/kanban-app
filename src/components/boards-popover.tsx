'use client'

import { Button } from '@nextui-org/button'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { useState } from 'react'
import ChevronDownIcon from '~/assets/icon-chevron-down.svg'
import ChevronUpIcon from '~/assets/icon-chevron-up.svg'
import BoardsNav from './boards-nav'
import CreateEditBoardModal from './modals/create-edit-board-modal'
import ThemeSwitch from './theme-switch'

type Status = 'closed' | 'popoverOpen' | 'modalOpen'

type BoardPopoverProps = {
  currentBoardName: string
}

export default function BoardsPopover({ currentBoardName }: BoardPopoverProps) {
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
        <PopoverTrigger className="mr-auto md:hidden">
          <Button className="flex items-center gap-2 rounded-lg bg-transparent p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-200">
            <h1 className="truncate text-lg font-bold leading-tight">
              {currentBoardName}
            </h1>
            {isPopoverOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="group w-[16.5rem] items-start rounded-lg px-0 py-4 dark:bg-gray-300">
          <BoardsNav onCreateBoardClick={() => setStatus('modalOpen')} />
          <div className="w-full p-4">
            <ThemeSwitch />
          </div>
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
