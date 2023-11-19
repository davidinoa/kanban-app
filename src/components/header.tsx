import LogoDark from '../assets/logo-dark.svg'
import { Divider } from '@nextui-org/divider'
import Button from './button'
import VerticalEllipsisIcon from '../assets/icon-vertical-ellipsis.svg'

export default function Header() {
  return (
    <header className="flex h-[96px] items-center gap-8 border border-solid border-sky sm:gap-6 sm:px-6 sm:pr-2">
      <LogoDark aria-label="Kanban app logo" />
      <Divider orientation="vertical" className="bg-sky" />
      <h1 className="grow font-bold leading-tight md:text-xl xl:text-2xl">
        Platform Launch
      </h1>
      <div className="flex items-center gap-1">
        <Button disabled size="large" className="px-6">
          + Add New Task
        </Button>
        <Button variant="icon" aria-label="Board options">
          <VerticalEllipsisIcon />
        </Button>
      </div>
    </header>
  )
}
