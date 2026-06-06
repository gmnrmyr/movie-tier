import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // não recarregar a página quando o app salva os dados / o autosave commita
      ignored: ['**/movie-tier.json', '**/.git/**'],
    },
  },
})
