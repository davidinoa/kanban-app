import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'
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
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={plusJakartaSans.className}
      suppressHydrationWarning
    >
      <body>
        <ClerkProvider>
          <TRPCReactProvider cookies={cookies().toString()}>
            <Providers>
              <SignedIn>
                <Toaster
                  toastOptions={{
                    className: 'dark:bg-gray-200 dark:text-white',
                  }}
                />
                <Layout>{children}</Layout>
              </SignedIn>
              <SignedOut>{children}</SignedOut>
            </Providers>
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
