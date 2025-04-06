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

type Admin = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role?: string;
};

type Event = {
  id: number;
  eventName: string;
  eventType: string;
  date: Date;
  fee: number;
};

type Registration = {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  eventId: number;
  eventName: string;
  registrationDate: Date;
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
};

// Mock data generators
const generateMockAdmins = (): Admin[] => [
  { id: 1, name: 'Admin One', email: 'admin1@fest.com', phone: '1234567890', role: 'Super Admin' },
  { id: 2, name: 'Admin Two', email: 'admin2@fest.com', phone: '2345678901', role: 'Event Manager' },
  { id: 3, name: 'Admin Three', email: 'admin3@fest.com', phone: '3456789012', role: 'Content Manager' },
];

const generateMockRegistrations = (events: Event[]): Registration[] => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com' },
  ];

  const statuses: ('Pending' | 'Completed' | 'Failed')[] = ['Pending', 'Completed', 'Failed'];

  return Array.from({ length: 25 }, (_, i) => {
    const user = users[Math.floor(Math.random() * users.length)];
    const event = events[Math.floor(Math.random() * events.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const regDate = new Date();
    regDate.setDate(regDate.getDate() - daysAgo);

    return {
      id: i + 1,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      eventId: event.id,
      eventName: event.eventName,
      registrationDate: regDate,
      paymentStatus: statuses[Math.floor(Math.random() * statuses.length)]
    };
  });
};

const generateRegistrationData = (): { date: string; registrations: number }[] => {
  const today = new Date();
  const may10 = new Date('2024-05-10');
  const daysLeft = Math.ceil((may10.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return Array.from({ length: daysLeft + 1 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      registrations: Math.floor(Math.random() * 20) + 5 // Random between 5-25
    };
  });
};

const AdminPortal = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registrationData, setRegistrationData] = useState<{ date: string; registrations: number }[]>([]);
  const [loading, setLoading] = useState({
    admins: true,
    events: true,
    registrations: true,
    stats: true
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    recentSubmissions: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Administrator'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');

  // Fetch all data on mount
  useEffect(() => {
    fetchAdmins();
    fetchStats();
    setRegistrationData(generateRegistrationData());
  }, []);

  const fetchAdmins = async () => {
    setLoading(prev => ({ ...prev, admins: true }));
    try {
      // Mock API call
      setTimeout(() => {
        setAdmins(generateMockAdmins());
        setLoading(prev => ({ ...prev, admins: false }));
      }, 800);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError("Could not fetch admin users.");
      setLoading(prev => ({ ...prev, admins: false }));
    }
  };

  const fetchStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      // Mock API call
      setTimeout(() => {
        setStats({
          totalUsers: 125, // Mock total users
          recentSubmissions: 12 // Mock recent submissions
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
      role: 'Administrator'
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditing && currentId) {
        // Mock update
        const updatedAdmins = admins.map(admin =>
          admin.id === currentId ? { ...admin, ...formData } : admin
        );
        setAdmins(updatedAdmins);
        resetForm();
        setOpenDialog(false);
      } else {
        // Mock create
        const newAdmin = {
          id: Math.max(...admins.map(a => a.id)) + 1,
          ...formData
        };
        setAdmins([...admins, newAdmin]);
        resetForm();
        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred. Please try again.");
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
      role: admin.role || 'Administrator'
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // Mock delete
      setAdmins(admins.filter(admin => admin.id !== id));
    } catch (error) {
      console.error("Error deleting admin:", error);
      setError("Failed to delete admin.");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 mb-4">
              <ChevronLeft size={16} />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Fest Management Portal</h1>
          <p className="text-muted-foreground">Manage admins, events, and registrations for May 9-10 fest</p>
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
                <p className="text-xs text-muted-foreground">3 with full access</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs className="w-full">

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
                  <Button className="flex items-center gap-2">
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
                      {!isEditing && (
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
                          />
                        </div>
                      )}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                          Role
                        </Label>
                        <select
                          title='Role'
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="col-span-3 border rounded-md p-2"
                        >
                          <option value="Administrator">Administrator</option>
                          <option value="Event Manager">Event Manager</option>
                          <option value="Content Manager">Content Manager</option>
                        </select>
                      </div>
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-red-500 mb-4">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                      </div>
                    )}
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {isEditing ? 'Update' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading.admins ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : admins.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">{admin.name}</TableCell>
                        <TableCell>{admin.role}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.phone}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleEdit(admin)}>
                              <Pencil size={16} />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon">
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete admin {admin.name}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(admin.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No admin users found</p>
                  <Button className="mt-4" onClick={() => setOpenDialog(true)}>
                    Create First Admin
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPortal;