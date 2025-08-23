-- Fix the password verification function with correct schema reference
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
  
  -- Use the crypt function from the extensions schema
  RETURN extensions.crypt(password, stored_hash) = stored_hash;
END;
$$;