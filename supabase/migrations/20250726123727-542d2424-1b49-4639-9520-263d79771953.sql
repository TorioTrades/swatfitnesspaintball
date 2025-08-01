-- Remove event_type and location columns from reviews table
ALTER TABLE public.reviews DROP COLUMN IF EXISTS event_type;
ALTER TABLE public.reviews DROP COLUMN IF EXISTS location;