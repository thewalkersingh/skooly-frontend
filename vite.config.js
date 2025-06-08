// https://vite.dev/config/
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": import.meta.env.VITE_API_BASE || "http://localhost:8080/api"
    }
  }
});