import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forum - Linux Community Hub',
  description: 'Join discussions about Linux, open source, and technology',
}

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
