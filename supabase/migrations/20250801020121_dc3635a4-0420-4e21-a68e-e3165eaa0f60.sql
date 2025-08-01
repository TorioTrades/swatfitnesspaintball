-- Create storage policies for payment receipts bucket
CREATE POLICY "Allow anyone to upload payment receipts" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'payment-receipts');

CREATE POLICY "Allow anyone to view payment receipts" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-receipts');

CREATE POLICY "Allow anyone to update payment receipts" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'payment-receipts');