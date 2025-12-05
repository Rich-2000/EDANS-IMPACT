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
  Users,
  Mail,
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
          fetch("http://localhost:5000/api/programs", { headers }),
          fetch("http://localhost:5000/api/events", { headers }),
          fetch("http://localhost:5000/api/blog", { headers }),
          fetch("http://localhost:5000/api/gallery", { headers }),
          fetch("http://localhost:5000/api/contact", { headers }),
          fetch("http://localhost:5000/api/volunteer", { headers }),
          fetch("http://localhost:5000/api/donations", { headers }),
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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-secondary p-6 text-primary-foreground shadow-lg lg:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight lg:text-3xl">
              Welcome back, {adminInfo?.username}! 👋
            </h1>
            <p className="mt-2 max-w-2xl text-primary-foreground/90">
              Here's what's happening with Edans Impact today. Manage your content,
              track performance, and make an impact.
            </p>
            {usingFallback && (
              <div className="mt-2 text-sm text-primary-foreground/70 bg-primary-foreground/10 px-3 py-1 rounded-full inline-block">
                
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Settings className="h-10 w-10 opacity-80" />
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5"></div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
          Overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="font-heading text-2xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium ${
                        stat.change.includes("+")
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stat.description}
                    </span>
                  </div>
                </div>
                <div
                  className={`rounded-xl p-2.5 transition-transform duration-300 group-hover:scale-110 ${stat.bgColor}`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions & Recent Activity Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Quick Actions
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/programs">View All</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.href}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-lg p-2.5 ${
                      action.color === "primary"
                        ? "bg-primary/10 text-primary"
                        : action.color === "secondary"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{action.title}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground transition-all group-hover:translate-x-1">
                      Get started
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          {/* Recent Messages */}
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-foreground">
                Recent Messages
              </h3>
              <Button variant="ghost" size="sm" asChild>
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
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        New message from user #{i}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 1 ? "2 hours ago" : i === 2 ? "Yesterday" : "3 days ago"}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      New
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Volunteers */}
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-foreground">
                New Volunteers
              </h3>
              <Button variant="ghost" size="sm" asChild>
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
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        Volunteer Application #{i}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 1 ? "Today" : i === 2 ? "Yesterday" : "3 days ago"}
                      </p>
                    </div>
                    <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
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
      <div className="grid gap-6 lg:grid-cols-2">
        {/* System Status */}
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <h3 className="mb-4 font-heading text-lg font-bold text-foreground">
            System Status
          </h3>
          <div className="space-y-3">
            {[
              { label: "API Server", status: "Online", color: "text-green-600" },
              { label: "Database", status: "Online", color: "text-green-600" },
              { label: "Storage", status: "90% used", color: "text-amber-600" },
              { label: "Backup", status: "Last: 2h ago", color: "text-blue-600" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`text-sm font-medium ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-foreground">
              Recent Donations
            </h3>
            <Button variant="ghost" size="sm" asChild>
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
                className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/20 p-3"
              >
                <div>
                  <p className="font-medium text-foreground">{donation.amount}</p>
                  <p className="text-xs text-muted-foreground">{donation.donor}</p>
                </div>
                <span className="text-sm text-muted-foreground">{donation.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}