import { defineConfig } from 'vite';

export default defineConfig({
  base: '/morevna-JSFE2025Q3/',
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
