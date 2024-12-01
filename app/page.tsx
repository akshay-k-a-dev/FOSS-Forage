"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Terminal, Users, BookOpen, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      icon: <Terminal className="h-8 w-8" />,
      title: "Learn Linux",
      description: "Comprehensive tutorials and guides for beginners to advanced users.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Join the Community",
      description: "Connect with fellow Linux enthusiasts and share your knowledge.",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Resources",
      description: "Access curated resources, documentation, and best practices.",
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Discussion Forum",
      description: "Engage in discussions, ask questions, and help others.",
    },
  ]

  return (
    <div className="flex flex-col items-center min-h-screen bg-background">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center max-w-[800px]"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to the Linux Community Hub
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-lg sm:text-xl md:text-2xl">
              Your gateway to the world of Linux. Learn, share, and grow with our community of enthusiasts and experts.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4 min-w-[200px]"
            >
              <Link href="/login" className="w-full sm:w-auto">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto text-lg font-semibold"
                >
                  Get Started
                </Button>
              </Link>
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg font-semibold"
              >
                Join Community
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section ref={ref} className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border-2 hover:border-primary/20 transition-all duration-200">
                <CardHeader className="space-y-2">
                  <div className="p-2 w-fit rounded-xl bg-primary/10">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}