'use client'

import { Divider } from '@nextui-org/divider'
import { useState } from 'react'
import AddTaskIcon from '~/assets/icon-add-task-mobile.svg'
import LogoDark from '~/assets/logo-dark.svg'
import LogoLight from '~/assets/logo-light.svg'
import LogoMobile from '~/assets/logo-mobile.svg'
import useAppStore from '~/zustand/app-store'
import BoardActionsPopover from './board-actions-popover'
import BoardsPopover from './boards-popover'
import Button from './button'
import CreateEditTaskModal from './modals/create-edit-task-modal'

export default function Header() {
  const board = useAppStore((state) => state.currentBoard)
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  if (!board) return null

  return (
    <header className="z-40 flex h-16 min-w-fit items-center gap-2 border-b-1 border-sky px-4 pr-2 dark:border-gray-200 dark:bg-gray-300 md:h-20 md:gap-6 md:px-6 md:pr-4 lg:h-24 lg:gap-8">
      {!isSidebarOpen && (
        <>
          <LogoDark
            suppressHydrationWarning
            aria-label="App logo"
            className="hidden md:inline-block md:dark:hidden"
          />
          <LogoLight
            aria-label="App logo"
            className="hidden md:dark:inline-block"
          />
          <LogoMobile aria-label="App logo" className="md:hidden" />
          <Divider
            orientation="vertical"
            className="hidden bg-sky dark:bg-gray-200 md:block"
          />
        </>
      )}
      <h1 className="hidden grow font-bold leading-tight md:block md:text-xl lg:text-2xl">
        {board?.name}
      </h1>
      <BoardsPopover currentBoardName={board.name} />
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          size="large"
          disabled={!board}
          className="hidden px-6 md:inline-block"
          onClick={() => setIsTaskModalOpen(true)}
        >
          + Add New Task
        </Button>
        <Button
          aria-label="add new task"
          disabled={!board}
          className="px-5 py-2.5 md:hidden"
          onClick={() => setIsTaskModalOpen(true)}
        >
          <AddTaskIcon />
        </Button>
        <CreateEditTaskModal
          mode="create"
          isOpen={isTaskModalOpen}
          onOpenChange={(isOpen) => setIsTaskModalOpen(isOpen)}
        />
        <BoardActionsPopover />
      </div>
    </header>
  )
}
