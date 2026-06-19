import { useRef } from 'react'
import { Typography, Button } from 'antd'
import { ArrowDownOutlined } from '@ant-design/icons'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import urjaLogo from '../assets/urja-logo.png'
import quikLogo from '../assets/quik-logo.png'

export default function HeroOverlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const interactRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  // Split the title into individual words and letters for staggered animation without breaking words on mobile
  const titleString = "Exigo Cleantech"
  const splitTitle = titleString.split(" ").map((word, wordIndex) => (
    <span
      key={wordIndex}
      style={{
        display: 'inline-block',
        whiteSpace: 'nowrap'
      }}
    >
      {word.split("").map((char, charIndex) => (
        <span
          key={charIndex}
          className="hero-letter"
          style={{
            display: 'inline-block',
            willChange: 'transform, opacity',
            background: 'linear-gradient(135deg, #0f172a 0%, #6b21a8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 20px 40px rgba(107, 33, 168, 0.15)'
          }}
        >
          {char}
        </span>
      ))}
      {wordIndex < titleString.split(" ").length - 1 && (
        <span style={{ display: 'inline-block', width: '0.25em' }}>&nbsp;</span>
      )}
    </span>
  ))

  useGSAP(() => {
    const tl = gsap.timeline()

    // 1. 3D Cinematic Staggered Letter Reveal
    tl.fromTo('.hero-letter',
      {
        opacity: 0,
        y: 100,
        rotateX: -110,
        scale: 0.8,
        transformOrigin: '50% 100% -50'
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 1.4,
        stagger: 0.04,
        ease: 'back.out(1.4)',
        transformPerspective: 1200
      }
    )
      // 2. Subtitle unblurs and floats up with premium ease
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 30, filter: 'blur(15px)', scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          scale: 1,
          duration: 1.2,
          ease: 'power3.out'
        },
        "-=0.9"
      )
      // 3. Structural shift upwards to make room for buttons
      .to([titleRef.current, subtitleRef.current], {
        y: -30,
        duration: 1.4,
        ease: 'power4.inOut'
      }, "+=0.2")
      // 4. Buttons spring in with staggered elasticity
      .fromTo('.hero-action-btn',
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'elastic.out(1.1, 0.6)'
        },
        "-=1.0"
      )
      // 5. Scroll indicator fades in and starts bouncing
      .fromTo(scrollIndicatorRef.current,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out'
        },
        "-=0.8"
      )

    // Continuous pulse on the scroll line
    gsap.to('.scroll-line-gradient', {
      y: 10,
      opacity: 0.4,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // --- HIGH-PERFORMANCE MOUSE PARALLAX ---
    const xTo = gsap.quickTo(interactRef.current, "x", { duration: 1.2, ease: "power3.out" })
    const yTo = gsap.quickTo(interactRef.current, "y", { duration: 1.2, ease: "power3.out" })

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      // Adjusted multiplier for a heavier, more luxurious parallax drift
      const xPos = (e.clientX / innerWidth - 0.5) * 35
      const yPos = (e.clientY / innerHeight - 0.5) * 35

      xTo(xPos)
      yTo(yPos)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)

  }, { scope: containerRef })

  const handleScrollToMatrix = () => {
    // Updated to target the subsidiary matrix section on the homepage
    const el = document.getElementById('subsidiary-matrix')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      ref={containerRef}
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
        padding: '0 24px',
        boxSizing: 'border-box'
      }}
    >
      {/* Interactive Wrapper for Mouse Parallax */}
      <div
        ref={interactRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          willChange: 'transform'
        }}
      >
        <div ref={titleRef} style={{ pointerEvents: 'auto', textAlign: 'center', position: 'relative' }}>
          {/* Ambient Glow behind title */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1, pointerEvents: 'none' }} />

          <Typography.Title
            level={1}
            style={{
              margin: 0,
              fontWeight: 900,
              textTransform: 'uppercase',
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
              letterSpacing: '0.02em',
              paddingBottom: '8px',
              perspective: '1200px',
              lineHeight: '1.1'
            }}
          >
            {splitTitle}
          </Typography.Title>
        </div>

        <div ref={subtitleRef} style={{ pointerEvents: 'auto', textAlign: 'center', marginBottom: '40px', marginTop: '16px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            padding: '10px 32px',
            borderRadius: '40px',
            boxShadow: '0 10px 40px -10px rgba(107, 33, 168, 0.15)'
          }}>
            <Typography.Text
              style={{
                fontSize: 'clamp(0.85rem, 1.8vw, 1.15rem)',
                color: '#1e293b',
                letterSpacing: '0.35em',
                fontWeight: 800,
                textTransform: 'uppercase',
                margin: 0
              }}
            >
              Powering the Circular Economy
            </Typography.Text>
          </div>
        </div>

        <div
          ref={buttonsRef}
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <Button
            type="primary"
            size="large"
            icon={<img src={urjaLogo} alt="Urja" style={{ height: '26px', width: 'auto', objectFit: 'contain' }} />}
            href="https://urjamobility.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-action-btn hero-btn-urja"
            style={{
              height: '64px',
              padding: '0 44px',
              fontSize: '16px',
              fontWeight: 800,
              borderRadius: '32px',
              backgroundColor: '#0f172a',
              borderColor: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 12px 30px -8px rgba(15, 23, 42, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            URJA Mobility
          </Button>
          <Button
            size="large"
            icon={<img src={quikLogo} alt="QwikSELL" style={{ height: '26px', width: 'auto', objectFit: 'contain' }} />}
            onClick={handleScrollToMatrix}
            className="hero-action-btn hero-btn-qwik"
            style={{
              height: '64px',
              padding: '0 44px',
              fontSize: '16px',
              fontWeight: 800,
              borderRadius: '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(107, 33, 168, 0.1)',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            QwikSELL
          </Button>
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        style={{
          position: 'absolute',
          bottom: '6vh',
          color: '#64748b',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          Discover
        </span>
        <div style={{
          width: '3px',
          height: '60px',
          background: 'rgba(100, 116, 139, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div className="scroll-line-gradient" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '50%',
            background: 'linear-gradient(to bottom, transparent, #6b21a8, #0ea5e9)',
            borderRadius: '4px'
          }} />
        </div>
        <ArrowDownOutlined style={{ fontSize: '14px', color: '#94a3b8' }} />
      </div>

      {/* Micro Interaction CSS overrides */}
      <style>{`
                .hero-btn-urja:hover {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.5) !important;
                    background-color: #1e293b !important;
                }
                .hero-btn-qwik:hover {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 20px 40px -10px rgba(107, 33, 168, 0.15) !important;
                    border-color: rgba(107, 33, 168, 0.3) !important;
                    background-color: #ffffff !important;
                }
            `}</style>
    </div>
  )
}