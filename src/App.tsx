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
  Space,
  Modal,
  ConfigProvider,
  Divider,
  Tag
} from 'antd'
import {
  LinkedinOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  LaptopOutlined,
  VerticalAlignTopOutlined,
  RiseOutlined,
  MailOutlined
} from '@ant-design/icons'

// Layout Modules
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import UrjaPage from './pages/UrjaPage'
import QwikPage from './pages/QwikPage'
import ContactPage from './pages/ContactPage'
import CareersPage from './pages/CareersPage' // NEW IMPORT

import DataLifecycleEngine from './components/DataLifecycleEngine'
import SmoothScroll from './components/SmoothScroll'
import InvestorRelations from './components/InvestorRelations' // NEW IMPORT

import urjaLogo from './assets/urja-logo.png'
import quikLogo from './assets/quik-logo.png'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const { Title, Text, Paragraph } = Typography

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
  }, [pathname])
  return null
}

function HomePageContent({ setQwiksellModalVisible, activeStep, setActiveStep }: any) {
  const aboutSectionRef = useRef<HTMLDivElement>(null)
  const circularSectionRef = useRef<HTMLDivElement>(null)
  const analyticsRef = useRef<HTMLDivElement>(null)
  const teamSectionRef = useRef<HTMLDivElement>(null)

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
      gsap.fromTo(".reveal-team-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: teamSectionRef.current, start: "top 80%" }
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
      bio: 'Scaling the Battery-as-a-Service model to deliver clean, zero-upfront energy solutions.'
    },
    {
      name: 'Neha Kapoor',
      role: 'Lead Strategist, QwikSELL',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300',
      bio: 'Fostering B2B liquidation channels and optimizing device recovery cycles globally.'
    }
  ]

  return (
    <>
      <div style={{ position: 'relative', width: '100vw', height: '100vh', minHeight: '600px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
          <DataLifecycleEngine />
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

      <section id="team" ref={teamSectionRef} style={{ padding: '140px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Tag color="purple" style={{ marginBottom: '16px', fontWeight: 700 }}>EXECUTIVE MANAGEMENT</Tag>
            <Title level={2} style={{ fontSize: '2.6rem', fontWeight: 900 }}>The Corporate Leadership</Title>
          </div>
          <Row gutter={[24, 24]}>
            {teamMembers.map((member, index) => (
              <Col xs={24} sm={12} lg={6} key={index} className="reveal-team-card">
                <Card hoverable style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0' }} cover={<div style={{ height: '300px', overflow: 'hidden' }}><img alt={member.name} src={member.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>} styles={{ body: { padding: '28px', textAlign: 'center' } }}>
                  <Title level={4} style={{ margin: '0 0 4px 0', fontWeight: 700 }}>{member.name}</Title>
                  <Text style={{ display: 'block', color: '#6b21a8', fontWeight: 700, marginBottom: '14px' }}>{member.role}</Text>
                  <Paragraph type="secondary" style={{ fontSize: '13px', height: '60px', overflow: 'hidden' }}>{member.bio}</Paragraph>
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

            {/* Application Routing Layer */}
            <Routes>
              <Route path="/" element={<HomePageContent setQwiksellModalVisible={setQwiksellModalVisible} activeStep={activeStep} setActiveStep={setActiveStep} />} />
              <Route path="/urja" element={<UrjaPage />} />
              <Route path="/qwiksell" element={<QwikPage />} />
              <Route path="/careers" element={<CareersPage />} /> {/* NEW ROUTE */}
              <Route path="/contact" element={<ContactPage />} />
            </Routes>

            <Footer />

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