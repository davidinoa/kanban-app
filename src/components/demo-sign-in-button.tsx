'use client'

import { useSignIn } from '@clerk/clerk-react'
import Button from './button'

export default function DemoSignInButton() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const isLoading = !isLoaded || !signIn
  if (isLoading || !setActive) return null

  return (
    <Button
      size="large"
      variant="secondary"
      className="px-12"
      isLoading={isLoading}
      isDisabled={isLoading}
      onPress={async () => {
        if (signIn.id) window.location.href = '/'
        try {
          await signIn
            .create({
              identifier: process.env.NEXT_PUBLIC_DEMO_EMAIL,
              password: process.env.NEXT_PUBLIC_DEMO_PASSWORD,
            })
            .then((result) => {
              if (result.status === 'complete') {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                setActive({ session: result.createdSessionId })
              }
            })
        } catch (error) {
          console.error(error)
          window.location.href = '/'
        }
        return null
      }}
    >
      Demo
    </Button>
  )
}
