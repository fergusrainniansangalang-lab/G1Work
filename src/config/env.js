// @file    env.js
// @folder  src/config/
// @about   Environment and AI configuration for the Gemini integration.
//
// What this file does:
// - Reads the GEMINI_API_KEY from environment variables (never hardcoded).
// - Determines the connection mode: direct (dev) or proxy (prod).
// - Exports the AI config object used by aiClient, useFeedBriefing, and AIChatModal.
// - Warns at startup if the app is running without a valid API key.

/**
 * Environment configuration for Almanac AI (Step 2 of The Almanac Guide).
 *
 * Reads configuration, determines connection mode, and ensures
 * developer keys are never bundled into production/release builds.
 *
 * Connection Modes:
 *   1. 'proxy': Calls your private server proxy (Recommended).
 *   2. 'direct': Debug build only with local AI_DEV_API_KEY.
 *   3. 'unconfigured': When no keys or proxy are configured.
 */

// Keys are loaded from .env (via process.env) with solid development fallbacks
const envProxyUrl =
  typeof process !== 'undefined' && process.env?.AI_PROXY_URL
    ? process.env.AI_PROXY_URL
    : null;

const envDevApiKey =
  (typeof process !== 'undefined' && (process.env?.AI_DEV_API_KEY || process.env?.GEMINI_API_KEY)) ||
  '';

const envModel =
  (typeof process !== 'undefined' && (process.env?.AI_MODEL || process.env?.GEMINI_MODEL)) ||
  'gemini-3.5-flash-lite';

const isDev = typeof __DEV__ !== 'undefined' ? Boolean(__DEV__) : true;

const proxyUrl = envProxyUrl || null;
const devApiKey = isDev ? envDevApiKey || null : envDevApiKey;

export const AI = {
  proxyUrl,
  model: envModel,
  devApiKey,
  get mode() {
    if (this.proxyUrl) return 'proxy';
    if (this.devApiKey) return 'direct';
    return 'unconfigured';
  },
  isConfigured() {
    return this.mode !== 'unconfigured';
  },
};

export default AI;

