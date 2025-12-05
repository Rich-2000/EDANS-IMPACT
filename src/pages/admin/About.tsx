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
  User,
  Briefcase,
  Linkedin,
  Globe,
} from "lucide-react";

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
  order: number;
}

interface Value {
  id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface AboutData {
  story: string;
  values: Value[];
  team: TeamMember[];
}

const availableIcons = ["Users", "Target", "Heart", "Shield", "Lightbulb", "Globe"];

export default function AdminAbout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutData, setAboutData] = useState<AboutData>({
    story: "Our journey began with a simple mission: to empower young minds in Ghana through STEM education. Founded in 2020, we have worked tirelessly to bridge the digital divide and provide opportunities for less-privileged students.",
    values: [
      {
        id: "1",
        title: "Innovation",
        description: "Fostering creative thinking and problem-solving",
        icon: "Lightbulb",
        order: 1,
      },
      {
        id: "2",
        title: "Community",
        description: "Building strong, supportive networks",
        icon: "Users",
        order: 2,
      },
      {
        id: "3",
        title: "Excellence",
        description: "Striving for the highest quality in all we do",
        icon: "Target",
        order: 3,
      },
    ],
    team: [
      {
        id: "1",
        name: "John Doe",
        role: "Executive Director",
        bio: "Passionate educator with 10+ years experience",
        image: "",
        linkedin: "",
        order: 1,
      },
      {
        id: "2",
        name: "Jane Smith",
        role: "Program Manager",
        bio: "STEM education specialist and mentor",
        image: "",
        linkedin: "",
        order: 2,
      },
    ],
  });

  useEffect(() => {
    checkAuth();
    fetchAboutData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  };

  const fetchAboutData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("https://edans-impact-backend.onrender.com/api/about", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && !data.isFallback) {
        setAboutData(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch about page data",
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
      const response = await fetch("https://edans-impact-backend.onrender.com/api/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(aboutData),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "About page updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update about page",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateStory = (value: string) => {
    setAboutData({ ...aboutData, story: value });
  };

  // Values Methods
  const addValue = () => {
    const newValue: Value = {
      id: Date.now().toString(),
      title: "",
      description: "",
      icon: "Heart",
      order: aboutData.values.length + 1,
    };
    setAboutData({
      ...aboutData,
      values: [...aboutData.values, newValue],
    });
  };

  const updateValue = (index: number, field: keyof Value, value: string) => {
    const updatedValues = [...aboutData.values];
    updatedValues[index] = { ...updatedValues[index], [field]: value };
    setAboutData({ ...aboutData, values: updatedValues });
  };

  const removeValue = (index: number) => {
    const updatedValues = aboutData.values.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, values: updatedValues });
  };

  const moveValue = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === aboutData.values.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedValues = [...aboutData.values];
    const [movedValue] = updatedValues.splice(index, 1);
    updatedValues.splice(newIndex, 0, movedValue);

    // Update order
    updatedValues.forEach((value, i) => {
      value.order = i + 1;
    });

    setAboutData({ ...aboutData, values: updatedValues });
  };

  // Team Methods
  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: "",
      role: "",
      bio: "",
      image: "",
      linkedin: "",
      order: aboutData.team.length + 1,
    };
    setAboutData({
      ...aboutData,
      team: [...aboutData.team, newMember],
    });
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const updatedTeam = [...aboutData.team];
    updatedTeam[index] = { ...updatedTeam[index], [field]: value };
    setAboutData({ ...aboutData, team: updatedTeam });
  };

  const removeTeamMember = (index: number) => {
    const updatedTeam = aboutData.team.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, team: updatedTeam });
  };

  const moveTeamMember = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === aboutData.team.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedTeam = [...aboutData.team];
    const [movedMember] = updatedTeam.splice(index, 1);
    updatedTeam.splice(newIndex, 0, movedMember);

    // Update order
    updatedTeam.forEach((member, i) => {
      member.order = i + 1;
    });

    setAboutData({ ...aboutData, team: updatedTeam });
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
          <h1 className="font-heading text-3xl font-bold text-foreground">About Page</h1>
          <p className="text-muted-foreground">Manage about page content</p>
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

      {/* Story Section */}
      <Card>
        <CardHeader>
          <CardTitle>Our Story</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={aboutData.story}
            onChange={(e) => updateStory(e.target.value)}
            rows={8}
            placeholder="Tell your organization's story..."
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      {/* Values Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Our Values</CardTitle>
          <Button size="sm" variant="outline" onClick={addValue}>
            <Plus className="mr-2 h-4 w-4" />
            Add Value
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aboutData.values.map((value, index) => (
              <div
                key={value.id || index}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={value.title}
                        onChange={(e) =>
                          updateValue(index, "title", e.target.value)
                        }
                        placeholder="Innovation"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Description</Label>
                      <Input
                        value={value.description}
                        onChange={(e) =>
                          updateValue(index, "description", e.target.value)
                        }
                        placeholder="Fostering creative thinking..."
                      />
                    </div>
                    <div>
                      <Label>Icon</Label>
                      <select
                        value={value.icon}
                        onChange={(e) =>
                          updateValue(index, "icon", e.target.value)
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
                    <div>
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={value.order}
                        onChange={(e) =>
                          updateValue(index, "order", e.target.value)
                        }
                        className="w-20"
                      />
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveValue(index, "up")}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveValue(index, "down")}
                      disabled={index === aboutData.values.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeValue(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Our Team</CardTitle>
          <Button size="sm" variant="outline" onClick={addTeamMember}>
            <Plus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {aboutData.team.map((member, index) => (
              <div
                key={member.id || index}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={member.name}
                          onChange={(e) =>
                            updateTeamMember(index, "name", e.target.value)
                          }
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Input
                          value={member.role}
                          onChange={(e) =>
                            updateTeamMember(index, "role", e.target.value)
                          }
                          placeholder="Executive Director"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Bio</Label>
                      <Textarea
                        value={member.bio}
                        onChange={(e) =>
                          updateTeamMember(index, "bio", e.target.value)
                        }
                        placeholder="Brief biography..."
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Image URL</Label>
                        <Input
                          value={member.image}
                          onChange={(e) =>
                            updateTeamMember(index, "image", e.target.value)
                          }
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                      <div>
                        <Label>LinkedIn</Label>
                        <Input
                          value={member.linkedin}
                          onChange={(e) =>
                            updateTeamMember(index, "linkedin", e.target.value)
                          }
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <Label>Order</Label>
                        <Input
                          type="number"
                          value={member.order}
                          onChange={(e) =>
                            updateTeamMember(index, "order", e.target.value)
                          }
                          className="w-20"
                        />
                      </div>
                      <div className="flex gap-2 mt-6">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveTeamMember(index, "up")}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveTeamMember(index, "down")}
                          disabled={index === aboutData.team.length - 1}
                        >
                          ↓
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTeamMember(index)}
                    className="ml-4 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}