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

  // 키보드 단축키
  useEffect(() => {
    const onKey = (e) => {
      const v = videoRef.current
      if (!v) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          e.stopPropagation()
          if (v.paused) v.play()
          else v.pause()
          setPaused(v.paused)
          break
        default:
          break
      }

      switch (e.key.toLowerCase()) {
        case 'm':
          e.preventDefault()
          e.stopPropagation()
          v.muted = !v.muted
          setMuted(v.muted)
          break
        case 'f':
          e.preventDefault()
          e.stopPropagation()
          if (!document.fullscreenElement) v.requestFullscreen?.()
          else document.exitFullscreen()
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // 진행도 업데이트
  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const updateProgress = () => {
      setProgress((v.currentTime / v.duration) * 100)
    }

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
          controls={false}  // 기본 브라우저 UI 제거
        />

        {/* 진행도바 */}
        <div
          ref={progressRef}
          className="progress-bar"
          onClick={onProgressClick}
        >
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>

        <div className="player-controls">
          {/* 왼쪽: 재생/음소거 */}
          <button onClick={togglePlay}>{paused ? '▶' : '⏸'}</button>
          <button onClick={toggleMute}>{muted ? '🔇' : '🔊'}</button>

          {/* 오른쪽: 전체화면 / 설정 */}
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
