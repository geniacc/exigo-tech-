import { useRef, useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Typography, Tag, Button, Slider, Statistic } from 'antd';
import {
    ThunderboltOutlined,
    CheckCircleOutlined,
    GlobalOutlined,
    DashboardOutlined,
    InfoCircleOutlined,
    SyncOutlined,
    SafetyOutlined,
    CarOutlined,
    ArrowRightOutlined,
    NodeIndexOutlined,
    WifiOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// --- Custom Hooks for Animations ---
const useCountUp = (end: number, duration: number = 2500) => {
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
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return { ref, isVisible };
};

export default function UrjaPageFriendly() {
    // Interactive States
    const [fleetSize, setFleetSize] = useState<number>(50);
    const [isSwapping, setIsSwapping] = useState(false);
    const [batteryLevel, setBatteryLevel] = useState(14);
    const [swapLogs, setSwapLogs] = useState<string[]>(["WAITING FOR VEHICLE..."]);

    // Scroll Triggers
    const dashboardReveal = useScrollReveal();
    const valueReveal = useScrollReveal();
    const calcReveal = useScrollReveal();
    const techReveal = useScrollReveal();
    const impactReveal = useScrollReveal();

    // Impact Counters
    const activeNodes = useCountUp(impactReveal.isVisible ? 12450 : 0, 2500);
    const carbonOffset = useCountUp(impactReveal.isVisible ? 840 : 0, 2500);
    const uptimeMetrics = useCountUp(impactReveal.isVisible ? 99 : 0, 2500);

    // Interactive Battery Swap Simulator
    const handleSwap = () => {
        if (isSwapping) return;
        setIsSwapping(true);
        setSwapLogs(["CHECKING DRIVER ID..."]);

        setTimeout(() => setSwapLogs(prev => [...prev, "REMOVING LOW BATTERY (14%)..."]), 800);
        setTimeout(() => setBatteryLevel(0), 1200);
        setTimeout(() => setSwapLogs(prev => [...prev, "INSERTING FULLY CHARGED BATTERY..."]), 1800);
        setTimeout(() => {
            setBatteryLevel(100);
            setSwapLogs(prev => [...prev, "SAFETY CHECKS COMPLETE."]);
        }, 2600);
        setTimeout(() => {
            setSwapLogs(prev => [...prev, "ALL DONE! READY TO DRIVE."]);
            setIsSwapping(false);
        }, 3500);
    };

    return (
        <Content style={{ backgroundColor: '#f8fafc', overflowX: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* INJECTED CSS ANIMATIONS */}
            <style>
                {`
                .urja-bg-grid {
                    background-size: 40px 40px;
                    background-image: linear-gradient(to right, rgba(30, 58, 138, 0.05) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(30, 58, 138, 0.05) 1px, transparent 1px);
                }
                @keyframes float-slow {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(3deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                    70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hero-anim { animation: fadeUp 1s ease-out forwards; opacity: 0; }
                .delay-1 { animation-delay: 0.1s; }
                .delay-2 { animation-delay: 0.2s; }
                .delay-3 { animation-delay: 0.3s; }
                
                .reveal-section { transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); opacity: 0; transform: translateY(50px); }
                .reveal-section.visible { opacity: 1; transform: translateY(0); }
                
                .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
                .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(30, 58, 138, 0.1) !important; }
                `}
            </style>

            <div className="urja-bg-grid" style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>

                {/* HERO SECTION */}
                <div style={{ padding: '140px 24px 100px 24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '15%', left: '5%', fontSize: '180px', color: 'rgba(30, 58, 138, 0.03)', animation: 'float-slow 6s infinite ease-in-out', pointerEvents: 'none' }}>
                        <ThunderboltOutlined />
                    </div>
                    <div style={{ position: 'absolute', top: '40%', right: '5%', fontSize: '240px', color: 'rgba(16, 185, 129, 0.03)', animation: 'float-slow 8s infinite ease-in-out reverse', pointerEvents: 'none' }}>
                        <SyncOutlined />
                    </div>

                    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                        <div className="hero-anim delay-1">
                            <Tag style={{ padding: '8px 20px', borderRadius: '24px', fontWeight: 800, letterSpacing: '0.1em', border: 'none', backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '14px' }}>
                                <NodeIndexOutlined style={{ marginRight: '8px' }} /> URJA MOBILITY PLATFORM
                            </Tag>
                        </div>
                        <Title className="hero-anim delay-2" level={1} style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 900, color: '#0f172a', margin: '32px 0 24px 0', lineHeight: '1.1', letterSpacing: '-1px' }}>
                            Electric Fleets <br />
                            <span style={{ background: 'linear-gradient(90deg, #1e3a8a, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Made Simple & Smart
                            </span>
                        </Title>
                        <Paragraph className="hero-anim delay-3" style={{ fontSize: '1.3rem', color: '#475569', maxWidth: '850px', margin: '0 auto 40px auto', lineHeight: '1.7' }}>
                            We make running an electric fleet easy. Forget about buying expensive batteries—just subscribe to our swap network. We give you the batteries, the charging stations, and the app you need to keep your drivers on the road making money.
                        </Paragraph>

                        <div className="hero-anim delay-3" style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <Button
                                type="primary"
                                size="large"
                                href="https://urjamobility.in/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ backgroundColor: '#1e3a8a', height: '60px', padding: '0 40px', fontSize: '16px', fontWeight: 700, borderRadius: '30px', boxShadow: '0 10px 25px rgba(30, 58, 138, 0.3)' }}
                            >
                                Visit urjamobility.in
                            </Button>
                            <Button
                                size="large"
                                style={{ height: '60px', padding: '0 40px', fontSize: '16px', fontWeight: 700, borderRadius: '30px', border: '2px solid #cbd5e1', color: '#0f172a' }}
                            >
                                See How It Works
                            </Button>
                        </div>
                    </div>
                </div>

                {/* LIVE TICKER MARQUEE */}
                <div style={{ background: '#0f172a', padding: '16px 0', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', borderTop: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', width: '200%', animation: 'marquee 30s linear infinite' }}>
                        <div style={{ display: 'flex', flexShrink: 0, width: '50%', justifyContent: 'space-around', alignItems: 'center' }}>
                            {['ALWAYS ONLINE: 99.9%', '450+ SWAP STATIONS', 'BATTERY SWAP IN 90 SECONDS', 'LIVE VEHICLE TRACKING', '100% SAFETY RECORD'].map((txt, i) => (
                                <span key={i} style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', letterSpacing: '2px' }}>
                                    <span style={{ color: '#10b981', marginRight: '8px' }}>●</span> {txt}
                                </span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexShrink: 0, width: '50%', justifyContent: 'space-around', alignItems: 'center' }}>
                            {['ALWAYS ONLINE: 99.9%', '450+ SWAP STATIONS', 'BATTERY SWAP IN 90 SECONDS', 'LIVE VEHICLE TRACKING', '100% SAFETY RECORD'].map((txt, i) => (
                                <span key={`dup-${i}`} style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', letterSpacing: '2px' }}>
                                    <span style={{ color: '#10b981', marginRight: '8px' }}>●</span> {txt}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* INTERACTIVE DASHBOARD SECTION */}
                <div ref={dashboardReveal.ref} className={`reveal-section ${dashboardReveal.isVisible ? 'visible' : ''}`} style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <Title level={2} style={{ fontWeight: 900, color: '#0f172a', fontSize: '2.5rem', marginBottom: '16px' }}>Live Station Simulator</Title>
                        <Text style={{ fontSize: '1.2rem', color: '#64748b' }}>See exactly what happens when a driver arrives to swap an empty battery for a full one.</Text>
                    </div>

                    <div style={{ background: '#ffffff', borderRadius: '32px', padding: '8px', boxShadow: '0 30px 60px -15px rgba(30, 58, 138, 0.15)', border: '1px solid #e2e8f0' }}>
                        <Row style={{ background: '#f8fafc', borderRadius: '24px', overflow: 'hidden' }}>

                            {/* Terminal Left */}
                            <Col xs={24} lg={14} style={{ padding: '40px', borderRight: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                    <Title level={4} style={{ margin: 0, color: '#0f172a', fontWeight: 800 }}><WifiOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />Station 4 - City Center</Title>
                                    <Tag color={isSwapping ? "orange" : "green"} style={{ padding: '6px 16px', borderRadius: '20px', fontWeight: 700 }}>
                                        {isSwapping ? "SWAPPING NOW..." : "STATION READY"}
                                    </Tag>
                                </div>

                                <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                                    <Col span={8}>
                                        <Text style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>BATTERY TEMP</Text>
                                        <div style={{ fontSize: '24px', fontWeight: 800, color: isSwapping ? '#f59e0b' : '#0f172a' }}>
                                            {isSwapping ? 'Warm (Safe)' : 'Cool (Safe)'}
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <Text style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>POWER</Text>
                                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Stable</div>
                                    </Col>
                                    <Col span={8}>
                                        <Text style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>HEALTH</Text>
                                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>Excellent</div>
                                    </Col>
                                </Row>

                                <div style={{ background: '#0f172a', borderRadius: '16px', padding: '24px', fontFamily: 'monospace', color: '#3b82f6', height: '200px', overflowY: 'auto' }}>
                                    {swapLogs.map((log, i) => (
                                        <div key={i} style={{ marginBottom: '8px', opacity: i === swapLogs.length - 1 ? 1 : 0.5 }}>
                                            <span style={{ color: '#64748b' }}>[{new Date().toLocaleTimeString()}]</span> {log}
                                        </div>
                                    ))}
                                    {isSwapping && <div style={{ width: '10px', height: '16px', background: '#3b82f6', display: 'inline-block', animation: 'fadeUp 0.5s infinite alternate' }} />}
                                </div>
                            </Col>

                            {/* Terminal Right (Visualizer) */}
                            <Col xs={24} lg={10} style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
                                <div style={{ position: 'relative', width: '120px', height: '200px', border: '6px solid #cbd5e1', borderRadius: '16px', padding: '4px', marginBottom: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                    <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '8px', background: '#cbd5e1', borderRadius: '4px 4px 0 0' }} />

                                    <div style={{
                                        width: '100%',
                                        height: `${batteryLevel}%`,
                                        background: batteryLevel > 20 ? '#10b981' : '#ef4444',
                                        borderRadius: '8px',
                                        transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s'
                                    }} />
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 900, fontSize: '24px', color: batteryLevel > 50 ? '#ffffff' : '#0f172a', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        {batteryLevel}%
                                    </div>
                                </div>

                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    onClick={handleSwap}
                                    disabled={isSwapping || batteryLevel === 100}
                                    style={{
                                        height: '56px', fontSize: '16px', fontWeight: 800, borderRadius: '28px',
                                        background: isSwapping ? '#94a3b8' : '#1e3a8a', border: 'none',
                                        boxShadow: isSwapping ? 'none' : '0 10px 20px rgba(30, 58, 138, 0.2)'
                                    }}
                                >
                                    {isSwapping ? "SWAPPING OUT BATTERY..." : batteryLevel === 100 ? "VEHICLE FULLY CHARGED" : "START BATTERY SWAP"}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* CALCULATOR WIDGET */}
                <div ref={calcReveal.ref} className={`reveal-section ${calcReveal.isVisible ? 'visible' : ''}`} style={{ padding: '80px 24px', background: '#1e3a8a', color: '#ffffff' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                        <Tag color="cyan" style={{ marginBottom: '24px', background: 'rgba(56, 189, 248, 0.2)', border: 'none', color: '#7dd3fc', padding: '6px 16px', borderRadius: '20px', fontWeight: 800 }}>SAVINGS CALCULATOR</Tag>
                        <Title level={2} style={{ color: '#f8fafc', fontWeight: 900, fontSize: '2.5rem', marginBottom: '16px' }}>See How Much You Save</Title>
                        <Paragraph style={{ color: '#bfdbfe', fontSize: '1.2rem', marginBottom: '64px' }}>Move the slider below to see how much money you keep in your pocket by not buying batteries.</Paragraph>

                        <Card style={{ background: '#ffffff', borderRadius: '32px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: 'none' }}>
                            <Title level={5} style={{ color: '#64748b', marginBottom: '40px', fontWeight: 800 }}>NUMBER OF VEHICLES IN YOUR FLEET</Title>
                            <Slider
                                min={10} max={500} step={10}
                                value={fleetSize} onChange={setFleetSize}
                                trackStyle={{ background: '#3b82f6', height: '10px', borderRadius: '5px' }}
                                handleStyle={{ borderColor: '#3b82f6', width: '28px', height: '28px', marginTop: '-9px', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)' }}
                                railStyle={{ background: '#e2e8f0', height: '10px', borderRadius: '5px' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontWeight: 800, marginTop: '20px', fontSize: '16px' }}>
                                <span>10</span>
                                <span style={{ color: '#1e3a8a', fontSize: '28px' }}>{fleetSize} Vehicles</span>
                                <span>500</span>
                            </div>

                            <div style={{ height: '2px', background: '#f1f5f9', margin: '40px 0' }} />

                            <Row gutter={32} justify="center">
                                <Col xs={24} md={12}>
                                    <Text style={{ color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>MONEY SAVED ON BATTERIES</Text>
                                    <div style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#10b981', lineHeight: 1.2, marginTop: '8px' }}>
                                        ${(fleetSize * 4.5).toFixed(1)}k
                                    </div>
                                    <Text style={{ color: '#94a3b8', fontSize: '13px' }}>Money you don't have to spend upfront</Text>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Text style={{ color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>ESTIMATED MONTHLY SUBSCRIPTION</Text>
                                    <div style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#1e3a8a', lineHeight: 1.2, marginTop: '8px' }}>
                                        ${(fleetSize * 0.15).toFixed(1)}k
                                    </div>
                                    <Text style={{ color: '#94a3b8', fontSize: '13px' }}>One simple, flat fee to use our network</Text>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </div>

                {/* VALUE PROPOSITION CARDS */}
                <div ref={valueReveal.ref} className={`reveal-section ${valueReveal.isVisible ? 'visible' : ''}`} style={{ padding: '120px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                    <Title level={2} style={{ textAlign: 'center', fontWeight: 900, fontSize: '2.5rem', marginBottom: '64px', color: '#0f172a' }}>Grow Faster, Worry Less</Title>
                    <Row gutter={[32, 32]}>
                        {[
                            { title: 'No Huge Upfront Costs', icon: <CarOutlined />, color: '#3b82f6', desc: 'Starting an electric fleet shouldn’t break the bank. You don\'t buy our batteries—you just rent access to them. This saves you thousands per vehicle on day one.' },
                            { title: 'No More Waiting to Charge', icon: <SyncOutlined />, color: '#10b981', desc: 'When you plug an EV into a wall, it sits there for hours doing nothing. With Urja, drivers just pull in, swap a battery in 90 seconds, and get back to making money.' },
                            { title: 'Easy to Budget & Grow', icon: <CheckCircleOutlined />, color: '#8b5cf6', desc: 'You pay one flat subscription fee. No surprise repair bills, no paying to replace dead batteries. It makes running your business simple and stress-free.' }
                        ].map((item, idx) => (
                            <Col xs={24} md={8} key={idx}>
                                <Card className="hover-lift" style={{ height: '100%', borderRadius: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', background: '#ffffff' }} styles={{ body: { padding: '40px 32px' } }}>
                                    <div style={{ width: '72px', height: '72px', backgroundColor: `${item.color}15`, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', fontSize: '32px', color: item.color }}>
                                        {item.icon}
                                    </div>
                                    <Title level={4} style={{ fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>{item.title}</Title>
                                    <Text style={{ fontSize: '16px', lineHeight: '1.7', color: '#475569' }}>{item.desc}</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* TECH GRID */}
                <div ref={techReveal.ref} className={`reveal-section ${techReveal.isVisible ? 'visible' : ''}`} style={{ padding: '80px 24px 120px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <Title level={2} style={{ color: '#0f172a', fontWeight: 900, fontSize: '2.5rem', margin: 0 }}>Smart Tech, Simple Experience</Title>
                        <Text style={{ fontSize: '1.2rem', color: '#64748b', marginTop: '16px', display: 'inline-block', maxWidth: '700px', lineHeight: 1.6 }}>
                            We handle all the complex technology behind the scenes so you can focus on running your business smoothly.
                        </Text>
                    </div>

                    <Row gutter={[24, 24]}>
                        {[
                            { title: 'Self-Checking Batteries', icon: <ThunderboltOutlined />, desc: 'Our smart batteries check their own temperature and health automatically to make sure they always run perfectly.' },
                            { title: 'Live GPS Tracking', icon: <GlobalOutlined />, desc: 'Always know exactly where your vehicles are and how much charge they have left directly from your phone.' },
                            { title: 'Built-In Safety', icon: <SafetyOutlined />, desc: 'Automatic shut-offs and instant alerts ensure your drivers and vehicles are completely safe at all times.' },
                            { title: 'Easy Manager App', icon: <DashboardOutlined />, desc: 'A simple, clean dashboard on your computer to manage all your drivers, batteries, and payments in one place.' },
                            { title: 'Eco-Friendly Recycling', icon: <InfoCircleOutlined />, desc: 'When our batteries get old, we safely recycle and reuse the materials so nothing goes to a landfill.' },
                            { title: 'Fast & Smart Stations', icon: <SyncOutlined />, desc: 'Our swap stations manage electricity smartly so there are always fully charged batteries waiting for you.' }
                        ].map((item, idx) => (
                            <Col xs={24} sm={12} lg={8} key={idx}>
                                <Card className="hover-lift" style={{ height: '100%', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }} styles={{ body: { padding: '32px' } }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div style={{ fontSize: '28px', color: '#1e3a8a', backgroundColor: '#eff6ff', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <Title level={5} style={{ fontWeight: 800, margin: '0 0 12px 0', color: '#0f172a', fontSize: '1.1rem' }}>{item.title}</Title>
                                            <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#475569', display: 'block' }}>{item.desc}</Text>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* IMPACT SCROLL REVEAL COUNTERS */}
                <div ref={impactReveal.ref} style={{ padding: '100px 24px', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                        <Title level={3} style={{ fontWeight: 900, color: '#0f172a', marginBottom: '64px', textTransform: 'uppercase', letterSpacing: '3px' }}>Our Impact So Far</Title>
                        <Row gutter={[48, 48]}>
                            <Col xs={24} md={8}>
                                <Statistic title={<span style={{ color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>BATTERIES SWAPPED</span>} value={activeNodes} valueStyle={{ fontSize: '4.5rem', fontWeight: 900, color: '#1e3a8a' }} formatter={(val) => Number(val).toLocaleString()} />
                            </Col>
                            <Col xs={24} md={8}>
                                <Statistic title={<span style={{ color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>TREES SAVED (CO2 OFFSET)</span>} value={carbonOffset} valueStyle={{ fontSize: '4.5rem', fontWeight: 900, color: '#10b981' }} formatter={(val) => Number(val).toLocaleString()} />
                            </Col>
                            <Col xs={24} md={8}>
                                <Statistic title={<span style={{ color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>RELIABILITY SCORE (%)</span>} value={uptimeMetrics} valueStyle={{ fontSize: '4.5rem', fontWeight: 900, color: '#3b82f6' }} precision={2} suffix=".99" />
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* FOOTER CTA */}
                <div style={{ padding: '120px 24px', textAlign: 'center', background: '#0f172a', color: '#ffffff' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px auto', animation: 'pulse-glow 2s infinite' }}>
                            <ThunderboltOutlined style={{ fontSize: '32px', color: '#10b981' }} />
                        </div>
                        <Title level={1} style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, color: '#ffffff', marginBottom: '32px', lineHeight: 1.1 }}>
                            Ready to Upgrade <br />Your Fleet?
                        </Title>
                        <Paragraph style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '48px' }}>
                            Join the fastest-growing battery network and make running your business easier today.
                        </Paragraph>
                        <Button
                            type="primary"
                            size="large"
                            icon={<ArrowRightOutlined />}
                            href="https://urjamobility.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ height: '70px', padding: '0 48px', fontSize: '1.25rem', fontWeight: 800, borderRadius: '35px', background: '#10b981', color: '#0f172a', border: 'none', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)' }}
                        >
                            Get Started Today
                        </Button>
                    </div>
                </div>

            </div>
        </Content>
    );
}