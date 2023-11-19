import LogoDark from '../assets/logo-dark.svg'
import { Divider } from '@nextui-org/divider'
import Button from './button'
import VerticalEllipsisIcon from '../assets/icon-vertical-ellipsis.svg'

export default function Header() {
  return (
    <header className="flex h-[96px] items-center gap-8 border border-solid border-sky px-4">
      <LogoDark aria-label="Kanban app logo" />
      <Divider orientation="vertical" className="bg-sky" />
      <h1 className="grow text-2xl font-bold leading-tight">Platform Launch</h1>
      <div className="flex items-center gap-1">
        <Button disabled size="large">
          + Add New Task
        </Button>
        <Button variant="icon" aria-label="Board options">
          <VerticalEllipsisIcon />
        </Button>
      </div>
    </header>
  )
}
