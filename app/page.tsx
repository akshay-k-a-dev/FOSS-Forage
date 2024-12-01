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
    <div className="flex flex-col items-center min-h-[100dvh]">
      <section className="w-full py-6 landscape:py-3 sm:py-12 md:py-16 lg:py-24 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center space-y-4 landscape:space-y-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 landscape:space-y-2"
            >
              <h1 className="text-3xl landscape:text-[1.75rem] font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/[1.1]">
                Welcome to the Linux Community Hub
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 text-base landscape:text-[0.9rem] sm:text-lg md:text-xl dark:text-gray-400">
                Your gateway to the world of Linux. Learn, share, and grow with our community of enthusiasts and experts.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col landscape:flex-row gap-3 landscape:gap-2 sm:flex-row sm:gap-4 mt-4 landscape:mt-2"
            >
              <Link href="/login">
                <Button 
                  size="lg" 
                  className="w-full landscape:w-auto landscape:h-9 landscape:text-[0.9rem] sm:w-auto min-w-[140px] landscape:min-w-[120px]"
                >
                  Get Started
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full landscape:w-auto landscape:h-9 landscape:text-[0.9rem] sm:w-auto min-w-[140px] landscape:min-w-[120px]"
              >
                Join Community
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section ref={ref} className="w-full py-6 landscape:py-3 sm:py-12 md:py-16 lg:py-24 bg-secondary">
        <div className="container px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 landscape:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 landscape:gap-2 sm:gap-6"
          >
            {features.map((feature, index) => (
              <Card key={index} className="bg-background landscape:min-h-0">
                <CardHeader className="space-y-2 landscape:space-y-1.5 pb-3 landscape:p-3">
                  <div className="p-2 landscape:p-1.5 w-fit rounded-lg bg-primary/10">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl landscape:text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="landscape:p-3 landscape:pt-0">
                  <CardDescription className="text-sm landscape:text-xs sm:text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}