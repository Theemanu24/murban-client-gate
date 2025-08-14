// Firebase Admin functions for data migration and management
import { 
  collection, 
  addDoc, 
  writeBatch,
  doc
} from 'firebase/firestore';
import { db } from './firebase';
import { Client, Category, Product } from '@/types/firebase';
import bcrypt from 'bcryptjs';

// Seed initial data
export const seedFirebaseData = async () => {
  const batch = writeBatch(db);

  // Create initial clients
  const clientsData: Omit<Client, 'id'>[] = [
    {
      name: "Swahili Beach",
      slug: "swahili-beach",
      description: "Tank volume calculator for Swahili Beach operations",
      app_url: "https://swahili-beach-tank-calculator.vercel.app",
      logo_url: null,
      active: true,
      password_hash: await bcrypt.hash("SwahiliSecure2024!", 12),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: "Genesis Tank Calculator",
      slug: "genesis",
      description: "Advanced tank volume calculations for Genesis operations",
      app_url: "https://tank-volume-genesis.vercel.app",
      logo_url: null,
      active: true,
      password_hash: await bcrypt.hash("GenesisSecure2024!", 12),
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  // Add clients
  for (const client of clientsData) {
    const docRef = doc(collection(db, 'clients'));
    batch.set(docRef, client);
  }

  // Create sample categories
  const categoriesData = [
    { name: "Beverages", created_at: new Date() },
    { name: "Food", created_at: new Date() },
    { name: "Desserts", created_at: new Date() }
  ];

  for (const category of categoriesData) {
    const docRef = doc(collection(db, 'categories'));
    batch.set(docRef, category);
  }

  try {
    await batch.commit();
    console.log('Firebase data seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding Firebase data:', error);
    return { success: false, error };
  }
};

// Create an admin user profile
export const createAdminProfile = async (userId: string, email: string) => {
  try {
    await addDoc(collection(db, 'profiles'), {
      user_id: userId,
      email,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('Admin profile created successfully!');
  } catch (error) {
    console.error('Error creating admin profile:', error);
  }
};