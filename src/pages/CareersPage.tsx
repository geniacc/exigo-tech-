import { useRef, useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Typography, Tag, Button, Input, Modal, Form, Upload, message } from 'antd';
import {
    TeamOutlined,
    RocketOutlined,
    SafetyCertificateOutlined,
    GlobalOutlined,
    ArrowRightOutlined,
    SearchOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    UploadOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

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

export default function CareersPage() {
    const headerReveal = useScrollReveal();
    const cultureReveal = useScrollReveal();
    const jobsReveal = useScrollReveal();

    // Form and Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form] = Form.useForm();

    const openPositions = [
        { title: "Senior Full Stack Developer", department: "Engineering", location: "Remote / Hybrid", type: "Full-Time" },
        { title: "Embedded Systems Engineer", department: "Hardware", location: "On-Site", type: "Full-Time" },
        { title: "Operations Manager", department: "Logistics", location: "On-Site", type: "Full-Time" },
        { title: "Data Scientist (Battery Analytics)", department: "Data & AI", location: "Remote", type: "Full-Time" },
        { title: "B2B Sales Executive", department: "Sales", location: "Hybrid", type: "Full-Time" }
    ];

    // Handlers
    const scrollToJobs = () => {
        const el = document.getElementById('open-positions');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const handleApplyClick = (roleTitle: string) => {
        setSelectedRole(roleTitle);
        setIsModalOpen(true);
    };

    const onFinishApplication = (values: any) => {
        setIsSubmitting(true);

        // Simulate an API call delay
        setTimeout(() => {
            setIsSubmitting(false);
            setIsModalOpen(false);
            form.resetFields();
            message.success(`Application submitted successfully for ${selectedRole}! Our team will reach out soon.`);
            console.log("Form Submitted:", values); // You can connect your actual backend here
        }, 1500);
    };

    // Prevent default upload action to keep it frontend-only for the demo
    const normFile = (e: any) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    return (
        <Content style={{ backgroundColor: '#f8fafc', overflowX: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* CSS Animations & Mobile Media Queries */}
            <style>
                {`
                .corporate-grid {
                    background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
                    background-size: 32px 32px;
                }
                
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                /* Layout Classes */
                .hero-section { padding: 160px 24px 100px 24px; position: relative; overflow: hidden; background: linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%); }
                .content-section { padding: 120px 24px; max-width: 1200px; margin: 0 auto; position: relative; }
                
                /* Staggered Animations */
                .stagger-text { opacity: 0; transform: translateY(20px); }
                .visible .stagger-text { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .visible .stagger-1 { animation-delay: 0.1s; }
                .visible .stagger-2 { animation-delay: 0.2s; }
                .visible .stagger-3 { animation-delay: 0.3s; }
                .visible .stagger-4 { animation-delay: 0.4s; }

                .reveal-card { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); opacity: 0; transform: translateY(30px); }
                .reveal-card.visible { opacity: 1; transform: translateY(0); }
                
                .job-card { transition: all 0.3s ease; border: 1.5px solid #bfdbfe !important; border-left: 5px solid #2563eb !important; background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%) !important; }
                .job-card:hover { transform: translateX(8px); box-shadow: 0 10px 25px rgba(30, 58, 138, 0.12) !important; border-color: #93c5fd !important; }

                @media (max-width: 768px) {
                    .hero-section { padding: 100px 16px 60px 16px !important; }
                    .content-section { padding: 60px 16px !important; }
                    .job-action-btn { width: 100%; margin-top: 16px; }
                    .search-bar { width: 100% !important; }
                }
                `}
            </style>

            {/* HERO SECTION */}
            <div className="hero-section corporate-grid">
                <div ref={headerReveal.ref} className={`${headerReveal.isVisible ? 'visible' : ''}`} style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                    <div className="stagger-text stagger-1">
                        <Tag color="blue" style={{ padding: '6px 16px', borderRadius: '20px', fontWeight: 700, letterSpacing: '1px', backgroundColor: '#e0f2fe', color: '#1e3a8a', border: 'none', marginBottom: '24px' }}>
                            CAREERS
                        </Tag>
                    </div>
                    <div className="stagger-text stagger-2">
                        <Title level={1} style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 24px 0', lineHeight: '1.1' }}>
                            Build the Future of <br />
                            <span style={{ color: '#1e3a8a' }}>Sustainable Technology</span>
                        </Title>
                    </div>
                    <div className="stagger-text stagger-3">
                        <Paragraph style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', color: '#475569', margin: '0 auto 40px auto', lineHeight: '1.7', maxWidth: '700px' }}>
                            We are an ecosystem of innovators, engineers, and problem-solvers dedicated to eliminating e-waste and revolutionizing global mobility. Join us in making a measurable impact.
                        </Paragraph>
                    </div>
                    <div className="stagger-text stagger-4">
                        <Button
                            type="primary"
                            size="large"
                            onClick={scrollToJobs}
                            style={{ backgroundColor: '#1e3a8a', height: '56px', padding: '0 40px', fontSize: '16px', fontWeight: 600, borderRadius: '28px', border: 'none', boxShadow: '0 10px 25px rgba(30, 58, 138, 0.25)' }}
                        >
                            View Open Roles
                        </Button>
                    </div>
                </div>
            </div>

            {/* WHY JOIN US (CULTURE SECTION) */}
            <div ref={cultureReveal.ref} className={`content-section ${cultureReveal.isVisible ? 'visible' : ''}`}>
                <div className="stagger-text stagger-1" style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <Title level={2} style={{ color: '#0f172a', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 2.5rem)', margin: 0 }}>Life at the Core</Title>
                    <Text style={{ fontSize: '1.1rem', color: '#64748b', marginTop: '16px', display: 'inline-block' }}>
                        We provide the environment and resources you need to do your best work.
                    </Text>
                </div>

                <Row gutter={[24, 24]}>
                    {[
                        { title: 'Mission-Driven Work', icon: <GlobalOutlined />, desc: 'Every line of code and every hardware adjustment directly contributes to reducing global carbon emissions and e-waste.', bg: '#ecfdf5', border: '#a7f3d0', iconColor: '#059669', iconBg: '#d1fae5' },
                        { title: 'Accelerated Growth', icon: <RocketOutlined />, desc: 'We promote a culture of continuous learning. You will tackle complex, enterprise-scale problems from day one.', bg: '#eff6ff', border: '#bfdbfe', iconColor: '#2563eb', iconBg: '#dbeafe' },
                        { title: 'Inclusive Environment', icon: <TeamOutlined />, desc: 'We believe diverse teams build better products. We foster an open, collaborative workspace where every voice is heard.', bg: '#fffbeb', border: '#fef3c7', iconColor: '#d97706', iconBg: '#fef3c7' },
                        { title: 'Comprehensive Benefits', icon: <SafetyCertificateOutlined />, desc: 'Competitive compensation, premium health coverage, flexible remote options, and continuous education stipends.', bg: '#faf5ff', border: '#e9d5ff', iconColor: '#7c3aed', iconBg: '#f3e8ff' }
                    ].map((item, idx) => (
                        <Col xs={24} md={12} lg={6} key={idx} className={`reveal-card ${cultureReveal.isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${(idx * 0.1)}s` }}>
                            <Card style={{ height: '100%', borderRadius: '16px', border: `1.5px solid ${item.border}`, background: item.bg, textAlign: 'center' }} styles={{ body: { padding: '32px 24px' } }}>
                                <div style={{ fontSize: '32px', color: item.iconColor, backgroundColor: item.iconBg, width: '64px', height: '64px', margin: '0 auto 24px auto', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {item.icon}
                                </div>
                                <Title level={5} style={{ fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>{item.title}</Title>
                                <Text style={{ fontSize: '14.5px', color: '#475569', lineHeight: '1.6', display: 'block' }}>{item.desc}</Text>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* OPEN POSITIONS BOARD */}
            <div id="open-positions" ref={jobsReveal.ref} className={`content-section ${jobsReveal.isVisible ? 'visible' : ''}`} style={{ paddingTop: '40px' }}>
                <div className="stagger-text stagger-1" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', gap: '16px' }}>
                    <Title level={2} style={{ color: '#0f172a', fontWeight: 900, margin: 0 }}>Open Positions</Title>
                    <Input
                        className="search-bar"
                        size="large"
                        placeholder="Search roles, departments..."
                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                        style={{ width: '300px', borderRadius: '24px', border: '1px solid #cbd5e1' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {openPositions.map((job, idx) => (
                        <div key={idx} className={`reveal-card stagger-text stagger-2 ${jobsReveal.isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${(idx * 0.1) + 0.1}s` }}>
                            <Card className="job-card" styles={{ body: { padding: '24px' } }} style={{ borderRadius: '12px' }}>
                                <Row align="middle" justify="space-between">
                                    <Col xs={24} md={16}>
                                        <Tag color="blue" style={{ marginBottom: '12px', borderRadius: '4px', fontWeight: 600 }}>{job.department}</Tag>
                                        <Title level={4} style={{ margin: '0 0 12px 0', fontWeight: 800, color: '#0f172a' }}>{job.title}</Title>
                                        <div style={{ display: 'flex', gap: '24px', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                                            <span><EnvironmentOutlined style={{ marginRight: '6px' }} />{job.location}</span>
                                            <span><ClockCircleOutlined style={{ marginRight: '6px' }} />{job.type}</span>
                                        </div>
                                    </Col>
                                    <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                                        <Button
                                            className="job-action-btn"
                                            type="default"
                                            onClick={() => handleApplyClick(job.title)}
                                            style={{ height: '44px', padding: '0 24px', borderRadius: '22px', fontWeight: 600, color: '#1e3a8a', borderColor: '#1e3a8a' }}
                                        >
                                            Apply Now <ArrowRightOutlined />
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* General Application CTA */}
                <div className="stagger-text stagger-3" style={{ marginTop: '48px', textAlign: 'center', background: '#eff6ff', padding: '40px', borderRadius: '16px', border: '1px dashed #bfdbfe' }}>
                    <Title level={4} style={{ color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>Don't see a perfect fit?</Title>
                    <Text style={{ color: '#475569', display: 'block', marginBottom: '24px' }}>We are always looking for exceptional talent. Send us your resume.</Text>
                    <Button
                        type="primary"
                        onClick={() => handleApplyClick("General Application")}
                        style={{ background: '#1e3a8a', height: '44px', borderRadius: '22px', fontWeight: 600, padding: '0 32px' }}
                    >
                        Submit General Application
                    </Button>
                </div>
            </div>

            {/* APPLICATION MODAL */}
            <Modal
                title={
                    <div style={{ paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
                        <Text style={{ color: '#64748b', fontSize: '13px', fontWeight: 700, letterSpacing: '1px' }}>APPLYING FOR</Text>
                        <Title level={4} style={{ margin: '4px 0 0 0', color: '#0f172a', fontWeight: 800 }}>{selectedRole}</Title>
                    </div>
                }
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                footer={null}
                destroyOnClose
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinishApplication}
                    requiredMark="optional"
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter your first name' }]}>
                                <Input size="large" placeholder="Jane" style={{ borderRadius: '8px' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter your last name' }]}>
                                <Input size="large" placeholder="Doe" style={{ borderRadius: '8px' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                                <Input size="large" placeholder="jane@example.com" style={{ borderRadius: '8px' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: 'Please enter your phone number' }]}>
                                <Input size="large" placeholder="+1 (555) 000-0000" style={{ borderRadius: '8px' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="LinkedIn Profile (Optional)" name="linkedin">
                        <Input size="large" placeholder="https://linkedin.com/in/..." style={{ borderRadius: '8px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Resume / CV"
                        name="resume"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: 'Please upload your resume' }]}
                    >
                        <Upload name="resumeFile" action="/mock-upload" maxCount={1} beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />} size="large" style={{ borderRadius: '8px', width: '100%' }}>
                                Click to Upload PDF or Word Doc
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Cover Letter (Optional)" name="coverLetter">
                        <TextArea rows={4} placeholder="Tell us why you'd be a great fit for this role..." style={{ borderRadius: '8px' }} />
                    </Form.Item>

                    <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={isSubmitting}
                            style={{ width: '100%', height: '48px', borderRadius: '24px', backgroundColor: '#1e3a8a', fontWeight: 600 }}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
}