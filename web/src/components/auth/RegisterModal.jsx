// @file    RegisterModal.jsx
// @folder  web/src/components/auth/
// @about   Facebook "Create a new account" registration modal for desktop web.

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { signUpUser } from '../../services/authService';

export const RegisterModal = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'
  );
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const avatars = [
    { label: 'Blue', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' },
    { label: 'Amber', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
    { label: 'Green', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
    { label: 'Purple', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const user = await signUpUser(email, password, fullName, selectedAvatar);
      onRegisterSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '432px' }}
      >
        {/* Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Sign Up
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            It’s quick and easy.
          </div>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '16px',
              top: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              margin: '12px 16px 0',
              padding: '10px 12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              borderRadius: '6px',
              color: '#EF4444',
              fontSize: '13px',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '16px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '14px',
              }}
            />
            <input
              type="text"
              placeholder="Surname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <input
              type="email"
              placeholder="Email address (@gmail.com or @letran.edu.ph)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <input
              type="password"
              placeholder="New password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Avatar Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Choose an avatar
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {avatars.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(av.url)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: selectedAvatar === av.url ? '3px solid var(--fb-blue)' : '2px solid transparent',
                  }}
                >
                  <img src={av.url} alt={av.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy.
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              backgroundColor: 'var(--fb-green)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '17px',
              boxShadow: '0 2px 4px rgba(66, 183, 42, 0.4)',
            }}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};
