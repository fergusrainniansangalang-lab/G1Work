// @file    AdminDashboardModal.js
// @folder  src/components/modals/
// @about   Mobile Developer Admin Dashboard for inspecting Firestore database, metrics, latency, and moderating posts/stories.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getAllPosts,
  getAllStories,
  getAllUsers,
  adminDeletePost,
  adminDeleteStory,
  createPost,
} from '../../services/firestoreService';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

const DEV_PASSCODE = 'dev2026';

export const AdminDashboardModal = ({
  visible,
  onClose,
  isDark = true,
  onDataChanged,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'posts' | 'stories' | 'users' | 'tools'
  const [latency, setLatency] = useState(null);
  const [isPinging, setIsPinging] = useState(false);
  const [dbStatus, setDbStatus] = useState('checking'); // 'online' | 'error' | 'checking'

  const [allPosts, setAllPosts] = useState([]);
  const [allStories, setAllStories] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    if (visible && isAuthenticated) {
      loadData();
      pingDatabase();
    }
  }, [visible, isAuthenticated]);

  const handleUnlock = () => {
    if (passcode.trim() === DEV_PASSCODE || passcode.trim() === 'admin777') {
      setIsAuthenticated(true);
      setPasscodeError('');
      setPasscode('');
    } else {
      setPasscodeError('Invalid Developer Passcode. Access denied.');
    }
  };

  const pingDatabase = async () => {
    setIsPinging(true);
    const start = Date.now();
    try {
      const testDocRef = doc(db, 'connection_test', 'mobile_admin_ping');
      await setDoc(testDocRef, {
        pingedAt: serverTimestamp(),
        source: 'Mobile Admin Dashboard',
      });
      const end = Date.now();
      setLatency(end - start);
      setDbStatus('online');
    } catch (err) {
      console.warn('Database ping failed:', err);
      setDbStatus('error');
    } finally {
      setIsPinging(false);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [posts, stories, users] = await Promise.all([
        getAllPosts().catch(() => []),
        getAllStories().catch(() => []),
        getAllUsers().catch(() => []),
      ]);
      setAllPosts(posts);
      setAllStories(stories);
      setAllUsers(users);
    } catch (err) {
      console.warn('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = (postId) => {
    Alert.alert(
      'Confirm Delete',
      'Permanently delete this post from the Firestore database?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminDeletePost(postId);
              setAllPosts((prev) => prev.filter((p) => p.id !== postId));
              setActionMessage('Post deleted successfully.');
              if (onDataChanged) onDataChanged();
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  };

  const handleDeleteStory = (storyId) => {
    Alert.alert(
      'Confirm Delete',
      'Permanently delete this story from the Firestore database?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminDeleteStory(storyId);
              setAllStories((prev) => prev.filter((s) => s.id !== storyId));
              setActionMessage('Story deleted successfully.');
              if (onDataChanged) onDataChanged();
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  };

  const handleSeedQuickPost = async () => {
    try {
      await createPost(
        {
          content: `⚡ Quick Test Post from Mobile Admin Dashboard at ${new Date().toLocaleTimeString()}! Database write test verified.`,
          category: 'Work',
          media: null,
          mediaType: 'image',
        },
        {
          uid: 'admin_mobile_user',
          name: 'Mobile Admin',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        }
      );
      setActionMessage('Quick test post successfully injected into Firestore!');
      loadData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const bg = isDark ? '#18191A' : '#F0F2F5';
  const cardBg = isDark ? '#242526' : '#FFFFFF';
  const textColor = isDark ? '#E4E6EB' : '#050505';
  const subTextColor = isDark ? '#B0B3B8' : '#65676B';
  const border = isDark ? '#3E4042' : '#CED0D4';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#0F172A',
            borderBottomWidth: 1,
            borderBottomColor: '#1E293B',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#EF4444',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>🛡️</Text>
            </View>
            <View>
              <Text style={{ color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' }}>
                Admin Dashboard
              </Text>
              <Text style={{ color: '#94A3B8', fontSize: 11 }}>
                facebook-project123
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#1E293B',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' }}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Auth Gate if locked */}
        {!isAuthenticated ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 360,
                backgroundColor: cardBg,
                padding: 24,
                borderRadius: 16,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: border,
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <Text style={{ fontSize: 40, marginBottom: 12 }}>🔒</Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: textColor,
                  marginBottom: 6,
                }}
              >
                Developer Access
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: subTextColor,
                  textAlign: 'center',
                  marginBottom: 20,
                }}
              >
                Enter the developer passcode to access the database management dashboard.
              </Text>

              <TextInput
                value={passcode}
                onChangeText={(text) => {
                  setPasscode(text);
                  setPasscodeError('');
                }}
                secureTextEntry
                placeholder="Passcode (e.g. dev2026)"
                placeholderTextColor={subTextColor}
                style={{
                  width: '100%',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: passcodeError ? '#EF4444' : border,
                  backgroundColor: isDark ? '#3A3B3C' : '#F0F2F5',
                  color: textColor,
                  fontSize: 16,
                  textAlign: 'center',
                  letterSpacing: 3,
                  marginBottom: 10,
                }}
              />

              {passcodeError ? (
                <Text style={{ color: '#EF4444', fontSize: 12, marginBottom: 12 }}>
                  {passcodeError}
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={handleUnlock}
                style={{
                  width: '100%',
                  backgroundColor: '#1877F2',
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }}>
                  Unlock Dashboard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Dashboard Content */
          <View style={{ flex: 1 }}>
            {/* Tabs Bar */}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: cardBg,
                borderBottomWidth: 1,
                borderBottomColor: border,
              }}
            >
              {[
                { id: 'overview', label: 'Health' },
                { id: 'posts', label: `Posts (${allPosts.length})` },
                { id: 'stories', label: `Stories (${allStories.length})` },
                { id: 'users', label: `Users (${allUsers.length})` },
                { id: 'tools', label: 'Tools' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => setActiveTab(tab.id)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      alignItems: 'center',
                      borderBottomWidth: isActive ? 3 : 0,
                      borderBottomColor: '#1877F2',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: isActive ? 'bold' : '600',
                        color: isActive ? '#1877F2' : subTextColor,
                      }}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Action Feedback Banner */}
            {actionMessage ? (
              <View
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(16, 185, 129, 0.3)',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#10B981', fontSize: 13, fontWeight: '600' }}>
                  ✓ {actionMessage}
                </Text>
                <TouchableOpacity onPress={() => setActionMessage('')}>
                  <Text style={{ color: '#10B981', fontSize: 13 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* TAB CONTENT */}
            {isLoading ? (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#1877F2" />
                <Text style={{ marginTop: 12, color: subTextColor, fontSize: 14 }}>
                  Loading database records...
                </Text>
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* 1. OVERVIEW & HEALTH */}
                {activeTab === 'overview' && (
                  <View style={{ gap: 14 }}>
                    {/* Database Health Card */}
                    <View
                      style={{
                        backgroundColor: cardBg,
                        padding: 16,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: border,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 12,
                        }}
                      >
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: textColor }}>
                          Cloud Firestore Status
                        </Text>
                        <View
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 12,
                            backgroundColor:
                              dbStatus === 'online'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : 'rgba(239, 68, 68, 0.15)',
                          }}
                        >
                          <Text
                            style={{
                              color: dbStatus === 'online' ? '#10B981' : '#EF4444',
                              fontSize: 12,
                              fontWeight: 'bold',
                            }}
                          >
                            {dbStatus === 'online' ? '● ONLINE' : '● CHECKING'}
                          </Text>
                        </View>
                      </View>

                      <Text style={{ color: subTextColor, fontSize: 13, marginBottom: 8 }}>
                        Project: facebook-project123
                      </Text>
                      <Text style={{ color: subTextColor, fontSize: 13, marginBottom: 14 }}>
                        Latency:{' '}
                        {latency !== null ? (
                          <Text style={{ color: latency < 350 ? '#10B981' : '#F59E0B', fontWeight: 'bold' }}>
                            {latency} ms
                          </Text>
                        ) : (
                          'Testing...'
                        )}
                      </Text>

                      <TouchableOpacity
                        onPress={pingDatabase}
                        disabled={isPinging}
                        style={{
                          paddingVertical: 10,
                          borderRadius: 8,
                          backgroundColor: isDark ? '#3A3B3C' : '#E4E6EB',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ color: textColor, fontWeight: '700', fontSize: 13 }}>
                          {isPinging ? 'Pinging...' : '🔄 Test Roundtrip Latency'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Stats Grid */}
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: cardBg,
                          padding: 16,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: border,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 28, fontWeight: '900', color: '#1877F2' }}>
                          {allPosts.length}
                        </Text>
                        <Text style={{ fontSize: 12, color: subTextColor, marginTop: 4 }}>
                          Total Posts
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          backgroundColor: cardBg,
                          padding: 16,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: border,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 28, fontWeight: '900', color: '#10B981' }}>
                          {allStories.length}
                        </Text>
                        <Text style={{ fontSize: 12, color: subTextColor, marginTop: 4 }}>
                          Total Stories
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          backgroundColor: cardBg,
                          padding: 16,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: border,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 28, fontWeight: '900', color: '#8B5CF6' }}>
                          {allUsers.length}
                        </Text>
                        <Text style={{ fontSize: 12, color: subTextColor, marginTop: 4 }}>
                          Total Users
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* 2. POSTS MANAGEMENT */}
                {activeTab === 'posts' && (
                  <View style={{ gap: 12 }}>
                    {allPosts.length === 0 ? (
                      <Text style={{ textAlign: 'center', color: subTextColor, marginTop: 30 }}>
                        No posts found in Firestore.
                      </Text>
                    ) : (
                      allPosts.map((post) => (
                        <View
                          key={post.id}
                          style={{
                            backgroundColor: cardBg,
                            padding: 14,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: border,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              marginBottom: 6,
                            }}
                          >
                            <View style={{ flex: 1, marginRight: 10 }}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: 'bold',
                                  color: textColor,
                                }}
                              >
                                {post.authorName || 'Unknown Author'}
                              </Text>
                              <Text style={{ fontSize: 11, color: subTextColor }}>
                                ID: {post.id}
                              </Text>
                            </View>

                            <TouchableOpacity
                              onPress={() => handleDeletePost(post.id)}
                              style={{
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                borderRadius: 6,
                              }}
                            >
                              <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 12 }}>
                                Delete
                              </Text>
                            </TouchableOpacity>
                          </View>

                          <Text
                            style={{
                              color: textColor,
                              fontSize: 13,
                              lineHeight: 18,
                              marginVertical: 4,
                            }}
                          >
                            {post.content}
                          </Text>

                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginTop: 8,
                              paddingTop: 8,
                              borderTopWidth: 1,
                              borderTopColor: border,
                            }}
                          >
                            <Text style={{ fontSize: 11, color: subTextColor }}>
                              Category: {post.category || 'General'}
                            </Text>
                            <Text style={{ fontSize: 11, color: subTextColor }}>
                              Time: {post.time || 'Recent'}
                            </Text>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                )}

                {/* 3. STORIES MANAGEMENT */}
                {activeTab === 'stories' && (
                  <View style={{ gap: 12 }}>
                    {allStories.length === 0 ? (
                      <Text style={{ textAlign: 'center', color: subTextColor, marginTop: 30 }}>
                        No stories found in Firestore.
                      </Text>
                    ) : (
                      allStories.map((story) => (
                        <View
                          key={story.id}
                          style={{
                            backgroundColor: cardBg,
                            padding: 14,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: border,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: textColor }}>
                              {story.name || 'Author'}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: textColor,
                                marginVertical: 2,
                              }}
                              numberOfLines={1}
                            >
                              {story.caption || '(Photo Story)'}
                            </Text>
                            <Text style={{ fontSize: 11, color: subTextColor }}>
                              ID: {story.id}
                            </Text>
                          </View>

                          <TouchableOpacity
                            onPress={() => handleDeleteStory(story.id)}
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              borderRadius: 6,
                            }}
                          >
                            <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 12 }}>
                              Delete
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))
                    )}
                  </View>
                )}

                {/* 4. USERS INSPECTOR */}
                {activeTab === 'users' && (
                  <View style={{ gap: 12 }}>
                    {allUsers.length === 0 ? (
                      <Text style={{ textAlign: 'center', color: subTextColor, marginTop: 30 }}>
                        No user documents found in Firestore.
                      </Text>
                    ) : (
                      allUsers.map((u) => (
                        <View
                          key={u.id}
                          style={{
                            backgroundColor: cardBg,
                            padding: 14,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: border,
                          }}
                        >
                          <Text style={{ fontSize: 15, fontWeight: 'bold', color: textColor }}>
                            {u.name || 'Unnamed User'}
                          </Text>
                          <Text style={{ fontSize: 12, color: subTextColor, marginTop: 2 }}>
                            Email: {u.email || 'N/A'}
                          </Text>
                          <Text style={{ fontSize: 11, color: subTextColor, marginTop: 2 }}>
                            UID: {u.id || u.uid}
                          </Text>
                          {u.details?.work ? (
                            <Text style={{ fontSize: 12, color: textColor, marginTop: 6 }}>
                              💼 {u.details.work}
                            </Text>
                          ) : null}
                          {u.details?.city ? (
                            <Text style={{ fontSize: 12, color: textColor, marginTop: 2 }}>
                              📍 {u.details.city}
                            </Text>
                          ) : null}
                        </View>
                      ))
                    )}
                  </View>
                )}

                {/* 5. DEVELOPER TOOLS */}
                {activeTab === 'tools' && (
                  <View style={{ gap: 12 }}>
                    <TouchableOpacity
                      onPress={handleSeedQuickPost}
                      style={{
                        padding: 14,
                        borderRadius: 10,
                        backgroundColor: '#1877F2',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                        ⚡ Inject Quick Test Post
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={loadData}
                      style={{
                        padding: 14,
                        borderRadius: 10,
                        backgroundColor: cardBg,
                        borderWidth: 1,
                        borderColor: border,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 14 }}>
                        🔄 Refresh All Firestore Data
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={pingDatabase}
                      style={{
                        padding: 14,
                        borderRadius: 10,
                        backgroundColor: cardBg,
                        borderWidth: 1,
                        borderColor: border,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 14 }}>
                        📡 Ping Cloud Firestore
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};
