import { ClerkProvider } from '@clerk/nextjs'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { cookies } from 'next/headers'
import { type PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '~/components/layout'
import '~/styles/globals.css'
import { TRPCReactProvider } from '~/trpc/react'
import Providers from './providers'

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={plusJakartaSans.className}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ClerkProvider>
          <TRPCReactProvider cookies={cookies().toString()}>
            <Providers>
              <Layout>{children}</Layout>
            </Providers>
            <Toaster
              toastOptions={{
                className: 'dark:bg-gray-200 dark:text-white',
              }}
            />
          </TRPCReactProvider>
        </ClerkProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
