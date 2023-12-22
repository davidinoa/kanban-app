import { useSignIn } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
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
      onPress={() => {
        signIn
          .create({
            redirectUrl: '/boards',
            identifier: process.env.NEXT_PUBLIC_DEMO_EMAIL,
            password: process.env.NEXT_PUBLIC_DEMO_PASSWORD,
          })
          .then(async (result) => {
            if (result.status !== 'complete') throw new Error()
            await setActive({ session: result.createdSessionId })
          })
          .catch(() => toast.error('Failed to sign in'))
      }}
    >
      Demo
    </Button>
  )
}
