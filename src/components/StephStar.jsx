import { useState, useCallback } from 'react'
import starImg from '../assets/steph/steph_star.PNG'
import glowImg from '../assets/steph/steph_glow.PNG'
import glowMoreImg from '../assets/steph/steph_glow_more.PNG'
import './StephStar.css'

function StephStar() {
  const [isHovered, setIsHovered] = useState(false)
  const [shootingStars, setShootingStars] = useState([])

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleClick = useCallback(() => {
    const count = Math.floor(Math.random() * 4) + 5
    const newStars = []

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 360
      const speed = Math.random() * 0.5 + 0.8
      const size = Math.random() * 8 + 4 
      const id = Date.now() + Math.random() + i

      newStars.push({ id, angle, speed, size })
    }

    setShootingStars(prev => [...prev, ...newStars])

    setTimeout(() => {
      setShootingStars(prev => prev.filter(star => !newStars.find(s => s.id === star.id)))
    }, 1500)
  }, [])

  return (
    <div
      className="steph-star rotating"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <img src={glowImg} alt="glow" className="steph-glow" />

      {isHovered && (
        <img src={glowMoreImg} alt="glow more" className="steph-glow-more" />
      )}

      <img src={starImg} alt="Steph Star" className="steph-star-img" />

      {shootingStars.map(star => (
        <span
          key={star.id}
          className="shooting-star"
          style={{
            '--angle': `${star.angle}deg`,
            '--speed': star.speed,
            '--size': `${star.size}px`,
          }}
        />
      ))}
    </div>
  )
}

export default StephStar
