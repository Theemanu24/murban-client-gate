-- Update all client passwords to lowercase versions for ease of use
UPDATE public.clients SET password_hash = extensions.crypt('swahili@2025', extensions.gen_salt('bf', 12)) WHERE slug = 'swahili-tank';
UPDATE public.clients SET password_hash = extensions.crypt('tank@2025', extensions.gen_salt('bf', 12)) WHERE slug = 'tank-genesis';  
UPDATE public.clients SET password_hash = extensions.crypt('totaluganda@2025', extensions.gen_salt('bf', 12)) WHERE slug = 'totaluganda';
UPDATE public.clients SET password_hash = extensions.crypt('rubis@2025', extensions.gen_salt('bf', 12)) WHERE slug = 'rubis-zambia';