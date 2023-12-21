import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <main className="bg-landing-page-mobile md:bg-landing-page-desktop grid h-screen w-screen place-content-center overflow-auto bg-purple-100/25 bg-cover bg-no-repeat p-8 md:bg-center">
      <SignUp
        afterSignUpUrl="/boards/new"
        signInUrl="/signin"
        appearance={{
          elements: {
            footerActionLink: {},
          },
        }}
      />
    </main>
  )
}
