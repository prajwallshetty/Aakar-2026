"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Trash2, Pencil, User, AlertCircle, Ticket, Users, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '@/backend/admin';
import { Admin } from '@prisma/client';
import { getParticipantsCount } from '@/backend/participant';
import { getTotalEvents } from '@/backend/events';

interface ErrorResponse {
  error: string;
}

function isErrorResponse(response: any): response is ErrorResponse {
  return response && typeof response === 'object' && 'error' in response;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  loading,
  description,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
  description?: string;
}) => (
  <Card className="border border-zinc-200 shadow-none">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-1" />
          ) : (
            <p className="text-3xl font-bold text-zinc-900 tracking-tight">{value.toLocaleString()}</p>
          )}
          {description && !loading && (
            <p className="text-xs text-zinc-400 mt-1">{description}</p>
          )}
        </div>
        <div className="h-9 w-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-zinc-600" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminPortal = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState({ admins: true, stats: true });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0 });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchAdmins();
    fetchStats();
  }, []);

  const fetchAdmins = async () => {
    setLoading(prev => ({ ...prev, admins: true }));
    try {
      const response = await getAdmins();
      if (!response) throw new Error("No response from server");
      if (isErrorResponse(response)) {
        toast.error(response.error);
        setError(response.error);
      } else {
        setAdmins(response as Admin[]);
        setError('');
      }
    } catch (error) {
      setError("Could not fetch admin users.");
      toast.error("Failed to load admin users");
    } finally {
      setLoading(prev => ({ ...prev, admins: false }));
    }
  };

  const fetchStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      setStats({
        totalUsers: await getParticipantsCount(),
        totalEvents: await getTotalEvents(),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', password: '' });
    setIsEditing(false);
    setCurrentId(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      let response;
      if (isEditing && currentId) {
        const { password, ...rest } = formData;
        response = await updateAdmin(currentId, formData.password ? formData : rest);
      } else {
        response = await createAdmin(formData);
      }

      if (!response) throw new Error("No response from server");
      if (isErrorResponse(response)) {
        setError(response.error);
        toast.error(response.error);
      } else {
        toast.success(isEditing ? "Admin updated successfully" : "New admin created successfully");
        await fetchAdmins();
        resetForm();
        setOpenDialog(false);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (admin: Admin) => {
    setIsEditing(true);
    setCurrentId(admin.id);
    setFormData({ name: admin.name || '', email: admin.email || '', phone: admin.phone || '', password: '' });
    setOpenDialog(true);
  };

  const confirmDelete = (id: number) => {
    setAdminToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteAdmin(id);
      if (!response) throw new Error("No response from server");
      if (isErrorResponse(response)) {
        toast.error(response.error);
      } else {
        toast.success("Admin deleted successfully");
        await fetchAdmins();
      }
    } catch {
      toast.error("Failed to delete admin");
    } finally {
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
    }
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Management Portal</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage admins, events, and registrations for Aakar</p>
          </div>
          <Badge variant="outline" className="text-xs text-zinc-500 border-zinc-200 bg-white">
            Aakar Admin
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Participants" value={stats.totalUsers} icon={Users} loading={loading.stats} description="Total registered" />
          <StatCard title="Events" value={stats.totalEvents} icon={Ticket} loading={loading.stats} description="Across all categories" />
          <StatCard title="Admins" value={admins.length} icon={User} loading={loading.admins} description="Active accounts" />
        </div>

        {/* Admin Table Card */}
        <Card className="border border-zinc-200 shadow-none">
          <CardHeader className="px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold text-zinc-900">Admin Users</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Manage administrator accounts for the fest
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    placeholder="Search admins..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 text-sm w-48 border-zinc-200 bg-white"
                  />
                </div>
                <Dialog open={openDialog} onOpenChange={(open) => { setOpenDialog(open); if (!open) resetForm(); }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 text-white">
                      <UserPlus size={13} />
                      Add Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-base">{isEditing ? 'Edit Admin' : 'Create Admin'}</DialogTitle>
                      <DialogDescription className="text-xs">
                        {isEditing ? 'Update administrator details below.' : 'Add a new administrator to the portal.'}
                      </DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4 py-3">
                        {[
                          { id: 'name', label: 'Full Name', placeholder: 'Enter admin name', type: 'text' },
                          { id: 'email', label: 'Email Address', placeholder: 'Enter admin email', type: 'email' },
                          { id: 'phone', label: 'Phone Number', placeholder: 'Enter phone number', type: 'text' },
                        ].map(({ id, label, placeholder, type }) => (
                          <div key={id} className="space-y-1.5">
                            <Label htmlFor={id} className="text-xs font-medium text-zinc-700">{label}</Label>
                            <Input
                              id={id}
                              name={id}
                              type={type}
                              placeholder={placeholder}
                              value={formData[id as keyof typeof formData]}
                              onChange={handleInputChange}
                              className="h-9 text-sm border-zinc-200"
                              required
                            />
                          </div>
                        ))}
                        <div className="space-y-1.5">
                          <Label htmlFor="password" className="text-xs font-medium text-zinc-700">Password</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="h-9 text-sm border-zinc-200"
                            required={!isEditing}
                            placeholder={isEditing ? "Leave blank to keep current" : "Create a password"}
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-4">
                          <AlertCircle size={13} />
                          {error}
                        </div>
                      )}

                      <DialogFooter className="gap-2 pt-2">
                        <Button type="button" variant="outline" size="sm" className="h-8 text-xs border-zinc-200" onClick={() => { resetForm(); setOpenDialog(false); }}>
                          Cancel
                        </Button>
                        <Button type="submit" size="sm" className="h-8 text-xs bg-zinc-900 hover:bg-zinc-800" disabled={isSubmitting}>
                          {isEditing
                            ? (isSubmitting ? 'Saving...' : 'Save Changes')
                            : (isSubmitting ? 'Creating...' : 'Create Admin')}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>

          <Separator className="bg-zinc-100" />

          <CardContent className="p-0">
            {loading.admins ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full rounded-md" />)}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-100 hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-6 py-3">Name</TableHead>
                    <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider py-3">Email</TableHead>
                    <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider py-3">Phone</TableHead>
                    <TableHead className="text-xs font-semibold text-zinc-500 uppercase tracking-wider py-3 text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                            <User size={18} className="text-zinc-400" />
                          </div>
                          <p className="text-sm text-zinc-500">{search ? 'No admins match your search.' : 'No admin users yet.'}</p>
                          {!search && <p className="text-xs text-zinc-400">Click "Add Admin" to create one.</p>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAdmins.map((admin) => (
                      <TableRow key={admin.id} className="border-zinc-100 hover:bg-zinc-50/80">
                        <TableCell className="px-6 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                              <span className="text-zinc-600 text-xs font-semibold">
                                {admin.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-zinc-800">{admin.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-zinc-600">{admin.email}</TableCell>
                        <TableCell className="py-3 text-sm text-zinc-600">{admin.phone}</TableCell>
                        <TableCell className="py-3 pr-6">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                              onClick={() => handleEdit(admin)}
                            >
                              <Pencil size={13} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-zinc-400 hover:text-red-500 hover:bg-red-50"
                              onClick={() => confirmDelete(admin.id)}
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>

          {!loading.admins && filteredAdmins.length > 0 && (
            <>
              <Separator className="bg-zinc-100" />
              <div className="px-6 py-3 flex items-center justify-between">
                <p className="text-xs text-zinc-400">
                  {filteredAdmins.length} of {admins.length} admin{admins.length !== 1 ? 's' : ''}
                </p>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">Delete admin account?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              This action cannot be undone. The admin account will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-8 text-xs border-zinc-200" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white"
              onClick={() => adminToDelete && handleDelete(adminToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPortal;