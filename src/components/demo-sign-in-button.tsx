import { useSignIn } from '@clerk/clerk-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Button from './button'

export default function DemoSignInButton() {
  const router = useRouter()
  const { signIn, setActive, isLoaded } = useSignIn()
  const isLoading = !isLoaded || !signIn

  return (
    <Button
      size="large"
      variant="secondary"
      className="px-12"
      isLoading={isLoading}
      isDisabled={isLoading}
      onPress={() => {
        signIn!
          .create({
            identifier: process.env.NEXT_PUBLIC_DEMO_EMAIL,
            password: process.env.NEXT_PUBLIC_DEMO_PASSWORD,
          })
          .then((result) => {
            if (result.status === 'complete') {
              setActive!({ session: result.createdSessionId }).catch(() =>
                toast.error('Failed to sign in'),
              )
            }
          })
          .then(() => router.push('/'))
          .catch(() => toast.error('Failed to sign in'))
      }}
    >
      Demo
    </Button>
  )
}
