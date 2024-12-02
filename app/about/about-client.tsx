"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from 'next/link'
import { StatsSection } from '@/components/stats-section'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function AboutPageClient() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div className="container py-8 px-4 md:py-12 md:px-6 lg:px-8 xl:px-10 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 md:mb-16"
      >
        <Badge className="mb-4" variant="secondary">Est. 2024</Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">About Linux Community Hub</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
          We are a community-driven platform dedicated to making Linux accessible, 
          enjoyable, and rewarding for everyone - from beginners to experts.
        </p>
      </motion.div>

      {/* Stats Section */}
      <StatsSection />

      <motion.div 
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="prose dark:prose-invert max-w-none"
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-8 text-base md:text-lg">
          To create an inclusive, supportive environment where Linux enthusiasts can learn, 
          share knowledge, and collaborate on open-source projects. We believe in the power 
          of community-driven learning and the importance of making Linux expertise accessible to all.
        </p>

        {/* Values Section */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-12">
          <div className="transform transition-transform hover:scale-105">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Inclusivity</h3>
              <p className="text-muted-foreground">We welcome everyone regardless of their experience level or background.</p>
            </div>
          </div>
          <div className="transform transition-transform hover:scale-105">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Knowledge Sharing</h3>
              <p className="text-muted-foreground">We believe in freely sharing knowledge and helping others learn.</p>
            </div>
          </div>
          <div className="transform transition-transform hover:scale-105">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">We encourage creative solutions and embrace new technologies.</p>
            </div>
          </div>
          <div className="transform transition-transform hover:scale-105">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Open Source</h3>
              <p className="text-muted-foreground">We're committed to the open source philosophy and transparency.</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/20 p-6 md:p-8 lg:p-10 rounded-lg text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Join Our Community</h2>
          <p className="mb-6 text-base md:text-lg max-w-3xl mx-auto">
            Whether you're taking your first steps with Linux or you're a seasoned expert, 
            there's a place for you in our community. Join us today and be part of something special.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="text-lg font-semibold w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/forum">
              <Button size="lg" variant="outline" className="text-lg font-semibold w-full sm:w-auto">
                Join Community
              </Button>
            </Link>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Open Source</h2>
        <p className="mb-8 text-base md:text-lg">
          We believe in the power of open source software. Our platform is built on transparency 
          and community collaboration. You can contribute to our platform's development 
          and help us improve the experience for everyone.
        </p>
      </motion.div>
    </div>
  )
}
