'use client'

import { type PropsWithChildren } from 'react'
import Header from './header'
import Sidebar from './sidebar'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="layout-container h-[100vh] overflow-hidden">
      <Header />
      <Sidebar />
      <main className="scrollbar-hidden p4 min-w-[300px] overflow-auto bg-gray-50 dark:bg-gray-400">
        {children}
      </main>
    </div>
  )
}
