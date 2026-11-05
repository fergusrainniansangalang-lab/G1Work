// @file    imageUtils.js
// @folder  web/src/utils/
// @about   Safe image URL resolver with fallback defaults and broken image guards.

export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
export const DEFAULT_COVER = 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200';

/**
 * Returns a valid web-loadable image URL or fallback.
 * Automatically filters out local mobile file paths (e.g. file:///data/user/0/...)
 * which browsers cannot load on the desktop web app.
 */
export const getSafeImageUrl = (url, fallback = DEFAULT_AVATAR) => {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (
    trimmed.startsWith('file://') ||
    trimmed.startsWith('/data/user/') ||
    trimmed.startsWith('content://') ||
    trimmed.startsWith('blob:http://localhost') === false && trimmed.startsWith('blob:') === false &&
    trimmed.startsWith('http://') === false &&
    trimmed.startsWith('https://') === false &&
    trimmed.startsWith('data:image/') === false
  ) {
    return fallback;
  }
  return trimmed;
};

/**
 * Fallback error handler for <img> tags so broken links never show ugly broken image icons.
 */
export const handleImageError = (e, fallback = DEFAULT_AVATAR) => {
  if (e?.currentTarget && e.currentTarget.src !== fallback) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback;
  }
};

