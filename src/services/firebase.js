// @file    firebase.js
// @folder  src/services/
// @about   Firebase app initialization for the Facebook project.
//
// What this file does:
// - Initializes the Firebase app with project credentials.
// - Exports the Auth instance for Firebase Authentication operations.
// - Exports the Firestore instance (db) for all database read/write operations.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration — values come from .env (via process.env) with solid fallbacks
const firebaseConfig = {
  apiKey:
    (typeof process !== 'undefined' && (process.env?.FIREBASE_API_KEY || process.env?.EXPO_PUBLIC_FIREBASE_API_KEY)) ||
    'AIzaSyAfNs9hEID6Tcaz8mzovhPfpPrAKialIkY',
  authDomain:
    (typeof process !== 'undefined' && (process.env?.FIREBASE_AUTH_DOMAIN || process.env?.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN)) ||
    'facebook-project123.firebaseapp.com',
  projectId:
    (typeof process !== 'undefined' && (process.env?.FIREBASE_PROJECT_ID || process.env?.EXPO_PUBLIC_FIREBASE_PROJECT_ID)) ||
    'facebook-project123',
  storageBucket:
    (typeof process !== 'undefined' && (process.env?.FIREBASE_STORAGE_BUCKET || process.env?.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET)) ||
    'facebook-project123.firebasestorage.app',
  messagingSenderId:
    (typeof process !== 'undefined' && (process.env?.FIREBASE_MESSAGING_SENDER_ID || process.env?.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)) ||
    '84270013086',
  appId:
    (typeof process !== 'undefined' && (process.env?.FIREBASE_APP_ID || process.env?.EXPO_PUBLIC_FIREBASE_APP_ID)) ||
    '1:84270013086:web:27b57a42d24e0366e7f98f',
  measurementId:
    (typeof process !== 'undefined' && (process.env?.FIREBASE_MEASUREMENT_ID || process.env?.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID)) ||
    'G-ZJKMH63CCH',
};

// Initialize Firebase safely preventing duplicate app errors on Fast Refresh
const app = typeof getApps === 'function' && getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

export default app;