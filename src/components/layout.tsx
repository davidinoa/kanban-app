import { type PropsWithChildren } from 'react'
import Header from './header'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="layout-container dark h-[100svh] min-w-fit">
      <Header />
      <aside className="hidden bg-slate-50 sm:w-[260px] lg:w-[300px]">
        sidebar goes here
      </aside>
      <main className="bg-slate-400">{children}</main>
    </div>
  )
}
