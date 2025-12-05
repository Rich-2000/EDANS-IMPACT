import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

import { TiktokIcon } from "@/components/icons/TiktokIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/images/logo.png";

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Programs", href: "/programs" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
];

const getInvolved = [
  { label: "Donate", href: "/donate" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Partner With Us", href: "/contact" },
  { label: "Contact Us", href: "/contact" },
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/share/1MH2DSTEmr/?mibextid=wwXIfr", label: "Facebook" },
  { icon: Twitter, href: "https://x.com/edansimpact?s=21", label: "Twitter" },
  { icon: Instagram, href: "https://www.instagram.com/edansimpact?igsh=OGw1ZWlmNmJydDk0&utm_source=qr", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/edans-impact-4711453a0?utm_source=share_via&utm_content=profile&utm_medium=member_ios", label: "LinkedIn" },
  { icon: Youtube, href: "https://www.youtube.com/@edansimpact", label: "YouTube" },
  { icon: TiktokIcon, href: "https://www.tiktok.com/@edans.impact?_r=1&_t=ZM-91wTjnFcmzc", label: "TikTok" }, 
];

export function Footer() {
  const { toast } = useToast();
  const [subscribeEmail, setSubscribeEmail] = useState("");

  const isSubscribeValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return subscribeEmail.trim() !== "" && emailRegex.test(subscribeEmail);
  }, [subscribeEmail]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubscribeValid) {
      toast({
        title: "Thank You for Subscribing! 🎉",
        description: `You'll receive our latest updates and news at ${subscribeEmail}`,
        variant: "default",
      });

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
    <footer className="border-t border-border bg-gradient-subtle">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Stay Updated
            </h3>
            <p className="mt-2 text-muted-foreground">
              Subscribe to our newsletter for the latest news, events, and impact stories.
            </p>

            <form
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-2"
              onSubmit={handleSubscribe}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isSubscribeValid) {
                    handleSubscribe(e);
                  }
                }}
              />

              <Button
                type="submit"
                variant="primary-gradient"
                disabled={!isSubscribeValid}
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* About */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold">
              <img 
                src={logo} 
                alt="Edans Impact Logo" 
                className="h-10 w-10 object-contain"
              />
              <span>
                <span className="text-primary">EDANS</span>
                <span className="text-secondary"> Impact</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Empowering less-privileged students in Ghana through innovation, creativity, and educational opportunities.
            </p>

            <div className="mt-6 flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground
                             transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-heading font-semibold text-foreground">Get Involved</h4>
            <ul className="mt-4 space-y-3">
              {getInvolved.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-foreground">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> edansimpact@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> +233 59 728 8208
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Kumasi, Ghana
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}