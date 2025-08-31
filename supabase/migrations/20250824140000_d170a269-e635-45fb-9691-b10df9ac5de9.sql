-- Rename Swahili Beach client
UPDATE public.clients
SET name = 'Swahili Beach',
    slug = 'swahili-beach',
    app_url = 'https://swahili-beach.vercel.app'
WHERE slug = 'swahili-tank';
