// @file    Feed.jsx
// @folder  web/src/components/
// @about   Main center feed column with stories reel, post composer, AI digest, and dynamic post stream.

import React from 'react';
import { StoryReel } from './StoryReel';
import { CreatePostBox } from './CreatePostBox';
import { AIBriefingCard } from './AIBriefingCard';
import { PostCard } from './PostCard';
import { Sparkles, FileText } from 'lucide-react';

export const Feed = ({
  user,
  posts,
  stories,
  briefing,
  briefingLoading,
  onRefreshBriefing,
  onOpenCreatePost,
  onOpenCreateStory,
  onOpenAIChat,
  onSelectStory,
  onDeletePost,
  onNavigateProfile,
  activeCategory,
  searchQuery,
}) => {
  // Filter posts by category & search query
  const filteredPosts = posts.filter((p) => {
    const matchesCategory =
      activeCategory === 'All' ? true : p.category === activeCategory;
    const matchesSearch = searchQuery
      ? p.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authorName?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="feed-column">
      {/* 1. Stories Carousel */}
      <StoryReel
        stories={stories}
        user={user}
        onOpenCreateStory={onOpenCreateStory}
        onSelectStory={onSelectStory}
      />

      {/* 2. "What's on your mind?" Composer Box */}
      <CreatePostBox
        user={user}
        onOpenCreatePost={onOpenCreatePost}
        onOpenAIChat={onOpenAIChat}
      />

      {/* 3. Meta AI Daily Briefing Digest */}
      <AIBriefingCard
        briefing={briefing}
        loading={briefingLoading}
        onRefresh={onRefreshBriefing}
        onOpenAIChat={onOpenAIChat}
      />

      {/* Filter / Search Feedback Pill */}
      {(activeCategory !== 'All' || searchQuery) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            marginBottom: '16px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
          }}
        >
          <span>
            Showing results for:{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {activeCategory !== 'All' ? `[${activeCategory}]` : ''} {searchQuery ? `"${searchQuery}"` : ''}
            </strong>{' '}
            ({filteredPosts.length} posts found)
          </span>
        </div>
      )}

      {/* 4. Posts Stream */}
      {filteredPosts.length === 0 ? (
        <div
          className="fb-card"
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              color: 'var(--text-secondary)',
            }}
          >
            <FileText size={28} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '17px', color: 'var(--text-primary)', marginBottom: '4px' }}>
            No posts found
          </div>
          <div style={{ fontSize: '14px', maxWidth: '320px', margin: '0 auto 16px' }}>
            {searchQuery
              ? `No updates match "${searchQuery}". Try a different keyword.`
              : 'Be the first to share an update with your friends!'}
          </div>
          <button
            onClick={onOpenCreatePost}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--fb-blue)',
              color: '#ffffff',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Create post
          </button>
        </div>
      ) : (
        filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            user={user}
            onDeletePost={onDeletePost}
            onNavigateProfile={onNavigateProfile}
          />
        ))
      )}
    </main>
  );
};
