import Link from 'next/link'
import { Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container max-w-screen-2xl mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row md:py-8">
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <p className="text-sm leading-loose text-muted-foreground">
              Built by{" "}
              <Link
                href="https://github.com/akshay-k-a-dev/THELINUXCOMMUNITYHUB.ORG"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                The Linux Community Hub
              </Link>
              . The source code is available on{" "}
              <Link
                href="https://github.com/akshay-k-a-dev/THELINUXCOMMUNITYHUB.ORG"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                GitHub
              </Link>
              .
            </p>
          </div>
          <div className="flex items-center">
            <Link
              href="https://github.com/akshay-k-a-dev/THELINUXCOMMUNITYHUB.ORG"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}