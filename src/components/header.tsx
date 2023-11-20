import { Divider } from '@nextui-org/divider'
import AddTaskIcon from '~/assets/icon-add-task-mobile.svg'
import VerticalEllipsisIcon from '~/assets/icon-vertical-ellipsis.svg'
import LogoDark from '~/assets/logo-dark.svg'
import LogoLight from '~/assets/logo-light.svg'
import LogoMobile from '~/assets/logo-mobile.svg'
import Button from './button'
import NavPopover from './nav-popover'

export default function Header() {
  return (
    <header className="flex h-16 items-center gap-2 px-4 md:h-20 md:gap-6 md:px-6 md:pr-4 pr-2 lg:h-24 lg:gap-8 dark:bg-gray-300 border-b-1 min-w-fit border-sky dark:border-gray-200">
      <LogoDark
        aria-label="App logo"
        className="hidden md:dark:hidden md:inline-block"
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
      <h1 className="hidden grow font-bold leading-tight md:block md:text-xl lg:text-2xl">
        Platform Launch
      </h1>
      <NavPopover />
      <div className="flex items-center gap-2 md:gap-4">
        <Button disabled size="large" className="hidden px-6 md:inline-block">
          + Add New Task
        </Button>
        <Button className="px-5 py-2.5 md:hidden">
          <AddTaskIcon />
        </Button>
        <Button variant="icon" aria-label="Board options" className="p-2">
          <VerticalEllipsisIcon
            height={16}
            viewBox="0 0 5 20"
            className="md:hidden"
          />
          <VerticalEllipsisIcon
            viewBox="0 0 5 20"
            className="hidden md:block"
          />
        </Button>
      </div>
    </header>
  )
}
