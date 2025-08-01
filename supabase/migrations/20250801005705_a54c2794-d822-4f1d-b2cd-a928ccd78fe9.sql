-- Add payment receipt URL field to bookings table
ALTER TABLE public.bookings 
ADD COLUMN payment_receipt_url TEXT;