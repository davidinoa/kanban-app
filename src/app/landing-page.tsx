'use client'

import { Link } from '@nextui-org/link'
import Image from 'next/image'
import LogoLight from '~/assets/logo-light.svg'
import screenshot1 from '~/assets/screenshot-1.png'
import screenshot2 from '~/assets/screenshot-2.png'
import Button from '~/components/button'

export default function LandingPage() {
  return (
    <div className="flex h-[100dvh] w-screen flex-col overflow-auto bg-purple-100/25 bg-landing-page-mobile bg-cover bg-no-repeat p-8 md:bg-landing-page-desktop md:bg-center">
      <header className="mb-8">
        <LogoLight />
      </header>
      <main className="m-auto grid min-w-fit max-w-5xl grow grid-rows-[auto,1fr] place-items-center text-white md:grid-cols-2 md:grid-rows-1 md:gap-16">
        <div className="relative w-[210px] pb-10 pr-10 md:w-full md:pb-20 md:pr-20">
          <Image
            priority
            src={screenshot1}
            alt="screenhot of the app in large viewport and light mode"
            className="max-h-[80%] w-auto rounded-xl"
          />
          <Image
            priority
            src={screenshot2}
            alt="screenshot of the app in mobile viewport and dark mode"
            className="absolute bottom-0 right-0 h-3/4 w-auto rounded-xl"
          />
        </div>
        <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
          <h1 className="text-2xl font-bold leading-normal md:text-4xl">
            Simplify the way you manage your tasks
          </h1>
          <p className="leading-normal md:text-lg">
            Kanban revolutionizes task management through minimalist design and
            intuitive functionality. Embrace simplicity, where your productivity
            is enhanced, not overwhelmed.
          </p>
          <div className="flex gap-4">
            <Button size="large" className="px-12" as={Link} href="/sign-in">
              Sign in
            </Button>
            {/* <DemoSignInButton /> */}
          </div>
        </div>
      </main>
    </div>
  )
}
