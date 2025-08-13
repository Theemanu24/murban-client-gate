-- Fix function search_path security issues by adding SET search_path = ''
CREATE OR REPLACE FUNCTION public.verify_client_password(client_slug TEXT, password TEXT)
RETURNS BOOLEAN
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
  
  -- Use crypt function to verify password
  RETURN crypt(password, stored_hash) = stored_hash;
END;
$$;

-- Fix function search_path security issues by adding SET search_path = ''
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Generate salt and hash password using blowfish algorithm
  RETURN crypt(password, gen_salt('bf', 12));
END;
$$;

-- Fix function search_path security issues for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'cashier'),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  RETURN new;
END;
$$;