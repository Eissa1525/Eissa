import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // IV_BASE=./ builds a copy that can be hosted under any sub-path (used for the hosted preview)
  base: process.env.IV_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  server: { port: 5173, allowedHosts: true },
  preview: { port: 4173, allowedHosts: true },
  build: { chunkSizeWarningLimit: 1400 },
});
