import { useRef, useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Typography, Tag, Button, Slider, Statistic, Divider } from 'antd';
import {
  SettingOutlined,
  RobotOutlined,
  ShopOutlined,
  LockOutlined,
  FileSearchOutlined,
  BarcodeOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  AlertOutlined,
  FileTextOutlined,
  MobileOutlined
} from '@ant-design/icons';
import { gsap } from 'gsap';
import { LaptopModel3D } from './LaptopModel3D';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// --- Helper Hook for Number Counting Animation ---
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return count;
};

// --- Helper Hook for Scroll Reveals ---
const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};



// --- 3D Mobile Smartphone Component ---
const Smartphone3D = ({
  stage,
  scanProgress,
  activeGrade,
  phoneRef
}: {
  stage: string;
  scanProgress: number;
  activeGrade: string;
  phoneRef: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div className="scene-container">
      <div 
        ref={phoneRef}
        className="phone-pivot preserve-3d"
        style={{
          '--phone-flip': stage === 'intake' ? 180 : 0,
          '--phone-spin': 0,
          '--scan-progress': stage === 'refurbished' ? 100 : scanProgress
        } as React.CSSProperties}
      >
        <div className="phone-card preserve-3d absolute inset-0">
          
          {/* FRONT SIDE: Screen (Visible when flipped face-up) */}
          <div className="phone-front backface-hidden absolute inset-0 rounded-[36px] bg-slate-900 border-[3.5px] border-slate-700/90 p-3 flex flex-col justify-between overflow-hidden">
            <div className="relative w-full h-full rounded-[26px] overflow-hidden bg-slate-950">
              
              {/* Dynamic Island Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-slate-900 border border-slate-800 z-50 flex items-center justify-center opacity-60">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 mr-8" />
                <span className="w-2.5 h-1.5 rounded-full bg-slate-950" />
              </div>

              {/* Screen Layer A: Damaged Display (Clipped bottom-to-top) */}
              <div 
                className="absolute inset-0 bg-slate-900"
                style={{
                  clipPath: stage === 'scanning' ? `inset(${scanProgress}% 0 0 0)` : 'none',
                  opacity: stage === 'refurbished' ? 0 : 1,
                  transition: 'opacity 0.4s ease'
                }}
              >
                {/* Cracking outline overlay */}
                <svg viewBox="0 0 216 396" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0" y="0" width="216" height="396" fill="#1e293b" opacity="0.3" />
                  <g stroke="#f87171" strokeWidth="2.5" fill="none" opacity="0.85">
                    <path d="M 30,80 L 100,160 L 80,220 L 150,280 L 120,340" />
                    <path d="M 180,110 L 140,180 L 160,240 L 120,310" />
                  </g>
                </svg>
              </div>

              {/* Screen Layer B: High-Tech X-Ray Internals (Clipped top-to-bottom) */}
              <div 
                className="absolute inset-0 bg-[#020617]"
                style={{
                  clipPath: stage === 'scanning' ? `inset(0 0 ${100 - scanProgress}% 0)` : 'none',
                  opacity: stage === 'refurbished' ? 0 : (stage === 'scanning' ? 0.9 : 0),
                  transition: 'opacity 0.4s ease'
                }}
              >
                <svg viewBox="0 0 216 396" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Traces */}
                  <g stroke="#0ea5e9" strokeWidth="1" fill="none" opacity="0.75">
                    <path d="M 40,60 L 108,60 L 108,120" />
                    <path d="M 176,60 L 108,60 M 108,160 L 108,210" />
                    <path d="M 40,320 L 80,360 L 108,360" />
                    <path d="M 176,320 L 136,360 L 108,360" />
                  </g>
                  {/* Processor Chip */}
                  <rect x="78" y="90" width="60" height="60" rx="8" fill="#1e293b" stroke="#00f0ff" strokeWidth="1.5" />
                  <text x="108" y="125" fill="#00f0ff" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">A15 BIONIC</text>
                  {/* Battery Matrix Block */}
                  <rect x="40" y="170" width="136" height="130" rx="8" fill="#090d16" stroke="#0ea5e9" strokeWidth="1.2" />
                  <text x="108" y="240" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle" opacity="0.8">POWER PACK</text>
                  <line x1="40" y1="210" x2="176" y2="210" stroke="#1e293b" />
                  <line x1="40" y1="250" x2="176" y2="250" stroke="#1e293b" />
                </svg>
              </div>

              {/* Screen Layer C: Pristine Rebuilt Display (Fades in) */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6 text-center border border-slate-200"
                style={{
                  opacity: stage === 'refurbished' ? 1 : 0,
                  transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <CheckCircleOutlined style={{ color: '#10b981', fontSize: '38px', marginBottom: '12px' }} />
                <span className="font-mono text-xs font-bold text-slate-900 tracking-wider">DIAGNOSTICS PASS</span>
                <span className="font-mono text-[9px] text-slate-500 mt-2">GRADE {activeGrade} APPROVED</span>
              </div>

              {/* Inside Hinge Scanning Laser Beam (Translates down phone display) */}
              {stage === 'scanning' && (
                <div 
                  className="absolute left-0 right-0 h-[3px] bg-[#0284c7] pointer-events-none rounded-full"
                  style={{
                    transform: `translate3d(0, calc(${scanProgress} * 396px / 100), 0)`,
                    boxShadow: '0 0 10px 2px rgba(2, 132, 199, 0.8), 0 0 20px 4px rgba(2, 132, 199, 0.4)',
                    top: 0,
                    zIndex: 50,
                    willChange: 'transform'
                  }}
                />
              )}
            </div>
          </div>

          {/* BACK SIDE: Outer Phone Cover Casing (Visible when face-down) */}
          <div className="phone-back backface-hidden absolute inset-0 rounded-[36px] bg-slate-100 border-[3.5px] border-slate-300 p-8 flex flex-col justify-between items-center shadow-inner" style={{ transform: 'rotateY(180deg)' }}>
            
            {/* Camera Housing */}
            <div className="w-16 h-16 rounded-[18px] bg-white border border-slate-200 shadow-sm flex flex-wrap p-2 gap-1.5 justify-center items-center">
              <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-900" />
              <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-900" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center bg-white">
                <MobileOutlined style={{ fontSize: '16px', color: '#64748b' }} />
              </div>
              <span className="font-mono text-[9px] text-slate-400 tracking-wider">NODE STREAM PORTAL</span>
            </div>

            {/* Back casing fractures */}
            {stage !== 'refurbished' && (
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 20,40 L 50,80 L 30,120" stroke="#f87171" strokeWidth="2.5" fill="none" opacity="0.65" />
                <path d="M 80,60 L 60,30" stroke="#f87171" strokeWidth="2" fill="none" opacity="0.65" />
              </svg>
            )}
            
            <div className="w-20 h-1 bg-slate-300 rounded-full mb-2" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default function QwikPage() {
  const [pipelineState, setPipelineState] = useState<'intake' | 'scanning' | 'refurbished'>('intake');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [activeGrade, setActiveGrade] = useState<string>('A');
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['[SYSTEM]: Awaiting bulk asset ingestion batch...']);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Interactive slider states
  const [deviceCount, setDeviceCount] = useState<number>(1000);

  // Refs for targeting 3D animations
  const laptopRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // GSAP Timeline Ref
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Scroll Reveal triggers
  const stepsReveal = useScrollReveal();
  const calcReveal = useScrollReveal();
  const techReveal = useScrollReveal();
  const impactReveal = useScrollReveal();
  const footerReveal = useScrollReveal();

  // Impact statistics counters
  const ewasteCount = useCountUp(impactReveal.isVisible ? 14500 : 0, 2500);
  const co2Count = useCountUp(impactReveal.isVisible ? 8200 : 0, 2500);
  const capitalCount = useCountUp(impactReveal.isVisible ? 124 : 0, 2500);

  // 1. Viewport Tracker for Screen Resizes (Responsive Swapping)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Intersection Observer to Free Up CPU Loop Cycles
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 3. Pause GSAP Timeline when page is outside the viewport
  useEffect(() => {
    if (timelineRef.current) {
      if (isVisible) {
        timelineRef.current.play();
      } else {
        timelineRef.current.pause();
      }
    }
  }, [isVisible]);

  // 4. Clean up GSAP timelines on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // Sync ref values on viewport swap or state changes
  useEffect(() => {
    if (!isMobile && laptopRef.current) {
      gsap.set(laptopRef.current, {
        '--lid-rot': pipelineState === 'intake' ? -90 : -15,
        '--laptop-spin': 0,
        '--scan-progress': pipelineState === 'refurbished' ? 100 : (pipelineState === 'intake' ? 0 : scanProgress)
      });
    } else if (isMobile && phoneRef.current) {
      gsap.set(phoneRef.current, {
        '--phone-flip': pipelineState === 'intake' ? 180 : 0,
        '--phone-spin': 0,
        '--scan-progress': pipelineState === 'refurbished' ? 100 : (pipelineState === 'intake' ? 0 : scanProgress)
      });
    }
  }, [isMobile, pipelineState]);

  // Auto-scroll log console
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Trigger automated scanning and cinematic transformation pipeline
  const startScanSequence = () => {
    if (pipelineState === 'scanning') return;
    setPipelineState('scanning');
    setScanProgress(0);
    setTerminalLogs(['[SYSTEM]: Loading hardware diagnostic profile...', '// HANDSHAKE CONNECTED']);

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setPipelineState('refurbished');
        setTerminalLogs(curr => [...curr, `✅ [SUCCESS]: Asset verified. Grade ${activeGrade} allocated. Workspace stable.`]);
      }
    });

    timelineRef.current = tl;

    const logsTimeline = [
      { p: 15, msg: '⏳ [STAGE 01]: Pinout integrity scan active...' },
      { p: 35, msg: '🔒 [STAGE 02]: Executing NIST SP 800-88 Compliant Wipe... Initiated' },
      { p: 55, msg: '⚡ [STAGE 03]: Logic board component array testing...' },
      { p: 75, msg: '🔋 [STAGE 04]: Analyzing battery storage capacity thresholds...' },
      { p: 90, msg: '🔒 [STAGE 05]: Data Sanitization: NIST SP 800-88 Compliant Wipe... Passed' },
      { p: 95, msg: '✨ [STAGE 06]: Allocating market optimization yield matrix...' },
    ];

    if (!isMobile) {
      // 1. Actuate Hinge (Open lid from -90 to -15deg)
      tl.to(laptopRef.current, {
        '--lid-rot': -15,
        duration: 1.2,
        ease: 'power2.out',
        onStart: () => {
          setTerminalLogs(curr => [...curr, '⏳ [STAGE 01]: Actuating lid mechanical hinge assembly...']);
        }
      })
      // 2. Scan Screen (Animate progress 0 to 100)
      .to(laptopRef.current, {
        '--scan-progress': 100,
        duration: 3.5,
        ease: 'none',
        onUpdate: function() {
          const progress = Math.round(this.progress() * 100);
          setScanProgress(progress);
          
          const trigger = logsTimeline.find(l => Math.abs(l.p - progress) < 2);
          if (trigger) {
            setTerminalLogs(curr => {
              if (curr.includes(trigger.msg)) return curr;
              return [...curr, trigger.msg];
            });
          }
        }
      })
      // 3. Cinematic Rotation (Spin 0 to 360deg)
      .to(laptopRef.current, {
        '--laptop-spin': 360,
        duration: 2.0,
        ease: 'power2.inOut',
        onStart: () => {
          setTerminalLogs(curr => [...curr, '✨ [STAGE 03]: Triggering chassis rebirth & cinematic rotation...']);
        }
      });
    } else {
      // 1. 3D Casing Flip (Rotate from 180 to 0deg)
      tl.to(phoneRef.current, {
        '--phone-flip': 0,
        duration: 1.0,
        ease: 'power2.out',
        onStart: () => {
          setTerminalLogs(curr => [...curr, '⏳ [STAGE 01]: Executing 3D mechanical chassis flip...']);
        }
      })
      // 2. Scan Screen (Animate progress 0 to 100)
      .to(phoneRef.current, {
        '--scan-progress': 100,
        duration: 3.2,
        ease: 'none',
        onUpdate: function() {
          const progress = Math.round(this.progress() * 100);
          setScanProgress(progress);

          const trigger = logsTimeline.find(l => Math.abs(l.p - progress) < 2);
          if (trigger) {
            setTerminalLogs(curr => {
              if (curr.includes(trigger.msg)) return curr;
              return [...curr, trigger.msg];
            });
          }
        }
      })
      // 3. Cinematic Rotation (Spin 0 to 360deg)
      .to(phoneRef.current, {
        '--phone-spin': 360,
        duration: 1.8,
        ease: 'power2.inOut',
        onStart: () => {
          setTerminalLogs(curr => [...curr, '✨ [STAGE 03]: Triggering chassis rebirth & cinematic rotation...']);
        }
      });
    }
  };

  const resetSequence = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    setPipelineState('intake');
    setScanProgress(0);
    setTerminalLogs(['[SYSTEM]: Awaiting bulk asset ingestion batch...']);
    
    if (!isMobile && laptopRef.current) {
      gsap.set(laptopRef.current, {
        '--laptop-rx': 43,
        '--laptop-ry': 0,
        '--laptop-rz': -20,
        '--scan-progress': 0
      });
    } else if (isMobile && phoneRef.current) {
      gsap.set(phoneRef.current, {
        '--phone-flip': 180,
        '--phone-spin': 0,
        '--scan-progress': 0
      });
    }
  };

  const forceClearSequence = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    setPipelineState('refurbished');
    setScanProgress(100);
    setTerminalLogs(curr => [...curr, `✅ [SUCCESS]: Bypass authorization verified. Grade ${activeGrade} allocated.`]);
    
    if (!isMobile && laptopRef.current) {
      gsap.set(laptopRef.current, {
        '--laptop-rx': 20,
        '--laptop-ry': 0,
        '--laptop-rz': 0,
        '--scan-progress': 100
      });
    } else if (isMobile && phoneRef.current) {
      gsap.set(phoneRef.current, {
        '--phone-flip': 0,
        '--phone-spin': 0,
        '--scan-progress': 100
      });
    }
  };

  return (
    <Content style={{ backgroundColor: '#f8fafc', overflowX: 'hidden', fontFamily: 'Outfit, Inter, system-ui, sans-serif' }}>
      <style>
        {`
        /* High-fidelity Blueprint Background Gradient Pattern */
        .blueprint-bg {
          background-color: #faf8ff;
          background-image: 
            linear-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.04) 1px, transparent 1px),
            linear-gradient(rgba(139, 92, 246, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.015) 1px, transparent 1px);
          background-size: 80px 80px, 80px 80px, 16px 16px, 16px 16px;
          background-position: center center;
        }

        /* Premium Frosted Glass Panel class */
        .frosted-panel {
          background: rgba(250, 245, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1.5px solid rgba(167, 139, 250, 0.35);
          box-shadow: 0 10px 30px -10px rgba(107, 33, 168, 0.08);
          border-radius: 24px;
          transition: all 0.4s ease;
        }

        .frosted-panel:hover {
          background: rgba(250, 245, 255, 0.95);
          box-shadow: 0 15px 35px -10px rgba(107, 33, 168, 0.15);
          border-color: rgba(167, 139, 250, 0.6);
        }

        /* 3D Scene Viewport Board styling */
        .blueprint-board-3d {
          position: relative;
          width: 100%;
          max-width: 560px;
          min-height: 480px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 36px;
          border-radius: 32px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          perspective: 1000px;
          perspective-origin: center center;
        }

        /* preserve-3d enabling */
        .laptop-pivot, .laptop-base, .laptop-lid, .phone-pivot, .phone-card {
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
        }

        /* backface visibility settings */
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /* Laptop 3D layout coordinates */
        .laptop-pivot {
          position: relative;
          width: 380px;
          height: 240px;
          transform: rotateX(22deg) rotateY(calc(var(--laptop-spin, 0) * 1deg));
          will-change: transform;
        }

        .laptop-base {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 380px;
          height: 240px;
          margin-left: -190px;
          margin-top: 0px;
          transform-origin: top center;
          transform: rotateX(90deg);
        }

        .laptop-lid {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 380px;
          height: 240px;
          margin-left: -190px;
          margin-top: -240px;
          transform-origin: bottom center;
          transform: rotateX(calc(var(--lid-rot, -90) * 1deg));
          will-change: transform;
        }

        /* Phone 3D layout coordinates */
        .phone-pivot {
          position: relative;
          width: 240px;
          height: 440px;
          transform: rotateX(20deg) rotateY(calc(var(--phone-spin, 0) * 1deg));
          will-change: transform;
        }

        .phone-card {
          position: absolute;
          inset: 0;
          transform: rotateY(calc(var(--phone-flip, 180) * 1deg));
          will-change: transform;
        }

        .phone-front {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
        }

        .phone-back {
          position: absolute;
          inset: 0;
          transform: rotateY(180deg);
          backface-visibility: hidden;
        }

        /* Device wrapper heights matching target silhouette shapes */
        :root {
          --device-height: 240px;
        }
        @media (max-width: 768px) {
          :root {
            --device-height: 440px;
          }
        }

        /* Elastic Stamp Bounce Effect */
        @keyframes elasticStamp {
          0% {
            opacity: 0;
            transform: translate3d(-50%, -50%, 0) scale(0.1) rotate(-45deg);
          }
          70% {
            transform: translate3d(-50%, -50%, 0) scale(1.25) rotate(-10deg);
          }
          100% {
            opacity: 1;
            transform: translate3d(-50%, -50%, 0) scale(1) rotate(-8deg);
          }
        }
        .stamp-bounce {
          animation: elasticStamp 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes float {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); }
          33% { transform: translate3d(15px, -15px, 0) rotate(3deg); }
          66% { transform: translate3d(-15px, 15px, 0) rotate(-3deg); }
          100% { transform: translate3d(0, 0, 0) rotate(0deg); }
        }

        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translate3d(0, 30px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        
        .hero-text { animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }

        .stagger-text {
          opacity: 0;
          transform: translate3d(0, 20px, 0);
        }
        .visible .stagger-text {
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .visible .stagger-1 { animation-delay: 0.05s; }
        .visible .stagger-2 { animation-delay: 0.1s; }
        .visible .stagger-3 { animation-delay: 0.15s; }
        .visible .stagger-4 { animation-delay: 0.2s; }
        .visible .stagger-5 { animation-delay: 0.25s; }

        .reveal-card { transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); opacity: 0; transform: translate3d(0, 40px, 0); }
        .reveal-card.visible { opacity: 1; transform: translate3d(0, 0, 0); }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 2px;
        }
        
        .custom-pipeline-slider .ant-slider-track {
          background-color: #0284c7 !important;
        }
        .custom-pipeline-slider .ant-slider-handle::after {
          box-shadow: 0 0 0 2px #0284c7 !important;
        }
        `}
      </style>

      {/* HERO SECTION */}
      <div style={{ padding: '140px 24px 80px 24px', position: 'relative', overflow: 'hidden' }} className="blueprint-bg">
        <svg style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.15, zIndex: 0, animation: 'float 10s ease-in-out infinite', pointerEvents: 'none' }} width="350" height="350" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="8 8" />
          <circle cx="100" cy="100" r="50" fill="rgba(14, 165, 233, 0.06)" />
        </svg>

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div className="hero-text delay-1">
            <Tag style={{ padding: '8px 24px', borderRadius: '24px', fontWeight: 800, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '13px', letterSpacing: '1px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)' }}>
              <ThunderboltOutlined style={{ marginRight: '6px', color: '#0284c7' }} /> QWIKSELL DIAGNOSTIC PORTAL
            </Tag>
          </div>
          <Title level={1} className="hero-text delay-2" style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)', fontWeight: 900, color: '#0f172a', margin: '28px 0 20px 0', lineHeight: '1.15', letterSpacing: '-0.03em' }}>
            Enterprise Asset Decommissioning, <br />
            <span style={{ background: 'linear-gradient(90deg, #0284c7, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Fast, Sanitized, and Compliant.
            </span>
          </Title>
          <Paragraph className="hero-text delay-3" style={{ fontSize: '1.2rem', color: '#475569', maxWidth: '800px', margin: '0 auto 36px auto', lineHeight: '1.75' }}>
            Transform aging corporate inventory into liquid capital. Our automated diagnostics system validates hardware, sanitizes internal drives to secure standards, and delivers instant, competitive market buyback returns.
          </Paragraph>
          <div className="hero-text delay-4" style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Button type="primary" size="large" style={{ background: '#0f172a', border: 'none', height: '56px', padding: '0 36px', fontSize: '16px', fontWeight: 700, borderRadius: '28px', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)' }} onClick={() => {
              if (pipelineRef.current) {
                pipelineRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }}>
              Decommission Now
            </Button>
            <Button size="large" style={{ height: '56px', padding: '0 36px', fontSize: '16px', fontWeight: 700, borderRadius: '28px', border: '1.5px solid #cbd5e1', color: '#0f172a', background: 'transparent' }}>
              Audit Compliance Flow
            </Button>
          </div>
        </div>
      </div>

      {/* CSS-DRIVEN MARQUEE */}
      <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', background: '#ffffff', padding: '16px 0', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex' }}>
        <div style={{ display: 'flex', width: '200%', animation: 'marquee 30s linear infinite' }}>
          <div style={{ display: 'flex', flexShrink: 0, width: '50%', justifyContent: 'space-around', alignItems: 'center' }}>
            {['NIST SP 800-88 COMPLIANT WIPING', 'THINKPAD MARKET LIQUIDITY +4.2%', 'GRADE A APPROVAL RATES INCREASED', 'REAL-TIME DATA AUDITING ACTIVE', 'ISO 14001 ECO-RECOVERY VERIFIED'].map((txt, i) => (
              <span key={i} style={{ fontSize: '12.5px', fontWeight: 800, color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                <GlobalOutlined style={{ marginRight: '8px', color: '#0284c7' }} /> {txt}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', flexShrink: 0, width: '50%', justifyContent: 'space-around', alignItems: 'center' }}>
            {['NIST SP 800-88 COMPLIANT WIPING', 'THINKPAD MARKET LIQUIDITY +4.2%', 'GRADE A APPROVAL RATES INCREASED', 'REAL-TIME DATA AUDITING ACTIVE', 'ISO 14001 ECO-RECOVERY VERIFIED'].map((txt, i) => (
              <span key={`dup-${i}`} style={{ fontSize: '12.5px', fontWeight: 800, color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                <GlobalOutlined style={{ marginRight: '8px', color: '#0284c7' }} /> {txt}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CORE INTERACTIVE PIPELINE */}
      <div ref={pipelineRef} style={{ padding: '100px 24px', maxWidth: '1360px', margin: '0 auto', position: 'relative' }}>
        <Row gutter={[48, 48]} align="middle">
          
          {/* Left Column: Diagnostics Control Panel */}
          <Col xs={24} lg={11}>
            <div className="frosted-panel" style={{ padding: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <div>
                  <Title level={3} style={{ margin: 0, color: '#0f172a', fontWeight: 900, fontSize: '22px' }}>Diagnostic Pipeline</Title>
                  <Text style={{ color: '#64748b', fontSize: '12.5px', fontFamily: 'monospace', fontWeight: 600 }}>LIQUIDATION CONSOLE v4.2</Text>
                </div>
                
                {pipelineState === 'intake' && (
                  <Tag color="warning" icon={<SyncOutlined spin />} style={{ padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
                    AWAITING INPUT
                  </Tag>
                )}
                {pipelineState === 'scanning' && (
                  <Tag color="processing" icon={<SyncOutlined spin />} style={{ padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
                    SCANNING...
                  </Tag>
                )}
                {pipelineState === 'refurbished' && (
                  <Tag color="success" icon={<CheckCircleOutlined />} style={{ padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
                    PIPELINE PASS
                  </Tag>
                )}
              </div>

              {/* Warning Ticker Header */}
              <div className="w-full flex items-center justify-between bg-amber-50/60 border border-amber-100 rounded-lg p-3 mb-6 animate-pulse">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-mono">
                  <AlertOutlined /> <span>BATCH LOCK: INCOMING LIQUIDATION BATCH</span>
                </div>
                <Tag color="amber" className="font-mono text-[10px] m-0">ACTIVE</Tag>
              </div>

              {/* Step Selection Grid Controllers */}
              <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-3">Pipeline Stage Selectors</h3>
              <div className="grid grid-cols-3 gap-2 mb-6">
                <Button 
                  type={pipelineState === 'intake' ? 'primary' : 'default'}
                  onClick={resetSequence}
                  className={`font-mono text-xs rounded-xl h-10 flex items-center justify-center ${pipelineState === 'intake' ? 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800' : ''}`}
                >
                  1. Intake
                </Button>
                <Button 
                  type={pipelineState === 'scanning' ? 'primary' : 'default'}
                  onClick={startScanSequence}
                  disabled={pipelineState === 'scanning'}
                  className={`font-mono text-xs rounded-xl h-10 flex items-center justify-center ${pipelineState === 'scanning' ? 'bg-sky-600 border-sky-600 text-white' : ''}`}
                >
                  2. Scan
                </Button>
                <Button 
                  type={pipelineState === 'refurbished' ? 'primary' : 'default'}
                  onClick={forceClearSequence}
                  className={`font-mono text-xs rounded-xl h-10 flex items-center justify-center ${pipelineState === 'refurbished' ? 'bg-emerald-600 border-emerald-600 text-white' : ''}`}
                >
                  3. Clear
                </Button>
              </div>

              {/* Matrix Block Real-Time Eraser Simulator */}
              <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-2">Memory Block Invalidation Matrix</h3>
              <div className="grid grid-cols-10 gap-1.5 mb-6 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
                {Array.from({ length: 40 }).map((_, idx) => {
                  const triggerThreshold = (idx / 40) * 100;
                  const isCleared = scanProgress > triggerThreshold || pipelineState === 'refurbished';
                  const isCurrent = pipelineState === 'scanning' && Math.abs(scanProgress - triggerThreshold) < 8;
                  return (
                    <div 
                      key={idx}
                      className="aspect-square rounded-sm transition-all duration-300"
                      style={{
                        backgroundColor: isCleared ? '#10b981' : isCurrent ? '#0284c7' : '#ef4444',
                        opacity: isCleared ? 0.85 : isCurrent ? 1 : 0.25,
                        boxShadow: isCurrent ? '0 0 6px #38bdf8' : 'none'
                      }}
                    />
                  );
                })}
              </div>

              {/* Condition Yield Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-slate-500">Target Re-Commerce Grading Max Allocation</span>
                  <span className="text-xs font-bold font-mono text-slate-800">Grade {activeGrade} APPROVED</span>
                </div>
                <Slider 
                  min={1} 
                  max={4} 
                  step={1} 
                  value={activeGrade === 'A' ? 4 : activeGrade === 'B' ? 3 : activeGrade === 'C' ? 2 : 1}
                  onChange={(val) => {
                    const grades = ['D', 'C', 'B', 'A'];
                    setActiveGrade(grades[val - 1]);
                  }}
                  tooltip={{ open: false }}
                  className="custom-pipeline-slider"
                />
              </div>

              {/* Control Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {pipelineState !== 'scanning' ? (
                  <Button
                    type="primary"
                    size="large"
                    icon={<SyncOutlined />}
                    onClick={startScanSequence}
                    style={{
                      flex: 1,
                      height: '52px',
                      borderRadius: '26px',
                      background: 'linear-gradient(90deg, #0284c7, #2563eb)',
                      border: 'none',
                      fontWeight: 800,
                      boxShadow: '0 8px 20px -4px rgba(2, 132, 199, 0.3)'
                    }}
                  >
                    {pipelineState === 'refurbished' ? 'RE-SCAN DEVICE' : 'INITIATE LASER SCAN'}
                  </Button>
                ) : (
                  <Button
                    danger
                    size="large"
                    onClick={resetSequence}
                    style={{
                      flex: 1,
                      height: '52px',
                      borderRadius: '26px',
                      fontWeight: 800
                    }}
                  >
                    ABORT SEQUENCE
                  </Button>
                )}
                
                {pipelineState === 'refurbished' && (
                  <Button
                    size="large"
                    onClick={resetSequence}
                    style={{
                      flex: 1,
                      height: '52px',
                      borderRadius: '26px',
                      fontWeight: 800,
                      border: '1.5px solid #cbd5e1',
                      color: '#0f172a',
                      background: '#ffffff'
                    }}
                  >
                    INTAKE NEXT
                  </Button>
                )}
              </div>
            </div>
          </Col>

          {/* Right Column: High-FPS Device Silhouette Showcase */}
          <Col xs={24} lg={13} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="blueprint-board-3d blueprint-bg">
              
              {/* Dynamic device components unmount/mount wrapper */}
              {isMobile ? (
                <Smartphone3D stage={pipelineState} scanProgress={scanProgress} activeGrade={activeGrade} phoneRef={phoneRef} />
              ) : (
                <div 
                  ref={laptopRef}
                  className="laptop-pivot flex items-center justify-center"
                  style={{
                    width: '100%',
                    height: '400px',
                    position: 'relative',
                    transform: 'none',
                    '--laptop-rx': pipelineState === 'intake' ? 43 : 20,
                    '--laptop-ry': 0,
                    '--laptop-rz': pipelineState === 'intake' ? -20 : 0
                  } as React.CSSProperties}
                >
                  <LaptopModel3D 
                    stage={pipelineState === 'intake' ? 'closed' : (pipelineState === 'scanning' ? 'scanning' : 'rebuilt')}
                    scanProgress={scanProgress}
                    activeGrade={activeGrade}
                    terminalLogs={terminalLogs}
                  />
                </div>
              )}

              {/* "GRADE PASSED" Ink Condition Stamp (Placed outside the 3D transforms to stay absolute front) */}
              {pipelineState === 'refurbished' && (
                <div 
                  className="absolute z-40 bg-white/95 border-4 border-emerald-500 text-emerald-500 font-black px-6 py-3 rounded-xl text-xl uppercase tracking-widest pointer-events-none stamp-bounce"
                  style={{
                    top: isMobile ? '40%' : '35%',
                    left: isMobile ? '25%' : '38%',
                    boxShadow: '0 12px 28px rgba(16, 185, 129, 0.45)',
                    fontFamily: 'monospace'
                  }}
                >
                  GRADE {activeGrade} PASSED
                </div>
              )}

            </div>
          </Col>
        </Row>

        {/* Linux Style Real-time Status Log Stream Terminal */}
        <div className="w-full mt-6">
          <Card 
            className="rounded-2xl bg-slate-950 border border-slate-900 p-4 shadow-inner relative"
            styles={{ body: { padding: 0 } }}
          >
            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
              <span className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                <FileTextOutlined /> CORE SYSTEM DIAGNOSTIC OUTPUT
              </span>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
              </div>
            </div>
            <div className="h-40 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300 scrollbar-thin custom-scrollbar">
              {terminalLogs.map((log, i) => (
                <div key={i} className={`mb-1 ${log.includes('✅') ? 'text-emerald-400' : log.includes('⏳') ? 'text-sky-400' : 'text-slate-300'}`}>
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </Card>
        </div>
      </div>

      {/* PROCESS PROGRESSION / STEPS DETAILED */}
      <div ref={stepsReveal.ref} className={stepsReveal.isVisible ? 'visible' : ''} style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <Tag color="blue" style={{ marginBottom: '16px', fontWeight: 800 }}>COMPLIANCE ARCHITECTURE</Tag>
          <Title level={2} style={{ fontWeight: 800, color: '#0f172a', margin: 0, fontSize: '32px' }}>Operational Security Standards</Title>
          <Paragraph style={{ color: '#475569', fontSize: '15px', marginTop: '12px' }}>
            How we process and assure physical validation, data eradication, and remarketing pathways.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {[
            { title: 'Intake Inspection', icon: <BarcodeOutlined />, desc: 'Lot validation, barcoding, and logging physical anomalies on secondary frames.' },
            { title: 'NIST Sanitization', icon: <LockOutlined />, desc: 'Certified logical wipe conforming strictly to NIST SP 800-88 storage clearing rules.' },
            { title: 'Market Diagnostics', icon: <SettingOutlined />, desc: 'Over 50 components checked via logic ports to determine structural and parts valuation.' },
            { title: 'Recommerce Pipeline', icon: <ShopOutlined />, desc: 'Distribution to verified recycling and business recovery partners for eco-friendly return.' }
          ].map((step, idx) => (
            <Col xs={24} md={12} lg={6} key={idx} className={`reveal-card ${stepsReveal.isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${idx * 0.1}s` }}>
              <div className="frosted-panel" style={{ padding: '28px', height: '100%', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '24px', color: '#0284c7', marginBottom: '20px', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', background: '#f0f9ff', border: '1px solid #e0f2fe' }}>
                  {step.icon}
                </div>
                <h5 style={{ fontWeight: 800, color: '#0f172a', fontSize: '17px', marginBottom: '8px' }}>{step.title}</h5>
                <span style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6', display: 'block' }}>{step.desc}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* ROI SLIDER WIDGET */}
      <div ref={calcReveal.ref} className={calcReveal.isVisible ? 'visible' : ''} style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '100px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div className="stagger-text stagger-1">
            <Tag style={{ marginBottom: '16px', background: '#f0f9ff', border: '1px solid #e0f2fe', color: '#0284c7', padding: '4px 16px', borderRadius: '20px', fontWeight: 800 }}>ESTIMATOR WIDGET</Tag>
          </div>
          <div className="stagger-text stagger-2">
            <Title level={2} style={{ color: '#0f172a', fontWeight: 800, fontSize: '32px', marginBottom: '12px' }}>Estimate Your Buyback Value</Title>
          </div>
          <div className="stagger-text stagger-3">
            <Paragraph style={{ color: '#475569', fontSize: '15px', marginBottom: '48px' }}>Determine the financial returns for recycling your aging device lots.</Paragraph>
          </div>

          <div className="frosted-panel stagger-text stagger-4" style={{ padding: '36px' }}>
            <Title level={5} style={{ color: '#0f172a', marginBottom: '32px', fontWeight: 800, letterSpacing: '0.5px' }}>NUMBER OF DEVICES TO RECYCLE</Title>

            <Slider
              min={100} max={10000} step={50}
              value={deviceCount} onChange={setDeviceCount}
              tooltip={{ formatter: val => `${val} Devices` }}
              trackStyle={{ background: '#0284c7', height: '6px' }}
              handleStyle={{ borderColor: '#0284c7', width: '22px', height: '22px', marginTop: '-8px', backgroundColor: '#fff' }}
              railStyle={{ background: '#cbd5e1', height: '6px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontWeight: 700, marginTop: '16px' }}>
              <span>100 Units</span>
              <span style={{ color: '#0284c7', fontSize: '20px', fontWeight: 800 }}>{deviceCount.toLocaleString()} Selected</span>
              <span>10k+ Units</span>
            </div>

            <Divider style={{ borderColor: '#e2e8f0', margin: '36px 0' }} />

            <Row gutter={[24, 24]} justify="center">
              <Col xs={24} md={12}>
                <Text style={{ color: '#64748b', fontWeight: 700, letterSpacing: '1px', fontSize: '12px' }}>ESTIMATED RETURN (USD)</Text>
                <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.8rem)', fontWeight: 900, color: '#10b981', lineHeight: 1.1, marginTop: '8px' }}>
                  ${((deviceCount * 245) / 1000).toFixed(1)}k
                </div>
              </Col>
              <Col xs={24} md={12}>
                <Text style={{ color: '#64748b', fontWeight: 700, letterSpacing: '1px', fontSize: '12px' }}>AUDIT COMPLETION DURATION</Text>
                <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.8rem)', fontWeight: 900, color: '#0f172a', lineHeight: 1.1, marginTop: '8px' }}>
                  {Math.max(2, Math.ceil(deviceCount / 1000))} Days
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      {/* FEATURE GRID */}
      <div ref={techReveal.ref} className={techReveal.isVisible ? 'visible' : ''} style={{ padding: '100px 24px', maxWidth: '1360px', margin: '0 auto' }}>
        <div className="stagger-text stagger-1" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <Title level={2} style={{ fontWeight: 900, fontSize: '32px', color: '#0f172a' }}>Engineered for Enterprise Scale</Title>
          <Paragraph style={{ fontSize: '15px', color: '#475569', marginTop: '10px' }}>Comprehensive systems covering operations, security, and sustainability.</Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {[
            { title: 'Precision Component Check', icon: <FileSearchOutlined />, desc: 'Systematically assesses structural integrity and tests all vital device processors.' },
            { title: 'High-Demand Reselling', icon: <RobotOutlined />, desc: 'Locks in competitive asset returns utilizing real-time secondary market index feeds.' },
            { title: 'Coordinated Logistics', icon: <BarcodeOutlined />, desc: 'Trackable device collections directly from bulk office sites to secure testing vaults.' },
            { title: 'Vetted Downstream Network', icon: <ShopOutlined />, desc: 'Reduces brand liabilities by channeling inventory exclusively to certified end-buyers.' },
            { title: 'Greenhouse Gas Reports', icon: <LockOutlined />, desc: 'Provides certificates for environmental compliance detailing offsets of carbon footprints.' },
            { title: 'Centralized Fleet Scanner', icon: <SettingOutlined />, desc: 'Inspects and calculates values of thousands of client workstations on a single portal.' }
          ].map((item, idx) => (
            <Col xs={24} md={12} lg={8} key={idx} className={`reveal-card ${techReveal.isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${(idx * 0.08) + 0.2}s` }}>
              <div className="frosted-panel" style={{ height: '100%', padding: '32px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '28px', color: '#0284c7', marginBottom: '20px', background: '#f0f9ff', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', border: '1px solid #e0f2fe' }}>
                  {item.icon}
                </div>
                <h5 style={{ fontWeight: 800, color: '#0f172a', fontSize: '18px', marginBottom: '10px' }}>{item.title}</h5>
                <span style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.65', display: 'block' }}>{item.desc}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* IMPACT STATISTICS */}
      <div ref={impactReveal.ref} className={impactReveal.isVisible ? 'visible' : ''} style={{ padding: '80px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div className="stagger-text stagger-1">
            <Title level={4} style={{ fontWeight: 800, color: '#64748b', marginBottom: '48px', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px' }}>Audited Global Sustainability Metrics</Title>
          </div>
          <Row gutter={[32, 32]} className="stagger-text stagger-2">
            <Col xs={24} md={8}>
              <Statistic title={<span style={{ color: '#475569', fontWeight: 700, letterSpacing: '0.5px', fontSize: '13px' }}>POUNDS OF E-WASTE RETRIEVED</span>} value={ewasteCount} valueStyle={{ fontSize: '3.6rem', fontWeight: 900, color: '#10b981', fontFamily: 'monospace' }} formatter={(val) => Number(val).toLocaleString()} />
            </Col>
            <Col xs={24} md={8}>
              <Statistic title={<span style={{ color: '#475569', fontWeight: 700, letterSpacing: '0.5px', fontSize: '13px' }}>CO2 EQUIVALENT PREVENTED (TONS)</span>} value={co2Count} valueStyle={{ fontSize: '3.6rem', fontWeight: 900, color: '#0284c7', fontFamily: 'monospace' }} formatter={(val) => Number(val).toLocaleString()} />
            </Col>
            <Col xs={24} md={8}>
              <Statistic title={<span style={{ color: '#475569', fontWeight: 700, letterSpacing: '0.5px', fontSize: '13px' }}>LIQUID CAPITAL RETURNED TO CLIENTS</span>} value={capitalCount / 10} valueStyle={{ fontSize: '3.6rem', fontWeight: 900, color: '#2563eb', fontFamily: 'monospace' }} precision={1} prefix="$" suffix="M" />
            </Col>
          </Row>
        </div>
      </div>

      {/* FOOTER CTA */}
      <div ref={footerReveal.ref} className={footerReveal.isVisible ? 'visible' : ''} style={{ padding: '140px 24px', textAlign: 'center', background: '#ffffff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="stagger-text stagger-1">
            <Title level={1} style={{ fontSize: 'clamp(2.4rem, 4.8vw, 4rem)', fontWeight: 900, color: '#0f172a', marginBottom: '24px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Begin Liquidating Idle Tech <span style={{ color: '#0284c7' }}>Safely.</span>
            </Title>
          </div>
          <div className="stagger-text stagger-2">
            <Paragraph style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '40px', lineHeight: '1.65' }}>
              Secure compliance audits, complete data wipe logs, and competitive returns are ready for your device lots.
            </Paragraph>
          </div>
          <div className="stagger-text stagger-3">
            <Button
              type="primary" size="large" icon={<ArrowRightOutlined />}
              style={{ height: '64px', padding: '0 40px', fontSize: '16px', fontWeight: 800, borderRadius: '32px', background: 'linear-gradient(90deg, #0f172a, #1e293b)', border: 'none', boxShadow: '0 12px 28px rgba(15, 23, 42, 0.15)' }}
            >
              Request Free Batch Estimate
            </Button>
          </div>
        </div>
      </div>
    </Content>
  );
}