import React, { useEffect, useRef } from 'react';
import { Typography, Button } from 'antd';
import gsap from 'gsap';
import quikLogo from '../assets/quik-logo.png';

const { Title, Paragraph } = Typography;

interface QwikSellVectorProps {
    animatedRef: React.RefObject<HTMLDivElement | null>;
}

export default function QwikSellVector({ animatedRef }: QwikSellVectorProps) {
    const paramRef = useRef<HTMLSpanElement>(null);
    const scanLineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!animatedRef.current) return;

        const ctx = gsap.context(() => {
            // 1. Loop Scanner Bar Animation
            if (scanLineRef.current) {
                gsap.fromTo(scanLineRef.current,
                    { translateY: -10 },
                    { translateY: 90, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" }
                );
            }

            // 2. Count up Parameter Audit Checkers
            const paramObj = { val: 0 };
            gsap.to(paramObj, {
                val: 50,
                duration: 2,
                ease: "power2.out",
                delay: 1.5,
                onUpdate: () => {
                    if (paramRef.current) {
                        paramRef.current.innerText = Math.floor(paramObj.val).toString();
                    }
                }
            });
        }, animatedRef);

        return () => ctx.revert();
    }, [animatedRef]);

    return (
        <div ref={animatedRef} style={styles.vectorCard}>
            <img src={quikLogo} alt="QwikSELL" style={styles.logo} />
            <div style={styles.badge}>DEVICE RE-COMMERCE</div>

            {/* Holographic Diagnostic Scanner Box */}
            <div style={styles.scannerWindow}>
                <div ref={scanLineRef} style={styles.scanLine} />
                <div style={styles.matrixGrid}>
                    <span>[SYS_AUDIT: OK]</span>
                    <span>[AI_PRICING: RUNNING]</span>
                    <span>[EST_LIQUIDITY: MAX]</span>
                </div>
            </div>

            <div style={styles.metricsContainer}>
                <div style={styles.metricItem}>
                    <span style={styles.metricLabel}>DIAGNOSTIC PIPELINE</span>
                    <span style={styles.metricValue}><span ref={paramRef}>0</span>+ PARAMETERS</span>
                </div>
                <div style={styles.metricItem}>
                    <span style={styles.metricLabel}>ENGINE LAYER</span>
                    <span style={styles.metricValue}>PROPRIETARY AI</span>
                </div>
            </div>

            <Title level={2} style={styles.title}>QwikSELL</Title>
            <Paragraph style={styles.desc}>
                An automated enterprise liquidation pipeline utilizing high-velocity asset diagnostic sweeps to eliminate hardware e-waste.
            </Paragraph>
            <Button type="primary" style={styles.btn}>Access B2B Market</Button>
        </div>
    );
}

const styles = {
    vectorCard: {
        width: '380px',
        padding: '40px 32px',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(99, 102, 241, 0.15)',
        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    } as React.CSSProperties,
    logo: { height: '32px', marginBottom: '20px' } as React.CSSProperties,
    badge: {
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.15em',
        color: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        padding: '4px 12px',
        borderRadius: '20px',
        marginBottom: '24px',
    } as React.CSSProperties,
    scannerWindow: {
        width: '100%',
        height: '100px',
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '20px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
    } as React.CSSProperties,
    scanLine: {
        position: 'absolute',
        left: 0,
        width: '100%',
        height: '2px',
        backgroundColor: '#6366f1',
        boxShadow: '0 0 12px #6366f1, 0 0 4px #6366f1',
        zIndex: 5,
    } as React.CSSProperties,
    matrixGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        fontFamily: 'monospace',
        fontSize: '0.65rem',
        color: '#a5b4fc',
        zIndex: 2,
    } as React.CSSProperties,
    metricsContainer: { display: 'flex', gap: '32px', marginBottom: '24px', width: '100%' } as React.CSSProperties,
    metricItem: { display: 'flex', flexDirection: 'column' } as React.CSSProperties,
    metricLabel: { fontSize: '0.65rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' } as React.CSSProperties,
    metricValue: { fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' } as React.CSSProperties,
    title: { margin: '0 0 12px 0', fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' } as React.CSSProperties,
    desc: { color: '#475569', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '28px' } as React.CSSProperties,
    btn: {
        backgroundColor: '#6366f1',
        borderRadius: '8px',
        height: '44px',
        padding: '0 24px',
        fontWeight: 600,
        border: 'none',
        boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)',
    } as React.CSSProperties,
};