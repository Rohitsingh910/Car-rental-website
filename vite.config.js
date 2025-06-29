import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace 'your-repo-name' with your actual repo name
export default defineConfig({
  base: '/Car-rental-website-main/', // Important for GitHub Pages
  plugins: [react()],
});
