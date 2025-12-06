import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Calendar,
  BookOpen,
  Image,
  MessageSquare,
  UserCheck,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Settings,
} from "lucide-react";

interface DashboardStats {
  totalPrograms: number;
  totalEvents: number;
  totalBlogs: number;
  galleryItems: number;
  contactSubmissions: number;
  volunteerApplications: number;
  donations: number;
}

// Fallback stats
const fallbackStats: DashboardStats = {
  totalPrograms: 0,
  totalEvents: 0,
  totalBlogs: 0,
  galleryItems: 0,
  contactSubmissions: 0,
  volunteerApplications: 0,
  donations: 0,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>(fallbackStats);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("adminToken");
    const admin = localStorage.getItem("adminInfo");

    if (!token || !admin) {
      navigate("/admin/login");
      return;
    }

    setAdminInfo(JSON.parse(admin));
    fetchDashboardStats(token);
  }, [navigate]);

  const fetchDashboardStats = async (token: string) => {
    try {
      setIsLoading(true);
      
      // Fetch all stats from various endpoints
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [programs, events, blogs, gallery, contacts, volunteers, donations] =
        await Promise.all([
          fetch("https://edans-impact-backend.onrender.com/api/programs", { headers }),
          fetch("https://edans-impact-backend.onrender.com/api/events", { headers }),
          fetch("https://edans-impact-backend.onrender.com/api/blog", { headers }),
          fetch("https://edans-impact-backend.onrender.com/api/gallery", { headers }),
          fetch("https://edans-impact-backend.onrender.com/api/contact", { headers }),
          fetch("https://edans-impact-backend.onrender.com/api/volunteer", { headers }),
          fetch("https://edans-impact-backend.onrender.com/api/donations", { headers }),
        ]);

      // Parse responses
      const programsData = programs.ok ? await programs.json() : { count: 0 };
      const eventsData = events.ok ? await events.json() : { count: 0 };
      const blogsData = blogs.ok ? await blogs.json() : { count: 0 };
      const galleryData = gallery.ok ? await gallery.json() : { count: 0 };
      const contactsData = contacts.ok ? await contacts.json() : { count: 0 };
      const volunteersData = volunteers.ok ? await volunteers.json() : { count: 0 };
      const donationsData = donations.ok ? await donations.json() : { count: 0, totalAmount: 0 };

      setStats({
        totalPrograms: programsData.count || 0,
        totalEvents: eventsData.count || 0,
        totalBlogs: blogsData.count || 0,
        galleryItems: galleryData.count || 0,
        contactSubmissions: contactsData.count || 0,
        volunteerApplications: volunteersData.count || 0,
        donations: donationsData.totalAmount || 0,
      });
      
      setUsingFallback(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Programs",
      value: stats.totalPrograms,
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+12%",
      description: "from last month",
    },
    {
      title: "Upcoming Events",
      value: stats.totalEvents,
      icon: Calendar,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      change: "+8%",
      description: "from last month",
    },
    {
      title: "Blog Posts",
      value: stats.totalBlogs,
      icon: BookOpen,
      color: "text-accent",
      bgColor: "bg-accent/10",
      change: "+15%",
      description: "from last month",
    },
    {
      title: "Gallery Items",
      value: stats.galleryItems,
      icon: Image,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+20%",
      description: "from last month",
    },
    {
      title: "Contact Messages",
      value: stats.contactSubmissions,
      icon: MessageSquare,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      change: "New",
      description: "pending review",
    },
    {
      title: "Volunteer Apps",
      value: stats.volunteerApplications,
      icon: UserCheck,
      color: "text-accent",
      bgColor: "bg-accent/10",
      change: "+5",
      description: "new this week",
    },
    {
      title: "Total Donations",
      value: `GH₵${stats.donations.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+18%",
      description: "from last month",
    },
    {
      title: "Active Users",
      value: "2.5K",
      icon: TrendingUp,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      change: "+25%",
      description: "from last week",
    },
  ];

  const quickActions = [
    {
      title: "Add New Program",
      icon: Trophy,
      href: "/admin/programs",
      color: "primary",
    },
    {
      title: "Create Event",
      icon: Calendar,
      href: "/admin/events",
      color: "secondary",
    },
    {
      title: "Write Blog Post",
      icon: BookOpen,
      href: "/admin/blog",
      color: "accent",
    },
    {
      title: "Upload to Gallery",
      icon: Image,
      href: "/admin/gallery",
      color: "primary",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-secondary p-6 text-primary-foreground shadow-lg lg:p-8">
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="flex-1 min-w-0">
              <h1 className="font-heading text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl break-words">
                Welcome back, {adminInfo?.username}! 👋
              </h1>
              <p className="mt-2 text-sm sm:text-base text-primary-foreground/90 break-words">
                Here's what's happening with Edans Impact today. Manage your content,
                track performance, and make an impact.
              </p>
              {usingFallback && (
                <div className="mt-2 text-xs sm:text-sm text-primary-foreground/70 bg-primary-foreground/10 px-3 py-1 rounded-full inline-block">
                  Using cached data
                </div>
              )}
            </div>
            <div className="flex items-center justify-start lg:justify-end">
              <Settings className="h-8 w-8 sm:h-10 sm:w-10 opacity-80 flex-shrink-0" />
            </div>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5"></div>
        </div>

        {/* Stats Grid */}
        <div className="w-full">
          <h2 className="mb-4 font-heading text-lg sm:text-xl font-bold text-foreground">
            Overview
          </h2>
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => (
              <div
                key={stat.title}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-2 flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground break-words">
                      {stat.title}
                    </p>
                    <p className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground break-all">
                      {stat.value}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-medium whitespace-nowrap ${
                          stat.change.includes("+")
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground break-words">
                        {stat.description}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`rounded-xl p-2 sm:p-2.5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0 ${stat.bgColor}`}
                  >
                    <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Recent Activity Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-2 w-full">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                Quick Actions
              </h2>
              <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                <Link to="/admin/programs" className="text-xs sm:text-sm">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.href}
                  className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={`rounded-lg p-2 sm:p-2.5 flex-shrink-0 ${
                        action.color === "primary"
                          ? "bg-primary/10 text-primary"
                          : action.color === "secondary"
                          ? "bg-secondary/10 text-secondary"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm sm:text-base break-words">{action.title}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground transition-all group-hover:translate-x-1">
                        Get started
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6 w-full">
            {/* Recent Messages */}
            <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                  Recent Messages
                </h3>
                <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                  <Link to="/admin/contact" className="text-xs">
                    View All
                  </Link>
                </Button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border/30 bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-foreground break-words">
                          New message from user #{i}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {i === 1 ? "2 hours ago" : i === 2 ? "Yesterday" : "3 days ago"}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary whitespace-nowrap flex-shrink-0">
                        New
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Volunteers */}
            <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                  New Volunteers
                </h3>
                <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                  <Link to="/admin/volunteers" className="text-xs">
                    View All
                  </Link>
                </Button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border/30 bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-foreground break-words">
                          Volunteer Application #{i}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {i === 1 ? "Today" : i === 2 ? "Yesterday" : "3 days ago"}
                        </p>
                      </div>
                      <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary whitespace-nowrap flex-shrink-0">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* System Status */}
          <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-5">
            <h3 className="mb-4 font-heading text-base sm:text-lg font-bold text-foreground">
              System Status
            </h3>
            <div className="space-y-3">
              {[
                { label: "API Server", status: "Online", color: "text-green-600" },
                { label: "Database", status: "Online", color: "text-green-600" },
                { label: "Storage", status: "90% used", color: "text-amber-600" },
                { label: "Backup", status: "Last: 2h ago", color: "text-blue-600" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2 py-2">
                  <span className="text-xs sm:text-sm text-muted-foreground break-words">{item.label}</span>
                  <span className={`text-xs sm:text-sm font-medium ${item.color} whitespace-nowrap`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Donations */}
          <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                Recent Donations
              </h3>
              <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                <Link to="/admin/donations" className="text-xs">
                  View All
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { amount: "$500", donor: "Anonymous", time: "Today" },
                { amount: "$250", donor: "John Doe", time: "Yesterday" },
                { amount: "$100", donor: "Jane Smith", time: "2 days ago" },
              ].map((donation) => (
                <div
                  key={donation.donor}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/30 bg-muted/20 p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base">{donation.amount}</p>
                    <p className="text-xs text-muted-foreground break-words">{donation.donor}</p>
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">{donation.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}