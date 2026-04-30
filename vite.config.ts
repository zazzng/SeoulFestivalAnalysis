import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/liveSpace-IAT334/',
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  css: {
    devSourcemap: true,
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
})
