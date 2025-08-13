-- Create clients table for secure client authentication
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  app_url TEXT NOT NULL,
  logo_url TEXT,
  password_hash TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
CREATE POLICY "Everyone can view active clients" 
ON public.clients 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage clients" 
ON public.clients 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create function to verify client passwords
CREATE OR REPLACE FUNCTION public.verify_client_password(client_slug TEXT, password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT password_hash INTO stored_hash 
  FROM public.clients 
  WHERE slug = client_slug AND active = true;
  
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Use crypt function to verify password
  RETURN crypt(password, stored_hash) = stored_hash;
END;
$$;

-- Create function to hash passwords
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Generate salt and hash password using blowfish algorithm
  RETURN crypt(password, gen_salt('bf', 12));
END;
$$;

-- Insert the two clients with strong passwords
INSERT INTO public.clients (name, slug, description, app_url, password_hash) VALUES
('Swahili Beach', 'swahili-beach', 'Tank Mass Calculator for Swahili Beach (LPG storage)', 'https://swahili-beach-tank-calculator.vercel.app/', public.hash_password('SwB#9mK$7nP2!xR8')),
('Genesis', 'genesis', 'Tank Volume Calculator for Genesis', 'https://tank-volume-genesis.vercel.app/', public.hash_password('Gen$4vQ!8zL6@wE3'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();