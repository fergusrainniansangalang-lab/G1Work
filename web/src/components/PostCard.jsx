// @file    PostCard.jsx
// @folder  web/src/components/
// @about   Facebook post card with reactions hover picker, comments thread, share, and completion toggle.

import React, { useState, useEffect, useRef } from 'react';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  CheckCircle,
  Circle,
  Trash2,
  Send,
} from 'lucide-react';
import {
  reactToPost,
  getUserReaction,
  addComment,
  subscribeToComments,
  sharePost,
  deletePost,
  togglePostComplete,
} from '../services/firestoreService';
import { getSafeImageUrl, handleImageError, DEFAULT_AVATAR } from '../utils/imageUtils';

export const PostCard = ({ post, user, onDeletePost, onNavigateProfile }) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  const [reactions, setReactions] = useState(
    post.reactions || { like: 0, love: 0, laugh: 0, wow: 0, sad: 0, angry: 0 }
  );
  const [shares, setShares] = useState(post.shares || 0);
  const [completed, setCompleted] = useState(post.completed || false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const hoverTimeoutRef = useRef(null);

  // Sync reactions if post prop updates
  useEffect(() => {
    if (post.reactions) {
      setReactions(post.reactions);
    }
  }, [post.reactions]);

  // Load user reaction
  useEffect(() => {
    const uid = user?.uid || user?.id;
    if (uid) {
      getUserReaction(post.id, uid).then((r) => {
        if (r) setUserReaction(r);
      });
    }
  }, [post.id, user?.uid, user?.id]);

  // Listen to comments
  useEffect(() => {
    const unsub = subscribeToComments(post.id, setComments);
    return () => unsub();
  }, [post.id]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setShowReactionPicker(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowReactionPicker(false);
    }, 250);
  };

  // ─── Reaction toggle (optimistic + Firestore) ─────────────
  const handleReact = async (type) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setShowReactionPicker(false);

    const uid = user?.uid || user?.id || 'web_user';

    // Optimistic toggle: clicking the same reaction removes it (toggles off)
    const isSame = userReaction === type;
    const newReaction = isSame ? null : type;
    const updatedReactions = { ...reactions };

    if (userReaction && updatedReactions[userReaction] !== undefined) {
      updatedReactions[userReaction] = Math.max(0, updatedReactions[userReaction] - 1);
    }
    if (newReaction) {
      updatedReactions[newReaction] = (updatedReactions[newReaction] || 0) + 1;
    }

    setUserReaction(newReaction);
    setReactions(updatedReactions);

    try {
      const res = await reactToPost(post.id, type, uid);
      if (res) {
        setUserReaction(res.newReaction);
        setReactions(res.reactions);
      }
    } catch (err) {
      console.warn('React error:', err);
    }
  };

  const handleMainButtonClick = () => {
    // If reacted with anything, clicking the button unreacts (toggles off)
    // If not reacted, clicking defaults to 'like'
    handleReact(userReaction ? userReaction : 'like');
  };

  const handleToggleComplete = async () => {
    setCompleted(!completed);
    try {
      await togglePostComplete(post.id);
    } catch (e) {
      setCompleted(completed);
    }
  };

  const handleShare = async () => {
    setShares(shares + 1);
    try {
      await sharePost(post.id);
    } catch (e) {
      setShares(shares);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim() || !user?.uid) return;
    const text = commentInput.trim();
    setCommentInput('');
    try {
      await addComment(post.id, text, user);
    } catch (err) {
      console.warn('Add comment error:', err);
    }
  };

  const isAuthor = user?.uid && post.authorId === user.uid;
  const totalReactions = Object.values(reactions || {}).reduce((a, b) => a + b, 0);

  const reactionEmojis = [
    { type: 'like', emoji: '👍', label: 'Like', color: '#1877F2' },
    { type: 'love', emoji: '❤️', label: 'Love', color: '#F02849' },
    { type: 'laugh', emoji: '😂', label: 'Haha', color: '#F59E0B' },
    { type: 'wow', emoji: '😮', label: 'Wow', color: '#F59E0B' },
    { type: 'sad', emoji: '😢', label: 'Sad', color: '#F59E0B' },
    { type: 'angry', emoji: '😡', label: 'Angry', color: '#E41E3F' },
  ];

  const currentEmoji = reactionEmojis.find((r) => r.type === userReaction);

  return (
    <article className="fb-card">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={getSafeImageUrl(post.authorAvatar, DEFAULT_AVATAR)}
            alt={post.authorName}
            onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              objectFit: 'cover',
              cursor: onNavigateProfile ? 'pointer' : 'default',
            }}
            onClick={() => {
              if (onNavigateProfile) onNavigateProfile(post.authorId);
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                  cursor: onNavigateProfile ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (onNavigateProfile) onNavigateProfile(post.authorId);
                }}
              >
                {post.authorName}
              </span>
              {post.category && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor:
                      post.category === 'Work'
                        ? 'rgba(245, 158, 11, 0.15)'
                        : post.category === 'Personal'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(139, 92, 246, 0.15)',
                    color:
                      post.category === 'Work'
                        ? '#F59E0B'
                        : post.category === 'Personal'
                        ? '#10B981'
                        : '#8B5CF6',
                  }}
                >
                  {post.category}
                </span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {post.time || 'Recently'} · 🌎
            </div>
          </div>
        </div>

        {/* Right Header: Completion Toggle & Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          <button
            onClick={handleToggleComplete}
            title={completed ? 'Mark pending' : 'Mark completed'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px',
              color: completed ? '#10B981' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: completed ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
            }}
          >
            {completed ? <CheckCircle size={18} /> : <Circle size={18} />}
            <span>{completed ? 'Completed' : 'Pending'}</span>
          </button>

          {isAuthor && (
            <div>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                }}
              >
                <MoreHorizontal size={20} />
              </button>

              {showMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '36px',
                    right: 0,
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-color)',
                    padding: '4px',
                    zIndex: 20,
                    minWidth: '150px',
                  }}
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDeletePost(post.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      width: '100%',
                      color: '#EF4444',
                      fontSize: '13px',
                      fontWeight: 600,
                      borderRadius: '6px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Trash2 size={16} />
                    <span>Delete post</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '4px 16px 12px', fontSize: '15px', lineHeight: 1.45 }}>
        {post.content}
      </div>

      {/* Post Image */}
      {post.media && !post.media.startsWith('file://') && !post.media.startsWith('/data/user/') && (
        <div style={{ width: '100%', maxHeight: '520px', overflow: 'hidden', backgroundColor: '#000' }}>
          <img
            src={post.media}
            alt="Post media"
            onError={(e) => {
              if (e.currentTarget?.parentElement) {
                e.currentTarget.parentElement.style.display = 'none';
              }
            }}
            style={{ width: '100%', maxHeight: '520px', objectFit: 'contain', display: 'block' }}
          />
        </div>
      )}

      {/* Stats Line */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 16px',
          color: 'var(--text-secondary)',
          fontSize: '13px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {totalReactions > 0 ? (
            <>
              <span style={{ display: 'flex', gap: '2px' }}>
                {reactionEmojis
                  .filter((r) => (reactions?.[r.type] || 0) > 0)
                  .slice(0, 3)
                  .map((r) => (
                    <span
                      key={r.type}
                      title={r.label}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: r.color,
                        fontSize: '11px',
                        lineHeight: 1,
                        boxShadow: '0 0 0 2px var(--bg-secondary)',
                        marginLeft: '-4px',
                      }}
                    >
                      {r.emoji}
                    </span>
                  ))}
              </span>
              <span>{totalReactions}</span>
            </>
          ) : null}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => setShowComments(!showComments)}>
            {comments.length} comments
          </span>
          <span>{shares} shares</span>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0 16px' }} />

      {/* Action Buttons: Like, Comment, Share */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '4px 8px',
          position: 'relative',
        }}
      >
        {/* Like Button with Hover Popover */}
        <div
          className="reaction-picker-wrapper"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ flex: 1 }}
        >
          {showReactionPicker && (
            <div
              className="reaction-popover"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {reactionEmojis.map((r) => {
                const isActive = userReaction === r.type;
                return (
                  <button
                    key={r.type}
                    type="button"
                    className="reaction-emoji-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReact(r.type);
                    }}
                    title={`${r.label}${isActive ? ' (Click to remove)' : ''}`}
                    style={{
                      backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                      transform: isActive ? 'scale(1.25)' : undefined,
                      border: isActive ? `2px solid ${r.color}` : '2px solid transparent',
                    }}
                  >
                    {r.emoji}
                  </button>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={handleMainButtonClick}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: '6px',
              color: currentEmoji ? currentEmoji.color : 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: 'transparent',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {currentEmoji ? (
              <>
                <span style={{ fontSize: '18px' }}>{currentEmoji.emoji}</span>
                <span>{currentEmoji.label}</span>
              </>
            ) : (
              <>
                <ThumbsUp size={18} />
                <span>Like</span>
              </>
            )}
          </button>
        </div>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: 600,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <MessageCircle size={18} />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: 600,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>

      {/* Comment Section (Expandable) */}
      {showComments && (
        <div style={{ padding: '8px 16px 16px', borderTop: '1px solid var(--border-color)' }}>
          {/* Comments List */}
          {comments.map((comment) => (
            <div key={comment.id} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <img
                src={getSafeImageUrl(comment.authorAvatar, DEFAULT_AVATAR)}
                alt={comment.authorName}
                onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    padding: '8px 12px',
                    borderRadius: '16px',
                    display: 'inline-block',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                    {comment.authorName}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                    {comment.text}
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '12px', marginTop: '2px' }}>
                  {comment.time || 'Just now'} · Like · Reply
                </div>
              </div>
            </div>
          ))}

          {/* Comment Input */}
          <form onSubmit={handleAddComment} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <img
              src={getSafeImageUrl(user?.avatar, DEFAULT_AVATAR)}
              alt={user?.name || 'User'}
              onError={(e) => handleImageError(e, DEFAULT_AVATAR)}
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '20px',
                padding: '6px 12px',
                border: '1px solid var(--border-color)',
              }}
            >
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                style={{
                  color: commentInput.trim() ? 'var(--fb-blue)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  cursor: commentInput.trim() ? 'pointer' : 'default',
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
};
