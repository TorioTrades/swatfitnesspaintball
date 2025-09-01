import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BookingData } from './BookingModal';
const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  service: z.string().min(1, 'Please select a service'),
  groupSize: z.number().min(1, 'Group size must be at least 1').max(50, 'Maximum group size is 50'),
  specialRequests: z.string().optional(),
  emergencyContact: z.string().optional(),
  experience: z.string().optional()
});
type BookingFormData = z.infer<typeof bookingSchema>;
interface CustomerFormProps {
  onSubmit: (data: Partial<BookingData>) => void;
  onBack: () => void;
  initialData?: Partial<BookingData>;
}
export const CustomerForm: React.FC<CustomerFormProps> = ({
  onSubmit,
  onBack,
  initialData
}) => {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const {
    toast
  } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors
    }
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: initialData?.customerName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      service: initialData?.service || '',
      groupSize: initialData?.groupSize || 1,
      specialRequests: initialData?.specialRequests || '',
      emergencyContact: initialData?.emergencyContact || '',
      experience: initialData?.experience || ''
    }
  });
  const services = ['Paintball Regular (P 700 + 30 bullets)', 'Target Range Regular (P 250 + 10 bullets)', 'Half Day Morning (8AM-12NN) - P 18,000', 'Half Day Afternoon (1PM-5PM) - P 20,000', 'Group Package - 10 Players (9+1 FREE)', 'Group Package - 15 Players (14+1 FREE)', 'Group Package - 20 Players (19+1 FREE)'];
  const experienceLevels = ['First Time Player', 'Beginner (1-3 times)', 'Intermediate (4-10 times)', 'Experienced (10+ times)', 'Expert/Competitive Player'];
  const handleCopyGCashNumber = () => {
    navigator.clipboard.writeText('09178113010');
    toast({
      title: "Copied!",
      description: "GCash number copied to clipboard"
    });
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      toast({
        title: "Receipt Uploaded",
        description: `File "${file.name}" uploaded successfully`
      });
    }
  };
  const calculateDownpayment = () => {
    const totalPrice = getTotalPrice();
    return Math.ceil(totalPrice * 0.3); // 30% downpayment, rounded up
  };
  const getTotalPrice = () => {
    const selectedService = initialData?.service;
    if (!selectedService) return 0;

    // First priority: Use totalAmount from serviceDetails if available (from Half Day Confirmation)
    if (initialData?.serviceDetails?.totalAmount) {
      return initialData.serviceDetails.totalAmount;
    }

    // Handle group services - extract price from serviceDetails.price
    if (selectedService === 'group' && initialData?.serviceDetails?.price) {
      const priceString = initialData.serviceDetails.price;
      // Extract number from "₱13,300" format
      const priceMatch = priceString.match(/₱\s*([\d,]+)/);
      if (priceMatch) {
        return parseInt(priceMatch[1].replace(/,/g, ''));
      }
    }

    // Handle calculator services
    if (selectedService === 'regular' || selectedService === 'target-range') {
      const total = initialData?.serviceDetails?.total || 0;
      return total;
    }

    // Handle half-day services - use total from serviceDetails if available
    if (selectedService === 'half-day' && initialData?.serviceDetails?.total) {
      return initialData.serviceDetails.total;
    }

    // Handle all Half Day services - check for various formats
    if (selectedService.toLowerCase().includes('half day afternoon') || selectedService.includes('1PM-5PM') || selectedService.includes('P 20,000')) {
      return 20000;
    }
    if (selectedService.toLowerCase().includes('half day morning') || selectedService.includes('8AM-12NN') || selectedService.includes('P 18,000')) {
      return 18000;
    }

    // Extract price from service string using multiple patterns
    let priceMatch = selectedService.match(/P\s*([\d,]+)/);
    if (!priceMatch) {
      priceMatch = selectedService.match(/₱\s*([\d,]+)/);
    }
    if (priceMatch) {
      const price = parseInt(priceMatch[1].replace(/,/g, ''));
      return price;
    }

    // Group packages with explicit checks
    if (selectedService.includes('20 Players')) {
      return 13300;
    }
    if (selectedService.includes('15 Players')) {
      return 9800;
    }
    if (selectedService.includes('10 Players')) {
      return 6300;
    }

    // Regular services
    if (selectedService.toLowerCase().includes('paintball regular')) {
      return 700;
    }
    if (selectedService.toLowerCase().includes('target range regular')) {
      return 250;
    }

    // If nothing matches but we have serviceDetails total, use that
    if (initialData?.serviceDetails?.total) {
      return initialData.serviceDetails.total;
    }
    return 0;
  };
  const handleFormSubmit = (data: BookingFormData) => {
    // Check if receipt is uploaded
    if (!receiptFile) {
      toast({
        title: "Receipt Required",
        description: "Please upload your payment receipt before confirming the booking.",
        variant: "destructive"
      });
      return;
    }

    // Navigate directly to confirmation tab
    onSubmit({
      ...data,
      receiptFile: receiptFile || undefined
    });
    // Delay scroll to ensure new content is rendered
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };
  return <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input id="customerName" {...register('customerName')} placeholder="Enter your full name" />
                  {errors.customerName && <p className="text-sm text-destructive mt-1">{errors.customerName.message}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" {...register('phone')} placeholder="+63 912 345 6789" />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input id="email" type="email" {...register('email')} placeholder="your.email@example.com (optional)" />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                </div>

              </div>
            </div>

            {/* Downpayment Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Downpayment (30% Required)</h3>
              
              {/* Always show if we have a service selected */}
              {initialData?.service && <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center md:text-left">
                      <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-foreground">₱{getTotalPrice().toLocaleString()}</p>
                      
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-sm text-muted-foreground mb-1">30% Downpayment Required</p>
                      <p className="text-3xl font-bold text-primary">₱{calculateDownpayment().toLocaleString()}</p>
                      <p className="text-sm font-medium text-accent-foreground">Send this amount to GCash</p>
                    </div>
                  </div>
                </div>}
              
              <div className="bg-muted/20 p-4 rounded-lg space-y-4">
                <p className="text-sm text-muted-foreground">
                  A 30% downpayment is required to reserve your booking slot. Please send the downpayment to the GCash number below:
                </p>
                
                {initialData?.service && getTotalPrice() > 0 && <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
                    <p className="text-sm font-medium text-primary">
                      💡 Downpayment Calculation: ₱{getTotalPrice().toLocaleString()} × 30% = ₱{calculateDownpayment().toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Send exactly ₱{calculateDownpayment().toLocaleString()} to secure your booking
                    </p>
                  </div>}
                
                <div className="flex items-center gap-3 p-3 bg-background rounded-md border">
                  <img src="/lovable-uploads/829cb545-0822-47ec-baba-ef93199459a7.png" alt="GCash Logo" className="w-8 h-8 object-contain" />
                  <div className="flex-1">
                    <Label className="text-sm font-medium">GCash Number</Label>
                    <p className="text-lg font-mono font-bold">09178113010</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleCopyGCashNumber} className="flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipt">Upload Payment Receipt *</Label>
                  <div className="flex items-center gap-3">
                    <Input id="receipt" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <Button type="button" variant="outline" onClick={() => document.getElementById('receipt')?.click()} className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {receiptFile ? 'Change Receipt' : 'Upload Receipt'}
                    </Button>
                    {receiptFile && <span className="text-sm text-muted-foreground">
                        {receiptFile.name}
                      </span>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    📸 Please screenshot your payment receipt and upload it here to confirm your downpayment.
                  </p>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="specialRequests">Special Requests or Requirements</Label>
                <Textarea id="specialRequests" {...register('specialRequests')} placeholder="Any special requests, dietary requirements, accessibility needs, or additional information" rows={3} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto min-h-[44px] touch-manipulation">
                Back to Calendar
              </Button>
              <Button type="submit" className="w-full sm:w-auto min-h-[44px] touch-manipulation">
                Confirm Booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>;
};