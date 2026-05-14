import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — cargado primero
          'vendor-react': ['react', 'react-dom', 'react-router'],
          // Firebase — chunk separado
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          // Leaflet — chunk separado (pesado, solo se carga en /map)
          'vendor-leaflet': ['leaflet', 'react-leaflet'],
          // UI components
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-tabs', 'sonner', 'lucide-react'],
          // Charts y extras
          'vendor-charts': ['recharts'],
        },
      },
    },
    // Aumentar el límite de warning a 600kb
    chunkSizeWarningLimit: 600,
  },
})
