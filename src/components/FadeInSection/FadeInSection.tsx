import { useEffect, useRef, useState } from 'react'
import './FadeInSection.scss'

interface Props {
  children: React.ReactNode
}

export default function FadeInSection({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasAppeared, setHasAppeared] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAppeared(true)
          observer.disconnect() // Para de observar depois do primeiro fade
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`fade-section ${hasAppeared ? 'visible' : ''}`}>
      {children}
    </div>
  )
}
