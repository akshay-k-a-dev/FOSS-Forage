import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Campus Chapters - Linux Community Hub',
  description: 'Join our campus chapter program',
}

export default function CampusPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Campus Chapters</h1>
        <div className="space-y-4">
          <p className="text-xl text-muted-foreground">
            This page is under construction. We're not ready yet to accept campus chapters.
          </p>
          <p className="text-lg text-muted-foreground">
            In the meantime, you can explore our community and get involved!
          </p>
        </div>
        <div className="pt-8">
          <Button asChild size="lg">
            <Link href="/forum">
              Explore Our Community
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
