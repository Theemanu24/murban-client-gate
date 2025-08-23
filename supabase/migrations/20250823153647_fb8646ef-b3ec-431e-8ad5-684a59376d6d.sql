-- Fix the hash_password function to use the correct schema reference
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN extensions.crypt(password, extensions.gen_salt('bf', 12));
END;
$$;