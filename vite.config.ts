
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Listen on all available network interfaces
    port: 8080,
    // Allow all origins for development
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    },
    // Add this to allow access from any host
    hmr: {
      clientPort: 443,
      host: 'localhost'
    },
    // Add this to allow all origins
    fs: {
      allow: ['.']
    },
    // Explicitly allow all hosts
    allowedHosts: 'all'
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
