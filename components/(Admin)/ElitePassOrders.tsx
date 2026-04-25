"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Search, Ticket } from "lucide-react";
import { getElitePassOrders, updateElitePassOrder } from "@/backend/elite-pass";
import { Button } from "@/components/ui/button";
import { downloadCsv } from "@/lib/downloadCsv";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { createElitePassOrder } from "@/backend/elite-pass";
import { getSoloEvents } from "@/backend/events";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";

type ElitePassOrderRow = {
  id: number;
  name: string;
  usn: string;
  email: string;
  phone: string;
  college: string;
  department?: string | null;
  year: number;
  transactionId: string;
  amount: number;
  paymentScreenshotUrl?: string | null;
  paymentStatus: string;
};

export default function ElitePassOrders() {
  const [orders, setOrders] = useState<ElitePassOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [loadedScreenshots, setLoadedScreenshots] = useState<Record<number, boolean>>({});
  
  // Add User Dialog State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [soloEvents, setSoloEvents] = useState<{ id: number; eventName: string; fee: number }[]>([]);
  const [newOrder, setNewOrder] = useState({
    name: "",
    email: "",
    phone: "",
    usn: "",
    college: "",
    department: "",
    year: 1,
    transactionId: `ADMIN_MANUAL_${Date.now()}`,
    eventIds: [] as number[],
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      
      // Fast Initial Load
      const response = await getElitePassOrders(0, 50);
      if (response.data) {
        setOrders(response.data as ElitePassOrderRow[]);
      }
      setLoading(false);
      
      // Async Background Full Load (for searching / complete data)
      getElitePassOrders().then((allResponse) => {
        if (allResponse.data) {
          setOrders(allResponse.data as ElitePassOrderRow[]);
        }
      }).catch(err => console.error("Error fetching all elite pass orders:", err));
      
    })();

    // Fetch Solo Events for the Add User dialog
    getSoloEvents().then(response => {
      if (response.data) {
        setSoloEvents(response.data as any[]);
      }
    });
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase();
    return orders.filter((order) =>
      order.name.toLowerCase().includes(query) ||
      order.usn.toLowerCase().includes(query) ||
      order.email.toLowerCase().includes(query) ||
      order.phone.toLowerCase().includes(query) ||
      order.college.toLowerCase().includes(query) ||
      order.department?.toLowerCase().includes(query) ||
      order.transactionId.toLowerCase().includes(query)
    );
  }, [orders, search]);

  const toggleOrderScreenshots = (orderId: number) => {
    setExpandedOrderId((current) => (current === orderId ? null : orderId));
    setLoadedScreenshots((current) => ({
      ...current,
      [orderId]: true,
    }));
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    const updateToast = toast.loading(`Updating status to ${newStatus}...`);

    try {
      const response = await updateElitePassOrder(orderId, {
        paymentStatus: newStatus as any,
      });

      if (response.error) {
        toast.error(typeof response.error === "string" ? response.error : "Failed to update status", {
          id: updateToast,
        });
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, paymentStatus: newStatus } : order
        )
      );
      toast.success(`Status updated to ${newStatus}`, {
        id: updateToast,
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("An error occurred while updating status", {
        id: updateToast,
      });
    }
  };

  const handleDownload = () => {
    const rows = filteredOrders.map((order) => ({
      Name: order.name,
      USN: order.usn,
      College: order.college,
      Department: order.department || "",
      Year: order.year,
      Email: order.email,
      Phone: order.phone,
      "Transaction ID": order.transactionId,
      Amount: order.amount,
      "Payment Screenshot URL": order.paymentScreenshotUrl || "",
    }));

    downloadCsv(rows, "elite_pass_orders.csv");
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Detailed validation
    const errors: string[] = [];
    if (!newOrder.name) errors.push("Name");
    if (!newOrder.email) errors.push("Email");
    if (!newOrder.phone) errors.push("Phone");
    if (!newOrder.usn) errors.push("USN");
    if (!newOrder.college) errors.push("College");
    if (!newOrder.department) errors.push("Department");
    if (newOrder.eventIds.length === 0) errors.push("at least one Solo Event");

    if (errors.length > 0) {
      toast.error(`Please provide: ${errors.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createElitePassOrder({
        ...newOrder,
        paymentScreenshotUrl: "", // Admin entries don't need screenshot
      });

      if (response.error) {
        if (typeof response.error === "object") {
          const errorMsg = Object.values(response.error).join(", ");
          toast.error(errorMsg || "Failed to add user");
        } else {
          toast.error(response.error);
        }
      } else {
        toast.success("User added successfully!");
        setIsAddDialogOpen(false);
        // Refresh orders
        const updatedOrders = await getElitePassOrders();
        if (updatedOrders.data) {
          setOrders(updatedOrders.data as ElitePassOrderRow[]);
        }
        // Reset form
        setNewOrder({
          name: "",
          email: "",
          phone: "",
          usn: "",
          college: "",
          department: "",
          year: 1,
          transactionId: `ADMIN_MANUAL_${Date.now()}`,
          eventIds: [],
        });
      }
    } catch (err) {
      console.error("Error adding user:", err);
      toast.error("An error occurred while adding user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Elite Pass Orders</h1>
            <p className="text-sm text-zinc-500 mt-1">Track pass buyers, transaction IDs, and payment screenshots.</p>
          </div>
          <Badge variant="outline" className="text-xs text-zinc-500 border-zinc-200 bg-white">
            <Ticket size={12} className="mr-1" />
            Elite Pass Panel
          </Badge>
        </div>

        <Card className="border border-zinc-200 shadow-none">
          <CardHeader className="px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold text-zinc-900">Submitted Pass Orders</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Orders are saved once transaction details are submitted.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 text-xs border-zinc-200"
                  onClick={handleDownload}
                  disabled={loading || filteredOrders.length === 0}
                >
                  <Download size={13} />
                  Download CSV
                </Button>
                
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="h-8 gap-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 text-white"
                    >
                      <UserPlus size={13} />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Elite Pass User</DialogTitle>
                      <DialogDescription>
                        Manually register a user for Elite Pass. Verification and screenshots are bypassed.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddUser} className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-xs">Full Name</Label>
                          <Input
                            id="name"
                            value={newOrder.name}
                            onChange={(e) => setNewOrder({ ...newOrder, name: e.target.value })}
                            className="h-9 text-sm"
                            placeholder="John Doe"
                            required={false}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="usn" className="text-xs">USN</Label>
                          <Input
                            id="usn"
                            value={newOrder.usn}
                            onChange={(e) => setNewOrder({ ...newOrder, usn: e.target.value.toUpperCase() })}
                            className="h-9 text-sm"
                            placeholder="4JK21CS001"
                            required={false}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newOrder.email}
                            onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value.toLowerCase() })}
                            className="h-9 text-sm"
                            placeholder="john@example.com"
                            required={false}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-xs">Phone</Label>
                          <Input
                            id="phone"
                            value={newOrder.phone}
                            onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                            className="h-9 text-sm"
                            placeholder="9876543210"
                            required={false}
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="college" className="text-xs">College</Label>
                          <CreatableSelect
                            instanceId="college-select"
                            options={[
                              { value: "A J Institute of Engineering and Technology, Mangalore", label: "A J Institute of Engineering and Technology, Mangalore" },
                              { value: "Canara Engineering College, Mangalore", label: "Canara Engineering College, Mangalore" },
                              { value: "St Joseph Engineering College, Vamanjoor", label: "St Joseph Engineering College, Vamanjoor" },
                              { value: "Sahyadri College of Engineering and Management", label: "Sahyadri College of Engineering and Management" },
                              { value: "NMAM Institute of Technology, Nitte", label: "NMAM Institute of Technology, Nitte" },
                            ]}
                            value={newOrder.college ? { value: newOrder.college, label: newOrder.college } : null}
                            onChange={(val: any) => setNewOrder({ ...newOrder, college: val?.value || "" })}
                            className="text-sm"
                            placeholder="Select or type college name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department" className="text-xs">Department</Label>
                          <Input
                            id="department"
                            value={newOrder.department}
                            onChange={(e) => setNewOrder({ ...newOrder, department: e.target.value })}
                            className="h-9 text-sm"
                            placeholder="Computer Science"
                            required={false}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="year" className="text-xs">Year</Label>
                          <Input
                            id="year"
                            type="number"
                            min={1}
                            max={5}
                            value={newOrder.year}
                            onChange={(e) => setNewOrder({ ...newOrder, year: parseInt(e.target.value) })}
                            className="h-9 text-sm"
                            required
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label className="text-xs">Solo Events (Select at least 1)</Label>
                          <ReactSelect
                            instanceId="events-select"
                            isMulti
                            options={soloEvents.map(ev => ({ value: ev.id, label: ev.eventName }))}
                            value={soloEvents.filter(ev => newOrder.eventIds.includes(ev.id)).map(ev => ({ value: ev.id, label: ev.eventName }))}
                            onChange={(vals: any) => setNewOrder({ ...newOrder, eventIds: vals ? vals.map((v: any) => v.value) : [] })}
                            className="text-sm"
                            placeholder="Select solo events..."
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="transactionId" className="text-xs">Transaction ID</Label>
                          <Input
                            id="transactionId"
                            value={newOrder.transactionId}
                            onChange={(e) => setNewOrder({ ...newOrder, transactionId: e.target.value })}
                            className="h-9 text-sm"
                            placeholder="ADMIN_MANUAL_ENTRY"
                          />
                        </div>
                      </div>
                      <DialogFooter className="pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                          disabled={isSubmitting}
                          className="h-9 text-sm"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="h-9 text-sm bg-zinc-900 hover:bg-zinc-800"
                        >
                          {isSubmitting ? "Adding..." : "Add User"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    placeholder="Search orders..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 text-sm w-56 border-zinc-200 bg-white"
                  />
                </div>
              </div>
            </div>
          </CardHeader>

          <div className="border-t border-zinc-100" />

          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-10 text-center text-sm text-zinc-500">No elite pass orders found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>USN</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Dept / Year</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Screenshot</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <React.Fragment key={order.id}>
                        <TableRow>
                          <TableCell className="font-medium text-zinc-900">{order.name}</TableCell>
                          <TableCell>{order.usn}</TableCell>
                          <TableCell className="max-w-[220px] truncate" title={order.college}>{order.college}</TableCell>
                          <TableCell>{order.department || "-"} / {order.year}</TableCell>
                          <TableCell>{order.email}</TableCell>
                          <TableCell>{order.phone}</TableCell>
                          <TableCell className="font-mono text-xs">{order.transactionId}</TableCell>
                          <TableCell>
                            <Select
                              value={order.paymentStatus}
                              onValueChange={(value) => handleStatusUpdate(order.id, value)}
                            >
                              <SelectTrigger className="w-[120px] h-8 text-xs">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">PENDING</SelectItem>
                                <SelectItem value="APPROVED">APPROVED</SelectItem>
                                <SelectItem value="FAILED">FAILED</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => toggleOrderScreenshots(order.id)}
                              disabled={!order.paymentScreenshotUrl}
                            >
                              {expandedOrderId === order.id ? "Hide Screenshot" : "Load Screenshot"}
                            </Button>
                          </TableCell>
                        </TableRow>

                        {expandedOrderId === order.id && (
                          <TableRow>
                            <TableCell colSpan={8} className="bg-zinc-50/70 p-4">
                              <div className="space-y-3">
                                <p className="text-xs font-medium text-zinc-700">
                                  Payment screenshot loads only when requested.
                                </p>
                                {loadedScreenshots[order.id] && order.paymentScreenshotUrl ? (
                                  <div className="max-w-md overflow-hidden rounded-md border border-zinc-200 bg-white">
                                    <img
                                      src={order.paymentScreenshotUrl}
                                      alt={`Payment screenshot for ${order.name}`}
                                      className="w-full h-auto"
                                    />
                                  </div>
                                ) : (
                                  <div className="text-sm text-zinc-500">
                                    No screenshot available for this order.
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
