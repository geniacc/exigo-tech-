import { useRef, useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Typography, Tag, Button, Input, Modal, Form, Select, message } from 'antd';
import {
    TeamOutlined,
    RocketOutlined,
    SafetyCertificateOutlined,
    GlobalOutlined,
    ArrowRightOutlined,
    SearchOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    PhoneOutlined,
    LinkOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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

    // Submits candidate data packages direct to Web3Forms
    const onFinishApplication = async (values: any) => {
        setIsSubmitting(true);

        const formData = new FormData();
        
        formData.append("access_key", "2b31f9c1-5c3c-48e2-aadb-4441441a1f86");
        formData.append("from_name", "Exigo Careers Portal");
        formData.append("subject", `💼 New Candidate Application: ${selectedRole} - ${values.firstName} ${values.lastName}`);

        // Map text fields cleanly into payload
        formData.append("Applicant Name", `${values.firstName} ${values.lastName}`);
        formData.append("Email Address", values.email);
        formData.append("Phone Number", values.phone);
        formData.append("Target Role", selectedRole);
        formData.append("Current City", values.city || "Not Provided");
        formData.append("Highest Qualification", values.qualification || "Not Provided");
        formData.append("Years of Experience", values.experience || "Not Provided");
        formData.append("Notice Period", values.noticePeriod || "Not Provided");
        formData.append("Current CTC", values.currentCtc || "Not Provided");
        formData.append("Expected CTC", values.expectedCtc || "Not Provided");
        formData.append("Resume / Portfolio URL", values.resumeUrl);
        formData.append("LinkedIn Profile", values.linkedin || "Not Provided");
        formData.append("Portfolio / GitHub URL", values.portfolioUrl || "Not Provided");
        formData.append("Cover Letter / Notes", values.coverLetter || "Not Provided");

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                message.success(`Application submitted successfully for ${selectedRole}! Our HR team will reach out soon.`);
                setIsModalOpen(false);
                form.resetFields();
            } else {
                message.error(result.message || 'Form processing failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            message.error('Could not interface with recruitment delivery pipeline networks.');
        } finally {
            setIsSubmitting(false);
        }
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
                .hero-section { padding: clamp(100px, 15vw, 160px) 16px clamp(60px, 10vw, 100px) 16px; position: relative; overflow: hidden; background: linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%); }
                .content-section { padding: clamp(60px, 10vw, 120px) 16px; max-width: 1200px; margin: 0 auto; position: relative; }
                
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
                    .job-action-btn { width: 100%; margin-top: 16px; }
                    .search-bar { width: 100% !important; }
                    .general-cta-box { padding: 24px 16px !important; }
                    .job-card-body { padding: 16px !important; }
                }
                @media (min-width: 769px) {
                    .job-card-body { padding: 24px !important; }
                }
                `}
            </style>

            {/* HERO SECTION */}
            <div className="hero-section corporate-grid">
                <div ref={headerReveal.ref} className={`${headerReveal.isVisible ? 'visible' : ''}`} style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                    <div className="stagger-text stagger-1">
                        <Tag color="blue" style={{ padding: '6px 16px', borderRadius: '20px', fontWeight: 700, letterSpacing: '1px', backgroundColor: '#e0f2fe', color: '#1e3a8a', border: 'none', marginBottom: '20px' }}>
                            CAREERS
                        </Tag>
                    </div>
                    <div className="stagger-text stagger-2">
                        <Title level={1} style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 20px 0', lineHeight: '1.15' }}>
                            Build the Future of <br />
                            <span style={{ color: '#1e3a8a' }}>Sustainable Technology</span>
                        </Title>
                    </div>
                    <div className="stagger-text stagger-3">
                        <Paragraph style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)', color: '#475569', margin: '0 auto 32px auto', lineHeight: '1.6', maxWidth: '700px' }}>
                            We are an ecosystem of innovators, engineers, and problem-solvers dedicated to eliminating e-waste and revolutionizing global mobility. Join us in making a measurable impact.
                        </Paragraph>
                    </div>
                    <div className="stagger-text stagger-4">
                        <Button
                            type="primary"
                            size="large"
                            onClick={scrollToJobs}
                            style={{ backgroundColor: '#1e3a8a', height: '52px', padding: '0 36px', fontSize: '15px', fontWeight: 600, borderRadius: '28px', border: 'none', boxShadow: '0 10px 25px rgba(30, 58, 138, 0.25)' }}
                        >
                            View Open Roles
                        </Button>
                    </div>
                </div>
            </div>

            {/* WHY JOIN US (CULTURE SECTION) */}
            <div ref={cultureReveal.ref} className={`content-section ${cultureReveal.isVisible ? 'visible' : ''}`}>
                <div className="stagger-text stagger-1" style={{ textAlign: 'center', marginBottom: ' clamp(36px, 6vw, 64px)' }}>
                    <Title level={2} style={{ color: '#0f172a', fontWeight: 900, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', margin: 0 }}>Life at the Core</Title>
                    <Text style={{ fontSize: '1rem', color: '#64748b', marginTop: '12px', display: 'inline-block' }}>
                        We provide the environment and resources you need to do your best work.
                    </Text>
                </div>

                <Row gutter={[20, 20]}>
                    {[
                        { title: 'Mission-Driven Work', icon: <GlobalOutlined />, desc: 'Every line of code and every hardware adjustment directly contributes to reducing global carbon emissions and e-waste.', bg: '#ecfdf5', border: '#a7f3d0', iconColor: '#059669', iconBg: '#d1fae5' },
                        { title: 'Accelerated Growth', icon: <RocketOutlined />, desc: 'We promote a culture of continuous learning. You will tackle complex, enterprise-scale problems from day one.', bg: '#eff6ff', border: '#bfdbfe', iconColor: '#2563eb', iconBg: '#dbeafe' },
                        { title: 'Inclusive Environment', icon: <TeamOutlined />, desc: 'We believe diverse teams build better products. We foster an open, collaborative workspace where every voice is heard.', bg: '#fffbeb', border: '#fef3c7', iconColor: '#d97706', iconBg: '#fef3c7' },
                        { title: 'Comprehensive Benefits', icon: <SafetyCertificateOutlined />, desc: 'Competitive compensation, premium health coverage, flexible remote options, and continuous education stipends.', bg: '#faf5ff', border: '#e9d5ff', iconColor: '#7c3aed', iconBg: '#f3e8ff' }
                    ].map((item, idx) => (
                        <Col xs={24} sm={12} lg={6} key={idx} className={`reveal-card ${cultureReveal.isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${(idx * 0.1)}s` }}>
                            <Card style={{ height: '100%', borderRadius: '16px', border: `1.5px solid ${item.border}`, background: item.bg, textAlign: 'center' }} styles={{ body: { padding: '24px 20px' } }}>
                                <div style={{ fontSize: '28px', color: item.iconColor, backgroundColor: item.iconBg, width: '56px', height: '56px', margin: '0 auto 20px auto', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {item.icon}
                                </div>
                                <Title level={5} style={{ fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>{item.title}</Title>
                                <Text style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6', display: 'block' }}>{item.desc}</Text>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* OPEN POSITIONS BOARD */}
            <div id="open-positions" ref={jobsReveal.ref} className={`content-section ${jobsReveal.isVisible ? 'visible' : ''}`} style={{ paddingTop: '20px' }}>
                <div className="stagger-text stagger-1" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
                    <Title level={2} style={{ color: '#0f172a', fontWeight: 900, margin: 0, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>Open Positions</Title>
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
                            <Card className="job-card" styles={{ body: { padding: 0 } }} style={{ borderRadius: '12px' }}>
                                <div className="job-card-body">
                                    <Row align="middle" justify="space-between" gutter={[16, 16]}>
                                        <Col xs={24} md={16}>
                                            <Tag color="blue" style={{ marginBottom: '8px', borderRadius: '4px', fontWeight: 600 }}>{job.department}</Tag>
                                            <Title level={4} style={{ margin: '0 0 10px 0', fontWeight: 800, color: '#0f172a', fontSize: '1.15rem' }}>{job.title}</Title>
                                            <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '13px', fontWeight: 500, flexWrap: 'wrap' }}>
                                                <span><EnvironmentOutlined style={{ marginRight: '6px' }} />{job.location}</span>
                                                <span><ClockCircleOutlined style={{ marginRight: '6px' }} />{job.type}</span>
                                            </div>
                                        </Col>
                                        <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                                            <Button
                                                className="job-action-btn"
                                                type="default"
                                                onClick={() => handleApplyClick(job.title)}
                                                style={{ height: '42px', padding: '0 24px', borderRadius: '22px', fontWeight: 600, color: '#1e3a8a', borderColor: '#1e3a8a' }}
                                            >
                                                Apply Now <ArrowRightOutlined />
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* General Application CTA */}
                <div className="stagger-text stagger-3 general-cta-box" style={{ marginTop: '40px', textAlign: 'center', background: '#eff6ff', padding: '36px 24px', borderRadius: '16px', border: '1px dashed #bfdbfe' }}>
                    <Title level={4} style={{ color: '#0f172a', fontWeight: 800, marginBottom: '8px', fontSize: '1.2rem' }}>Don't see a perfect fit?</Title>
                    <Text style={{ color: '#475569', display: 'block', marginBottom: '20px', fontSize: '13.5px' }}>We are always looking for exceptional talent. Send us your resume.</Text>
                    <Button
                        type="primary"
                        onClick={() => handleApplyClick("General Application")}
                        style={{ background: '#1e3a8a', height: '44px', borderRadius: '22px', fontWeight: 600, padding: '0 28px', width: 'auto', maxWidth: '100%' }}
                    >
                        Submit General Application
                    </Button>
                </div>
            </div>

            {/* APPLICATION MODAL */}
            <Modal
                title={
                    <div style={{ paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', marginBottom: '12px' }}>
                        <Text style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>APPLYING FOR</Text>
                        <Title level={4} style={{ margin: '2px 0 0 0', color: '#0f172a', fontWeight: 800, fontSize: '1.1rem' }}>{selectedRole}</Title>
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
                width={720}
                style={{ maxWidth: '95vw', margin: '0 auto' }}
                styles={{
                    body: {
                        maxHeight: 'calc(85vh - 100px)',
                        overflowY: 'auto',
                        paddingRight: '6px'
                    }
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinishApplication}
                    requiredMark="optional"
                >
                    {/* Personal Information */}
                    <Row gutter={[12, 0]}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter your first name' }]}>
                                <Input size="large" placeholder="Jane" style={{ borderRadius: '8px' }} disabled={isSubmitting} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter your last name' }]}>
                                <Input size="large" placeholder="Doe" style={{ borderRadius: '8px' }} disabled={isSubmitting} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[12, 0]}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                                <Input size="large" placeholder="jane@example.com" style={{ borderRadius: '8px' }} disabled={isSubmitting} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: 'Please enter your phone number' }]}>
                                <Input size="large" prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />} placeholder="+91 XXXXX XXXXX" style={{ borderRadius: '8px' }} disabled={isSubmitting} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Location & Qualification */}
                    <Row gutter={[12, 0]}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Current City" name="city" rules={[{ required: true, message: 'Please enter your current city' }]}>
                                <Input size="large" placeholder="e.g. Delhi, Gurugram" style={{ borderRadius: '8px' }} disabled={isSubmitting} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Highest Qualification" name="qualification" rules={[{ required: true, message: 'Please select your degree' }]}>
                                <Select size="large" placeholder="Select Degree" style={{ borderRadius: '8px' }} disabled={isSubmitting}>
                                    <Option value="btech">B.Tech / B.E.</Option>
                                    <Option value="mtech">M.Tech / M.E.</Option>
                                    <Option value="mba">MBA / PGDM</Option>
                                    <Option value="diploma">Diploma</Option>
                                    <Option value="other">Other Degree</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Experience & Notice Period */}
                    <Row gutter={[12, 0]}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Years of Experience" name="experience" rules={[{ required: true, message: 'Please select experience' }]}>
                                <Select size="large" placeholder="Select Experience" style={{ borderRadius: '8px' }} disabled={isSubmitting}>
                                    <Option value="fresher">Fresher / No Experience</Option>
                                    <Option value="1-3">1 - 3 Years</Option>
                                    <Option value="3-5">3 - 5 Years</Option>
                                    <Option value="5-8">5 - 8 Years</Option>
                                    <Option value="8+">8+ Years</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Notice Period" name="noticePeriod" rules={[{ required: true, message: 'Please select notice period' }]}>
                                <Select size="large" placeholder="Select Notice Period" style={{ borderRadius: '8px' }} disabled={isSubmitting}>
                                    <Option value="immediate">Immediate Joiner</Option>
                                    <Option value="15-days">15 Days</Option>
                                    <Option value="30-days">30 Days</Option>
                                    <Option value="60-days">60 Days</Option>
                                    <Option value="90-days">90 Days</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* CTC Fields */}
                    <Row gutter={[12, 0]}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Current CTC (Annual ₹)" name="currentCtc" rules={[{ required: true, message: 'Please enter current CTC' }]}>
                                <Input size="large" placeholder="e.g. ₹6,00,000 or Fresher" style={{ borderRadius: '8px' }} disabled={isSubmitting} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Expected CTC (Annual ₹)" name="expectedCtc" rules={[{ required: true, message: 'Please enter expected CTC' }]}>
                                <Input size="large" placeholder="e.g. ₹8,50,000" style={{ borderRadius: '8px' }} disabled={isSubmitting} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Resume via URL Link */}
                    <Form.Item 
                        label="Resume / CV Link (Google Drive, Dropbox, Notion)" 
                        name="resumeUrl" 
                        rules={[
                            { required: true, message: 'Please provide a link to your resume' },
                            { type: 'url', message: 'Please enter a valid URL' }
                        ]}
                    >
                        <Input size="large" prefix={<LinkOutlined style={{ color: '#94a3b8' }} />} placeholder="https://drive.google.com/file/d/..." style={{ borderRadius: '8px' }} disabled={isSubmitting} />
                    </Form.Item>

                    {/* Online Profiles */}
                    <Row gutter={[12, 0]}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="LinkedIn Profile (Optional)" name="linkedin">
                                <Input size="large" placeholder="https://linkedin.com/in/..." style={{ borderRadius: '8px' }} disabled={isSubmitting} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Portfolio / GitHub URL (Optional)" name="portfolioUrl">
                                <Input size="large" placeholder="https://github.com/..." style={{ borderRadius: '8px' }} disabled={isSubmitting} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Cover Letter */}
                    <Form.Item label="Cover Letter (Optional)" name="coverLetter">
                        <TextArea rows={3} placeholder="Tell us why you'd be a great fit for this role..." style={{ borderRadius: '8px' }} disabled={isSubmitting} />
                    </Form.Item>

                    {/* Submit Action */}
                    <Form.Item style={{ marginTop: '16px', marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={isSubmitting}
                            style={{ width: '100%', height: '48px', borderRadius: '24px', backgroundColor: '#1e3a8a', fontWeight: 600 }}
                        >
                            {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
}