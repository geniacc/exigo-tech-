import React, { useState, useEffect, useRef } from 'react';
import { Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom'; // NEW IMPORT
import gsap from 'gsap';
import urjaLogo from '../assets/urja-logo.png';

const { Text } = Typography;

interface UrjaVectorProps {
  animatedRef: React.RefObject<HTMLDivElement | null>;
}

export default function UrjaVector({ animatedRef }: UrjaVectorProps) {
  const [imgError, setImgError] = useState(false);
  const capacityRef = useRef<HTMLSpanElement>(null);
  const warrantyRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const navigate = useNavigate(); // NEW INSTANCE

  useEffect(() => {
    if (!animatedRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Draw SVG Battery Wireframe
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(pathRef.current, { strokeDashoffset: 0, duration: 2, ease: "power2.out", delay: 1.5 });
      }

      // 2. Count up Capacity Specs
      const capObj = { val: 0 };
      gsap.to(capObj, {
        val: 232,
        duration: 1.8,
        ease: "power3.out",
        delay: 1.6,
        onUpdate: () => {
          if (capacityRef.current) {
            capacityRef.current.innerText = Math.floor(capObj.val).toString();
          }
        }
      });

      // 3. Count up Corporate Warranty Months
      const warObj = { val: 0 };
      gsap.to(warObj, {
        val: 60,
        duration: 1.4,
        ease: "expo.out",
        delay: 1.8,
        onUpdate: () => {
          if (warrantyRef.current) {
            warrantyRef.current.innerText = Math.floor(warObj.val).toString();
          }
        }
      });
    }, animatedRef);

    return () => ctx.revert();
  }, [animatedRef]);

  return (
    <div ref={animatedRef} style={styles.vectorCard}>
      <div style={styles.glowEffect} />

      {/* Header Tag */}
      <div style={styles.tagContainer}>
        <span style={styles.tagPulse} />
        <span style={styles.tagText}>BATTERY-AS-A-SERVICE</span>
      </div>

      {/* Logo Container */}
      <div style={styles.logoContainer}>
        {!imgError && urjaLogo ? (
          <img
            src={urjaLogo}
            alt="Urja Mobility"
            style={styles.logo}
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={styles.logoFallback}>URJA</div>
        )}
      </div>

      {/* High-end SVG battery animation */}
      <div style={styles.svgContainer}>
        <svg viewBox="0 0 200 100" style={styles.svg}>
          <path
            ref={pathRef}
            d="M20,20 H160 V80 H20 Z M50,20 V80 M90,20 V80 M130,20 V80 M160,40 H175 V60 H160"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Double Metric Panel */}
      <div style={styles.metricsContainer}>
        <div style={styles.metricCard}>
          <Text style={styles.metricLabel}>MANAGED ASSETS</Text>
          <Text style={styles.metricValue}>₹80 Cr+</Text>
        </div>
        <div style={styles.metricCard}>
          <Text style={styles.metricLabel}>FY26 TARGET</Text>
          <Text style={styles.metricValue}>₹48 Cr+</Text>
        </div>
      </div>

      {/* Value Proposition Highlights */}
      <div style={styles.featuresList}>
        <div style={styles.featureItem}>
          <span style={styles.featureDot} />
          <Text style={styles.featureText}>Zero Upfront CAPEX Model</Text>
        </div>
        <div style={styles.featureItem}>
          <span style={styles.featureDot} />
          <Text style={styles.featureText}>Connected Battery Deployment Framework</Text>
        </div>
        <div style={styles.featureItem}>
          <span style={styles.featureDot} />
          <Text style={styles.featureText}>Configurations: <span ref={capacityRef}>0</span>Ah Capacity</Text>
        </div>
        <div style={styles.featureItem}>
          <span style={styles.featureDot} />
          <Text style={styles.featureText}>Warranty: <span ref={warrantyRef}>0</span> Months Secure</Text>
        </div>
      </div>

      {/* CTA Button - UPDATED WITH CLICK ROUTING */}
      <Button type="primary" onClick={() => navigate('/urja')} style={styles.btn}>
        Explore Fleet Solutions
      </Button>
    </div>
  );
}

const styles = {
  vectorCard: {
    width: '380px',
    height: '520px',
    padding: '40px 32px',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    borderRadius: '32px',
    border: '1.5px solid rgba(14, 165, 233, 0.25)',
    boxShadow: '0 25px 55px rgba(14, 165, 233, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    transformStyle: 'preserve-3d',
    boxSizing: 'border-box',
    overflow: 'hidden',
  } as React.CSSProperties,
  glowEffect: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.03) 0%, transparent 60%)',
    pointerEvents: 'none',
  } as React.CSSProperties,
  tagContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(14, 165, 233, 0.08)',
    border: '1px solid rgba(14, 165, 233, 0.15)',
    padding: '4px 12px',
    borderRadius: '100px',
    marginBottom: '20px',
  } as React.CSSProperties,
  tagPulse: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#0ea5e9',
    boxShadow: '0 0 8px #0ea5e9',
  } as React.CSSProperties,
  tagText: {
    fontSize: '0.65rem',
    fontWeight: 800,
    color: '#0369a1',
    letterSpacing: '0.1em',
  } as React.CSSProperties,
  logoContainer: {
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  } as React.CSSProperties,
  logo: {
    height: '36px',
    width: 'auto',
    objectFit: 'contain',
  } as React.CSSProperties,
  logoFallback: {
    width: '90px',
    height: '36px',
    backgroundColor: '#0ea5e9',
    color: '#fff',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  svgContainer: {
    width: '100%',
    height: '90px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(14, 165, 233, 0.02)',
    borderRadius: '16px',
    border: '1px dashed rgba(14, 165, 233, 0.1)',
  } as React.CSSProperties,
  svg: {
    width: '80%',
    height: '100%',
  } as React.CSSProperties,
  metricsContainer: {
    display: 'flex',
    width: '100%',
    gap: '12px',
    marginBottom: '20px',
  } as React.CSSProperties,
  metricCard: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  } as React.CSSProperties,
  metricLabel: {
    fontSize: '0.6rem',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  metricValue: {
    fontSize: '1.2rem',
    fontWeight: 900,
    color: '#1e3a8a',
  } as React.CSSProperties,
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
    width: '100%',
  } as React.CSSProperties,
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  featureDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: '#0ea5e9',
  } as React.CSSProperties,
  featureText: {
    fontSize: '0.8rem',
    color: '#475569',
    fontWeight: 500,
  } as React.CSSProperties,
  btn: {
    width: '100%',
    height: '46px',
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
    color: '#fff',
    fontWeight: 700,
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(14, 165, 233, 0.25)',
    marginTop: 'auto',
    cursor: 'pointer',
  } as React.CSSProperties,
};