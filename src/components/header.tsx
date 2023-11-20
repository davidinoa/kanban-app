import { Divider } from '@nextui-org/divider'
import VerticalEllipsisIcon from '../assets/icon-vertical-ellipsis.svg'
import LogoDark from '../assets/logo-dark.svg'
import LogoMobile from '../assets/logo-mobile.svg'
import Button from './button'
import NavPopover from './nav-popover'

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
      <NavPopover />
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
