-- Migration: 2026-01-10 - Update Rubis Zambia app_url to the new link
BEGIN;

-- Update Rubis Zambia app_url
UPDATE public.clients
SET app_url = 'https://happy-ruby-tank.vercel.app'
WHERE slug = 'rubis-zambia';

COMMIT;
