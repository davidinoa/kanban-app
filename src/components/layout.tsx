import dynamic from 'next/dynamic'
import { type PropsWithChildren } from 'react'
import Sidebar from './sidebar'

const Header = dynamic(() => import('./header'), { ssr: false })

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="layout-container max-h-[100svh]">
      <Header />
      <Sidebar />
      <main className="scrollbar-hidden min-w-[300px] overflow-auto bg-gray-400">
        <div className="h-[2600px] w-[3000px]">{children}</div>
      </main>
    </div>
  )
}
