import { ClerkProvider } from '@clerk/nextjs'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { type ReactNode } from 'react'
import Layout from '~/components/layout'
import '~/styles/globals.css'
import Providers from './providers'

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={plusJakartaSans.className}>
        <body>
          <Providers>
            <Layout>{children}</Layout>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
