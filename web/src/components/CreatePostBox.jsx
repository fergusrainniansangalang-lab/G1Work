// @file    CreatePostBox.jsx
// @folder  web/src/components/
// @about   Facebook desktop "What's on your mind?" composer box on the main feed.

import React from 'react';
import { Video, Image, Smile, Sparkles } from 'lucide-react';
import { getSafeImageUrl, handleImageError, DEFAULT_AVATAR } from '../utils/imageUtils';

export const CreatePostBox = ({ user, onOpenCreatePost, onOpenAIChat }) => {
  return (
    <div className="fb-card" style={{ padding: '12px 16px' }}>
      {/* Top Input Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px' }}>
        <img
          src={getSafeImageUrl(user?.avatar, DEFAULT_AVATAR)}
          alt={user?.name || 'User'}
          onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
        />
        <button
          onClick={onOpenCreatePost}
          style={{
            flex: 1,
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '20px',
            padding: '10px 16px',
            textAlign: 'left',
            color: 'var(--text-secondary)',
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-primary)')}
        >
          {`What's on your mind, ${user?.name ? user.name.split(' ')[0] : 'friend'}?`}
        </button>
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0 -4px' }} />

      {/* Action Triggers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
        <button
          onClick={onOpenCreatePost}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px',
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: 600,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Video size={22} color="#F02849" />
          <span>Live video</span>
        </button>

        <button
          onClick={onOpenCreatePost}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px',
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: 600,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Image size={22} color="#45BD62" />
          <span>Photo/video</span>
        </button>

        <button
          onClick={onOpenAIChat}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px',
            borderRadius: '8px',
            color: 'var(--fb-blue)',
            fontSize: '14px',
            fontWeight: 700,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Sparkles size={20} color="var(--fb-blue)" />
          <span>Ask AI</span>
        </button>
      </div>
    </div>
  );
};
