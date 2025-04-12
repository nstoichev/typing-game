import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5pACNpHuYp57d8gkp3d9LnhlBaDpeM-Y",
  authDomain: "qwerty-master-f83f1.firebaseapp.com",
  projectId: "qwerty-master-f83f1",
  storageBucket: "qwerty-master-f83f1.firebasestorage.app",
  messagingSenderId: "338251363785",
  appId: "1:338251363785:web:2f3b3131e293ed84792418",
  measurementId: "G-GJVSEYM4TF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app); 