import { type AppType } from 'next/app'
import { api } from '~/utils/api'
import '~/styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Layout from '~/components/layout'

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <style jsx global>
        {`
          html {
            font-family: ${plusJakartaSans.style.fontFamily};
          }
        `}
      </style>
      <Layout>
        <ClerkProvider {...pageProps}>
          <Component {...pageProps} />
        </ClerkProvider>
      </Layout>
    </>
  )
}

export default api.withTRPC(MyApp)
