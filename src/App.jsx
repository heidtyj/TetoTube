import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import VideoPage from './pages/VideoPage'
import Shorts from './pages/Shorts'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  return (
    <div className="app-root">
      <Header
        onMenuClick={() => setSidebarOpen((s) => !s)}
        onTitleClick={() => navigate('/')}
      />
      <div className="app-body">
        <Sidebar open={sidebarOpen} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video/:id" element={<VideoPage />} />
            <Route path="/shorts" element={<Shorts />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}