// @file    EditProfileModal.jsx
// @folder  web/src/components/modals/
// @about   Modal for updating user profile avatar, cover photo, bio, and public details in Firestore.

import React, { useState } from 'react';
import { X, Camera, Briefcase, GraduationCap, Home, MapPin, Heart } from 'lucide-react';
import { saveUserProfile, updateAuthorOnPosts, updateAuthorOnStories } from '../../services/firestoreService';
import { getSafeImageUrl, handleImageError, DEFAULT_AVATAR, DEFAULT_COVER } from '../../utils/imageUtils';

export const EditProfileModal = ({ isOpen, onClose, user, onUserUpdated }) => {
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [coverPhoto, setCoverPhoto] = useState(user?.coverPhoto || '');
  const [work, setWork] = useState(user?.details?.work || '');
  const [education, setEducation] = useState(user?.details?.education || '');
  const [city, setCity] = useState(user?.details?.city || '');
  const [hometown, setHometown] = useState(user?.details?.hometown || '');
  const [relationship, setRelationship] = useState(user?.details?.relationship || 'Single');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const presetAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200',
  ];

  const presetCovers = [
    { label: 'Mountain', url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200' },
    { label: 'Workspace', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200' },
    { label: 'Neon Cyber', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200' },
    { label: 'Sunset Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200' },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.uid || isSaving) return;

    setIsSaving(true);
    try {
      const updatedData = {
        name: name.trim() || user.name,
        bio: bio.trim(),
        avatar: avatar || user.avatar,
        coverPhoto: coverPhoto || user.coverPhoto,
        details: {
          work: work.trim(),
          education: education.trim(),
          city: city.trim(),
          hometown: hometown.trim(),
          relationship: relationship.trim(),
          joined: user?.details?.joined || 'Joined November 2026',
          followers: user?.details?.followers || 'Followed by 1,280 people',
        },
      };

      await saveUserProfile(user.uid, updatedData);

      // Sync updated name and avatar across all authored posts and stories
      if (updatedData.name !== user.name || updatedData.avatar !== user.avatar) {
        await updateAuthorOnPosts(user.uid, updatedData.name, updatedData.avatar);
        await updateAuthorOnStories(user.uid, updatedData.name, updatedData.avatar);
      }

      onUserUpdated({ ...user, ...updatedData });
      onClose();
    } catch (err) {
      console.warn('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '600px' }}
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
            Edit profile
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

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: '20px' }}>
          {/* Profile Picture Section */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>Profile picture</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
              <img
                src={getSafeImageUrl(avatar || user?.avatar, DEFAULT_AVATAR)}
                alt="Avatar"
                onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--fb-blue)' }}
              />
              <div style={{ flex: 1 }}>
                <input
                  type="url"
                  placeholder="Paste image URL for avatar..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    marginBottom: '6px',
                  }}
                />
                <div style={{ display: 'flex', gap: '6px' }}>
                  {presetAvatars.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatar(url)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: avatar === url ? '2px solid var(--fb-blue)' : '1px solid var(--border-color)',
                      }}
                    >
                      <img src={url} alt="preset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cover Photo Section */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>Cover photo</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '90px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <img
                  src={getSafeImageUrl(coverPhoto || user?.coverPhoto, DEFAULT_COVER)}
                  alt="Cover preview"
                  onError={(e) => handleImageError(e, DEFAULT_COVER)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <input
                type="url"
                placeholder="Paste image URL for cover photo..."
                value={coverPhoto}
                onChange={(e) => setCoverPhoto(e.target.value)}
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
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {presetCovers.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCoverPhoto(preset.url)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: coverPhoto === preset.url ? '1px solid var(--fb-blue)' : '1px solid var(--border-color)',
                      backgroundColor: coverPhoto === preset.url ? 'rgba(24, 119, 242, 0.1)' : 'var(--bg-primary)',
                      color: coverPhoto === preset.url ? 'var(--fb-blue)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Full Name & Bio */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                resize: 'none',
              }}
            />
          </div>

          {/* Public Details */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>Edit Details</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Work</label>
                <input
                  type="text"
                  placeholder="Works at..."
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Education</label>
                <input
                  type="text"
                  placeholder="Studied at..."
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Current City</label>
                <input
                  type="text"
                  placeholder="Lives in..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Hometown</label>
                <input
                  type="text"
                  placeholder="From..."
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                padding: '8px 24px',
                borderRadius: '6px',
                backgroundColor: 'var(--fb-blue)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
