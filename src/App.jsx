import { useState, useRef, useCallback, useEffect } from 'react'
import AhsaasStar from './components/AhsaasStar'
import StephStar from './components/StephStar'
import MichaelStar from './components/MichaelStar'
import './App.css'
import ahsaasStephImg from './assets/ahsaas-setph/IMG_1283.PNG'
import stephMichaelImg from './assets/steph-michael/IMG_1279.PNG'
import michaelAhsaasImg from './assets/michael-ahsaas/IMG_1281.PNG'
import allStarImg from './assets/all-star/IMG_1286.PNG'
import fireAmbience from './assets/sounds/fire.mp3'
import airAmbience from './assets/sounds/air.mp3'
import waterAmbience from './assets/sounds/water.mp3'
import blingSound from './assets/sounds/bling.mp3'
import chimeSound from './assets/sounds/chime.mp3'

const RELATIONSHIP_IMAGES = {
  'ahsaas-steph': ahsaasStephImg,
  'steph-ahsaas': ahsaasStephImg,
  'steph-michael': stephMichaelImg,
  'michael-steph': stephMichaelImg,
  'michael-ahsaas': michaelAhsaasImg,
  'ahsaas-michael': michaelAhsaasImg,
  'all': allStarImg,
}

const CONSTELLATION_MESSAGES = {
  'ahsaas-steph': {
    title: 'Fire',
    person1: 'Ahsaas brings calm depth and emotional grounding. His steady presence anchors those around him with quiet strength.',
    person2: 'Steph radiates vibrant energy and enthusiasm. Her brightness draws people in and sparks momentum in any space.',
    union: 'Together they create Fire - Steph\'s spark ignited but steadied by Ahsaas\'s calm, burning bright without burning out.',
  },
  'steph-ahsaas': {
    title: 'Fire',
    person1: 'Steph radiates vibrant energy and enthusiasm. Her brightness draws people in and sparks momentum in any space.',
    person2: 'Ahsaas brings calm depth and emotional grounding. His steady presence anchors those around him with quiet strength.',
    union: 'Together they create Fire - Steph\'s spark ignited but steadied by Ahsaas\'s calm, burning bright without burning out.',
  },
  'steph-michael': {
    title: 'Air',
    person1: 'Steph moves with constant energy and social warmth. She fills spaces with motion and brings lightness to interactions.',
    person2: 'Michael thinks with quiet precision and logic. His measured approach brings clarity and thoughtful consideration.',
    union: 'Together they create Air - flowing between Steph\'s movement and Michael\'s thought, carrying ideas with gentle force.',
  },
  'michael-steph': {
    title: 'Air',
    person1: 'Michael thinks with quiet precision and logic. His measured approach brings clarity and thoughtful consideration.',
    person2: 'Steph moves with constant energy and social warmth. She fills spaces with motion and brings lightness to interactions.',
    union: 'Together they create Air - flowing between Steph\'s movement and Michael\'s thought, carrying ideas with gentle force.',
  },
  'michael-ahsaas': {
    title: 'Water',
    person1: 'Michael approaches with analytical calm and logic. He processes deeply before speaking, valuing precision over speed.',
    person2: 'Ahsaas holds emotional intelligence and patience. He understands feelings intuitively and creates safe spaces.',
    union: 'Together they create Water - shared calm flowing with depth and ease, understanding without needing many words.',
  },
  'ahsaas-michael': {
    title: 'Water',
    person1: 'Ahsaas holds emotional intelligence and patience. He understands feelings intuitively and creates safe spaces.',
    person2: 'Michael approaches with analytical calm and logic. He processes deeply before speaking, valuing precision over speed.',
    union: 'Together they create Water - shared calm flowing with depth and ease, understanding without needing many words.',
  },
  'all': {
    title: 'Earth',
    person1: 'Ahsaas grounds with emotional depth. Steph energizes with vibrant warmth. Michael anchors with quiet logic.',
    person2: 'Three distinct forces: stillness, motion, and thought. Each essential, each incomplete without the others.',
    union: 'United they form Earth - complete and whole. Fire, Air, and Water merge into something solid and enduring.',
  },
}


// Colors for liquid ball based on constellation
const CONSTELLATION_COLORS = {
  'ahsaas-steph': { primary: '#c0392b', secondary: '#e74c3c', glow: 'rgba(192, 57, 43, 0.6)' }, // Red
  'steph-ahsaas': { primary: '#c0392b', secondary: '#e74c3c', glow: 'rgba(192, 57, 43, 0.6)' },
  'steph-michael': { primary: '#5dade2', secondary: '#85c1e9', glow: 'rgba(93, 173, 226, 0.6)' }, // Sky light blue
  'michael-steph': { primary: '#5dade2', secondary: '#85c1e9', glow: 'rgba(93, 173, 226, 0.6)' },
  'michael-ahsaas': { primary: '#a569bd', secondary: '#bb8fce', glow: 'rgba(165, 105, 189, 0.6)' }, // Sky purple
  'ahsaas-michael': { primary: '#a569bd', secondary: '#bb8fce', glow: 'rgba(165, 105, 189, 0.6)' },
  'all': { primary: '#8e44ad', secondary: '#9b59b6', glow: 'rgba(142, 68, 173, 0.6)' }, // Purple
}

// Line colors for connections
const LINE_COLORS = {
  'steph-michael': '#87CEEB', // Sky light blue
  'michael-steph': '#87CEEB',
  'michael-ahsaas': '#B19CD9', // Sky purple
  'ahsaas-michael': '#B19CD9',
  'ahsaas-steph': 'rgba(255, 255, 255, 0.6)', // Default white
  'steph-ahsaas': 'rgba(255, 255, 255, 0.6)',
}

// sounds that will play during the constellations
const AMBIENT_SOUNDS = {
  'ahsaas-steph': fireAmbience,
  'steph-ahsaas': fireAmbience,

  'steph-michael': airAmbience,
  'michael-steph': airAmbience,

  'michael-ahsaas': waterAmbience,
  'ahsaas-michael': waterAmbience,
}


const DEFAULT_POSITIONS = {
  ahsaas: { top: 25, left: 50 },
  steph: { top: 70, left: 25 },
  michael: { top: 70, left: 75 },
}

function App() {
  const [connections, setConnections] = useState([])
  const [dragging, setDragging] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [merging, setMerging] = useState(null) // { stars: ['star1', 'star2'], progress: 0 }
  const [constellation, setConstellation] = useState(null) // { key: 'ahsaas-steph', x, y, phase: 'forming'|'visible'|'fading' }
  const [animatedPositions, setAnimatedPositions] = useState({
    ahsaas: { top: 25, left: 50 },
    steph: { top: 70, left: 25 },
    michael: { top: 70, left: 75 },
  })

  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const starRefs = {
    ahsaas: useRef(null),
    steph: useRef(null),
    michael: useRef(null),
  }

  // Get center position of a star using default positions (for SVG lines)
  const getStarCenterFromPosition = useCallback((starName) => {
    const pos = animatedPositions[starName]
    const canvas = canvasRef.current
    if (!canvas) return null
    return {
      x: (pos.left / 100) * canvas.clientWidth,
      y: (pos.top / 100) * canvas.clientHeight,
    }
  }, [animatedPositions])

  // Play click sound for stars
  const playClickSound = useCallback((starName) => {
    let sound = null
    if (starName === 'steph') {
      sound = new Audio(blingSound)
      sound.volume = 0.15
    } else if (starName === 'michael') {
      sound = new Audio(chimeSound)
      sound.volume = 0.2
    }
    if (sound) {
      sound.play().catch(() => {})
    }
  }, [])

  // Start dragging from a star
  const handleDragStart = useCallback((starName, e) => {
    if (merging || constellation) return
    e.preventDefault()
    playClickSound(starName)
    const center = getStarCenterFromPosition(starName)
    if (center) {
      setDragging({ from: starName, startX: center.x, startY: center.y })
      setMousePos({ x: center.x, y: center.y })
    }
  }, [getStarCenterFromPosition, merging, constellation, playClickSound])

  // Handle mouse move while dragging
  const handleMouseMove = useCallback((e) => {
    if (dragging) {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
  }, [dragging])

  // Handle mouse up - check if over another star
  const handleMouseUp = useCallback((e) => {
    if (!dragging) return

    const stars = ['ahsaas', 'steph', 'michael']
    for (const starName of stars) {
      if (starName === dragging.from) continue

      const center = getStarCenterFromPosition(starName)
      if (!center) continue

      const distance = Math.sqrt(
        Math.pow(e.clientX - center.x, 2) + Math.pow(e.clientY - center.y, 2)
      )

      if (distance < 80) {
        const connectionKey = [dragging.from, starName].sort().join('-')
        setConnections(prev => {
          const exists = prev.some(c => [c.from, c.to].sort().join('-') === connectionKey)
          if (exists) return prev
          return [...prev, { from: dragging.from, to: starName }]
        })
        break
      }
    }

    setDragging(null)
  }, [dragging, getStarCenterFromPosition])

  // Clear all connections
  const clearConnections = () => {
    stopAmbience()
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setConnections([])
    setMerging(null)
    setConstellation(null)
    setAnimatedPositions({ ...DEFAULT_POSITIONS })
  }

  // Handle merge button click
  const handleMerge = (stars) => {
    const star1 = stars[0]
    const star2 = stars[1]

    // Calculate midpoint
    const pos1 = DEFAULT_POSITIONS[star1]
    const pos2 = DEFAULT_POSITIONS[star2]
    const midTop = (pos1.top + pos2.top) / 2
    const midLeft = (pos1.left + pos2.left) / 2

    setMerging({ stars, progress: 0, phase: 'moving' })

    let progress = 0
    const animate = () => {
      progress += 0.012 // Smooth animation speed

      if (progress >= 1) {
        // Stars have collided - hide stars, show liquid ball
        const key = `${star1}-${star2}`

        // Use percentage-based positioning so it stays correct when canvas shifts
        const collisionLeft = midLeft
        const collisionTop = midTop

        // Phase 1: Stars disappear, liquid ball appears
        setMerging({ stars, progress: 1, phase: 'collided' })
        setConstellation({ key, left: collisionLeft, top: collisionTop, phase: 'liquid', stars })

        // Phase 2: Liquid morphs for a bit (faster)
        setTimeout(() => {
          setConstellation(prev => prev ? { ...prev, phase: 'morphing' } : null)
        }, 400)

        // Phase 3: Liquid transforms into image (faster)
        setTimeout(() => {
          setConstellation(prev => prev ? { ...prev, phase: 'forming' } : null)
          setMerging(null) // Clear merging state
        }, 1000)

        // Phase 4: Image fully visible
        setTimeout(() => {
          setConstellation(prev => prev ? { ...prev, phase: 'visible' } : null)
        }, 1800)

        return
      }

      // Ease-in-out function for smooth movement
      const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      const easedProgress = easeInOut(progress)

      // Update positions - stars move toward midpoint
      setAnimatedPositions(prev => ({
        ...prev,
        [star1]: {
          top: pos1.top + (midTop - pos1.top) * easedProgress,
          left: pos1.left + (midLeft - pos1.left) * easedProgress,
        },
        [star2]: {
          top: pos2.top + (midTop - pos2.top) * easedProgress,
          left: pos2.left + (midLeft - pos2.left) * easedProgress,
        },
      }))

      setMerging({ stars, progress, phase: 'moving' })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // Add global mouse listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  // Get line coordinates for a connection
  const getLineCoords = (from, to) => {
    const fromCenter = getStarCenterFromPosition(from)
    const toCenter = getStarCenterFromPosition(to)
    if (!fromCenter || !toCenter) return null
    return { x1: fromCenter.x, y1: fromCenter.y, x2: toCenter.x, y2: toCenter.y }
  }

  // Reset function for ok button
  const resetAll = () => {
    stopAmbience()
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    setConstellation(null)
    setConnections([])
    setMerging(null)
    setAnimatedPositions({ ...DEFAULT_POSITIONS })
  }


  // Get center of connection line for badge
  const getLineMidpoint = (from, to) => {
    const coords = getLineCoords(from, to)
    if (!coords) return null
    return {
      x: (coords.x1 + coords.x2) / 2,
      y: (coords.y1 + coords.y2) / 2,
    }
  }

  // Get third star not in connection
  const getThirdStar = (star1, star2) => {
    const stars = ['ahsaas', 'steph', 'michael']
    return stars.find(s => s !== star1 && s !== star2)
  }

  // Check if all three stars are connected
  const allConnected = connections.length >= 3

  // Get center of triangle for Unite All button
  const getTriangleCenter = () => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const centerTop = (animatedPositions.ahsaas.top + animatedPositions.steph.top + animatedPositions.michael.top) / 3
    const centerLeft = (animatedPositions.ahsaas.left + animatedPositions.steph.left + animatedPositions.michael.left) / 3
    return {
      x: (centerLeft / 100) * canvas.clientWidth,
      y: (centerTop / 100) * canvas.clientHeight,
    }
  }

  // Handle Unite All - show fullscreen image with description panel
  const handleUniteAll = () => {
    stopAmbience()

    // Calculate center of triangle in percentages
    const centerTop = (DEFAULT_POSITIONS.ahsaas.top + DEFAULT_POSITIONS.steph.top + DEFAULT_POSITIONS.michael.top) / 3
    const centerLeft = (DEFAULT_POSITIONS.ahsaas.left + DEFAULT_POSITIONS.steph.left + DEFAULT_POSITIONS.michael.left) / 3

    // Set constellation to 'all' with visible phase (so description panel shows)
    setConstellation({
      key: 'all',
      left: centerLeft,
      top: centerTop,
      phase: 'visible',
      stars: ['ahsaas', 'steph', 'michael'],
    })
  }

  const ambientRef = useRef(null)

  // helper that stops ambience
  const stopAmbience = useCallback(() => {
    if (ambientRef.current) {
      ambientRef.current.pause()
      ambientRef.current.currentTime = 0
      ambientRef.current = null
    }
  }, [])

  useEffect(() => {
    stopAmbience()

    // only play when constellation is visible
    if (!constellation || constellation.phase !== 'visible') return

    const src = AMBIENT_SOUNDS[constellation.key]
    if (!src) return

    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0.1 // volume!!!!
    audio.play().catch(() => { })
    ambientRef.current = audio

    // cleanup if constellation changes
    return () => {
      if (audio) audio.pause()
    }
  }, [constellation, stopAmbience])




  const showDescriptionPanel = constellation?.phase === 'visible' || constellation?.phase === 'fullscreen'

  return (
    <div className={`app-wrapper ${showDescriptionPanel ? 'split-view' : ''}`}>
      <div className={`canvas ${merging ? 'merging' : ''} ${constellation ? 'constellation-active' : ''}`} ref={canvasRef}>

        {/* Aesthetics!! */}
        <div className="nebula"></div>
        <div className="dust"></div>
        <div className="vignette"></div>


        {/* Title! */}
        <div
          className={`center-title ${(constellation || merging || dragging || connections.length > 0) ? 'hidden' : ''}`}>
          <h1>Our Team Constellation</h1>
          <p>Drag from one star to another to begin</p>
        </div>


        {/* Clear connections button */}
        {connections.length > 0 && !constellation && (
          <button className="clear-btn" onClick={clearConnections}>
            Clear
          </button>
        )}

        {/* SVG layer for connection lines */}
        <svg className={`connections-layer ${constellation ? 'hidden' : ''}`}>
          {connections.map((conn, idx) => {
            const coords = getLineCoords(conn.from, conn.to)
            if (!coords) return null
            // Hide the line if these stars are involved in constellation
            const isHidden = constellation?.stars?.includes(conn.from) && constellation?.stars?.includes(conn.to)
            const lineKey = `${conn.from}-${conn.to}`
            const lineColor = LINE_COLORS[lineKey] || 'rgba(255, 255, 255, 0.6)'
            return (
              <line
                key={idx}
                x1={coords.x1}
                y1={coords.y1}
                x2={coords.x2}
                y2={coords.y2}
                className={`connection-line ${isHidden ? 'fade-out' : ''}`}
                style={{ stroke: lineColor }}
              />
            )
          })}

          {dragging && (
            <line
              x1={dragging.startX}
              y1={dragging.startY}
              x2={mousePos.x}
              y2={mousePos.y}
              className="connection-line dragging"
            />
          )}
        </svg>

        {/* Merge badges on connection lines - hide when all three connected */}
        {!allConnected && connections.map((conn, idx) => {
          const mid = getLineMidpoint(conn.from, conn.to)
          if (!mid || merging || constellation) return null
          return (
            <button
              key={idx}
              className="merge-badge"
              style={{ left: mid.x, top: mid.y }}
              onClick={() => handleMerge([conn.from, conn.to])}
            >
              Unite
            </button>
          )
        })}

        {/* Unite All button in center when all three connected */}
        {allConnected && !merging && !constellation && (() => {
          const center = getTriangleCenter()
          if (!center) return null
          return (
            <button
              className="merge-badge merge-all"
              style={{ left: center.x, top: center.y }}
              onClick={handleUniteAll}
            >
              Unite All
            </button>
          )
        })()}

        {/* Stars */}
        <div
          ref={starRefs.ahsaas}
          className={`star-container ${merging && !merging.stars.includes('ahsaas') ? 'dimmed' : ''} ${merging?.stars.includes('ahsaas') && merging?.phase === 'moving' ? 'merging-star' : ''} ${(merging?.phase === 'collided' && merging?.stars?.includes('ahsaas')) || constellation?.stars?.includes('ahsaas') ? 'hidden' : ''}`}
          style={{
            top: `${animatedPositions.ahsaas.top}%`,
            left: `${animatedPositions.ahsaas.left}%`,
          }}
          onMouseDown={(e) => handleDragStart('ahsaas', e)}
        >
          <AhsaasStar forceHover={merging?.stars.includes('ahsaas')} />
        </div>
        <div
          ref={starRefs.steph}
          className={`star-container ${merging && !merging.stars.includes('steph') ? 'dimmed' : ''} ${merging?.stars.includes('steph') && merging?.phase === 'moving' ? 'merging-star' : ''} ${(merging?.phase === 'collided' && merging?.stars?.includes('steph')) || constellation?.stars?.includes('steph') ? 'hidden' : ''}`}
          style={{
            top: `${animatedPositions.steph.top}%`,
            left: `${animatedPositions.steph.left}%`,
          }}
          onMouseDown={(e) => handleDragStart('steph', e)}
        >
          <StephStar forceHover={merging?.stars.includes('steph')} />
        </div>
        <div
          ref={starRefs.michael}
          className={`star-container ${merging && !merging.stars.includes('michael') ? 'dimmed' : ''} ${merging?.stars.includes('michael') && merging?.phase === 'moving' ? 'merging-star' : ''} ${(merging?.phase === 'collided' && merging?.stars?.includes('michael')) || constellation?.stars?.includes('michael') ? 'hidden' : ''}`}
          style={{
            top: `${animatedPositions.michael.top}%`,
            left: `${animatedPositions.michael.left}%`,
          }}
          onMouseDown={(e) => handleDragStart('michael', e)}
        >
          <MichaelStar forceHover={merging?.stars.includes('michael')} />
        </div>

        {/* Background blur overlay when constellation is visible */}
        {constellation?.phase === 'visible' && (
          <div className="constellation-blur-overlay"></div>
        )}

        {/* Liquid ball and constellation at collision point */}
        {constellation && (
          <div
            className={`collision-effect ${constellation.phase}`}
            style={{
              left: `${constellation.left}%`,
              top: `${constellation.top}%`,
              '--color-primary': CONSTELLATION_COLORS[constellation.key]?.primary || '#c0392b',
              '--color-secondary': CONSTELLATION_COLORS[constellation.key]?.secondary || '#e74c3c',
              '--color-glow': CONSTELLATION_COLORS[constellation.key]?.glow || 'rgba(192, 57, 43, 0.6)',
            }}
          >
            {/* Liquid morphing ball */}
            {(constellation.phase === 'liquid' || constellation.phase === 'morphing') && (
              <div className="liquid-ball">
                <div className="liquid-inner"></div>
              </div>
            )}

            {/* Constellation image */}
            {(constellation.phase === 'forming' || constellation.phase === 'visible' || constellation.phase === 'fading') && (
              <img
                src={RELATIONSHIP_IMAGES[constellation.key]}
                alt="Constellation"
                className={`constellation-img ${constellation.key === 'all' ? 'earth-img' : ''}`}
              />
            )}
          </div>
        )}
      </div>

      {/* Description Panel */}
      <div className={`description-panel ${
        constellation?.key === 'michael-ahsaas' || constellation?.key === 'ahsaas-michael'
          ? 'panel-left'
          : 'panel-right'
      }`}>
        <div className="description-content">
          {/* Tab icon */}
          <div className="description-tab">
  
            <span className="tab-label">Constellation</span>
          </div>

          {/* Title */}
          <h2 className="description-title">
            {CONSTELLATION_MESSAGES[constellation?.key]?.title || 'United'}
          </h2>

          {/* Three paragraphs */}
          <div className="description-paragraphs">
            <p className="description-para">
              {CONSTELLATION_MESSAGES[constellation?.key]?.person1}
            </p>
            <p className="description-para">
              {CONSTELLATION_MESSAGES[constellation?.key]?.person2}
            </p>
            <p className="description-para">
              {CONSTELLATION_MESSAGES[constellation?.key]?.union}
            </p>
          </div>

          {/* OK Button */}
          <button className="ok-btn" onClick={resetAll}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
