import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Calendar, Clock, User, Phone, Mail, Target, AlertCircle, Users, Download, CreditCard } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { BookingData } from './BookingModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
interface BookingConfirmationProps {
  bookingData: BookingData;
  onClose: () => void;
  onBack: () => void;
}
export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingData,
  onClose,
  onBack
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();
  const calculateServicePrice = (service: string, serviceDetails?: any) => {
    if (!service) return 2100; // Default amount

    // For group packages from PackageConfirmation
    if (service === 'group' && serviceDetails?.finalTotal) {
      return serviceDetails.finalTotal;
    }

    // For half-day rentals from HalfDayConfirmation
    if (service === 'half-day' && serviceDetails?.totalAmount) {
      return serviceDetails.totalAmount;
    }

    // For calculator services
    if (service === 'regular' || service === 'target-range') {
      return serviceDetails?.total || 2100;
    }

    // Extract price from service string for fixed packages
    const priceMatch = service.match(/P\s*([\d,]+)/);
    if (priceMatch) {
      return parseInt(priceMatch[1].replace(',', ''));
    }

    // Default prices for group packages
    if (service.includes('10 Players')) return 7000;
    if (service.includes('15 Players')) return 10500;
    if (service.includes('20 Players')) return 14000;

    return 2100;
  };

  const generateReceiptImage = (bookingId: string) => {
    // Calculate payment details
    const totalAmount = bookingData.totalAmount || calculateServicePrice(bookingData.service, bookingData.serviceDetails);
    const paidAmount = bookingData.paidAmount || Math.round(totalAmount * 0.3);
    const remainingBalance = totalAmount - paidAmount;
    const paymentMethod = bookingData.paymentMethod || 'GCash';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size - increase height to accommodate receipt image
    canvas.width = 800;
    canvas.height = bookingData.receiptFile ? 1500 : 1100;

    const drawContent = (receiptImageHeight = 0) => {
      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAINTBALL BOOKING RECEIPT', canvas.width / 2, 50);

      // Decorative line
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(50, 70, canvas.width - 100, 3);

      let y = 120;
      const leftMargin = 60;
      const lineHeight = 30;

      // Booking ID and Status
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Booking ID: ${bookingId}`, leftMargin, y);
      y += lineHeight;
      ctx.fillText(`Date Generated: ${new Date().toLocaleString()}`, leftMargin, y);
      y += lineHeight;
      ctx.fillText('Status: CONFIRMED', leftMargin, y);
      y += lineHeight * 1.5;

      // Customer Information
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('CUSTOMER INFORMATION', leftMargin, y);
      y += lineHeight;
      
      ctx.fillStyle = '#374151';
      ctx.font = '16px Arial';
      ctx.fillText(`Name: ${bookingData.customerName}`, leftMargin + 20, y);
      y += lineHeight * 0.8;
      ctx.fillText(`Phone: ${bookingData.phone}`, leftMargin + 20, y);
      y += lineHeight * 0.8;
      
      if (bookingData.email) {
        ctx.fillText(`Email: ${bookingData.email}`, leftMargin + 20, y);
        y += lineHeight * 0.8;
      }
      
      if (bookingData.emergencyContact) {
        ctx.fillText(`Emergency Contact: ${bookingData.emergencyContact}`, leftMargin + 20, y);
        y += lineHeight * 0.8;
      }
      
      y += lineHeight;

      // Booking Details
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('BOOKING DETAILS', leftMargin, y);
      y += lineHeight;
      
      ctx.fillStyle = '#374151';
      ctx.font = '16px Arial';
      ctx.fillText(`Date: ${formatDate(bookingData.bookingDate)}`, leftMargin + 20, y);
      y += lineHeight * 0.8;
      ctx.fillText(`Time: ${formatTime(bookingData.bookingTime)}`, leftMargin + 20, y);
      y += lineHeight * 0.8;
      ctx.fillText(`Service Package: ${bookingData.service}`, leftMargin + 20, y);
      y += lineHeight * 0.8;
      ctx.fillText(`Group Size: ${bookingData.groupSize} ${bookingData.groupSize === 1 ? 'Player' : 'Players'}`, leftMargin + 20, y);
      y += lineHeight * 0.8;
      
      if (bookingData.experience) {
        ctx.fillText(`Experience Level: ${bookingData.experience}`, leftMargin + 20, y);
        y += lineHeight * 0.8;
      }
      
      if (bookingData.specialRequests) {
        ctx.fillText(`Special Requests: ${bookingData.specialRequests}`, leftMargin + 20, y);
        y += lineHeight * 0.8;
      }
      
      y += lineHeight;

      // Payment Information
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('PAYMENT INFORMATION', leftMargin, y);
      y += lineHeight;
      
      ctx.fillStyle = '#374151';
      ctx.font = '16px Arial';
      ctx.fillText(`Total Amount: ₱${totalAmount.toLocaleString()}`, leftMargin + 20, y);
      y += lineHeight * 0.8;
      ctx.fillText(`Paid via ${paymentMethod}: ₱${paidAmount.toLocaleString()} (30%)`, leftMargin + 20, y);
      y += lineHeight * 0.8;
      ctx.fillText(`Remaining Balance: ₱${remainingBalance.toLocaleString()}`, leftMargin + 20, y);
      y += lineHeight * 0.8;
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('✓ Deposit Confirmed', leftMargin + 20, y);
      y += lineHeight * 2;

      // Payment Receipt Section (if receipt file exists)
      if (bookingData.receiptFile && receiptImageHeight > 0) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('PAYMENT RECEIPT', leftMargin, y);
        y += lineHeight * 1.5;
        
        // Return the Y position where the image should be placed
        return y;
      }

      // Skip to reminders section
      y += lineHeight;

      // Important Reminders
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('IMPORTANT REMINDERS', leftMargin, y);
      y += lineHeight;
      
      ctx.fillStyle = '#374151';
      ctx.font = '14px Arial';
      const reminders = [
        '• Arrive 30 minutes early for safety briefing and equipment fitting',
        '• Wear closed-toe shoes and comfortable clothing that can get dirty',
        '• All safety equipment is provided (mask, vest, gun, air tank)',
        '• Additional bullets can be purchased on-site (P 5.00 each)',
        '• Minimum age requirement: 10 years old with adult supervision',
        '• Weather-dependent activity - we\'ll contact you if conditions are unsafe'
      ];
      
      reminders.forEach(reminder => {
        ctx.fillText(reminder, leftMargin + 20, y);
        y += lineHeight * 0.7;
      });
      
      y += lineHeight;
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('For questions or changes, contact us on Facebook Messenger.', leftMargin, y);
      y += lineHeight * 1.5;
      
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('Thank you for choosing our paintball experience!', canvas.width / 2, y);

      return y;
    };

    // If there's a receipt file, load it and draw it
    if (bookingData.receiptFile) {
      const img = new Image();
      img.onload = () => {
        // Calculate proper dimensions maintaining aspect ratio
        const maxWidth = 600;
        const maxHeight = 450;
        
        let imageWidth = img.width;
        let imageHeight = img.height;
        
        // Scale down if image is too large
        if (imageWidth > maxWidth || imageHeight > maxHeight) {
          const widthRatio = maxWidth / imageWidth;
          const heightRatio = maxHeight / imageHeight;
          const ratio = Math.min(widthRatio, heightRatio);
          
          imageWidth = imageWidth * ratio;
          imageHeight = imageHeight * ratio;
        }
        
        // Adjust canvas height to accommodate the actual image size
        canvas.height = 1100 + imageHeight + 100; // Add padding
        
        // Draw all content first and get the Y position for the image
        const imageY = drawContent(imageHeight);
        
        if (imageY) {
          // Center the image horizontally
          const imageX = (canvas.width - imageWidth) / 2;
          
          // Draw a border around the image
          ctx.strokeStyle = '#d1d5db';
          ctx.lineWidth = 2;
          ctx.strokeRect(imageX - 5, imageY - 5, imageWidth + 10, imageHeight + 10);
          
          // Draw the receipt image with proper dimensions
          ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);
          
          // Draw reminders section after the image
          let y = imageY + imageHeight + 40;
          const leftMargin = 60;
          const lineHeight = 30;
          
          // Important Reminders
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'left';
          ctx.fillText('IMPORTANT REMINDERS', leftMargin, y);
          y += lineHeight;
          
          ctx.fillStyle = '#374151';
          ctx.font = '14px Arial';
          const reminders = [
            '• Arrive 30 minutes early for safety briefing and equipment fitting',
            '• Wear closed-toe shoes and comfortable clothing that can get dirty',
            '• All safety equipment is provided (mask, vest, gun, air tank)',
            '• Additional bullets can be purchased on-site (P 5.00 each)',
            '• Minimum age requirement: 10 years old with adult supervision',
            '• Weather-dependent activity - we\'ll contact you if conditions are unsafe'
          ];
          
          reminders.forEach(reminder => {
            ctx.fillText(reminder, leftMargin + 20, y);
            y += lineHeight * 0.7;
          });
          
          y += lineHeight;
          
          ctx.fillStyle = '#1f2937';
          ctx.font = 'bold 16px Arial';
          ctx.fillText('For questions or changes, contact us on Facebook Messenger.', leftMargin, y);
          y += lineHeight * 1.5;
          
          ctx.textAlign = 'center';
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 18px Arial';
          ctx.fillText('Thank you for choosing our paintball experience!', canvas.width / 2, y);
        }
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `paintball-receipt-${bookingId}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }
        });
      };
      
      img.onerror = () => {
        // If image fails to load, just draw content without receipt image
        drawContent();
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `paintball-receipt-${bookingId}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }
        });
      };
      
      // Convert the file to a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(bookingData.receiptFile);
    } else {
      // No receipt file, just draw content
      drawContent();
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `paintball-receipt-${bookingId}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      });
    }
  };

  const handleInitialConfirm = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setShowConfirmDialog(false);
    
    try {
      // Calculate payment details
      const totalAmount = bookingData.totalAmount || calculateServicePrice(bookingData.service, bookingData.serviceDetails);
      const paidAmount = bookingData.paidAmount || Math.round(totalAmount * 0.3);
      const remainingBalance = totalAmount - paidAmount;
      const paymentMethod = bookingData.paymentMethod || 'GCash';

      let paymentReceiptUrl = null;

      // Upload receipt file to Supabase storage if provided
      if (bookingData.receiptFile) {
        const fileExt = bookingData.receiptFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-receipts')
          .upload(fileName, bookingData.receiptFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error('Failed to upload payment receipt');
        }

        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('payment-receipts')
          .getPublicUrl(fileName);
        
        paymentReceiptUrl = publicUrl;
      }

      // Map service types to database values
      const mapServiceType = (service: string) => {
        if (service === 'regular') return 'regular_rates';
        if (service === 'target-range') return 'target_range';
        if (service === 'group' || service === 'half-day' || service.includes('Group')) return 'group_booking';
        return 'regular_rates'; // default fallback
      };

      // Save booking to Supabase database
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          customer_name: bookingData.customerName,
          email: bookingData.email,
          phone: bookingData.phone,
          service: bookingData.service || 'regular',
          booking_date: bookingData.bookingDate,
          booking_time: bookingData.bookingTime,
          group_size: bookingData.groupSize || 1,
          special_requests: bookingData.specialRequests,
          emergency_contact: bookingData.emergencyContact,
          experience: bookingData.experience || 'beginner',
          total_amount: totalAmount,
          paid_amount: paidAmount,
          remaining_balance: totalAmount - paidAmount,
          payment_method: paymentMethod,
          payment_receipt_url: paymentReceiptUrl,
          status: 'confirmed' // Set initial status to confirmed
        })
        .select()
        .single();

      if (error) throw error;

      // Generate a unique ID for the receipt
      const bookingId = data.id;
      
      // Generate and download receipt image
      generateReceiptImage(bookingId);
      
      toast({
        title: "🎯 Booking Submitted Successfully!",
        description: "Your booking has been submitted and is pending payment confirmation. You'll receive confirmation once payment is verified."
      });

      setIsConfirmed(true);
    } catch (error) {
      console.error('Error booking paintball session:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error submitting your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageUs = () => {
    // Check if it's mobile device
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const messengerUrl = isMobile 
      ? 'https://www.messenger.com/t/701864813008050'
      : 'https://www.facebook.com/messages/t/701864813008050';
    
    window.open(messengerUrl, '_blank');
  };
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };
  const formatTime = (timeString: string) => {
    try {
      // If the time already includes AM/PM, return as is
      if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
        return timeString;
      }
      
      // Handle 24-hour format
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, 'h:mm a');
    } catch {
      return timeString;
    }
  };
  return <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-600">Battle Ready!</h2>
        <p className="text-muted-foreground">Please review your paintball session details</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Session DateTime */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Booking Date & Time
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Date</span>
                </div>
                <p className="text-lg font-bold text-foreground">{formatDate(bookingData.bookingDate)}</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Time</span>
                </div>
                <p className="text-lg font-bold text-foreground">{formatTime(bookingData.bookingTime)}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="w-5 h-5 mr-2" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="font-medium">{bookingData.customerName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="font-medium flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {bookingData.phone}
                </p>
              </div>
              
              {bookingData.email && <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="font-medium flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {bookingData.email}
                  </p>
                </div>}
              
              {bookingData.emergencyContact && <div>
                  <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                  <p className="font-medium">{bookingData.emergencyContact}</p>
                </div>}
            </div>
          </div>

          {/* Session Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Paintball Session Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Service Package</label>
                <p className="font-medium">
                  <Badge variant="outline">{bookingData.service}</Badge>
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Group Size</label>
                <p className="font-medium flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {bookingData.groupSize} {bookingData.groupSize === 1 ? 'Player' : 'Players'}
                </p>
              </div>
              
              {bookingData.experience && <div>
                  <label className="text-sm font-medium text-muted-foreground">Experience Level</label>
                  <p className="font-medium">{bookingData.experience}</p>
                </div>}
            </div>
            
            {bookingData.specialRequests && <div>
                <label className="text-sm font-medium text-muted-foreground">Special Requests</label>
                <p className="font-medium">{bookingData.specialRequests}</p>
              </div>}
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                <p className="font-medium text-lg">
                  ₱{(bookingData.totalAmount || calculateServicePrice(bookingData.service, bookingData.serviceDetails)).toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Paid via GCash (30%)</label>
                <p className="font-medium text-lg text-green-600">
                  ₱{(bookingData.paidAmount || Math.round((bookingData.totalAmount || calculateServicePrice(bookingData.service, bookingData.serviceDetails)) * 0.3)).toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Remaining Balance</label>
                <p className="font-medium text-lg text-orange-600">
                  ₱{((bookingData.totalAmount || calculateServicePrice(bookingData.service, bookingData.serviceDetails)) - (bookingData.paidAmount || Math.round((bookingData.totalAmount || calculateServicePrice(bookingData.service, bookingData.serviceDetails)) * 0.3))).toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                <p className="font-medium text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Deposit Confirmed
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Important Notice:</p>
              <ul className="text-yellow-700 mt-1 space-y-1">
                <li>
              </li>
                <li>• Arrive 30 minutes early for safety briefing and equipment fitting</li>
                <li>• Wear closed-toe shoes and comfortable clothing that can get dirty</li>
                <li>• All safety equipment is provided (mask, vest, gun, air tank)</li>
                <li>• Additional bullets can be purchased on-site (P 5.00 each)</li>
                <li>• Minimum age requirement: 10 years old with adult supervision</li>
                <li>• Weather-dependent activity - we'll contact you if conditions are unsafe</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting || isConfirmed}>
          Back to Edit
        </Button>
        {!isConfirmed ? (
          <Button onClick={handleInitialConfirm} disabled={isSubmitting} className="min-w-32">
            Confirm Booking
          </Button>
        ) : (
          <Button onClick={handleMessageUs} className="min-w-32 bg-[#1877f2] hover:bg-[#166fe5] text-white">
            💬 Message Us on Facebook
          </Button>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Confirm Booking & Download Receipt
            </DialogTitle>
            <DialogDescription>
              This will confirm your paintball booking and automatically download your receipt as an image file. Do you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Confirming...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Confirm & Download
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};