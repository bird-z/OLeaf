import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SciencePage from './pages/SciencePage.jsx'
import EventsPage from './pages/EventsPage.jsx'
import PopularPage from './pages/PopularPage.jsx'
import ArticlePage from './pages/ArticlePage.jsx'
import './App.css'
import './components/CardNav.css'

/* 路由：主站单页 + 活动档案页族（Science/Events/Popular/Article）。
 * API 中转站为独立服务（localhost:3000），Nav 直链，不经本站路由。 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/science" element={<SciencePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/popular" element={<PopularPage />} />
        <Route path="/popular/:category/:title" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
