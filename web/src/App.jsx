// @file    App.jsx
// @folder  web/src/
// @about   Main Facebook desktop web application connecting to Harbor Firestore and Firebase Auth.

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { Feed } from './components/Feed';
import { LoginPage } from './components/auth/LoginPage';
import { CreatePostModal } from './components/modals/CreatePostModal';
import { CreateStoryModal } from './components/modals/CreateStoryModal';
import { StoryViewerModal } from './components/modals/StoryViewerModal';
import { AIChatModal } from './components/modals/AIChatModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfilePage } from './components/ProfilePage';
import {
  subscribeToAuthChanges,
  signOutUser,
} from './services/authService';
import {
  subscribeToPosts,
  subscribeToStories,
  createPost,
  createStory,
  deletePost,
} from './services/firestoreService';
import { generateFeedBriefing } from './services/aiService';

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('fb_theme') === 'dark';
  });

  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNavTab, setActiveNavTab] = useState('feed');

  // AI Briefing State
  const [briefing, setBriefing] = useState('Loading daily AI briefing...');
  const [briefingLoading, setBriefingLoading] = useState(false);

  // Modals State
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Secret Developer Trigger: Ctrl + Shift + A or #admin URL hash
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Shift + A or Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        setIsAdminOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkHash);
    checkHash();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('fb_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Auth Listener
  useEffect(() => {
    const unsub = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  // Real-time Firestore Listeners (Connected to Harbor database)
  useEffect(() => {
    if (!user) return;

    const unsubPosts = subscribeToPosts(
      (newPosts) => {
        setPosts(newPosts);
      },
      (err) => console.warn('Posts listener error:', err)
    );

    const unsubStories = subscribeToStories(
      (newStories) => {
        setStories(newStories);
      },
      (err) => console.warn('Stories listener error:', err)
    );

    return () => {
      unsubPosts();
      unsubStories();
    };
  }, [user]);

  // Generate AI Briefing when posts are loaded
  useEffect(() => {
    if (posts.length > 0) {
      loadBriefing();
    }
  }, [posts.length]);

  const loadBriefing = async () => {
    setBriefingLoading(true);
    try {
      const summary = await generateFeedBriefing(posts);
      setBriefing(summary);
    } catch (err) {
      setBriefing('Welcome to your Facebook community feed! Create your first post or ask Meta AI for a personalized update.');
    } finally {
      setBriefingLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    if (!user) return;
    try {
      await createPost(postData, user);
    } catch (err) {
      alert('Error publishing post: ' + err.message);
    }
  };

  const handleCreateStory = async (storyData) => {
    if (!user) return;
    try {
      await createStory(storyData, user);
    } catch (err) {
      alert('Error creating story: ' + err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!user) return;
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId, user.uid);
      } catch (err) {
        alert('Could not delete post: ' + err.message);
      }
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
  };

  const handleNavigateProfile = () => {
    setActiveNavTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!authChecked) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--fb-blue)',
          fontFamily: 'Segoe UI, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'var(--fb-blue)',
              color: '#ffffff',
              fontSize: '36px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            f
          </div>
          <div style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Loading Facebook...</div>
        </div>
      </div>
    );
  }

  // If not authenticated, show Desktop Facebook Login Screen
  if (!user) {
    return <LoginPage onLoginSuccess={setUser} />;
  }

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onLogout={handleLogout}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onOpenProfile={handleNavigateProfile}
        onOpenEditProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeTab={activeNavTab}
        onTabChange={setActiveNavTab}
      />

      {/* Main Content: Profile Page or Home Feed Layout */}
      {activeNavTab === 'profile' ? (
        <div style={{ marginTop: 'var(--nav-height)' }}>
          <ProfilePage
            user={user}
            posts={posts}
            onOpenEditProfile={() => setIsProfileOpen(true)}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onOpenCreateStory={() => setIsCreateStoryOpen(true)}
            onOpenAIChat={() => setIsAIChatOpen(true)}
            onDeletePost={handleDeletePost}
            onUpdateUser={setUser}
          />
        </div>
      ) : (
        <div className="main-layout">
          {/* Left Sidebar */}
          <LeftSidebar
            user={user}
            onOpenProfile={handleNavigateProfile}
            onOpenAIChat={() => setIsAIChatOpen(true)}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Center Feed */}
          <Feed
            user={user}
            posts={posts}
            stories={stories}
            briefing={briefing}
            briefingLoading={briefingLoading}
            onRefreshBriefing={loadBriefing}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onOpenCreateStory={() => setIsCreateStoryOpen(true)}
            onOpenAIChat={() => setIsAIChatOpen(true)}
            onSelectStory={setSelectedStory}
            onDeletePost={handleDeletePost}
            onNavigateProfile={handleNavigateProfile}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
          />

          {/* Right Sidebar */}
          <RightSidebar onOpenAIChat={() => setIsAIChatOpen(true)} />
        </div>
      )}

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmit={handleCreatePost}
        user={user}
      />

      <CreateStoryModal
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
        onSubmit={handleCreateStory}
        user={user}
      />

      <StoryViewerModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />

      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        posts={posts}
      />

      <EditProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUserUpdated={setUser}
      />

      {/* Secret Developer Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefreshData={loadBriefing}
      />
    </div>
  );
}
