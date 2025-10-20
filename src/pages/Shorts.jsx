import React, { useRef, useEffect } from 'react'

export default function Shorts() {
  const shorts = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    src: `/assets/video/video${(i % 5) + 1}.mp4`,
    title: `쇼츠 제목 ${i + 1}`,
    author: `크리에이터 ${i + 1}`,
  }))

  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const videos = Array.from(container.querySelectorAll('video'))

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            v.play().catch(() => {})
          } else {
            v.pause()
            v.currentTime = 0
          }
        })
      },
      { threshold: [0.6] }
    )

    videos.forEach((v) => obs.observe(v))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="shorts-page" ref={containerRef}>
      {shorts.map((s) => (
        <section className="short-item" key={s.id}>
          <video
            src={s.src}
            playsInline
            muted
            className="short-video"
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