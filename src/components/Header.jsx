import React, { useState } from 'react'

export default function Header({ onMenuClick, onTitleClick }) {
  const [searchValue, setSearchValue] = useState('')

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-btn" onClick={onMenuClick} title="메뉴">
          ☰
        </button>
        <button className="site-title" onClick={onTitleClick}>
          <img 
            src="/assets/thumbnail/logo.png" 
            alt="TetoTube Logo" 
            style={{ height: '32px', width: 'auto' }}
          />
          <span>TetoTube</span>
        </button>
      </div>

      <div className="topbar-center">
        <input
          type="text"
          className="search-input"
          placeholder="검색"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="topbar-right">
        <button className="btn-icon" title="업로드">
          ⊕
        </button>
        <button className="btn-icon" title="알림">
          🔔
        </button>
        <button className="avatar" title="프로필">
          👤
        </button>
      </div>
    </header>
  )
}