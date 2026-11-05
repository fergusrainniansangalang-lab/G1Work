// @file    vite.config.js
// @folder  web/
// @about   Vite build configuration for Facebook Web client.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});
