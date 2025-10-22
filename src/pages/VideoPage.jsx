import React, { useRef, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { videos } from '../data/videos'

export default function VideoPage() {
  const { id } = useParams()
  const videoRef = useRef(null)
  const progressRef = useRef(null)

  const video = videos.find(v => v.id === parseInt(id))

  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.6)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      const v = videoRef.current
      if (!v) return

      if (e.code === 'Space') {
        e.preventDefault()
        v.paused ? v.play() : v.pause()
        setPaused(v.paused)
      }

      switch (e.key.toLowerCase()) {
        case 'm':
          e.preventDefault()
          v.muted = !v.muted
          setMuted(v.muted)
          break
        case 'f':
          e.preventDefault()
          if (!document.fullscreenElement) v.requestFullscreen?.()
          else document.exitFullscreen()
          break
        case 'arrowright': 
          e.preventDefault()
          v.currentTime = Math.min(v.currentTime + 5, v.duration)
          break
        case 'arrowleft':
          e.preventDefault()
          v.currentTime = Math.max(v.currentTime - 5, 0)
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const updateProgress = () => setProgress((v.currentTime / v.duration) * 100)
    v.addEventListener('timeupdate', updateProgress)
    return () => v.removeEventListener('timeupdate', updateProgress)
  }, [])

  if (!video)
    return <div style={{ padding: '24px', color: '#fff' }}>영상이 존재하지 않습니다.</div>

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play()
    else v.pause()
    setPaused(v.paused)
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const toggleFullscreen = () => {
    const v = videoRef.current
    if (!v) return
    if (!document.fullscreenElement) v.requestFullscreen?.()
    else document.exitFullscreen()
  }

  const onRateChange = (e) => {
    const rate = parseFloat(e.target.value)
    const v = videoRef.current
    if (!v) return
    v.playbackRate = rate
    setPlaybackRate(rate)
  }

  const onProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = percent * videoRef.current.duration
  }

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value)
    const v = videoRef.current
    if (!v) return
    v.volume = newVol
    setVolume(newVol)
    if (v.muted && newVol > 0) {
      v.muted = false
      setMuted(false)
    }
  }

  return (
    <div className="video-page-inner">
      <div className="video-player-wrap">
        <video
          ref={videoRef}
          src={video.videoSrc}
          autoPlay
          muted={muted}
          className="video-player"
          preload="metadata"
          controls={false}
          volume={volume}
        />

        <div
          ref={progressRef}
          className="progress-bar"
          onClick={onProgressClick}
        >
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>

        <div className="player-controls">
          <button onClick={togglePlay}>{paused ? '▶' : '⏸'}</button>

          <div
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button onClick={toggleMute}>{muted ? '🔇' : '🔊'}</button>

            {showVolumeSlider && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                style={{
                  marginLeft: '10px',
                  width: '100px',
                  height: '6px',
                  cursor: 'pointer',
                  accentColor: '#ff4d4d',
                  transition: 'opacity 0.2s ease',
                }}
              />
            )}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button onClick={toggleFullscreen}>⛶</button>
            <select value={playbackRate} onChange={onRateChange}>
              {[0.25, 0.5, 1, 1.25, 1.5, 2].map(rate => (
                <option key={rate} value={rate}>{rate}x</option>
              ))}
            </select>
          </div>
        </div>

        <div className="video-meta">
          <h1>{video.title}</h1>
          <p className="meta-sub">{video.channel}</p>
          <p className="meta-sub">
            {video.views} • {video.uploadTime}
          </p>
        </div>
      </div>
    </div>
  )
}
