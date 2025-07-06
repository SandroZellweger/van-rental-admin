import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Project root directory (where index.html is located)
  root: process.cwd(),
  // Disable public directory (no separate /public folder)
  publicDir: false,
  server: {
    // Open browser automatically
    open: true
  },
  build: {
    // Output directory for production build
    outDir: 'dist',
    rollupOptions: {
      // Multiple HTML entry points
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html')
      }
    }
  }
});
