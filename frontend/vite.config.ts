import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Allow Google Sign-In popup to work without COOP blocking
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase inline limit to avoid extra small file requests
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Fine-grained chunk splitting for better parallel loading & caching
        manualChunks: (id) => {
          // Core React runtime — tiny, always needed
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          // React-router — loaded once, rarely changes
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          // Firebase — large, but heavily cached between versions
          if (id.includes('node_modules/firebase/')) {
            return 'firebase';
          }
          // Tanstack query — small, always needed
          if (id.includes('node_modules/@tanstack/')) {
            return 'query';
          }
          // UI primitives — Radix, lucide, clsx
          if (
            id.includes('node_modules/@radix-ui/') ||
            id.includes('node_modules/lucide-react') ||
            id.includes('node_modules/clsx') ||
            id.includes('node_modules/tailwind-merge') ||
            id.includes('node_modules/class-variance-authority')
          ) {
            return 'ui';
          }
          // Charts — loaded only on analytics/dashboard page
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) {
            return 'charts';
          }
          // Everything else in node_modules → vendor chunk
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
}));
