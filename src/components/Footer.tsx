import { Layout, Row, Col, Typography, Divider, Space } from 'antd'
import {
    EnvironmentOutlined,
    MailOutlined,
    PhoneOutlined
} from '@ant-design/icons'
import exigoLogo from '../assets/exigo-logo.png'

const { Footer: AntFooter } = Layout
const { Title, Paragraph } = Typography

export default function Footer() {
    const handleScrollTo = (id: string) => {
        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <AntFooter id="contact" style={{ backgroundColor: '#0f172a', color: '#94a3b8', fontSize: '14px', padding: '100px 40px 40px 40px', margin: 0, width: '100%', flexShrink: 0 }}>
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
        </AntFooter>
    )
}