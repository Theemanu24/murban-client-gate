-- Migration: add Mabati Rolling Mills client
-- Adds a new client record for Mabati Rolling Mills with username and hashed password

INSERT INTO public.clients (name, slug, description, app_url, username, password_hash, terminal, active, created_at, updated_at)
VALUES (
  'Mabati Rolling Mills',
  'mabati-rolling-mills',
  'Client entry for Mabati Rolling Mills',
  'https://mabatirollingmills-eight.vercel.app',
  'mabati',
  public.hash_password('M005'),
  'Mariakani',
  true,
  now(),
  now()
);
