import { useState, useMemo } from "react";
import emailjs from "@emailjs/browser";
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

const EMAILJS_SERVICE_ID = "service_7jp0flp";
const EMAILJS_TEMPLATE_ID = "template_6tsca06";
const EMAILJS_PUBLIC_KEY = "eU3ZuZL7r67CTtTF3"; 

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    details: "edansimpact@gmail.com",
    description: "Send us an email anytime",
  },
  {
    icon: Phone,
    title: "Phone",
    details: "+233 59 728 8208",
    description: "Mon-Fri from 8am to 5pm",
  },
  {
    icon: MapPin,
    title: "Office",
    details: "Kumasi, Ashanti Region, Ghana",
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
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Validate if form is complete and valid
  const isFormValid = useMemo(() => {
    const { name, email, inquiryType, message } = formData;
    
    // Check if all required fields are filled
    const hasRequiredFields = name.trim() !== "" && 
                             email.trim() !== "" && 
                             inquiryType !== "" && 
                             message.trim() !== "";
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    
    return hasRequiredFields && isEmailValid;
  }, [formData]);

  // Validate if subscribe email is valid
  const isSubscribeValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return subscribeEmail.trim() !== "" && emailRegex.test(subscribeEmail);
  }, [subscribeEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }
    
    if (!formData.inquiryType) {
      errors.inquiryType = "Please select an inquiry type";
    }
    
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Initialize EmailJS with your public key
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Prepare template parameters
      const templateParams = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "Not provided",
        organization: formData.organization || "Not provided",
        inquiryType: inquiryTypes.find(type => type.value === formData.inquiryType)?.label || formData.inquiryType,
        message: formData.message,
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        toast({
          title: "Message Sent Successfully! ✓",
          description: "Thank you for contacting us. We'll get back to you within 24 hours.",
          variant: "default",
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          organization: "",
          inquiryType: "",
          message: "",
        });
        setFormErrors({});
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        title: "Error Sending Message",
        description: "Something went wrong. Please try again or contact us directly at edansimpact@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubscribeValid) {
      toast({
        title: "Thank You for Subscribing! 🎉",
        description: `You'll receive our latest updates and news at ${subscribeEmail}`,
        variant: "default",
      });
      
      // Reset subscribe email
      setSubscribeEmail("");
    } else {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
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
                <div className="rounded-2xl border border-border bg-card p-6 shadow-md lg:p-8">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`mt-2 ${formErrors.name ? 'border-red-500' : ''}`}
                        placeholder="John Doe"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-2 ${formErrors.email ? 'border-red-500' : ''}`}
                        placeholder="john@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                      )}
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
                      <Label htmlFor="inquiryType">
                        Inquiry Type <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className={`mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${formErrors.inquiryType ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select an option</option>
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {formErrors.inquiryType && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.inquiryType}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="message">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={`mt-2 min-h-[150px] ${formErrors.message ? 'border-red-500' : ''}`}
                        placeholder="Tell us how we can help... (minimum 10 characters)"
                      />
                      {formErrors.message && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="primary-gradient"
                    size="lg"
                    className="mt-6 w-full"
                    disabled={!isFormValid || isSubmitting}
                    onClick={handleSubmit}
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
                  
                  {!isFormValid && (
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                      Please fill in all required fields to send your message
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Visit Our Office
              </h2>
              <p className="mt-2 text-muted-foreground">
                Find us in Kumasi, Ashanti Region, Ghana
              </p>
            </div>
            
            <div className="overflow-hidden rounded-2xl border border-border shadow-md">
              {/* Google Map Embed - Kumasi, Ghana */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126293.03252209946!2d-1.6919133!3d6.6885073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdb96f342e6b639%3A0xb5f3a81cf7cc28cd!2sKumasi%2C%20Ghana!5e0!3m2!1sen!2sus!4v1733334000000!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Edan's Impact Office Location - Kumasi, Ashanti Region, Ghana"
              />
            </div>
            
            {/* Contact Details Below Map */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Address</h4>
                  <p className="text-sm text-muted-foreground">Kumasi, Ashanti Region, Ghana</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Email</h4>
                  <p className="text-sm text-muted-foreground">edansimpact@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Phone</h4>
                  <p className="text-sm text-muted-foreground">+233 59 728 8208</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}