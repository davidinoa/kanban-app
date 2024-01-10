/* eslint-disable @typescript-eslint/no-floating-promises */

'use client'

import { useSignIn } from '@clerk/clerk-react'
import { useEffect } from 'react'

export default function DemoSignInButton() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const isLoading = !isLoaded || !signIn

  useEffect(() => {
    if (isLoading || !setActive) return
    signIn
      .create({
        identifier: process.env.NEXT_PUBLIC_DEMO_EMAIL,
        password: process.env.NEXT_PUBLIC_DEMO_PASSWORD,
      })
      .then((result) => {
        if (result.status === 'complete') {
          setActive({ session: result.createdSessionId })
        }
      })
  }, [isLoading, setActive, signIn])

  return 'Loading...'
}
