import { useState } from 'react'
import starImg from '../assets/ahsaas/ahsaas_starv2.PNG'
import glowV1 from '../assets/ahsaas/ahsaas_glow_v1.png'
import glowV2 from '../assets/ahsaas/ahsaasglowv2.PNG'
import './AhsaasStar.css'

function AhsaasStar({ forceHover = false }) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const showExtraGlow = isHovered || forceHover

  return (
    <div
      className="ahsaas-star"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={glowV1} alt="glow" className="ahsaas-glow glow-v1" />

      {showExtraGlow && (
        <img src={glowV2} alt="glow" className="ahsaas-glow glow-v2" />
      )}

      <img src={starImg} alt="Ahsaas Star" className="ahsaas-star-img" />
    </div>
  )
}

export default AhsaasStar
