import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import EventsPage from './pages/EventsPage.jsx'
import PopularPage from './pages/PopularPage.jsx'
import SciencePage from './pages/SciencePage.jsx'
import ApiLayout from './components/ApiCp/ApiLayout.jsx'
import Dashboard from './pages/api/Dashboard.jsx'
import Tokens from './pages/api/Tokens.jsx'
import Usage from './pages/api/Usage.jsx'
import Wallet from './pages/api/Wallet.jsx'
import Models from './pages/api/Models.jsx'
import './App.css'
import './components/CardNav.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/popular" element={<PopularPage />} />
        <Route path="/science" element={<SciencePage />} />
        {/* EcoRem API 中转站控制台（锁深色 · 演示态 mock 数据） */}
        <Route path="/api" element={<ApiLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tokens" element={<Tokens />} />
          <Route path="usage" element={<Usage />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="models" element={<Models />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
