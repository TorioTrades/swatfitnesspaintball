-- Insert sample paintball bookings for testing
INSERT INTO public.paintball_bookings (
  customer_name, 
  email, 
  phone, 
  service_type, 
  booking_date, 
  booking_time, 
  group_size, 
  duration_hours, 
  equipment_rental, 
  special_requests, 
  emergency_contact, 
  experience_level, 
  total_amount, 
  paid_amount, 
  payment_method, 
  payment_status, 
  booking_status
) VALUES
('John Smith', 'john@example.com', '+1234567890', 'regular_rates', '2025-07-30', '10:00 AM', 2, 2.0, true, 'First time playing', '+1234567891', 'beginner', 50.00, 15.00, 'GCash', 'partial', 'confirmed'),
('Sarah Johnson', 'sarah@example.com', '+1234567892', 'group_booking', '2025-07-31', '2:00 PM', 8, 2.5, true, 'Birthday party for my son', '+1234567893', 'intermediate', 200.00, 60.00, 'GCash', 'partial', 'pending'),
('Mike Wilson', 'mike@example.com', '+1234567894', 'target_range', '2025-08-01', '9:00 AM', 1, 1.0, true, 'Want to practice shooting accuracy', '+1234567895', 'advanced', 20.00, 20.00, 'Cash', 'paid', 'confirmed'),
('Team Alpha Corp', 'team@alpha.com', '+1234567896', 'group_booking', '2025-08-02', '11:00 AM', 15, 3.0, true, 'Corporate team building event', '+1234567897', 'beginner', 400.00, 120.00, 'Bank Transfer', 'partial', 'confirmed');