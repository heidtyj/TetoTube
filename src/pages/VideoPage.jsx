import React, { useRef, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { videos } from '../data/videos'

export default function VideoPage() {
  const { id } = useParams()
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const ratePanelRef = useRef(null)
  const currentRateRef = useRef(1)

  const [showUI, setShowUI] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const video = videos.find((v) => v.id === parseInt(id))
  if (!video)
    return (
      <div style={{ padding: '24px', color: '#fff' }}>
        영상이 존재하지 않습니다.
      </div>
    )

  const rates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]

  const toggleRatePanel = () => {
    if (ratePanelRef.current) {
      ratePanelRef.current.style.display =
        ratePanelRef.current.style.display === 'flex' ? 'none' : 'flex'
    }
  }

  const setRate = (r) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = r
      currentRateRef.current = r
      if (ratePanelRef.current) {
        Array.from(ratePanelRef.current.children).forEach((btn) => {
          btn.style.background = parseFloat(btn.dataset.rate) === r ? '#fff' : '#202020'
          btn.style.color = parseFloat(btn.dataset.rate) === r ? '#000' : '#fff'
        })
      }
    }
  }

  const togglePlay = () => {
    if (videoRef.current.paused) videoRef.current.play()
    else videoRef.current.pause()
  }

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  const handleTimeUpdate = () => {
    if (!isDragging && videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)
    }
  }

  const handleSeek = (e) => {
    if (!videoRef.current || !containerRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * videoRef.current.duration
    videoRef.current.currentTime = newTime
    setProgress((newTime / videoRef.current.duration) * 100)
  }

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    el.play().catch(() => {}) // 자동 재생

    const onKey = (e) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'KeyM':
          toggleMute()
          break
        case 'KeyF':
          toggleFullscreen()
          break
        case 'Escape':
          if (document.fullscreenElement) document.exitFullscreen?.()
          break
        default:
          break
      }
    }

    el.addEventListener('timeupdate', handleTimeUpdate)
    window.addEventListener('keydown', onKey)
    return () => {
      el.removeEventListener('timeupdate', handleTimeUpdate)
      window.removeEventListener('keydown', onKey)
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className="video-page-inner"
      style={{ position: 'relative', width: '100%', maxWidth: '960px' }}
      onMouseEnter={() => setShowUI(true)}
      onMouseLeave={() => setShowUI(false)}
    >
      <video
        ref={videoRef}
        src={video.videoSrc}
        className="video-player"
        preload="metadata"
        style={{ width: '100%', borderRadius: '8px', background: '#000' }}
      />

      {showUI && (
        <div
          className="video-controls"
          style={{
            position: 'absolute',
            bottom: '10px',
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '0 12px',
            pointerEvents: 'auto',
          }}
        >
          {/* 진행도 바 */}
          <div
            className="progress-container"
            style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
            onClick={handleSeek}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
          >
            <div
              className="progress-filled"
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#fff',
                borderRadius: '3px',
              }}
            />
          </div>

          {/* 버튼 행 */}
          <div
            className="button-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* 왼쪽: 재생, 소리 */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={togglePlay} style={controlBtnStyle}>
                {videoRef.current?.paused ? '▶' : '❚❚'}
              </button>
              <button onClick={toggleMute} style={controlBtnStyle}>
                {videoRef.current?.muted ? '🔇' : '🔊'}
              </button>
            </div>

            {/* 오른쪽: 전체화면, 설정 */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={toggleFullscreen} style={controlBtnStyle}>
                ⛶
              </button>
              <button onClick={toggleRatePanel} style={controlBtnStyle}>
                ⚙
              </button>
            </div>
          </div>

          {/* 배속 패널 */}
          <div
            ref={ratePanelRef}
            style={{
              display: 'none',
              gap: '4px',
              flexWrap: 'wrap',
            }}
          >
            {rates.map((r) => (
              <button
                key={r}
                data-rate={r}
                onClick={() => setRate(r)}
                style={{
                  background: r === currentRateRef.current ? '#fff' : '#202020',
                  color: r === currentRateRef.current ? '#000' : '#fff',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '12px',
                }}
              >
                {r}x
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 영상 메타 */}
      <div className="video-meta" style={{ marginTop: '16px', color: '#fff' }}>
        <h1 style={{ margin: 0 }}>{video.title}</h1>
        <p className="meta-sub">{video.channel}</p>
        <p className="meta-sub">
          {video.views} • {video.uploadTime}
        </p>
      </div>
    </div>
  )
}

const controlBtnStyle = {
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  borderRadius: '4px',
  padding: '4px 8px',
  fontSize: '14px',
  border: 'none',
  cursor: 'pointer',
}
