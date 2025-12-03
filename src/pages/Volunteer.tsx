import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart,
  Users,
  Clock,
  Award,
  BookOpen,
  Globe,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const benefits = [
  {
    icon: Heart,
    title: "Make a Real Impact",
    description: "Directly contribute to empowering Ghana's next generation of innovators.",
  },
  {
    icon: Users,
    title: "Build Connections",
    description: "Join a community of passionate individuals dedicated to education and youth development.",
  },
  {
    icon: Award,
    title: "Gain Experience",
    description: "Develop leadership, teaching, and organizational skills that enhance your career.",
  },
  {
    icon: BookOpen,
    title: "Share Your Knowledge",
    description: "Use your expertise to mentor students and guide them toward their goals.",
  },
];

const volunteerRoles = [
  {
    title: "Workshop Facilitator",
    commitment: "4-8 hours/month",
    description: "Lead hands-on workshops in your area of expertise.",
  },
  {
    title: "Mentor",
    commitment: "2-4 hours/month",
    description: "Provide one-on-one guidance to students.",
  },
  {
    title: "Event Support",
    commitment: "Flexible",
    description: "Help organize and run our programs and events.",
  },
  {
    title: "Content Creator",
    commitment: "4-6 hours/month",
    description: "Create educational materials, graphics, or videos.",
  },
  {
    title: "Community Ambassador",
    commitment: "2-4 hours/month",
    description: "Represent Edans Impact in your community.",
  },
  {
    title: "Administrative Support",
    commitment: "4-8 hours/month",
    description: "Help with data entry, communications, and coordination.",
  },
];

const skills = [
  "Teaching / Training",
  "STEM / Technology",
  "Arts & Design",
  "Leadership / Mentoring",
  "Event Planning",
  "Communications / Marketing",
  "Video / Photography",
  "Languages",
  "Business / Entrepreneurship",
  "Other",
];

export default function Volunteer() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    occupation: "",
    motivation: "",
    availability: "",
    selectedSkills: [] as string[],
    selectedRoles: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill]
    }));
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(role)
        ? prev.selectedRoles.filter(r => r !== role)
        : [...prev.selectedRoles, role]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Application Submitted!",
      description: "Thank you for your interest in volunteering. We'll be in touch soon!",
    });
    
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      occupation: "",
      motivation: "",
      availability: "",
      selectedSkills: [],
      selectedRoles: [],
    });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero Section - Exact same design as about.tsx */}
      <section className="relative overflow-hidden bg-gradient-hero pb-24 pt-20 lg:pb-28 lg:pt-28">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary-light/20 blur-3xl" />
        
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
              Become a Volunteer
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80">
              Join our community of dedicated volunteers and help shape the future 
              of Ghana's youth through education and empowerment.
            </p>
          </div>
        </div>
        
        {/* Decorative wave - Exact same as about.tsx */}
        <div className="absolute bottom-0 left-0 right-0 -mb-px">
          <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" className="block h-[100px] w-full">
            <path
              d="M0 100V50C240 16.67 480 0 720 0C960 0 1200 16.67 1440 50V100H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-secondary/10 px-4 py-1 text-sm font-semibold text-secondary">
              Why Volunteer?
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
              The Impact You'll Make
            </h2>
          </div>
          
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group rounded-2xl border border-border bg-card p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground transition-transform group-hover:scale-110">
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Opportunities
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Volunteer Roles
            </h2>
            <p className="mt-4 text-muted-foreground">
              Find a role that matches your skills and availability.
            </p>
          </div>
          
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {volunteerRoles.map((role) => (
              <div
                key={role.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {role.title}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                  <Clock className="h-4 w-4" />
                  <span>{role.commitment}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <span className="inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-semibold text-accent">
                Apply Now
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
                Volunteer Application
              </h2>
              <p className="mt-4 text-muted-foreground">
                Complete the form below to begin your journey as a volunteer.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-12 rounded-2xl border border-border bg-card p-6 shadow-md lg:p-8">
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    Personal Information
                  </h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location (City/Region) *</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Skills */}
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    Skills & Expertise
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select all that apply
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          formData.selectedSkills.includes(skill)
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Roles */}
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    Preferred Roles
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select the roles you're interested in
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {volunteerRoles.map((role) => (
                      <label
                        key={role.title}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                          formData.selectedRoles.includes(role.title)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Checkbox
                          checked={formData.selectedRoles.includes(role.title)}
                          onCheckedChange={() => handleRoleToggle(role.title)}
                        />
                        <div>
                          <div className="font-medium text-foreground">{role.title}</div>
                          <div className="text-xs text-muted-foreground">{role.commitment}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Availability & Motivation */}
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    Availability & Motivation
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="availability">Your Availability *</Label>
                      <select
                        id="availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        required
                        className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select your availability</option>
                        <option value="weekdays">Weekdays</option>
                        <option value="weekends">Weekends</option>
                        <option value="evenings">Evenings only</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="motivation">Why do you want to volunteer with us? *</Label>
                      <Textarea
                        id="motivation"
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleChange}
                        required
                        className="mt-2 min-h-[120px]"
                        placeholder="Tell us about your motivation and what you hope to contribute..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="mt-8 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}