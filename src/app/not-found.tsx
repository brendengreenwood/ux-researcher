import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-xl font-semibold mb-4">Not Found</h2>
      <p className="text-muted-foreground mb-4">Could not find the requested resource</p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
      >
        Go Home
      </Link>
    </div>
  )
}
