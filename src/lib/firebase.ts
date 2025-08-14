import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxngWfgGybaUhlSQlBzmFAtBN5w1U_AWc",
  authDomain: "murban-cp.firebaseapp.com",
  projectId: "murban-cp",
  storageBucket: "murban-cp.firebasestorage.app",
  messagingSenderId: "1048480758638",
  appId: "1:1048480758638:web:1cbc4a0baf62df6b29df7f",
  measurementId: "G-PGYRFJ1175"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
