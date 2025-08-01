-- Create reviews table for customer feedback
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  event_type TEXT,
  location TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Anyone can submit reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view approved reviews" 
ON public.reviews 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Allow admin access to all reviews" 
ON public.reviews 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();