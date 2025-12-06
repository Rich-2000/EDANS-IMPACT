import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  X,
  Plus,
  Loader2,
} from "lucide-react";

interface GalleryItem {
  _id: string;
  type: "image" | "video";
  url: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}

const categories = ["Events", "Workshops", "Programs", "Community", "Stories"];

export default function AdminGallery() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    title: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    checkAuth();
    fetchGalleryItems();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  };

  const fetchGalleryItems = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("https://edans-impact-backend.onrender.com/api/gallery", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setItems(data.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch gallery items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadForm.file);
    formData.append("title", uploadForm.title);
    formData.append("description", uploadForm.description);
    formData.append("category", uploadForm.category);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("https://edans-impact-backend.onrender.com/api/gallery/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Media uploaded successfully",
        });
        setShowUploadModal(false);
        setUploadForm({ file: null, title: "", description: "", category: "" });
        fetchGalleryItems();
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Could not upload media",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`https://edans-impact-backend.onrender.com/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({ title: "Deleted successfully" });
        fetchGalleryItems();
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        variant: "destructive",
      });
    }
  };

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="space-y-6 px-4 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground break-words">Gallery</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage images and videos</p>
          </div>
          <Button
            variant="primary-gradient"
            onClick={() => setShowUploadModal(true)}
            className="w-full sm:w-auto shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === "All"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="group relative overflow-hidden rounded-xl border border-border bg-card w-full min-w-0"
              >
                <div className="aspect-square">
                  {item.type === "video" ? (
                    <video src={item.url} className="h-full w-full object-cover" />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/90 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="w-full min-w-0">
                    <h3 className="font-medium text-primary-foreground break-words">
                      {item.title}
                    </h3>
                    <p className="text-xs text-primary-foreground/80">
                      {item.category}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-xl sm:text-2xl font-bold break-words">Upload Media</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-lg p-2 hover:bg-muted shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <Label>File</Label>
                  <Input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        file: e.target.files?.[0] || null,
                      })
                    }
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Title</Label>
                  <Input
                    value={uploadForm.title}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, title: e.target.value })
                    }
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={uploadForm.description}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, description: e.target.value })
                    }
                    className="w-full resize-none"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, category: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary-gradient"
                    className="flex-1"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload"}
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