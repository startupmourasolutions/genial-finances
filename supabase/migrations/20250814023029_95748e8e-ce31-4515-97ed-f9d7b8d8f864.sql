-- Create storage policies for profile uploads
-- First, ensure the profiles bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create policies for profile image uploads
CREATE POLICY "Users can upload their own profile images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view profile images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profiles');

CREATE POLICY "Users can update their own profile images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);