-- Update client passwords to uppercase 4-digit codes
-- Swahili Beach: S001
UPDATE public.clients 
SET password_hash = public.hash_password('S001')
WHERE slug = 'swahili-tank';

-- Tank Volume Genesis: T002
UPDATE public.clients 
SET password_hash = public.hash_password('T002')
WHERE slug = 'tank-genesis';

-- Rubis Zambia: R003
UPDATE public.clients 
SET password_hash = public.hash_password('R003')
WHERE slug = 'rubis-zambia';

-- TotalUganda: T004
UPDATE public.clients 
SET password_hash = public.hash_password('T004')
WHERE slug = 'totaluganda';