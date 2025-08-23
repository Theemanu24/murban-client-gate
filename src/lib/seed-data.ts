import { createClient } from './clients';
import { signUp } from './auth';

// Generate secure random passwords
const generatePassword = (length: number = 16): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Client passwords (generated securely)
export const CLIENT_PASSWORDS = {
  'swahili-tank': 'Sw7#mB9$kL2@nX4!',
  'tank-genesis': 'Tg8%pF6#rQ3$mN9@',
  'totaluganda': 'Tu9@xD4#vC7$wB2!',
  'rubis-zambia': 'Rz5#nH8@qL6$pM3!'
};

// Admin password
export const ADMIN_PASSWORD = 'Admin2025#Secure$Portal!';

export const seedClients = async () => {
  const clients = [
    {
      name: 'Swahili Beach Tank Calculator',
      slug: 'swahili-tank',
      description: 'Advanced tank volume calculations for marine applications',
      app_url: 'https://swahili-beach-tank-calculator.vercel.app',
      password_hash: CLIENT_PASSWORDS['swahili-tank'],
      active: true
    },
    {
      name: 'Tank Volume Genesis',
      slug: 'tank-genesis',
      description: 'Professional tank volume calculation system',
      app_url: 'https://tank-volume-genesis.vercel.app',
      password_hash: CLIENT_PASSWORDS['tank-genesis'],
      active: true
    },
    {
      name: 'TotalUganda',
      slug: 'totaluganda',
      description: 'Comprehensive energy solutions platform',
      app_url: 'https://totaluganda.vercel.app',
      password_hash: CLIENT_PASSWORDS['totaluganda'],
      active: true
    },
    {
      name: 'Rubis Zambia',
      slug: 'rubis-zambia',
      description: 'Tank calculation system for Rubis operations',
      app_url: 'https://rubis-tank-calc.vercel.app',
      password_hash: CLIENT_PASSWORDS['rubis-zambia'],
      active: true
    }
  ];

  console.log('Seeding clients...');
  
  for (const client of clients) {
    try {
      const clientId = await createClient(client);
      if (clientId) {
        console.log(`✅ Created client: ${client.name} (${client.slug})`);
      } else {
        console.log(`❌ Failed to create client: ${client.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating client ${client.name}:`, error);
    }
  }
};

export const seedAdmin = async () => {
  try {
    const result = await signUp(
      'admin@murban-portal.com',
      ADMIN_PASSWORD,
      {
        first_name: 'Portal',
        last_name: 'Administrator',
        role: 'admin'
      }
    );
    
    if (result.user) {
      console.log('✅ Admin user created successfully');
    } else {
      console.log('❌ Failed to create admin:', result.error);
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
};

// Run seeding (call this function manually from browser console)
export const runSeeding = async () => {
  console.log('🚀 Starting data seeding...');
  await seedClients();
  await seedAdmin();
  console.log('✅ Data seeding completed!');
};