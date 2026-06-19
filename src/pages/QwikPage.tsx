import { useRef, useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Typography, Tag, Steps, Button, Slider, Statistic, Divider } from 'antd';
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
    SyncOutlined
} from '@ant-design/icons';

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
            { threshold: 0.15 } // Triggers when 15% of the element is visible
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
};

export default function QwikPageAnimatedText() {
    // Interactive States
    const [deviceCount, setDeviceCount] = useState<number>(1000);
    const [isScanning, setIsScanning] = useState(false);
    const [scanLogs, setScanLogs] = useState<string[]>([
        "SYSTEM WAITING...",
        "READY TO SCAN DEVICE..."
    ]);

    // Scroll Triggers
    const stepsReveal = useScrollReveal();
    const calcReveal = useScrollReveal();
    const techReveal = useScrollReveal();
    const impactReveal = useScrollReveal();
    const footerReveal = useScrollReveal();

    // Impact Counters (Triggered on scroll)
    const ewasteCount = useCountUp(impactReveal.isVisible ? 14500 : 0, 2500);
    const co2Count = useCountUp(impactReveal.isVisible ? 8200 : 0, 2500);
    const capitalCount = useCountUp(impactReveal.isVisible ? 124 : 0, 2500);

    // Interactive Scan Simulation
    const triggerScan = () => {
        if (isScanning) return;
        setIsScanning(true);
        setScanLogs(["CONNECTING TO DEVICE..."]);

        setTimeout(() => setScanLogs(prev => [...prev, "CHECKING SYSTEM HEALTH..."]), 800);
        setTimeout(() => setScanLogs(prev => [...prev, "TESTING BATTERY LIFE... [PERFECT]"]), 1600);
        setTimeout(() => setScanLogs(prev => [...prev, "SECURELY ERASING ALL DATA..."]), 2400);
        setTimeout(() => setScanLogs(prev => [...prev, "CALCULATING BEST PRICE..."]), 3200);

        setTimeout(() => {
            setIsScanning(false);
            setScanLogs(prev => [...prev, "SCAN COMPLETE. READY TO SELL!"]);
        }, 4000);
    };

    return (
        <Content style={{ backgroundColor: '#f8fafc', overflowX: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* CSS Animations Injected directly for self-containment */}
            <style>
                {`
                @keyframes float {
                    0% { transform: translate(0px, 0px) rotate(0deg); }
                    33% { transform: translate(15px, -15px) rotate(5deg); }
                    66% { transform: translate(-15px, 15px) rotate(-5deg); }
                    100% { transform: translate(0px, 0px) rotate(0deg); }
                }
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes scanline {
                    0% { top: 0; opacity: 0.2; }
                    50% { opacity: 0.8; }
                    100% { top: 100%; opacity: 0.2; }
                }
                @keyframes overdrive {
                    0% { top: 0%; box-shadow: 0 0 10px #10b981; }
                    50% { box-shadow: 0 0 30px #10b981; background: #10b981; }
                    100% { top: 100%; box-shadow: 0 0 10px #10b981; }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                /* Hero Specific Text Animations */
                .hero-text { animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .delay-1 { animation-delay: 0.1s; }
                .delay-2 { animation-delay: 0.3s; }
                .delay-3 { animation-delay: 0.5s; }
                .delay-4 { animation-delay: 0.7s; }

                /* Staggered Scroll Animations for text across the page */
                .stagger-text {
                    opacity: 0;
                    transform: translateY(20px);
                }
                .visible .stagger-text {
                    animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .visible .stagger-1 { animation-delay: 0.1s; }
                .visible .stagger-2 { animation-delay: 0.2s; }
                .visible .stagger-3 { animation-delay: 0.3s; }
                .visible .stagger-4 { animation-delay: 0.4s; }
                .visible .stagger-5 { animation-delay: 0.5s; }

                /* Card container animations */
                .reveal-card { transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); opacity: 0; transform: translateY(40px); }
                .reveal-card.visible { opacity: 1; transform: translateY(0); }
                `}
            </style>

            {/* HERO SECTION */}
            <div style={{ padding: '160px 24px 100px 24px', position: 'relative', overflow: 'hidden' }}>
                <svg style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.4, zIndex: 0, animation: 'float 8s ease-in-out infinite' }} width="400" height="400" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#d8b4fe" strokeWidth="2" strokeDasharray="10 10" />
                    <circle cx="100" cy="100" r="60" fill="rgba(216, 180, 254, 0.2)" />
                </svg>

                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <div className="hero-text delay-1">
                        <Tag color="purple" style={{ padding: '8px 20px', borderRadius: '24px', fontWeight: 800, border: '1px solid #d8b4fe', backgroundColor: '#faf5ff', color: '#7e22ce', fontSize: '14px', letterSpacing: '1px' }}>
                            <ThunderboltOutlined /> QWIKSELL DEVICE TRADE-IN PLATFORM
                        </Tag>
                    </div>
                    <Title level={1} className="hero-text delay-2" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, color: '#0f172a', margin: '32px 0 24px 0', lineHeight: '1.1', letterSpacing: '-1px' }}>
                        Selling Your Company's Old Tech, <br />
                        <span style={{ background: 'linear-gradient(90deg, #6b21a8, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Made Simple & Secure.
                        </span>
                    </Title>
                    <Paragraph className="hero-text delay-3" style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '850px', margin: '0 auto 40px auto', lineHeight: '1.8' }}>
                        Upgrading your office tech shouldn't mean leaving money on the table. We automatically test your old laptops and phones, give you an instant fair price, securely wipe your data, and sell them to trusted buyers.
                    </Paragraph>
                    <div className="hero-text delay-4" style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <Button type="primary" size="large" style={{ background: '#0f172a', height: '56px', padding: '0 32px', fontSize: '16px', fontWeight: 600, borderRadius: '28px' }}>
                            Start Selling Now
                        </Button>
                        <Button size="large" style={{ height: '56px', padding: '0 32px', fontSize: '16px', fontWeight: 600, borderRadius: '28px', border: '2px solid #e2e8f0', color: '#0f172a' }}>
                            See How it Works
                        </Button>
                    </div>
                </div>
            </div>

            {/* CSS-DRIVEN MARQUEE */}
            <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', background: '#ffffff', padding: '16px 0', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex' }}>
                <div style={{ display: 'flex', width: '200%', animation: 'marquee 25s linear infinite' }}>
                    <div style={{ display: 'flex', flexShrink: 0, width: '50%', justifyContent: 'space-around', alignItems: 'center' }}>
                        {['LAPTOP PRICES UP 2.4%', 'HIGH DEMAND FOR USED THINKPADS', 'ECO-FRIENDLY REPORTS READY', '14,000 PHONES SECURELY WIPED TODAY', 'MARKET PRICES: STABLE'].map((txt, i) => (
                            <span key={i} style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                <GlobalOutlined style={{ marginRight: '8px', color: '#8b5cf6' }} /> {txt}
                            </span>
                        ))}
                    </div>
                    <div style={{ display: 'flex', flexShrink: 0, width: '50%', justifyContent: 'space-around', alignItems: 'center' }}>
                        {['LAPTOP PRICES UP 2.4%', 'HIGH DEMAND FOR USED THINKPADS', 'ECO-FRIENDLY REPORTS READY', '14,000 PHONES SECURELY WIPED TODAY', 'MARKET PRICES: STABLE'].map((txt, i) => (
                            <span key={`dup-${i}`} style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                <GlobalOutlined style={{ marginRight: '8px', color: '#8b5cf6' }} /> {txt}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* PIPELINE & TERMINAL */}
            <div ref={stepsReveal.ref} className={stepsReveal.isVisible ? 'visible' : ''} style={{ padding: '120px 24px', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
                <Row gutter={[80, 64]} align="middle">
                    <Col xs={24} lg={12}>
                        <div className="stagger-text stagger-1">
                            <Tag color="blue" style={{ marginBottom: '16px', borderRadius: '16px', fontWeight: 700 }}>HOW IT WORKS</Tag>
                        </div>
                        <div className="stagger-text stagger-2">
                            <Title level={2} style={{ fontWeight: 800, color: '#0f172a', marginBottom: '16px', fontSize: '2.5rem' }}>A Seamless Selling Process</Title>
                        </div>
                        <div className="stagger-text stagger-3">
                            <Text style={{ fontSize: '1.1rem', color: '#64748b', display: 'block', marginBottom: '48px', lineHeight: 1.6 }}>From your office desk to a trusted buyer, we handle the entire process automatically.</Text>
                        </div>

                        <div className="stagger-text stagger-4">
                            <Steps
                                orientation="vertical"
                                current={isScanning ? 1 : 4}
                                status={isScanning ? "process" : "finish"}
                                items={[
                                    {
                                        title: <span style={{ fontWeight: 800, fontSize: '20px', color: '#0f172a' }}>Automated Device Testing</span>,
                                        description: <span style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, display: 'block', marginTop: '8px', marginBottom: '24px' }}>Our software instantly checks your device's health, removing the guesswork and human error from the evaluation.</span>,
                                        icon: <SettingOutlined />
                                    },
                                    {
                                        title: <span style={{ fontWeight: 800, fontSize: '20px', color: '#0f172a' }}>Secure Data Wiping</span>,
                                        description: <span style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, display: 'block', marginTop: '8px', marginBottom: '24px' }}>We completely and permanently erase all your company data to military-grade standards, keeping your information safe.</span>,
                                        icon: <LockOutlined />
                                    },
                                    {
                                        title: <span style={{ fontWeight: 800, fontSize: '20px', color: '#0f172a' }}>Instant Smart Pricing</span>,
                                        description: <span style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, display: 'block', marginTop: '8px', marginBottom: '24px' }}>We scan the global market in real-time to give you the highest possible cash value for your used equipment.</span>,
                                        icon: <RobotOutlined />
                                    },
                                    {
                                        title: <span style={{ fontWeight: 800, fontSize: '20px', color: '#0f172a' }}>Trusted Buyer Network</span>,
                                        description: <span style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, display: 'block', marginTop: '8px' }}>We securely sell your wiped and tested devices to our network of certified, eco-friendly refurbishers.</span>,
                                        icon: <ShopOutlined />
                                    }
                                ]}
                            />
                        </div>
                    </Col>

                    {/* Terminal Window */}
                    <Col xs={24} lg={12} className={`reveal-card ${stepsReveal.isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
                        <div style={{ background: '#0f172a', borderRadius: '24px', padding: '4px', boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.4)' }}>
                            <div style={{ background: '#1e293b', borderRadius: '20px', padding: '40px', position: 'relative', overflow: 'hidden', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>

                                <div style={{
                                    position: 'absolute', left: 0, width: '100%', height: '4px', zIndex: 10,
                                    background: isScanning ? 'linear-gradient(90deg, transparent, #10b981, transparent)' : 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
                                    animation: isScanning ? 'overdrive 0.8s ease-in-out infinite' : 'scanline 3s linear infinite'
                                }} />

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', borderBottom: '1px solid #334155', paddingBottom: '20px' }}>
                                    <div>
                                        <Title level={4} style={{ margin: 0, color: '#f8fafc', fontWeight: 800 }}>Live Device Scanner</Title>
                                        <Text style={{ color: '#94a3b8', fontSize: '12px', fontFamily: 'monospace' }}>SCANNER v2.4</Text>
                                    </div>
                                    <Tag color={isScanning ? "orange" : "green"} icon={isScanning ? <SyncOutlined spin /> : <CheckCircleOutlined />} style={{ padding: '6px 12px', borderRadius: '12px', fontSize: '13px' }}>
                                        {isScanning ? "SCANNING NOW..." : "SYSTEM READY"}
                                    </Tag>
                                </div>

                                <div style={{ flex: 1, background: '#0f172a', borderRadius: '12px', padding: '20px', fontFamily: 'monospace', color: '#10b981', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid #334155', marginBottom: '24px' }}>
                                    {scanLogs.map((log, i) => (
                                        <div key={i} style={{ opacity: i === scanLogs.length - 1 ? 1 : 0.6 }}>
                                            <span style={{ color: '#64748b' }}>[{new Date().toLocaleTimeString()}]</span> {log}
                                        </div>
                                    ))}
                                    {isScanning && <div style={{ width: '10px', height: '16px', background: '#10b981', display: 'inline-block', marginTop: '4px', animation: 'fadeUp 0.5s infinite alternate' }} />}
                                </div>

                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    onClick={triggerScan}
                                    disabled={isScanning}
                                    style={{ height: '60px', fontSize: '16px', fontWeight: 700, borderRadius: '16px', background: isScanning ? '#475569' : 'linear-gradient(90deg, #6b21a8, #3b82f6)', border: 'none' }}
                                >
                                    {isScanning ? "SCANNING DEVICE..." : "START DEVICE SCAN"}
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* ROI SLIDER WIDGET */}
            <div ref={calcReveal.ref} className={calcReveal.isVisible ? 'visible' : ''} style={{ background: '#0f172a', padding: '120px 24px', color: '#fff' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <div className="stagger-text stagger-1">
                        <Tag color="purple" style={{ marginBottom: '24px', background: 'rgba(139, 92, 246, 0.2)', border: 'none', color: '#c084fc', padding: '6px 16px', borderRadius: '20px', fontWeight: 700 }}>EARNINGS ESTIMATOR</Tag>
                    </div>
                    <div className="stagger-text stagger-2">
                        <Title level={2} style={{ color: '#f8fafc', fontWeight: 800, fontSize: '2.5rem', marginBottom: '16px' }}>See How Much You Could Earn</Title>
                    </div>
                    <div className="stagger-text stagger-3">
                        <Paragraph style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '64px' }}>Use the slider below to see how much cash you could get back for your company's old devices.</Paragraph>
                    </div>

                    <Card className="stagger-text stagger-4" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '32px', padding: '40px' }}>
                        <Title level={4} style={{ color: '#cbd5e1', marginBottom: '40px' }}>NUMBER OF DEVICES TO SELL</Title>

                        <Slider
                            min={100} max={10000} step={50}
                            value={deviceCount} onChange={setDeviceCount}
                            tooltip={{ formatter: val => `${val} Devices` }}
                            trackStyle={{ background: '#8b5cf6', height: '8px' }}
                            handleStyle={{ borderColor: '#8b5cf6', width: '24px', height: '24px', marginTop: '-8px', backgroundColor: '#fff' }}
                            railStyle={{ background: '#334155', height: '8px' }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontWeight: 700, marginTop: '16px' }}>
                            <span>100 Units</span>
                            <span style={{ color: '#c084fc', fontSize: '24px', transition: 'all 0.3s' }}>{deviceCount.toLocaleString()} Selected</span>
                            <span>10k+ Units</span>
                        </div>

                        <Divider style={{ borderColor: '#334155', margin: '48px 0' }} />

                        <Row gutter={32} justify="center">
                            <Col xs={24} md={12}>
                                <Text style={{ color: '#94a3b8', fontWeight: 600, letterSpacing: '1px' }}>ESTIMATED CASH RETURN</Text>
                                <div style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, color: '#10b981', lineHeight: 1.2, marginTop: '8px', transition: 'all 0.3s' }}>
                                    ${((deviceCount * 245) / 1000).toFixed(1)}k
                                </div>
                            </Col>
                            <Col xs={24} md={12}>
                                <Text style={{ color: '#94a3b8', fontWeight: 600, letterSpacing: '1px' }}>TIME TO COMPLETE</Text>
                                <div style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, color: '#f8fafc', lineHeight: 1.2, marginTop: '8px', transition: 'all 0.3s' }}>
                                    {Math.max(2, Math.ceil(deviceCount / 1000))} Days
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>

            {/* ARCHITECTURE GRID */}
            <div ref={techReveal.ref} className={techReveal.isVisible ? 'visible' : ''} style={{ padding: '120px 24px', maxWidth: '1400px', margin: '0 auto' }}>
                <div className="stagger-text stagger-1">
                    <Title level={2} style={{ textAlign: 'center', fontWeight: 900, fontSize: '2.5rem', marginBottom: '16px', color: '#0f172a' }}>Everything You Need to Upgrade Easily</Title>
                </div>
                <div className="stagger-text stagger-2">
                    <Paragraph style={{ textAlign: 'center', fontSize: '1.2rem', color: '#64748b', marginBottom: '64px', maxWidth: '600px', margin: '0 auto 64px auto' }}>Built for businesses of all sizes. We handle the heavy lifting so you can focus on your work.</Paragraph>
                </div>

                <Row gutter={[32, 32]}>
                    {[
                        { title: 'Fair & Honest Grading', icon: <FileSearchOutlined />, desc: 'We use software to grade the condition of your devices, ensuring you always get a fair and consistent price.' },
                        { title: 'Best Market Prices', icon: <RobotOutlined />, desc: 'Our smart pricing tool tracks the used electronics market daily to guarantee you lock in the highest returns.' },
                        { title: 'Easy Pickup & Tracking', icon: <BarcodeOutlined />, desc: 'We handle the shipping. Schedule bulk pickups and track your devices all the way to our secure facility.' },
                        { title: 'Trusted Buyers Only', icon: <ShopOutlined />, desc: 'We protect your brand by making sure your old devices are only sold to certified, eco-friendly recycling partners.' },
                        { title: 'Certified Eco-Friendly', icon: <LockOutlined />, desc: 'We provide official certificates for data destruction and recycling, helping you meet your company\'s green goals.' },
                        { title: 'Scan From Your Desk', icon: <SettingOutlined />, desc: 'Check the health and value of hundreds of company laptops at once, right from your office computer.' }
                    ].map((item, idx) => (
                        <Col xs={24} md={12} lg={8} key={idx} className={`reveal-card ${techReveal.isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${(idx * 0.1) + 0.3}s` }}>
                            <Card style={{ height: '100%', borderRadius: '24px', border: '1px solid #e2e8f0', background: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }} hoverable>
                                <div style={{ fontSize: '32px', color: '#6b21a8', marginBottom: '24px', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px', border: '1px solid #e9d5ff' }}>
                                    {item.icon}
                                </div>
                                <h5 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.25rem', marginBottom: '12px' }}>{item.title}</h5>
                                <span style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7', display: 'block' }}>{item.desc}</span>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* IMPACT SCROLL REVEAL COUNTERS */}
            <div ref={impactReveal.ref} className={impactReveal.isVisible ? 'visible' : ''} style={{ padding: '100px 24px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <div className="stagger-text stagger-1">
                        <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginBottom: '64px', textTransform: 'uppercase', letterSpacing: '2px' }}>Global Impact To Date</Title>
                    </div>
                    <Row gutter={[48, 48]} className="stagger-text stagger-2">
                        <Col xs={24} md={8}>
                            <Statistic title={<span style={{ color: '#64748b', fontWeight: 700, letterSpacing: '1px' }}>POUNDS OF E-WASTE SAVED</span>} value={ewasteCount} valueStyle={{ fontSize: '4rem', fontWeight: 900, color: '#10b981' }} formatter={(val) => Number(val).toLocaleString()} />
                        </Col>
                        <Col xs={24} md={8}>
                            <Statistic title={<span style={{ color: '#64748b', fontWeight: 700, letterSpacing: '1px' }}>TONS OF CO2 PREVENTED</span>} value={co2Count} valueStyle={{ fontSize: '4rem', fontWeight: 900, color: '#3b82f6' }} formatter={(val) => Number(val).toLocaleString()} />
                        </Col>
                        <Col xs={24} md={8}>
                            <Statistic title={<span style={{ color: '#64748b', fontWeight: 700, letterSpacing: '1px' }}>MILLIONS PAID TO CLIENTS</span>} value={capitalCount / 10} valueStyle={{ fontSize: '4rem', fontWeight: 900, color: '#8b5cf6' }} precision={1} prefix="$" />
                        </Col>
                    </Row>
                </div>
            </div>

            {/* FOOTER CTA */}
            <div ref={footerReveal.ref} className={footerReveal.isVisible ? 'visible' : ''} style={{ padding: '160px 24px', textAlign: 'center', background: '#ffffff' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="stagger-text stagger-1">
                        <Title level={1} style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, color: '#0f172a', marginBottom: '32px', lineHeight: 1.1 }}>
                            Ready to Turn Your Old Tech <span style={{ color: '#6b21a8' }}>Into Cash?</span>
                        </Title>
                    </div>
                    <div className="stagger-text stagger-2">
                        <Paragraph style={{ fontSize: '1.25rem', color: '#475569', marginBottom: '48px' }}>
                            Join hundreds of businesses that are easily upgrading their tech and protecting the planet.
                        </Paragraph>
                    </div>
                    <div className="stagger-text stagger-3">
                        <Button
                            type="primary" size="large" icon={<ArrowRightOutlined />}
                            style={{ height: '72px', padding: '0 48px', fontSize: '1.25rem', fontWeight: 800, borderRadius: '36px', background: 'linear-gradient(90deg, #0f172a, #1e293b)', border: 'none', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)' }}
                        >
                            Get Your Free Estimate Today
                        </Button>
                    </div>
                </div>
            </div>
        </Content>
    );
}