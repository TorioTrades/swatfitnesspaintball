-- Allow public read access to bookings for calendar availability
CREATE POLICY "Allow public read access to bookings for calendar" 
ON public.bookings 
FOR SELECT 
USING (true);

-- Update the bookings table to enable realtime
ALTER TABLE public.bookings REPLICA IDENTITY FULL;

-- Add bookings table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;