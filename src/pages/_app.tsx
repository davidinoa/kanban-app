import { type AppType } from 'next/app'
import { api } from '~/utils/api'
import '~/styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Layout from '~/components/layout'
import { NextUIProvider } from '@nextui-org/react'

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <NextUIProvider>
        <style jsx global>
          {`
            html {
              font-family: ${plusJakartaSans.style.fontFamily};
            }
          `}
        </style>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NextUIProvider>
    </ClerkProvider>
  )
}

export default api.withTRPC(MyApp)
