import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
  // No client-side routing in this single-page game — disables Vite's SPA
  // fallback, so a missing asset (e.g. a not-yet-added sprite/sound under
  // public/assets/) returns a real 404 instead of index.html's HTML, which
  // would otherwise crash Phaser's audio decoder.
  appType: 'mpa',
  server: {
    host: true,
  },
});
