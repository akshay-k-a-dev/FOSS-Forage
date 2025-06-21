"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Ticket, Trophy, Users } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  image?: string;
  maxAttendees?: number;
  registrations: string;
  status: string;
}

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const [upcomingResponse, pastResponse] = await Promise.all([
        fetch('/api/events?type=upcoming'),
        fetch('/api/events?type=past')
      ]);

      const upcomingData = await upcomingResponse.json();
      const pastData = await pastResponse.json();

      if (upcomingData.success) {
        setUpcomingEvents(upcomingData.data || []);
      }

      if (pastData.success) {
        setPastEvents(pastData.data || []);
      }

      if (!upcomingData.success && !pastData.success) {
        setError('Failed to load events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRegistrationCount = (registrations: string) => {
    try {
      const regs = JSON.parse(registrations || '[]');
      return Array.isArray(regs) ? regs.length : 0;
    } catch {
      return 0;
    }
  };

  function EventCard({ event, type }: { event: Event; type: 'upcoming' | 'past' }) {
    const registrationCount = getRegistrationCount(event.registrations);

    return (
      <Card className="overflow-hidden">
        {event.image && (
          <div className="relative h-48 w-full">
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-xl">{event.title}</CardTitle>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(event.startDate)}</span>
            </div>
            {type === 'upcoming' ? (
              <>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.isOnline ? 'Online Event' : event.location || 'Location TBA'}</span>
                </div>
                {event.maxAttendees && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{registrationCount}/{event.maxAttendees} registered</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>{registrationCount} attendees</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">{event.description}</div>
          {type === 'upcoming' ? (
            <Button className="w-full">
              {event.isOnline ? 'Join Online' : 'Register Now'}
            </Button>
          ) : (
            <div className="text-center">
              <span className="text-sm text-muted-foreground">Event Completed</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (loading) {
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
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">Events</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Events</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchEvents} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Events</h1>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nothing to show yet</h3>
              <p className="text-muted-foreground">
                No upcoming events are scheduled at the moment. Check back later!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} type="upcoming" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nothing to show yet</h3>
              <p className="text-muted-foreground">
                No past events to display. Check back after we host some events!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} type="past" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}