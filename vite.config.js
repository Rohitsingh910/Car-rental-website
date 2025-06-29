import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Car-rental-website/', // THIS IS VERY IMPORTANT
  plugins: [react()],
});
