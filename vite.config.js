import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const __dirname = import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 项目页挂在 /OLeaf/ 子路径，资源必须带此前缀
  base: '/OLeaf/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
