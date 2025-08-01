import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Calendar, Users, Phone, Mail, Eye, Edit, Trash2, Filter, Download, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
interface PaintballBooking {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  service: string;
  booking_date: string;
  booking_time: string;
  group_size: number;
  experience?: string;
  special_requests?: string;
  emergency_contact?: string;
  total_amount?: number;
  paid_amount?: number;
  remaining_balance?: number;
  payment_method?: string;
  payment_receipt_url?: string;
  status: string;
  service_details?: any;
  created_at: string;
  updated_at: string;
}

export interface AdminBookingsRef {
  refresh: () => void;
}

export const AdminBookings = forwardRef<AdminBookingsRef>((_, ref) => {
  const [bookings, setBookings] = useState<PaintballBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<PaintballBooking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('today');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const {
    toast
  } = useToast();
  const isMobile = useIsMobile();

  useImperativeHandle(ref, () => ({
    refresh: fetchBookings,
  }));

  useEffect(() => {
    fetchBookings();

    // Set up real-time subscription for booking changes
    const channel = supabase.channel('booking-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'bookings'
    }, () => {
      // Refetch bookings when any change occurs
      fetchBookings();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from('bookings').select('*').order('booking_date', {
        ascending: true
      }).order('booking_time', {
        ascending: true
      });
      if (error) throw error;
      setBookings((data || []) as PaintballBooking[]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const {
        error
      } = await supabase.from('bookings').update({
        status: newStatus
      }).eq('id', bookingId);
      if (error) throw error;
      setBookings(prev => prev.map(booking => booking.id === bookingId ? {
        ...booking,
        status: newStatus
      } : booking));
      toast({
        title: "Success",
        description: `Booking status updated to ${newStatus}.`
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive"
      });
    }
  };
  const deleteBooking = async (bookingId: string) => {
    try {
      // First, get the booking to check for any uploaded files
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('payment_receipt_url')
        .eq('id', bookingId)
        .single();

      if (fetchError) throw fetchError;

      // If there's a payment receipt file, delete it from storage
      if (booking?.payment_receipt_url) {
        try {
          // Extract the file path from the URL
          // Assuming URLs are in format: https://...supabase.co/storage/v1/object/public/payment-receipts/filename
          const url = new URL(booking.payment_receipt_url);
          const pathParts = url.pathname.split('/');
          const bucketIndex = pathParts.findIndex(part => part === 'payment-receipts');
          
          if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
            const fileName = pathParts.slice(bucketIndex + 1).join('/');
            
            const { error: storageError } = await supabase.storage
              .from('payment-receipts')
              .remove([fileName]);

            if (storageError) {
              console.warn('Failed to delete file from storage:', storageError);
              // Don't stop the booking deletion if file deletion fails
            }
          }
        } catch (fileError) {
          console.warn('Error processing file deletion:', fileError);
          // Continue with booking deletion even if file deletion fails
        }
      }

      // Delete the booking record
      const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
      if (error) throw error;

      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      setIsDetailModalOpen(false);
      toast({
        title: "Success",
        description: "Booking and associated files deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error",
        description: "Failed to delete booking.",
        variant: "destructive"
      });
    }
  };
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'outline';
      case 'confirmed':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'no_show':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getServiceColorIndicator = (service: string) => {
    const serviceLower = service.toLowerCase();
    if (serviceLower.includes('half-day') || serviceLower.includes('half day')) {
      return 'bg-blue-500';
    } else if (serviceLower.includes('group') || serviceLower.includes('package')) {
      return 'bg-green-500';
    } else if (serviceLower.includes('target range')) {
      return 'bg-orange-500';
    } else if (serviceLower.includes('regular') || serviceLower.includes('paintball')) {
      return 'bg-purple-500';
    }
    return 'bg-gray-500';
  };
  const confirmPayment = async (bookingId: string) => {
    try {
      const {
        error
      } = await supabase.from('bookings').update({
        status: 'confirmed'
      }).eq('id', bookingId);
      if (error) throw error;
      setBookings(prev => prev.map(booking => booking.id === bookingId ? {
        ...booking,
        status: 'confirmed'
      } : booking));
      toast({
        title: "Payment Confirmed",
        description: "Booking has been confirmed and added to waiting list."
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Error",
        description: "Failed to confirm payment.",
        variant: "destructive"
      });
    }
  };
  const formatCurrency = (amount?: number) => {
    return amount ? `₱${amount.toLocaleString()}` : 'N/A';
  };
  const formatDate = (dateString: string, formatPattern: string = 'MMM dd, yyyy') => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if invalid date
      }
      return format(date, formatPattern);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if format fails
    }
  };

  // Filter bookings by category
  const getTodaysBookings = () => {
    const today = new Date().toDateString();
    return bookings.filter(booking => {
      try {
        const bookingDate = new Date(booking.booking_date);
        return bookingDate.toDateString() === today;
      } catch {
        return false;
      }
    }).sort((a, b) => {
      // Extract start time from time range (e.g., "8:00 AM-10:00 AM" -> "8:00 AM")
      const getStartTime = (timeRange: string) => {
        return timeRange.split('-')[0].trim();
      };
      
      const dateTimeA = new Date(`${a.booking_date} ${getStartTime(a.booking_time)}`);
      const dateTimeB = new Date(`${b.booking_date} ${getStartTime(b.booking_time)}`);
      return dateTimeA.getTime() - dateTimeB.getTime();
    });
  };
  const getPendingBookings = () => {
    return bookings.filter(booking => booking.status === 'pending');
  };
  const getConfirmedBookings = () => {
    return bookings.filter(booking => booking.status === 'confirmed')
      .sort((a, b) => {
        // Extract start time from time range (e.g., "8:00 AM-10:00 AM" -> "8:00 AM")
        const getStartTime = (timeRange: string) => {
          return timeRange.split('-')[0].trim();
        };
        
        const dateTimeA = new Date(`${a.booking_date} ${getStartTime(a.booking_time)}`);
        const dateTimeB = new Date(`${b.booking_date} ${getStartTime(b.booking_time)}`);
        return dateTimeA.getTime() - dateTimeB.getTime();
      });
  };
  const getBookingsHistory = () => {
    return bookings.filter(booking => booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'no_show');
  };
  const filterBookingsBySearch = (bookingList: PaintballBooking[]) => {
    return bookingList.filter(booking => {
      const matchesSearch = booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || booking.email && booking.email.toLowerCase().includes(searchTerm.toLowerCase()) || booking.phone.includes(searchTerm);
      return matchesSearch;
    });
  };
  const openBookingDetails = (booking: PaintballBooking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };
  const renderBookingList = (bookingList: PaintballBooking[], emptyMessage: string) => {
    const filteredList = filterBookingsBySearch(bookingList);
    if (loading) {
      return <div className="flex items-center justify-center py-8">
          <div className="text-center">Loading bookings...</div>
        </div>;
    }
    if (filteredList.length === 0) {
      return <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">{emptyMessage}</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? "Try adjusting your search term" : "New bookings will appear here"}
          </p>
        </div>;
    }
    return <div className="space-y-4">
        {isMobile ?
      // Mobile Card Layout
      filteredList.map(booking => <Card key={booking.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header with customer name and status */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{booking.customer_name}</h3>
                      <p className="text-xs text-muted-foreground">{booking.phone}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(booking.status)} className="text-xs">
                      {booking.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  {/* Booking details */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Service:</span>
                      <p className="font-medium flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${getServiceColorIndicator(booking.service)}`}></span>
                        {booking.service}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Group Size:</span>
                      <p className="font-medium">{booking.group_size} {booking.group_size === 1 ? 'player' : 'players'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <p className="font-medium">{formatDate(booking.booking_date)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <p className="font-medium">{booking.booking_time}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <p className="font-medium">{formatCurrency(booking.total_amount)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Experience:</span>
                      <p className="font-medium">{booking.experience || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => openBookingDetails(booking)} className="flex-1 h-8 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {booking.status === 'pending' ? (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')} 
                        className="flex-1 h-8 text-xs"
                      >
                        Confirm
                      </Button>
                    ) : (
                      <Select value={booking.status} onValueChange={value => updateBookingStatus(booking.id, value)}>
                        <SelectTrigger className="flex-1 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="no_show">No Show</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this booking? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteBooking(booking.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>) :
      // Desktop Table Layout
      <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Group Size</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredList.map(booking => <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.customer_name}</div>
                        <div className="text-sm text-muted-foreground">{booking.email || 'No email'}</div>
                        <div className="text-sm text-muted-foreground">{booking.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${getServiceColorIndicator(booking.service)}`}></span>
                        {booking.service}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatDate(booking.booking_date)}</div>
                        <div className="text-sm text-muted-foreground">{booking.booking_time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.group_size} {booking.group_size === 1 ? 'player' : 'players'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(booking.total_amount)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openBookingDetails(booking)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {booking.status === 'pending' ? (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                        ) : (
                          <Select value={booking.status} onValueChange={value => updateBookingStatus(booking.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                              <SelectItem value="no_show">No Show</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this booking? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteBooking(booking.id)} className="bg-destructive hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>}
      </div>;
  };
  return <div className="space-y-3 sm:space-y-6">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Booking Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 h-9 sm:h-10" />
          </div>
        </CardContent>
      </Card>

      {/* Mobile: Tabs, Desktop: Buttons */}
      {isMobile ? (
        <Tabs defaultValue="today" className="w-full">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-64 flex-shrink-0">
              <TabsList className="flex flex-row h-auto w-full p-1 bg-muted gap-1">
                <TabsTrigger value="today" className="w-full justify-start text-xs sm:text-sm px-3 py-2 h-auto">
                  Today ({getTodaysBookings().length})
                </TabsTrigger>
                <TabsTrigger value="confirmed" className="w-full justify-start text-xs sm:text-sm px-3 py-2 h-auto">
                  Confirmed ({getConfirmedBookings().length})
                </TabsTrigger>
                <TabsTrigger value="history" className="w-full justify-start text-xs sm:text-sm px-3 py-2 h-auto">
                  History ({getBookingsHistory().length})
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 min-w-0">
              <TabsContent value="today" className="mt-0">
                <Card>
                  <CardContent className="p-3 sm:p-6">
                    {renderBookingList(getTodaysBookings(), "No bookings scheduled for today")}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="confirmed" className="mt-0">
                <Card>
                  <CardContent className="p-3 sm:p-6">
                    {renderBookingList(getConfirmedBookings(), "No confirmed bookings")}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <Card>
                  <CardContent className="p-3 sm:p-6">
                    {renderBookingList(getBookingsHistory(), "No booking history")}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      ) : (
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto bg-muted">
            <TabsTrigger value="today" className="text-sm px-4 py-3">
              Today's Bookings ({getTodaysBookings().length})
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="text-sm px-4 py-3">
              Confirmed Bookings ({getConfirmedBookings().length})
            </TabsTrigger>
            <TabsTrigger value="history" className="text-sm px-4 py-3">
              Bookings History ({getBookingsHistory().length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-4">
            <Card>
              <CardContent className="p-6">
                {renderBookingList(getTodaysBookings(), "No bookings scheduled for today")}
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="confirmed" className="mt-4">
            <Card>
              <CardContent className="p-6">
                {renderBookingList(getConfirmedBookings(), "No confirmed bookings")}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card>
              <CardContent className="p-6">
                {renderBookingList(getBookingsHistory(), "No booking history")}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Booking Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Customer Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Name:</strong> {selectedBooking.customer_name}</div>
                        <div><strong>Email:</strong> {selectedBooking.email || 'Not provided'}</div>
                        <div><strong>Phone:</strong> {selectedBooking.phone}</div>
                        
                        {selectedBooking.emergency_contact && <div><strong>Emergency Contact:</strong> {selectedBooking.emergency_contact}</div>}
                      </div>
                    </div>
                  
                    <div>
                      <h4 className="font-semibold mb-2">Booking Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Service Type:</strong> {selectedBooking.service}</div>
                        <div><strong>Date:</strong> {formatDate(selectedBooking.booking_date, 'EEEE, MMMM dd, yyyy')}</div>
                        <div><strong>Time:</strong> {selectedBooking.booking_time}</div>
                        <div><strong>Group Size:</strong> {selectedBooking.group_size} {selectedBooking.group_size === 1 ? 'player' : 'players'}</div>
                        <div><strong>Status:</strong> 
                          <Badge variant={getStatusBadgeVariant(selectedBooking.status)} className="ml-2">
                            {selectedBooking.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                </div>
                
                {selectedBooking.special_requests && <div>
                    <h4 className="font-semibold mb-2">Special Requests</h4>
                    <p className="text-sm bg-muted p-3 rounded">{selectedBooking.special_requests}</p>
                  </div>}

                {(selectedBooking.total_amount || selectedBooking.paid_amount) && <div>
                    <h4 className="font-semibold mb-2">Payment Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Total Amount:</strong> {formatCurrency(selectedBooking.total_amount)}</div>
                      <div><strong>Paid Amount:</strong> {formatCurrency(selectedBooking.paid_amount)}</div>
                      <div><strong>Remaining Balance:</strong> {formatCurrency(selectedBooking.remaining_balance)}</div>
                      <div><strong>Payment Method:</strong> {selectedBooking.payment_method || 'Not specified'}</div>
                     </div>
                     {selectedBooking.payment_receipt_url && (
                       <div className="mt-3">
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setIsReceiptModalOpen(true)}
                           className="flex items-center gap-2"
                         >
                           <FileText className="w-4 h-4" />
                           View Payment Receipt
                         </Button>
                       </div>
                     )}
                   </div>}
                
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <div><strong>Created:</strong> {formatDate(selectedBooking.created_at, 'MMM dd, yyyy HH:mm')}</div>
                    <div><strong>Last Updated:</strong> {formatDate(selectedBooking.updated_at, 'MMM dd, yyyy HH:mm')}</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Update Status</h4>
                    <Select value={selectedBooking.status} onValueChange={value => updateBookingStatus(selectedBooking.id, value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="confirmed">Confirmed</SelectItem>
                         <SelectItem value="completed">Completed</SelectItem>
                         <SelectItem value="cancelled">Cancelled</SelectItem>
                         <SelectItem value="no_show">No Show</SelectItem>
                       </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2 text-destructive">Danger Zone</h4>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Booking
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this booking? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteBooking(selectedBooking.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </TabsContent>
            </Tabs>}
        </DialogContent>
      </Dialog>

      {/* Payment Receipt Modal */}
      <Dialog open={isReceiptModalOpen} onOpenChange={setIsReceiptModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
          </DialogHeader>
          
          {selectedBooking?.payment_receipt_url && (
            <div className="flex items-center justify-center p-4">
              <img 
                src={selectedBooking.payment_receipt_url} 
                alt="Payment Receipt" 
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const errorDiv = document.createElement('div');
                  errorDiv.className = 'text-center text-muted-foreground p-8';
                  errorDiv.innerHTML = '<p>Unable to load receipt image</p>';
                  target.parentNode?.appendChild(errorDiv);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>;
});