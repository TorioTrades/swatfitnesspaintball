-- Drop existing dental clinic tables
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS dentist_unavailable_schedules CASCADE;

-- Create paintball bookings table
CREATE TABLE public.paintball_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('regular_rates', 'group_booking', 'target_range')),
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  group_size INTEGER NOT NULL DEFAULT 1,
  duration_hours DECIMAL(3,1) NOT NULL DEFAULT 2.0,
  equipment_rental BOOLEAN NOT NULL DEFAULT false,
  special_requests TEXT,
  emergency_contact TEXT,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  total_amount DECIMAL(10,2),
  paid_amount DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'refunded')),
  booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create paintball service packages table
CREATE TABLE public.paintball_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_name TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('regular_rates', 'group_booking', 'target_range')),
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  max_players INTEGER NOT NULL,
  min_players INTEGER NOT NULL DEFAULT 1,
  duration_hours DECIMAL(3,1) NOT NULL,
  includes_equipment BOOLEAN NOT NULL DEFAULT false,
  includes_paintballs INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create paintball availability schedules table
CREATE TABLE public.paintball_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  available_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  max_bookings INTEGER NOT NULL DEFAULT 4,
  current_bookings INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  special_pricing DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(available_date, time_slot)
);

-- Enable Row Level Security
ALTER TABLE public.paintball_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paintball_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paintball_availability ENABLE ROW LEVEL SECURITY;

-- Create policies for paintball_bookings
CREATE POLICY "Anyone can create bookings" 
ON public.paintball_bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view bookings" 
ON public.paintball_bookings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update bookings" 
ON public.paintball_bookings 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete bookings" 
ON public.paintball_bookings 
FOR DELETE 
USING (true);

-- Create policies for paintball_packages
CREATE POLICY "Everyone can view active packages" 
ON public.paintball_packages 
FOR SELECT 
USING (is_active = true OR true); -- Allow admin to see all

CREATE POLICY "Anyone can create packages" 
ON public.paintball_packages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update packages" 
ON public.paintball_packages 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete packages" 
ON public.paintball_packages 
FOR DELETE 
USING (true);

-- Create policies for paintball_availability
CREATE POLICY "Everyone can view availability" 
ON public.paintball_availability 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create availability" 
ON public.paintball_availability 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update availability" 
ON public.paintball_availability 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete availability" 
ON public.paintball_availability 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_paintball_bookings_updated_at
BEFORE UPDATE ON public.paintball_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_paintball_packages_updated_at
BEFORE UPDATE ON public.paintball_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_paintball_availability_updated_at
BEFORE UPDATE ON public.paintball_availability
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample paintball packages
INSERT INTO public.paintball_packages (package_name, service_type, description, base_price, max_players, min_players, duration_hours, includes_equipment, includes_paintballs) VALUES
('Basic Paintball Session', 'regular_rates', 'Standard paintball game with basic equipment', 25.00, 20, 1, 2.0, true, 100),
('Premium Paintball Package', 'regular_rates', 'Premium paintball experience with upgraded gear', 45.00, 20, 1, 3.0, true, 200),
('Group Booking - Small', 'group_booking', 'Perfect for small groups and birthday parties', 200.00, 10, 6, 2.5, true, 150),
('Group Booking - Large', 'group_booking', 'Ideal for corporate events and large parties', 400.00, 20, 12, 3.0, true, 250),
('Target Range - 1 Hour', 'target_range', 'Target practice session with instruction', 20.00, 8, 1, 1.0, true, 50),
('Target Range - 2 Hours', 'target_range', 'Extended target practice with coaching', 35.00, 8, 1, 2.0, true, 100);

-- Insert sample availability (next 7 days)
INSERT INTO public.paintball_availability (available_date, time_slot, max_bookings, current_bookings) VALUES
(CURRENT_DATE + INTERVAL '1 day', '09:00', 4, 0),
(CURRENT_DATE + INTERVAL '1 day', '11:00', 4, 0),
(CURRENT_DATE + INTERVAL '1 day', '13:00', 4, 0),
(CURRENT_DATE + INTERVAL '1 day', '15:00', 4, 0),
(CURRENT_DATE + INTERVAL '2 days', '09:00', 4, 0),
(CURRENT_DATE + INTERVAL '2 days', '11:00', 4, 0),
(CURRENT_DATE + INTERVAL '2 days', '13:00', 4, 0),
(CURRENT_DATE + INTERVAL '2 days', '15:00', 4, 0),
(CURRENT_DATE + INTERVAL '3 days', '09:00', 4, 0),
(CURRENT_DATE + INTERVAL '3 days', '11:00', 4, 0),
(CURRENT_DATE + INTERVAL '3 days', '13:00', 4, 0),
(CURRENT_DATE + INTERVAL '3 days', '15:00', 4, 0);