import { useRef, useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Input, Tag, Divider } from 'antd';
import {
    SearchOutlined,
    ThunderboltOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function BusinessCharter() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [hoveredTag, setHoveredTag] = useState('');

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
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const mainObjectiveText = `To carry on the business of product lifecycle management, including but not limited to the sourcing, procurement, design, development, manufacturing, assembly, processing, integration, testing, inspection, grading, certification, repair, refurbishment, reconditioning, remanufacturing, quality assurance, warehousing, logistics, packaging, distribution, import, export, marketing, trading, leasing, renting, resale, recycling, reverse logistics, recovery, disposal and end-of-life management of products, components, spare parts and accessories, whether new, refurbished, renewed, reconditioned, remanufactured, pre-owned, used or recycled, with a primary focus on batteries and energy storage systems, including lithium, lithium-ion, lead, lead-acid, nickel-based, sodium-ion, solid-state and other battery chemistries, battery cells, modules, packs, battery management systems (BMS), battery materials and related components, consumer electronics, electrical and electronic equipment, appliances, peripherals, accessories and allied products, in India and abroad, either directly or through physical or digital platforms, marketplaces, distributors, dealers, franchisees, agents or any other lawful means.`;

    const alliedServicesText = `To provide allied and ancillary services including diagnostics, testing, grading, repair, refurbishment, remanufacturing, battery health assessment, repurposing, second-life applications, warranty management, after-sales support, buy-back, exchange, trade-in, asset recovery, recycling, material recovery, sustainable disposal, circular economy solutions, product traceability, inventory management, software and technology platforms, analytics, consulting and other technology-enabled lifecycle management solutions in relation to the aforesaid products and services.`;

    // High-impact Keyword tags to explore
    const keywords = [
        { label: "Lithium-ion", match: "lithium-ion" },
        { label: "BMS (Battery Management)", match: "battery management systems" },
        { label: "Product Lifecycle", match: "product lifecycle management" },
        { label: "Diagnostics", match: "diagnostics" },
        { label: "Refurbishment", match: "refurbishment" },
        { label: "Circular Economy", match: "circular economy solutions" },
        { label: "Asset Recovery", match: "asset recovery" },
        { label: "Second-life Applications", match: "second-life applications" },
        { label: "Traceability", match: "traceability" },
        { label: "Material Recovery", match: "material recovery" },
        { label: "Energy Storage", match: "energy storage systems" },
        { label: "Software & Technology", match: "software and technology platforms" }
    ];

    // Helper function to render text with highlighted matching search/hover keywords
    const renderHighlightedText = (text: string) => {
        if (!text) return text;
        const searchPattern = searchTerm ? searchTerm.trim() : '';
        const tagPattern = hoveredTag ? hoveredTag.trim() : '';

        const activePatterns = [searchPattern, tagPattern].filter(Boolean);
        if (activePatterns.length === 0) {
            // Apply default soft highlights to important legal phrases for premium readability
            const defaultHighlights = [
                "product lifecycle management",
                "batteries and energy storage systems",
                "circular economy solutions",
                "diagnostics",
                "battery health assessment",
                "second-life applications",
                "traceability"
            ];
            
            let htmlText = text;
            defaultHighlights.forEach(phrase => {
                const regex = new RegExp(`(${phrase})`, 'gi');
                htmlText = htmlText.replace(regex, `<strong>$1</strong>`);
            });
            return <span dangerouslySetInnerHTML={{ __html: htmlText }} />;
        }

        // Escape regex characters
        const escapedPatterns = activePatterns.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        // Create regex matching any of the active patterns
        const regex = new RegExp(`(${escapedPatterns.join('|')})`, 'gi');
        const parts = text.split(regex);

        return (
            <span>
                {parts.map((part, index) => {
                    const isMatch = activePatterns.some(
                        p => part.toLowerCase() === p.toLowerCase()
                    );
                    
                    if (isMatch) {
                        const isTagHover = tagPattern && part.toLowerCase() === tagPattern.toLowerCase();
                        return (
                            <mark
                                key={index}
                                style={{
                                    backgroundColor: isTagHover ? 'rgba(139, 92, 246, 0.25)' : 'rgba(250, 204, 21, 0.45)',
                                    color: '#0f172a',
                                    padding: '2px 4px',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    borderBottom: isTagHover ? '2px solid #8b5cf6' : '2px solid #eab308',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {part}
                            </mark>
                        );
                    }
                    return part;
                })}
            </span>
        );
    };

    return (
        <section id="charter" style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <style>
                {`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .charter-container {
                    padding: 120px 24px;
                    max-width: 1280px;
                    margin: 0 auto;
                    position: relative;
                }

                .charter-reveal {
                    opacity: 0;
                    transform: translateY(25px);
                }

                .visible .charter-reveal {
                    animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .visible .charter-delay-1 { animation-delay: 0.1s; }
                .visible .charter-delay-2 { animation-delay: 0.2s; }
                .visible .charter-delay-3 { animation-delay: 0.3s; }

                /* Premium Card styling */
                .charter-card {
                    background: rgba(255, 255, 255, 0.8) !important;
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(226, 232, 240, 0.8) !important;
                    border-radius: 24px !important;
                    box-shadow: 0 10px 30px -10px rgba(148, 163, 184, 0.1) !important;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                    height: 100%;
                }

                .charter-card:hover {
                    transform: translateY(-6px);
                    background: #ffffff !important;
                    box-shadow: 0 20px 40px -15px rgba(107, 33, 168, 0.12) !important;
                    border-color: rgba(107, 33, 168, 0.2) !important;
                }

                .charter-card-allied:hover {
                    box-shadow: 0 20px 40px -15px rgba(30, 58, 138, 0.12) !important;
                    border-color: rgba(30, 58, 138, 0.2) !important;
                }

                .charter-icon-box {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin-bottom: 24px;
                    transition: all 0.3s ease;
                }

                .charter-card:hover .charter-icon-box {
                    transform: scale(1.1) rotate(5deg);
                }

                /* Custom tags styling */
                .interactive-chip {
                    cursor: pointer;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 13.5px;
                    margin: 4px;
                    transition: all 0.25s ease;
                    border: 1px solid #e2e8f0;
                    background-color: #ffffff;
                    color: #475569;
                }

                .interactive-chip:hover {
                    color: #8b5cf6;
                    border-color: #8b5cf6;
                    background-color: rgba(139, 92, 246, 0.05);
                    transform: translateY(-2px);
                }

                .interactive-chip.active-chip {
                    color: #ffffff;
                    border-color: #8b5cf6;
                    background-color: #8b5cf6;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
                }

                .charter-search .ant-input-affix-wrapper {
                    border-radius: 24px !important;
                    padding: 8px 18px !important;
                    border: 1.5px solid #e2e8f0 !important;
                    box-shadow: none !important;
                    transition: all 0.3s ease;
                    max-width: 480px;
                    margin: 0 auto;
                }

                .charter-search .ant-input-affix-wrapper-focused,
                .charter-search .ant-input-affix-wrapper:hover {
                    border-color: #8b5cf6 !important;
                    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1) !important;
                }

                @media (max-width: 768px) {
                    .charter-container { padding: 80px 16px; }
                    .charter-title { font-size: 2rem !important; }
                }
                `}
            </style>

            <div ref={sectionRef} className={`charter-container ${isVisible ? 'visible' : ''}`}>
                
                {/* Header */}
                <div className="charter-reveal charter-delay-1" style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <Tag color="purple" style={{ padding: '6px 16px', borderRadius: '20px', fontWeight: 700, letterSpacing: '1px', backgroundColor: '#faf5ff', color: '#6b21a8', border: 'none', marginBottom: '20px' }}>
                        BUSINESS CHARTER
                    </Tag>
                    <Title level={2} className="charter-title" style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
                        Corporate Objectives & Scope
                    </Title>
                    <Paragraph style={{ fontSize: '1.15rem', color: '#64748b', maxWidth: '750px', margin: '0 auto 36px auto', lineHeight: '1.6' }}>
                        The official operational charter outlining Exigo Cleantech's mandate to engineer sustainable, technology-driven lifecycle solutions for batteries and consumer electronics.
                    </Paragraph>
                </div>

                {/* Interactive Search & Filter Panel */}
                <div className="charter-reveal charter-delay-2" style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div className="charter-search" style={{ marginBottom: '24px' }}>
                        <Input
                            placeholder="Search keywords within the charter..."
                            prefix={<SearchOutlined style={{ color: '#94a3b8', marginRight: '6px' }} />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            allowClear
                        />
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '900px', margin: '0 auto', gap: '4px' }}>
                        {keywords.map((tag) => (
                            <button
                                key={tag.label}
                                className={`interactive-chip ${hoveredTag === tag.match ? 'active-chip' : ''}`}
                                onMouseEnter={() => setHoveredTag(tag.match)}
                                onMouseLeave={() => setHoveredTag('')}
                                onClick={() => {
                                    setSearchTerm(tag.match);
                                    const el = document.getElementById('charter-content-row');
                                    if (el) {
                                        const rect = el.getBoundingClientRect();
                                        const absoluteTop = rect.top + window.scrollY;
                                        window.scrollTo({
                                            top: absoluteTop - 120,
                                            behavior: 'smooth'
                                        });
                                    }
                                }}
                            >
                                {tag.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Cards */}
                <div className="charter-reveal charter-delay-3" id="charter-content-row">
                    <Row gutter={[32, 32]} align="stretch">
                        
                        {/* Primary Business Scope Card */}
                        <Col xs={24} lg={12}>
                            <Card className="charter-card" bordered={false} styles={{ body: { padding: '40px' } }}>
                                <div className="charter-icon-box" style={{ backgroundColor: 'rgba(107, 33, 168, 0.08)', color: '#6b21a8' }}>
                                    <ThunderboltOutlined />
                                </div>
                                <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginBottom: '16px', letterSpacing: '-0.01em' }}>
                                    Primary Business Scope
                                </Title>
                                <Divider style={{ margin: '16px 0 24px 0', borderColor: 'rgba(107, 33, 168, 0.1)' }} />
                                
                                <Paragraph style={{ fontSize: '15px', lineHeight: '1.75', color: '#475569', textAlign: 'justify' }}>
                                    {renderHighlightedText(mainObjectiveText)}
                                </Paragraph>

                                <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    <Tag color="purple" style={{ borderRadius: '6px', fontWeight: 600 }}>Energy Storage</Tag>
                                    <Tag color="purple" style={{ borderRadius: '6px', fontWeight: 600 }}>Lithium-Ion</Tag>
                                    <Tag color="purple" style={{ borderRadius: '6px', fontWeight: 600 }}>BMS Architectures</Tag>
                                    <Tag color="purple" style={{ borderRadius: '6px', fontWeight: 600 }}>Consumer Tech</Tag>
                                </div>
                            </Card>
                        </Col>

                        {/* Allied & Ancillary Services Card */}
                        <Col xs={24} lg={12}>
                            <Card className="charter-card charter-card-allied" bordered={false} styles={{ body: { padding: '40px' } }}>
                                <div className="charter-icon-box" style={{ backgroundColor: 'rgba(30, 58, 138, 0.08)', color: '#1e3a8a' }}>
                                    <SafetyCertificateOutlined />
                                </div>
                                <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginBottom: '16px', letterSpacing: '-0.01em' }}>
                                    Allied & Ancillary Services
                                </Title>
                                <Divider style={{ margin: '16px 0 24px 0', borderColor: 'rgba(30, 58, 138, 0.1)' }} />

                                <Paragraph style={{ fontSize: '15px', lineHeight: '1.75', color: '#475569', textAlign: 'justify' }}>
                                    {renderHighlightedText(alliedServicesText)}
                                </Paragraph>

                                <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    <Tag color="blue" style={{ borderRadius: '6px', fontWeight: 600 }}>Diagnostics</Tag>
                                    <Tag color="blue" style={{ borderRadius: '6px', fontWeight: 600 }}>Circular Solutions</Tag>
                                    <Tag color="blue" style={{ borderRadius: '6px', fontWeight: 600 }}>Second Life</Tag>
                                    <Tag color="blue" style={{ borderRadius: '6px', fontWeight: 600 }}>Software Platforms</Tag>
                                </div>
                            </Card>
                        </Col>

                    </Row>
                </div>

            </div>
        </section>
    );
}
