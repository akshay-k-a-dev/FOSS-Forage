import SignupForm from '@/components/auth/signup-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - Linux Community Hub',
  description: 'Create your account and join our Linux community',
}

export default function SignupPage() {
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4 md:py-12">
      <SignupForm />
    </div>
  )
}
