// @file    CreateStoryModal.jsx
// @folder  web/src/components/modals/
// @about   Modal for publishing a new Facebook Story to the synchronized Firestore collection.

import React, { useState } from 'react';
import { X, Image, Type } from 'lucide-react';

export const CreateStoryModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [bgColor, setBgColor] = useState('linear-gradient(135deg, #1877F2, #8B5CF6)');
  const [mode, setMode] = useState('photo'); // 'photo' | 'text'

  if (!isOpen) return null;

  const gradients = [
    'linear-gradient(135deg, #1877F2, #8B5CF6)',
    'linear-gradient(135deg, #F02849, #F59E0B)',
    'linear-gradient(135deg, #10B981, #06B6D4)',
    'linear-gradient(135deg, #EC4899, #8B5CF6)',
    'linear-gradient(135deg, #1E293B, #0F172A)',
  ];

  const presetImages = [
    { label: 'Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
    { label: 'Tech', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800' },
    { label: 'Mountain', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800' },
    { label: 'Cafe', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caption.trim() && !image) return;

    onSubmit({
      caption: caption.trim(),
      image: mode === 'photo' ? image || presetImages[0].url : '',
      bgColor: mode === 'text' ? bgColor : '#1877F2',
    });

    setCaption('');
    setImage('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '580px' }}
      >
        {/* Header */}
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
            Create your story
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

        {/* Mode Selector */}
        <div style={{ display: 'flex', padding: '12px 16px', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setMode('photo')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '14px',
              backgroundColor: mode === 'photo' ? 'var(--fb-blue)' : 'var(--bg-primary)',
              color: mode === 'photo' ? '#fff' : 'var(--text-primary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <Image size={18} />
            <span>Photo story</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('text')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '14px',
              backgroundColor: mode === 'text' ? 'var(--fb-blue)' : 'var(--bg-primary)',
              color: mode === 'text' ? '#fff' : 'var(--text-primary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <Type size={18} />
            <span>Text story</span>
          </button>
        </div>

        {/* Live Preview Card */}
        <div style={{ padding: '0 16px', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '200px',
              height: '300px',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              background: mode === 'text' ? bgColor : '#111',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '16px',
            }}
          >
            {mode === 'photo' && (image || presetImages[0].url) && (
              <img
                src={image || presetImages[0].url}
                alt="Preview"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {caption || (mode === 'text' ? 'Start typing your story...' : '')}
            </div>
          </div>
        </div>

        {/* Inputs */}
        <form onSubmit={handleSubmit} style={{ padding: '16px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Story Caption
            </label>
            <input
              type="text"
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '14px',
              }}
            />
          </div>

          {mode === 'photo' ? (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Choose preset photo or enter custom URL
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                {presetImages.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImage(p.url)}
                    style={{
                      flex: 1,
                      height: '40px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: image === p.url ? '2px solid var(--fb-blue)' : '1px solid var(--border-color)',
                    }}
                  >
                    <img src={p.url} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
              <input
                type="url"
                placeholder="Or paste image URL (https://...)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
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
            </div>
          ) : (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Background Gradient
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {gradients.map((grad, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setBgColor(grad)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: grad,
                      border: bgColor === grad ? '3px solid var(--text-primary)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Discard
            </button>
            <button
              type="submit"
              style={{
                flex: 2,
                padding: '10px',
                borderRadius: '6px',
                backgroundColor: 'var(--fb-blue)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              Share to story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
