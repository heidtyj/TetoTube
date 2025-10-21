import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { videos } from '../data/videos'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('전체')

  return (
    <>
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
