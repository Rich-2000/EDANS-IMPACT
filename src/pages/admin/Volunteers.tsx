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
  Eye,
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
      const url = new URL("https://edans-impact-backend.onrender.com/api/volunteer");
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
      const response = await fetch(`https://edans-impact-backend.onrender.com/api/volunteer/${id}`, {
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
    console.log("Opening details for:", volunteer); // Debug log
    setSelectedVolunteer(volunteer);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    // Small delay before clearing to allow dialog animation
    setTimeout(() => setSelectedVolunteer(null), 200);
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
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="space-y-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl break-words">
              Volunteer Applications
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base break-words">
              Review and manage volunteer applications
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button 
              variant="outline" 
              onClick={exportToCSV}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm min-w-0"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground sm:text-sm truncate">Total</p>
                  <p className="text-xl font-bold sm:text-2xl">{volunteers.length}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-2 sm:p-3 flex-shrink-0">
                  <User className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground sm:text-sm truncate">Pending</p>
                  <p className="text-xl font-bold sm:text-2xl">
                    {volunteers.filter((v) => v.status === "pending").length}
                  </p>
                </div>
                <div className="rounded-full bg-yellow-100 p-2 sm:p-3 flex-shrink-0">
                  <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground sm:text-sm truncate">Approved</p>
                  <p className="text-xl font-bold sm:text-2xl">
                    {volunteers.filter((v) => v.status === "approved").length}
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-2 sm:p-3 flex-shrink-0">
                  <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground sm:text-sm truncate">Rejected</p>
                  <p className="text-xl font-bold sm:text-2xl">
                    {volunteers.filter((v) => v.status === "rejected").length}
                  </p>
                </div>
                <div className="rounded-full bg-red-100 p-2 sm:p-3 flex-shrink-0">
                  <XCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Volunteers Table - Desktop View */}
        <Card className="hidden lg:block">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Contact</TableHead>
                  <TableHead className="whitespace-nowrap">Occupation</TableHead>
                  <TableHead className="whitespace-nowrap">Skills</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Applied</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volunteers.map((volunteer) => (
                  <TableRow key={volunteer._id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {volunteer.firstName} {volunteer.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="text-sm truncate max-w-[200px]">{volunteer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span className="text-sm whitespace-nowrap">{volunteer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate max-w-[150px]">{volunteer.occupation}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <div className="flex flex-wrap gap-1">
                          {volunteer.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-muted px-2 py-1 text-xs whitespace-nowrap"
                            >
                              {skill}
                            </span>
                          ))}
                          {volunteer.skills.length > 3 && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              +{volunteer.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`flex w-24 items-center justify-center gap-2 whitespace-nowrap ${
                          statusColors[volunteer.status]
                        }`}
                      >
                        {getStatusIcon(volunteer.status)}
                        {volunteer.status.charAt(0).toUpperCase() +
                          volunteer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        {new Date(volunteer.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewDetails(volunteer)}
                          className="whitespace-nowrap"
                        >
                          <Eye className="mr-1 h-3 w-3" />
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

        {/* Volunteers Cards - Mobile View */}
        <div className="lg:hidden space-y-4">
          {volunteers.map((volunteer) => (
            <Card key={volunteer._id} className="overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-lg break-words">
                      {volunteer.firstName} {volunteer.lastName}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`inline-flex items-center gap-1 mt-2 ${
                        statusColors[volunteer.status]
                      }`}
                    >
                      {getStatusIcon(volunteer.status)}
                      <span className="text-xs">
                        {volunteer.status.charAt(0).toUpperCase() +
                          volunteer.status.slice(1)}
                      </span>
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <span className="break-all">{volunteer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span>{volunteer.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <span className="break-words">{volunteer.occupation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span>{new Date(volunteer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {volunteer.skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-muted px-2 py-1 text-xs break-words"
                      >
                        {skill}
                      </span>
                    ))}
                    {volunteer.skills.length > 5 && (
                      <span className="text-xs text-muted-foreground self-center">
                        +{volunteer.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => viewDetails(volunteer)}
                    className="w-full"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Full Details
                  </Button>
                  <select
                    value={volunteer.status}
                    onChange={(e) =>
                      updateStatus(volunteer._id, e.target.value)
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {volunteers.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                No volunteer applications found
              </p>
              <p className="text-sm text-muted-foreground">
                {filter !== "all" 
                  ? "Try changing the filter to see more applications" 
                  : "Applications will appear here when people apply"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          {selectedVolunteer ? (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold break-words">
                  Volunteer Application Details
                </DialogTitle>
                <DialogDescription className="text-base break-words">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span>
                      Applied on {new Date(selectedVolunteer.createdAt).toLocaleDateString()} at{" "}
                      {new Date(selectedVolunteer.createdAt).toLocaleTimeString()}
                    </span>
                    <Badge
                      variant="outline"
                      className={`w-fit ${statusColors[selectedVolunteer.status]}`}
                    >
                      {getStatusIcon(selectedVolunteer.status)}
                      <span className="ml-1">
                        {selectedVolunteer.status.charAt(0).toUpperCase() +
                          selectedVolunteer.status.slice(1)}
                      </span>
                    </Badge>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Personal Information */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Full Name
                      </h4>
                      <p className="text-base font-medium break-words">
                        {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Date of Birth
                      </h4>
                      <p className="text-base break-words">
                        {new Date(selectedVolunteer.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Email Address
                      </h4>
                      <p className="text-base break-all">{selectedVolunteer.email}</p>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Phone Number
                      </h4>
                      <p className="text-base break-words">{selectedVolunteer.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Background
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Current Occupation
                      </h4>
                      <p className="text-base break-words">{selectedVolunteer.occupation}</p>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Education Level
                      </h4>
                      <p className="text-base break-words">{selectedVolunteer.education}</p>
                    </div>
                  </div>
                </div>

                {/* Skills and Availability */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="text-lg font-semibold mb-4">Skills & Availability</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVolunteer.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="break-words">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Available Days
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVolunteer.availability.map((day) => (
                          <Badge key={day} variant="outline" className="break-words">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Motivation */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Why They Want to Volunteer
                  </h4>
                  <div className="mt-2 rounded-lg bg-background p-4 overflow-hidden">
                    <p className="whitespace-pre-wrap break-words text-base leading-relaxed">
                      {selectedVolunteer.motivation}
                    </p>
                  </div>
                </div>

                {/* Experience */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Previous Volunteer Experience
                  </h4>
                  <div className="mt-2 rounded-lg bg-background p-4 overflow-hidden">
                    <p className="whitespace-pre-wrap break-words text-base leading-relaxed">
                      {selectedVolunteer.experience}
                    </p>
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedVolunteer.notes && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <h4 className="text-sm font-medium text-amber-900 mb-2">
                      Admin Notes
                    </h4>
                    <div className="mt-2 rounded-lg bg-white p-4 overflow-hidden">
                      <p className="whitespace-pre-wrap break-words text-base leading-relaxed text-amber-900">
                        {selectedVolunteer.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Application Actions
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={selectedVolunteer.status}
                      onChange={(e) =>
                        updateStatus(selectedVolunteer._id, e.target.value)
                      }
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 min-w-0"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="approved">Approve Application</option>
                      <option value="rejected">Reject Application</option>
                    </select>
                    <Button
                      variant="default"
                      onClick={() =>
                        (window.location.href = `mailto:${selectedVolunteer.email}?subject=Regarding Your Volunteer Application`)
                      }
                      className="whitespace-nowrap"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Applicant
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}