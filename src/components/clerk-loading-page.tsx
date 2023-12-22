import { Spinner } from '@nextui-org/spinner'

export default function ClerkLoadingPage() {
  return (
    <main className="grid h-[100dvh] w-screen place-content-center overflow-auto bg-purple-100/25 bg-landing-page-mobile bg-cover bg-no-repeat p-8 md:bg-landing-page-desktop md:bg-center">
      <Spinner
        classNames={{
          circle1: 'border-b-purple-100',
          circle2: 'border-b-purple-100',
        }}
      />
    </main>
  )
}
