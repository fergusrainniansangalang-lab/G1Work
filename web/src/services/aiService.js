// @file    aiService.js
// @folder  web/src/services/
// @about   Gemini AI integration for Facebook Web (Feed Digest, Post Polish, Chat).

const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.VITE_AI_DEV_API_KEY ||
  '';

const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.5-flash-lite';
const PROXY_URL = import.meta.env.VITE_AI_PROXY_URL || '';

export const generateFeedBriefing = async (posts) => {
  if (!posts || posts.length === 0) {
    return 'Your feed is currently quiet. Share an update to get your community talking!';
  }

  const postsSummary = posts
    .slice(0, 10)
    .map(
      (p, i) =>
        `${i + 1}. [${p.category || 'General'}] by ${p.authorName || 'Someone'}: "${p.content || ''}" (${p.completed ? 'Done' : 'In Progress'}, ${Object.values(p.reactions || {}).reduce((a, b) => a + b, 0)} reactions)`
    )
    .join('\n');

  const prompt = `You are Meta AI assistant inside a Facebook-style app.
Write a friendly, concise 2-3 sentence daily briefing summarizing the recent community activity below. Highlight key themes, accomplishments, or active discussions. Use 1-2 relevant emojis.

Recent Posts:
${postsSummary}`;

  return await callGemini(prompt);
};

export const polishPostContent = async (rawText) => {
  if (!rawText.trim()) return rawText;

  const prompt = `You are a social media writing assistant. Polish this user post to make it more engaging, clear, and well-written while preserving their authentic voice and intent. Add 1-2 fitting emojis if appropriate. Return ONLY the polished text, with no explanations or quotes.

Original:
"${rawText}"`;

  return await callGemini(prompt);
};

export const sendAIChatMessage = async (messages, posts) => {
  const feedContext = posts && posts.length > 0
    ? `\n\n<FEED_DATA>\n${posts.slice(0, 8).map(p => `- ${p.authorName}: "${p.content}"`).join('\n')}\n</FEED_DATA>`
    : '';

  const systemInstruction = `You are Meta AI, an intelligent, helpful, and friendly conversational assistant built directly into Facebook. You help users navigate their feed, draft posts, answer questions, brainstorm ideas, and stay productive. Be concise, polite, and use clear formatting.${feedContext}`;

  const lastUserMsg = messages[messages.length - 1]?.content || '';
  const historyText = messages
    .slice(0, -1)
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const fullPrompt = `${systemInstruction}\n\n${historyText ? `Conversation History:\n${historyText}\n\n` : ''}User: ${lastUserMsg}\nAssistant:`;

  return await callGemini(fullPrompt);
};

const callGemini = async (prompt) => {
  if (PROXY_URL) {
    try {
      const res = await fetch(`${PROXY_URL}/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.text || data.response || 'No response received.';
      }
    } catch (err) {
      console.warn('Proxy request failed, falling back to direct API:', err);
    }
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || 'No response generated.';
};
