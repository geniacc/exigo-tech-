import { useState } from 'react'
import { Row, Col, Card, Typography, Tag, Form, Input, Button, message, ConfigProvider } from 'antd'
import {
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    SendOutlined,
    SafetyCertificateOutlined,
    FieldTimeOutlined
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

export default function ContactPage() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    // Handles the Web3Forms submission loop safely for all fields
    const onFinish = async (values: any) => {
        setLoading(true)
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: "b8862d69-1033-4237-9b34-09549bcc1163",
                    name: values.name,
                    email: values.email,
                    company: values.organization,
                    message: values.message,
                    subject: `📬 New Contact Form Submission from ${values.name}`,
                    from_name: "Exigo Contact Form Portal"
                })
            })

            const result = await response.json()

            if (result.success) {
                message.success('Thanks for reaching out! Our team will get back to you within 12 business hours.')
                form.resetFields()
            } else {
                message.error('Form submission failed. Please try again.')
            }
        } catch (error) {
            console.error(error)
            message.error('Could not connect to the form transmission service.')
        } finally {
            setLoading(false)
        }
    }

    // Handlers programmatic email routing across Apple vs Windows/Android devices
    const handleEmailClick = () => {
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
            if (navigator.clipboard?.writeText) {
                navigator.clipboard.writeText(email)
                    .then(() => {
                        message.info('Email copied to clipboard! You can paste it into your mail app.')
                    })
                    .catch(() => {
                        message.error('Could not copy address automatically. Please copy it manually.')
                    })
            } else {
                message.error('Could not open email window. Address: info@exigocleantech.com')
            }
        }
    }

    return (
        <ConfigProvider
            theme={{
                components: {
                    Card: {
                        colorBorderBg: '#e2e8f0',
                    },
                    Input: {
                        colorBgContainer: '#f8fafc',
                        colorBorder: '#e2e8f0',
                        borderRadius: 10,
                        controlHeight: 46,
                        activeBorderColor: '#3b82f6',
                        hoverBorderColor: '#3b82f6',
                    },
                    Button: {
                        controlHeightLG: 50,
                        borderRadiusLG: 12,
                    }
                }
            }}
        >
            <style>{`
                .contact-card-body {
                    padding: 24px;
                }
                .form-card-body {
                    padding: 32px;
                }
                @media (max-width: 576px) {
                    .contact-card-body {
                        padding: 16px !important;
                    }
                    .form-card-body {
                        padding: 20px 16px !important;
                    }
                }
            `}</style>

            <div style={{ padding: 'clamp(90px, 12vw, 140px) 16px 60px 16px', backgroundColor: '#f8fafc', width: '100%', overflowX: 'hidden' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', width: '100%' }}>

                    {/* Visual Depth Background Blurs */}
                    <div style={{ position: 'absolute', top: '0', right: '10%', width: '350px', height: '350px', background: 'rgba(30, 58, 138, 0.03)', filter: 'blur(90px)', borderRadius: '50%', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '300px', height: '300px', background: 'rgba(107, 33, 168, 0.03)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />

                    {/* Header Section */}
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 80px)', position: 'relative', zIndex: 2 }}>
                        <div style={{ display: 'inline-block' }}>
                            <Tag color="default" style={{ padding: '6px 16px', borderRadius: '20px', fontWeight: 800, border: 'none', backgroundColor: '#e2e8f0', color: '#334155', letterSpacing: '0.05em', fontSize: '11px' }}>
                                WE’D LOVE TO HEAR FROM YOU
                            </Tag>
                        </div>
                        <Title level={1} style={{ fontSize: 'clamp(2rem, 5vw, 4.2rem)', fontWeight: 900, color: '#0f172a', marginTop: '16px', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
                            Get in Touch With <span style={{ color: '#1e3a8a' }}>Exigo Cleantech</span>
                        </Title>
                        <Paragraph style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#475569', maxWidth: '750px', margin: '16px auto 0 auto', lineHeight: '1.6' }}>
                            Questions about device buyback, EV battery services, or partnering with us? Send a message and our team will help you find the right next step.
                        </Paragraph>
                    </div>

                    {/* Split Structural Section Layout */}
                    <Row gutter={[24, 32]} style={{ margin: 0, width: '100%' }}>

                        {/* Left Column: Contact details */}
                        <Col xs={24} lg={10} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ marginBottom: '4px' }}>
                                <Tag color="blue" style={{ fontWeight: 700, borderRadius: '4px', marginBottom: '8px' }}>CONTACT DETAILS</Tag>
                                <Title level={3} style={{ fontWeight: 800, color: '#0f172a', margin: 0, fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>Ways to Reach Us</Title>
                                <Text style={{ color: '#64748b', fontSize: '14px', marginTop: '6px', display: 'inline-block' }}>
                                    Choose the option that works best for you — email, phone, or our office.
                                </Text>
                            </div>

                            {/* Email Address Card Block with Integrated Client Routing */}
                            <Card
                                hoverable
                                onClick={handleEmailClick}
                                role="button"
                                tabIndex={0}
                                style={{ borderRadius: '20px', border: '1.5px solid #bfdbfe', background: '#eff6ff', cursor: 'pointer' }}
                                styles={{ body: { padding: 0 } }}
                            >
                                <div className="contact-card-body" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ fontSize: '20px', color: '#1e3a8a', backgroundColor: '#ffffff', border: '1px solid #bfdbfe', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <MailOutlined />
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <Text strong style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>Email Us</Text>
                                        <Text style={{ color: '#0f172a', fontSize: '15px', fontWeight: 700, display: 'block', textDecoration: 'underline', wordBreak: 'break-all' }}>info@exigocleantech.com</Text>
                                        <Text style={{ color: '#64748b', fontSize: '12.5px', display: 'block', marginTop: '2px' }}>Best for general questions and support</Text>
                                    </div>
                                </div>
                            </Card>

                            {/* Call Us Card Block */}
                            <Card
                                hoverable
                                style={{ borderRadius: '20px', border: '1.5px solid #a7f3d0', background: '#ecfdf5', cursor: 'default' }}
                                styles={{ body: { padding: 0 } }}
                            >
                                <div className="contact-card-body" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ fontSize: '20px', color: '#10b981', backgroundColor: '#ffffff', border: '1px solid #a7f3d0', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <PhoneOutlined />
                                    </div>
                                    <div>
                                        <Text strong style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>Call Us</Text>
                                        <Text style={{ color: '#0f172a', fontSize: '15px', fontWeight: 700, display: 'block' }}>+918277343434</Text>
                                        <Text style={{ color: '#64748b', fontSize: '12.5px', display: 'block', marginTop: '2px' }}>Speak with our Urja Mobility team</Text>
                                    </div>
                                </div>
                            </Card>

                            {/* Office Address Card Block */}
                            <Card
                                hoverable
                                style={{ borderRadius: '20px', border: '1.5px solid #e9d5ff', background: '#faf5ff', cursor: 'default' }}
                                styles={{ body: { padding: 0 } }}
                            >
                                <div className="contact-card-body" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ fontSize: '20px', color: '#6b21a8', backgroundColor: '#ffffff', border: '1px solid #e9d5ff', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <EnvironmentOutlined />
                                    </div>
                                    <div 
                                        onClick={() => window.open('https://maps.app.goo.gl/RdECEkczHghMegqB6', '_blank')}
                                        style={{ cursor: 'pointer', flex: 1 }}
                                    >
                                        <Text strong style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>Visit Our Office</Text>
                                        <Text style={{ color: '#0f172a', fontSize: '15px', fontWeight: 700, display: 'block' }}>Synq.Work - GSC Towers</Text>
                                        <Text style={{ color: '#64748b', fontSize: '12.5px', display: 'block', marginTop: '2px' }}>Meet us at our main headquarters</Text>
                                    </div>
                                </div>
                            </Card>

                            {/* Response time note */}
                            <div style={{ background: '#f5f3ff', borderRadius: '20px', padding: '20px', marginTop: '4px', border: '1.5px solid #d8b4fe', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                                <FieldTimeOutlined style={{ color: '#7c3aed', fontSize: '20px', marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                    <Text strong style={{ color: '#4c1d95', fontSize: '13.5px', display: 'block' }}>Quick Response Promise</Text>
                                    <Text style={{ color: '#5b21b6', fontSize: '12.5px', lineHeight: '1.5', display: 'block', marginTop: '2px' }}>
                                        We read every message carefully. You can expect a reply from our team within <span style={{ color: '#7c3aed', fontWeight: 700 }}>12 business hours</span>.
                                    </Text>
                                </div>
                            </div>
                        </Col>

                        {/* Right Column: Interactive Contact form hooked to Web3Forms API */}
                        <Col xs={24} lg={14}>
                            <Card
                                style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%)', borderRadius: '24px', border: '1.5px solid #bfdbfe', boxShadow: '0 20px 50px -15px rgba(0,0,0,0.04)' }}
                                styles={{ body: { padding: 0 } }}
                            >
                                <div className="form-card-body">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', flexWrap: 'wrap' }}>
                                        <div>
                                            <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '1.15rem' }}>Send Us a Message</Title>
                                            <Text style={{ fontSize: '12.5px', color: '#64748b', display: 'block', marginTop: '2px' }}>Tell us a little about what you need — we’ll take it from there.</Text>
                                        </div>
                                        <Tag color="blue" icon={<SafetyCertificateOutlined />} style={{ padding: '4px 10px', borderRadius: '6px', fontWeight: 600, fontSize: '11px', margin: 0 }}>PRIVATE & SECURE</Tag>
                                    </div>

                                    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
                                        <Row gutter={[16, 0]}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    name="name"
                                                    label={<Text strong style={{ color: '#334155', fontSize: '13px' }}>Your Name</Text>}
                                                    rules={[{ required: true, message: 'Please enter your name' }]}
                                                >
                                                    <Input placeholder="e.g. Armaan Singh" disabled={loading} />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    name="email"
                                                    label={<Text strong style={{ color: '#334155', fontSize: '13px' }}>Email Address</Text>}
                                                    rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                                                >
                                                    <Input placeholder="name@company.com" disabled={loading} />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Form.Item
                                            name="organization"
                                            label={<Text strong style={{ color: '#334155', fontSize: '13px' }}>Company / Organization</Text>}
                                            rules={[{ required: true, message: 'Please enter your company name' }]}
                                        >
                                            <Input placeholder="e.g. GreenMiles Mobility" disabled={loading} />
                                        </Form.Item>

                                        <Form.Item
                                            name="message"
                                            label={<Text strong style={{ color: '#334155', fontSize: '13px' }}>How Can We Help?</Text>}
                                            rules={[{ required: true, message: 'Please tell us how we can help' }]}
                                        >
                                            <TextArea
                                                rows={4}
                                                disabled={loading}
                                                placeholder="Share a short note about your question, partnership idea, or service interest..."
                                                style={{ padding: '12px', borderRadius: '12px' }}
                                            />
                                        </Form.Item>

                                        <Form.Item style={{ margin: '8px 0 0 0' }}>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                size="large"
                                                loading={loading}
                                                icon={!loading && <SendOutlined />}
                                                style={{
                                                    width: '100%',
                                                    fontWeight: 700,
                                                    backgroundColor: '#1e3a8a',
                                                    borderColor: '#1e3a8a',
                                                    boxShadow: '0 10px 20px -4px rgba(30, 58, 138, 0.25)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px'
                                                }}
                                            >
                                                Send Message
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </ConfigProvider>
    )
}