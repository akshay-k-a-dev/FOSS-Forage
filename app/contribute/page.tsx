"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Heart, Pencil, Users, Video } from "lucide-react";

const contributionWays = [
  {
    id: 1,
    title: "Join Developer Team",
    description: "Help us build and improve our platform. We're looking for passionate developers who want to make a difference.",
    icon: Code2,
    action: "/apply/developer",
    buttonText: "Apply Now",
  },
  {
    id: 2,
    title: "Financial Support",
    description: "Support our mission with a financial contribution. Every donation helps us maintain and improve our services.",
    icon: Heart,
    action: "https://paypal.me/akshaytmm",
    buttonText: "Donate via PayPal",
    external: true,
  },
  {
    id: 3,
    title: "Blog Writer",
    description: "Share your knowledge and insights with our community through well-crafted blog posts.",
    icon: Pencil,
    action: "/apply/writer",
    buttonText: "Become a Writer",
  },
  {
    id: 4,
    title: "Tutorial Creator/Mentor",
    description: "Create educational content and mentor others in their learning journey.",
    icon: Video,
    action: "/apply/mentor",
    buttonText: "Start Teaching",
  },
  {
    id: 5,
    title: "Community Manager",
    description: "Help us build and nurture our growing community. Moderate discussions and organize events.",
    icon: Users,
    action: "/apply/community",
    buttonText: "Join Community Team",
  },
];

function ContributionCard({ way }: { way: typeof contributionWays[0] }) {
  const Icon = way.icon;
  
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-1">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{way.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{way.description}</p>
        <Button className="w-full" asChild>
          <a 
            href={way.action}
            target={way.external ? "_blank" : undefined}
            rel={way.external ? "noopener noreferrer" : undefined}
          >
            {way.buttonText}
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ContributePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contribute to Our Community</h1>
        <p className="text-xl text-muted-foreground">
          There are many ways to contribute and make a difference. Choose the one that best matches your skills and interests.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {contributionWays.map((way) => (
          <ContributionCard key={way.id} way={way} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Have another way you'd like to contribute? {" "}
          <a 
            href="mailto:akshayka@mamocollege.org" 
            className="text-primary hover:underline"
          >
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
