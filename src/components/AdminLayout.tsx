import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Image,
  Mail,
  Heart,
  LogOut,
  Home,
  Info,
  Trophy,
  Menu,
  Target,
  X,
} from "lucide-react";
import logo from "@/assets/images/logo.png";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Homepage", href: "/admin/homepage", icon: Home },
  { name: "About Page", href: "/admin/about", icon: Info },
  { name: "Programs", href: "/admin/programs", icon: Trophy },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Blog", href: "/admin/blog", icon: BookOpen },
  { name: "Gallery", href: "/admin/gallery", icon: Image },
  { name: "Contact", href: "/admin/contact", icon: Mail },
  { name: "Volunteers", href: "/admin/volunteers", icon: Users },
  { name: "Donations", href: "/admin/donations", icon: Heart },
  { name: "Mission & Impact", href: "/admin/mission-impact", icon: Target },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const admin = localStorage.getItem("adminInfo");

    if (!token || !admin) {
      navigate("/admin/login");
      return;
    }

    setAdminInfo(JSON.parse(admin));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    toast({ title: "Logged Out Successfully" });
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-2 border-b border-border px-6">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <div className="font-heading text-lg font-bold">
            <span className="text-primary">EDANS</span>{" "}
            <span className="text-secondary">Impact</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-3 rounded-lg bg-muted/50 p-3">
            <div className="text-xs text-muted-foreground">Logged in as</div>
            <div className="mt-1 font-medium text-foreground">
              {adminInfo?.username}
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex-1" />
            <Button variant="outline" size="sm" asChild>
              <Link to="/" target="_blank">
                View Website
              </Link>
            </Button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}