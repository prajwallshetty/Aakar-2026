"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeft, CalendarDays, Trash2, Pencil, Calendar as CalendarIcon, AlertCircle, Plus, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '@/backend/events';
import Link from 'next/link';
import { eventType } from '@prisma/client';
import { Skeleton } from '../ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

interface Event {
  id: number;
  eventName: string;
  eventType: eventType;
  description: string;
  fee: number;
  date: Date;
  time: string;
  venue: string;
  coordinators: Coordinator[];
  rules: string[];
  imageUrl: string;
}

interface Coordinator {
  name: string;
  phone: string;
}

interface EventTypeOption {
  value: eventType;
  label: string;
}

interface FormData {
  eventName: string;
  eventType: eventType;
  description: string;
  fee: number;
  date: Date;
  time: string;
  venue: string;
  coordinators: Coordinator[];
  rules: string[];
  imageUrl: string;
}

const EventsCRUD = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [newCoordinator, setNewCoordinator] = useState<Coordinator>({ name: '', phone: '' });
  const [newRule, setNewRule] = useState('');
  const [formData, setFormData] = useState<FormData>({
    eventName: '',
    eventType: 'Technical',
    description: '',
    fee: 0,
    date: new Date(),
    time: '',
    venue: '',
    coordinators: [],
    rules: [],
    imageUrl: ''
  });

  const eventTypes: EventTypeOption[] = [
    { value: 'Technical', label: 'Technical' },
    { value: 'Cultural', label: 'Cultural' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Special', label: 'Special' },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getAllEvents();
      if (data) {
        setEvents(data.map(event => ({
          ...event,
          date: new Date(event.date),
          coordinators: typeof event.coordinators === 'string'
            ? JSON.parse(event.coordinators)
            : event.coordinators
        })));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Could not fetch events. Please try again.");
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'fee' ? parseInt(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: keyof FormData, value: eventType | Date) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCoordinator = () => {
    if (newCoordinator.name && newCoordinator.phone) {
      setFormData(prev => ({
        ...prev,
        coordinators: [...prev.coordinators, { ...newCoordinator }]
      }));
      setNewCoordinator({ name: '', phone: '' });
    }
  };

  const handleRemoveCoordinator = (index: number) => {
    setFormData(prev => ({
      ...prev,
      coordinators: prev.coordinators.filter((_, i) => i !== index)
    }));
  };

  const handleAddRule = () => {
    if (newRule) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule]
      }));
      setNewRule('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      eventName: '',
      eventType: 'Technical',
      description: '',
      fee: 0,
      date: new Date(),
      time: '',
      venue: '',
      coordinators: [],
      rules: [],
      imageUrl: ''
    });
    setIsEditing(false);
    setCurrentId(null);
    setNewCoordinator({ name: '', phone: '' });
    setNewRule('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const eventData = {
        ...formData,
        fee: formData.fee,
        coordinators: JSON.stringify(formData.coordinators)
      };

      if (isEditing && currentId) {
        await updateEvent(currentId, eventData);
      } else {
        await createEvent(eventData);
      }

      fetchEvents();
      resetForm();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving event:", error);
      setError("Could not save event. Please try again.");
    }
  };

  const handleEdit = (event: Event) => {
    setFormData({
      eventName: event.eventName,
      eventType: event.eventType,
      description: event.description,
      fee: event.fee,
      date: new Date(event.date),
      time: event.time,
      venue: event.venue,
      coordinators: event.coordinators || [],
      rules: event.rules || [],
      imageUrl: event.imageUrl
    });
    setCurrentId(event.id);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Could not delete event. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events Management</h1>
        <Button onClick={() => { resetForm(); setOpenDialog(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>Manage your events and their details</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-10 w-[150px]" />
              </div>

              <div className="space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-4">
                  <Skeleton className="h-8 col-span-2" />
                  <Skeleton className="h-8" />
                  <Skeleton className="h-8" />
                  <Skeleton className="h-8" />
                  <Skeleton className="h-8" />
                </div>

                {/* Table Rows */}
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="grid grid-cols-6 gap-4 items-center">
                    <Skeleton className="h-12 col-span-2" />
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-10 w-10" />
                      <Skeleton className="h-10 w-10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p>No events found. Create your first event!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.eventName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.eventType}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{format(new Date(event.date), 'PPP')}</span>
                        <span className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" /> {event.time}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.venue}
                      </div>
                    </TableCell>
                    <TableCell>₹{event.fee}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(event)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the event.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(event.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            <DialogDescription>
              Fill in the details for your event. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Basic Info */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="eventName" className="text-right">
                  Event Name
                </Label>
                <Input
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="eventType" className="text-right">
                  Event Type
                </Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value: eventType) => handleSelectChange('eventType', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fee" className="text-right">
                  Fee (₹)
                </Label>
                <Input
                  id="fee"
                  name="fee"
                  type="number"
                  min="0"
                  value={formData.fee}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="col-span-3 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && handleSelectChange('date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  placeholder="e.g. 10:00 AM - 2:00 PM"
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="venue" className="text-right">
                  Venue
                </Label>
                <Input
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="e.g. Main Auditorium"
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="col-span-3"
                />
              </div>

              <Separator className="my-2" />

              {/* Coordinators Section */}
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="text-right pt-2">
                  <Label>Coordinators</Label>
                </div>
                <div className="col-span-3 space-y-3">
                  {formData.coordinators.length > 0 && (
                    <div className="space-y-2">
                      {formData.coordinators.map((coordinator, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-1 flex items-center gap-2">
                            <span>{coordinator.name}</span>
                            <span className="text-sm text-gray-500">({coordinator.phone})</span>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveCoordinator(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Name"
                      value={newCoordinator.name}
                      onChange={(e) => setNewCoordinator({ ...newCoordinator, name: e.target.value })}
                    />
                    <Input
                      placeholder="Phone"
                      value={newCoordinator.phone}
                      onChange={(e) => setNewCoordinator({ ...newCoordinator, phone: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddCoordinator}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Rules Section */}
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="text-right pt-2">
                  <Label>Rules</Label>
                </div>
                <div className="col-span-3 space-y-3">
                  {formData.rules.length > 0 && (
                    <div className="space-y-2">
                      {formData.rules.map((rule, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-1">
                            <span>{index + 1}. {rule}</span>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveRule(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a rule"
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddRule}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsCRUD;