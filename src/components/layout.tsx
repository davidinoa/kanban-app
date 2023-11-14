import { type PropsWithChildren } from 'react'
import Logo from '../assets/logo-light.svg'
import { Divider } from '@nextui-org/react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="layout-container h-[100svh]">
      <header className="flex h-[96px] items-center gap-4 bg-slate-200 px-4">
        <Logo aria-label="Kanban app logo" />
        <Divider orientation="vertical" />
        <h1 className="grow">Platform Launch</h1>
        <button>add new task</button>
        <div>more icon</div>
      </header>
      <aside className="hidden bg-slate-50 sm:w-[260px] lg:w-[300px]">
        sidebar goes here
      </aside>
      <main className="bg-slate-400">{children}</main>
    </div>
  )
}
