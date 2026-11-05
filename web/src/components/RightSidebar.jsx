// @file    RightSidebar.jsx
// @folder  web/src/components/
// @about   Facebook desktop right sidebar with active contacts, sponsored items, and AI launcher.

import React from 'react';
import { Gift, Video, Search, MoreHorizontal, Sparkles } from 'lucide-react';

export const RightSidebar = ({ onOpenAIChat }) => {
  const contacts = [
    { name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', online: true },
    { name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', online: true },
    { name: 'Maya Lin', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', online: true },
    { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', online: false },
    { name: 'Ines Okafor', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', online: true },
    { name: 'Tomasz Wierzbicki', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100', online: false },
  ];

  return (
    <aside className="sidebar-right">
      {/* Sponsored Ad / Banner */}
      <div style={{ marginBottom: '16px', padding: '0 8px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Sponsored
        </div>
        <div
          onClick={onOpenAIChat}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: 'var(--bg-hover)',
          }}
        >
          <div
            style={{
              width: 80,
              height: 60,
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #1877F2, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Sparkles size={28} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Meta AI Powered Feed
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              facebook.com/ai
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '12px 8px' }} />

      {/* Birthdays */}
      <div style={{ padding: '0 8px', marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Birthdays
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 0' }}>
          <Gift size={24} color="var(--fb-blue)" />
          <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
            <strong>David Chen</strong> has a birthday today!
          </div>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '12px 8px' }} />

      {/* Contacts Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px 8px',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)' }}>
          Contacts
        </div>
        <div style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)' }}>
          <Video size={16} style={{ cursor: 'pointer' }} />
          <Search size={16} style={{ cursor: 'pointer' }} />
          <MoreHorizontal size={16} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      {/* Contacts List */}
      <div>
        {contacts.map((contact, i) => (
          <div
            key={i}
            onClick={onOpenAIChat}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={contact.avatar}
                alt={contact.name}
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
              />
              {contact.online && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    border: '2px solid var(--bg-secondary)',
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
              {contact.name}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};
