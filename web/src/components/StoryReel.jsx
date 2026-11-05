// @file    StoryReel.jsx
// @folder  web/src/components/
// @about   Facebook desktop stories carousel with "Create story" card and full-screen story viewer trigger.

import React, { useRef } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSafeImageUrl, handleImageError, DEFAULT_AVATAR, DEFAULT_COVER } from '../utils/imageUtils';

export const StoryReel = ({ stories, user, onOpenCreateStory, onSelectStory }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', marginBottom: '16px' }}>
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll('left')}
        style={{
          position: 'absolute',
          left: -16,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          border: '1px solid var(--border-color)',
        }}
      >
        <ChevronLeft size={22} />
      </button>

      {/* Stories Rail */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '4px 0',
        }}
      >
        {/* Create Story Card */}
        <div
          onClick={onOpenCreateStory}
          style={{
            flex: '0 0 115px',
            height: '200px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <div style={{ height: '145px', overflow: 'hidden' }}>
            <img
              src={getSafeImageUrl(user?.avatar, DEFAULT_AVATAR)}
              alt="Create Story"
              onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              top: '125px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: 'var(--fb-blue)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid var(--bg-secondary)',
            }}
          >
            <Plus size={20} strokeWidth={3} />
          </div>
          <div
            style={{
              marginTop: '16px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              padding: '0 4px',
            }}
          >
            Create story
          </div>
        </div>

        {/* Existing Stories from Firestore */}
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => onSelectStory(story)}
            style={{
              flex: '0 0 115px',
              height: '200px',
              borderRadius: '10px',
              backgroundColor: story.bgColor || '#1877F2',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {/* Story Image Background */}
            {story.image ? (
              <img
                src={getSafeImageUrl(story.image, DEFAULT_COVER)}
                alt={story.name}
                onError={(e) => handleImageError(e, DEFAULT_COVER)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {story.caption}
              </div>
            )}

            {/* Dark Gradient Overlay for readability */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)',
              }}
            />

            {/* Author Avatar Badge */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '3px solid var(--fb-blue)',
                overflow: 'hidden',
              }}
            >
              <img
                src={getSafeImageUrl(story.avatar, DEFAULT_AVATAR)}
                alt={story.name}
                onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Author Name */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {story.name}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll('right')}
        style={{
          position: 'absolute',
          right: -16,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          border: '1px solid var(--border-color)',
        }}
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
};
