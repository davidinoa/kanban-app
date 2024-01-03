import {
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { cookies } from 'next/headers'
import { type PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'
import ClerkLoadingPage from '~/components/clerk-loading-page'
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
        <ClerkProvider afterSignInUrl="/">
          <TRPCReactProvider cookies={cookies().toString()}>
            <Providers>
              <SignedIn>
                <Layout>{children}</Layout>
              </SignedIn>
            </Providers>
            <SignedOut>
              <ClerkLoading>
                <ClerkLoadingPage />
              </ClerkLoading>
              <ClerkLoaded>{children}</ClerkLoaded>
            </SignedOut>
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
