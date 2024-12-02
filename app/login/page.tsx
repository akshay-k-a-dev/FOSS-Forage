"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      // Mock successful login
      toast.success('Logged in successfully!')
      router.push('/forum')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.email.includes('@') && formData.password.length >= 6

  return (
    <div className="flex flex-col items-center min-h-screen bg-background">
      <div className="flex-1 w-full flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="w-full">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={!isFormValid || loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
                <div className="text-sm text-center space-y-2">
                  <Link 
                    href="/forgot-password"
                    className="text-primary hover:underline block"
                  >
                    Forgot your password?
                  </Link>
                  <div className="text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link 
                      href="/signup"
                      className="text-primary hover:underline"
                    >
                      Create account
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
