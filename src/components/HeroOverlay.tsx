import { useEffect, useRef } from 'react'
import { Typography, Button } from 'antd'
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
          className="hero-letter vibrant-gradient-text"
          style={{
            display: 'inline-block',
            willChange: 'transform, opacity'
          }}
        >
          {char}
        </span>
      ))}
      {wordIndex < titleString.split(" ").length - 1 && (
        <span style={{ display: 'inline-block', width: '0.2em' }}>&nbsp;</span>
      )}
    </span>
  ))

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial states
      gsap.set(buttonsRef.current, { opacity: 0, y: 40, scale: 0.95 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 20, filter: 'blur(10px)' });
      gsap.set(scrollIndicatorRef.current, { opacity: 0 });

      // 1. 3D Staggered Letter Reveal
      tl.fromTo('.hero-letter',
        {
          opacity: 0,
          y: 80,
          rotateX: -90,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.06, // Delays each letter slightly
          ease: 'back.out(1.7)',
          transformPerspective: 1000
        }
      )
        // 2. Subtitle unblurs and floats up
        .to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out'
        }, "-=0.8")
        // 3. Brief hold
        .to({}, { duration: 1.0 })
        // 4. Smooth structural shift upwards
        .to([titleRef.current, subtitleRef.current], {
          y: -40,
          duration: 1.2,
          ease: 'power4.inOut'
        })
        // 5. Buttons spring in with aggressive elasticity
        .to(buttonsRef.current, {
          opacity: 1,
          y: -20,
          scale: 1,
          duration: 1.2,
          ease: 'elastic.out(1.2, 0.5)'
        }, "-=0.7")
        // 6. Scroll indicator fades in
        .to(scrollIndicatorRef.current, {
          opacity: 1,
          duration: 1
        }, "-=0.5")

      // --- HIGH-PERFORMANCE MOUSE PARALLAX ---
      const xTo = gsap.quickTo(interactRef.current, "x", { duration: 0.8, ease: "power3" })
      const yTo = gsap.quickTo(interactRef.current, "y", { duration: 0.8, ease: "power3" })

      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const xPos = (e.clientX / innerWidth - 0.5) * 40;
        const yPos = (e.clientY / innerHeight - 0.5) * 40;

        xTo(xPos);
        yTo(yPos);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleScrollToQuik = () => {
    const el = document.getElementById('qwiksell')
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
        <div ref={titleRef} style={{ pointerEvents: 'auto', textAlign: 'center' }}>
          <Typography.Title
            level={1}
            className="hero-main-title"
            style={{
              margin: 0,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.15em', // Slightly reduced so letters sit closer together
              paddingBottom: '8px',
              perspective: '1000px' // Enables 3D flip effect for children
            }}
          >
            {splitTitle}
          </Typography.Title>
        </div>

        <div ref={subtitleRef} style={{ pointerEvents: 'auto', textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            padding: '8px 24px',
            borderRadius: '30px',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
          }}>
            <Typography.Text
              style={{
                fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
                color: '#0f172a', // Darkened for better contrast against vibrant title
                letterSpacing: '0.3em',
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
            icon={<img src={urjaLogo} alt="Urja" style={{ height: '24px', width: 'auto', objectFit: 'contain' }} />}
            href="https://urjamobility.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-btn-primary"
            style={{
              height: '58px',
              padding: '0 40px',
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '29px',
              backgroundColor: '#0f172a', // Shifted to dark slate to contrast the vibrant text
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            URJA Mobility
          </Button>
          <Button
            type="default"
            size="large"
            icon={<img src={quikLogo} alt="Quik" style={{ height: '24px', width: 'auto', objectFit: 'contain' }} />}
            onClick={handleScrollToQuik}
            className="magnetic-btn-glass"
            style={{
              height: '58px',
              padding: '0 40px',
              fontSize: '16px',
              fontWeight: 800,
              borderRadius: '29px',
              borderColor: 'transparent',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            Quik
          </Button>
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        style={{
          position: 'absolute',
          bottom: '5vh',
          color: '#64748b',
          fontSize: '12px',
          fontWeight: 800,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <span className="bounce-slow">Scroll</span>
        <div style={{
          width: '3px',
          height: '50px',
          background: 'linear-gradient(to bottom, #8a2387, #06b6d4, transparent)', // Vibrant gradient scroll line
          borderRadius: '3px'
        }} />
      </div>
    </div>
  )
}