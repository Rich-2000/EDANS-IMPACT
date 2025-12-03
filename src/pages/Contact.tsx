import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Building,
  Users
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    details: "info@edansimpact.org",
    description: "Send us an email anytime",
  },
  {
    icon: Phone,
    title: "Phone",
    details: "+233 XX XXX XXXX",
    description: "Mon-Fri from 8am to 5pm",
  },
  {
    icon: MapPin,
    title: "Office",
    details: "Accra, Ghana",
    description: "Visit us at our headquarters",
  },
  {
    icon: Clock,
    title: "Hours",
    details: "Mon - Fri: 8am - 5pm",
    description: "We respond within 24 hours",
  },
];

const inquiryTypes = [
  { value: "general", label: "General Inquiry" },
  { value: "partnership", label: "Partnership Opportunity" },
  { value: "volunteer", label: "Volunteering" },
  { value: "donation", label: "Donation Questions" },
  { value: "media", label: "Media & Press" },
  { value: "school", label: "School Partnership" },
];

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    inquiryType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      organization: "",
      inquiryType: "",
      message: "",
    });
    setIsSubmitting(false);
  };

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
              Contact Us
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80">
              Have questions? Want to partner with us? We'd love to hear from you.
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

      {/* Contact Info Cards */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="group rounded-2xl border border-border bg-card p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground transition-transform group-hover:scale-110">
                  <info.icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {info.title}
                </h3>
                <p className="mt-1 font-medium text-primary">{info.details}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-12 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                  Get in Touch
                </span>
                <h2 className="mt-4 font-heading text-3xl font-bold text-foreground">
                  Send Us a Message
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-sm">
                    <Building className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-semibold text-foreground">For Organizations</h4>
                      <p className="text-sm text-muted-foreground">
                        Interested in partnering? Let's discuss how we can work together.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-sm">
                    <Users className="mt-0.5 h-5 w-5 text-secondary" />
                    <div>
                      <h4 className="font-semibold text-foreground">For Volunteers</h4>
                      <p className="text-sm text-muted-foreground">
                        Want to contribute your time? We have many opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-md lg:p-8">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-2"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-2"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-2"
                        placeholder="+233 XX XXX XXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className="mt-2"
                        placeholder="Your company or school"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="inquiryType">Inquiry Type *</Label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        required
                        className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select an option</option>
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="mt-2 min-h-[150px]"
                        placeholder="Tell us how we can help..."
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    variant="primary-gradient"
                    size="lg"
                    className="mt-6 w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-secondary/10 shadow-md">
            <div className="flex aspect-video items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto h-16 w-16 text-primary" />
                <h3 className="mt-4 font-heading text-xl font-bold text-foreground">
                  Visit Our Office
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Accra, Ghana
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}