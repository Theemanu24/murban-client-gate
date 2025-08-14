import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { Client } from '@/types/firebase';
import bcrypt from 'bcryptjs';

const COLLECTION_NAME = 'clients';

export const getClients = async (): Promise<Client[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('active', '==', true),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate(),
      updated_at: doc.data().updated_at?.toDate()
    })) as Client[];
  } catch (error) {
    console.error('Error getting clients:', error);
    return [];
  }
};

export const getClientBySlug = async (slug: string): Promise<Client | null> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('slug', '==', slug),
      where('active', '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate(),
      updated_at: doc.data().updated_at?.toDate()
    } as Client;
  } catch (error) {
    console.error('Error getting client by slug:', error);
    return null;
  }
};

export const verifyClientPassword = async (slug: string, password: string): Promise<boolean> => {
  try {
    const client = await getClientBySlug(slug);
    if (!client) {
      return false;
    }
    
    return await bcrypt.compare(password, client.password_hash);
  } catch (error) {
    console.error('Error verifying client password:', error);
    return false;
  }
};

export const createClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
  try {
    const hashedPassword = await bcrypt.hash(clientData.password_hash, 12);
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...clientData,
      password_hash: hashedPassword,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating client:', error);
    return null;
  }
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating client:', error);
    return false;
  }
};

export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting client:', error);
    return false;
  }
};