import { 
  collection, 
  getDocs, 
  addDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { Order } from '@/types/firebase';

const COLLECTION_NAME = 'orders';

export const getOrders = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate()
    })) as Order[];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'created_at'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...orderData,
      created_at: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};