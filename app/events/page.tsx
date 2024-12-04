"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar, MapPin, Ticket, Trophy } from "lucide-react";

const upcomingEvents = [
  {
    id: 1,
    title: "AI Summit 2024",
    date: "March 15, 2024",
    description: "Join industry leaders for a deep dive into the latest AI trends.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800",
    registrationLink: "/register/1",
    location: "Silicon Valley Convention Center",
    price: "$299",
  },
  {
    id: 2,
    title: "Web3 & Blockchain Workshop",
    date: "April 5, 2024",
    description: "Hands-on workshop covering blockchain fundamentals.",
    image: "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?q=80&w=800",
    registrationLink: "/register/2",
    location: "Tech Hub Downtown",
    price: "$149",
  },
  {
    id: 3,
    title: "DevOps Conference 2024",
    date: "May 20, 2024",
    description: "Learn about the latest in CI/CD and cloud infrastructure.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800",
    registrationLink: "/register/3",
    location: "Innovation Center",
    price: "$199",
  }
];

const pastEvents = [
  {
    id: 101,
    title: "Hackathon 2023",
    date: "December 10, 2023",
    description: "Over 200 developers collaborated for 48 hours.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800",
    photos: [
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800"
    ],
    highlights: "First prize: $10,000",
  },
  {
    id: 102,
    title: "Cloud Computing Summit",
    date: "November 15, 2023",
    description: "A comprehensive overview of modern cloud architecture.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800",
    photos: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800",
      "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?q=80&w=800",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800"
    ],
    highlights: "500+ attendees",
  }
];

function EventCard({ event, type }: { event: any; type: 'upcoming' | 'past' }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{event.title}</CardTitle>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{event.date}</span>
          </div>
          {type === 'upcoming' ? (
            <>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                <span>{event.price}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>{event.highlights}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">{event.description}</div>
        {type === 'upcoming' ? (
          <Button className="w-full" asChild>
            <a href={event.registrationLink}>Register Now</a>
          </Button>
        ) : (
          event.photos && (
            <div className="grid grid-cols-3 gap-2">
              {event.photos.map((photo: string, index: number) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={photo}
                    alt={`${event.title} photo ${index + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform"
                  />
                </div>
              ))}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}

export default function EventsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Events</h1>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} type="upcoming" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} type="past" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
