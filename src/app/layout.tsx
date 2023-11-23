import { ClerkProvider } from '@clerk/nextjs'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { cookies } from 'next/headers'
import { type ReactNode } from 'react'
import Layout from '~/components/layout'
import '~/styles/globals.css'
import { TRPCReactProvider } from '~/trpc/react'
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
      <TRPCReactProvider cookies={cookies().toString()}>
        <html lang="en" className={plusJakartaSans.className}>
          <body>
            <Providers>
              <Layout>{children}</Layout>
            </Providers>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  )
}
