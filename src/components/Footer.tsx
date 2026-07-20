import { useRef, useState } from 'react'
import { Layout, Row, Col, Typography, Divider, Space, Button, message } from 'antd'
import {
    EnvironmentOutlined,
    MailOutlined,
    PhoneOutlined
} from '@ant-design/icons'
import exigoLogo from '../assets/exigo-logo.png'
import { useNavigate } from 'react-router-dom'

const { Footer: AntFooter } = Layout
const { Title, Paragraph, Text } = Typography

export default function Footer() {
    const navigate = useNavigate()
    const footerRef = useRef<HTMLDivElement>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    
    // State to handle newsletter form submission
    const [emailInput, setEmailInput] = useState('')
    const [loading, setLoading] = useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!footerRef.current) return
        const rect = footerRef.current.getBoundingClientRect()
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    const handleNavClick = (path: string, elementId?: string) => {
        navigate(path)
        if (elementId) {
            setTimeout(() => {
                const el = document.getElementById(elementId)
                if (el) el.scrollIntoView({ behavior: 'smooth' })
            }, 150)
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    // Handles submitting the newsletter form via Web3Forms
    const handleSubscribe = async () => {
        if (!emailInput) return
        setLoading(true)

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: "b8862d69-1033-4237-9b34-09549bcc1163",
                    email: emailInput,
                    subject: "🚀 New Corporate Newsletter Subscriber",
                    from_name: "Exigo Website Form"
                })
            })

            const result = await response.json()
            
            if (result.success) {
                message.success('Thank you for subscribing!')
                setEmailInput('')
            } else {
                message.error('Submission failed. Please try again.')
            }
        } catch (error) {
            console.error(error)
            message.error('Could not connect to the form service.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AntFooter 
            id="contact" 
            ref={footerRef}
            onMouseMove={handleMouseMove}
            style={{ 
                backgroundColor: '#090d1a', 
                color: '#94a3b8', 
                fontSize: '14px', 
                padding: '120px 40px 40px 40px', 
                margin: 0, 
                width: '100%', 
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
            }}
        >
            {/* CSS Animation & Hover Effects */}
            <style>
                {`
                @keyframes floatUp {
                    0% { transform: translateY(120px) scale(0.7); opacity: 0; }
                    50% { opacity: 0.15; }
                    100% { transform: translateY(-400px) scale(1.3); opacity: 0; }
                }

                .footer-particle {
                    position: absolute;
                    background: radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 75%);
                    border-radius: 50%;
                    pointer-events: none;
                    bottom: -150px;
                    animation: floatUp 16s infinite linear;
                }

                .footer-hover-link {
                    position: relative;
                    padding-left: 0;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
                    display: inline-flex;
                    align-items: center;
                    color: #94a3b8 !important;
                    cursor: pointer;
                }
                
                .footer-hover-link::before {
                    content: '→';
                    position: absolute;
                    left: -16px;
                    opacity: 0;
                    color: #a78bfa;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    font-weight: bold;
                    font-size: 13px;
                }

                .footer-hover-link:hover {
                    padding-left: 16px;
                    color: #a78bfa !important;
                    text-shadow: 0 0 8px rgba(167, 139, 250, 0.4);
                }

                .footer-hover-link:hover::before {
                    opacity: 1;
                    left: 0;
                }

                .contact-item {
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .contact-item:hover {
                    transform: translateY(-2px);
                    color: #ffffff;
                }

                .contact-item:hover .anticon {
                    transform: scale(1.2);
                    color: #a78bfa !important;
                    filter: drop-shadow(0 0 10px rgba(167, 139, 250, 0.7));
                }

                .newsletter-input {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 10px 16px;
                    border-radius: 12px;
                    color: #fff;
                    font-size: 13px;
                    width: 100%;
                    outline: none;
                    transition: all 0.3s ease;
                }

                .newsletter-input:focus {
                    border-color: rgba(167, 139, 250, 0.5) !important;
                    background: rgba(255, 255, 255, 0.08) !important;
                    box-shadow: 0 0 14px rgba(167, 139, 250, 0.2);
                }

                .newsletter-submit {
                    height: auto !important;
                    padding: 10px 20px !important;
                    border-radius: 12px !important;
                    background-color: #6b21a8 !important;
                    border: none !important;
                    font-weight: 700 !important;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }

                .newsletter-submit:hover {
                    background-color: #7c3aed !important;
                    transform: scale(1.03) !important;
                    box-shadow: 0 0 16px rgba(167, 139, 250, 0.5) !important;
                }
                `}
            </style>

            {/* Background spotlight following cursor */}
            <div
                style={{
                    left: `${mousePos.x}px`,
                    top: `${mousePos.y}px`,
                    transform: 'translate(-50%, -50%)',
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(107, 33, 168, 0.12) 0%, rgba(30, 58, 138, 0.05) 50%, transparent 80%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                    transition: 'left 0.15s ease-out, top 0.15s ease-out',
                    zIndex: 1
                }}
            />

            {/* Background Floating Particles */}
            <div className="footer-particle" style={{ left: '10%', animationDelay: '0s', animationDuration: '14s' }} />
            <div className="footer-particle" style={{ left: '40%', animationDelay: '4s', animationDuration: '18s' }} />
            <div className="footer-particle" style={{ left: '75%', animationDelay: '2s', animationDuration: '16s' }} />
            <div className="footer-particle" style={{ left: '90%', animationDelay: '7s', animationDuration: '20s' }} />

            <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                <Row gutter={[40, 40]}>
                    <Col xs={24} md={8}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                padding: '10px 24px',
                                borderRadius: '16px',
                                display: 'inline-flex',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}>
                                <img src={exigoLogo} alt="Exigo Cleantech" style={{ height: '38px', width: 'auto', objectFit: 'contain' }} />
                            </div>
                        </div>
                        <Paragraph style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '13.5px', marginBottom: '28px' }}>
                            We are a technology-led product lifecycle management platform. We build closed-loop business ecosystems that recover battery minerals and sanitize corporate hardware, steering industries toward a zero-waste economy.
                        </Paragraph>

                        {/* Interactive Newsletter Section */}
                        <div>
                            <Text style={{ color: '#fff', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '12px' }}>
                                Subscribe to Circular Insights
                            </Text>
                            <div style={{ display: 'flex', gap: '8px', maxWidth: '320px' }}>
                                <input 
                                    type="email" 
                                    placeholder="Corporate email..." 
                                    className="newsletter-input" 
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    disabled={loading}
                                />
                                <Button 
                                    type="primary" 
                                    className="newsletter-submit" 
                                    onClick={handleSubscribe}
                                    loading={loading}
                                >
                                    Join
                                </Button>
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} sm={12} md={{ span: 5, offset: 2 }}>
                        <Title level={5} style={{ color: '#fff', marginBottom: '24px', fontWeight: 800, fontSize: '15px', letterSpacing: '0.02em' }}>Quick Links</Title>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <a onClick={() => handleNavClick('/')} className="footer-hover-link">Home</a>
                            <a onClick={() => handleNavClick('/about')} className="footer-hover-link">About Us</a>
                            <a onClick={() => handleNavClick('/qwiksell')} className="footer-hover-link">QwikSELL Ecosystem</a>
                            <a onClick={() => handleNavClick('/urja')} className="footer-hover-link">Urja Mobility (BaaS)</a>
                            <a onClick={() => handleNavClick('/about', 'team')} className="footer-hover-link">Our Leadership</a>
                        </div>
                    </Col>

                    <Col xs={24} sm={12} md={4}>
                        <Title level={5} style={{ color: '#fff', marginBottom: '24px', fontWeight: 800, fontSize: '15px', letterSpacing: '0.02em' }}>Subsidiaries</Title>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <a href="https://urjamobility.in/" target="_blank" rel="noopener noreferrer" className="footer-hover-link">Urja Mobility ⚡</a>
                            <a onClick={() => handleNavClick('/qwiksell')} className="footer-hover-link">QwikSELL Re-commerce 💻</a>
                        </div>
                    </Col>

                    <Col xs={24} md={5}>
                        <Title level={5} style={{ color: '#fff', marginBottom: '24px', fontWeight: 800, fontSize: '15px', letterSpacing: '0.02em' }}>Contact Info</Title>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', color: '#94a3b8' }}>
                            <a
                                href="https://maps.app.goo.gl/RdECEkczHghMegqB6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-item"
                                style={{ color: 'inherit', textDecoration: 'none' }}
                            >
                                <EnvironmentOutlined style={{ color: '#6b21a8', fontSize: '19px', marginTop: '3px', transition: 'all 0.3s ease' }} />
                                <span style={{ lineHeight: '1.5' }}>Synq.Work - GSC Towers<br />Gurugram, Haryana, India</span>
                            </a>
                            <div
                                className="contact-item"
                                onClick={async () => {
                                    const email = 'info@exigocleantech.com'
                                    const subject = 'Business Inquiry'
                                    const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent)

                                    if (isApple) {
                                        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`
                                        return
                                    }

                                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}`
                                    const newTab = window.open(gmailUrl, '_blank')

                                    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
                                        try {
                                            if (!navigator.clipboard?.writeText) {
                                                throw new Error('Clipboard API unavailable')
                                            }
                                            await navigator.clipboard.writeText(email)
                                            message.info('Email copied to clipboard! You can paste it into your mail app.')
                                        } catch {
                                            message.error('Could not open email or copy the address. Please copy it manually.')
                                        }
                                    }
                                }}
                            >
                                <MailOutlined style={{ color: '#6b21a8', fontSize: '16px', transition: 'all 0.3s ease' }} />
                                <span style={{ textDecoration: 'underline' }}>info@exigocleantech.com</span>
                            </div>
                            <div className="contact-item">
                                <PhoneOutlined style={{ color: '#6b21a8', fontSize: '16px', transition: 'all 0.3s ease' }} />
                                <span>+918277343434</span>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Divider style={{ margin: '50px 0 24px 0', borderColor: 'rgba(255, 255, 255, 0.05)' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '13px' }}>
                    <span>© {new Date().getFullYear()} Exigo Cleantech. All Rights Reserved.</span>
                    <Space size="large">
                        <a style={{ color: '#64748b', cursor: 'pointer' }} className="footer-hover-link">Privacy Policy</a>
                        <a style={{ color: '#64748b', cursor: 'pointer' }} className="footer-hover-link">Terms of Service</a>
                    </Space>
                </div>
            </div>
        </AntFooter>
    )
}