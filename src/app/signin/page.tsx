import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <main className="bg-landing-page-mobile md:bg-landing-page-desktop grid h-screen w-screen place-content-center overflow-auto bg-purple-100/25 bg-cover bg-no-repeat p-8 md:bg-center">
      <SignIn
        afterSignUpUrl="/boards/new"
        afterSignInUrl="/"
        signUpUrl="/signup"
        appearance={{
          elements: {
            footerActionLink: {},
          },
        }}
      />
    </main>
  )
}
