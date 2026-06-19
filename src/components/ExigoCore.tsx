import React, { useState } from 'react';
import { Typography, Badge } from 'antd';
import exigoLogo from '../assets/exigo-logo.png';

const { Title, Text } = Typography;

interface ExigoCoreProps {
  animatedRef: React.RefObject<HTMLDivElement | null>;
}

export default function ExigoCore({ animatedRef }: ExigoCoreProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div ref={animatedRef} style={styles.coreCard}>
      <div style={styles.glowEffect} />
      
      {/* Header Tag */}
      <div style={styles.tagContainer}>
        <span style={styles.tagPulse} />
        <span style={styles.tagText}>CENTRAL HUB CONTROLLER</span>
      </div>

      {/* Logo Container */}
      <div style={styles.logoContainer}>
        {!imgError && exigoLogo ? (
          <img
            src={exigoLogo}
            alt="Exigo Cleantech"
            style={styles.logo}
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={styles.logoFallback}>EXIGO</div>
        )}
      </div>

      <Title level={2} style={styles.title}>
        EXIGO CLEANTECH
      </Title>
      
      <div style={styles.divider} />

      <Text style={styles.description}>
        Unified circular economy lifecycle command center managing asset routing, energy redistribution, and secondary market flow.
      </Text>

      {/* Terminal Readout */}
      <div style={styles.terminal}>
        <div style={styles.terminalHeader}>
          <div style={styles.dotRed} />
          <div style={styles.dotYellow} />
          <div style={styles.dotGreen} />
          <span style={styles.terminalTitle}>Ecosystem Status</span>
        </div>
        <div style={styles.terminalBody}>
          <div style={styles.terminalLine}>
            <span style={styles.termPrompt}>&gt;</span> Data Loops: <span style={styles.termGreen}>ACTIVE (100%)</span>
          </div>
          <div style={styles.terminalLine}>
            <span style={styles.termPrompt}>&gt;</span> BaaS Gateway: <span style={styles.termGreen}>ONLINE</span>
          </div>
          <div style={styles.terminalLine}>
            <span style={styles.termPrompt}>&gt;</span> Liquidations: <span style={styles.termBlue}>ROUTING...</span>
          </div>
          <div style={styles.terminalLine}>
            <span style={styles.termPrompt}>&gt;</span> System Latency: <span style={styles.termYellow}>12ms</span>
          </div>
        </div>
      </div>

      {/* Footer Status */}
      <div style={styles.statusBox}>
        <Badge status="processing" color="#8b5cf6" />
        <span style={styles.statusText}>MAINFRAME RECONCILIATION SECURE</span>
      </div>
    </div>
  );
}

const styles = {
  coreCard: {
    width: '420px',
    height: '520px',
    padding: '40px 32px',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    borderRadius: '32px',
    border: '1.5px solid rgba(139, 92, 246, 0.25)', // Blurry purple-ish glass outline
    boxShadow: '0 25px 55px rgba(139, 92, 246, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.03) 0%, transparent 60%)',
    pointerEvents: 'none',
  } as React.CSSProperties,
  tagContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    border: '1px solid rgba(139, 92, 246, 0.15)',
    padding: '4px 12px',
    borderRadius: '100px',
    marginBottom: '20px',
  } as React.CSSProperties,
  tagPulse: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#8b5cf6',
    boxShadow: '0 0 8px #8b5cf6',
  } as React.CSSProperties,
  tagText: {
    fontSize: '0.65rem',
    fontWeight: 800,
    color: '#6d28d9',
    letterSpacing: '0.1em',
  } as React.CSSProperties,
  logoContainer: {
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  } as React.CSSProperties,
  logo: {
    height: '56px',
    width: 'auto',
    objectFit: 'contain',
  } as React.CSSProperties,
  logoFallback: {
    width: '100px',
    height: '40px',
    backgroundColor: '#8b5cf6',
    color: '#fff',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  title: {
    margin: '0 0 12px 0',
    fontSize: '1.8rem',
    fontWeight: 900,
    color: '#0f172a',
    letterSpacing: '-0.02em',
  } as React.CSSProperties,
  divider: {
    width: '40px',
    height: '2px',
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    marginBottom: '16px',
  } as React.CSSProperties,
  description: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
    color: '#475569',
    textAlign: 'center',
    marginBottom: '24px',
    padding: '0 10px',
  } as React.CSSProperties,
  terminal: {
    width: '100%',
    backgroundColor: '#090d16',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    padding: '12px 16px',
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)',
    marginBottom: '24px',
  } as React.CSSProperties,
  terminalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginBottom: '6px',
  } as React.CSSProperties,
  dotRed: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' },
  dotYellow: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' },
  dotGreen: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' },
  terminalTitle: {
    marginLeft: '6px',
    fontSize: '0.65rem',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  terminalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  } as React.CSSProperties,
  terminalLine: {
    color: '#94a3b8',
    display: 'flex',
    gap: '6px',
  } as React.CSSProperties,
  termPrompt: { color: '#8b5cf6' },
  termGreen: { color: '#10b981', fontWeight: 'bold' },
  termBlue: { color: '#3b82f6' },
  termYellow: { color: '#f59e0b' },
  statusBox: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '8px 16px',
    borderRadius: '100px',
  } as React.CSSProperties,
  statusText: {
    fontSize: '0.65rem',
    fontWeight: 800,
    color: '#475569',
    letterSpacing: '0.05em',
  } as React.CSSProperties,
};
