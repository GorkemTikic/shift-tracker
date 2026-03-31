import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZSXwbwh8r5IYRqworgZ3i9WFtn97RLUA",
  authDomain: "t-shift-tracker.firebaseapp.com",
  projectId: "t-shift-tracker",
  storageBucket: "t-shift-tracker.firebasestorage.app",
  messagingSenderId: "710830164132",
  appId: "1:710830164132:web:229b2cfa88a950fe41be31"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
