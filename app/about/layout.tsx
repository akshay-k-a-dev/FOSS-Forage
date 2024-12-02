import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Linux Community Hub',
  description: 'Learn about our mission to build a thriving Linux community',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
