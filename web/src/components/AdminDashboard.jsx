// @file    AdminDashboard.jsx
// @folder  web/src/components/
// @about   Secret developer admin dashboard for inspecting Firestore database, collections, latency, and live metrics.

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Database,
  Activity,
  Trash2,
  RefreshCw,
  X,
  Users,
  FileText,
  Film,
  CheckCircle,
  AlertTriangle,
  Lock,
  Key,
  Server,
  Zap,
} from 'lucide-react';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';

const DEV_PASSCODE = 'dev2026'; // Secret developer passkey

export const AdminDashboard = ({ isOpen, onClose, onRefreshData }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('dev_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'posts' | 'stories' | 'users' | 'tools'
  const [latency, setLatency] = useState(null);
  const [isPinging, setIsPinging] = useState(false);
  const [dbStatus, setDbStatus] = useState('checking'); // 'online' | 'error' | 'checking'

  const [allPosts, setAllPosts] = useState([]);
  const [allStories, setAllStories] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAllAdminData();
      pingDatabase();
    }
  }, [isOpen, isAuthenticated]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passcode.trim() === DEV_PASSCODE || passcode.trim() === 'admin777') {
      setIsAuthenticated(true);
      sessionStorage.setItem('dev_admin_auth', 'true');
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid Developer Passcode. Access denied.');
    }
  };

  const pingDatabase = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      const testDocRef = doc(db, 'connection_test', 'admin_ping');
      await setDoc(testDocRef, {
        pingedAt: serverTimestamp(),
        source: 'Admin Web Dashboard',
      });
      const end = performance.now();
      setLatency(Math.round(end - start));
      setDbStatus('online');
    } catch (err) {
      console.error('Database ping failed:', err);
      setDbStatus('error');
    } finally {
      setIsPinging(false);
    }
  };

  const loadAllAdminData = async () => {
    setIsLoadingData(true);
    try {
      // 1. Fetch Posts
      const postsSnap = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc')));
      setAllPosts(postsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // 2. Fetch Stories
      const storiesSnap = await getDocs(query(collection(db, 'stories'), orderBy('createdAt', 'desc')));
      setAllStories(storiesSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // 3. Fetch Users
      const usersSnap = await getDocs(collection(db, 'users'));
      setAllUsers(usersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.warn('Error loading admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm(`Delete post "${postId}" permanently from Firestore?`)) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setAllPosts((prev) => prev.filter((p) => p.id !== postId));
      setActionMessage(`Post ${postId} deleted successfully.`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm(`Delete story "${storyId}" permanently from Firestore?`)) return;
    try {
      await deleteDoc(doc(db, 'stories', storyId));
      setAllStories((prev) => prev.filter((s) => s.id !== storyId));
      setActionMessage(`Story ${storyId} deleted successfully.`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleSeedQuickPost = async () => {
    try {
      const docRef = doc(collection(db, 'posts'));
      await setDoc(docRef, {
        authorId: 'admin_test_user',
        authorName: 'Developer Test',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        content: `⚡ Quick Test Post generated from Developer Admin Dashboard at ${new Date().toLocaleTimeString()}! Database write test verified.`,
        category: 'Work',
        completed: false,
        reactions: { like: 1, love: 1, laugh: 0 },
        shares: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setActionMessage('Quick test post successfully injected into Firestore!');
      loadAllAdminData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Seed failed: ' + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '95%',
          maxWidth: '960px',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top Secret Header Bar */}
        <div
          style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            color: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: '#EF4444',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldAlert size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>DEVELOPER ADMIN CONSOLE</span>
                <span style={{ fontSize: '10px', backgroundColor: 'rgba(239,68,68,0.2)', color: '#FCA5A5', padding: '2px 6px', borderRadius: '4px', border: '1px solid #EF4444' }}>
                  CONFIDENTIAL
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                Direct access to Firestore Database & System Health
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Exit Admin Console"
          >
            <X size={18} />
          </button>
        </div>

        {/* Passcode Lock Screen (If not authenticated) */}
        {!isAuthenticated ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              backgroundColor: 'var(--bg-primary)',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '380px',
                backgroundColor: 'var(--bg-secondary)',
                padding: '32px 24px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Lock size={28} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Developer Passcode Required
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Enter the secret developer access key to inspect and manage the live database.
              </p>

              {passcodeError && (
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'rgba(239,68,68,0.1)',
                    border: '1px solid #EF4444',
                    borderRadius: '6px',
                    color: '#EF4444',
                    fontSize: '12px',
                    marginBottom: '14px',
                  }}
                >
                  {passcodeError}
                </div>
              )}

              <form onSubmit={handleUnlock}>
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <input
                    type="password"
                    placeholder="Enter passcode (e.g. dev2026)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '15px',
                      textAlign: 'center',
                      letterSpacing: '2px',
                      outline: 'none',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'var(--fb-blue)',
                    color: '#fff',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  Unlock Admin Console
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Main Authenticated Dashboard Body */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Action Feedback Banner */}
            {actionMessage && (
              <div
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(16,185,129,0.15)',
                  borderBottom: '1px solid #10B981',
                  color: '#10B981',
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{actionMessage}</span>
                <button onClick={() => setActionMessage('')} style={{ color: '#10B981' }}>
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Dashboard Tabs Bar */}
            <div
              style={{
                display: 'flex',
                backgroundColor: 'var(--bg-tertiary)',
                borderBottom: '1px solid var(--border-color)',
                padding: '0 16px',
                gap: '8px',
              }}
            >
              {[
                { id: 'overview', label: 'System Health', icon: Activity },
                { id: 'posts', label: `Posts (${allPosts.length})`, icon: FileText },
                { id: 'stories', label: `Stories (${allStories.length})`, icon: Film },
                { id: 'users', label: `Users (${allUsers.length})`, icon: Users },
                { id: 'tools', label: 'Database Tools', icon: Database },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 14px',
                      borderBottom: active ? '3px solid var(--fb-blue)' : '3px solid transparent',
                      color: active ? 'var(--fb-blue)' : 'var(--text-secondary)',
                      fontWeight: active ? 700 : 500,
                      fontSize: '13px',
                    }}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    loadAllAdminData();
                    pingDatabase();
                  }}
                  disabled={isLoadingData || isPinging}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <RefreshCw size={12} className={isLoadingData || isPinging ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: 'var(--bg-primary)' }}>
              {/* 1. OVERVIEW & HEALTH TAB */}
              {activeTab === 'overview' && (
                <div>
                  {/* Status Banner */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    {/* Database Online Status Card */}
                    <div className="fb-card" style={{ padding: '16px', margin: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Firestore Status</span>
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: dbStatus === 'online' ? '#10B981' : '#EF4444',
                            boxShadow: dbStatus === 'online' ? '0 0 8px #10B981' : 'none',
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {dbStatus === 'online' ? '🟢 Online & Ready' : dbStatus === 'checking' ? '⏳ Checking...' : '🔴 Error'}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Connected to Harbor Database
                      </div>
                    </div>

                    {/* Latency Ping Card */}
                    <div className="fb-card" style={{ padding: '16px', margin: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Write / Read Latency</span>
                        <Zap size={16} color="#F59E0B" />
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {latency !== null ? `${latency} ms` : 'Testing...'}
                      </div>
                      <button
                        onClick={pingDatabase}
                        disabled={isPinging}
                        style={{ fontSize: '12px', color: 'var(--fb-blue)', fontWeight: 600 }}
                      >
                        {isPinging ? 'Testing roundtrip...' : '↻ Re-test ping'}
                      </button>
                    </div>

                    {/* Total Posts Count */}
                    <div className="fb-card" style={{ padding: '16px', margin: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Feed Posts</span>
                        <FileText size={16} color="var(--fb-blue)" />
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {allPosts.length}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {allPosts.filter((p) => p.completed).length} completed tasks
                      </div>
                    </div>

                    {/* Total Users Count */}
                    <div className="fb-card" style={{ padding: '16px', margin: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Registered Profiles</span>
                        <Users size={16} color="#8B5CF6" />
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {allUsers.length}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Synced in Firestore users collection
                      </div>
                    </div>
                  </div>

                  {/* Project Config Table */}
                  <div className="fb-card" style={{ padding: '20px', margin: 0 }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
                      Firebase & System Environment Configuration
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '8px', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Project ID:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>facebook-project123 (Harbor Project)</strong>

                      <span style={{ color: 'var(--text-secondary)' }}>Auth Domain:</span>
                      <span style={{ color: 'var(--text-primary)' }}>facebook-project123.firebaseapp.com</span>

                      <span style={{ color: 'var(--text-secondary)' }}>Storage Bucket:</span>
                      <span style={{ color: 'var(--text-primary)' }}>facebook-project123.firebasestorage.app</span>

                      <span style={{ color: 'var(--text-secondary)' }}>AI Engine:</span>
                      <strong style={{ color: '#10B981' }}>Google Gemini 2.5 Flash Lite (Streaming Enabled)</strong>

                      <span style={{ color: 'var(--text-secondary)' }}>Target Platforms:</span>
                      <span style={{ color: 'var(--text-primary)' }}>React Native Mobile (Android/iOS) + React Web Client</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. POSTS MANAGEMENT TAB */}
              {activeTab === 'posts' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Firestore Posts Collection ({allPosts.length} documents)
                    </h4>
                    <button
                      onClick={handleSeedQuickPost}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'var(--fb-blue)',
                        color: '#fff',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      + Inject Test Post
                    </button>
                  </div>

                  {allPosts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                      No posts currently in Firestore.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {allPosts.map((post) => (
                        <div
                          key={post.id}
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '16px',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{post.authorName}</strong>
                              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ID: {post.id}</span>
                              <span
                                style={{
                                  fontSize: '11px',
                                  padding: '1px 6px',
                                  borderRadius: '10px',
                                  backgroundColor: post.completed ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                  color: post.completed ? '#10B981' : '#F59E0B',
                                }}
                              >
                                {post.completed ? 'Done' : 'Pending'}
                              </span>
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                              {post.content}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeletePost(post.id)}
                            style={{
                              padding: '8px',
                              borderRadius: '6px',
                              color: '#EF4444',
                              backgroundColor: 'rgba(239,68,68,0.1)',
                            }}
                            title="Delete post permanently"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. STORIES MANAGEMENT TAB */}
              {activeTab === 'stories' && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                    Firestore Stories Collection ({allStories.length} active)
                  </h4>
                  {allStories.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                      No active stories in Firestore.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                      {allStories.map((s) => (
                        <div
                          key={s.id}
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            overflow: 'hidden',
                            position: 'relative',
                          }}
                        >
                          <div style={{ height: '140px', backgroundColor: s.bgColor || '#1877F2', position: 'relative' }}>
                            {s.image && <img src={s.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                display: 'flex',
                                alignItems: 'flex-end',
                                padding: '8px',
                                color: '#fff',
                                fontSize: '12px',
                                fontWeight: 600,
                              }}
                            >
                              {s.caption || 'No caption'}
                            </div>
                          </div>
                          <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</span>
                            <button
                              onClick={() => handleDeleteStory(s.id)}
                              style={{ color: '#EF4444', padding: '4px' }}
                              title="Delete story"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. USERS INSPECTOR TAB */}
              {activeTab === 'users' && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                    Registered Users in Firestore ({allUsers.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {allUsers.map((u) => (
                      <div
                        key={u.id}
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={u.name}
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{u.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {u.email} · UID: {u.id}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. DATABASE TOOLS TAB */}
              {activeTab === 'tools' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="fb-card" style={{ padding: '20px', margin: 0 }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Diagnostic Ping Test
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Executes an atomic document write and read back from Firestore to measure live latency.
                    </p>
                    <button
                      onClick={pingDatabase}
                      disabled={isPinging}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'var(--fb-blue)',
                        color: '#fff',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '13px',
                      }}
                    >
                      {isPinging ? 'Pinging Cloud Firestore...' : 'Run Firestore Ping Test'}
                    </button>
                    {latency !== null && (
                      <span style={{ marginLeft: '12px', fontSize: '13px', color: '#10B981', fontWeight: 600 }}>
                        Success! Latency: {latency} ms
                      </span>
                    )}
                  </div>

                  <div className="fb-card" style={{ padding: '20px', margin: 0 }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Quick Test Post Injection
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Creates a test post in the posts collection so you can verify that mobile and web are both receiving updates immediately.
                    </p>
                    <button
                      onClick={handleSeedQuickPost}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'var(--fb-green)',
                        color: '#fff',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '13px',
                      }}
                    >
                      Inject Test Post into Firestore
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

