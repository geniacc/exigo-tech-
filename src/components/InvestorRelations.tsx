import { useRef, useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Statistic, Tag } from 'antd';
import {
    LineChartOutlined,
    DownloadOutlined,
    MailOutlined,
    GlobalOutlined,
    FilePdfOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

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

export default function InvestorRelations() {
    const sectionReveal = useScrollReveal();
    const statsReveal = useScrollReveal();
    const cardsReveal = useScrollReveal();

    return (
        <section style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {/* CSS Animations & Mobile Media Queries */}
            <style>
                {`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .ir-container { padding: 100px 24px; max-width: 1200px; margin: 0 auto; position: relative; }
                
                /* Staggered Animations */
                .stagger-text { opacity: 0; transform: translateY(20px); }
                .visible .stagger-text { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .visible .stagger-1 { animation-delay: 0.1s; }
                .visible .stagger-2 { animation-delay: 0.2s; }
                .visible .stagger-3 { animation-delay: 0.3s; }

                .reveal-item { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); opacity: 0; transform: translateY(30px); }
                .reveal-item.visible { opacity: 1; transform: translateY(0); }
                
                .ir-card { transition: all 0.3s ease; border: 1px solid #e2e8f0; border-radius: 20px; height: 100%; background: #f8fafc; }
                .ir-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08); border-color: #cbd5e1; background: #ffffff; }

                @media (max-width: 768px) {
                    .ir-container { padding: 60px 16px; }
                    .ir-title { font-size: 2rem !important; }
                    .ir-btn-full { width: 100%; display: flex; justify-content: center; }
                }
                `}
            </style>

            <div className="ir-container">
                {/* Section Header */}
                <div ref={sectionReveal.ref} className={`${sectionReveal.isVisible ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <div className="stagger-text stagger-1">
                        <Tag color="cyan" style={{ padding: '6px 16px', borderRadius: '20px', fontWeight: 700, letterSpacing: '1px', backgroundColor: '#e0f2fe', color: '#0284c7', border: 'none', marginBottom: '24px' }}>
                            INVESTOR RELATIONS
                        </Tag>
                    </div>
                    <div className="stagger-text stagger-2">
                        <Title level={2} className="ir-title" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0' }}>
                            Driving Sustainable Growth
                        </Title>
                    </div>
                    <div className="stagger-text stagger-3">
                        <Paragraph style={{ fontSize: '1.15rem', color: '#475569', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>
                            Exigo is building the infrastructure for a circular economy. We partner with forward-thinking investors to scale our impact, expand our technological reach, and deliver consistent, responsible returns.
                        </Paragraph>
                    </div>
                </div>

                {/* Quick Highlights / Stats */}
                <div ref={statsReveal.ref} className={`reveal-item ${statsReveal.isVisible ? 'visible' : ''}`} style={{ background: '#0f172a', borderRadius: '24px', padding: '48px 24px', marginBottom: '64px', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)' }}>
                    <Row gutter={[32, 48]} justify="center" style={{ textAlign: 'center' }}>
                        <Col xs={24} sm={8}>
                            <Statistic
                                title={<span style={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '1px', fontSize: '12px' }}>QUARTERLY GROWTH</span>}
                                value={142}
                                valueStyle={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: '#10b981' }}
                                suffix="%"
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <Statistic
                                title={<span style={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '1px', fontSize: '12px' }}>ACTIVE MARKETS</span>}
                                value={12}
                                valueStyle={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: '#3b82f6' }}
                                prefix={<GlobalOutlined style={{ fontSize: '28px', marginRight: '8px' }} />}
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <Statistic
                                title={<span style={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '1px', fontSize: '12px' }}>ESG COMPLIANCE RATING</span>}
                                value={'AAA'}
                                valueStyle={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: '#8b5cf6' }}
                            />
                        </Col>
                    </Row>
                </div>

                {/* Resource Cards */}
                <div ref={cardsReveal.ref} className={`${cardsReveal.isVisible ? 'visible' : ''}`}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={8} className="reveal-item" style={{ transitionDelay: '0.1s' }}>
                            <Card className="ir-card" bordered={false} styles={{ body: { padding: '32px' } }}>
                                <div style={{ fontSize: '32px', color: '#1e3a8a', marginBottom: '24px' }}>
                                    <LineChartOutlined />
                                </div>
                                <Title level={4} style={{ fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Financial Reports</Title>
                                <Text style={{ fontSize: '15px', color: '#475569', display: 'block', marginBottom: '24px', lineHeight: '1.6' }}>
                                    Access our latest quarterly earnings, annual reports, and transparent financial statements.
                                </Text>
                                <Button type="default" className="ir-btn-full" icon={<DownloadOutlined />} style={{ borderRadius: '20px', fontWeight: 600, color: '#1e3a8a', borderColor: '#1e3a8a' }}>
                                    Download Q3 Report
                                </Button>
                            </Card>
                        </Col>

                        <Col xs={24} md={8} className="reveal-item" style={{ transitionDelay: '0.2s' }}>
                            <Card className="ir-card" bordered={false} styles={{ body: { padding: '32px' } }}>
                                <div style={{ fontSize: '32px', color: '#8b5cf6', marginBottom: '24px' }}>
                                    <SafetyCertificateOutlined />
                                </div>
                                <Title level={4} style={{ fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Corporate Deck</Title>
                                <Text style={{ fontSize: '15px', color: '#475569', display: 'block', marginBottom: '24px', lineHeight: '1.6' }}>
                                    Review our business model, technology roadmap, and long-term strategic vision.
                                </Text>
                                <Button type="default" className="ir-btn-full" icon={<FilePdfOutlined />} style={{ borderRadius: '20px', fontWeight: 600, color: '#8b5cf6', borderColor: '#8b5cf6' }}>
                                    View Presentation
                                </Button>
                            </Card>
                        </Col>

                        <Col xs={24} md={8} className="reveal-item" style={{ transitionDelay: '0.3s' }}>
                            <Card className="ir-card" bordered={false} styles={{ body: { padding: '32px' } }}>
                                <div style={{ fontSize: '32px', color: '#10b981', marginBottom: '24px' }}>
                                    <MailOutlined />
                                </div>
                                <Title level={4} style={{ fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Contact IR Team</Title>
                                <Text style={{ fontSize: '15px', color: '#475569', display: 'block', marginBottom: '24px', lineHeight: '1.6' }}>
                                    Have specific questions about investing? Get in direct contact with our Investor Relations team.
                                </Text>
                                <Button type="primary" className="ir-btn-full" style={{ borderRadius: '20px', fontWeight: 600, background: '#10b981', color: '#ffffff', border: 'none' }}>
                                    Email Investors Desk
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </section>
    );
}