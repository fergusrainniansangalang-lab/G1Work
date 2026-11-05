// @file    StoryViewerModal.jsx
// @folder  web/src/components/modals/
// @about   Full-screen Facebook Story viewer modal with auto-advancing progress bar.

import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const StoryViewerModal = ({ story, onClose, onNext, onPrev }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!story) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onNext) onNext();
          else onClose();
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [story, onNext, onClose]);

  if (!story) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Top Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
        }}
      >
        <X size={24} />
      </button>

      {/* Prev Navigation */}
      {onPrev && (
        <button
          onClick={onPrev}
          style={{
            position: 'absolute',
            left: '30px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Story Stage */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '92vh',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: story.bgColor || '#1877F2',
          boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Progress Bar */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', height: '3px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '2px', zIndex: 10, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#ffffff', transition: 'width 0.1s linear' }} />
        </div>

        {/* Author Header */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '16px',
            right: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 10,
          }}
        >
          <img
            src={story.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
            alt={story.name}
            style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #ffffff', objectFit: 'cover' }}
          />
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
              {story.name}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
              {story.time || 'Recently'}
            </div>
          </div>
        </div>

        {/* Story Media / Text */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {story.image ? (
            <img
              src={story.image}
              alt="Story Content"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>
              {story.caption}
            </div>
          )}

          {/* Caption Overlay for Photo Story */}
          {story.image && story.caption && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '24px 16px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {story.caption}
            </div>
          )}
        </div>
      </div>

      {/* Next Navigation */}
      {onNext && (
        <button
          onClick={onNext}
          style={{
            position: 'absolute',
            right: '30px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>
  );
};
