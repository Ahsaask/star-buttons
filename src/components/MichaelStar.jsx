import { useState, useCallback } from 'react'
import starImg from '../assets/michael/michael_star.PNG'
import glowImg from '../assets/michael/michael_glow.PNG'
import ringImg from '../assets/michael/michael_ring.PNG'
import './MichaelStar.css'

const MATH_EQUATIONS = [
  'E=mc²',
  'π≈3.14',
  '∫f(x)dx',
  '∑n²',
  'Δx→0',
  'sin²+cos²=1',
  '√2',
  'x²+y²=r²',
  'F=ma',
  'a²+b²=c²',
  'lim x→∞',
  '∂f/∂x',
  'i²=-1',
  'e^(iπ)+1=0',
  'dx/dt',
]

function MichaelStar({ forceHover = false }) {
  const [isHovered, setIsHovered] = useState(false)
  const [equations, setEquations] = useState([])

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleClick = useCallback(() => {
    const randomEq = MATH_EQUATIONS[Math.floor(Math.random() * MATH_EQUATIONS.length)]
    const angle = Math.random() * 360
    const id = Date.now() + Math.random()

    const newEquation = {
      id,
      text: randomEq,
      angle,
    }

    setEquations(prev => [...prev, newEquation])

    setTimeout(() => {
      setEquations(prev => prev.filter(eq => eq.id !== id))
    }, 1500)
  }, [])

  const showGlow = equations.length > 0 || forceHover

  return (
    <div
      className="michael-star"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {showGlow && (
        <img src={glowImg} alt="glow" className={`michael-glow ${forceHover ? '' : 'glow-pulse'}`} />
      )}

      <img src={ringImg} alt="ring" className="michael-ring" />

      <img src={starImg} alt="Michael Star" className="michael-star-img" />

      {equations.map(eq => (
        <span
          key={eq.id}
          className="math-equation"
          style={{
            '--angle': `${eq.angle}deg`,
          }}
        >
          {eq.text}
        </span>
      ))}
    </div>
  )
}

export default MichaelStar
