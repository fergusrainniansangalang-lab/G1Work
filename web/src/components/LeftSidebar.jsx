// @file    LeftSidebar.jsx
// @folder  web/src/components/
// @about   Facebook desktop left sidebar with navigation shortcuts, user profile pill, and feed category filters.

import React from 'react';
import {
  Users,
  Bookmark,
  Clock,
  Tv,
  Store,
  Sparkles,
  Briefcase,
  User,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { getSafeImageUrl, handleImageError, DEFAULT_AVATAR } from '../utils/imageUtils';

export const LeftSidebar = ({
  user,
  onOpenProfile,
  onOpenAIChat,
  activeCategory,
  onSelectCategory,
}) => {
  const categories = [
    { id: 'All', label: 'All Updates', icon: Sparkles, color: '#1877F2' },
    { id: 'Work', label: 'Work & Tasks', icon: Briefcase, color: '#F59E0B' },
    { id: 'Personal', label: 'Personal Life', icon: User, color: '#10B981' },
    { id: 'Ideas', label: 'Ideas & Thoughts', icon: Lightbulb, color: '#8B5CF6' },
  ];

  return (
    <aside className="sidebar-left">
      {/* User Profile Pill */}
      <button
        onClick={onOpenProfile}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 12px',
          width: '100%',
          borderRadius: '8px',
          transition: 'background 0.15s',
          marginBottom: '8px',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <img
          src={getSafeImageUrl(user?.avatar, DEFAULT_AVATAR)}
          alt={user?.name || 'User'}
          onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
        />
        <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
          {user?.name || 'Your Profile'}
        </span>
      </button>

      {/* Meta AI Shortcut */}
      <button
        onClick={onOpenAIChat}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 12px',
          width: '100%',
          borderRadius: '8px',
          marginBottom: '8px',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: 'rgba(24, 119, 242, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--fb-blue)',
          }}
        >
          <Sparkles size={20} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>Meta AI</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Chat, summarize & create</div>
        </div>
      </button>

      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '12px 8px' }} />

      {/* Category Filter Section */}
      <div style={{ padding: '4px 12px', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
        FEED CATEGORIES
      </div>
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isSelected = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              width: '100%',
              borderRadius: '8px',
              backgroundColor: isSelected ? 'var(--bg-hover)' : 'transparent',
              marginBottom: '2px',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: `${cat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: cat.color,
                }}
              >
                <Icon size={18} />
              </div>
              <span
                style={{
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '14px',
                  color: isSelected ? 'var(--fb-blue)' : 'var(--text-primary)',
                }}
              >
                {cat.label}
              </span>
            </div>
            {isSelected && <CheckCircle2 size={16} color="var(--fb-blue)" />}
          </button>
        );
      })}

      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '12px 8px' }} />

      {/* General Shortcuts */}
      <div style={{ padding: '4px 12px', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
        SHORTCUTS
      </div>
      {[
        { label: 'Friends', icon: Users, color: '#1877F2' },
        { label: 'Memories', icon: Clock, color: '#3B82F6' },
        { label: 'Saved', icon: Bookmark, color: '#8B5CF6' },
        { label: 'Video', icon: Tv, color: '#10B981' },
        { label: 'Marketplace', icon: Store, color: '#F59E0B' },
      ].map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: `${item.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
              }}
            >
              <Icon size={18} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </aside>
  );
};
