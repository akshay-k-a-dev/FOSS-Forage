'use client'

import { Card, CardContent } from "@/components/ui/card"
import CountUp from 'react-countup'

export function StatsSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16">
      <Card className="transform transition-transform hover:scale-105">
        <CardContent className="p-4 md:p-6 text-center">
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            <CountUp end={10} duration={2.5} />+
          </div>
          <div className="text-sm md:text-base text-muted-foreground">Community Members</div>
        </CardContent>
      </Card>
      <Card className="transform transition-transform hover:scale-105">
        <CardContent className="p-4 md:p-6 text-center">
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            <CountUp end={10} duration={2.5} />+
          </div>
          <div className="text-sm md:text-base text-muted-foreground">Contributors</div>
        </CardContent>
      </Card>
      <Card className="transform transition-transform hover:scale-105">
        <CardContent className="p-4 md:p-6 text-center">
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            <CountUp end={50} duration={2.5} />+
          </div>
          <div className="text-sm md:text-base text-muted-foreground">Tutorials & Guides</div>
        </CardContent>
      </Card>
      <Card className="transform transition-transform hover:scale-105">
        <CardContent className="p-4 md:p-6 text-center">
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            <CountUp end={5} duration={2.5} />+
          </div>
          <div className="text-sm md:text-base text-muted-foreground">Campus Chapters</div>
        </CardContent>
      </Card>
    </div>
  )
}
