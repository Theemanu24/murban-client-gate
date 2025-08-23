// Database Setup Utility
// Run this in the browser console to populate your Firebase database

import { runSeeding } from '@/lib/seed-data';

// Make the seeding function available globally
(window as any).setupDatabase = runSeeding;

console.log(`
🚀 Database Setup Instructions:

1. Open your browser console
2. Run: setupDatabase()
3. This will create all clients and admin user

Client Access URLs:
- Swahili Tank: /c/swahili-tank
- Tank Genesis: /c/tank-genesis  
- TotalUganda: /c/totaluganda
- Rubis Zambia: /c/rubis-zambia

Admin Access: /admin
`);