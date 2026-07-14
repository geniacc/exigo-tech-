import { useState, useEffect, useRef } from 'react'
import { Layout, Button, Space, Drawer } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import exigoLogo from '../assets/exigo-logo.png'

const { Header } = Layout

export default function Navbar() {
    const [drawerVisible, setDrawerVisible] = useState(false)
    const [visible, setVisible] = useState(true)
    const lastScrollY = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            if (currentScrollY < 50) {
                setVisible(true)
                lastScrollY.current = currentScrollY
                return
            }

            if (currentScrollY > lastScrollY.current) {
                setVisible(false)
            } else {
                setVisible(true)
            }

            lastScrollY.current = currentScrollY
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleNavClick = (path: string, elementId?: string) => {
        setDrawerVisible(false)

        // react-router-dom's navigate handles basename routes automatically 
        // when basename is provided to <BrowserRouter>
        navigate(path)

        if (elementId) {
            setTimeout(() => {
                const el = document.getElementById(elementId)
                if (el) el.scrollIntoView({ behavior: 'smooth' })
            }, 150)
        }
    }

    return (
        <>
            <Header
                className={`smart-animated-navbar ${visible ? 'nav-visible' : 'nav-hidden'}`}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    width: '100%',
                    zIndex: 1000
                }}
            >
                {/* LOGO CONTAINER */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        height: '100%',
                        flexShrink: 0,
                        zIndex: 10
                    }}
                    onClick={() => handleNavClick('/')}
                >
                    <img
                        src={exigoLogo}
                        alt="Exigo Cleantech"
                        style={{
                            maxHeight: '44px',
                            width: 'auto',
                            objectFit: 'contain',
                            backgroundColor: '#ffffff', // Forces a white background
                            padding: '4px 12px',        // Gives the logo breathing room inside the white box
                            borderRadius: '8px'         // Smooth, rounded corners
                        }}
                    />
                </div>

                {/* Desktop Links */}
                <Space size="large" className="desktop-only">
                    <Button type="text" onClick={() => handleNavClick('/')} style={{ fontWeight: 600 }}>Home</Button>
                    <Button type="text" onClick={() => handleNavClick('/about')} style={{ fontWeight: 600 }}>About Us</Button>
                    <Button type="text" onClick={() => handleNavClick('/qwiksell')} style={{ fontWeight: 600 }}>QwikSELL</Button>
                    <Button type="text" onClick={() => handleNavClick('/urja')} style={{ fontWeight: 600 }}>Urja Mobility</Button>
                    <Button type="text" onClick={() => handleNavClick('/about', 'team')} style={{ fontWeight: 600 }}>Our Team</Button>
                    <Button type="text" onClick={() => handleNavClick('/careers')} style={{ fontWeight: 600 }}>Careers</Button>
                    <Button type="text" onClick={() => handleNavClick('/', 'investors')} style={{ fontWeight: 600 }}>Investors</Button>

                    <Button
                        type="primary"
                        onClick={() => handleNavClick('/contact')}
                        style={{
                            fontWeight: 600,
                            backgroundColor: '#1e3a8a',
                            borderColor: '#1e3a8a',
                            borderRadius: '24px',
                            padding: '0 24px',
                            height: '42px',
                            boxShadow: '0 8px 24px -4px rgba(30, 58, 138, 0.2)'
                        }}
                    >
                        Contact Us
                    </Button>
                </Space>

                {/* Mobile Menu Button */}
                <Button
                    type="text"
                    icon={<MenuOutlined style={{ fontSize: '24px', color: '#0f172a' }} />}
                    className="mobile-only"
                    onClick={() => setDrawerVisible(true)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                />
            </Header>

            {/* Mobile Drawer */}
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src={exigoLogo}
                            alt="Exigo Logo"
                            style={{
                                height: '36px',
                                width: 'auto',
                                objectFit: 'contain',
                                backgroundColor: '#ffffff', // Forces a white background in drawer too
                                padding: '4px 8px',
                                borderRadius: '6px'
                            }}
                        />
                    </div>
                }
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                styles={{ wrapper: { width: 280 }, body: { padding: '12px 0' } }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Button type="text" onClick={() => handleNavClick('/')} style={{ textAlign: 'left', padding: '12px 24px', fontSize: '15px', fontWeight: 600 }}>Home</Button>
                    <Button type="text" onClick={() => handleNavClick('/about')} style={{ textAlign: 'left', padding: '12px 24px', fontSize: '15px', fontWeight: 600 }}>About Us</Button>
                    <Button type="text" onClick={() => handleNavClick('/qwiksell')} style={{ textAlign: 'left', padding: '12px 24px', fontSize: '15px', fontWeight: 600 }}>QwikSELL</Button>
                    <Button type="text" onClick={() => handleNavClick('/urja')} style={{ textAlign: 'left', padding: '12px 24px', fontSize: '15px', fontWeight: 600 }}>URJA Mobility</Button>
                    <Button type="text" onClick={() => handleNavClick('/about', 'team')} style={{ textAlign: 'left', padding: '12px 24px', fontSize: '15px', fontWeight: 600 }}>Our Team</Button>
                    <Button type="text" onClick={() => handleNavClick('/careers')} style={{ textAlign: 'left', padding: '12px 24px', fontSize: '15px', fontWeight: 600 }}>Careers</Button>
                    <Button type="text" onClick={() => handleNavClick('/', 'investors')} style={{ textAlign: 'left', padding: '12px 24px', fontSize: '15px', fontWeight: 600 }}>Investors</Button>

                    <div style={{ padding: '16px 24px 0 24px' }}>
                        <Button
                            type="primary"
                            onClick={() => handleNavClick('/contact')}
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
        </>
    )
}