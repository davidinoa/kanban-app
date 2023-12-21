import { Spinner } from '@nextui-org/spinner'

export default function ClerkLoadingPage() {
  return (
    <main className="bg-landing-page-mobile md:bg-landing-page-desktop grid h-screen w-screen place-content-center overflow-auto bg-purple-100/25 bg-cover bg-no-repeat p-8 md:bg-center">
      <Spinner
        classNames={{
          circle1: 'border-b-purple-100',
          circle2: 'border-b-purple-100',
        }}
      />
    </main>
  )
}
