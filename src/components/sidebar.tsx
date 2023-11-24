'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import HideSidebarIcon from '~/assets/icon-hide-sidebar.svg'
import ShowSidebarIcon from '~/assets/icon-show-sidebar.svg'
import LogoDark from '~/assets/logo-dark.svg'
import LogoLight from '~/assets/logo-light.svg'
import { api } from '~/utils/api'
import useLayoutStore from '~/zustand/layout-store'
import BoardsNav from './boards-nav'
import Button from './button'
import NewBoardModal from './new-board-modal'
import ThemeSwitch from './theme-switch'

export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useLayoutStore()
  const { data } = api.boards.getAllNames.useQuery()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sidebarVariants = {
    open: { width: 'auto' },
    closed: { width: '0px' },
  }

  if (!data) return null

  return (
    <>
      <motion.aside
        initial="closed"
        animate={isSidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="overflow-auto dark:bg-gray-300"
      >
        <div className="hidden h-full flex-col gap-6 border-r border-sky dark:border-gray-200  md:flex md:w-[16.25rem] lg:w-[18.75rem]">
          <div className="flex h-20 flex-shrink-0 items-center px-6 lg:h-24">
            <LogoDark
              aria-label="app logo"
              className="hidden md:inline-block md:dark:hidden"
            />
            <LogoLight
              aria-label="app logo"
              className="hidden md:dark:inline-block"
            />
          </div>
          <div className="scrollbar-hidden flex grow flex-col gap-4 overflow-y-auto">
            <BoardsNav
              className="grow md:pr-5 lg:pr-6"
              onCreateBoardClick={() => setIsModalOpen(true)}
            />
            <div className="flex flex-col gap-2 pb-8">
              <div className="px-3 lg:px-6">
                <ThemeSwitch />
              </div>
              <div className="md:pr-5 lg:pr-6">
                <Button
                  variant="ghost"
                  className="group w-full justify-start gap-3 rounded-none rounded-r-full p-0 px-6 py-4 text-gray-100 hover:bg-purple-100/10 hover:text-purple-100 focus-visible:bg-purple-100/10 focus-visible:text-purple-100 lg:px-8 lg:text-base"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <HideSidebarIcon className="group-hover:[&_path]:fill-purple-100 group-focus-visible:[&_path]:fill-purple-100" />
                  Hide Sidebar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      <NewBoardModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />

      <Button
        variant="primary"
        aria-label="show sidebar"
        className={`absolute bottom-8 z-30 hidden rounded-l-none rounded-r-full p-5 md:block ${
          isSidebarOpen ? 'md:hidden' : ''
        }`}
        onClick={() => setIsSidebarOpen(true)}
      >
        <ShowSidebarIcon />
      </Button>
    </>
  )
}
