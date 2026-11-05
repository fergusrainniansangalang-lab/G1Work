// @file    LoginPage.jsx
// @folder  web/src/components/auth/
// @about   Desktop Facebook login screen with brand introduction and account access.

import React, { useState } from 'react';
import { signInUser, resetPassword } from '../../services/authService';
import { RegisterModal } from './RegisterModal';

export const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Forgotten password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await signInUser(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForgot = (e) => {
    e.preventDefault();
    setForgotEmail(email.trim());
    setForgotError('');
    setForgotSuccess('');
    setShowForgot(true);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail.trim()) {
      setForgotError('Please enter your email address.');
      return;
    }

    setIsForgotLoading(true);
    try {
      await resetPassword(forgotEmail.trim());
      setForgotSuccess(
        `A password reset link has been sent to ${forgotEmail.trim()}. Please check your email inbox and spam folder to create a new password.`
      );
    } catch (err) {
      const msg = err.message || 'Failed to send password reset email.';
      if (msg.includes('auth/user-not-found')) {
        setForgotError('No account found with this email address.');
      } else if (msg.includes('auth/invalid-email')) {
        setForgotError('Please enter a valid email address.');
      } else if (msg.includes('auth/too-many-requests')) {
        setForgotError('Too many attempts. Please try again in a few minutes.');
      } else {
        setForgotError(msg);
      }
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '980px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px',
        }}
      >
        {/* Left Column: Facebook Brand & Value Prop */}
        <div style={{ flex: '1 1 400px', maxWidth: '500px' }}>
          <h1
            style={{
              color: 'var(--fb-blue)',
              fontSize: '56px',
              fontWeight: 800,
              letterSpacing: '-1.5px',
              marginBottom: '4px',
              fontFamily: 'Segoe UI, Helvetica, Arial, sans-serif',
            }}
          >
            facebook
          </h1>
          <p
            style={{
              fontSize: '28px',
              lineHeight: 1.25,
              color: 'var(--text-primary)',
              fontWeight: 400,
            }}
          >
            Connect with friends, share tasks, and collaborate with Meta AI on Facebook.
          </p>
        </div>

        {/* Right Column: Login Card */}
        <div style={{ flex: '0 0 396px', width: '100%', maxWidth: '396px' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-color)',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            {error && (
              <div
                style={{
                  marginBottom: '14px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid #EF4444',
                  borderRadius: '6px',
                  color: '#EF4444',
                  fontSize: '13px',
                  textAlign: 'left',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="email"
                  placeholder="Email address (@gmail.com or @letran.edu.ph)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '17px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '17px',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--fb-blue)',
                  color: '#ffffff',
                  fontSize: '20px',
                  fontWeight: 700,
                  transition: 'background 0.15s',
                }}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div style={{ margin: '16px 0 12px' }}>
              <a
                href="#forgot"
                onClick={handleOpenForgot}
                style={{ color: 'var(--fb-blue)', fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }}
              >
                Forgotten password?
              </a>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '16px 0 20px' }} />

            <button
              type="button"
              onClick={() => setShowRegister(true)}
              style={{
                backgroundColor: 'var(--fb-green)',
                color: '#ffffff',
                padding: '12px 18px',
                borderRadius: '6px',
                fontSize: '17px',
                fontWeight: 700,
                display: 'inline-block',
                boxShadow: '0 2px 4px rgba(66, 183, 42, 0.4)',
              }}
            >
              Create new account
            </button>
          </div>

          <div style={{ marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <strong>Create a Page</strong> for a celebrity, brand or business.
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onRegisterSuccess={onLoginSuccess}
      />

      {/* Forgotten Password Modal */}
      {showForgot && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={() => setShowForgot(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Find Your Account
              </h3>
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px' }}>
              {forgotSuccess ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      marginBottom: '12px',
                    }}
                  >
                    ✉️
                  </div>
                  <h4 style={{ color: '#22C55E', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                    Reset Email Sent
                  </h4>
                  <p style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
                    {forgotSuccess}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(false);
                      setForgotSuccess('');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'var(--fb-blue)',
                      color: '#ffffff',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '15px',
                      cursor: 'pointer',
                    }}
                  >
                    Back to Log In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.4, marginBottom: '16px' }}>
                    Please enter your email address to search for your account and receive a link to change your password.
                  </p>

                  <input
                    type="email"
                    placeholder="Email address (@gmail.com or @letran.edu.ph)"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      if (forgotError) setForgotError('');
                    }}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: `1px solid ${forgotError ? '#EF4444' : 'var(--border-color)'}`,
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '15px',
                      outline: 'none',
                      marginBottom: '10px',
                    }}
                  />

                  {forgotError && (
                    <div
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        borderLeft: '3px solid #EF4444',
                        padding: '10px 12px',
                        borderRadius: '4px',
                        color: '#EF4444',
                        fontSize: '13px',
                        marginBottom: '16px',
                      }}
                    >
                      ⚠️ {forgotError}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => setShowForgot(false)}
                      disabled={isForgotLoading}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotLoading}
                      style={{
                        padding: '10px 22px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--fb-blue)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      {isForgotLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
