import { type PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="layout-container h-[100svh]">
      <header className="h-[96px] bg-slate-200">header goes here</header>
      <aside className="hiddenbg-slate-50 sm:block sm:w-[260px] lg:w-[300px]">
        sidebar goes here
      </aside>
      <main className="bg-slate-400">{children}</main>
    </div>
  )
}
