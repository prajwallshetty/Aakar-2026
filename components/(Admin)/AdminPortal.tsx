"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, UserPlus, Trash2, Pencil, User, AlertCircle, CalendarDays, Ticket, Users } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';

// Import server actions
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '@/backend/admin';

// Define proper types based on your Prisma schema
type Admin = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

// Interface for error responses from backend
interface ErrorResponse {
  error: string;
}

// Helper to check if response is an error
function isErrorResponse(response: any): response is ErrorResponse {
  return response && typeof response === 'object' && 'error' in response;
}

const AdminPortal = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState({
    admins: true,
    stats: true
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    recentSubmissions: 0
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);

  // Fetch all data on mount
  useEffect(() => {
    fetchAdmins();
    fetchStats();
  }, []);

  const fetchAdmins = async () => {
    setLoading(prev => ({ ...prev, admins: true }));
    try {
      const response = await getAdmins();
      if (response?.length === 0) {
        setAdmins([]);
        setError('No admin users found. Create your first admin user.');
        return;
      }

      if (!response) {
        throw new Error("No response from server");
      }

      if (isErrorResponse(response)) {
        toast.error(response.error);
        setError(response.error);
      } else {
        // If not an error, it's an array of admins
        setAdmins(response as Admin[]);
        setError('');
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError("Could not fetch admin users.");
      toast.error("Failed to load admin users");
    } finally {
      setLoading(prev => ({ ...prev, admins: false }));
    }
  };

  const fetchStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      // For demo purposes, using static data
      setTimeout(() => {
        setStats({
          totalUsers: 125,
          recentSubmissions: 12
        });
        setLoading(prev => ({ ...prev, stats: false }));
      }, 600);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
    });
    setIsEditing(false);
    setCurrentId(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditing && currentId) {
        // Update existing admin
        const adminData = { ...formData };
        // Only include password if it's not empty
        if (!adminData.password) {
          const { password, ...rest } = adminData;
          const response = await updateAdmin(currentId, rest);

          if (!response) {
            throw new Error("No response from server");
          }

          if (isErrorResponse(response)) {
            setError(response.error);
            toast.error(response.error);
          } else {
            toast.success("Admin updated successfully");
            await fetchAdmins();
            resetForm();
            setOpenDialog(false);
          }
        } else {
          const response = await updateAdmin(currentId, adminData);

          if (!response) {
            throw new Error("No response from server");
          }

          if (isErrorResponse(response)) {
            setError(response.error);
            toast.error(response.error);
          } else {
            toast.success("Admin updated successfully");
            await fetchAdmins();
            resetForm();
            setOpenDialog(false);
          }
        }
      } else {
        // Create new admin
        const response = await createAdmin(formData);

        if (!response) {
          throw new Error("No response from server");
        }

        if (isErrorResponse(response)) {
          setError(response.error);
          toast.error(response.error);
        } else {
          toast.success("New admin created successfully");
          await fetchAdmins();
          resetForm();
          setOpenDialog(false);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred. Please try again.");
      toast.error("An unexpected error occurred");
    }
  };

  const handleEdit = (admin: Admin) => {
    setIsEditing(true);
    setCurrentId(admin.id);
    setFormData({
      name: admin.name || '',
      email: admin.email || '',
      phone: admin.phone || '',
      password: '',
    });
    setOpenDialog(true);
  };

  const confirmDelete = (id: number) => {
    setAdminToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteAdmin(id);

      if (!response) {
        throw new Error("No response from server");
      }

      if (isErrorResponse(response)) {
        toast.error(response.error);
      } else {
        toast.success("Admin deleted successfully");
        await fetchAdmins();
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Failed to delete admin");
    } finally {
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aakar Management Portal</h1>
          <p className="text-muted-foreground">Manage admins, events, and registrations for Aakar</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.stats ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Submissions</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.stats ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.recentSubmissions}</div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.admins ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{admins.length}</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="admins" className="w-full">

        {/* Admins Tab */}
        <TabsContent value="admins" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User size={18} />
                  Admin Users
                </CardTitle>
                <CardDescription>
                  Manage administrator accounts for the fest
                </CardDescription>
              </div>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center cursor-pointer gap-2">
                    <UserPlus size={16} />
                    Add Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Admin' : 'Create Admin'}</DialogTitle>
                    <DialogDescription>
                      {isEditing ? 'Update admin details' : 'Add a new administrator'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                          Password
                        </Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="col-span-3"
                          required={!isEditing}
                          placeholder={isEditing ? "Leave blank to keep current password" : ""}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2 mb-4">
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    )}

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => {
                        resetForm();
                        setOpenDialog(false);
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {isEditing ? 'Save Changes' : 'Create Admin'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading.admins ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No admin users found. Create your first admin user.
                        </TableCell>
                      </TableRow>
                    ) : (
                      admins.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell className="font-medium">{admin.name}</TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell>{admin.phone}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(admin)}
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => confirmDelete(admin.id)}
                              >
                                <Trash2 size={16} />
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
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the admin account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => adminToDelete && handleDelete(adminToDelete)} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPortal;