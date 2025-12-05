import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Plus,
  Trash2,
  Upload,
  Save,
  Trophy,
  Users,
  BookOpen,
  Globe,
} from "lucide-react";

interface HomepageData {
  heroTitle: string;
  heroSubtitle: string;
  impactStats: Array<{
    id?: string;
    value: string;
    label: string;
    icon: string;
  }>;
  featuredPrograms: Array<{
    id?: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

const availableIcons = ["Trophy", "Users", "BookOpen", "Globe", "Heart", "Star"];

export default function AdminHomepage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homepageData, setHomepageData] = useState<HomepageData>({
    heroTitle: "Nurturing Young Innovators in Ghana",
    heroSubtitle: "Empowering less-privileged students through STEM education, mentorship, and innovation programs.",
    impactStats: [
      { id: "1", value: "500+", label: "Students Impacted", icon: "Users" },
      { id: "2", value: "50+", label: "Workshops Conducted", icon: "BookOpen" },
      { id: "3", value: "30+", label: "Schools Reached", icon: "Globe" },
    ],
    featuredPrograms: [
      {
        id: "1",
        title: "Coding Bootcamps",
        description: "Hands-on programming workshops for beginners",
        icon: "Trophy",
      },
      {
        id: "2",
        title: "Mentorship Program",
        description: "One-on-one guidance from industry professionals",
        icon: "Users",
      },
    ],
  });

  useEffect(() => {
    checkAuth();
    fetchHomepageData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  };

  const fetchHomepageData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/homepage", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && !data.isFallback) {
        setHomepageData(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch homepage data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/homepage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(homepageData),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Homepage updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update homepage",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addImpactStat = () => {
    setHomepageData({
      ...homepageData,
      impactStats: [
        ...homepageData.impactStats,
        { id: Date.now().toString(), value: "", label: "", icon: "Users" },
      ],
    });
  };

  const updateImpactStat = (index: number, field: string, value: string) => {
    const updatedStats = [...homepageData.impactStats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setHomepageData({ ...homepageData, impactStats: updatedStats });
  };

  const removeImpactStat = (index: number) => {
    const updatedStats = homepageData.impactStats.filter((_, i) => i !== index);
    setHomepageData({ ...homepageData, impactStats: updatedStats });
  };

  const addFeaturedProgram = () => {
    setHomepageData({
      ...homepageData,
      featuredPrograms: [
        ...homepageData.featuredPrograms,
        { id: Date.now().toString(), title: "", description: "", icon: "Trophy" },
      ],
    });
  };

  const updateFeaturedProgram = (index: number, field: string, value: string) => {
    const updatedPrograms = [...homepageData.featuredPrograms];
    updatedPrograms[index] = { ...updatedPrograms[index], [field]: value };
    setHomepageData({ ...homepageData, featuredPrograms: updatedPrograms });
  };

  const removeFeaturedProgram = (index: number) => {
    const updatedPrograms = homepageData.featuredPrograms.filter((_, i) => i !== index);
    setHomepageData({ ...homepageData, featuredPrograms: updatedPrograms });
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Trophy: <Trophy className="h-4 w-4" />,
      Users: <Users className="h-4 w-4" />,
      BookOpen: <BookOpen className="h-4 w-4" />,
      Globe: <Globe className="h-4 w-4" />,
      Heart: <Heart className="h-4 w-4" />,
      Star: <Star className="h-4 w-4" />,
    };
    return icons[iconName] || <Trophy className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Homepage</h1>
          <p className="text-muted-foreground">Customize your homepage content</p>
        </div>
        <Button variant="primary-gradient" onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Hero Title</Label>
              <Input
                value={homepageData.heroTitle}
                onChange={(e) =>
                  setHomepageData({ ...homepageData, heroTitle: e.target.value })
                }
                placeholder="Main headline"
              />
            </div>
            <div className="space-y-2">
              <Label>Hero Subtitle</Label>
              <Textarea
                value={homepageData.heroSubtitle}
                onChange={(e) =>
                  setHomepageData({ ...homepageData, heroSubtitle: e.target.value })
                }
                rows={3}
                placeholder="Supporting description"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border p-6">
              <h2 className="font-heading text-2xl font-bold">
                {homepageData.heroTitle}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {homepageData.heroSubtitle}
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {homepageData.impactStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Impact Statistics</CardTitle>
          <Button size="sm" variant="outline" onClick={addImpactStat}>
            <Plus className="mr-2 h-4 w-4" />
            Add Statistic
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {homepageData.impactStats.map((stat, index) => (
              <div
                key={stat.id || index}
                className="flex items-center gap-4 rounded-lg border border-border p-4"
              >
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) =>
                        updateImpactStat(index, "value", e.target.value)
                      }
                      placeholder="500+"
                    />
                  </div>
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) =>
                        updateImpactStat(index, "label", e.target.value)
                      }
                      placeholder="Students Impacted"
                    />
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <select
                      value={stat.icon}
                      onChange={(e) =>
                        updateImpactStat(index, "icon", e.target.value)
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {availableIcons.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImpactStat(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Programs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Featured Programs</CardTitle>
          <Button size="sm" variant="outline" onClick={addFeaturedProgram}>
            <Plus className="mr-2 h-4 w-4" />
            Add Program
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {homepageData.featuredPrograms.map((program, index) => (
              <div
                key={program.id || index}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      {getIconComponent(program.icon)}
                    </div>
                    <div className="flex-1">
                      <Input
                        value={program.title}
                        onChange={(e) =>
                          updateFeaturedProgram(index, "title", e.target.value)
                        }
                        placeholder="Program Title"
                        className="border-none p-0 text-lg font-semibold focus-visible:ring-0"
                      />
                      <Textarea
                        value={program.description}
                        onChange={(e) =>
                          updateFeaturedProgram(index, "description", e.target.value)
                        }
                        placeholder="Program description"
                        className="mt-1 border-none p-0 text-sm text-muted-foreground focus-visible:ring-0"
                        rows={2}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeaturedProgram(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Label className="text-xs">Icon:</Label>
                  <select
                    value={program.icon}
                    onChange={(e) =>
                      updateFeaturedProgram(index, "icon", e.target.value)
                    }
                    className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                  >
                    {availableIcons.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper icon component
const Heart = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const Star = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);