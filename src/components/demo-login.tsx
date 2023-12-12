'use client'

import { useSignIn } from '@clerk/clerk-react'
import { Spinner } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

function DemoLogin() {
  const router = useRouter()
  const { signIn, setActive, isLoaded } = useSignIn()

  useEffect(() => {
    if (!isLoaded || !signIn) return

    signIn
      .create({
        identifier: process.env.NEXT_PUBLIC_DEMO_EMAIL,
        password: process.env.NEXT_PUBLIC_DEMO_PASSWORD,
      })
      .then((result) => {
        if (result.status === 'complete') {
          setActive({ session: result.createdSessionId }).catch(() =>
            toast.error('Failed to sign in'),
          )
        }
      })
      .then(() => router.push('/'))
      .catch(() => toast.error('Failed to sign in'))
  }, [setActive, signIn, isLoaded, router])

  return (
    <div className="place-items-centers grid h-full w-full">
      <Spinner
        classNames={{
          circle1: 'border-b-purple-100',
          circle2: 'border-b-purple-100',
        }}
      />
    </div>
  )
}

export default DemoLogin
