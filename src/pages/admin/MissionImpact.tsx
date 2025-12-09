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
  Save,
  Target,
  Lightbulb,
  Users,
  GraduationCap,
  MapPin,
  TrendingUp,
  Award,
  Heart,
  BookOpen,
  Zap,
  Quote,
  Globe,
  ArrowUpDown,
} from "lucide-react";

interface ImpactMetric {
  id?: string;
  number: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

interface SuccessStory {
  id?: string;
  name: string;
  school: string;
  story: string;
  quote: string;
}

interface SDGAlignment {
  id?: string;
  number: number;
  title: string;
  color: string;
}

interface MissionImpactData {
  missionStatement: string;
  visionStatement: string;
  impactMetrics: ImpactMetric[];
  successStories: SuccessStory[];
  sdgAlignments: SDGAlignment[];
}

const availableIcons = [
  "GraduationCap",
  "Lightbulb",
  "Users",
  "MapPin",
  "TrendingUp",
  "Award",
  "Heart",
  "Target",
  "BookOpen",
  "Zap",
  "Globe",
];

const availableColors = [
  "primary",
  "secondary",
  "accent",
  "primary-light",
];

const sdgColors = [
  "bg-red-500",
  "bg-rose-600",
  "bg-orange-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-blue-500",
  "bg-teal-500",
  "bg-green-500",
  "bg-lime-500",
  "bg-yellow-500",
  "bg-amber-500",
  "bg-stone-500",
  "bg-neutral-500",
  "bg-slate-500",
  "bg-gray-500",
];

const IconComponent = ({ name }: { name: string }) => {
  const iconMap: Record<string, React.ReactNode> = {
    GraduationCap: <GraduationCap className="h-4 w-4" />,
    Lightbulb: <Lightbulb className="h-4 w-4" />,
    Users: <Users className="h-4 w-4" />,
    MapPin: <MapPin className="h-4 w-4" />,
    TrendingUp: <TrendingUp className="h-4 w-4" />,
    Award: <Award className="h-4 w-4" />,
    Heart: <Heart className="h-4 w-4" />,
    Target: <Target className="h-4 w-4" />,
    BookOpen: <BookOpen className="h-4 w-4" />,
    Zap: <Zap className="h-4 w-4" />,
    Globe: <Globe className="h-4 w-4" />,
  };
  return iconMap[name] || <Target className="h-4 w-4" />;
};

export default function AdminMissionImpact() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [missionImpactData, setMissionImpactData] = useState<MissionImpactData>({
    missionStatement: 'To promote innovation, empower young people, and provide educational and developmental opportunities that help individuals identify challenges, create solutions, and improve their social and economic well-being.',
    visionStatement: 'A society where young people become innovative thinkers who create sustainable solutions for their communities, driving positive change across Ghana and beyond.',
    impactMetrics: [
      {
        id: "1",
        number: "2,500+",
        label: "Students Reached",
        description: "Young minds engaged through our various programs",
        icon: "GraduationCap",
        color: "primary",
      },
      {
        id: "2",
        number: "50+",
        label: "Programs Delivered",
        description: "Workshops, summits, and training sessions completed",
        icon: "Lightbulb",
        color: "secondary",
      },
      {
        id: "3",
        number: "100+",
        label: "Volunteers",
        description: "Dedicated individuals contributing their time",
        icon: "Users",
        color: "accent",
      },
    ],
    successStories: [
      {
        id: "1",
        name: "Kofi Mensah",
        school: "Achimota School",
        story: "After participating in our Innovation Summit, Kofi developed a solar-powered water purification system that is now being piloted in his community.",
        quote: "Edans Impact showed me that my ideas can change lives. I never thought a student like me could create something so meaningful.",
      },
      {
        id: "2",
        name: "Akua Addo",
        school: "Wesley Girls' High School",
        story: "Through our STEM workshops, Akua discovered her passion for coding and has since created an app that helps farmers predict weather patterns.",
        quote: "The mentorship I received helped me believe in myself and pursue my dreams in technology.",
      },
    ],
    sdgAlignments: [
      { id: "1", number: 4, title: "Quality Education", color: "bg-red-500" },
      { id: "2", number: 8, title: "Decent Work & Economic Growth", color: "bg-rose-600" },
      { id: "3", number: 9, title: "Industry, Innovation & Infrastructure", color: "bg-orange-500" },
    ],
  });

  useEffect(() => {
    checkAuth();
    fetchMissionImpactData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  };

  const fetchMissionImpactData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("https://edans-impact-backend.onrender.com/api/mission-impact", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      if (data.success && !data.isFallback) {
        setMissionImpactData(data.data);
      } else if (data.success && data.data) {
        setMissionImpactData(data.data);
      }
    } catch (error) {
      console.error("Error fetching mission impact data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch mission impact page data",
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
      const response = await fetch("https://edans-impact-backend.onrender.com/api/mission-impact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(missionImpactData),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "Success!",
          description: "Mission impact page updated successfully",
        });
      } else {
        throw new Error(data.message || "Failed to update");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update mission impact page",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Mission & Vision Methods
  const updateMissionStatement = (value: string) => {
    setMissionImpactData({ ...missionImpactData, missionStatement: value });
  };

  const updateVisionStatement = (value: string) => {
    setMissionImpactData({ ...missionImpactData, visionStatement: value });
  };

  // Impact Metrics Methods
  const addImpactMetric = () => {
    const newMetric: ImpactMetric = {
      id: Date.now().toString(),
      number: "",
      label: "",
      description: "",
      icon: "GraduationCap",
      color: "primary",
    };
    setMissionImpactData({
      ...missionImpactData,
      impactMetrics: [...missionImpactData.impactMetrics, newMetric],
    });
  };

  const updateImpactMetric = (index: number, field: keyof ImpactMetric, value: string) => {
    const updatedMetrics = [...missionImpactData.impactMetrics];
    updatedMetrics[index] = { ...updatedMetrics[index], [field]: value };
    setMissionImpactData({ ...missionImpactData, impactMetrics: updatedMetrics });
  };

  const removeImpactMetric = (index: number) => {
    const updatedMetrics = missionImpactData.impactMetrics.filter((_, i) => i !== index);
    setMissionImpactData({ ...missionImpactData, impactMetrics: updatedMetrics });
  };

  const moveImpactMetric = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === missionImpactData.impactMetrics.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedMetrics = [...missionImpactData.impactMetrics];
    const [movedMetric] = updatedMetrics.splice(index, 1);
    updatedMetrics.splice(newIndex, 0, movedMetric);

    setMissionImpactData({ ...missionImpactData, impactMetrics: updatedMetrics });
  };

  // Success Stories Methods
  const addSuccessStory = () => {
    const newStory: SuccessStory = {
      id: Date.now().toString(),
      name: "",
      school: "",
      story: "",
      quote: "",
    };
    setMissionImpactData({
      ...missionImpactData,
      successStories: [...missionImpactData.successStories, newStory],
    });
  };

  const updateSuccessStory = (index: number, field: keyof SuccessStory, value: string) => {
    const updatedStories = [...missionImpactData.successStories];
    updatedStories[index] = { ...updatedStories[index], [field]: value };
    setMissionImpactData({ ...missionImpactData, successStories: updatedStories });
  };

  const removeSuccessStory = (index: number) => {
    const updatedStories = missionImpactData.successStories.filter((_, i) => i !== index);
    setMissionImpactData({ ...missionImpactData, successStories: updatedStories });
  };

  const moveSuccessStory = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === missionImpactData.successStories.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedStories = [...missionImpactData.successStories];
    const [movedStory] = updatedStories.splice(index, 1);
    updatedStories.splice(newIndex, 0, movedStory);

    setMissionImpactData({ ...missionImpactData, successStories: updatedStories });
  };

  // SDG Alignments Methods
  const addSDGAlignment = () => {
    const newSDG: SDGAlignment = {
      id: Date.now().toString(),
      number: 1,
      title: "",
      color: "bg-red-500",
    };
    setMissionImpactData({
      ...missionImpactData,
      sdgAlignments: [...missionImpactData.sdgAlignments, newSDG],
    });
  };

  const updateSDGAlignment = (index: number, field: keyof SDGAlignment, value: string | number) => {
    const updatedSDGs = [...missionImpactData.sdgAlignments];
    updatedSDGs[index] = { ...updatedSDGs[index], [field]: value };
    setMissionImpactData({ ...missionImpactData, sdgAlignments: updatedSDGs });
  };

  const removeSDGAlignment = (index: number) => {
    const updatedSDGs = missionImpactData.sdgAlignments.filter((_, i) => i !== index);
    setMissionImpactData({ ...missionImpactData, sdgAlignments: updatedSDGs });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="space-y-6 px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground break-words">
              Mission & Impact Page
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage mission impact page content
            </p>
          </div>
          <Button 
            variant="primary-gradient" 
            onClick={handleSave} 
            disabled={saving}
            className="w-full sm:w-auto shrink-0"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="w-full min-w-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg sm:text-xl">Mission Statement</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={missionImpactData.missionStatement}
                onChange={(e) => updateMissionStatement(e.target.value)}
                rows={4}
                placeholder="Enter mission statement..."
                className="w-full resize-none min-h-[120px]"
              />
            </CardContent>
          </Card>

          <Card className="w-full min-w-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-secondary" />
                <CardTitle className="text-lg sm:text-xl">Vision Statement</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={missionImpactData.visionStatement}
                onChange={(e) => updateVisionStatement(e.target.value)}
                rows={4}
                placeholder="Enter vision statement..."
                className="w-full resize-none min-h-[120px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Impact Metrics Section */}
        <Card className="w-full">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">Impact Metrics</CardTitle>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={addImpactMetric}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Metric
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missionImpactData.impactMetrics.map((metric, index) => (
                <div
                  key={metric.id || index}
                  className="rounded-lg border border-border p-4 w-full"
                >
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full min-w-0">
                      <div className="space-y-2">
                        <Label className="text-sm">Number</Label>
                        <Input
                          value={metric.number}
                          onChange={(e) =>
                            updateImpactMetric(index, "number", e.target.value)
                          }
                          placeholder="2,500+"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Label</Label>
                        <Input
                          value={metric.label}
                          onChange={(e) =>
                            updateImpactMetric(index, "label", e.target.value)
                          }
                          placeholder="Students Reached"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Icon</Label>
                        <select
                          value={metric.icon}
                          onChange={(e) =>
                            updateImpactMetric(index, "icon", e.target.value)
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
                      <div className="space-y-2">
                        <Label className="text-sm">Color</Label>
                        <select
                          value={metric.color}
                          onChange={(e) =>
                            updateImpactMetric(index, "color", e.target.value)
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {availableColors.map((color) => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Description</Label>
                      <Input
                        value={metric.description}
                        onChange={(e) =>
                          updateImpactMetric(index, "description", e.target.value)
                        }
                        placeholder="Young minds engaged through our various programs"
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Preview:</span>
                        <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
                          <div className="rounded-md bg-primary/10 p-1.5">
                            <IconComponent name={metric.icon} />
                          </div>
                          <div>
                            <div className="font-semibold">{metric.number || "N/A"}</div>
                            <div className="text-xs text-muted-foreground">{metric.label || "Label"}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveImpactMetric(index, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUpDown className="h-3 w-3 rotate-90" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveImpactMetric(index, "down")}
                          disabled={index === missionImpactData.impactMetrics.length - 1}
                        >
                          <ArrowUpDown className="h-3 w-3 -rotate-90" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImpactMetric(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Stories Section */}
        <Card className="w-full">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">Success Stories</CardTitle>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={addSuccessStory}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Story
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missionImpactData.successStories.map((story, index) => (
                <div
                  key={story.id || index}
                  className="rounded-lg border border-border p-4 w-full"
                >
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Name</Label>
                        <Input
                          value={story.name}
                          onChange={(e) =>
                            updateSuccessStory(index, "name", e.target.value)
                          }
                          placeholder="Kofi Mensah"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">School</Label>
                        <Input
                          value={story.school}
                          onChange={(e) =>
                            updateSuccessStory(index, "school", e.target.value)
                          }
                          placeholder="Achimota School"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Story</Label>
                      <Textarea
                        value={story.story}
                        onChange={(e) =>
                          updateSuccessStory(index, "story", e.target.value)
                        }
                        placeholder="Share their success story..."
                        rows={3}
                        className="w-full resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">
                        <Quote className="inline h-4 w-4 mr-1" />
                        Quote
                      </Label>
                      <Textarea
                        value={story.quote}
                        onChange={(e) =>
                          updateSuccessStory(index, "quote", e.target.value)
                        }
                        placeholder="Inspirational quote from the student..."
                        rows={2}
                        className="w-full resize-none"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Preview initials:</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold">
                          {story.name.split(' ').map(n => n[0]).join('').slice(0, 2) || "XX"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveSuccessStory(index, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUpDown className="h-3 w-3 rotate-90" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveSuccessStory(index, "down")}
                          disabled={index === missionImpactData.successStories.length - 1}
                        >
                          <ArrowUpDown className="h-3 w-3 -rotate-90" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSuccessStory(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SDG Alignments Section */}
        <Card className="w-full">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">SDG Alignments</CardTitle>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={addSDGAlignment}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add SDG
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {missionImpactData.sdgAlignments.map((sdg, index) => (
                <div
                  key={sdg.id || index}
                  className="rounded-lg border border-border p-4 w-full min-w-0"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-3 rounded-lg ${sdg.color} px-3 py-2 text-white`}>
                        <span className="font-bold">SDG {sdg.number}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSDGAlignment(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">SDG Number</Label>
                      <Input
                        type="number"
                        min="1"
                        max="17"
                        value={sdg.number}
                        onChange={(e) =>
                          updateSDGAlignment(index, "number", parseInt(e.target.value) || 1)
                        }
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Title</Label>
                      <Input
                        value={sdg.title}
                        onChange={(e) =>
                          updateSDGAlignment(index, "title", e.target.value)
                        }
                        placeholder="Quality Education"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Color</Label>
                      <select
                        value={sdg.color}
                        onChange={(e) =>
                          updateSDGAlignment(index, "color", e.target.value)
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {sdgColors.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="pt-2">
                      <div className="text-xs text-muted-foreground">Preview:</div>
                      <div className={`mt-2 flex items-center gap-3 rounded-lg ${sdg.color} px-4 py-3 text-white`}>
                        <span className="font-heading text-xl font-bold">SDG {sdg.number}</span>
                        <span className="text-sm">{sdg.title || "Title"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}