// @file    authService.js
// @folder  web/src/services/
// @about   Firebase Authentication service for Facebook Web with domain validation.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './firebase';
import { saveUserProfile, getUserProfile } from './firestoreService';

const ALLOWED_DOMAINS = ['@gmail.com', '@letran.edu.ph'];

const sanitizeAvatar = (uri) => {
  if (!uri || typeof uri !== 'string') return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
  const trimmed = uri.trim();
  if (
    trimmed.startsWith('file://') ||
    trimmed.startsWith('/data/user/') ||
    trimmed.startsWith('content://')
  ) {
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
  }
  return trimmed;
};

const sanitizeCover = (uri) => {
  if (!uri || typeof uri !== 'string') return 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200';
  const trimmed = uri.trim();
  if (
    trimmed.startsWith('file://') ||
    trimmed.startsWith('/data/user/') ||
    trimmed.startsWith('content://')
  ) {
    return 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200';
  }
  return trimmed;
};

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email address is required.' };
  }
  const trimmed = email.trim().toLowerCase();
  const hasAllowedDomain = ALLOWED_DOMAINS.some((domain) => trimmed.endsWith(domain));
  if (!hasAllowedDomain) {
    return {
      valid: false,
      message: 'Only @gmail.com and @letran.edu.ph email addresses are allowed.',
    };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, message: 'Please enter a valid email format.' };
  }
  return { valid: true, message: '' };
};

export const signUpUser = async (email, password, name, avatar = '') => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    throw new Error(emailValidation.message);
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = credential.user;

  const defaultAvatar = avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
  await updateProfile(user, {
    displayName: name.trim(),
    photoURL: defaultAvatar,
  });

  const profileData = {
    uid: user.uid,
    email: user.email,
    name: name.trim(),
    avatar: defaultAvatar,
    bio: 'Software Developer & Task Master 💻 | Turning ideas into code ✨',
    coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200',
    details: {
      work: 'Works at Meta / TaskFlow Systems',
      education: 'Studied Computer Science at Stanford University',
      city: 'Lives in San Francisco, California',
      hometown: 'From Seattle, Washington',
      relationship: 'Single',
      joined: 'Joined November 2026',
      followers: 'Followed by 1,280 people',
    },
  };

  await saveUserProfile(user.uid, profileData);

  return {
    uid: user.uid,
    email: user.email,
    name: name.trim(),
    avatar: defaultAvatar,
    ...profileData,
  };
};

export const signInUser = async (email, password) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    throw new Error(emailValidation.message);
  }

  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const user = credential.user;

  let firestoreProfile = null;
  try {
    firestoreProfile = await getUserProfile(user.uid);
  } catch (err) {
    console.warn('Could not fetch Firestore profile:', err);
  }

  return {
    uid: user.uid,
    email: user.email,
    name: firestoreProfile?.name || user.displayName || user.email.split('@')[0],
    avatar: sanitizeAvatar(firestoreProfile?.avatar || user.photoURL),
    bio: firestoreProfile?.bio || '',
    coverPhoto: sanitizeCover(firestoreProfile?.coverPhoto),
    details: firestoreProfile?.details || {},
  };
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      let profile = null;
      try {
        profile = await getUserProfile(firebaseUser.uid);
      } catch (e) {
        console.warn('Error loading user profile on auth change:', e);
      }
      callback({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: profile?.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
        avatar: sanitizeAvatar(profile?.avatar || firebaseUser.photoURL),
        bio: profile?.bio || '',
        coverPhoto: sanitizeCover(profile?.coverPhoto),
        details: profile?.details || {},
      });
    } else {
      callback(null);
    }
  });
};

export const resetPassword = async (email) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    throw new Error(emailValidation.message);
  }
  await sendPasswordResetEmail(auth, email.trim());
};
