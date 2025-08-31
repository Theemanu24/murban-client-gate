-- Fix the verify_client_password function to work with existing bcrypt hashes
CREATE OR REPLACE FUNCTION public.verify_client_password(client_slug text, password text)
RETURNS boolean 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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
  
  -- Use crypt function to verify password against bcrypt hash
  RETURN crypt(password, stored_hash) = stored_hash;
END;
$$;

-- Update client passwords to match the required format: client name + @2025
-- First, let's hash the new passwords
UPDATE public.clients SET password_hash = crypt('Swahili@2025', gen_salt('bf', 12)) WHERE slug = 'swahili-beach';
UPDATE public.clients SET password_hash = crypt('Tank@2025', gen_salt('bf', 12)) WHERE slug = 'tank-genesis';  
UPDATE public.clients SET password_hash = crypt('Totaluganda@2025', gen_salt('bf', 12)) WHERE slug = 'totaluganda';
UPDATE public.clients SET password_hash = crypt('Rubis@2025', gen_salt('bf', 12)) WHERE slug = 'rubis-zambia';