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
  DollarSign,
  User,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Download,
  Loader2,
  CreditCard,
  Banknote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Donation {
  _id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  type: "one-time" | "monthly" | "yearly";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

const paymentMethodIcons = {
  card: CreditCard,
  bank: Banknote,
  mobile: CreditCard,
};

export default function AdminDonations() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    checkAuth();
    fetchDonations();
  }, [filter]);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  };

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const url = new URL("http://localhost:5000/api/donations");
      if (filter !== "all") {
        url.searchParams.append("status", filter);
      }

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setDonations(data.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch donations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/donations/${id}`, {
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
        fetchDonations();
        if (selectedDonation?._id === id) {
          setSelectedDonation({ ...selectedDonation, status: status as any });
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
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      case "refunded":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const viewDetails = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowDetails(true);
  };

  const exportToCSV = () => {
    const headers = [
      "Donor Name",
      "Email",
      "Amount",
      "Currency",
      "Payment Method",
      "Type",
      "Status",
      "Transaction ID",
      "Date",
    ];

    const data = donations.map((d) => [
      d.donorName,
      d.donorEmail,
      d.amount,
      d.currency,
      d.paymentMethod,
      d.type,
      d.status,
      d.transactionId || "N/A",
      new Date(d.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...data.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getPaymentMethodIcon = (method: string) => {
    const Icon = paymentMethodIcons[method as keyof typeof paymentMethodIcons] || CreditCard;
    return <Icon className="h-4 w-4" />;
  };

  // Calculate totals
  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const completedAmount = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0);

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
            Donations
          </h1>
          <p className="text-muted-foreground">Manage donation records and payments</p>
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
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-2xl font-bold">{donations.length}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">GH₵ {totalAmount.toFixed(2)}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">GH₵ {completedAmount.toFixed(2)}</p>
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
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {donations.filter((d) => d.status === "pending").length}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donations Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation._id}>
                  <TableCell>
                    <div className="font-medium">{donation.donorName}</div>
                    <div className="text-sm text-muted-foreground">
                      {donation.donorEmail}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">GH₵ {donation.amount.toFixed(2)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(donation.paymentMethod)}
                      <span className="capitalize">{donation.paymentMethod}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {donation.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`flex w-24 items-center justify-center gap-2 ${
                        statusColors[donation.status]
                      }`}
                    >
                      {getStatusIcon(donation.status)}
                      {donation.status.charAt(0).toUpperCase() +
                        donation.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3" />
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewDetails(donation)}
                      >
                        View
                      </Button>
                      <select
                        value={donation.status}
                        onChange={(e) =>
                          updateStatus(donation._id, e.target.value)
                        }
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
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
        <DialogContent className="max-w-2xl">
          {selectedDonation && (
            <>
              <DialogHeader>
                <DialogTitle>Donation Details</DialogTitle>
                <DialogDescription>
                  Processed on {new Date(selectedDonation.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Donor Name
                    </h4>
                    <p className="text-lg">{selectedDonation.donorName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Donor Email
                    </h4>
                    <p className="text-lg">{selectedDonation.donorEmail}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Amount
                    </h4>
                    <p className="text-2xl font-bold">
                      GH₵ {selectedDonation.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Currency
                    </h4>
                    <p className="text-lg">{selectedDonation.currency}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Payment Method
                    </h4>
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(selectedDonation.paymentMethod)}
                      <span className="capitalize">{selectedDonation.paymentMethod}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Donation Type
                    </h4>
                    <Badge variant="outline" className="capitalize">
                      {selectedDonation.type}
                    </Badge>
                  </div>
                </div>

                {selectedDonation.transactionId && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Transaction ID
                    </h4>
                    <code className="mt-2 block rounded-lg border border-border bg-muted/20 p-3 font-mono text-sm">
                      {selectedDonation.transactionId}
                    </code>
                  </div>
                )}

                {selectedDonation.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                    <div className="mt-2 rounded-lg border border-border bg-muted/20 p-4">
                      <p className="whitespace-pre-wrap">{selectedDonation.notes}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Current Status
                  </h4>
                  <div className="mt-2 flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className={`text-lg ${statusColors[selectedDonation.status]}`}
                    >
                      {getStatusIcon(selectedDonation.status)}
                      {selectedDonation.status.charAt(0).toUpperCase() +
                        selectedDonation.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Last updated:{" "}
                      {new Date(selectedDonation.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Update Status
                  </h4>
                  <div className="mt-2 flex gap-2">
                    <select
                      value={selectedDonation.status}
                      onChange={(e) =>
                        updateStatus(selectedDonation._id, e.target.value)
                      }
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                    <Button
                      variant="outline"
                      onClick={() =>
                        (window.location.href = `mailto:${selectedDonation.donorEmail}?subject=Regarding Your Donation`)
                      }
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Thank Donor
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