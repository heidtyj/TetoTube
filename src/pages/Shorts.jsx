import React, { useRef, useEffect, useState } from 'react'
import { shorts } from '../data/shorts_vid'

export default function Shorts() {
  const containerRef = useRef(null)
  const [shuffled, setShuffled] = useState([])
  const [playedIds, setPlayedIds] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // 셔플
  useEffect(() => setShuffled(shuffleArray(shorts)), [])

  const shuffleArray = (arr) => {
    const copy = [...arr]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  }

  // 관찰자 설정: 현재 화면에 보이는 쇼츠만 재생
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const videos = Array.from(container.querySelectorAll('video.short-video'))
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target
          const idx = parseInt(v.dataset.index)

          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            // 화면 안에 충분히 들어온 경우 → 재생 & 소리 켬
            v.muted = false
            v.play().catch(() => {})
            setCurrentIndex(idx)
            setPlayedIds((prev) => (prev.includes(idx) ? prev : [...prev, idx]))
          } else {
            // 화면 밖으로 나간 경우 → 정지 & 음소거
            v.pause()
            v.muted = true
          }
        })
      },
      { threshold: [0.6] }
    )

    videos.forEach((v) => obs.observe(v))
    return () => obs.disconnect()
  }, [shuffled])

  // 키보드 컨트롤 (↑↓, Space)
  useEffect(() => {
    const onKey = (e) => {
      const container = containerRef.current
      if (!container) return

      const currentVideo = container.querySelector(
        `video[data-index="${currentIndex}"]`
      )

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          scrollToIndex(currentIndex + 1)
          break
        case 'ArrowUp':
          e.preventDefault()
          scrollToIndex(currentIndex - 1)
          break
        case ' ':
        case 'Spacebar':
          e.preventDefault()
          if (currentVideo) {
            if (currentVideo.paused) currentVideo.play()
            else currentVideo.pause()
          }
          break
        default:
          break
      }
    }

    const scrollToIndex = (idx) => {
      const container = containerRef.current
      if (!container) return
      const total = shuffled.length
      const nextIndex = (idx + total) % total
      const target = container.children[nextIndex]
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentIndex, shuffled])

  return (
    <div className="shorts-page" ref={containerRef}>
      {shuffled.map((s, i) => (
        <section className="short-item" key={s.id}>
          <video
            data-index={i}
            className="short-video"
            src={s.src}
            playsInline
            autoPlay
            muted
            loop
            preload="auto"
          />
          <div className="short-overlay">
            <div className="short-info">
              <h3>{s.title}</h3>
              <p>{s.author}</p>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
