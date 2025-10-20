import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { videos } from '../data/videos'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('전체')

  const categories = [
    '전체',
    '음악',
    '게임',
    'Remix',
    '에너지있는 게임',
    '액션 어드벤쳐 게임',
    '최근에 업로드된 동영상',
    '감상한 동영상',
    '새로운 맞춤 동영상',
  ]

  return (
    <>
      <div className="category-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="video-grid">
        {videos.map((video) => (
          <Link
            to={`/video/${video.id}`}
            key={video.id}
            className="video-card"
          >
            <div className="thumb">
              <img src={video.thumbnail} alt={video.title} />
              <span className="duration">{video.duration}</span>
            </div>
            <div className="card-body">
              <img
                src={video.channelAvatar}
                alt={video.channel}
                className="channel-avatar"
              />
              <div className="card-info">
                <h3 className="card-title">{video.title}</h3>
                <div className="card-meta">
                  <div>{video.channel}</div>
                  <div>
                    {video.views} • {video.uploadTime}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
