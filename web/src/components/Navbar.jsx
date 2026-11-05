// @file    Navbar.jsx
// @folder  web/src/components/
// @about   Facebook desktop top navigation bar with search, active tabs, theme toggle, and user menu.

import React, { useState } from 'react';
import {
  Search,
  Home,
  Tv,
  Store,
  Users,
  Gamepad2,
  Plus,
  MessageCircle,
  Bell,
  Moon,
  Sun,
  LogOut,
  User as UserIcon,
  Sparkles,
  Heart,
  Share2,
  X,
} from 'lucide-react';
import { getSafeImageUrl, handleImageError, DEFAULT_AVATAR } from '../utils/imageUtils';

export const Navbar = ({
  user,
  searchQuery,
  onSearchChange,
  isDark,
  onToggleTheme,
  onLogout,
  onOpenCreatePost,
  onOpenAIChat,
  onOpenProfile,
  onOpenEditProfile,
  onOpenAdmin,
  activeTab,
  onTabChange,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    onTabChange('feed');
    const newCount = logoClicks + 1;
    if (newCount >= 5) {
      setLogoClicks(0);
      if (onOpenAdmin) onOpenAdmin();
    } else {
      setLogoClicks(newCount);
      // Reset after 3 seconds if user stops clicking
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-height)',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 500,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Left: Facebook Logo & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '300px' }}>
        <button
          onClick={handleLogoClick}
          style={{ display: 'flex', alignItems: 'center' }}
          title="Facebook Home"
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'var(--fb-blue)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: 26,
              fontFamily: 'Segoe UI, sans-serif',
              boxShadow: '0 2px 4px rgba(24, 119, 242, 0.4)',
            }}
          >
            f
          </div>
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '20px',
            padding: '8px 12px',
            gap: '8px',
            width: '240px',
            border: '1px solid var(--border-color)',
          }}
        >
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search Facebook..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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

      {/* Center: Main App Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: '4px' }}>
        {[
          { id: 'feed', icon: Home, label: 'Home' },
          { id: 'watch', icon: Tv, label: 'Video' },
          { id: 'marketplace', icon: Store, label: 'Marketplace' },
          { id: 'groups', icon: Users, label: 'Groups' },
          { id: 'gaming', icon: Gamepad2, label: 'Gaming' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              title={tab.label}
              style={{
                width: '100px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                color: isActive ? 'var(--fb-blue)' : 'var(--text-secondary)',
                borderBottom: isActive ? '3px solid var(--fb-blue)' : '3px solid transparent',
                transition: 'background 0.15s',
                borderRadius: '8px 8px 0 0',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Icon size={24} />
            </button>
          );
        })}
      </div>

      {/* Right: Quick Actions & Profile Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '300px', justifyContent: 'flex-end' }}>
        {/* Meta AI Quick Button */}
        <button
          onClick={onOpenAIChat}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(24, 119, 242, 0.12)',
            color: 'var(--fb-blue)',
            padding: '6px 12px',
            borderRadius: '18px',
            fontWeight: 600,
            fontSize: '13px',
            border: '1px solid rgba(24, 119, 242, 0.25)',
          }}
          title="Ask Meta AI"
        >
          <Sparkles size={16} />
          <span>Meta AI</span>
        </button>

        {/* Create Post Button */}
        <button
          onClick={onOpenCreatePost}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Create post"
        >
          <Plus size={20} />
        </button>

        {/* Messenger Button */}
        <button
          onClick={onOpenAIChat}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Messages / AI Chat"
        >
          <MessageCircle size={20} />
        </button>

        {/* Notifications Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: showNotifications ? 'rgba(24, 119, 242, 0.15)' : 'var(--bg-tertiary)',
              color: showNotifications ? 'var(--fb-blue)' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              border: 'none',
              cursor: 'pointer',
            }}
            title="Notifications"
          >
            <Bell size={20} />
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: '#E41E3F',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
                minWidth: '18px',
                height: '18px',
                borderRadius: '9px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                border: '2px solid var(--bg-secondary)',
              }}
            >
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '360px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
                border: '1px solid var(--border-color)',
                padding: '12px',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '10px',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-primary)' }}>Notifications</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {[
                {
                  id: 1,
                  icon: Heart,
                  iconColor: '#F02849',
                  text: 'Sarah Jenkins loved your post: "Just finished setting up our new dashboard!"',
                  time: '15m ago',
                },
                {
                  id: 2,
                  icon: MessageCircle,
                  iconColor: '#1877F2',
                  text: 'David Chen commented: "Looks incredible! Fantastic work."',
                  time: '1h ago',
                },
                {
                  id: 3,
                  icon: Share2,
                  iconColor: '#10B981',
                  text: 'Maya Lin shared your post to her activity stream.',
                  time: '2h ago',
                },
              ].map((n) => {
                const IconComponent = n.icon;
                return (
                  <div
                    key={n.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent size={18} color={n.iconColor} />
                    </div>
                    <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.4' }}>
                      <p style={{ margin: 0, color: 'var(--text-primary)' }}>{n.text}</p>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{n.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Profile Avatar / Menu Trigger */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              borderRadius: '50%',
              border: '2px solid transparent',
            }}
          >
            <img
              src={getSafeImageUrl(user?.avatar, DEFAULT_AVATAR)}
              alt={user?.name || 'User'}
              onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
            />
          </button>

          {/* User Popover Menu */}
          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                width: '280px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                padding: '8px',
                zIndex: 600,
              }}
            >
              <div
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenProfile();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-hover)',
                  marginBottom: '8px',
                }}
              >
                <img
                  src={getSafeImageUrl(user?.avatar, DEFAULT_AVATAR)}
                  alt={user?.name}
                  onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
                  style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{user?.name || 'Your Profile'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>See your profile</div>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  if (onOpenEditProfile) {
                    onOpenEditProfile();
                  } else {
                    onOpenProfile();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                <UserIcon size={18} />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onToggleTheme();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                <span>{isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}</span>
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  color: '#EF4444',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
