import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import QifFocusLoader from './components/QifFocusLoader.jsx'
import Home from './pages/Home.jsx'
import SciencePage from './pages/SciencePage.jsx'
import EventsPage from './pages/EventsPage.jsx'
import PopularPage from './pages/PopularPage.jsx'
import ArticlePage from './pages/ArticlePage.jsx'
import NewsDetailPage from './pages/NewsDetailPage.jsx'
import './components/CardNav.css'

/* 字体样张（dev-only）：全站字体规划 V1–V10 的验证载体。
 * import.meta.env.DEV 为 false 时整段被 Vite 静态消除，生产构建不含该 chunk；
 * 样张页自身用动态 import，也无导航入口。见 docs/fonts.md。 */
const FontSpecimen = import.meta.env.DEV ? lazy(() => import('./pages/FontSpecimen.jsx')) : null

/* 路由：主站单页 + 活动档案页族（Science/Events/Popular/Article）。
 * API 中转站为独立服务（localhost:3000），Nav 直链，不经本站路由。
 * HashRouter：GitHub Pages 无 SPA history 回退，/#/path 规避刷新 404。 */
function App() {
  return (
    <HashRouter>
      {/* 冷启动对焦加载屏：挂在路由层，每次打开/刷新全站生效，路由内切换不重播 */}
      <QifFocusLoader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/science" element={<SciencePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/popular" element={<PopularPage />} />
        <Route path="/popular/:category/:title" element={<ArticlePage />} />
        {/* CMS 新闻详情：QifSlideCard / NewsCarousel 的链接落点（文章 id 或 slug） */}
        <Route path="/news/:id" element={<NewsDetailPage />} />
        {import.meta.env.DEV && (
          <Route
            path="/specimen"
            element={
              <Suspense fallback={null}>
                <FontSpecimen />
              </Suspense>
            }
          />
        )}
      </Routes>
    </HashRouter>
  )
}

export default App
