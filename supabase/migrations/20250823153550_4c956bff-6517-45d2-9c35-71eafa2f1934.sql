-- Create a simpler password verification function using pgcrypto correctly
CREATE OR REPLACE FUNCTION public.verify_client_password(client_slug text, password text)
RETURNS boolean 
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
  
  -- Use the pgcrypto extension crypt function properly
  RETURN public.crypt(password, stored_hash) = stored_hash;
END;
$$;