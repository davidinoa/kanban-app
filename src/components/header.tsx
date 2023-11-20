import LogoDark from '../assets/logo-dark.svg'
import { Divider } from '@nextui-org/divider'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import Button from './button'
import VerticalEllipsisIcon from '../assets/icon-vertical-ellipsis.svg'
import LogoMobile from '../assets/logo-mobile.svg'
import ThemeSwitch from './theme-switch'

export default function Header() {
  return (
    <header className="flex h-16 items-center gap-4 border border-solid border-sky px-4 sm:h-20 sm:gap-6 sm:px-6 sm:pr-2 lg:h-14 lg:gap-8">
      <LogoDark
        aria-label="Kanban app logo"
        className="hidden sm:inline-block"
      />
      <LogoMobile aria-label="Kanban app logo" className="sm:hidden" />
      <Divider orientation="vertical" className="hidden bg-sky sm:block" />
      <h1 className="hidden grow font-bold leading-tight sm:block sm:text-xl lg:text-2xl">
        Platform Launch
      </h1>
      <Popover>
        <PopoverTrigger>
          <h1 className="text-md grow font-bold leading-tight">
            Platform Launch
          </h1>
        </PopoverTrigger>
        <PopoverContent className="w-[16.5rem] rounded-xl p-4 dark:bg-gray-300">
          <ThemeSwitch />
        </PopoverContent>
      </Popover>
      <div className="flex items-center gap-1">
        <Button disabled size="large" className="hidden px-6 sm:inline-block">
          + Add New Task
        </Button>
        <Button variant="icon" aria-label="Board options">
          <VerticalEllipsisIcon />
        </Button>
      </div>
    </header>
  )
}
