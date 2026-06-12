import { useState, useEffect, useRef } from 'react'
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Steps,
  Typography,
  Space,
  Statistic,
  Modal,
  ConfigProvider,
  Divider,
  Badge,
  Tag,
  Drawer
} from 'antd'
import {
  SettingOutlined,
  RobotOutlined,
  ShopOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LinkedinOutlined,

  SafetyCertificateOutlined,
  ThunderboltOutlined,
  LaptopOutlined,
  CheckCircleOutlined,
  MenuOutlined,
  VerticalAlignTopOutlined,
  RiseOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import { SpiralAnimation } from './components/SpiralAnimation'
import { HeroOverlay } from './components/HeroOverlay'
import exigoLogo from './assets/exigo-logo.png'
import urjaLogo from './assets/urja-logo.png'
import quikLogo from './assets/quik-logo.png'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const { Header, Content, Footer } = Layout
const { Title, Text, Paragraph } = Typography

export function App() {
  const [qwiksellModalVisible, setQwiksellModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Animation Refs
  const aboutSectionRef = useRef<HTMLDivElement>(null)
  const circularSectionRef = useRef<HTMLDivElement>(null)
  const analyticsRef = useRef<HTMLDivElement>(null)
  const teamSectionRef = useRef<HTMLDivElement>(null)

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleScrollVisibility = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScrollVisibility)
    return () => window.removeEventListener('scroll', handleScrollVisibility)
  }, [])

  useEffect(() => {
    const animationCtx = gsap.context(() => {

      // 1. Reveal Elements inside Corporate Mission
      gsap.fromTo(".reveal-about",
        { opacity: 0, y: 50, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: aboutSectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      )

      // 2. Cascade Reveal Subsidiaries Ecosystem Cards with a clean slide swing
      gsap.fromTo(".reveal-subsidiary-card",
        {
          opacity: 0,
          x: (i) => i === 0 ? -60 : 60, // Clean alternating index logic
          scale: 0.95
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.4,
          stagger: 0.25,
          ease: "elastic.out(1, 0.75)", // Adjusted initial value from 0.2 to 1 for a more natural premium spring bounce
          scrollTrigger: {
            trigger: circularSectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
      )

      // 3. Stats Data Section Counter Pop Animation
      gsap.fromTo(".reveal-stat-box",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: analyticsRef.current,
            start: "top 80%"
          }
        }
      )

      // 4. Stagger reveal members within leadership matrix
      gsap.fromTo(".reveal-team-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: teamSectionRef.current,
            start: "top 80%"
          }
        }
      )

    })

    return () => animationCtx.revert()
  }, [])

  const qwiksellSteps = [
    { title: 'Diagnose', description: 'Automated testing of over 50+ functional physical parameters (screens, sensors, battery diagnostics).' },
    { title: 'Price', description: 'Dynamic algorithmic matrix calculations powered by real-time secondary market demand.' },
    { title: 'Buyback', description: 'Instant, highly transparent corporate device collection pipeline with secured buyback options.' },
    { title: 'Liquidation', description: 'Immediate processing into secondary enterprise channels, certified refurbishers, or recycling.' }
  ]

  const teamMembers = [
    {
      name: 'Anand Kumar',
      role: 'Founder & CEO, Exigo Cleantech',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300&h=300',
      bio: "Leading Exigo's vision to power the circular economy through technology-driven life cycle management."
    },
    {
      name: 'Dr. Priya Sharma',
      role: 'CTO, Exigo Cleantech',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
      bio: 'Pioneering AI pricing algorithms and diagnostic systems for circular recommerce ecosystems.'
    },
    {
      name: 'Siddharth Mehta',
      role: 'Head of Operations, Urja Mobility',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300',
      bio: 'Scaling the Battery-as-a-Service model to deliver clean, zero-upfront energy solutions for logistics.'
    },
    {
      name: 'Neha Kapoor',
      role: 'Lead Strategist, QwikSELL',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300',
      bio: 'Fostering B2B liquidation channels and optimizing device recovery cycles globally.'
    }
  ]

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
      {/* Set main layout wrapper height constraints to eliminate trailing page voids */}
      <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', overflowX: 'hidden' }}>

        {/* Sticky Glassmorphic Header */}
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(248, 250, 252, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(107, 33, 168, 0.05)',
            padding: '0 40px',
            height: '80px'
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', height: '100%' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src={exigoLogo}
              alt="Exigo Cleantech"
              style={{ height: '54px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Desktop Navigation Links */}
          <Space size="large" className="desktop-only">
            <Button type="text" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ fontWeight: 600 }}>Home</Button>
            <Button type="text" onClick={() => handleScrollTo('about')} style={{ fontWeight: 600 }}>About</Button>
            <Button type="text" onClick={() => handleScrollTo('qwiksell')} style={{ fontWeight: 600 }}>QwikSELL</Button>
            <Button type="text" onClick={() => handleScrollTo('urja')} style={{ fontWeight: 600 }}>URJA Mobility</Button>
            <Button type="text" onClick={() => handleScrollTo('team')} style={{ fontWeight: 600 }}>Our Team</Button>
            <Button
              type="primary"
              onClick={() => handleScrollTo('contact')}
              style={{
                fontWeight: 600,
                backgroundColor: '#1e3a8a',
                borderColor: '#1e3a8a',
                borderRadius: '24px',
                padding: '0 24px',
                height: '42px',
                boxShadow: '0 8px 20px -4px rgba(30, 58, 138, 0.2)'
              }}
            >
              Contact Us
            </Button>
          </Space>

          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: '20px' }} />}
            className="mobile-only"
            onClick={() => setDrawerVisible(true)}
          />
        </Header>

        <Content style={{ flex: '1 0 auto' }}>
          {/* Hero Section */}
          <div style={{ position: 'relative', width: '100vw', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
            <SpiralAnimation />
            <HeroOverlay />
          </div>

          {/* Core Mission Section (With Asymmetric Mesh Gradient Background) */}
          <section
            id="about"
            ref={aboutSectionRef}
            className="mesh-gradient-section"
            style={{ padding: '140px 24px', textAlign: 'center', position: 'relative' }}
          >
            <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
              <Tag className="reveal-about premium-tag" color="purple">
                CORPORATE MISSION
              </Tag>
              <Title className="reveal-about" level={2} style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', lineHeight: '1.2', color: '#0f172a', fontWeight: 900, letterSpacing: '-0.03em' }}>
                Powering the Circular Economy
              </Title>
              <Paragraph
                className="reveal-about mission-statement-text"
                style={{
                  fontSize: 'clamp(1.35rem, 3vw, 2.1rem)',
                  fontWeight: 600,
                  marginTop: '40px',
                  lineHeight: '1.45',
                  color: '#334155'
                }}
              >
                "A Product life cycle management technology platform powering the circular economy."
              </Paragraph>

              <Divider className="reveal-about" style={{ margin: '60px 0', borderColor: 'rgba(107, 33, 168, 0.1)' }} />

              <Row gutter={[32, 32]} justify="center">
                <Col xs={24} md={8} className="reveal-about">
                  <Card style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', textAlign: 'center', borderRadius: '20px' }} className="premium-feature-showcase-card">
                    <div className="icon-wrapper purple-glow"><SafetyCertificateOutlined style={{ fontSize: '42px', color: '#6b21a8' }} /></div>
                    <Title level={4} style={{ margin: '16px 0 10px 0', color: '#0f172a', fontWeight: 800 }}>Asset Traceability</Title>
                    <Text type="secondary" style={{ fontSize: '14.5px', lineHeight: '1.6' }}>End-to-end global chain of custody tracking architecture for high-value enterprise tech infrastructure assets.</Text>
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

          {/* Subsidiary Column Grid Segment */}
          <section id="qwiksell" ref={circularSectionRef} style={{ padding: '140px 24px', backgroundColor: '#ffffff' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                <Tag color="blue" style={{ marginBottom: '16px', fontWeight: 700, borderRadius: '10px', padding: '4px 12px' }}>SUBSIDIARY MATRIX</Tag>
                <Title level={2} style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>Our Operational Divisions</Title>
                <Text type="secondary" style={{ fontSize: '1.2rem', color: '#64748b' }}>Harnessing diagnostic connectivity data loops to drive continuous secondary market asset velocity.</Text>
              </div>

              <Row gutter={[48, 48]} align="stretch">
                {/* Left Column (QwikSELL Device Re-commerce) */}
                <Col xs={24} lg={12} style={{ display: 'flex' }} className="reveal-subsidiary-card">
                  <Card
                    hoverable
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '24px', border: '1px solid #e2e8f0' }}
                    styles={{ body: { padding: '48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }}
                    className="premium-corporate-card"
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <Tag color="purple" style={{ fontSize: '11px', padding: '4px 14px', borderRadius: '20px', fontWeight: 700 }}>DEVICE LIQUIDATION</Tag>
                        <img src={quikLogo} alt="QwikSELL" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
                      </div>

                      <Title level={3} style={{ color: '#0f172a', marginTop: 0, fontSize: '2rem', fontWeight: 800 }}>
                        QwikSELL: Device Re-commerce
                      </Title>

                      <Row gutter={[16, 16]} style={{ margin: '32px 0', background: 'rgba(107, 33, 168, 0.015)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(107, 33, 168, 0.04)' }}>
                        <Col xs={24} sm={12}>
                          <Statistic title="Liquidation Market TAM" value="$5 Billion" valueStyle={{ color: '#6b21a8', fontWeight: 900, fontSize: '26px' }} />
                        </Col>
                        <Col xs={24} sm={12}>
                          <Statistic title="Annual Liquidation Vol" value="50M Units" valueStyle={{ color: '#1e3a8a', fontWeight: 900, fontSize: '26px' }} />
                        </Col>
                      </Row>

                      <div style={{ margin: '36px 0' }}>
                        <Text strong style={{ display: 'block', marginBottom: '24px', color: '#475569', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Four-Step Lifecycle Pipeline</Text>
                        <Steps
                          orientation="vertical"
                          current={activeStep}
                          onChange={(current) => setActiveStep(current)}
                          size="small"
                          items={qwiksellSteps.map((step, idx) => ({
                            title: <span style={{ fontWeight: 700, fontSize: '15px', color: activeStep === idx ? '#6b21a8' : '#0f172a' }}>{step.title}</span>,
                            description: <span style={{ fontSize: '13.5px', color: '#64748b' }}>{step.description}</span>
                          }))}
                        />
                      </div>

                      <div style={{ margin: '36px 0' }}>
                        <Text strong style={{ display: 'block', marginBottom: '18px', color: '#475569', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Integrated Architecture</Text>
                        <Row gutter={[16, 16]}>
                          {[
                            { title: 'Diagnostic Software', icon: <SettingOutlined style={{ color: '#6b21a8' }} />, desc: 'Auditing 50+ functional constraints automatically' },
                            { title: 'AI Pricing Engine', icon: <RobotOutlined style={{ color: '#1e3a8a' }} />, desc: 'Algorithmic real-time market value compilation' },
                            { title: 'B2B Marketplace', icon: <ShopOutlined style={{ color: '#6b21a8' }} />, desc: 'Optimized secondary liquidation distribution channel' }
                          ].map((item, idx) => (
                            <Col xs={24} sm={8} key={idx}>
                              <Card size="small" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', height: '100%' }} className="tech-ecosystem-subcard">
                                <div style={{ fontSize: '22px', marginBottom: '8px' }}>{item.icon}</div>
                                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{item.title}</div>
                                <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>{item.desc}</div>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                      <Button
                        type="dashed"
                        size="large"
                        onClick={() => setQwiksellModalVisible(true)}
                        style={{ width: '100%', height: '52px', borderRadius: '26px', borderColor: '#6b21a8', color: '#6b21a8', fontWeight: 700, fontSize: '15px' }}
                        className="btn-corporate-dashed"
                      >
                        Learn More
                      </Button>
                    </div>
                  </Card>
                </Col>

                {/* Right Column (Urja Mobility BaaS Module) */}
                <Col xs={24} lg={12} style={{ display: 'flex' }} id="urja" className="reveal-subsidiary-card">
                  <Card
                    hoverable
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '24px', border: '1px solid rgba(30, 58, 138, 0.12)', boxShadow: '0 12px 40px rgba(30, 58, 138, 0.02)' }}
                    styles={{ body: { padding: '48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }}
                    className="premium-corporate-card secondary"
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <Tag color="blue" style={{ fontSize: '11px', padding: '4px 14px', borderRadius: '20px', fontWeight: 700 }}>BATTERY ECOSYSTEM</Tag>
                        <img src={urjaLogo} alt="Urja Mobility" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
                      </div>

                      <Title level={3} style={{ color: '#0f172a', marginTop: 0, fontSize: '2rem', fontWeight: 800 }}>
                        Urja Mobility: Battery-as-a-Service (BaaS)
                      </Title>

                      <Row gutter={[16, 16]} style={{ margin: '32px 0', background: 'rgba(30, 58, 138, 0.015)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(30, 58, 138, 0.04)' }}>
                        <Col xs={24} sm={8}>
                          <Statistic title="FY26 Target Revenue" value="₹48 Cr+" valueStyle={{ color: '#1e3a8a', fontWeight: 900, fontSize: '24px' }} />
                        </Col>
                        <Col xs={24} sm={8}>
                          <Statistic title="Revenue Growth" value="300%" valueStyle={{ color: '#6b21a8', fontWeight: 900, fontSize: '24px' }} />
                        </Col>
                        <Col xs={24} sm={8}>
                          <Statistic title="Managed Assets" value="₹80 Cr+" valueStyle={{ color: '#1e3a8a', fontWeight: 900, fontSize: '24px' }} />
                        </Col>
                      </Row>

                      <div style={{ margin: '36px 0' }}>
                        <Text strong style={{ display: 'block', marginBottom: '16px', color: '#475569', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Value Architecture Parameters</Text>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <Card size="small" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px' }} className="val-prop-subcard">
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                              <CheckCircleOutlined style={{ color: '#10b981', fontSize: '20px', marginTop: '3px' }} />
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>Zero Upfront CAPEX Cost</div>
                                <Text type="secondary" style={{ fontSize: '13.5px', lineHeight: '1.4' }}>Drivers pay only an initial security deposit, bypassing traditional logistic acquisition blocks.</Text>
                              </div>
                            </div>
                          </Card>
                          <Card size="small" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px' }} className="val-prop-subcard">
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                              <CheckCircleOutlined style={{ color: '#10b981', fontSize: '20px', marginTop: '3px' }} />
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>2x Income Yield Scaling</div>
                                <Text type="secondary" style={{ fontSize: '13.5px', lineHeight: '1.4' }}>Maximized battery configurations expand driver metrics upward from ₹700 to ₹1,500/daily net average.</Text>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>

                      <div style={{ margin: '36px 0' }}>
                        <Text strong style={{ display: 'block', marginBottom: '12px', color: '#475569', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Physical Asset Scalability</Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }} className="scale-deployment-banner">
                          <div style={{ fontSize: '36px', color: '#1e3a8a', lineHeight: 1 }}>🔋</div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '16.5px', color: '#0f172a' }}>15,000 Connected Battery Deployment Target</div>
                            <Text type="secondary" style={{ fontSize: '13.5px' }}>Aggressive commercial operational layout scale across 15+ central logistical zones.</Text>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                      <Button
                        type="primary"
                        size="large"
                        icon={<ThunderboltOutlined />}
                        href="https://urjamobility.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ width: '100%', height: '52px', borderRadius: '26px', backgroundColor: '#1e3a8a', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 10px 20px -4px rgba(30, 58, 138, 0.25)' }}
                        className="btn-corporate-primary"
                      >
                        Launch Platform
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </section>

          {/* Deep Data Insights Metric Row */}
          <section ref={analyticsRef} style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #6b21a8 0%, #1e3a8a 100%)', color: '#fff' }}>
            <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
              <Row gutter={[32, 32]} justify="space-between" align="middle">
                <Col xs={24} md={10}>
                  <Tag style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '10px', fontWeight: 600 }}>ECENTRIC METRICS</Tag>
                  <Title level={2} style={{ color: '#fff', marginTop: '16px', fontSize: '2.3rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Unified Ecosystem In Numbers</Title>
                  <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                    Our data diagnostics infrastructure maps entire electronic asset lifecycles across diverse subsidiary channels, minimizing e-waste footprints globally.
                  </Paragraph>
                </Col>
                <Col xs={24} md={13}>
                  <Row gutter={[24, 24]}>
                    <Col xs={12} sm={12} className="reveal-stat-box">
                      <div className="stat-counters-box">
                        <div className="num-headline"><RiseOutlined /> 300%</div>
                        <div className="label-text">FY26 Operational Growth</div>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} className="reveal-stat-box">
                      <div className="stat-counters-box">
                        <div className="num-headline">96%</div>
                        <div className="label-text">Driver Retention Scale</div>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} className="reveal-stat-box">
                      <div className="stat-counters-box">
                        <div className="num-headline">28+</div>
                        <div className="label-text">Monthly Battery Uptime Days</div>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} className="reveal-stat-box">
                      <div className="stat-counters-box">
                        <div className="num-headline"><GlobalOutlined /> 15+</div>
                        <div className="label-text">Tier 1/2 Urban Coverage</div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </section>

          {/* Leadership Matrix Segment */}
          <section id="team" ref={teamSectionRef} style={{ padding: '140px 24px', backgroundColor: '#f8fafc' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                <Tag color="purple" style={{ marginBottom: '16px', fontSize: '11px', padding: '4px 14px', borderRadius: '20px', fontWeight: 700 }}>EXECUTIVE MANAGEMENT</Tag>
                <Title level={2} style={{ fontSize: '2.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>The Corporate Leadership</Title>
                <Text type="secondary" style={{ fontSize: '1.2rem' }}>Steering proprietary configuration technology parameters into scalable green commerce realities.</Text>
              </div>

              <Row gutter={[24, 24]}>
                {teamMembers.map((member, index) => (
                  <Col xs={24} sm={12} lg={6} key={index} className="reveal-team-card">
                    <Card
                      hoverable
                      style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}
                      cover={
                        <div style={{ position: 'relative', overflow: 'hidden', height: '300px' }} className="team-avatar-container">
                          <img
                            alt={member.name}
                            src={member.image}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            className="team-image-zoom"
                          />
                        </div>
                      }
                      styles={{ body: { padding: '28px', textAlign: 'center' } }}
                    >
                      <Title level={4} style={{ margin: '0 0 4px 0', fontSize: '1.3rem', color: '#0f172a', fontWeight: 700 }}>{member.name}</Title>
                      <Text style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#6b21a8', marginBottom: '14px', letterSpacing: '0.02em' }}>
                        {member.role}
                      </Text>
                      <Paragraph type="secondary" style={{ fontSize: '13px', lineHeight: '1.5', height: '60px', overflow: 'hidden', margin: 0 }}>
                        {member.bio}
                      </Paragraph>
                      <Divider style={{ margin: '20px 0 16px 0' }} />
                      <Space size="middle">
                        <Button type="text" shape="circle" icon={<LinkedinOutlined style={{ color: '#0077b5', fontSize: '18px' }} />} href="https://linkedin.com" target="_blank" />
                        <Button type="text" shape="circle" icon={<MailOutlined style={{ color: '#64748b', fontSize: '18px' }} />} href="mailto:info@exigocleantech.com" />
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </section>
        </Content>

        {/* Footer Section with explicit trailing zero-pixel configuration spacing */}
        <Footer id="contact" style={{ backgroundColor: '#0f172a', color: '#94a3b8', fontSize: '14px', padding: '100px 40px 40px 40px', margin: 0, width: '100%', flexShrink: 0 }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <Row gutter={[40, 40]}>
              <Col xs={24} md={8}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '12px 26px',
                    borderRadius: '14px',
                    display: 'inline-flex',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
                  }}>
                    <img src={exigoLogo} alt="Exigo Cleantech" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
                  </div>
                </div>
                <Paragraph style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '13.5px' }}>
                  We are a product life cycle management technology platform, powering the circular economy by scaling battery recommerce (Urja Mobility) and device recommerce (QwikSELL).
                </Paragraph>
              </Col>

              <Col xs={24} sm={12} md={{ span: 5, offset: 2 }}>
                <Title level={5} style={{ color: '#fff', marginBottom: '24px', fontWeight: 700, fontSize: '15px' }}>Quick Links</Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <a onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ color: '#94a3b8', cursor: 'pointer' }} className="footer-hover-link">Home</a>
                  <a onClick={() => handleScrollTo('about')} style={{ color: '#94a3b8', cursor: 'pointer' }} className="footer-hover-link">About Us</a>
                  <a onClick={() => handleScrollTo('qwiksell')} style={{ color: '#94a3b8', cursor: 'pointer' }} className="footer-hover-link">QwikSELL Ecosystem</a>
                  <a onClick={() => handleScrollTo('urja')} style={{ color: '#94a3b8', cursor: 'pointer' }} className="footer-hover-link">Urja Mobility (BaaS)</a>
                  <a onClick={() => handleScrollTo('team')} style={{ color: '#94a3b8', cursor: 'pointer' }} className="footer-hover-link">Our Leadership</a>
                </div>
              </Col>

              <Col xs={24} sm={12} md={4}>
                <Title level={5} style={{ color: '#fff', marginBottom: '24px', fontWeight: 700, fontSize: '15px' }}>Subsidiaries</Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <a href="https://urjamobility.in/" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8' }} className="footer-hover-link">Urja Mobility ⚡</a>
                  <a onClick={() => handleScrollTo('qwiksell')} style={{ color: '#94a3b8', cursor: 'pointer' }} className="footer-hover-link">QwikSELL Re-commerce 💻</a>
                </div>
              </Col>

              <Col xs={24} md={5}>
                <Title level={5} style={{ color: '#fff', marginBottom: '24px', fontWeight: 700, fontSize: '15px' }}>Contact Info</Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <EnvironmentOutlined style={{ color: '#6b21a8', fontSize: '19px', marginTop: '3px' }} />
                    <span style={{ lineHeight: '1.5' }}>Exigo Cleantech Corporate HQ<br />Gurugram, Haryana, India</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <MailOutlined style={{ color: '#6b21a8', fontSize: '16px' }} />
                    <a href="mailto:info@exigocleantech.com" style={{ color: '#94a3b8' }} className="footer-hover-link">info@exigocleantech.com</a>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <PhoneOutlined style={{ color: '#6b21a8', fontSize: '16px' }} />
                    <span>+91 124 400 5000</span>
                  </div>
                </div>
              </Col>
            </Row>

            <Divider style={{ margin: '50px 0 24px 0', borderColor: 'rgba(255, 255, 255, 0.06)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '13px' }}>
              <span>© {new Date().getFullYear()} Exigo Cleantech. All Rights Reserved.</span>
              <Space size="large">
                <a style={{ color: '#64748b', cursor: 'pointer' }} className="footer-hover-link">Privacy Policy</a>
                <a style={{ color: '#64748b', cursor: 'pointer' }} className="footer-hover-link">Terms of Service</a>
              </Space>
            </div>
          </div>
        </Footer>

        {/* Detailed Modal Component */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LaptopOutlined style={{ color: '#6b21a8', fontSize: '20px' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>QwikSELL: Powering Device Circularity</span>
            </div>
          }
          open={qwiksellModalVisible}
          onOk={() => setQwiksellModalVisible(false)}
          onCancel={() => setQwiksellModalVisible(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setQwiksellModalVisible(false)}>
              Close Details
            </Button>
          ]}
          width={650}
        >
          <div style={{ padding: '12px 4px' }}>
            <Paragraph style={{ fontSize: '15px', lineHeight: '1.6', color: '#475569' }}>
              QwikSELL is Exigo Cleantech's dedicated device re-commerce division. We address the mounting problem of enterprise electronic waste by offering a robust lifecycle management platform for laptops, mobiles, servers, and other digital hardware.
            </Paragraph>
            <Divider style={{ margin: '20px 0' }} />
            <Title level={5} style={{ color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>How it Works:</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Badge count="1" style={{ backgroundColor: '#6b21a8' }} />
                <div>
                  <Text strong style={{ color: '#0f172a' }}>Functional Diagnostics</Text>
                  <Paragraph style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Our proprietary diagnostic software performs complete hardware and component-level audits to evaluate physical parameters.</Paragraph>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Badge count="2" style={{ backgroundColor: '#1e3a8a' }} />
                <div>
                  <Text strong style={{ color: '#0f172a' }}>Algorithmic Valuation</Text>
                  <Paragraph style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>The AI Pricing Engine references dynamic parameters to generate instant, fair-market valuation matrices automatically.</Paragraph>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Badge count="3" style={{ backgroundColor: '#6b21a8' }} />
                <div>
                  <Text strong style={{ color: '#0f172a' }}>B2B Liquidation Network</Text>
                  <Paragraph style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Refurbished inventory is pushed to verified B2B marketplaces, giving hardware assets a certified second life.</Paragraph>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* Drawer Mobile Menu */}
        <Drawer
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={exigoLogo} alt="Exigo Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            </div>
          }
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{ wrapper: { width: 280 }, body: { padding: '12px 0' } }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Button type="text" onClick={() => { setDrawerVisible(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ textAlign: 'left', padding: '12px 24px', height: 'auto', fontSize: '15px', fontWeight: 600 }}>Home</Button>
            <Button type="text" onClick={() => { setDrawerVisible(false); handleScrollTo('about'); }} style={{ textAlign: 'left', padding: '12px 24px', height: 'auto', fontSize: '15px', fontWeight: 600 }}>About</Button>
            <Button type="text" onClick={() => { setDrawerVisible(false); handleScrollTo('qwiksell'); }} style={{ textAlign: 'left', padding: '12px 24px', height: 'auto', fontSize: '15px', fontWeight: 600 }}>QwikSELL</Button>
            <Button type="text" onClick={() => { setDrawerVisible(false); handleScrollTo('urja'); }} style={{ textAlign: 'left', padding: '12px 24px', height: 'auto', fontSize: '15px', fontWeight: 600 }}>URJA Mobility</Button>
            <Button type="text" onClick={() => { setDrawerVisible(false); handleScrollTo('team'); }} style={{ textAlign: 'left', padding: '12px 24px', height: 'auto', fontSize: '15px', fontWeight: 600 }}>Our Team</Button>
            <div style={{ padding: '16px 24px 0 24px' }}>
              <Button
                type="primary"
                onClick={() => { setDrawerVisible(false); handleScrollTo('contact'); }}
                style={{
                  width: '100%',
                  height: '40px',
                  fontWeight: 600,
                  backgroundColor: '#1e3a8a',
                  borderColor: '#1e3a8a',
                  borderRadius: '20px'
                }}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </Drawer>

        {/* Back To Top Component Trigger */}
        <div className={`back-to-top-floating ${showBackToTop ? 'visible' : ''}`}>
          <Button
            type="primary"
            shape="circle"
            icon={<VerticalAlignTopOutlined />}
            size="large"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              backgroundColor: '#6b21a8',
              borderColor: '#6b21a8',
              height: '52px',
              width: '52px',
              boxShadow: '0 12px 28px rgba(107, 33, 168, 0.45)'
            }}
          />
        </div>

      </Layout>
    </ConfigProvider>
  )
}

export default App