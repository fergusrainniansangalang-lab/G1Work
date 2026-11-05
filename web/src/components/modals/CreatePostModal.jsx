// @file    CreatePostModal.jsx
// @folder  web/src/components/modals/
// @about   Modal for composing a new Facebook post with category tags, photo attachments, and AI Polish.

import React, { useState } from 'react';
import { X, Sparkles, Image, CheckCircle } from 'lucide-react';
import { polishPostContent } from '../../services/aiService';
import { getSafeImageUrl, handleImageError, DEFAULT_AVATAR } from '../../utils/imageUtils';

export const CreatePostModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState('');
  const [category, setCategory] = useState('Work');
  const [isPolishing, setIsPolishing] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  if (!isOpen) return null;

  const handlePolish = async () => {
    if (!content.trim() || isPolishing) return;
    setIsPolishing(true);
    try {
      const polished = await polishPostContent(content);
      setContent(polished);
    } catch (err) {
      console.warn('AI polish failed:', err);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit({
      content: content.trim(),
      media: media.trim() || null,
      category,
    });
    setContent('');
    setMedia('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid var(--border-color)',
            position: 'relative',
          }}
        >
          <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '18px' }}>
            Create post
          </div>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px' }}>
          <img
            src={getSafeImageUrl(user?.avatar, DEFAULT_AVATAR)}
            alt={user?.name || 'User'}
            onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
            style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
              {user?.name || 'Your Name'}
            </div>

            {/* Category Select Pill */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              {['Work', 'Personal', 'Ideas'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: category === cat ? 'var(--fb-blue)' : 'var(--bg-primary)',
                    color: category === cat ? '#ffffff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Post Form */}
        <form onSubmit={handleSubmit} style={{ padding: '0 16px 16px' }}>
          <textarea
            rows={5}
            placeholder={`What's on your mind, ${user?.name ? user.name.split(' ')[0] : ''}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '16px',
              color: 'var(--text-primary)',
              background: 'transparent',
              lineHeight: 1.4,
            }}
          />

          {/* Optional Image Input Field */}
          {showImageInput && (
            <div style={{ marginBottom: '12px' }}>
              <input
                type="url"
                placeholder="Paste image URL (e.g. https://...)"
                value={media}
                onChange={(e) => setMedia(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
              {media && (
                <div style={{ marginTop: '8px', maxHeight: '180px', overflow: 'hidden', borderRadius: '6px' }}>
                  <img src={media} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          )}

          {/* Add-ons Tray */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Add to your post
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Toggle Image */}
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: showImageInput ? 'rgba(69, 189, 98, 0.15)' : 'transparent',
                }}
                title="Add Photo URL"
              >
                <Image size={22} color="#45BD62" />
              </button>

              {/* AI Polish Button */}
              <button
                type="button"
                onClick={handlePolish}
                disabled={!content.trim() || isPolishing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(24, 119, 242, 0.12)',
                  color: 'var(--fb-blue)',
                  fontSize: '12px',
                  fontWeight: 700,
                  opacity: !content.trim() ? 0.5 : 1,
                  cursor: !content.trim() ? 'not-allowed' : 'pointer',
                }}
                title="Polish post with Meta AI"
              >
                <Sparkles size={16} />
                <span>{isPolishing ? 'Polishing...' : 'Polish with AI'}</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!content.trim()}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              backgroundColor: content.trim() ? 'var(--fb-blue)' : 'var(--bg-tertiary)',
              color: content.trim() ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '15px',
              cursor: content.trim() ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s',
            }}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};
