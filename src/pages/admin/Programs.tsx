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
      const response = await fetch("http://localhost:5000/api/programs", {
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
        ? `http://localhost:5000/api/programs/${editingProgram._id}`
        : "http://localhost:5000/api/programs";

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
      const response = await fetch(`http://localhost:5000/api/programs/${id}`, {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Programs</h1>
          <p className="text-muted-foreground">Manage your programs</p>
        </div>
        <Button
          variant="primary-gradient"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
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
        <div className="grid gap-4 md:grid-cols-2">
          {programs.map((program) => (
            <div
              key={program._id}
              className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {program.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {program.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {program.features.slice(0, 3).map((feature, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {program.audience}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(program)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(program._id)}
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
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">
                {editingProgram ? "Edit Program" : "Add New Program"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-lg p-2 hover:bg-muted"
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

              <div className="flex gap-3">
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
  );
}
