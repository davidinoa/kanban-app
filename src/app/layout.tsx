import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs'
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
          <SignedIn>
            <TRPCReactProvider cookies={cookies().toString()}>
              <Providers>
                <Toaster />
                <Layout>{children}</Layout>
              </Providers>
            </TRPCReactProvider>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </ClerkProvider>
      </body>
    </html>
  )
}
