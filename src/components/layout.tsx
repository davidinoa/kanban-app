import { type PropsWithChildren } from 'react'
import Header from './header'
import Sidebar from './sidebar'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="layout-container max-h-[100svh]">
      <Header />
      <Sidebar />
      <main className="scrollbar-hidden overflow-auto bg-gray-400">
        <div className="h-[2600px] w-[3000px]">{children}</div>
      </main>
    </div>
  )
}
