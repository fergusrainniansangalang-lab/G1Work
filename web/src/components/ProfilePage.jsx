// @file    ProfilePage.jsx
// @folder  web/src/components/
// @about   Authentic Facebook desktop Profile page with cover photo, avatar, bio, intro card, photos preview, and personal post timeline.

import React, { useState, useEffect } from 'react';
import {
  Camera,
  Plus,
  Edit2,
  Briefcase,
  GraduationCap,
  Home,
  MapPin,
  Heart,
  Clock,
  Rss,
  MoreHorizontal,
  MessageCircle,
  Image,
  Users,
  Search,
  SlidersHorizontal,
  Globe,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Check,
  UserCheck,
} from 'lucide-react';
import { CreatePostBox } from './CreatePostBox';
import { PostCard } from './PostCard';
import { saveUserProfile } from '../services/firestoreService';
import { getSafeImageUrl, handleImageError, DEFAULT_AVATAR, DEFAULT_COVER } from '../utils/imageUtils';

const PREVIEW_PHOTOS = [
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
];

const MOCK_FRIENDS = [
  { id: '1', name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', mutual: 14 },
  { id: '2', name: 'David Miller', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', mutual: 28 },
  { id: '3', name: 'Maya Lin', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200', mutual: 9 },
  { id: '4', name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', mutual: 42 },
  { id: '5', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', mutual: 19 },
  { id: '6', name: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200', mutual: 31 },
];

export const ProfilePage = ({
  user,
  posts = [],
  onOpenEditProfile,
  onOpenCreatePost,
  onOpenCreateStory,
  onOpenAIChat,
  onDeletePost,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(
    user?.bio || 'Software Developer & Task Master 💻 | Turning ideas into code ✨'
  );
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [friendsSearch, setFriendsSearch] = useState('');
  const [aboutSubTab, setAboutSubTab] = useState('overview');

  useEffect(() => {
    if (user?.bio !== undefined) {
      setBioInput(user.bio);
    }
  }, [user?.bio]);

  const defaultCover = 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200';
  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';

  const userPosts = posts.filter(
    (p) =>
      p.authorId === user?.uid ||
      p.authorName === user?.name ||
      p.author === user?.name ||
      p.author === 'You'
  );

  const handleSaveBio = async () => {
    if (!user?.uid || isSavingBio) return;
    setIsSavingBio(true);
    try {
      await saveUserProfile(user.uid, { bio: bioInput.trim() });
      if (onUpdateUser) {
        onUpdateUser({ ...user, bio: bioInput.trim() });
      }
      setIsEditingBio(false);
    } catch (err) {
      console.warn('Error saving bio:', err);
    } finally {
      setIsSavingBio(false);
    }
  };

  const details = {
    work: user?.details?.work || 'Works at Meta / TaskFlow Systems',
    education: user?.details?.education || 'Studied Computer Science at Stanford University',
    city: user?.details?.city || 'Lives in San Francisco, California',
    hometown: user?.details?.hometown || 'From Seattle, Washington',
    relationship: user?.details?.relationship || 'Single',
    joined: user?.details?.joined || 'Joined November 2026',
    followers: user?.details?.followers || 'Followed by 1,280 people',
  };

  const filteredFriends = MOCK_FRIENDS.filter((f) =>
    f.name.toLowerCase().includes(friendsSearch.toLowerCase())
  );

  return (
    <div
      style={{
        width: '100%',
        minHeight: 'calc(100vh - var(--nav-height))',
        backgroundColor: 'var(--bg-primary)',
        paddingBottom: '40px',
      }}
    >
      {/* ─── COVER & HEADER CONTAINER ─── */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ maxWidth: '1095px', margin: '0 auto', position: 'relative' }}>
          {/* Cover Photo */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '350px',
              backgroundColor: 'var(--bg-tertiary)',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <img
              src={getSafeImageUrl(user?.coverPhoto, DEFAULT_COVER)}
              alt="Cover"
              onError={(e) => handleImageError(e, DEFAULT_COVER)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Subtle Gradient Shade at bottom */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)',
              }}
            />

            {/* Edit Cover Photo Pill */}
            <button
              onClick={onOpenEditProfile}
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#050505',
                padding: '8px 14px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                backdropFilter: 'blur(4px)',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)')}
            >
              <Camera size={18} />
              <span>Edit cover photo</span>
            </button>
          </div>

          {/* Profile Identity Row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: '0 32px 16px',
              position: 'relative',
            }}
          >
            {/* Left: Avatar & User Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              {/* Overlapping Avatar */}
              <div
                style={{
                  position: 'relative',
                  marginTop: '-36px',
                  width: '168px',
                  height: '168px',
                  borderRadius: '50%',
                  border: '4px solid var(--bg-secondary)',
                  backgroundColor: 'var(--bg-secondary)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  flexShrink: 0,
                }}
              >
                <img
                  src={getSafeImageUrl(user?.avatar, DEFAULT_AVATAR)}
                  alt={user?.name || 'User'}
                  onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <button
                  onClick={onOpenEditProfile}
                  title="Update profile picture"
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Camera size={20} />
                </button>
              </div>

              {/* Name, friends count, and facepile */}
              <div style={{ marginBottom: '10px' }}>
                <h1
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {user?.name || 'Your Profile'}
                </h1>
                <div
                  style={{
                    fontSize: '15px',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>1.2K friends</span>
                  <span>•</span>
                  <span>{details.followers}</span>
                </div>

                {/* Overlapping Friend Faces */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                  {MOCK_FRIENDS.slice(0, 5).map((friend, idx) => (
                    <img
                      key={friend.id}
                      src={friend.avatar}
                      alt={friend.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '2px solid var(--bg-secondary)',
                        marginLeft: idx === 0 ? 0 : '-8px',
                        objectFit: 'cover',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                flexWrap: 'wrap',
              }}
            >
              {/* Add to Story Button */}
              <button
                onClick={onOpenCreateStory}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--fb-blue)',
                  color: '#ffffff',
                  padding: '9px 16px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '15px',
                  boxShadow: '0 1px 2px rgba(24,119,242,0.3)',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--fb-blue-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--fb-blue)')}
              >
                <Plus size={18} strokeWidth={2.5} />
                <span>Add to story</span>
              </button>

              {/* Edit Profile Button */}
              <button
                onClick={onOpenEditProfile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  padding: '9px 16px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '15px',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
              >
                <Edit2 size={16} />
                <span>Edit profile</span>
              </button>

              {/* Meta AI profile insights */}
              <button
                onClick={onOpenAIChat}
                title="Ask Meta AI about your activity"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--fb-blue)',
                }}
              >
                <Sparkles size={18} />
              </button>
            </div>
          </div>

          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border-color)',
              margin: '0 32px',
            }}
          />

          {/* Profile Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {[
                { id: 'posts', label: 'Posts' },
                { id: 'about', label: 'About' },
                { id: 'friends', label: 'Friends' },
                { id: 'photos', label: 'Photos' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '16px 16px',
                      fontSize: '15px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--fb-blue)' : 'var(--text-secondary)',
                      borderBottom: isActive ? '3px solid var(--fb-blue)' : '3px solid transparent',
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={onOpenEditProfile}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              <SlidersHorizontal size={14} />
              <span>Manage Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── PROFILE BODY CONTENT ─── */}
      <div style={{ maxWidth: '1095px', margin: '20px auto 0', padding: '0 16px' }}>
        {/* TAB 1: POSTS & TIMELINE */}
        {activeTab === 'posts' && (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            {/* Left Column: Intro, Photos, Friends */}
            <div
              style={{
                width: '380px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Intro Card */}
              <div className="fb-card" style={{ padding: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Intro</h2>

                {/* Bio text & edit */}
                <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                  {isEditingBio ? (
                    <div>
                      <textarea
                        rows={3}
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        placeholder="Describe who you are..."
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          textAlign: 'center',
                          resize: 'none',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setBioInput(user?.bio || '');
                            setIsEditingBio(false);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                            fontWeight: 600,
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isSavingBio}
                          onClick={handleSaveBio}
                          style={{
                            padding: '6px 16px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--fb-blue)',
                            color: '#ffffff',
                            fontSize: '13px',
                            fontWeight: 600,
                          }}
                        >
                          {isSavingBio ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-primary)',
                          marginBottom: '10px',
                          lineHeight: 1.4,
                        }}
                      >
                        {user?.bio || 'Add a short bio to tell people more about yourself.'}
                      </p>
                      <button
                        onClick={() => setIsEditingBio(true)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          fontWeight: 600,
                          transition: 'background-color 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                      >
                        Edit bio
                      </button>
                    </div>
                  )}
                </div>

                {/* Details List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                    <Briefcase size={20} color="var(--text-secondary)" />
                    <span>{details.work}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                    <GraduationCap size={20} color="var(--text-secondary)" />
                    <span>{details.education}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                    <Home size={20} color="var(--text-secondary)" />
                    <span>{details.city}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                    <MapPin size={20} color="var(--text-secondary)" />
                    <span>{details.hometown}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                    <Heart size={20} color="var(--text-secondary)" />
                    <span>{details.relationship}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                    <Clock size={20} color="var(--text-secondary)" />
                    <span>{details.joined}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                    <Rss size={20} color="var(--text-secondary)" />
                    <span>{details.followers}</span>
                  </div>
                </div>

                {/* Edit Details Button */}
                <button
                  onClick={onOpenEditProfile}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                >
                  Edit details
                </button>
              </div>

              {/* Photos Preview Card */}
              <div className="fb-card" style={{ padding: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Photos</h2>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {PREVIEW_PHOTOS.length} featured photos
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('photos')}
                    style={{
                      color: 'var(--fb-blue)',
                      fontSize: '14px',
                      fontWeight: 500,
                      padding: '4px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    See all photos
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '4px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  {PREVIEW_PHOTOS.map((src, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'relative',
                        paddingTop: '100%',
                        overflow: 'hidden',
                        cursor: 'pointer',
                      }}
                      onClick={() => setActiveTab('photos')}
                    >
                      <img
                        src={src}
                        alt={`Photo ${i + 1}`}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Friends Preview Card */}
              <div className="fb-card" style={{ padding: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Friends</h2>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>1,280 friends</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('friends')}
                    style={{
                      color: 'var(--fb-blue)',
                      fontSize: '14px',
                      fontWeight: 500,
                      padding: '4px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    See all friends
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                  }}
                >
                  {MOCK_FRIENDS.map((f) => (
                    <div
                      key={f.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setActiveTab('friends')}
                    >
                      <img
                        src={f.avatar}
                        alt={f.name}
                        style={{
                          width: '100%',
                          height: '96px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          marginBottom: '4px',
                        }}
                      />
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {f.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Create Post & Timeline */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* What's on your mind? composer box */}
              <CreatePostBox
                user={user}
                onOpenCreatePost={onOpenCreatePost}
                onOpenAIChat={onOpenAIChat}
              />

              {/* Posts header / filter bar */}
              <div
                className="fb-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Posts
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={onOpenCreatePost}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    <SlidersHorizontal size={14} />
                    <span>Manage posts</span>
                  </button>
                </div>
              </div>

              {/* Filtered User Posts Stream */}
              {userPosts.length === 0 ? (
                <div
                  className="fb-card"
                  style={{
                    padding: '48px 20px',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      color: 'var(--fb-blue)',
                    }}
                  >
                    <Image size={32} />
                  </div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '6px',
                    }}
                  >
                    No posts yet
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      maxWidth: '380px',
                      margin: '0 auto 20px',
                      lineHeight: 1.4,
                    }}
                  >
                    Share your work updates, photos, ideas, or questions with friends.
                  </p>
                  <button
                    onClick={onOpenCreatePost}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--fb-blue)',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '14px',
                    }}
                  >
                    Create Post
                  </button>
                </div>
              ) : (
                userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    user={user}
                    onDeletePost={onDeletePost}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT */}
        {activeTab === 'about' && (
          <div className="fb-card" style={{ display: 'flex', minHeight: '480px' }}>
            {/* About Navigation Left */}
            <div
              style={{
                width: '260px',
                borderRight: '1px solid var(--border-color)',
                padding: '12px 8px',
                flexShrink: 0,
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: 700, padding: '8px 12px 12px' }}>About</h2>
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'work', label: 'Work and education' },
                { id: 'places', label: 'Places lived' },
                { id: 'contact', label: 'Contact and basic info' },
                { id: 'family', label: 'Family and relationships' },
              ].map((sub) => {
                const isSelected = aboutSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setAboutSubTab(sub.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: isSelected ? 600 : 500,
                      backgroundColor: isSelected ? 'rgba(24, 119, 242, 0.1)' : 'transparent',
                      color: isSelected ? 'var(--fb-blue)' : 'var(--text-primary)',
                      marginBottom: '2px',
                    }}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>

            {/* About Details Right */}
            <div style={{ flex: 1, padding: '24px 32px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {aboutSubTab === 'overview' && 'Overview'}
                  {aboutSubTab === 'work' && 'Work and Education'}
                  {aboutSubTab === 'places' && 'Places Lived'}
                  {aboutSubTab === 'contact' && 'Contact and Basic Info'}
                  {aboutSubTab === 'family' && 'Family and Relationships'}
                </h3>
                <button
                  onClick={onOpenEditProfile}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <Edit2 size={14} />
                  <span>Edit Info</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <Briefcase size={24} color="var(--fb-blue)" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{details.work}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Current Employment</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <GraduationCap size={24} color="var(--fb-blue)" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{details.education}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Education</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <Home size={24} color="var(--fb-blue)" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{details.city}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Current City</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <MapPin size={24} color="var(--fb-blue)" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{details.hometown}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Hometown</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <Heart size={24} color="#F02849" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{details.relationship}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Relationship Status</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <Mail size={24} color="var(--text-secondary)" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{user?.email || 'user@example.com'}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Email (Private)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FRIENDS */}
        {activeTab === 'friends' && (
          <div className="fb-card" style={{ padding: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Friends</h2>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>1,280 friends</span>
              </div>

              {/* Friends Search */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-primary)',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  width: '240px',
                }}
              >
                <Search size={16} color="var(--text-secondary)" />
                <input
                  type="text"
                  placeholder="Search Friends..."
                  value={friendsSearch}
                  onChange={(e) => setFriendsSearch(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    width: '100%',
                  }}
                />
              </div>
            </div>

            {/* Friends Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '12px',
              }}
            >
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
                        {friend.name}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {friend.mutual} mutual friends
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={onOpenAIChat}
                      title="Message"
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--fb-blue)',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <MessageCircle size={16} />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PHOTOS */}
        {activeTab === 'photos' && (
          <div className="fb-card" style={{ padding: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Photos</h2>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  All photos & upload gallery
                </span>
              </div>
              <button
                onClick={onOpenCreatePost}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--fb-blue)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                <Plus size={16} />
                <span>Add Photos</span>
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '8px',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              {PREVIEW_PHOTOS.map((src, i) => (
                <div
                  key={i}
                  style={{
                    position: 'relative',
                    paddingTop: '100%',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-tertiary)',
                  }}
                >
                  <img
                    src={src}
                    alt={`Photo ${i + 1}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

