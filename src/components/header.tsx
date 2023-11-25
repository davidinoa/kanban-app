'use client'

import { Divider } from '@nextui-org/divider'
import AddTaskIcon from '~/assets/icon-add-task-mobile.svg'
import LogoDark from '~/assets/logo-dark.svg'
import LogoLight from '~/assets/logo-light.svg'
import LogoMobile from '~/assets/logo-mobile.svg'
import useLayoutStore from '~/zustand/layout-store'
import BoardActionsPopover from './board-actions-popover'
import BoardsPopover from './boards-popover'
import Button from './button'

export default function Header() {
  const isSidebarOpen = useLayoutStore((state) => state.isSidebarOpen)

  return (
    <header className="flex h-16 min-w-fit items-center gap-2 border-b-1 border-sky px-4 pr-2 dark:border-gray-200 dark:bg-gray-300 md:h-20 md:gap-6 md:px-6 md:pr-4 lg:h-24 lg:gap-8">
      {!isSidebarOpen && (
        <>
          <LogoDark
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
        Platform Launch
      </h1>
      <BoardsPopover />
      <div className="flex items-center gap-2 md:gap-4">
        <Button disabled size="large" className="hidden px-6 md:inline-block">
          + Add New Task
        </Button>
        <Button className="px-5 py-2.5 md:hidden">
          <AddTaskIcon />
        </Button>
        <BoardActionsPopover />
      </div>
    </header>
  )
}
