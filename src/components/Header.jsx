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
      <div className="topbar-right">
        <button className="avatar" title="프로필">
        <img 
          src="/assets/thumbnail/profile.png" 
          alt="프로필 사진" 
          style={{ height: '32px', width: '32px', borderRadius: '50%' }}
        />
</button>
      </div>
    </header>
  )
}