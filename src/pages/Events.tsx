import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Bell
} from "lucide-react";

const upcomingEvents = [
  {
    id: 1,
    title: "Youth Innovation Summit 2024",
    date: "March 15-17, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Accra International Conference Centre",
    description: "Our flagship annual event where students from across Ghana showcase their innovative solutions to community challenges. Join us for three days of inspiration, learning, and networking.",
    type: "Summit",
    attendees: 500,
    featured: true,
  },
  {
    id: 2,
    title: "STEM Career Fair",
    date: "April 8, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "University of Ghana, Legon",
    description: "Connect with leading tech companies, universities, and professionals. Explore career opportunities in science, technology, engineering, and mathematics.",
    type: "Career Fair",
    attendees: 300,
    featured: true,
  },
  {
    id: 3,
    title: "Creative Minds Workshop",
    date: "April 22, 2024",
    time: "9:00 AM - 3:00 PM",
    location: "Kumasi Technical Institute",
    description: "A hands-on workshop where students explore creativity through art, design, and storytelling. No prior experience required.",
    type: "Workshop",
    attendees: 50,
    featured: false,
  },
  {
    id: 4,
    title: "Leadership Bootcamp",
    date: "May 5-6, 2024",
    time: "8:00 AM - 6:00 PM",
    location: "Cape Coast Hospitality Centre",
    description: "An intensive two-day program focused on developing leadership skills, public speaking, and team management abilities.",
    type: "Bootcamp",
    attendees: 40,
    featured: false,
  },
  {
    id: 5,
    title: "Environmental Action Day",
    date: "May 20, 2024",
    time: "7:00 AM - 1:00 PM",
    location: "Various locations nationwide",
    description: "Join students across Ghana in community clean-up activities, tree planting, and environmental awareness campaigns.",
    type: "Community Event",
    attendees: 1000,
    featured: true,
  },
];

const pastEvents = [
  {
    title: "Innovation Summit 2023",
    date: "March 2023",
    attendees: 450,
    highlights: "Over 100 student projects showcased",
  },
  {
    title: "STEM Workshop Series",
    date: "January - December 2023",
    attendees: 800,
    highlights: "20 workshops across 10 regions",
  },
  {
    title: "Girls in Tech Conference",
    date: "October 2023",
    attendees: 200,
    highlights: "Special focus on female students in technology",
  },
];

export default function Events() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-28">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
              Events
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80">
              Join us at our upcoming events and be part of the movement 
              empowering Ghana's next generation.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" className="w-full">
            <path d="M0 100V50C240 16.67 480 0 720 0C960 0 1200 16.67 1440 50V100H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                Upcoming
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
                Featured Events
              </h2>
            </div>
          </div>
          
          <div className="grid gap-8">
            {upcomingEvents.filter(e => e.featured).map((event) => (
              <div
                key={event.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-300 hover:shadow-xl lg:grid lg:grid-cols-3"
              >
                <div className="bg-gradient-hero p-6 text-primary-foreground lg:p-8">
                  <span className="inline-block rounded-full bg-primary-foreground/20 px-3 py-1 text-sm font-medium">
                    {event.type}
                  </span>
                  <h3 className="mt-4 font-heading text-2xl font-bold lg:text-3xl">
                    {event.title}
                  </h3>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 lg:col-span-2 lg:p-8">
                  <p className="text-muted-foreground">
                    {event.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Expected attendance: {event.attendees}+ participants</span>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="primary-gradient" asChild>
                      <Link to="/contact">Register Interest</Link>
                    </Button>
                    <Button variant="outline">
                      <Bell className="mr-2 h-4 w-4" />
                      Get Reminder
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Upcoming Events */}
      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <h2 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
            All Upcoming Events
          </h2>
          
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="group rounded-2xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                  {event.type}
                </span>
                <h3 className="mt-3 font-heading text-xl font-bold text-foreground">
                  {event.title}
                </h3>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <Button variant="ghost" className="mt-4 -ml-3" asChild>
                  <Link to="/contact" className="flex items-center gap-2">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <h2 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
            Past Events
          </h2>
          <p className="mt-2 text-muted-foreground">
            A look back at some of our successful events.
          </p>
          
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <div
                key={event.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-md"
              >
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-primary">{event.date}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees} attendees</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  ✨ {event.highlights}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host Event CTA */}
      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <div className="rounded-3xl bg-gradient-hero p-8 lg:p-16">
            <div className="mx-auto max-w-3xl text-center">
              <Calendar className="mx-auto h-16 w-16 text-primary-foreground" />
              <h2 className="mt-6 font-heading text-3xl font-bold text-primary-foreground lg:text-4xl">
                Host an Event With Us
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Partner with Edans Impact to bring our programs and events to your community or institution.
              </p>
              <Button variant="hero" size="lg" className="mt-8" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
