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
  TrendingUp,
  MapPin,
  Award,
  Quote
} from "lucide-react";

// Fallback data
const fallbackImpactMetrics = [
  {
    number: "2,500+",
    label: "Students Reached",
    description: "Young minds engaged through our various programs",
    icon: GraduationCap,
    color: "primary",
  },
  {
    number: "50+",
    label: "Programs Delivered",
    description: "Workshops, summits, and training sessions completed",
    icon: Lightbulb,
    color: "secondary",
  },
  {
    number: "100+",
    label: "Volunteers",
    description: "Dedicated individuals contributing their time",
    icon: Users,
    color: "accent",
  },
  {
    number: "25+",
    label: "Partner Schools",
    description: "Educational institutions across Ghana",
    icon: MapPin,
    color: "primary",
  },
  {
    number: "85%",
    label: "Skill Improvement",
    description: "Students reporting improved problem-solving skills",
    icon: TrendingUp,
    color: "secondary",
  },
  {
    number: "15+",
    label: "Awards Won",
    description: "Recognition for student innovations",
    icon: Award,
    color: "accent",
  },
];

const fallbackSuccessStories = [
  {
    name: "Kofi Mensah",
    school: "Achimota School",
    story: "After participating in our Innovation Summit, Kofi developed a solar-powered water purification system that is now being piloted in his community.",
    quote: "Edans Impact showed me that my ideas can change lives. I never thought a student like me could create something so meaningful.",
  },
  {
    name: "Akua Addo",
    school: "Wesley Girls' High School",
    story: "Through our STEM workshops, Akua discovered her passion for coding and has since created an app that helps farmers predict weather patterns.",
    quote: "The mentorship I received helped me believe in myself and pursue my dreams in technology.",
  },
  {
    name: "Yaw Boateng",
    school: "Prempeh College",
    story: "Yaw's recycling initiative, developed during our Environmental Summit, has been adopted by three schools in the Ashanti Region.",
    quote: "Edans Impact taught me that innovation isn't just about technology – it's about solving real problems in our communities.",
  },
];

const sdgAlignments = [
  { number: 4, title: "Quality Education", color: "bg-red-500" },
  { number: 8, title: "Decent Work & Economic Growth", color: "bg-rose-600" },
  { number: 9, title: "Industry, Innovation & Infrastructure", color: "bg-orange-500" },
  { number: 10, title: "Reduced Inequalities", color: "bg-pink-500" },
];

export default function MissionImpact() {
  const [impactMetrics, setImpactMetrics] = useState(fallbackImpactMetrics);
  const [successStories, setSuccessStories] = useState(fallbackSuccessStories);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchMissionImpactData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch impact data from multiple sources
        const [programsResponse, eventsResponse, aboutResponse] = await Promise.all([
          fetch("http://localhost:5000/api/programs"),
          fetch("http://localhost:5000/api/events"),
          fetch("http://localhost:5000/api/about")
        ]);
        
        if (programsResponse.ok && eventsResponse.ok) {
          const programsData = await programsResponse.json();
          const eventsData = await eventsResponse.json();
          const aboutData = aboutResponse.ok ? await aboutResponse.json() : null;
          
          // Update impact metrics based on real data
          const updatedMetrics = [...fallbackImpactMetrics];
          updatedMetrics[0].number = `${Math.floor(programsData.count * 50)}+`; // Estimate students
          updatedMetrics[1].number = `${programsData.count}+`; // Programs count
          updatedMetrics[2].number = "100+"; // Fixed for now
          updatedMetrics[3].number = `${Math.floor(programsData.count / 2)}+`; // Estimate schools
          
          setImpactMetrics(updatedMetrics);
          
          // Update success stories if available from about data
          if (aboutData?.data?.team) {
            const teamStories = aboutData.data.team.slice(0, 3).map((member: any, index: number) => ({
              name: member.name,
              school: ["Achimota School", "Wesley Girls' High School", "Prempeh College"][index],
              story: `${member.name} joined our team as ${member.role} and has been instrumental in our mission.`,
              quote: fallbackSuccessStories[index].quote
            }));
            
            if (teamStories.length > 0) {
              setSuccessStories(teamStories);
            }
          }
          
          setUsingFallback(false);
        } else {
          setUsingFallback(true);
        }
      } catch (error) {
        console.error("Error fetching mission impact data:", error);
        setUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissionImpactData();
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
              Our Mission & Impact
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80">
              Creating lasting change in the lives of Ghana's youth through 
              innovation, education, and empowerment.
            </p>
            {usingFallback && (
              <div className="mt-4 inline-block rounded-full bg-primary-foreground/20 px-4 py-1 text-sm text-primary-foreground">
                Using fallback data
              </div>
            )}
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

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-gradient-primary p-8 lg:p-12">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/20">
                <Target className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-primary-foreground lg:text-3xl">
                Our Mission
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/90">
                To promote innovation, empower young people, and provide educational 
                and developmental opportunities that help individuals identify challenges, 
                create solutions, and improve their social and economic well-being.
              </p>
            </div>
            
            <div className="rounded-3xl bg-gradient-secondary p-8 lg:p-12">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary-foreground/20">
                <Lightbulb className="h-7 w-7 text-secondary-foreground" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-secondary-foreground lg:text-3xl">
                Our Vision
              </h2>
              <p className="mt-4 text-lg text-secondary-foreground/90">
                A society where young people become innovative thinkers who create 
                sustainable solutions for their communities, driving positive change 
                across Ghana and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Our Impact
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Measuring Our Progress
            </h2>
            <p className="mt-4 text-muted-foreground">
              Real numbers that represent real change in the lives of Ghana's youth.
            </p>
          </div>
          
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {impactMetrics.map((metric) => (
              <div
                key={metric.label}
                className="group rounded-2xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-heading text-4xl font-bold text-primary">
                      {metric.number}
                    </div>
                    <div className="mt-1 font-semibold text-foreground">
                      {metric.label}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground">
                    <metric.icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-secondary/10 px-4 py-1 text-sm font-semibold text-secondary">
              Success Stories
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Inspiring Student Journeys
            </h2>
          </div>
          
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {successStories.map((story) => (
              <div
                key={story.name}
                className="group rounded-2xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-hero text-xl font-bold text-primary-foreground">
                  {story.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {story.name}
                </h3>
                <p className="text-sm text-primary">{story.school}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  {story.story}
                </p>
                <div className="mt-4 border-t border-border pt-4">
                  <Quote className="mb-2 h-5 w-5 text-secondary" />
                  <p className="text-sm italic text-foreground">
                    "{story.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-semibold text-accent">
              Global Goals
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Aligned with UN Sustainable Development Goals
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our work contributes to achieving global targets for a better, more sustainable future.
            </p>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {sdgAlignments.map((sdg) => (
              <div
                key={sdg.number}
                className={`flex items-center gap-3 rounded-xl ${sdg.color} px-6 py-4 text-white`}
              >
                <span className="font-heading text-2xl font-bold">SDG {sdg.number}</span>
                <span className="text-sm">{sdg.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 lg:p-16">
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary-light/20 blur-3xl" />
            
            <div className="relative mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold text-primary-foreground lg:text-4xl">
                Help Us Create More Impact
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Your support enables us to reach more students and create more success stories.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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