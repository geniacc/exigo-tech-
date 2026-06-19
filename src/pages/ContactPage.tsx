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

    const onFinish = (values: any) => {
        console.log('Contact Payload Ingested:', values)
        message.success('Secure transmission complete. Our teams will respond within 12 business hours.')
        form.resetFields()
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
            <div style={{ padding: '140px 24px 100px 24px', backgroundColor: '#f8fafc', width: '100%', overflowX: 'hidden' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', width: '100%' }}>

                    {/* Visual Depth Background Blurs */}
                    <div style={{ position: 'absolute', top: '0', right: '10%', width: '350px', height: '350px', background: 'rgba(30, 58, 138, 0.03)', filter: 'blur(90px)', borderRadius: '50%', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '300px', height: '300px', background: 'rgba(107, 33, 168, 0.03)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />

                    {/* Header Section */}
                    <div style={{ textAlign: 'center', marginBottom: '80px', position: 'relative', zIndex: 2 }}>
                        <div style={{ display: 'inline-block' }}>
                            <Tag color="default" style={{ padding: '6px 20px', borderRadius: '20px', fontWeight: 800, border: 'none', backgroundColor: '#e2e8f0', color: '#334155', letterSpacing: '0.05em' }}>
                                CENTRALIZED COMMUNICATIONS HUB
                            </Tag>
                        </div>
                        <Title level={1} style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 900, color: '#0f172a', marginTop: '24px', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
                            Connect With Our <span style={{ color: '#1e3a8a' }}>Enterprise Teams</span>
                        </Title>
                        <Paragraph style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '750px', margin: '24px auto 0 auto', lineHeight: '1.6' }}>
                            Have inquiries regarding our clean technology platforms? Get in touch with our global offices, schedule hardware lifecycle audits, or reach dedicated account specialists directly.
                        </Paragraph>
                    </div>

                    {/* Split Structural Section Layout */}
                    <Row gutter={[48, 48]} style={{ margin: 0, width: '100%' }}>

                        {/* Left Column: Communications Infrastructure Matrix */}
                        <Col xs={24} lg={10} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ marginBottom: '12px' }}>
                                <Tag color="blue" style={{ fontWeight: 700, borderRadius: '4px', marginBottom: '12px' }}>DIRECTORY</Tag>
                                <Title level={3} style={{ fontWeight: 800, color: '#0f172a', margin: 0 }}>Corporate Channels</Title>
                                <Text style={{ color: '#64748b', fontSize: '14.5px', marginTop: '8px', display: 'inline-block' }}>
                                    Bypass general processing tiers by utilizing our context-specific direct pathways.
                                </Text>
                            </div>

                            {[
                                { title: 'General Inquiries', detail: 'info@exigocleantech.com', note: 'Corporate response loop desk', icon: <MailOutlined />, color: '#1e3a8a', bg: '#eff6ff' },
                                { title: 'BaaS Fleet Infrastructure', detail: '+91 (022) 555-0192', note: 'Urja operational dispatch center', icon: <PhoneOutlined />, color: '#10b981', bg: '#ecfdf5' },
                                { title: 'Enterprise Headquarters', detail: 'Exigo Cleantech Tower, Tech Park District, Sector V', note: 'Primary physical operations base', icon: <EnvironmentOutlined />, color: '#6b21a8', bg: '#faf5ff' }
                            ].map((channel, i) => (
                                <Card
                                    key={i}
                                    hoverable
                                    style={{ borderRadius: '20px', border: '1px solid #e2e8f0', background: '#ffffff' }}
                                    styles={{ body: { padding: '24px' } }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ fontSize: '22px', color: channel.color, backgroundColor: channel.bg, width: '54px', height: '54px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {channel.icon}
                                        </div>
                                        <div>
                                            <Text strong style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>{channel.title}</Text>
                                            <Text style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700, display: 'block' }}>{channel.detail}</Text>
                                            <Text style={{ color: '#64748b', fontSize: '13px', display: 'block', marginTop: '2px' }}>{channel.note}</Text>
                                        </div>
                                    </div>
                                </Card>
                            ))}

                            {/* Internal Operational SLAs Console Tag */}
                            <div style={{ background: '#0f172a', borderRadius: '20px', padding: '24px', marginTop: '12px', border: '1px solid #1e293b', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <FieldTimeOutlined style={{ color: '#a855f7', fontSize: '22px', marginTop: '2px' }} />
                                <div>
                                    <Text strong style={{ color: '#ffffff', fontSize: '14px', display: 'block' }}>Programmatic Routing Commitments</Text>
                                    <Text style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', display: 'block', marginTop: '4px' }}>
                                        All telemetry, asset liquidation lists, and platform support tickets are securely ingested instantly. Average validation response cycle matches are held under a strict <span style={{ color: '#a855f7', fontWeight: 600 }}>12-hour SLA matrix</span>.
                                    </Text>
                                </div>
                            </div>
                        </Col>

                        {/* Right Column: Encrypted Form Messaging Console */}
                        <Col xs={24} lg={14}>
                            <Card
                                style={{ background: '#ffffff', borderRadius: '32px', border: 'none', boxShadow: '0 20px 50px -15px rgba(0,0,0,0.04)', padding: '16px' }}
                                styles={{ body: { padding: '32px' } }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                                    <div>
                                        <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Transmission Terminal</Title>
                                        <Text style={{ fontSize: '13px', color: '#64748b' }}>Fill out your requirements to initialize system contact.</Text>
                                    </div>
                                    <Tag color="blue" icon={<SafetyCertificateOutlined />} style={{ padding: '4px 12px', borderRadius: '6px', fontWeight: 600 }}>TLS SECURED</Tag>
                                </div>

                                <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
                                    <Row gutter={20}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="name"
                                                label={<Text strong style={{ color: '#334155', fontSize: '13px' }}>Full Representative Name</Text>}
                                                rules={[{ required: true, message: 'Identity input required' }]}
                                            >
                                                <Input placeholder="e.g. Armaan Singh" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="email"
                                                label={<Text strong style={{ color: '#334155', fontSize: '13px' }}>Corporate Email Node</Text>}
                                                rules={[{ required: true, type: 'email', message: 'Valid routing node required' }]}
                                            >
                                                <Input placeholder="name@company.com" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        name="organization"
                                        label={<Text strong style={{ color: '#334155', fontSize: '13px' }}>Enterprise Entity / Platform</Text>}
                                        rules={[{ required: true, message: 'Organizational tracking tag required' }]}
                                    >
                                        <Input placeholder="e.g. Urja Mobility / Independent Fleet Operator" />
                                    </Form.Item>

                                    <Form.Item
                                        name="message"
                                        label={<Text strong style={{ color: '#334155', fontSize: '13px' }}>Operational Scope Context Details</Text>}
                                        rules={[{ required: true, message: 'Context data payload required' }]}
                                    >
                                        <TextArea
                                            rows={5}
                                            placeholder="Outline your logistical footprint, deployment needs, or liquidation asset counts details natively here..."
                                            style={{ padding: '14px', borderRadius: '12px' }}
                                        />
                                    </Form.Item>

                                    <Form.Item style={{ margin: '12px 0 0 0' }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            icon={<SendOutlined />}
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
                                            Dispatch Secure Message Terminal
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </ConfigProvider>
    )
}