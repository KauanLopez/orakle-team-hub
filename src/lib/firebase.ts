
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZrYrGNz523sJJDTJ62szumsB4B97yMVI",
  authDomain: "orakle-15938.firebaseapp.com",
  projectId: "orakle-15938",
  storageBucket: "orakle-15938.firebasestorage.app",
  messagingSenderId: "805224722977",
  appId: "1:805224722977:web:b886f4c8b1d27378ce2960",
  measurementId: "G-BXW00H7Z55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
