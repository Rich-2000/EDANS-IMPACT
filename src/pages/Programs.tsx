import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Users, 
  GraduationCap, 
  Trophy,
  Compass,
  Rocket,
  Palette,
  Globe
} from "lucide-react";

const programs = [
  {
    title: "Innovation Summits",
    description: "Annual gatherings where students from across Ghana showcase their creative solutions to community challenges. Winners receive mentorship, funding, and support to develop their ideas further.",
    icon: Trophy,
    features: ["Project showcases", "Expert judging panel", "Networking opportunities", "Prizes & awards"],
    audience: "JHS & SHS students",
  },
  {
    title: "STEM Workshops",
    description: "Hands-on learning experiences in science, technology, engineering, and mathematics. Students build real projects using coding, robotics, and engineering principles.",
    icon: Rocket,
    features: ["Coding fundamentals", "Robotics basics", "Science experiments", "Math problem-solving"],
    audience: "Primary & JHS students",
  },
  {
    title: "Leadership Academy",
    description: "Intensive programs that develop critical thinking, communication, and leadership skills. Students learn to become change-makers in their schools and communities.",
    icon: Compass,
    features: ["Public speaking", "Team management", "Project planning", "Community organizing"],
    audience: "SHS students",
  },
  {
    title: "Mentorship Program",
    description: "Connecting students with professionals who guide their educational and career journey. Mentors provide personalized support, advice, and industry insights.",
    icon: Users,
    features: ["One-on-one sessions", "Career guidance", "Skill development", "Network building"],
    audience: "JHS & SHS students",
  },
  {
    title: "Creative Arts Initiative",
    description: "Programs that nurture artistic talents and creative expression. Students explore visual arts, music, creative writing, and digital design.",
    icon: Palette,
    features: ["Art workshops", "Music training", "Creative writing", "Digital design"],
    audience: "All age groups",
  },
  {
    title: "Environmental Champions",
    description: "Projects focused on sustainability and environmental conservation. Students develop and implement eco-friendly solutions for their communities.",
    icon: Globe,
    features: ["Climate education", "Recycling projects", "Garden initiatives", "Awareness campaigns"],
    audience: "Primary to SHS students",
  },
];

const upcomingPrograms = [
  {
    title: "Innovation Summit 2024",
    date: "March 15-17, 2024",
    location: "Accra",
    spots: "200 spots available",
  },
  {
    title: "STEM Workshop Series",
    date: "Starting April 2024",
    location: "Multiple locations",
    spots: "50 spots per session",
  },
  {
    title: "Leadership Academy Cohort 5",
    date: "May 2024",
    location: "Kumasi",
    spots: "30 spots available",
  },
];

export default function Programs() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero pb-24 pt-20 lg:pb-28 lg:pt-28">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary-light/20 blur-3xl" />
        
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
              Our Programs
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80">
              Discover the transformative initiatives that empower Ghana's students 
              to become innovative leaders and problem-solvers.
            </p>
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

      {/* Programs Grid */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            {programs.map((program) => (
              <div
                key={program.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:shadow-xl lg:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground transition-transform group-hover:scale-110">
                    <program.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground lg:text-2xl">
                      {program.title}
                    </h3>
                    <span className="mt-1 inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                      {program.audience}
                    </span>
                  </div>
                </div>
                
                <p className="mt-4 text-muted-foreground">
                  {program.description}
                </p>
                
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-foreground">Key Features:</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {program.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Programs */}
      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-semibold text-accent">
              Coming Soon
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Upcoming Programs
            </h2>
            <p className="mt-4 text-muted-foreground">
              Register early to secure your spot in our upcoming sessions.
            </p>
          </div>
          
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {upcomingPrograms.map((program) => (
              <div
                key={program.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {program.title}
                </h3>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p>📅 {program.date}</p>
                  <p>📍 {program.location}</p>
                  <p className="font-medium text-secondary">✨ {program.spots}</p>
                </div>
                <Button variant="primary-gradient" className="mt-6 w-full" asChild>
                  <Link to="/contact">Express Interest</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="rounded-3xl bg-gradient-hero p-8 lg:p-16">
            <div className="mx-auto max-w-3xl text-center">
              <GraduationCap className="mx-auto h-16 w-16 text-primary-foreground" />
              <h2 className="mt-6 font-heading text-3xl font-bold text-primary-foreground lg:text-4xl">
                Bring Our Programs to Your School
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                We partner with schools across Ghana to deliver our programs. 
                Contact us to discuss how we can work together.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contact">Partner With Us</Link>
                </Button>
                <Button variant="hero-outline" size="lg" asChild>
                  <Link to="/volunteer">Volunteer as Facilitator</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Support Our Programs
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Your donation helps us expand our reach and create more opportunities for students.
            </p>
            <Button variant="hero" size="xl" className="mt-8" asChild>
              <Link to="/donate" className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Donate Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}