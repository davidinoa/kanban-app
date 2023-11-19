'use client'

import { type PropsWithChildren } from 'react'
import LogoDark from '../assets/logo-dark.svg'
import { Divider } from '@nextui-org/divider'
import Button from './button'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="layout-container dark h-[100svh] min-w-fit">
      <header className="flex h-[96px] items-center gap-6 border border-solid border-sky px-4">
        <LogoDark aria-label="Kanban app logo" />
        <Divider orientation="vertical" className="bg-sky" />
        <h1 className="grow text-2xl font-bold leading-tight">
          Platform Launch
        </h1>
        <Button disabled size="large">
          + Add New Task
        </Button>
        <div></div>
      </header>
      <aside className="hidden bg-slate-50 sm:w-[260px] lg:w-[300px]">
        sidebar goes here
      </aside>
      <main className="bg-slate-400">{children}</main>
    </div>
  )
}
