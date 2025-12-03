import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Users, 
  Lightbulb, 
  GraduationCap, 
  Target,
  ArrowRight,
  Calendar,
  BookOpen,
  Sparkles,
  Trophy,
  Globe
} from "lucide-react";

const impactStats = [
  { number: "2,500+", label: "Students Reached", icon: GraduationCap },
  { number: "50+", label: "Programs Delivered", icon: Lightbulb },
  { number: "100+", label: "Volunteers", icon: Users },
  { number: "25+", label: "Partner Schools", icon: Globe },
];

const programs = [
  {
    title: "Innovation Summits",
    description: "Annual gatherings where students showcase creative solutions to community challenges.",
    icon: Trophy,
  },
  {
    title: "STEM Workshops",
    description: "Hands-on learning experiences in science, technology, engineering, and mathematics.",
    icon: Lightbulb,
  },
  {
    title: "Leadership Training",
    description: "Programs that develop critical thinking, communication, and leadership skills.",
    icon: Target,
  },
  {
    title: "Mentorship Program",
    description: "Connecting students with professionals who guide their educational journey.",
    icon: Users,
  },
];

const upcomingEvents = [
  {
    title: "Youth Innovation Summit 2024",
    date: "March 15, 2024",
    location: "Accra International Conference Centre",
  },
  {
    title: "STEM Career Fair",
    date: "April 8, 2024",
    location: "University of Ghana, Legon",
  },
  {
    title: "Creative Minds Workshop",
    date: "April 22, 2024",
    location: "Kumasi Technical Institute",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero pb-24 pt-20 lg:pb-28 lg:pt-28">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary-light/20 blur-3xl" />
        
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Empowering Ghana's Next Generation
            </div>
            
            <h1 className="font-heading text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Nurturing Young
              <span className="relative mx-2">
                <span className="relative z-10">Innovators</span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-accent/30 -rotate-1" />
              </span>
              in Ghana
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80 lg:text-xl">
              Edans Impact empowers less-privileged students in Ghana's basic and high schools 
              by providing opportunities for creative thinkers and innovative minds to thrive.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="hero" size="xl" asChild>
                <Link to="/donate" className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Support Our Mission
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/programs" className="flex items-center gap-2">
                  Explore Programs
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 -mb-px">
          <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" className="block h-[100px] w-full">
            <path
              d="M0 100V50C240 16.67 480 0 720 0C960 0 1200 16.67 1440 50V100H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {impactStats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 transition-transform group-hover:scale-150" />
                <div className="relative">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground">
                    <stat.icon className="h-7 w-7" />
                  </div>
                  <div className="font-heading text-4xl font-bold text-primary">
                    {stat.number}
                  </div>
                  <div className="mt-1 text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                Our Mission
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
                Building a Future of Innovation and Opportunity
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We promote innovation, empower young people, and provide educational 
                and developmental opportunities that help individuals identify challenges, 
                create solutions, and improve their social and economic well-being.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Identify and nurture creative talents",
                  "Provide access to quality educational resources",
                  "Connect students with mentors and opportunities",
                  "Build problem-solving and critical thinking skills",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Button variant="primary-gradient" size="lg" className="mt-8" asChild>
                <Link to="/mission-impact">Learn More About Our Impact</Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl" />
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-hero p-8">
                <div className="flex h-full flex-col items-center justify-center text-center text-primary-foreground">
                  <Target className="mb-6 h-20 w-20" />
                  <h3 className="font-heading text-2xl font-bold">Our Vision</h3>
                  <p className="mt-4 max-w-sm text-primary-foreground/80">
                    A society where young people become innovative thinkers who create 
                    sustainable solutions for their communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-secondary/10 px-4 py-1 text-sm font-semibold text-secondary">
              Our Programs
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Transformative Initiatives for Young Minds
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We run various programs designed to unlock the potential of students 
              across Ghana's basic and high schools.
            </p>
          </div>
          
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((program, index) => (
              <div
                key={program.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground transition-transform group-hover:scale-110">
                    <program.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {program.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {program.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="secondary-gradient" size="lg" asChild>
              <Link to="/programs" className="flex items-center gap-2">
                View All Programs
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-semibold text-accent">
                Upcoming Events
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
                Join Us at Our Next Event
              </h2>
            </div>
            <Button variant="outline" asChild>
              <Link to="/events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                View All Events
              </Link>
            </Button>
          </div>
          
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex items-center gap-2 text-sm text-primary">
                  <Calendar className="h-4 w-4" />
                  {event.date}
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  📍 {event.location}
                </p>
                <Button variant="ghost" className="mt-4 -ml-3" asChild>
                  <Link to="/events" className="flex items-center gap-2">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 lg:p-16">
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary-light/20 blur-3xl" />
            
            <div className="relative mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold text-primary-foreground lg:text-4xl">
                Ready to Make a Difference?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                Whether you want to donate, volunteer, or partner with us, 
                there are many ways to support our mission.
              </p>
              
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/donate" className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Donate Now
                  </Link>
                </Button>
                <Button variant="hero-outline" size="xl" asChild>
                  <Link to="/volunteer">Become a Volunteer</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}