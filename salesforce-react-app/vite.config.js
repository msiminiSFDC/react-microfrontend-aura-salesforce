import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Importante para Static Resource
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Fixar nomes para facilitar a referência no Aura
        entryFileNames: 'assets/main.js',
        assetFileNames: 'assets/style.css',
      },
    },
  },
});