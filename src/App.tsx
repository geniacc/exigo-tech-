import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Steps,
  Typography,
  Modal,
  ConfigProvider,
  Divider,
  Tag
} from 'antd'
import {
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  LaptopOutlined,
  VerticalAlignTopOutlined,
  RiseOutlined,
  PlayCircleOutlined,
  CloseOutlined
} from '@ant-design/icons'

// Layout Modules
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AIChatbot } from './components/AIChatbot'
import { HeroOverlay } from './components/HeroOverlay'
import { SpiralAnimation } from './components/SpiralAnimation'
import UrjaPage from './pages/UrjaPage'
import QwikPage from './pages/QwikPage'
import ContactPage from './pages/ContactPage'
import CareersPage from './pages/CareersPage' // NEW IMPORT
import AboutPage from './pages/AboutPage' // NEW IMPORT


import SmoothScroll from './components/SmoothScroll'
import InvestorRelations from './components/InvestorRelations' // NEW IMPORT

import urjaLogo from './assets/urja-logo.png'
import quikLogo from './assets/quik-logo.png'
import driverVideo1 from './assets/driver response 1 .mp4'
import driverVideo2 from './assets/driver response 2 .mp4'
import driverVideo3 from './assets/driver response 3 .mp4'
import driverVideo4 from './assets/driver response 4 .mp4'
import driverVideo5 from './assets/driver response 5 .mp4'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const { Title, Text, Paragraph } = Typography

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // 1. Force the scroll to top instantly on the window
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // 2. Fallback for some browsers / smooth scrolling wrappers
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // 3. Fire it once more after a tiny delay to catch any GSAP layout shifts
    setTimeout(() => {
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }, 50);

  }, [pathname])

  return null
}

function HomePageContent({ setQwiksellModalVisible, activeStep, setActiveStep }: any) {
  const aboutSectionRef = useRef<HTMLDivElement>(null)
  const circularSectionRef = useRef<HTMLDivElement>(null)
  const analyticsRef = useRef<HTMLDivElement>(null)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [activeName, setActiveName] = useState('')

  useEffect(() => {
    const animationCtx = gsap.context(() => {
      gsap.fromTo(".reveal-about",
        { opacity: 0, y: 50, scale: 0.98 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.15, ease: "power4.out",
          scrollTrigger: { trigger: aboutSectionRef.current, start: "top 85%" }
        }
      )
      gsap.fromTo(".reveal-subsidiary-card",
        { opacity: 0, x: (i) => i === 0 ? -60 : 60, scale: 0.95 },
        {
          opacity: 1, x: 0, scale: 1, duration: 1.4, stagger: 0.25, ease: "elastic.out(1, 0.75)",
          scrollTrigger: { trigger: circularSectionRef.current, start: "top 75%" }
        }
      )
      gsap.fromTo(".reveal-stat-box",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: analyticsRef.current, start: "top 80%" }
        }
      )
    })
    return () => animationCtx.revert()
  }, [])

  const qwiksellSteps = [
    { title: 'Diagnose', description: 'Automated testing of over 50+ functional physical parameters.' },
    { title: 'Price', description: 'Dynamic algorithmic matrix calculations powered by real-time market demand.' },
    { title: 'Buyback', description: 'Instant, highly transparent corporate device collection pipeline.' },
    { title: 'Liquidation', description: 'Immediate processing into secondary enterprise channels.' }
  ]

  const homeTestimonials = [
    {
      quote: "Urja’s battery-swap network cut our EV downtime dramatically. Drivers stay on route instead of waiting on charge cycles.",
      name: "Arjun Patel",
      role: "Fleet Operations Head",
      company: "CityRide Logistics",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      video: driverVideo1
    },
    {
      quote: "Swap reliability on Urja is outstanding. We scaled from a pilot corridor to multi-city deployment without operational chaos.",
      name: "Sana Qureshi",
      role: "COO",
      company: "GreenMiles Mobility",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      video: driverVideo2
    },
    {
      quote: "Driver retention improved after we partnered with Urja — predictable energy cost and almost zero stranded vehicles mid-shift.",
      name: "Deepa Nair",
      role: "Partner Success",
      company: "MetroGo Fleets",
      video: driverVideo3
    },
    {
      quote: "Diagnostics that used to take days now finish in minutes. Our buyback approvals are consistent and audit-ready.",
      name: "Neha Kapoor",
      role: "Procurement Lead",
      company: "Vertex Retail Pvt Ltd",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
      video: driverVideo4
    },
    {
      quote: "QwikSELL gave us transparent grading and faster liquidation for retired laptops. Recovered value jumped within the first quarter.",
      name: "Riya Mehta",
      role: "IT Asset Manager",
      company: "Nimbus Softwares",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      video: driverVideo5
    },
    {
      quote: "Exigo helped us close the loop on end-of-life devices with measurable circular KPIs board members actually understand.",
      name: "Vikram Singh",
      role: "Sustainability Director",
      company: "Aarohan Group",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      quote: "Secondary channel pricing from QwikSELL is far clearer than our previous ad-hoc resellers. Finance finally trusts the pipeline.",
      name: "Rohit Malhotra",
      role: "CFO",
      company: "ByteForge India",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      quote: "From intake to certified remarketing, Exigo’s PLM workflow removed the guesswork we had across three vendors.",
      name: "Kabir Anand",
      role: "Head of Infrastructure",
      company: "Orbit Enterprises",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
    }
  ];
  return (
    <>
      <div style={{ position: 'relative', width: '100vw', height: '100vh', minHeight: '600px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Layer 1: Canvas Background Animation */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <SpiralAnimation />
        </div>

        {/* Layer 2: Typography, GSAP Animation & CTA Buttons */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
          <HeroOverlay />
        </div>
      </div>

      <section id="about" ref={aboutSectionRef} className="mesh-gradient-section" style={{ padding: '140px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <Tag className="reveal-about premium-tag" color="purple">CORPORATE MISSION</Tag>
          <Title className="reveal-about" level={2} style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', lineHeight: '1.2', color: '#0f172a', fontWeight: 900, letterSpacing: '-0.03em' }}>
            Powering the Circular Economy
          </Title>
          <Paragraph className="reveal-about mission-statement-text" style={{ fontSize: 'clamp(1.35rem, 3vw, 2.1rem)', fontWeight: 600, marginTop: '40px', lineHeight: '1.45', color: '#334155' }}>
            "A Product life cycle management technology platform powering the circular economy."
          </Paragraph>

          <Divider className="reveal-about" style={{ margin: '60px 0', borderColor: 'rgba(107, 33, 168, 0.1)' }} />

          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={8} className="reveal-about">
              <Card style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', textAlign: 'center', borderRadius: '20px' }} className="premium-feature-showcase-card">
                <div className="icon-wrapper purple-glow"><SafetyCertificateOutlined style={{ fontSize: '42px', color: '#6b21a8' }} /></div>
                <Title level={4} style={{ margin: '16px 0 10px 0', color: '#0f172a', fontWeight: 800 }}>Asset Traceability</Title>
                <Text type="secondary" style={{ fontSize: '14.5px', lineHeight: '1.6' }}>End-to-end global chain of custody tracking architecture for enterprise tech infrastructure assets.</Text>
              </Card>
            </Col>
            <Col xs={24} md={8} className="reveal-about">
              <Card style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', textAlign: 'center', borderRadius: '20px' }} className="premium-feature-showcase-card">
                <div className="icon-wrapper blue-glow"><ThunderboltOutlined style={{ fontSize: '42px', color: '#1e3a8a' }} /></div>
                <Title level={4} style={{ margin: '16px 0 10px 0', color: '#0f172a', fontWeight: 800 }}>Sustainable Power</Title>
                <Text type="secondary" style={{ fontSize: '14.5px', lineHeight: '1.6' }}>Deploying advanced second-life re-configuration management modules for sustainable EV battery assets.</Text>
              </Card>
            </Col>
            <Col xs={24} md={8} className="reveal-about">
              <Card style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', textAlign: 'center', borderRadius: '20px' }} className="premium-feature-showcase-card">
                <div className="icon-wrapper purple-glow"><LaptopOutlined style={{ fontSize: '42px', color: '#6b21a8' }} /></div>
                <Title level={4} style={{ margin: '16px 0 10px 0', color: '#0f172a', fontWeight: 800 }}>Device Re-commerce</Title>
                <Text type="secondary" style={{ fontSize: '14.5px', lineHeight: '1.6' }}>Maximum lifecycle asset valuation loop recovery via diagnostic automation matrices and verified bulk liquidation.</Text>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <section id="subsidiary-matrix" ref={circularSectionRef} style={{ padding: '140px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Tag color="blue" style={{ marginBottom: '16px', fontWeight: 700, borderRadius: '10px', padding: '4px 12px' }}>SUBSIDIARY MATRIX</Tag>
            <Title level={2} style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>Our Operational Divisions</Title>
            <Text type="secondary" style={{ fontSize: '1.2rem', color: '#64748b' }}>Harnessing diagnostic connectivity data loops to drive continuous secondary market asset velocity.</Text>
          </div>

          <Row gutter={[48, 48]} align="stretch">
            <Col xs={24} lg={12} style={{ display: 'flex' }} className="reveal-subsidiary-card">
              <Card hoverable style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '24px', border: '1px solid #e2e8f0' }} styles={{ body: { padding: '48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }} className="premium-corporate-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <Tag color="purple" style={{ fontSize: '11px', padding: '4px 14px', borderRadius: '20px', fontWeight: 700 }}>DEVICE LIQUIDATION</Tag>
                    <img src={quikLogo} alt="QwikSELL" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
                  </div>
                  <Title level={3} style={{ color: '#0f172a', marginTop: 0, fontSize: '2rem', fontWeight: 800 }}>QwikSELL: Device Re-commerce</Title>
                  <div style={{ margin: '36px 0' }}>
                    <Steps orientation="vertical" current={activeStep} onChange={(current) => setActiveStep(current)} size="small" items={qwiksellSteps.map((step, idx) => ({
                      title: <span style={{ fontWeight: 700, fontSize: '15px', color: activeStep === idx ? '#6b21a8' : '#0f172a' }}>{step.title}</span>,
                      description: <span style={{ fontSize: '13.5px', color: '#64748b' }}>{step.description}</span>
                    }))} />
                  </div>
                </div>
                <Button type="dashed" size="large" onClick={() => setQwiksellModalVisible(true)} style={{ width: '100%', height: '52px', borderRadius: '26px', borderColor: '#6b21a8', color: '#6b21a8', fontWeight: 700 }} className="btn-corporate-dashed">Learn More</Button>
              </Card>
            </Col>

            <Col xs={24} lg={12} style={{ display: 'flex' }} className="reveal-subsidiary-card">
              <Card hoverable style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '24px', border: '1px solid rgba(30, 58, 138, 0.12)' }} styles={{ body: { padding: '48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }} className="premium-corporate-card secondary">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <Tag color="blue" style={{ fontSize: '11px', padding: '4px 14px', borderRadius: '20px', fontWeight: 700 }}>BATTERY ECOSYSTEM</Tag>
                    <img src={urjaLogo} alt="Urja Mobility" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
                  </div>
                  <Title level={3} style={{ color: '#0f172a', marginTop: 0, fontSize: '2rem', fontWeight: 800 }}>Urja Mobility: Battery-as-a-Service (BaaS)</Title>
                  <div style={{ margin: '36px 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <Card size="small" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px' }} className="val-prop-subcard">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                          <SafetyCertificateOutlined style={{ color: '#10b981', fontSize: '20px', marginTop: '3px' }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '15px' }}>Zero Upfront CAPEX Cost</div>
                            <Text type="secondary" style={{ fontSize: '13.5px' }}>Drivers pay only an initial security deposit, bypassing traditional logistic acquisition blocks.</Text>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
                <Button type="primary" size="large" icon={<ThunderboltOutlined />} href="https://urjamobility.in/" target="_blank" style={{ width: '100%', height: '52px', borderRadius: '26px', backgroundColor: '#1e3a8a' }} className="btn-corporate-primary">Launch Platform</Button>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <section ref={analyticsRef} style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #6b21a8 0%, #1e3a8a 100%)', color: '#fff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <Row gutter={[32, 32]} justify="space-between" align="middle">
            <Col xs={24} md={10}>
              <Tag style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '10px' }}>ECENTRIC METRICS</Tag>
              <Title level={2} style={{ color: '#fff', marginTop: '16px', fontWeight: 900 }}>Unified Ecosystem</Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>Our diagnostics infrastructure loops real-time operational device status metrics dynamically across core channels.</Paragraph>
            </Col>
            <Col xs={24} md={13}>
              <Row gutter={[24, 24]}>
                <Col xs={12} sm={12} className="reveal-stat-box">
                  <div className="stat-counters-box">
                    <div className="num-headline"><RiseOutlined /> 300%</div>
                    <div className="label-text">Operational Growth</div>
                  </div>
                </Col>
                <Col xs={12} sm={12} className="reveal-stat-box">
                  <div className="stat-counters-box">
                    <div className="num-headline">96%</div>
                    <div className="label-text">Driver Retention Matrix</div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </section>



      <section id="testimonials" style={{ padding: '140px 0', backgroundColor: '#070913', position: 'relative', overflow: 'hidden' }}>
        <style>
          {`
            @keyframes hardwareTicker {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(calc(-340px * 8 - 24px * 8), 0, 0); }
            }

            .ticker-viewport-container {
              overflow: hidden;
              width: 100%;
              padding: 40px 0;
              position: relative;
            }

            .ticker-viewport-container::before,
            .ticker-viewport-container::after {
              content: '';
              position: absolute;
              top: 0;
              bottom: 0;
              width: 150px;
              z-index: 10;
              pointer-events: none;
            }
            .ticker-viewport-container::before {
              left: 0;
              background: linear-gradient(90deg, #070913 20%, transparent 100%);
            }
            .ticker-viewport-container::after {
              right: 0;
              background: linear-gradient(-90deg, #070913 20%, transparent 100%);
            }

            .ticker-scrolling-track {
              display: flex;
              gap: 24px;
              width: max-content;
              animation: hardwareTicker 38s linear infinite;
            }

            .ticker-viewport-container:hover .ticker-scrolling-track {
              animation-play-state: paused;
            }

            .premium-cyber-card {
              width: 340px;
              height: 380px;
              border-radius: 24px !important;
              background: rgba(15, 22, 42, 0.45) !important;
              backdrop-filter: blur(16px) !important;
              border: 1px solid rgba(255, 255, 255, 0.04) !important;
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
              display: flex;
              flex-direction: column;
            }

            .premium-cyber-card:hover {
              transform: translateY(-10px) scale(1.02) !important;
              background: rgba(20, 30, 58, 0.75) !important;
            }

            .video-card-glow {
              border: 1px solid rgba(168, 85, 247, 0.25) !important;
              box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
            }

            .video-card-glow:hover {
              border-color: rgba(168, 85, 247, 0.65) !important;
              box-shadow: 0 0 30px rgba(168, 85, 247, 0.25), 0 20px 40px rgba(0, 0, 0, 0.5) !important;
            }

            .standard-card-glow:hover {
              border-color: rgba(59, 130, 246, 0.4) !important;
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.15), 0 20px 40px rgba(0, 0, 0, 0.5) !important;
            }
          `}
        </style>

        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(107, 33, 168, 0.08) 0%, transparent 75%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Tag style={{ padding: '6px 18px', borderRadius: '24px', fontWeight: 800, fontSize: '10px', letterSpacing: '0.12em', background: 'rgba(107, 33, 168, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              PARTNER SYSTEM VALIDATION // FEEDBACK PLATFORM
            </Tag>
            <Title level={2} style={{ marginTop: '20px', fontWeight: 900, color: '#f8fafc', fontSize: 'clamp(2.2rem, 5vw, 3rem)', letterSpacing: '-0.02em' }}>
              What Our Partners Say
            </Title>
            <Paragraph style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '600px', margin: '12px auto 0 auto', lineHeight: '1.6' }}>
              Real validation from enterprise partners deploying circular logistics configurations across QwikSELL and Urja Mobility networks.
            </Paragraph>
          </div>
        </div>

        <div className="ticker-viewport-container">
          <div className="ticker-scrolling-track">
            {[...homeTestimonials, ...homeTestimonials].map((item, idx) => (
              <Card
                key={idx}
                hoverable
                className={`premium-cyber-card ${item.video ? 'video-card-glow' : 'standard-card-glow'}`}
                styles={{ body: { padding: '36px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' } }}
              >
                <Paragraph style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.65', fontStyle: 'italic', margin: 0 }}>
                  "{item.quote}"
                </Paragraph>

                <div style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: item.video ? '18px' : '0' }}>
                    {item.img ? (
                      <img src={item.img} alt={item.name} style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.1)' }} />
                    ) : (
                      <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: '#6b21a8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '13px', border: '1.5px solid rgba(168, 85, 247, 0.4)' }}>
                        {item.name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                      </div>
                    )}
                    <div>
                      <Text strong style={{ color: '#f8fafc', display: 'block', fontSize: '14px' }}>{item.name}</Text>
                      <Text style={{ color: '#64748b', fontSize: '12px', display: 'block', fontWeight: 500 }}>{item.role}, {item.company}</Text>
                    </div>
                  </div>

                  {item.video && (
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={() => {
                        setActiveVideo(item.video!)
                        setActiveName(item.name)
                      }}
                      style={{
                        width: '100%',
                        borderRadius: '12px',
                        backgroundColor: '#6b21a8',
                        borderColor: '#6b21a8',
                        fontWeight: 700,
                        height: '40px',
                        boxShadow: '0 4px 14px rgba(107, 33, 168, 0.4)'
                      }}
                    >
                      Watch Response Video
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
              <span style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.01em' }}>Field Video Feedback // {activeName}</span>
            </div>
          }
          open={!!activeVideo}
          onCancel={() => {
            setActiveVideo(null)
            setActiveName('')
          }}
          footer={null}
          centered
          destroyOnHidden
          closeIcon={<CloseOutlined style={{ color: '#94a3b8' }} />}
          styles={{
            mask: { backdropFilter: 'blur(12px)', backgroundColor: 'rgba(2, 4, 12, 0.8)' },
            container: { backgroundColor: '#0b0f19', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' },
            header: { backgroundColor: '#0b0f19', borderBottom: 'none' },
            title: { color: '#fff' }
          }}
          width={760}
        >
          {activeVideo && (
            <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', boxShadow: '0 24px 50px -12px rgba(0,0,0,0.7)' }}>
              <video
                src={activeVideo}
                controls
                autoPlay
                style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
              />
            </div>
          )}
        </Modal>
      </section>

      {/* NEW: Investor Relations Section */}
      <div id="investors">
        <InvestorRelations />
      </div>
    </>
  )
}

export function App() {
  const [qwiksellModalVisible, setQwiksellModalVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScrollVisibility = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScrollVisibility)
    return () => window.removeEventListener('scroll', handleScrollVisibility)
  }, [])

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6b21a8',
          colorInfo: '#1e3a8a',
          borderRadius: 16,
          fontFamily: 'Outfit, Inter, sans-serif',
          colorLink: '#6b21a8',
          colorLinkHover: '#1e3a8a',
        },
      }}
    >
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <SmoothScroll>
          <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', overflowX: 'hidden' }}>
            <Navbar />

            <Routes>
              <Route path="/" element={<HomePageContent setQwiksellModalVisible={setQwiksellModalVisible} activeStep={activeStep} setActiveStep={setActiveStep} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/urja" element={<UrjaPage />} />
              <Route path="/qwiksell" element={<QwikPage />} />
              <Route path="/careers" element={<CareersPage />} /> {/* NEW ROUTE */}
              <Route path="/contact" element={<ContactPage />} />
            </Routes>

            <Footer />

            <AIChatbot /> {/* 2. GLOBAL CHAT INTERFACE INSTANTIATED HERE */}

            <Modal
              title={<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><LaptopOutlined style={{ color: '#6b21a8', fontSize: '20px' }} /><span style={{ fontSize: '1.25rem', fontWeight: 800 }}>QwikSELL: Powering Device Circularity</span></div>}
              open={qwiksellModalVisible}
              onOk={() => setQwiksellModalVisible(false)}
              onCancel={() => setQwiksellModalVisible(false)}
              footer={[<Button key="close" type="primary" onClick={() => setQwiksellModalVisible(false)}>Close Details</Button>]}
              width={650}
            >
              <div style={{ padding: '12px 4px' }}>
                <Paragraph style={{ fontSize: '15px', color: '#475569' }}>
                  QwikSELL is Exigo Cleantech's dedicated device re-commerce division. We address the mounting problem of enterprise electronic waste by offering a robust lifecycle platform for laptops and servers.
                </Paragraph>
              </div>
            </Modal>

            <div className={`back-to-top-floating ${showBackToTop ? 'visible' : ''}`}>
              <Button type="primary" shape="circle" icon={<VerticalAlignTopOutlined />} size="large" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ backgroundColor: '#6b21a8', borderColor: '#6b21a8', height: '52px', width: '52px', boxShadow: '0 12px 28px rgba(107, 33, 168, 0.45)' }} />
            </div>
          </Layout>
        </SmoothScroll>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App;