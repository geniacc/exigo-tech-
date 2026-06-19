import React, { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ExigoCore from './ExigoCore';
import UrjaVector from './UrjaVector';
import QwikSellVector from './QwikSellVector';

// Import your corporate image assets
import homepageFold7 from '../assets/homepage_fold7.png';
import hero4 from '../assets/hero 4.png';
import aboutHero from '../assets/abouthero.png';
import aboutExigoRecycling from '../assets/AboutExigoRecycling.png';

gsap.registerPlugin(useGSAP);

export default function DataLifecycleEngine() {
    const containerRef = useRef<HTMLDivElement>(null);
    const coreRef = useRef<HTMLDivElement>(null);
    const urjaRef = useRef<HTMLDivElement>(null);
    const qwikRef = useRef<HTMLDivElement>(null);
    const slideshowRef = useRef<HTMLDivElement>(null);
    const mobileTrackRef = useRef<HTMLDivElement>(null);

    // Shine Overlay Element References
    const coreShineRef = useRef<HTMLDivElement>(null);
    const urjaShineRef = useRef<HTMLDivElement>(null);
    const qwikShineRef = useRef<HTMLDivElement>(null);

    const [isMobile, setIsMobile] = useState(false);
    const [activeMobileIndex, setActiveMobileIndex] = useState(0);

    const slides = [homepageFold7, hero4, aboutHero, aboutExigoRecycling];

    // 1. Structural Responsive State Check
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 2. High-Impact Animation Context
    useGSAP(() => {
        // --- DESKTOP POP-OUT ERUPTION SEQUENCE ---
        if (!isMobile) {
            const masterTimeline = gsap.timeline();

            // First, bring down the Exigo Core safely from above
            masterTimeline.fromTo(coreRef.current,
                { scale: 0.3, opacity: 0, z: 300 },
                { scale: 1, opacity: 1, z: 0, duration: 1.2, ease: "back.out(1.2)" }
            );

            // Then, erupt Urja and QwikSell out from behind/within Exigo Core simultaneously
            masterTimeline.fromTo(urjaRef.current,
                { x: 300, scale: 0, opacity: 0, rotateY: -90 },
                {
                    x: 0, scale: 1, opacity: 1, rotateY: 0, duration: 1.4, ease: "elastic.out(1, 0.75)",
                    onComplete: () => triggerShine(urjaShineRef.current) // Shiny sweep right after landing
                },
                "-=0.6"
            );

            masterTimeline.fromTo(qwikRef.current,
                { x: -300, scale: 0, opacity: 0, rotateY: 90 },
                {
                    x: 0, scale: 1, opacity: 1, rotateY: 0, duration: 1.4, ease: "elastic.out(1, 0.75)",
                    onComplete: () => {
                        triggerShine(qwikShineRef.current);
                        triggerShine(coreShineRef.current);
                    }
                },
                "<"
            );
        } else {
            // MOBILE ENTRANCE FADE
            gsap.fromTo([coreRef.current, urjaRef.current, qwikRef.current],
                { opacity: 0, scale: 0.9, y: 30 },
                { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: "power3.out", stagger: 0.15 }
            );
        }

        // --- BACKGROUND FLAWLESS CROSS-FADE ---
        const bgImages = slideshowRef.current?.children;
        if (bgImages && bgImages.length > 0) {
            gsap.set(bgImages, { opacity: 0, scale: 1.05, transformOrigin: "center center" });
            gsap.set(bgImages[0], { opacity: 1 });

            const slideTimeline = gsap.timeline({ repeat: -1 });
            const visibleDuration = 3.5;
            const fadeDuration = 2.0;

            for (let i = 0; i < bgImages.length; i++) {
                const nextIndex = (i + 1) % bgImages.length;
                const transitionOffset = (i + 1) * visibleDuration + (i * fadeDuration);

                slideTimeline.to(bgImages[i], { opacity: 0, duration: fadeDuration, ease: "power2.inOut" }, transitionOffset);
                slideTimeline.to(bgImages[nextIndex], { opacity: 1, duration: fadeDuration, ease: "power2.inOut" }, transitionOffset);
            }
        }

        // --- DESKTOP MOUSE PARALLAX ---
        if (!isMobile) {
            const handleMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const { innerWidth, innerHeight } = window;

                const xPos = (clientX / innerWidth) - 0.5;
                const yPos = (clientY / innerHeight) - 0.5;

                gsap.to(coreRef.current, { x: xPos * 50, y: yPos * 50, rotateX: -yPos * 18, rotateY: xPos * 18, duration: 0.7, ease: "power2.out" });
                gsap.to(urjaRef.current, { x: xPos * 30, y: yPos * 30, rotateX: -yPos * 12, rotateY: xPos * 24, duration: 0.9, ease: "power2.out" });
                gsap.to(qwikRef.current, { x: xPos * 30, y: yPos * 30, rotateX: -yPos * 12, rotateY: xPos * -24, duration: 0.9, ease: "power2.out" });

                if (slideshowRef.current) {
                    gsap.to(slideshowRef.current, { x: -xPos * 45, y: -yPos * 45, duration: 1.2, ease: "power2.out" });
                }
            };

            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, { scope: containerRef, dependencies: [isMobile] });

    // 3. Mobile Carousel Slide Engine
    useEffect(() => {
        if (!isMobile) return;

        const interval = setInterval(() => {
            setActiveMobileIndex((prev) => (prev + 1) % 3);
        }, 4000);

        return () => clearInterval(interval);
    }, [isMobile]);

    // Handle Mobile Sliding Transitions and trigger card-specific shines
    useGSAP(() => {
        if (!isMobile || !mobileTrackRef.current) return;

        gsap.to(mobileTrackRef.current, {
            x: `-${activeMobileIndex * 100}%`,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                // Flash the shine across whichever card just slid onto the center layout stage
                if (activeMobileIndex === 0) triggerShine(coreShineRef.current);
                if (activeMobileIndex === 1) triggerShine(urjaShineRef.current);
                if (activeMobileIndex === 2) triggerShine(qwikShineRef.current);
            }
        });
    }, { dependencies: [activeMobileIndex, isMobile] });

    // --- Helper function to sweep light seamlessly ---
    const triggerShine = (element: HTMLDivElement | null) => {
        if (!element) return;
        gsap.fromTo(element,
            { left: '-100%' },
            { left: '200%', duration: 1.0, ease: "power2.inOut" }
        );
    };

    return (
        <section ref={containerRef} style={styles.stage}>

            {/* Slideshow Layer Container */}
            <div ref={slideshowRef} style={styles.slideshowContainer}>
                {slides.map((imageSrc, idx) => (
                    <div
                        key={idx}
                        style={{
                            ...styles.slideImage,
                            backgroundImage: `url(${imageSrc})`,
                        }}
                    />
                ))}
            </div>

            {/* Light Matte Overlay & Blueprint Sheet */}
            <div style={styles.glassMatteOverlay} />
            <div style={styles.gridOverlay} />

            {/* Desktop View Content Wrapper */}
            {!isMobile ? (
                <div style={styles.engineSpaceDesktop}>

                    {/* Urja Card Wrapper */}
                    <div
                        onMouseEnter={() => triggerShine(urjaShineRef.current)}
                        style={styles.cardInteractiveWrapper}
                    >
                        <div ref={urjaRef} style={{ transformStyle: 'preserve-3d' }}>
                            <UrjaVector animatedRef={urjaRef} />
                        </div>
                        <div ref={urjaShineRef} style={styles.shineBeam} />
                    </div>

                    {/* Exigo Core Wrapper */}
                    <div
                        onMouseEnter={() => triggerShine(coreShineRef.current)}
                        style={styles.cardInteractiveWrapper}
                    >
                        <div ref={coreRef} style={{ transformStyle: 'preserve-3d' }}>
                            <ExigoCore animatedRef={coreRef} />
                        </div>
                        <div ref={coreShineRef} style={styles.shineBeam} />
                    </div>

                    {/* QwikSell Card Wrapper */}
                    <div
                        onMouseEnter={() => triggerShine(qwikShineRef.current)}
                        style={styles.cardInteractiveWrapper}
                    >
                        <div ref={qwikRef} style={{ transformStyle: 'preserve-3d' }}>
                            <QwikSellVector animatedRef={qwikRef} />
                        </div>
                        <div ref={qwikShineRef} style={styles.shineBeam} />
                    </div>

                </div>
            ) : (
                /* Mobile Viewport Container */
                <div style={styles.mobileCarouselViewport}>
                    <div ref={mobileTrackRef} style={styles.mobileCarouselTrack}>

                        {/* Slide 1: ExigoCore */}
                        <div style={styles.mobileSlideCard}>
                            <div style={styles.cardInteractiveWrapper}>
                                <ExigoCore animatedRef={coreRef} />
                                <div ref={coreShineRef} style={styles.shineBeam} />
                            </div>
                        </div>

                        {/* Slide 2: UrjaVector */}
                        <div style={styles.mobileSlideCard}>
                            <div style={styles.cardInteractiveWrapper}>
                                <UrjaVector animatedRef={urjaRef} />
                                <div ref={urjaShineRef} style={styles.shineBeam} />
                            </div>
                        </div>

                        {/* Slide 3: QwikSellVector */}
                        <div style={styles.mobileSlideCard}>
                            <div style={styles.cardInteractiveWrapper}>
                                <QwikSellVector animatedRef={qwikRef} />
                                <div ref={qwikShineRef} style={styles.shineBeam} />
                            </div>
                        </div>

                    </div>

                    {/* Navigation Control Dots for Mobile View */}
                    <div style={styles.mobileDotContainer}>
                        {[0, 1, 2].map((index) => (
                            <button
                                key={index}
                                onClick={() => setActiveMobileIndex(index)}
                                style={{
                                    ...styles.dot,
                                    backgroundColor: activeMobileIndex === index ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)',
                                    transform: activeMobileIndex === index ? 'scale(1.2)' : 'scale(1)',
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

const styles = {
    stage: {
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        perspective: '1500px',
    } as React.CSSProperties,
    slideshowContainer: {
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '120%',
        height: '120%',
        zIndex: 1,
    } as React.CSSProperties,
    slideImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        willChange: 'opacity',
    } as React.CSSProperties,
    glassMatteOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(248, 250, 252, 0.20)',
        backdropFilter: 'blur(1px)',
        WebkitBackdropFilter: 'blur(1px)',
        zIndex: 2,
        pointerEvents: 'none',
    } as React.CSSProperties,
    gridOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px), 
                          linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
        zIndex: 3,
    } as React.CSSProperties,
    engineSpaceDesktop: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1440px',
        transformStyle: 'preserve-3d',
        gap: '40px',
        padding: '0 40px',
        zIndex: 5,
    } as React.CSSProperties,

    // --- New Shiny Overlay Containers ---
    cardInteractiveWrapper: {
        position: 'relative',
        overflow: 'hidden', // Crops the shine so it doesn't bleed out of your vector box frame bounds
        borderRadius: '16px', // Matches your premium corporate card styles perfectly
        transformStyle: 'preserve-3d',
    } as React.CSSProperties,
    shineBeam: {
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '50%',
        height: '100%',
        background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.35), transparent)',
        transform: 'skewX(-25deg)', // Elegant slanted corporate glass beam angle
        pointerEvents: 'none', // Lets user actions bypass cleanly to underlying items
        zIndex: 10,
    } as React.CSSProperties,

    // --- Carousel Slider Styles ---
    mobileCarouselViewport: {
        width: '100%',
        height: '80vh',
        overflowX: 'auto',
        overflowY: 'hidden',
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        WebkitOverflowScrolling: 'touch',
    } as React.CSSProperties,
    mobileCarouselTrack: {
        display: 'flex',
        width: '100%',
        height: '90%',
    } as React.CSSProperties,
    mobileSlideCard: {
        minWidth: '100%',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        boxSizing: 'border-box',
    } as React.CSSProperties,
    mobileDotContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        width: '100%',
        position: 'absolute',
        bottom: '10px',
    } as React.CSSProperties,
    dot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    } as React.CSSProperties,
};