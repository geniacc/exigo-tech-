import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Input, List, Avatar, Badge, Tooltip } from 'antd';
import { MessageOutlined, CloseOutlined, SendOutlined, WhatsAppOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Welcome to Exigo Cleantech. We are a Product Life Cycle Management platform powering the circular economy. How can I help you navigate our solutions today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    setTimeout(() => {
      const userTextLower = userMsg.text.toLowerCase();
      let responseText = "";

      // Pure Business & Operational Knowledge Matrix
      if (userTextLower.includes('hi') || userTextLower.includes('hello') || userTextLower.includes('hey')) {
        responseText = "Hello! Welcome to Exigo Cleantech. We are a Product Life Cycle Management platform powering the circular economy. Are you looking into our QwikSELL IT re-commerce or Urja Mobility battery ecosystems today?";
      }
      else if (userTextLower.includes('company') || userTextLower.includes('exigo') || userTextLower.includes('cleantech') || userTextLower.includes('firm') || userTextLower.includes('what is exigo')) {
        responseText = "Exigo Cleantech Private Limited is a Product Life Cycle Management (PLM) technology platform powering the Circular Economy in India. We close the loop on industrial waste by managing the deployment, tracking, reuse, and recycling of enterprise electronics and EV batteries. Tap 'Continue on WhatsApp' to discuss structural corporate partnerships.";
      }
      else if (userTextLower.includes('mission') || userTextLower.includes('vision') || userTextLower.includes('purpose') || userTextLower.includes('goal') || userTextLower.includes('work')) {
        responseText = "Our mission is simple: To scale sustainable lifecycle paths for high-value tech assets. We prevent battery and electronic waste from leaking into landfills by building efficient data-driven pipelines that maximize asset recovery, resale value, and material recycling.";
      }
      else if (userTextLower.includes('baas') || userTextLower.includes('battery-as-a-service') || userTextLower.includes('battery as a service')) {
        responseText = "**BaaS (Battery-as-a-Service)** is an operational model where you rent or lease EV batteries instead of buying them. Rather than waiting hours to charge, drivers pull up to a station, swap a depleted battery pack for a fully charged one in under 30 seconds, and get right back on the road. Tap 'Continue on WhatsApp' to see how BaaS can scale your commercial fleet operations.";
      }
      else if (userTextLower.includes('capex') || userTextLower.includes('capital expenditure') || userTextLower.includes('upfront cost') || userTextLower.includes('investment')) {
        responseText = "**CAPEX (Capital Expenditure)** refers to the heavy upfront money a company has to pay to buy major equipment or physical assets outright. EV batteries are incredibly expensive to buy at the start, but Urja Mobility completely removes this financial barrier by switching it to a zero-upfront operational model. Tap the WhatsApp button above to sync with our commercial finance team.";
      }
      else if (userTextLower.includes('circular economy') || userTextLower.includes('circularity') || userTextLower.includes('circular')) {
        responseText = "A **Circular Economy** is a sustainable business model focused on completely eliminating waste. Instead of the traditional 'take, make, dispose' system, assets are kept inside a closed loop through continuous repair, re-commerce, second-life use, and ultimate recycling. Tap 'Continue on WhatsApp' to see how we build circular workflows for corporate infrastructure.";
      }
      else if (userTextLower.includes('plm') || userTextLower.includes('lifecycle') || userTextLower.includes('product life cycle') || userTextLower.includes('product lifecycle')) {
        responseText = "**Product Lifecycle Management (PLM)** means tracking and optimization of an asset from creation, through its primary operational lifespan, to its secondary deployment, and its eventual end-of-life reclamation. We monitor health telemetry metrics to ensure zero structural loss at any point in the cycle.";
      }
      else if (userTextLower.includes('traceability') || userTextLower.includes('custody') || userTextLower.includes('tracking')) {
        responseText = "**Asset Traceability** refers to our end-to-end global chain-of-custody tracking. It ensures every single corporate device or EV battery pack is digitally logged and auditable, verifying that it is handled safely, legally, and sustainably from deployment to final recycling.";
      }
      else if (userTextLower.includes('qwiksell') || userTextLower.includes('laptop') || userTextLower.includes('server') || userTextLower.includes('device') || userTextLower.includes('hardware') || userTextLower.includes('liquidation') || userTextLower.includes('re-commerce') || userTextLower.includes('recommerce')) {
        responseText = "QwikSELL is our dedicated enterprise IT asset re-commerce division. We manage mass laptop and server liquidation for corporations through a strict four-stage pipeline: 1. Diagnose (testing 50+ distinct hardware parameters), 2. Price (algorithmic dynamic valuation adjustments), 3. Buyback (secure batch collection logistics), and 4. Liquidation (processing into secondary business distribution channels). Tap 'Continue on WhatsApp' to submit your asset recovery list.";
      }
      else if (userTextLower.includes('grading') || userTextLower.includes('grade') || userTextLower.includes('scan')) {
        responseText = "Our hardware intake process uses a rigorous multi-point automated system that assigns certified quality tiers (Grades A, B, C, or D) based on cosmetic condition and core component efficiency. This guarantees maximum transparency and value realization for enterprise liquidations. Click the WhatsApp button above to learn more.";
      }
      else if (userTextLower.includes('urja') || userTextLower.includes('battery') || userTextLower.includes('ev') || userTextLower.includes('fleet') || userTextLower.includes('swap') || userTextLower.includes('pack') || userTextLower.includes('nodes')) {
        responseText = "Urja Mobility is our clean energy technology and battery logistics infrastructure division built for commercial EV fleets. We eliminate upfront battery acquisition costs entirely through our leasing infrastructure. The network actively operates 12,450+ nodes, has offset over 840 tonnes of CO2 emissions, and maintains an institutional 99% uptime guarantee. Click the WhatsApp button above to speak with a fleet layout specialist.";
      }
      else if (userTextLower.includes('price') || userTextLower.includes('cost') || userTextLower.includes('quote') || userTextLower.includes('rates')) {
        responseText = "Commercial pricing and monthly fleet leasing fees depend completely on structural volume and asset configurations. To calculate an accurate operational quote, click the 'Continue on WhatsApp' button above to safely bridge this session over to our corporate logistics desk.";
      }
      else if (userTextLower.includes('career') || userTextLower.includes('job') || userTextLower.includes('hiring') || userTextLower.includes('position') || userTextLower.includes('join')) {
        responseText = "We are actively recruiting across multiple key divisions! Current active hiring pipelines include: Senior Full Stack Developer, Embedded Systems Engineer, Operations Manager (Logistics), Data Scientist (Battery Analytics), and B2B Sales Executive. Click the WhatsApp button to connect directly with our HR team.";
      }
      else if (userTextLower.includes('contact') || userTextLower.includes('office') || userTextLower.includes('address') || userTextLower.includes('location') || userTextLower.includes('phone') || userTextLower.includes('email')) {
        responseText = "Our operational corporate offices are fully structured to handle enterprise requests with a strict 12-hour response service level agreement. To receive direct coordinates or schedule a facility tour, click 'Continue on WhatsApp' to link directly with our administration team.";
      }
      else if (userTextLower === 'no' || userTextLower.includes('nothing') || userTextLower.includes('no thanks')) {
        responseText = "No problem at all! Feel free to browse through our operational numbers or division summaries. If you ever need direct commercial metrics or logistics help, you can instantly loop in our live operations desk using the WhatsApp button above.";
      }
      else {
        responseText = "Understood. Because Exigo Cleantech builds highly customized commercial contracts—ranging from corporate laptop value updates to custom EV fleet battery leasing plans—the best path is to tap 'Continue on WhatsApp' to transfer this session straight to an active account manager.";
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 750);
  };

  const shiftToWhatsAppDirect = () => {
    const transcriptSummary = messages
      .slice(-4)
      .map(msg => `${msg.sender === 'user' ? ' Me' : ' Robot'}: ${msg.text}`)
      .join('\n\n');

    const detailedMessage = 
`Hello Exigo Cleantech Team,

I am exploring your platform and would like to migrate my active website chat session to WhatsApp.

*Recent Chat History:*
${transcriptSummary}

Looking forward to connecting!`;

    const encodedText = encodeURIComponent(detailedMessage);
    const whatsappNumber = '918277343434'; // Operational corporate number mapped successfully
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <>
      <style>{`
        /* Deep Claymorphic Window Card Base */
        .exigo-clay-card {
          background: rgba(13, 18, 36, 0.92) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 24px !important;
          box-shadow: 
            0px 24px 50px rgba(0, 0, 0, 0.6),
            inset 0px 2px 4px rgba(255, 255, 255, 0.1),
            inset 0px -4px 10px rgba(0, 0, 0, 0.7) !important;
          backdrop-filter: blur(20px);
        }
        
        /* Matte 3D Custom Chat Bubbles - AI */
        .exigo-clay-bubble-ai {
          background: rgba(26, 34, 56, 0.85) !important;
          color: #e2e8f0 !important;
          border: 1px solid rgba(255, 255, 255, 0.04) !important;
          border-radius: 18px 18px 18px 4px !important;
          box-shadow: 
            inset 2px 2px 4px rgba(255, 255, 255, 0.05),
            inset -2px -2px 6px rgba(0, 0, 0, 0.4),
            0px 4px 10px rgba(0, 0, 0, 0.2) !important;
        }
        
        /* Matte 3D Custom Chat Bubbles - User */
        .exigo-clay-bubble-user {
          background: linear-gradient(135deg, #7c3aed 0%, #6b21a8 100%) !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 18px 18px 4px 18px !important;
          box-shadow: 
            inset 2px 2px 4px rgba(255, 255, 255, 0.3),
            inset -2px -2px 6px rgba(0, 0, 0, 0.3),
            0px 6px 14px rgba(107, 33, 168, 0.3) !important;
        }
        
        /* Highly Tactile Shiny Clay WhatsApp Call-To-Action Button */
        .exigo-clay-btn-wa {
          background: linear-gradient(135deg, #22c55e 0%, #15803d 100%) !important;
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 
            inset 0px 2px 4px rgba(255, 255, 255, 0.4),
            inset 0px -2px 4px rgba(0, 0, 0, 0.2),
            0 8px 16px rgba(34, 197, 94, 0.25) !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .exigo-clay-btn-wa:hover {
          transform: translateY(-1px);
          box-shadow: 
            inset 0px 2px 4px rgba(255, 255, 255, 0.5),
            inset 0px -2px 4px rgba(0, 0, 0, 0.1),
            0 12px 20px rgba(34, 197, 94, 0.35) !important;
        }

        /* Input Controls Integration */
        .exigo-clay-input {
          background: rgba(7, 10, 22, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          color: #fff !important;
          border-radius: 12px !important;
          transition: all 0.2s ease !important;
        }
        .exigo-clay-input:focus, .exigo-clay-input-focused {
          border-color: #a855f7 !important;
          box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
        }

        /* Custom Scrollbar cleanup inside chat viewport */
        .chat-feed-viewport::-webkit-scrollbar {
          width: 5px;
        }
        .chat-feed-viewport::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-feed-viewport::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>

      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
          <Badge status="processing" offset={[-4, 4]}>
            <Button
              type="primary"
              shape="circle"
              icon={<MessageOutlined style={{ fontSize: '24px' }} />}
              size="large"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#6b21a8',
                border: 'none',
                boxShadow: '0 8px 24px rgba(107, 33, 168, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => setIsOpen(true)}
            />
          </Badge>
        </div>
      )}

      {/* Main Interactive Window Interface */}
      {isOpen && (
        <Card
          className="exigo-clay-card"
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff' }}>
              <Avatar 
                style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)' }} 
                icon={<RobotOutlined style={{ color: '#c084fc' }} />} 
              />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, lineHeight: '1.2', color: '#f8fafc' }}>Exigo Assistant</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginTop: '2px' }}>Operational Guide</div>
              </div>
            </div>
          }
          extra={
            <Button 
              type="text" 
              shape="circle"
              icon={<CloseOutlined style={{ color: '#94a3b8', fontSize: '14px' }} />} 
              onClick={() => setIsOpen(false)} 
            />
          }
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '390px',
            maxHeight: '580px',
            height: '80vh',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          styles={{ body: { display: 'flex', flexDirection: 'column', flex: 1, padding: '16px', overflow: 'hidden' } }}
        >
          {/* Top WhatsApp Push Action Hub */}
          <div style={{ marginBottom: '14px' }}>
            <Button
              type="primary"
              icon={<WhatsAppOutlined style={{ fontSize: '18px' }} />}
              block
              className="exigo-clay-btn-wa"
              onClick={shiftToWhatsAppDirect}
              style={{
                height: '44px',
                fontWeight: 700,
                fontSize: '14px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              Continue on WhatsApp
            </Button>
          </div>

          {/* Central Scrolling Feed Engine */}
          <div 
            data-lenis-prevent 
            className="chat-feed-viewport"
            style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', marginBottom: '14px' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={messages}
              renderItem={(msg) => (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '12px'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                      gap: '10px',
                      maxWidth: '85%',
                      alignItems: 'end'
                    }}
                  >
                    <Avatar 
                      size="small" 
                      icon={msg.sender === 'user' ? <UserOutlined /> : <RobotOutlined />} 
                      style={{ 
                        backgroundColor: msg.sender === 'user' ? '#1e3a8a' : '#6b21a8', 
                        flexShrink: 0,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        marginBottom: '2px'
                      }}
                    />
                    <div
                      className={msg.sender === 'user' ? 'exigo-clay-bubble-user' : 'exigo-clay-bubble-ai'}
                      style={{
                        padding: '12px 16px',
                        fontSize: '13.5px',
                        lineHeight: '1.5',
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              )}
            />
            <div ref={chatEndRef} />
          </div>

          {/* Base Interactive Composition Line */}
          <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
            <Input
              placeholder="Ask about BaaS, CAPEX, QwikSELL..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleSendMessage}
              className="exigo-clay-input"
              style={{ height: '40px' }}
            />
            <Tooltip title="Send Message">
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                style={{ 
                  backgroundColor: '#6b21a8', 
                  border: 'none', 
                  borderRadius: '12px',
                  height: '40px',
                  width: '40px',
                  boxShadow: '0 4px 12px rgba(107, 33, 168, 0.3)'
                }}
              />
            </Tooltip>
          </div>
        </Card>
      )}
    </>
  );
};