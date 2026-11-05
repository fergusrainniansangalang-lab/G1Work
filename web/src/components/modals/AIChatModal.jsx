// @file    AIChatModal.jsx
// @folder  web/src/components/modals/
// @about   Floating Meta AI Messenger chat assistant with feed-aware intelligence and quick prompt chips.

import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, Trash2 } from 'lucide-react';
import { sendAIChatMessage } from '../../services/aiService';

export const AIChatModal = ({ isOpen, onClose, posts }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hi! I’m Meta AI. How can I help you today? I can summarize your community feed, help you draft updates, brainstorm ideas, or answer questions!',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      time: 'Just now',
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await sendAIChatMessage(newMessages, posts);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: reply,
          time: 'Just now',
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I ran into an issue connecting to the AI model. Please verify your connection or API key.',
          time: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Chat cleared! What would you like to talk about next?',
        time: 'Just now',
      },
    ]);
  };

  const suggestions = [
    '✨ Summarize today’s feed',
    '📋 What tasks are pending?',
    '💡 Help me draft a work update',
    '🌟 Suggest ideas for my next post',
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '24px',
        width: '380px',
        height: '560px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1200,
        overflow: 'hidden',
        animation: 'popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #1877F2 0%, #8B5CF6 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>Meta AI</div>
            <div style={{ fontSize: '11px', opacity: 0.9 }}>Connected with your feed</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={clearChat}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }}
            title="Clear chat"
            aria-label="Clear chat"
          >
            <Trash2 size={15} style={{ pointerEvents: 'none' }} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.45)';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Close Meta AI (Esc)"
            aria-label="Close Meta AI"
          >
            <X size={18} style={{ pointerEvents: 'none', strokeWidth: 2.5 }} />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  backgroundColor: isUser ? 'var(--fb-blue)' : 'var(--bg-secondary)',
                  color: isUser ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '14px',
                  lineHeight: 1.4,
                  boxShadow: 'var(--shadow-sm)',
                  border: isUser ? 'none' : '1px solid var(--border-color)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.content}
              </div>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--text-secondary)',
                  marginTop: '2px',
                  padding: '0 4px',
                }}
              >
                {m.time}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            <Sparkles size={16} className="animate-spin" color="var(--fb-blue)" />
            <span>Meta AI is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div
        style={{
          padding: '8px 12px',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
        }}
      >
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s.replace(/^[^\w]+/, ''))}
            style={{
              padding: '4px 10px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-hover)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 500,
              border: '1px solid var(--border-color)',
              flexShrink: 0,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Tray */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          padding: '10px 12px',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <input
          type="text"
          placeholder="Ask Meta AI anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: input.trim() ? 'var(--fb-blue)' : 'var(--bg-tertiary)',
            color: input.trim() ? '#ffffff' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default',
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
