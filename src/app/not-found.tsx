import { Link } from '@nextui-org/link'

export default function NotFound() {
  return (
    <div className="grid h-full place-items-center">
      <section className="flex flex-col items-center gap-4">
        <h2 className="text-2xl">Page not found</h2>
        <p className="text-gray-100">
          Sorry, we coun&apos;t find the page you&apos;re looking for.
        </p>
        <Link href="/" underline="hover" className="text-purple-100">
          Go back home
        </Link>
      </section>
    </div>
  )
}
