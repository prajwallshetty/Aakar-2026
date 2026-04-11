"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Search, Shirt } from "lucide-react";
import { getMerchOrders, sendMerchConfirmationEmail } from "@/backend/merch";
import { Button } from "@/components/ui/button";
import { downloadCsv } from "@/lib/downloadCsv";

type MerchOrderRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  merchVariant: string;
  size: string;
  transactionId: string;
  paymentScreenshotUrl?: string | null;
  confirmationSent?: boolean;
};

type GroupingOption = "none" | "variant" | "size";

export default function MerchOrders() {
  const [orders, setOrders] = useState<MerchOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [groupingOption, setGroupingOption] = useState<GroupingOption>("none");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [loadedScreenshots, setLoadedScreenshots] = useState<Record<number, boolean>>({});
  const [sendingEmailIds, setSendingEmailIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await getMerchOrders();
      if (response.data) setOrders(response.data as MerchOrderRow[]);
      setLoading(false);
    })();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase();
    return orders.filter((order) =>
      order.name.toLowerCase().includes(query) ||
      order.email.toLowerCase().includes(query) ||
      order.phone.toLowerCase().includes(query) ||
      order.transactionId.toLowerCase().includes(query) ||
      order.merchVariant.toLowerCase().includes(query) ||
      order.size.toLowerCase().includes(query)
    );
  }, [orders, search]);

  const groupedOrders = useMemo(() => {
    if (groupingOption === "none") {
      return { "All Orders": filteredOrders };
    }

    const grouped: Record<string, MerchOrderRow[]> = {};
    filteredOrders.forEach((order) => {
      const key = groupingOption === "variant"
        ? (order.merchVariant || "ascend").toUpperCase()
        : (order.size || "UNKNOWN").toUpperCase();

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(order);
    });

    return grouped;
  }, [filteredOrders, groupingOption]);

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
      Variant: order.merchVariant,
      Size: order.size,
      Email: order.email,
      Phone: order.phone,
      "Transaction ID": order.transactionId,
      "Payment Screenshot URL": order.paymentScreenshotUrl || "",
    }));

    downloadCsv(rows, "merch_orders.csv");
  };

  const renderOrderRows = (rows: MerchOrderRow[]) =>
    rows.map((order) => (
      <React.Fragment key={order.id}>
        <TableRow>
          <TableCell className="font-medium text-zinc-900">{order.name}</TableCell>
          <TableCell className="uppercase">{order.merchVariant || "ascend"}</TableCell>
          <TableCell>{order.size}</TableCell>
          <TableCell>{order.email}</TableCell>
          <TableCell>{order.phone}</TableCell>
          <TableCell className="font-mono text-xs">{order.transactionId}</TableCell>
          <TableCell>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => toggleOrderScreenshots(order.id)}
                disabled={!order.paymentScreenshotUrl}
              >
                {expandedOrderId === order.id ? "Hide" : "Image"}
              </Button>
              {order.confirmationSent ? (
                <Badge variant="outline" className="h-8 text-emerald-600 bg-emerald-50 border-emerald-200">
                  Confirmed
                </Badge>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={async () => {
                    setSendingEmailIds(p => ({ ...p, [order.id]: true }));
                    const res = await sendMerchConfirmationEmail(order.id);
                    if (!res.error) {
                      setOrders(orders.map(o => o.id === order.id ? { ...o, confirmationSent: true } : o));
                    } else {
                      alert(res.error);
                    }
                    setSendingEmailIds(p => ({ ...p, [order.id]: false }));
                  }}
                  disabled={sendingEmailIds[order.id]}
                >
                  {sendingEmailIds[order.id] ? "Sending..." : "Confirm Order"}
                </Button>
              )}
            </div>
          </TableCell>
        </TableRow>

        {expandedOrderId === order.id && (
          <TableRow>
            <TableCell colSpan={7} className="bg-zinc-50/70 p-4">
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
    ));

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Merch Orders</h1>
            <p className="text-sm text-zinc-500 mt-1">Track shirt sizes and transaction IDs from the merch flow.</p>
          </div>
          <Badge variant="outline" className="text-xs text-zinc-500 border-zinc-200 bg-white">
            <Shirt size={12} className="mr-1" />
            Merch Panel
          </Badge>
        </div>

        <Card className="border border-zinc-200 shadow-none">
          <CardHeader className="px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold text-zinc-900">Submitted Orders</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Orders are saved after the transaction ID is submitted.
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 border border-zinc-200 rounded-md p-0.5 bg-white">
                  {([
                    { val: "none", label: "All" },
                    { val: "variant", label: "Variant" },
                    { val: "size", label: "Size" },
                  ] as const).map(({ val, label }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setGroupingOption(val)}
                      className={
                        groupingOption === val
                          ? "px-2.5 py-1 rounded text-xs font-medium bg-zinc-900 text-white"
                          : "px-2.5 py-1 rounded text-xs font-medium text-zinc-500 hover:text-zinc-800"
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
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
              <div className="p-10 text-center text-sm text-zinc-500">No merch orders found.</div>
            ) : (
              <div className="space-y-5 p-4">
                {Object.entries(groupedOrders).map(([groupName, groupRows]) => (
                  <div key={groupName} className="border border-zinc-200 rounded-md overflow-hidden bg-white">
                    <div className="px-4 py-2 border-b border-zinc-100 bg-zinc-50">
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                        {groupName} ({groupRows.length})
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Variant</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>{renderOrderRows(groupRows)}</TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}