import { useState, useEffect } from "react";
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
  Award,
  History,
  Sparkles
} from "lucide-react";

// Fallback data
const fallbackTeamMembers = [
  {
    name: "Emmanuel Danso",
    role: "Founder & Executive Director",
    image: "ED",
  },
  {
    name: "Abena Osei",
    role: "Programs Director",
    image: "AO",
  },
  {
    name: "Kwame Asante",
    role: "Community Outreach Lead",
    image: "KA",
  },
  {
    name: "Ama Sarpong",
    role: "Volunteer Coordinator",
    image: "AS",
  },
];

const fallbackValues = [
  {
    title: "Innovation",
    description: "We believe in the power of creative thinking and problem-solving.",
    icon: Lightbulb,
  },
  {
    title: "Empowerment",
    description: "We strive to give students the tools and confidence to succeed.",
    icon: Award,
  },
  {
    title: "Inclusivity",
    description: "Every student deserves access to quality educational opportunities.",
    icon: Users,
  },
  {
    title: "Excellence",
    description: "We maintain high standards in all our programs and initiatives.",
    icon: Target,
  },
];

const fallbackStory = `Edans Impact was founded with a simple yet powerful belief: every student, 
regardless of their economic background, deserves the opportunity to develop 
their creative potential and contribute meaningfully to society.

Starting in Accra, we began organizing small workshops and mentorship sessions 
for students in underserved communities. What started as a grassroots initiative 
has grown into a movement that reaches thousands of students across Ghana.

Today, we continue to expand our reach, partnering with schools, educators, 
and community leaders to create lasting impact in the lives of young Ghanaians.`;

export default function About() {
  const [story, setStory] = useState(fallbackStory);
  const [values, setValues] = useState(fallbackValues);
  const [teamMembers, setTeamMembers] = useState(fallbackTeamMembers);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://edans-impact-backend.onrender.com/api/about");
        
        if (response.ok) {
          const data = await response.json();
          
          if (!data.isFallback && data.data) {
            // Update story
            if (data.data.story) {
              setStory(data.data.story);
            }
            
            // Update values
            if (data.data.values && data.data.values.length > 0) {
              setValues(data.data.values.map((value: any) => ({
                title: value.title,
                description: value.description,
                icon: value.title.includes("Innovation") ? Lightbulb :
                      value.title.includes("Empowerment") ? Award :
                      value.title.includes("Inclusivity") ? Users :
                      value.title.includes("Excellence") ? Target : Lightbulb
              })));
            }
            
            // Update team members
            if (data.data.team && data.data.team.length > 0) {
              setTeamMembers(data.data.team.map((member: any) => ({
                name: member.name,
                role: member.role,
                image: member.image || member.name.split(' ').map((n: string) => n[0]).join('')
              })));
            }
            
            setUsingFallback(false);
          } else {
            setUsingFallback(true);
          }
        } else {
          setUsingFallback(true);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
        setUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

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
              About Edans Impact
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80">
              Learn about our journey, our team, and our commitment to empowering 
              Ghana's next generation of innovators.
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

      {/* Story Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <History className="h-6 w-6 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">Our Story</span>
              </div>
              <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
                How It All Began
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                {story.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-gradient-primary p-6 text-primary-foreground">
                    <GraduationCap className="h-8 w-8" />
                    <div className="mt-4 font-heading text-2xl font-bold">2,500+</div>
                    <div className="text-sm text-primary-foreground/80">Students Impacted</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <Target className="h-8 w-8 text-secondary" />
                    <div className="mt-4 font-heading text-2xl font-bold text-foreground">25+</div>
                    <div className="text-sm text-muted-foreground">Partner Schools</div>
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <Lightbulb className="h-8 w-8 text-primary" />
                    <div className="mt-4 font-heading text-2xl font-bold text-foreground">50+</div>
                    <div className="text-sm text-muted-foreground">Programs Delivered</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-secondary p-6 text-secondary-foreground">
                    <Users className="h-8 w-8" />
                    <div className="mt-4 font-heading text-2xl font-bold">100+</div>
                    <div className="text-sm text-secondary-foreground/80">Active Volunteers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Our Values
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
              What Drives Us
            </h2>
          </div>
          
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-2xl border border-border bg-card p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground transition-transform group-hover:scale-110">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-secondary/10 px-4 py-1 text-sm font-semibold text-secondary">
              Our Team
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Meet the People Behind Our Mission
            </h2>
            <p className="mt-4 text-muted-foreground">
              Dedicated individuals working together to create positive change.
            </p>
          </div>
          
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="group rounded-2xl border border-border bg-card p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-hero text-2xl font-bold text-primary-foreground">
                  {member.image}
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Join Our Mission
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether through volunteering, donations, or partnerships, 
              you can help us create more opportunities for Ghana's youth.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="primary-gradient" size="lg" asChild>
                <Link to="/volunteer" className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Become a Volunteer
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact" className="flex items-center gap-2">
                  Contact Us
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}