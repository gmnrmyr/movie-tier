import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,           // escuta em 0.0.0.0 (não só ::1) → alcançável pelo proxy do homelab
    allowedHosts: true,   // aceita requests vindas pelo IP/proxy (Vite bloqueia hosts desconhecidos por padrão)
    watch: {
      // não recarregar a página quando o app salva os dados / o autosave commita
      ignored: ['**/movie-tier.json', '**/.git/**'],
    },
  },
})
