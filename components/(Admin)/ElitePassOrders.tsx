"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Search, Ticket } from "lucide-react";
import { getElitePassOrders } from "@/backend/elite-pass";
import { Button } from "@/components/ui/button";
import { downloadCsv } from "@/lib/downloadCsv";

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
};

export default function ElitePassOrders() {
  const [orders, setOrders] = useState<ElitePassOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [loadedScreenshots, setLoadedScreenshots] = useState<Record<number, boolean>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await getElitePassOrders();
      if (response.data) setOrders(response.data as ElitePassOrderRow[]);
      setLoading(false);
    })();
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
