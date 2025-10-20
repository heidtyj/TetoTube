import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar({ open }) {
  const mainMenu = [
    { icon: '🏠', label: '홈', path: '/' },
    { icon: '🎬', label: 'Shorts', path: '/shorts' },
  ]

  const subMenu = [
    { label: '내 페이지' },
    { label: '기록' },
    { label: '재생목록' },
    { label: '내 동영상' },
    { label: '나중에 볼 동영상' },
  ]

  return (
    <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
      {open ? (
        <>
          <nav className="nav-list">
            {mainMenu.map((item, i) => (
              <Link key={i} to={item.path} className="nav-item">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}

            <div className="nav-divider" />

            {subMenu.map((item, i) => (
              <div key={i} className="nav-item">
                <span>{item.label}</span>
              </div>
            ))}
          </nav>
        </>
      ) : (
        <div className="nav-icons">
          <Link to="/" className="nav-icon" title="홈">
            🏠
          </Link>
          <Link to="/shorts" className="nav-icon" title="Shorts">
            🎬
          </Link>
        </div>
      )}
    </aside>
  )
}