import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
    rolldownOptions: {
      output: {
        // three + R3F في حزمة منفصلة تُحمَّل فقط مع المشاهد ثلاثية الأبعاد
        advancedChunks: {
          groups: [
            { name: 'gsap', test: /node_modules[\\/](gsap|@gsap|lenis)/ },
          ],
        },
      },
    },
  },
})
