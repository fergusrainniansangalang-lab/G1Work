// @file    firebase.js
// @folder  web/src/services/
// @about   Firebase app and database initialization for Facebook Web, connected to the same database as mobile.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Matches the exact same database configuration as mobile (facebook-project123)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAfNs9hEID6Tcaz8mzovhPfpPrAKialIkY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "facebook-project123.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "facebook-project123",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "facebook-project123.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "84270013086",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:84270013086:web:27b57a42d24e0366e7f98f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZJKMH63CCH"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
