import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const __dirname = import.meta.dirname

/* CMS 的 CORS 白名单只认 http://127.0.0.1:8000 与 https://www.bioqif.com，
 * 而本地 dev 跑在 localhost:5173 → 浏览器直接拦下 public-articles，
 * 首页轮播整节卸载。开发/预览改为同源代理转发，生产仍由 payload.js 直连 CMS。 */
const cmsProxy = {
  '/api': { target: 'https://cms.bioqif.com', changeOrigin: true },
}

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
  server: { proxy: cmsProxy },
  preview: { proxy: cmsProxy },
})
