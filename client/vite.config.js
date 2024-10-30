// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // other configurations...
  build: {
    rollupOptions: {
      external: ['@mizuwallet-sdk/core', '@telegram-apps/bridge']
    }
  }
});
