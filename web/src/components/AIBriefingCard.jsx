// @file    AIBriefingCard.jsx
// @folder  web/src/components/
// @about   Collapsible Meta AI Feed Digest card summarizing recent activity in the community.

import React, { useState } from 'react';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

export const AIBriefingCard = ({ briefing, loading, onRefresh, onOpenAIChat }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="fb-card"
      style={{
        background: 'linear-gradient(135deg, rgba(24, 119, 242, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
        border: '1px solid rgba(24, 119, 242, 0.25)',
        padding: '14px 16px',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--fb-blue)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(24, 119, 242, 0.3)',
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
              Meta AI Feed Digest
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Live summary of community updates
            </div>
          </div>
        </div>

        {/* Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            title="Refresh briefing"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
            }}
            title={collapsed ? 'Expand briefing' : 'Collapse briefing'}
          >
            {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {/* Body Content */}
      {!collapsed && (
        <div style={{ marginTop: '12px' }}>
          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.5,
              color: 'var(--text-primary)',
              whiteSpace: 'pre-line',
            }}
          >
            {loading ? 'Consulting Meta AI for your community update...' : briefing}
          </p>

          <div
            style={{
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            <button
              onClick={onOpenAIChat}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--fb-blue)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <MessageSquare size={14} />
              <span>Ask about these posts</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
