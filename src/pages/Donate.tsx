import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Heart, Gift, Users, GraduationCap, CheckCircle, Sparkles, BookOpen, Lightbulb, Loader2 } from "lucide-react";

// Import Paystack
declare global {
  interface Window {
    PaystackPop: any;
  }
}

const PAYSTACK_PUBLIC_KEY = "pk_test_cea39a1d794c2ea550a5fb50a6e45b1a9d36f788";

// Fallback data - updated to Ghanaian cedis
const fallbackImpactLevels = [
  { amount: 500, label: "Supporter", impact: "Provides school supplies for 5 students", icon: BookOpen },
  { amount: 1000, label: "Champion", impact: "Sponsors a student to attend a workshop", icon: Users },
  { amount: 2500, label: "Advocate", impact: "Funds a full innovation project for a student", icon: Lightbulb },
  { amount: 5000, label: "Partner", impact: "Sponsors a mentorship program for 10 students", icon: GraduationCap },
];

const fallbackDonationUses = [
  "Workshop materials and equipment",
  "Student transportation to events",
  "Mentorship program coordination",
  "Innovation project funding",
  "Educational resources and books",
  "Program administration",
];

export default function Donate() {
  const { toast } = useToast();
  const [impactLevels] = useState(fallbackImpactLevels);
  const [donationUses] = useState(fallbackDonationUses);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Paystack script");
      toast({
        title: "Error",
        description: "Failed to load payment gateway. Please refresh the page.",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => (customAmount ? parseFloat(customAmount) || 0 : selectedAmount || 0);

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch(`https://edans-impact-backend.onrender.com/api/donations/verify/${reference}`);
      const data = await response.json();

      if (data.success && data.data.donation.status === "completed") {
        toast({
          title: "Payment Successful! 🎉",
          description: `Thank you for your ${donationType} donation of GH₵${getFinalAmount()}. Your generosity will help empower Ghana's youth!`,
          variant: "default",
        });

        // Reset form
        setSelectedAmount(1000);
        setCustomAmount("");
        setDonationType("one-time");
        setFormData({ firstName: "", lastName: "", email: "" });
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast({
        title: "Verification Error",
        description: "We couldn't verify your payment. Please contact us if you were charged.",
        variant: "destructive",
      });
    }
  };

  const handlePaystackPayment = async (authorizationUrl: string, reference: string) => {
    if (!window.PaystackPop) {
      toast({
        title: "Error",
        description: "Payment gateway not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: formData.email,
      amount: getFinalAmount() * 100, // Convert to pesewas
      currency: "GHS",
      ref: reference,
      channels: ["card", "mobile_money"],
      metadata: {
        custom_fields: [
          {
            display_name: "Donor Name",
            variable_name: "donor_name",
            value: `${formData.firstName} ${formData.lastName}`,
          },
          {
            display_name: "Donation Type",
            variable_name: "donation_type",
            value: donationType,
          },
        ],
      },
      onClose: function () {
        toast({
          title: "Payment Cancelled",
          description: "You closed the payment window. No charges were made.",
          variant: "default",
        });
        setIsSubmitting(false);
      },
      callback: function (response: any) {
        if (response.status === "success") {
          // Verify payment on backend
          verifyPayment(response.reference);
        } else {
          toast({
            title: "Payment Failed",
            description: "Your payment could not be processed. Please try again.",
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
      },
    });

    handler.openIframe();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (getFinalAmount() <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please select or enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    if (getFinalAmount() < 1) {
      toast({
        title: "Minimum Amount",
        description: "Minimum donation amount is GH₵1.",
        variant: "destructive",
      });
      return;
    }

    if (!paystackLoaded) {
      toast({
        title: "Please Wait",
        description: "Payment gateway is still loading. Please try again in a moment.",
        variant: "default",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Initialize payment with backend
      const response = await fetch("https://edans-impact-backend.onrender.com/api/donations/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          amount: getFinalAmount(),
          type: donationType,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Open Paystack payment modal
        await handlePaystackPayment(data.data.authorizationUrl, data.data.reference);
      } else {
        throw new Error(data.message || "Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Error initializing payment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
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
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm">
              <Heart className="h-4 w-4" />
              Support Our Mission
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">Make a Donation</h1>
            <p className="mt-6 text-lg text-primary-foreground/80">Your generosity empowers Ghana's next generation of innovators.</p>
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

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <span className="inline-block rounded-full bg-secondary/10 px-4 py-1 text-sm font-semibold text-secondary">Your Impact</span>
                <h2 className="mt-4 font-heading text-2xl font-bold text-foreground lg:text-3xl">See How Your Donation Helps</h2>
                <div className="mt-8 space-y-4">
                  {impactLevels.map((level) => (
                    <button key={level.amount} type="button" onClick={() => handleAmountSelect(level.amount)}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${selectedAmount === level.amount ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-primary/50"}`}>
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${selectedAmount === level.amount ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          <level.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-xl font-bold text-foreground">GH₵{level.amount}</span>
                            <span className="text-sm text-muted-foreground">{level.label}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{level.impact}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-8 rounded-xl bg-gradient-subtle p-6">
                  <h3 className="font-heading font-bold text-foreground">Your donations support:</h3>
                  <ul className="mt-4 space-y-2">
                    {donationUses.map((use) => (
                      <li key={use} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-secondary" />{use}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-md lg:p-8">
                  <div className="mb-8">
                    <Label>Donation Type</Label>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setDonationType("one-time")}
                        className={`rounded-xl border p-4 text-center transition-all ${donationType === "one-time" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted hover:border-primary"}`}>
                        <Gift className="mx-auto h-6 w-6" />
                        <div className="mt-2 font-semibold">One-time</div>
                      </button>
                      <button type="button" onClick={() => setDonationType("monthly")}
                        className={`rounded-xl border p-4 text-center transition-all ${donationType === "monthly" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted hover:border-primary"}`}>
                        <Sparkles className="mx-auto h-6 w-6" />
                        <div className="mt-2 font-semibold">Monthly</div>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <Label>Select Amount</Label>
                    <div className="mt-3 grid grid-cols-4 gap-3">
                      {[250, 500, 1000, 2500].map((amount) => (
                        <button key={amount} type="button" onClick={() => handleAmountSelect(amount)}
                          className={`rounded-xl border py-3 font-semibold transition-all ${selectedAmount === amount ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted hover:border-primary"}`}>
                          GH₵{amount}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Label htmlFor="customAmount">Or enter custom amount</Label>
                      <div className="relative mt-2">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">GH₵</span>
                        <Input id="customAmount" type="number" value={customAmount} onChange={handleCustomAmountChange} className="pl-12" placeholder="Enter amount" min="1" step="0.01" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <Label>Your Information</Label>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                      <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                      <div className="sm:col-span-2">
                        <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8 rounded-xl bg-gradient-subtle p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{donationType === "monthly" ? "Monthly donation" : "One-time donation"}</span>
                      <span className="font-heading text-2xl font-bold text-foreground">GH₵{getFinalAmount()}</span>
                    </div>
                  </div>
                  
                  <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting || getFinalAmount() === 0 || !paystackLoaded}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-5 w-5" />
                        Donate GH₵{getFinalAmount()} {donationType === "monthly" ? "/month" : ""}
                      </>
                    )}
                  </Button>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Secure payment powered by Paystack. You can pay with card or mobile money (MTN, AirtelTigo, Telecel).
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-subtle py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">Other Ways to Support</h2>
            <p className="mt-4 text-muted-foreground">Beyond monetary donations, there are many ways to contribute to our mission.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
              <Users className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-heading text-xl font-bold text-foreground">Volunteer</h3>
              <p className="mt-2 text-sm text-muted-foreground">Share your skills and time to mentor students and support our programs.</p>
              <Button variant="outline" className="mt-4" asChild><a href="/volunteer">Learn More</a></Button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
              <Gift className="h-10 w-10 text-secondary" />
              <h3 className="mt-4 font-heading text-xl font-bold text-foreground">In-Kind Donations</h3>
              <p className="mt-2 text-sm text-muted-foreground">Donate laptops, books, school supplies, or other materials.</p>
              <Button variant="outline" className="mt-4" asChild><a href="/contact">Contact Us</a></Button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
              <GraduationCap className="h-10 w-10 text-accent" />
              <h3 className="mt-4 font-heading text-xl font-bold text-foreground">Corporate Partnership</h3>
              <p className="mt-2 text-sm text-muted-foreground">Partner with us for CSR initiatives and employee engagement programs.</p>
              <Button variant="outline" className="mt-4" asChild><a href="/contact">Partner With Us</a></Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}