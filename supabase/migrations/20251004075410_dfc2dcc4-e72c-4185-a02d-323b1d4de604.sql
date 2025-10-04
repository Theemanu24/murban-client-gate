-- Add username column to clients table
ALTER TABLE public.clients 
ADD COLUMN username text UNIQUE;

-- Create index for faster lookups
CREATE INDEX idx_clients_username ON public.clients(username);

-- Create function to verify username and password
CREATE OR REPLACE FUNCTION public.verify_client_username_password(client_username text, password text)
RETURNS TABLE(slug text, name text, app_url text) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  stored_hash TEXT;
  client_record RECORD;
BEGIN
  SELECT c.password_hash, c.slug, c.name, c.app_url INTO client_record
  FROM public.clients c
  WHERE c.username = client_username AND c.active = true;
  
  IF client_record.password_hash IS NULL THEN
    RETURN;
  END IF;
  
  -- Use the crypt function from the extensions schema
  IF extensions.crypt(password, client_record.password_hash) = client_record.password_hash THEN
    RETURN QUERY SELECT client_record.slug, client_record.name, client_record.app_url;
  END IF;
END;
$function$;

-- Update client records with new usernames and hashed passwords
UPDATE public.clients 
SET username = 'swahili',
    password_hash = extensions.crypt('swb2025', extensions.gen_salt('bf', 12))
WHERE slug = 'swahili-beach';

UPDATE public.clients 
SET username = 'tankgen',
    password_hash = extensions.crypt('tv2025', extensions.gen_salt('bf', 12))
WHERE slug = 'tank-volume-genesis';

UPDATE public.clients 
SET username = 'totalug',
    password_hash = extensions.crypt('tu2025', extensions.gen_salt('bf', 12))
WHERE slug = 'totaluganda';

UPDATE public.clients 
SET username = 'rubisz',
    password_hash = extensions.crypt('rz2025', extensions.gen_salt('bf', 12))
WHERE slug = 'rubis-zambia';