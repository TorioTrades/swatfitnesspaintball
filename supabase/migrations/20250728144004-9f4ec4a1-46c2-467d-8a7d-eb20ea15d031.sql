-- Create bookings table for customer appointments
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  service_details JSONB,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  group_size INTEGER NOT NULL DEFAULT 1,
  special_requests TEXT,
  emergency_contact TEXT,
  experience TEXT,
  total_amount DECIMAL(10,2),
  paid_amount DECIMAL(10,2),
  payment_method TEXT,
  remaining_balance DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access (for now, allow all operations - will need proper auth later)
CREATE POLICY "Allow admin access to bookings" 
ON public.bookings 
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_bookings_date ON public.bookings(booking_date DESC);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at DESC);