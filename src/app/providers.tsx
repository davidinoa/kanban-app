'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false}>
      <NextUIProvider>{children}</NextUIProvider>
    </ThemeProvider>
  )
}
