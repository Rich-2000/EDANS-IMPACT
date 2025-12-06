import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, X, Loader2 } from "lucide-react";

interface Program {
  _id: string;
  title: string;
  description: string;
  features: string[];
  audience: string;
  isActive: boolean;
}

export default function AdminPrograms() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    features: "",
    audience: "",
    isActive: true,
  });

  useEffect(() => {
    checkAuth();
    fetchPrograms();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  };

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("https://edans-impact-backend.onrender.com/api/programs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPrograms(data.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch programs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    const programData = {
      ...formData,
      features: formData.features.split(",").map((f) => f.trim()),
    };

    try {
      const url = editingProgram
        ? `https://edans-impact-backend.onrender.com/api/programs/${editingProgram._id}`
        : "https://edans-impact-backend.onrender.com/api/programs";

      const response = await fetch(url, {
        method: editingProgram ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(programData),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: `Program ${editingProgram ? "updated" : "created"} successfully`,
        });
        setShowModal(false);
        resetForm();
        fetchPrograms();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save program",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description,
      features: program.features.join(", "),
      audience: program.audience,
      isActive: program.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this program?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`https://edans-impact-backend.onrender.com/api/programs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({ title: "Program deleted successfully" });
        fetchPrograms();
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingProgram(null);
    setFormData({
      title: "",
      description: "",
      features: "",
      audience: "",
      isActive: true,
    });
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="space-y-6 px-4 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground break-words">Programs</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your programs</p>
          </div>
          <Button
            variant="primary-gradient"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="w-full sm:w-auto shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Program
          </Button>
        </div>

        {/* Programs List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {programs.map((program) => (
              <div
                key={program._id}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md w-full min-w-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground break-words">
                      {program.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 break-words">
                      {program.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {program.features.slice(0, 3).map((feature, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary break-words"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground break-words">
                      {program.audience}
                    </p>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(program)}
                      className="flex-1 sm:flex-none"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(program._id)}
                      className="flex-1 sm:flex-none"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 max-h-[90vh] overflow-y-auto">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-xl sm:text-2xl font-bold break-words">
                  {editingProgram ? "Edit Program" : "Add New Program"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="rounded-lg p-2 hover:bg-muted shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Program Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    required
                    className="w-full resize-none"
                  />
                </div>

                <div>
                  <Label>Features (comma-separated)</Label>
                  <Input
                    value={formData.features}
                    onChange={(e) =>
                      setFormData({ ...formData, features: e.target.value })
                    }
                    placeholder="Feature 1, Feature 2, Feature 3"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Target Audience</Label>
                  <Input
                    value={formData.audience}
                    onChange={(e) =>
                      setFormData({ ...formData, audience: e.target.value })
                    }
                    placeholder="e.g., JHS & SHS students"
                    required
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isActive">Active (visible on website)</Label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary-gradient" className="flex-1">
                    {editingProgram ? "Update" : "Create"} Program
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}