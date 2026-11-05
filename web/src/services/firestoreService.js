// @file    firestoreService.js
// @folder  web/src/services/
// @about   Firestore database service for Facebook Web, reading and writing to the exact same collections as mobile.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

const cleanAvatar = (url) => {
  if (!url || typeof url !== 'string') return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
  const trimmed = url.trim();
  if (trimmed.startsWith('file://') || trimmed.startsWith('/data/user/') || trimmed.startsWith('content://')) {
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
  }
  return trimmed;
};

// ─── USER PROFILE ───────────────────────────────────────────

export const saveUserProfile = async (uid, userData) => {
  if (!uid) throw new Error('User ID is required.');
  const userRef = doc(db, 'users', uid);
  const existing = await getDoc(userRef);

  if (existing.exists()) {
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(userRef, {
      uid,
      email: userData.email || '',
      name: userData.name || '',
      avatar: userData.avatar || '',
      bio: userData.bio || '',
      coverPhoto: userData.coverPhoto || '',
      details: userData.details || {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
};

export const getUserProfile = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;
  return { uid: snapshot.id, ...snapshot.data() };
};

// ─── POSTS ──────────────────────────────────────────────────

export const createPost = async (postData, user) => {
  if (!user?.uid) throw new Error('User must be signed in to create a post.');

  const postsRef = collection(db, 'posts');
  const newPost = {
    authorId: user.uid,
    authorName: user.name || user.email?.split('@')[0] || 'Unknown',
    authorAvatar: user.avatar || '',
    content: postData.content || '',
    media: postData.media || null,
    mediaType: postData.mediaType || 'image',
    category: postData.category || 'Work',
    completed: false,
    reactions: { like: 0, love: 0, laugh: 0, wow: 0, sad: 0, angry: 0 },
    shares: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(postsRef, newPost);
  return { id: docRef.id, ...newPost, time: 'Just now' };
};

export const subscribeToPosts = (onUpdate, onError) => {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    async (snapshot) => {
      const posts = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        posts.push({
          id: docSnap.id,
          ...data,
          authorAvatar: cleanAvatar(data.authorAvatar),
          time: formatTimestamp(data.createdAt),
          comments: [],
        });
      }
      onUpdate(posts);
    },
    (err) => {
      console.warn('Error listening to posts:', err);
      if (onError) onError(err);
    }
  );
};

export const deletePost = async (postId, userId) => {
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) throw new Error('Post not found.');
  const postData = postSnap.data();
  if (postData.authorId !== userId) {
    throw new Error('You can only delete your own posts.');
  }

  await deleteDoc(postRef);
};

export const togglePostComplete = async (postId) => {
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) return;

  const current = postSnap.data().completed || false;
  await updateDoc(postRef, { completed: !current, updatedAt: serverTimestamp() });
};

// ─── COMMENTS ───────────────────────────────────────────────

export const addComment = async (postId, commentText, user) => {
  if (!user?.uid) throw new Error('Must be signed in to comment.');

  const commentsRef = collection(db, 'posts', postId, 'comments');
  const newComment = {
    authorId: user.uid,
    authorName: user.name || 'Unknown',
    authorAvatar: user.avatar || '',
    text: commentText,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(commentsRef, newComment);
  return { id: docRef.id, ...newComment, time: 'Just now' };
};

export const subscribeToComments = (postId, onUpdate) => {
  const commentsRef = collection(db, 'posts', postId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      time: formatTimestamp(d.data().createdAt),
    }));
    onUpdate(comments);
  });
};

// ─── REACTIONS ──────────────────────────────────────────────

export const reactToPost = async (postId, reactionType, userId) => {
  const reactionRef = doc(db, 'posts', postId, 'userReactions', userId);
  const postRef = doc(db, 'posts', postId);

  const existingSnap = await getDoc(reactionRef);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) return;

  const postData = postSnap.data();
  const reactions = { ...postData.reactions };
  const oldReaction = existingSnap.exists() ? existingSnap.data().reactionType : null;

  if (oldReaction && reactions[oldReaction] !== undefined) {
    reactions[oldReaction] = Math.max(0, reactions[oldReaction] - 1);
  }

  const isSame = oldReaction === reactionType;
  const newReaction = isSame ? null : reactionType;

  if (newReaction) {
    reactions[newReaction] = (reactions[newReaction] || 0) + 1;
  }

  const batch = writeBatch(db);
  if (newReaction) {
    batch.set(reactionRef, { reactionType: newReaction });
  } else if (existingSnap.exists()) {
    batch.delete(reactionRef);
  }

  batch.update(postRef, { reactions });
  await batch.commit();

  return { newReaction, reactions };
};

export const getUserReaction = async (postId, userId) => {
  if (!userId) return null;
  const reactionRef = doc(db, 'posts', postId, 'userReactions', userId);
  const snap = await getDoc(reactionRef);
  return snap.exists() ? snap.data().reactionType : null;
};

// ─── SHARES ─────────────────────────────────────────────────

export const sharePost = async (postId) => {
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) return;

  const currentShares = postSnap.data().shares || 0;
  await updateDoc(postRef, { shares: currentShares + 1 });
};

// ─── STORIES ────────────────────────────────────────────────

export const createStory = async (storyData, user) => {
  if (!user?.uid) throw new Error('User must be signed in to create a story.');

  const storiesRef = collection(db, 'stories');
  const newStory = {
    authorId: user.uid,
    name: user.name || user.email?.split('@')[0] || 'Unknown',
    avatar: user.avatar || '',
    image: storyData.image || '',
    caption: storyData.caption || '',
    bgColor: storyData.bgColor || '#1877F2',
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(storiesRef, newStory);
  return { id: docRef.id, ...newStory, time: 'Just now' };
};

export const subscribeToStories = (onUpdate, onError) => {
  const storiesRef = collection(db, 'stories');
  const q = query(storiesRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const stories = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          avatar: cleanAvatar(data.avatar),
          time: formatTimestamp(data.createdAt),
        };
      });
      onUpdate(stories);
    },
    (err) => {
      console.warn('Error listening to stories:', err);
      if (onError) onError(err);
    }
  );
};

// ─── BATCH: Update author info across all their posts and stories ───────

export const updateAuthorOnPosts = async (userId, newName, newAvatar) => {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, where('authorId', '==', userId));
  const snapshot = await getDocs(q);

  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnap) => {
    batch.update(docSnap.ref, {
      authorName: newName,
      authorAvatar: newAvatar,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
};

export const updateAuthorOnStories = async (userId, newName, newAvatar) => {
  const storiesRef = collection(db, 'stories');
  const q = query(storiesRef, where('authorId', '==', userId));
  const snapshot = await getDocs(q);

  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnap) => {
    batch.update(docSnap.ref, {
      name: newName,
      avatar: newAvatar,
    });
  });

  await batch.commit();
};

// ─── HELPERS ────────────────────────────────────────────────

export const formatTimestamp = (timestamp) => {
  if (!timestamp?.toDate) return 'Just now';
  const now = new Date();
  const date = timestamp.toDate();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};
