export type Client = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  app_url: string;
  logo_url?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
};

// Note: Client data is now stored securely in Firebase database
// This file is kept for type definitions and backward compatibility
// To seed the database, run: import { runSeeding } from '@/lib/seed-data'; runSeeding();
