'use client'

import { motion } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import HideSidebarIcon from '~/assets/icon-hide-sidebar.svg'
import ShowSidebarIcon from '~/assets/icon-show-sidebar.svg'
import LogoDark from '~/assets/logo-dark.svg'
import LogoLight from '~/assets/logo-light.svg'
import { api } from '~/utils/api'
import BoardsNav from './boards-nav'
import Button from './button'
import CreateEditBoardModal from './modals/create-edit-board-modal'
import ThemeSwitch from './theme-switch'

export default function Sidebar() {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()
  const isModalOpen = searchParams.get('creatingBoard') === 'true'
  const isSidebarOpen = searchParams.get('sidebar') === 'true'
  const sidebarStatus = isSidebarOpen ? 'open' : 'closed'

  const { data } = api.boards.getAllNames.useQuery(undefined, {
    staleTime: Infinity,
  })

  const sidebarVariants = {
    open: { width: 'auto', display: 'block' },
    closed: { width: '0px', display: 'none' },
  }

  function toggleModal() {
    const params = new URLSearchParams(searchParams)
    if (params.get('creatingBoard')) {
      params.delete('creatingBoard')
    } else {
      params.set('creatingBoard', 'true')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  function toggleSidebar() {
    const params = new URLSearchParams(searchParams)
    if (params.get('sidebar')) {
      params.delete('sidebar')
    } else {
      params.set('sidebar', 'true')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  if (!data) return null

  return (
    <>
      <motion.aside
        initial={sidebarStatus}
        animate={sidebarStatus}
        variants={sidebarVariants}
        className="overflow-auto overflow-x-hidden bg-white dark:bg-gray-300"
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
              onCreateBoardClick={toggleModal}
            />
            <div className="flex flex-col gap-2 pb-8">
              <div className="px-3 lg:px-6">
                <ThemeSwitch />
              </div>
              <div className="md:pr-5 lg:pr-6">
                <Button
                  variant="ghost"
                  className="group w-full justify-start gap-3 rounded-none rounded-r-full p-0 px-6 py-4 text-gray-100 hover:bg-purple-100/10 hover:text-purple-100 focus-visible:bg-purple-100/10 focus-visible:text-purple-100 dark:hover:bg-purple-100/10 lg:px-8 lg:text-base "
                  onPress={toggleSidebar}
                >
                  <HideSidebarIcon className="group-hover:[&_path]:fill-purple-100 group-focus-visible:[&_path]:fill-purple-100" />
                  Hide Sidebar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      <CreateEditBoardModal
        mode="create"
        isOpen={isModalOpen}
        onOpenChange={toggleModal}
      />

      <Button
        variant="primary"
        aria-label="show sidebar"
        className={`absolute bottom-8 z-30 hidden rounded-l-none rounded-r-full p-5 md:block ${
          isSidebarOpen ? 'md:hidden' : ''
        }`}
        onPress={toggleSidebar}
      >
        <ShowSidebarIcon />
      </Button>
    </>
  )
}
