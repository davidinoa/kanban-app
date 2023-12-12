declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
      CLERK_SECRET_KEY: string
      NEXT_PUBLIC_DEMO_EMAIL: string
      NEXT_PUBLIC_DEMO_PASSWORD: string
    }
  }
}

export {}
