import { Metadata } from 'next'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About - Linux Community Hub',
  description: 'Learn about our mission to build a thriving Linux community',
}

export default function AboutPage() {
  return (
    <div className="container py-8 px-4 md:py-12 md:px-6 lg:px-8 xl:px-10 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-16">
        <Badge className="mb-4" variant="secondary">Est. 2023</Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">About Linux Community Hub</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
          We are a community-driven platform dedicated to making Linux accessible, 
          enjoyable, and rewarding for everyone - from beginners to experts.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16">
        <Card className="transform transition-transform hover:scale-105">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">10+</div>
            <div className="text-sm md:text-base text-muted-foreground">Community Members</div>
          </CardContent>
        </Card>
        <Card className="transform transition-transform hover:scale-105">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">10+</div>
            <div className="text-sm md:text-base text-muted-foreground">Contributors</div>
          </CardContent>
        </Card>
        <Card className="transform transition-transform hover:scale-105">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Coming</div>
            <div className="text-sm md:text-base text-muted-foreground">Tutorials & Guides</div>
          </CardContent>
        </Card>
        <Card className="transform transition-transform hover:scale-105">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Soon</div>
            <div className="text-sm md:text-base text-muted-foreground">Campus Chapters</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-8 text-base md:text-lg">
          To create an inclusive, supportive environment where Linux enthusiasts can learn, 
          share knowledge, and collaborate on open-source projects. We believe in the power 
          of community-driven learning and the importance of making Linux expertise accessible to all.
        </p>

        {/* Values Section */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-12">
          <Card className="transform transition-transform hover:scale-105">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Inclusivity</h3>
              <p className="text-muted-foreground">We welcome everyone regardless of their experience level or background.</p>
            </CardContent>
          </Card>
          <Card className="transform transition-transform hover:scale-105">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Knowledge Sharing</h3>
              <p className="text-muted-foreground">We believe in freely sharing knowledge and helping others learn.</p>
            </CardContent>
          </Card>
          <Card className="transform transition-transform hover:scale-105">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">We encourage creative solutions and embrace new technologies.</p>
            </CardContent>
          </Card>
          <Card className="transform transition-transform hover:scale-105">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Open Source</h3>
              <p className="text-muted-foreground">We're committed to the open source philosophy and transparency.</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold mb-4">What We Offer</h2>
        <div className="space-y-4 mb-8">
          <div className="flex items-start bg-secondary/20 p-4 rounded-lg transform transition-transform hover:scale-105">
            <span className="font-medium mr-4 text-xl md:text-2xl">📚</span>
            <span className="text-base md:text-lg">Comprehensive tutorials and guides for all skill levels</span>
          </div>
          <div className="flex items-start bg-secondary/20 p-4 rounded-lg transform transition-transform hover:scale-105">
            <span className="font-medium mr-4 text-xl md:text-2xl">💬</span>
            <span className="text-base md:text-lg">Active discussion forums for knowledge sharing and problem-solving</span>
          </div>
          <div className="flex items-start bg-secondary/20 p-4 rounded-lg transform transition-transform hover:scale-105">
            <span className="font-medium mr-4 text-xl md:text-2xl">📰</span>
            <span className="text-base md:text-lg">Regular news updates about the Linux ecosystem</span>
          </div>
          <div className="flex items-start bg-secondary/20 p-4 rounded-lg transform transition-transform hover:scale-105">
            <span className="font-medium mr-4 text-xl md:text-2xl">🎯</span>
            <span className="text-base md:text-lg">Community events and collaborative learning opportunities</span>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="bg-secondary/20 p-6 md:p-8 lg:p-10 rounded-lg text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Join Our Community</h2>
          <p className="mb-6 text-base md:text-lg max-w-3xl mx-auto">
            Whether you're taking your first steps with Linux or you're a seasoned system 
            administrator, there's a place for you in our community. Share your knowledge, 
            learn from others, and be part of building something meaningful.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2"
            >
              Get Started
            </Link>
            <Link 
              href="/forum" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-8 py-2"
            >
              Join Community
            </Link>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Open Source</h2>
        <p className="mb-6 text-base md:text-lg">
          Just like Linux itself, our platform is open source. We believe in transparency 
          and community collaboration. You can contribute to our platform's development 
          and help us improve the experience for everyone.
        </p>
      </div>
    </div>
  )
}