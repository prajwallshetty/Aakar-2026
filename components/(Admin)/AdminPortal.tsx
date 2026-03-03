"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { UserPlus, Trash2, Pencil, User, AlertCircle, Ticket, Users, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '@/backend/admin';
import { Admin } from '@prisma/client';
import { getParticipantsCount } from '@/backend/participant';
import { getTotalEvents } from '@/backend/events';
import { getParticipantsOverTime, getEventsOverTime, getParticipantsPerCollege } from '@/backend/charts';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ErrorResponse { error: string; }
function isErrorResponse(r: any): r is ErrorResponse {
    return r && typeof r === 'object' && 'error' in r;
}

// ── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, loading }: { title: string; value: number; icon: any; loading: boolean }) => (
    <Card className="border border-zinc-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">{title}</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                <Icon size={16} className="text-zinc-600" />
            </div>
        </CardHeader>
        <CardContent>
            {loading ? <Skeleton className="h-8 w-20" /> : (
                <p className="text-3xl font-bold text-zinc-900">{value}</p>
            )}
        </CardContent>
    </Card>
);

// ── Chart Card ───────────────────────────────────────────────────────────────
interface ChartCardProps {
    title: string;
    description: string;
    data: any[];
    dataKey: string;
    xKey: string;
    color: string;
    loading: boolean;
}

const ChartCard = ({ title, description, data, dataKey, xKey, color, loading }: ChartCardProps) => (
    <Card className="border border-zinc-200 shadow-sm">
        <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-zinc-900">{title}</CardTitle>
            <p className="text-sm text-zinc-500">{description}</p>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                    <Skeleton className="h-36 w-full" />
                </div>
            ) : data.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-zinc-400 text-sm">
                    No data available yet
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data} margin={{ top: 5, right: 16, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey={xKey}
                            tick={{ fontSize: 11, fill: '#71717a' }}
                            axisLine={false}
                            tickLine={false}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#71717a' }}
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #e4e4e7',
                                borderRadius: '8px',
                                fontSize: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            }}
                            cursor={{ stroke: '#e4e4e7' }}
                        />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2.5}
                            dot={{ r: 3.5, fill: color, strokeWidth: 0 }}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </CardContent>
    </Card>
);

// ── Main Component ───────────────────────────────────────────────────────────
const AdminPortal = () => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState({ admins: true, stats: true, charts: true });
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0 });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<number | null>(null);

    const [chartData, setChartData] = useState<{
        participantsOverTime: { date: string; participants: number }[];
        eventsOverTime: { date: string; events: number }[];
        participantsPerCollege: { college: string; participants: number }[];
    }>({
        participantsOverTime: [],
        eventsOverTime: [],
        participantsPerCollege: [],
    });

    useEffect(() => {
        fetchAdmins();
        fetchStats();
        fetchCharts();
    }, []);

    const fetchAdmins = async () => {
        setLoading(p => ({ ...p, admins: true }));
        try {
            const response = await getAdmins();
            if (isErrorResponse(response)) { toast.error(response.error); setError(response.error); }
            else { setAdmins((response as Admin[]) ?? []); setError(''); }
        } catch { setError("Could not fetch admin users."); toast.error("Failed to load admin users"); }
        finally { setLoading(p => ({ ...p, admins: false })); }
    };

    const fetchStats = async () => {
        setLoading(p => ({ ...p, stats: true }));
        try {
            setStats({ totalUsers: await getParticipantsCount(), totalEvents: await getTotalEvents() });
        } catch { console.error("Error fetching stats"); }
        finally { setLoading(p => ({ ...p, stats: false })); }
    };

    const fetchCharts = async () => {
        setLoading(p => ({ ...p, charts: true }));
        try {
            const [participantsOverTime, eventsOverTime, participantsPerCollege] = await Promise.all([
                getParticipantsOverTime(),
                getEventsOverTime(),
                getParticipantsPerCollege(),
            ]);
            setChartData({ participantsOverTime, eventsOverTime, participantsPerCollege });
        } catch { console.error("Error fetching chart data"); toast.error("Failed to load chart data"); }
        finally { setLoading(p => ({ ...p, charts: false })); }
    };

    const handleRefresh = () => {
        fetchStats();
        fetchCharts();
        toast.success("Charts refreshed");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', phone: '', password: '' });
        setIsEditing(false); setCurrentId(null); setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError('');
        setIsSubmitting(true);
        try {
            let response;
            if (isEditing && currentId) {
                const data = formData.password ? formData : (({ password, ...rest }) => rest)(formData);
                response = await updateAdmin(currentId, data);
            } else {
                response = await createAdmin(formData);
            }
            if (!response) throw new Error("No response");
            if (isErrorResponse(response)) { setError(response.error); toast.error(response.error); }
            else {
                toast.success(isEditing ? "Admin updated" : "Admin created");
                await fetchAdmins(); resetForm(); setOpenDialog(false);
            }
        } catch { setError("An error occurred."); toast.error("An unexpected error occurred"); }
        finally { setIsSubmitting(false); }
    };

    const handleEdit = (admin: Admin) => {
        setIsEditing(true); setCurrentId(admin.id);
        setFormData({ name: admin.name || '', email: admin.email || '', phone: admin.phone || '', password: '' });
        setOpenDialog(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await deleteAdmin(id);
            if (isErrorResponse(response)) toast.error(response.error);
            else { toast.success("Admin deleted"); await fetchAdmins(); }
        } catch { toast.error("Failed to delete admin"); }
        finally { setDeleteDialogOpen(false); setAdminToDelete(null); }
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Aakar Management Portal</h1>
                    <p className="text-sm text-zinc-500 mt-1">Manage admins, events, and registrations</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-2 cursor-pointer">
                    <RefreshCw size={14} />
                    Refresh
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <StatCard title="Total Participants" value={stats.totalUsers} icon={Users} loading={loading.stats} />
                <StatCard title="Total Events" value={stats.totalEvents} icon={Ticket} loading={loading.stats} />
                <StatCard title="Admin Users" value={admins.length} icon={User} loading={loading.admins} />
            </div>

            {/* Charts */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
                <ChartCard
                    title="Registrations Over Time"
                    description="Participants registered per day"
                    data={chartData.participantsOverTime}
                    dataKey="participants"
                    xKey="date"
                    color="#6366f1"
                    loading={loading.charts}
                />
                <ChartCard
                    title="Events Over Time"
                    description="Events scheduled per day"
                    data={chartData.eventsOverTime}
                    dataKey="events"
                    xKey="date"
                    color="#10b981"
                    loading={loading.charts}
                />
                <ChartCard
                    title="Participants per College"
                    description="Top 10 colleges by registrations"
                    data={chartData.participantsPerCollege}
                    dataKey="participants"
                    xKey="college"
                    color="#f59e0b"
                    loading={loading.charts}
                />
            </div>

            {/* Admin Table */}
            <Card className="border border-zinc-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-zinc-900">Admin Users</CardTitle>
                        <p className="text-sm text-zinc-500 mt-0.5">Manage administrator accounts</p>
                    </div>
                    <Dialog open={openDialog} onOpenChange={(v) => { if (!v) resetForm(); setOpenDialog(v); }}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="flex items-center gap-2 cursor-pointer">
                                <UserPlus size={15} /> Add Admin
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>{isEditing ? 'Edit Admin' : 'Add Admin'}</DialogTitle>
                                <DialogDescription>{isEditing ? 'Update admin details below.' : 'Create a new administrator account.'}</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 py-2">
                                {[
                                    { id: 'name', label: 'Name', type: 'text', placeholder: 'Enter name' },
                                    { id: 'email', label: 'Email', type: 'email', placeholder: 'Enter email' },
                                    { id: 'phone', label: 'Phone', type: 'text', placeholder: 'Enter phone' },
                                    { id: 'password', label: 'Password', type: 'password', placeholder: isEditing ? 'Leave blank to keep current' : 'Enter password' },
                                ].map(field => (
                                    <div key={field.id} className="space-y-1.5">
                                        <Label htmlFor={field.id} className="text-sm font-medium">{field.label}</Label>
                                        <Input
                                            id={field.id} name={field.id} type={field.type}
                                            placeholder={field.placeholder}
                                            value={formData[field.id as keyof typeof formData]}
                                            onChange={handleInputChange}
                                            required={field.id !== 'password' || !isEditing}
                                        />
                                    </div>
                                ))}
                                {error && (
                                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                                        <AlertCircle size={15} /> {error}
                                    </div>
                                )}
                                <DialogFooter className="pt-2">
                                    <Button type="button" variant="outline" className="cursor-pointer" onClick={() => { resetForm(); setOpenDialog(false); }}>Cancel</Button>
                                    <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                                        {isSubmitting ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Admin')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {loading.admins ? (
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-200">
                                    <TableHead className="text-zinc-500 font-medium">Name</TableHead>
                                    <TableHead className="text-zinc-500 font-medium">Email</TableHead>
                                    <TableHead className="text-zinc-500 font-medium">Phone</TableHead>
                                    <TableHead className="text-right text-zinc-500 font-medium">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10 text-zinc-400">
                                            No admins yet. Add your first admin above.
                                        </TableCell>
                                    </TableRow>
                                ) : admins.map(admin => (
                                    <TableRow key={admin.id} className="border-zinc-100 hover:bg-zinc-50">
                                        <TableCell className="font-medium text-zinc-900">{admin.name}</TableCell>
                                        <TableCell className="text-zinc-600">{admin.email}</TableCell>
                                        <TableCell className="text-zinc-600">{admin.phone}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer text-zinc-500 hover:text-zinc-900" onClick={() => handleEdit(admin)}>
                                                    <Pencil size={15} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer text-zinc-500 hover:text-red-600" onClick={() => { setAdminToDelete(admin.id); setDeleteDialogOpen(true); }}>
                                                    <Trash2 size={15} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirm */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete admin?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => adminToDelete && handleDelete(adminToDelete)}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminPortal;