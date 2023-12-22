import { SignIn, auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function Page() {
  const { userId } = auth()
  if (userId) redirect('/')

  return (
    <main className="grid h-[100dvh] w-screen place-content-center overflow-auto bg-purple-100/25 bg-landing-page-mobile bg-cover bg-no-repeat p-1 md:bg-landing-page-desktop md:bg-center">
      <SignIn
        afterSignUpUrl="/boards/new"
        afterSignInUrl="/"
        signUpUrl="/signup"
      />
    </main>
  )
}
