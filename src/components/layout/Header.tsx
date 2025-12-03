import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Mission & Impact", href: "/mission-impact" },
  { label: "Programs", href: "/programs" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero">
            <span className="text-lg font-bold text-primary-foreground">E</span>
          </div>
          <span className="hidden sm:inline">
            <span className="text-primary">Edans</span>
            <span className="text-secondary"> Impact</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:items-center lg:gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/volunteer">Volunteer</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/donate" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Donate
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-border lg:hidden">
          <nav className="container flex flex-col gap-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <Button variant="outline" asChild>
                <Link to="/volunteer" onClick={() => setIsMenuOpen(false)}>
                  Volunteer
                </Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/donate" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2">
                  <Heart className="h-4 w-4" />
                  Donate
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
