-- Update client passwords to simple 4-digit codes with correct slugs
-- Swahili Beach: s001
UPDATE public.clients 
SET password_hash = public.hash_password('s001')
WHERE slug = 'swahili-tank';

-- Tank Volume Genesis: t002
UPDATE public.clients 
SET password_hash = public.hash_password('t002')
WHERE slug = 'tank-genesis';

-- Rubis Zambia: r003
UPDATE public.clients 
SET password_hash = public.hash_password('r003')
WHERE slug = 'rubis-zambia';

-- TotalUganda: t004
UPDATE public.clients 
SET password_hash = public.hash_password('t004')
WHERE slug = 'totaluganda';