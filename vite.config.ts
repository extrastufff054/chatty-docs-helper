
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Allow all origins, necessary for Serveo and other tunneling services
    cors: true,
    // Specifically handle Serveo domains
    hmr: {
      // Add this to support HMR over Serveo
      clientPort: 443,
      host: 'localhost'
    },
    // Add this to allow Serveo domains
    fs: {
      allow: ['.']
    },
    proxy: {},
    // Explicitly allow serveo.net domains
    strictPort: true,
    // This is the key setting needed to resolve the error
    allowedHosts: ['localhost', '.serveo.net']
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
