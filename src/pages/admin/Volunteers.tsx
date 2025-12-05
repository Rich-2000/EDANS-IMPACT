import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Loader2,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Volunteer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  occupation: string;
  education: string;
  skills: string[];
  availability: string[];
  motivation: string;
  experience: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AdminVolunteers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    checkAuth();
    fetchVolunteers();
  }, [filter]);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  };

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const url = new URL("http://localhost:5000/api/volunteer");
      if (filter !== "all") {
        url.searchParams.append("status", filter);
      }

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setVolunteers(data.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch volunteer applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/volunteer/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Status updated successfully",
        });
        fetchVolunteers();
        if (selectedVolunteer?._id === id) {
          setSelectedVolunteer({ ...selectedVolunteer, status: status as any });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "reviewed":
        return <CheckCircle className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const viewDetails = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setShowDetails(true);
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Date of Birth",
      "Occupation",
      "Education",
      "Skills",
      "Availability",
      "Status",
      "Applied Date",
    ];

    const data = volunteers.map((v) => [
      `${v.firstName} ${v.lastName}`,
      v.email,
      v.phone,
      new Date(v.dateOfBirth).toLocaleDateString(),
      v.occupation,
      v.education,
      v.skills.join(", "),
      v.availability.join(", "),
      v.status,
      new Date(v.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...data.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `volunteers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Volunteer Applications
          </h1>
          <p className="text-muted-foreground">
            Review and manage volunteer applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{volunteers.length}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {volunteers.filter((v) => v.status === "pending").length}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">
                  {volunteers.filter((v) => v.status === "approved").length}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">
                  {volunteers.filter((v) => v.status === "rejected").length}
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Volunteers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((volunteer) => (
                <TableRow key={volunteer._id}>
                  <TableCell className="font-medium">
                    {volunteer.firstName} {volunteer.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span className="text-sm">{volunteer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span className="text-sm">{volunteer.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3 w-3" />
                      {volunteer.occupation}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {volunteer.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-muted px-2 py-1 text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {volunteer.skills.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{volunteer.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`flex w-24 items-center justify-center gap-2 ${
                        statusColors[volunteer.status]
                      }`}
                    >
                      {getStatusIcon(volunteer.status)}
                      {volunteer.status.charAt(0).toUpperCase() +
                        volunteer.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3" />
                      {new Date(volunteer.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewDetails(volunteer)}
                      >
                        View
                      </Button>
                      <select
                        value={volunteer.status}
                        onChange={(e) =>
                          updateStatus(volunteer._id, e.target.value)
                        }
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedVolunteer && (
            <>
              <DialogHeader>
                <DialogTitle>Volunteer Application Details</DialogTitle>
                <DialogDescription>
                  Applied on{" "}
                  {new Date(selectedVolunteer.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </h4>
                    <p className="text-lg">
                      {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Date of Birth
                    </h4>
                    <p className="text-lg">
                      {new Date(selectedVolunteer.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Email
                    </h4>
                    <p className="text-lg">{selectedVolunteer.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Phone
                    </h4>
                    <p className="text-lg">{selectedVolunteer.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Occupation
                    </h4>
                    <p className="text-lg">{selectedVolunteer.occupation}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Education
                    </h4>
                    <p className="text-lg">{selectedVolunteer.education}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Skills</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedVolunteer.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Availability
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedVolunteer.availability.map((day) => (
                        <Badge key={day} variant="outline">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Motivation
                  </h4>
                  <div className="mt-2 rounded-lg border border-border bg-muted/20 p-4">
                    <p className="whitespace-pre-wrap">{selectedVolunteer.motivation}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Experience
                  </h4>
                  <div className="mt-2 rounded-lg border border-border bg-muted/20 p-4">
                    <p className="whitespace-pre-wrap">{selectedVolunteer.experience}</p>
                  </div>
                </div>

                {selectedVolunteer.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Admin Notes
                    </h4>
                    <div className="mt-2 rounded-lg border border-border bg-muted/20 p-4">
                      <p className="whitespace-pre-wrap">{selectedVolunteer.notes}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Update Status
                  </h4>
                  <div className="mt-2 flex gap-2">
                    <select
                      value={selectedVolunteer.status}
                      onChange={(e) =>
                        updateStatus(selectedVolunteer._id, e.target.value)
                      }
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <Button
                      variant="outline"
                      onClick={() =>
                        (window.location.href = `mailto:${selectedVolunteer.email}`)
                      }
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Volunteer
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}