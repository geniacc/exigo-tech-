import { useEffect, useRef, useState } from 'react'
import { Typography, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import urjaLogo from '../assets/urja-logo.png'
import quikLogo from '../assets/quik-logo.png'

export function HeroOverlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const interactRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()

  const titleString = "EXIGO CLEANTECH"

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      gsap.set(buttonsRef.current, { opacity: 0, y: 40, scale: 0.95 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 })
      gsap.set(scrollIndicatorRef.current, { opacity: 0 })

      tl.fromTo('.hero-letter',
        { opacity: 0, y: 80, rotateX: -90, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1.1,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          transformPerspective: 1000
        }
      )
        .to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out'
        }, "-=0.7")
        .to({}, { duration: 0.8 })
        .to([titleRef.current, subtitleRef.current], {
          y: isMobile ? -15 : -35,
          duration: 1,
          ease: 'power4.inOut'
        })
        .to(buttonsRef.current, {
          opacity: 1,
          y: -15,
          scale: 1,
          duration: 1.1,
          ease: 'elastic.out(1.2, 0.5)'
        }, "-=0.6")
        .to(scrollIndicatorRef.current, {
          opacity: 1,
          duration: 0.8
        }, "-=0.4")

      if (!isMobile) {
        const xTo = gsap.quickTo(interactRef.current, "x", { duration: 0.8, ease: "power3" })
        const yTo = gsap.quickTo(interactRef.current, "y", { duration: 0.8, ease: "power3" })

        const handleMouseMove = (e: MouseEvent) => {
          const { innerWidth, innerHeight } = window
          const xPos = (e.clientX / innerWidth - 0.5) * 35
          const yPos = (e.clientY / innerHeight - 0.5) * 35

          xTo(xPos)
          yTo(yPos)
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
      }

    }, containerRef)

    return () => ctx.revert()
  }, [isMobile])

  const handleGlobalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleNavToQwik = () => {
    navigate('/qwiksell')
  }

  // Refined Premium Claymorphism Card
  const claySubtitleCardStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 249, 0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    padding: isMobile ? '16px 20px' : '18px 42px',
    borderRadius: '32px',
    boxShadow: `
      0 20px 40px -15px rgba(148, 163, 184, 0.25),
      10px 10px 20px rgba(166, 180, 200, 0.3),
      -10px -10px 20px rgba(255, 255, 255, 0.9),
      inset 1px 1px 2px rgba(255, 255, 255, 1)
    `,
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  }

  const clayLogoBtnStyle: React.CSSProperties = {
    height: isMobile ? '56px' : '62px',
    width: isMobile ? '100%' : 'auto',
    minWidth: isMobile ? undefined : '140px',
    padding: isMobile ? '0 24px' : '0 32px',
    borderRadius: '35px',
    background: '#ffffff',
    border: '1px solid rgba(255,255,255,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `
      0 12px 24px -6px rgba(148, 163, 184, 0.2),
      8px 8px 16px rgba(166, 180, 200, 0.35),
      -8px -8px 16px rgba(255, 255, 255, 0.95),
      inset 2px 2px 4px rgba(255, 255, 255, 1)
    `,
    touchAction: 'manipulation',
    transition: 'all 0.25s ease'
  }

  const clayPillIndicatorStyle: React.CSSProperties = {
    padding: '8px 18px',
    borderRadius: '20px',
    background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
    boxShadow: `
      6px 6px 12px rgba(166, 180, 200, 0.3),
      -6px -6px 12px rgba(255, 255, 255, 0.8),
      inset 2px 2px 4px rgba(255, 255, 255, 0.9)
    `
  }

  const logoStyle: React.CSSProperties = {
    height: isMobile ? '28px' : '34px',
    width: 'auto',
    objectFit: 'contain',
    display: 'block'
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleGlobalMouseMove}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        pointerEvents: 'none',
        padding: isMobile ? '0 16px' : '0 24px',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(224, 242, 254, 0.45), transparent 80%)`,
          pointerEvents: 'none',
          zIndex: 0
        }} />
      )}

      {/* Clay Soft Ambient Orbs */}
      <div 
        className="ambient-orb-1"
        style={{
          position: 'absolute',
          top: '38%',
          left: '42%',
          width: isMobile ? '300px' : '550px',
          height: isMobile ? '300px' : '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(59, 130, 246, 0.02) 65%, transparent 100%)',
          filter: isMobile ? 'blur(40px)' : 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 1
        }} 
      />

      {/* Interactive Wrapper for Mouse Parallax */}
      <div
        ref={interactRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          willChange: 'transform',
          zIndex: 2,
          width: isMobile ? '100%' : 'auto'
        }}
      >
        <div ref={titleRef} style={{ pointerEvents: 'auto', textAlign: 'center', width: '100%' }}>
          <Typography.Title
            level={1}
            className="hero-main-title"
            style={{
              margin: 0,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: isMobile ? '0.04em' : '0.12em',
              paddingBottom: '16px',
              perspective: '1000px',
              fontSize: 'clamp(2.3rem, 6.5vw, 5.2rem)',
              cursor: 'default',
              color: '#1e3a8a'
            }}
          >
            {titleString.split(" ").map((word, wordIndex) => (
              <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                {word.split("").map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className="hero-letter exigo-dark-blue-text"
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        gsap.to(e.currentTarget, { y: -10, scale: 1.15, duration: 0.25, ease: "power2.out" });
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) {
                        gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.4, ease: "power2.inOut" });
                      }
                    }}
                    style={{
                      display: 'inline-block',
                      willChange: 'transform, opacity',
                      transition: 'filter 0.3s ease'
                    }}
                  >
                    {char}
                  </span>
                ))}
                {wordIndex < titleString.split(" ").length - 1 && (
                  <span style={{ display: 'inline-block', width: isMobile ? '0.18em' : '0.25em' }}>&nbsp;</span>
                )}
              </span>
            ))}
          </Typography.Title>
        </div>

        {/* Clean, Premium Subtitle Container */}
        <div ref={subtitleRef} style={{ pointerEvents: 'auto', textAlign: 'center', marginBottom: isMobile ? '28px' : '36px', maxWidth: '100%' }}>
          <div style={claySubtitleCardStyle}>
            <Typography.Text
              style={{
                fontSize: 'clamp(0.85rem, 1.8vw, 1.15rem)',
                color: '#0f172a',
                letterSpacing: isMobile ? '0.12em' : '0.2em',
                fontWeight: 900,
                textTransform: 'uppercase',
                margin: 0
              }}
            >
              End-to-End Product Lifecycle Management
            </Typography.Text>
          </div>
        </div>

        {/* Clay Interactive Buttons */}
        <div
          ref={buttonsRef}
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '20px',
            width: isMobile ? '100%' : 'auto',
            maxWidth: isMobile ? '280px' : 'none',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <Button
            type="default"
            size="large"
            href="https://urjamobility.in/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="URJA Mobility"
            className="magnetic-btn-primary"
            style={clayLogoBtnStyle}
          >
            <img src={urjaLogo} alt="URJA Mobility" style={logoStyle} />
          </Button>

          <Button
            type="default"
            size="large"
            onClick={handleNavToQwik}
            aria-label="QwikSELL"
            className="magnetic-btn-glass"
            style={clayLogoBtnStyle}
          >
            <img src={quikLogo} alt="QwikSELL" style={logoStyle} />
          </Button>
        </div>
      </div>

      {/* Clay Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        style={{
          position: 'absolute',
          bottom: isMobile ? '2vh' : '4vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={clayPillIndicatorStyle}>
          <span 
            className="bounce-slow"
            style={{
              color: '#475569',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              display: 'block'
            }}
          >
            Scroll
          </span>
        </div>
        <div style={{
          width: '4px',
          height: isMobile ? '28px' : '42px',
          background: 'linear-gradient(to bottom, #3b82f6, #93c5fd, transparent)',
          borderRadius: '4px',
          boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.8)'
        }} />
      </div>
    </div>
  )
}