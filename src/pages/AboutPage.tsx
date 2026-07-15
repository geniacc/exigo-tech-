import { useRef, useState, useEffect, useMemo } from 'react';
import { Layout, Row, Col, Card, Typography, Tag, Divider, Space, Button, Slider, Input } from 'antd';
import {
    RocketOutlined,
    SafetyCertificateOutlined,
    GlobalOutlined,
    ArrowRightOutlined,
    RiseOutlined,
    SyncOutlined,
    ThunderboltOutlined,
    LaptopOutlined,
    HistoryOutlined,
    AuditOutlined,
    CheckCircleOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Team member images
import imgBeekey from '../assets/Beekey Kumar-Deputy General Manager- Credits.jpeg';
import imgRohit from '../assets/Rohit Kumar-After Sales Service Manager.jpeg';
import imgAnagh from '../assets/Anagh sir.jpeg';
import imgSuraj from '../assets/Suraj Sharma- ASSISTANT MANAGER- FIELD & COLLECTION OPERATIONS.jpeg';
import imgPushpesh from '../assets/PUSHPESH KUMAR SHARMA-HEAD - R&D, SERVICE AND NEW PRODUCT DEVELOPMENT.jpeg';
import imgAshutosh from '../assets/Ashutosh Kumar (Supply Chain Engineer).jpeg';
import imgVicky from '../assets/Vicky Paswan- Lab Associate.jpeg';
import imgRitu from '../assets/Ritu-Executive-Operations & Support.jpeg';
import imgPapai from '../assets/Papai Roy (Sales & Collection Executive).jpeg';
import imgSumit from '../assets/Sumit- Sr. Accounts Excutive.jpeg';
import imgAnurag from '../assets/Anurag Sharma-Assistant Manager Operations.jpg';
import imgAbhishek from '../assets/Abhishek Prasad (Collection Executive).jpeg';
import imgAnkit from '../assets/Ankit Singh.jpeg';
import imgAnjali from '../assets/Anjali - Accounts Executive.jpeg';
import imgBharti from '../assets/Bharti Mishra- Customer Support Executive.jpeg';
import imgSourav from '../assets/Sourav Dey- Sales & Marketing Executive.jpg';
import imgSujal from '../assets/Sujal-Junior HR Executive.jpeg';
import imgAmit from '../assets/Amit Bhadouriya - collection Executive.png';
import imgShivam from '../assets/Shivam Singh.jpeg';
import imgDipam from '../assets/Dipam Kar (Sales & Collection Executive).jpeg';
import imgRahul from '../assets/Rahul Singh- Sales & Collection Executive.jpeg';
import imgRaushan from '../assets/RAUSHAN KUMAR (DGM-SCM).jpeg';
import imgSubhash from '../assets/Subhash Chand- Service Technician.jpeg';
import imgPragya from '../assets/Pragya (HR Manager).jpeg';
import imgSushmita from '../assets/Sushmita Kumari- Credit Executive.jpeg';
import imgAshish from '../assets/Ashish- Credit Executive.jpeg';
import imgPinki from '../assets/Pinki- Credit Executive.jpeg';
import imgBhawana from '../assets/Bhawana - operations Executive.jpeg';
import imgKrishna from '../assets/Krishna-Senior Accounts Executive.jpeg';
import imgTwinkle from '../assets/Twinkle-Founders-office.png';
import imgPankaj from '../assets/Pankaj Sir.jpeg';

gsap.registerPlugin(ScrollTrigger);

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// --- Smooth Count Up Component ---
const CountUp = ({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const [triggered, setTriggered] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !triggered) {
                setTriggered(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [triggered]);

    useEffect(() => {
        if (!triggered) return;
        let startTime: number | null = null;
        const duration = 2000;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeProgress = progress * (2 - progress); // easeOutQuad
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }, [triggered, end]);

    return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// --- Interactive 3D Parallax Tilt Card Component ---
const TiltCard = ({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Normalize coordinates from -0.5 to 0.5
        const px = x / rect.width - 0.5;
        const py = y / rect.height - 0.5;
        
        // Max tilt angles: 8 degrees for realistic premium depth
        setTilt({
            rx: -py * 8,
            ry: px * 8
        });
    };

    const handleMouseLeave = () => {
        setTilt({ rx: 0, ry: 0 });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
            style={{
                ...style,
                transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.01, 1.01, 1.01)`,
                transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
                transformStyle: 'preserve-3d'
            }}
        >
            <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }} className="h-full">
                {children}
            </div>
        </div>
    );
};

export default function AboutPage() {
    const heroRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Definitions of B2B Divisions & Pillars
    const divisions = [
        {
            title: "Urja Mobility",
            subtitle: "Battery-as-a-Service (BaaS) and Second-Life Power Assets",
            icon: <ThunderboltOutlined className="text-amber-500" />,
            color: "amber-glow",
            description: "Pioneering the commercial EV leasing model through zero-upfront energy solutions. Urja manages battery packs, IoT metrics, diagnostics, and extends lithium resource velocity by repurposing cells into second-life stationary storage systems before end-of-life recycling.",
            points: [
                "Commercial EV Fleet Leasing (2W, 3W, E-Loaders)",
                "Proprietary Smart Battery Management Systems (BMS)",
                "Dynamic Second-Life Stationary Power Storage Repurposing",
                "Advanced Mineral and Material Recovery Loops"
            ],
            linkText: "Explore Urja Platform",
            linkUrl: "/urja"
        },
        {
            title: "QwikSELL",
            subtitle: "Enterprise IT Hardware Life Cycle Re-commerce",
            icon: <LaptopOutlined className="text-sky-500" />,
            color: "sky-glow",
            description: "Addressing global e-waste through tech asset liquidations. QwikSELL handles automated hardware diagnostics and high-security NIST SP 800-88 sanitization wipes, restoring corporate laptops and servers back to secondary markets at peak yield value.",
            points: [
                "NIST SP 800-88 Compliant Data Destruction",
                "50+ Parameter Automated Diagnostic Testing",
                "Verified Corporate Buy-Back and exchange programs",
                "Carbon Offset Logging & Environmental Certification"
            ],
            linkText: "Explore QwikSELL Matrix",
            linkUrl: "/qwiksell"
        }
    ];

    const pillars = [
        {
            icon: <GlobalOutlined />,
            title: "Circularity First",
            text: "Shifting industries away from linear 'extract-make-dispose' patterns. We maximize materials velocity by recovering and extending value at every single stage."
        },
        {
            icon: <SafetyCertificateOutlined />,
            title: "NIST Wiping Standards",
            text: "Enterprise security is non-negotiable. Every hardware asset we process receives verified, block-level sanitization certificates."
        },
        {
            icon: <AuditOutlined />,
            title: "Full Traceability",
            text: "IoT-connected tracking monitors batteries and electronics from intake and lease cycles through refurbishment to clean recycling."
        }
    ];

    // Definitions of Leadership Team Members
    const teamMembers = [
        { id: 1,  name: "PANKAJ CHOPRA",        department: "MANAGEMENT",       role: "FOUNDER DIRECTOR & CEO",                              image: imgPankaj },
        { id: 2,  name: "ANAGH OJHA",           department: "MANAGEMENT",       role: "CO-FOUNDER-DIRECTOR & CTO",                          image: imgAnagh },
        { id: 3,  name: "BEEKEY KUMAR",         department: "CREDIT",           role: "DEPUTY GENERAL MANAGER - CREDIT",                    image: imgBeekey },
        { id: 4,  name: "ROHIT KUMAR",          department: "SALES & SERVICE",  role: "AFTER SALES SERVICE MANAGER (BIHAR & JKD)",          image: imgRohit },
        { id: 5,  name: "SURAJ SHARMA",         department: "COLLECTION",       role: "ASSISTANT MANAGER - FIELD & COLLECTION OPERATIONS",  image: imgSuraj },
        { id: 6,  name: "PUSHPESH KUMAR SHARMA", department: "TECHNICAL",       role: "HEAD - R&D, SERVICE AND NEW PRODUCT DEVELOPMENT",    image: imgPushpesh },
        { id: 7,  name: "ASHUTOSH KUMAR",       department: "SUPPLY CHAIN",     role: "SUPPLY CHAIN ENGINEER",                              image: imgAshutosh },
        { id: 8,  name: "VICKY",                department: "ADMIN",            role: "LAB ASSOCIATE",                                      image: imgVicky },
        { id: 9,  name: "RITU",                 department: "CUSTOMER SUPPORT", role: "EXECUTIVE - OPERATIONS & SUPPORT",                   image: imgRitu },
        { id: 10, name: "PAPAI ROY",            department: "SALES & COLLECTION",role: "SALES & COLLECTION EXECUTIVE",                      image: imgPapai },
        { id: 11, name: "SUMIT KUMAR",          department: "ACCOUNTS",         role: "SR ACCOUNTS EXECUTIVE",                              image: imgSumit },
        { id: 12, name: "ANURAG SHARMA",        department: "OPERATIONS",       role: "ASST MANAGER OPERATIONS",                            image: imgAnurag },
        { id: 13, name: "ABHISHEK PRASAD",      department: "COLLECTION",       role: "COLLECTION EXECUTIVE",                               image: imgAbhishek },
        { id: 14, name: "ANKIT SINGH",          department: "SALES & COLLECTION",role: "DRIVER ON-BOARDING & COLLECTION EXECUTIVE",         image: imgAnkit },
        { id: 15, name: "ANJALI",               department: "ACCOUNTS",         role: "ACCOUNTS EXECUTIVE",                                 image: imgAnjali },
        { id: 16, name: "TAPAS BARMAN",         department: "SALES & MARKETING", role: "SALES & MARKETING EXECUTIVE",                       image: "" },
        { id: 17, name: "BHARTI KUMARI",        department: "CUSTOMER SUPPORT", role: "CUSTOMER SUPPORT EXECUTIVE",                         image: imgBharti },
        { id: 18, name: "SOURAV DEY",           department: "SALES & MARKETING", role: "SALES AND MARKETING EXECUTIVE",                     image: imgSourav },
        { id: 19, name: "SUJAL RATHORE",        department: "HUMAN RESOURCE",   role: "JUNIOR HR EXECUTIVE",                                image: imgSujal },
        { id: 20, name: "AMIT BHADOURIYA",      department: "COLLECTION",       role: "COLLECTION EXECUTIVE",                               image: imgAmit },
        { id: 21, name: "SHIVAM SINGH",         department: "SALES & COLLECTION",role: "SALES & COLLECTION EXECUTIVE",                      image: imgShivam },
        { id: 22, name: "DIPAM KAR",            department: "SALES & COLLECTION",role: "SALES & COLLECTION EXECUTIVE",                      image: imgDipam },
        { id: 23, name: "RAHUL SINGH",          department: "SALES & COLLECTION",role: "SALES & COLLECTION EXECUTIVE",                      image: imgRahul },
        { id: 24, name: "RAUSHAN KUMAR",        department: "SUPPLY CHAIN",     role: "DGM-SCM",                                            image: imgRaushan },
        { id: 25, name: "MAHESH RAMDAS KADABA", department: "MANAGEMENT",       role: "CHIEF STRATEGY OFFICER",                             image: "" },
        { id: 26, name: "SUBHASH CHAND",        department: "TECHNICAL",        role: "SERVICE TECHNICIAN",                                 image: imgSubhash },
        { id: 27, name: "SANJIT DEY",           department: "SALES & COLLECTION",role: "SALES & COLLECTION EXECUTIVE",                      image: "" },
        { id: 28, name: "ROSHNI KUMARI",        department: "DATA",             role: "DATA ANALYST",                                       image: "" },
        { id: 29, name: "PRAVINDRA KUMAR",      department: "COLLECTION",       role: "DEALER FI & COLLECTION SUPERVISOR",                  image: "" },
        { id: 30, name: "ANTUL RAKESH",         department: "SUPPLY CHAIN",     role: "VICE PRESIDENT - SUPPLY CHAIN MANAGEMENT",           image: "" },
        { id: 31, name: "YAJUR CHOPRA",         department: "FINANCE",          role: "INVESTMENT ASSOCIATE",                               image: "" },
        { id: 32, name: "BANDANA KUMARI",       department: "MANAGEMENT",       role: "EXECUTIVE ASSISTANT TO CTO",                         image: "" },
        { id: 33, name: "PRAGYA",               department: "HUMAN RESOURCE",   role: "HR MANAGER",                                         image: imgPragya },
        { id: 34, name: "SUSHMITA KUMARI",      department: "CREDIT",           role: "CREDIT EXECUTIVE",                                   image: imgSushmita },
        { id: 35, name: "ASHISH KUMAR",         department: "CREDIT",           role: "CREDIT EXECUTIVE",                                   image: imgAshish },
        { id: 36, name: "PINKI",                department: "CREDIT",           role: "CREDIT EXECUTIVE",                                   image: imgPinki },
        { id: 37, name: "BHAWANA",              department: "OPERATIONS",       role: "OPERATION EXECUTIVE",                                image: imgBhawana },
        { id: 38, name: "SNEHA KHANDELWAL",     department: "CREDIT",           role: "CREDIT EXECUTIVE",                                   image: "" },
        { id: 39, name: "JATIN SADANA",         department: "CREDIT",           role: "CREDIT MANAGER",                                     image: "" },
        { id: 40, name: "KRISHNA",              department: "ACCOUNTS",         role: "SENIOR ACCOUNTS EXECUTIVE",                          image: imgKrishna },
        { id: 41, name: "TWINKLE",              department: "MANAGEMENT",       role: "FOUNDER'S OFFICE",                                   image: imgTwinkle },
    ];




    // Filter states for Corporate Directory
    const [selectedDept, setSelectedDept] = useState("All");
    const [searchText, setSearchText] = useState("");
    const [hoveredEmp, setHoveredEmp] = useState<number | null>(null);

    // Department accent colour map (shared with directory cards)
    const deptColorMap: Record<string, { color: string; light: string }> = {
        'MANAGEMENT':         { color: '#7c3aed', light: '#f5f3ff' },
        'CREDIT':             { color: '#0284c7', light: '#f0f9ff' },
        'SALES & SERVICE':    { color: '#059669', light: '#ecfdf5' },
        'COLLECTION':         { color: '#d97706', light: '#fffbeb' },
        'TECHNICAL':          { color: '#dc2626', light: '#fef2f2' },
        'SUPPLY CHAIN':       { color: '#0891b2', light: '#ecfeff' },
        'ADMIN':              { color: '#475569', light: '#f8fafc' },
        'CUSTOMER SUPPORT':   { color: '#db2777', light: '#fdf2f8' },
        'SALES & COLLECTION': { color: '#16a34a', light: '#f0fdf4' },
        'ACCOUNTS':           { color: '#b45309', light: '#fffbeb' },
        'OPERATIONS':         { color: '#7c3aed', light: '#f5f3ff' },
        'SALES & MARKETING':  { color: '#ea580c', light: '#fff7ed' },
        'HUMAN RESOURCE':     { color: '#be185d', light: '#fdf2f8' },
        'DATA':               { color: '#2563eb', light: '#eff6ff' },
        'FINANCE':            { color: '#65a30d', light: '#f7fee7' },
    };
    const getDeptStyle = (dept: string) => deptColorMap[dept] ?? { color: '#64748b', light: '#f8fafc' };

    // Unique department list derived from teamMembers
    const departments = useMemo(() => {
        const set = new Set(teamMembers.map(m => m.department));
        return ["All", ...Array.from(set)];
    }, []);

    // Filtered list for directory
    const filteredEmployees = useMemo(() => {
        return teamMembers.filter(m => {
            const matchesDept = selectedDept === "All" || m.department === selectedDept;
            const matchesSearch = m.name.toLowerCase().includes(searchText.toLowerCase()) ||
                                  m.role.toLowerCase().includes(searchText.toLowerCase());
            return matchesDept && matchesSearch;
        });
    }, [selectedDept, searchText]);

    // Track mouse coordinates on hero for interactive lighting glow
    const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    // Sliders states for the Interactive Impact Simulator
    const [laptops, setLaptops] = useState(1500);
    const [batteries, setBatteries] = useState(300);

    // Calculate real-time yields
    const co2Saved = laptops * 145 + batteries * 840;
    const milesPowered = batteries * 18000;
    const materialsSaved = laptops * 2.2 + batteries * 58;

    // Trigger GSAP Scroll animations
    useEffect(() => {
        // Entrance animations for Hero
        gsap.fromTo(".gsap-hero-tag", 
            { opacity: 0, scale: 0.8 }, 
            { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
        );
        gsap.fromTo(".gsap-hero-title", 
            { opacity: 0, y: 40, scale: 0.97 }, 
            { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "power4.out", delay: 0.15 }
        );
        gsap.fromTo(".gsap-hero-paragraph", 
            { opacity: 0, y: 25 }, 
            { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.35 }
        );

        // Stats Card reveals
        gsap.fromTo(".gsap-stat-card",
            { opacity: 0, y: 40, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.9,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".gsap-stats-section",
                    start: "top 85%"
                }
            }
        );

        // Division cards slide reveals
        gsap.fromTo(".gsap-division-card-wrap",
            { opacity: 0, y: 60, scale: 0.98 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                stagger: 0.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: ".gsap-divisions-section",
                    start: "top 80%"
                }
            }
        );

        // Simulator Dashboard entrance
        gsap.fromTo(".gsap-simulator-card",
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".gsap-simulator-section",
                    start: "top 80%"
                }
            }
        );

        // Pillars stagger fade scale
        gsap.fromTo(".gsap-pillar-card",
            { opacity: 0, y: 30, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.9,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".gsap-pillars-section",
                    start: "top 85%"
                }
            }
        );

        // Timeline line drawing ScrollTrigger
        gsap.fromTo(".timeline-active-line",
            { scaleY: 0 },
            {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: ".timeline-container",
                    start: "top 20%",
                    end: "bottom 70%",
                    scrub: 0.5
                }
            }
        );

        // Badges reveal scale
        gsap.utils.toArray(".timeline-badge").forEach((badge: any) => {
            gsap.fromTo(badge,
                { scale: 0 },
                {
                    scale: 1,
                    duration: 0.5,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: badge,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Panels reveal (alternating slide in)
        gsap.utils.toArray(".timeline-panel").forEach((panel: any, idx: number) => {
            const isMobileView = window.innerWidth <= 768;
            const xOffset = isMobileView ? 30 : (idx % 2 === 0 ? -50 : 50);
            
            gsap.fromTo(panel,
                { opacity: 0, x: xOffset, y: 15 },
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: panel,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Team stagger reveal & slight rotate trigger
        gsap.fromTo(".gsap-team-card",
            { opacity: 0, y: 50, scale: 0.95, rotate: (i) => i % 2 === 0 ? -1.5 : 1.5 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".gsap-team-section",
                    start: "top 80%"
                }
            }
        );

        // Directory reveal
        gsap.fromTo(".gsap-directory-section",
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1.0,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".gsap-directory-section",
                    start: "top 85%"
                }
            }
        );
    }, []);

    return (
        <Content style={{ backgroundColor: '#f8fafc', overflowX: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* CSS Interactive Animations */}
            <style>
                {`
                @keyframes pulseSlow {
                    0%, 100% { opacity: 0.15; transform: scale(1); }
                    50% { opacity: 0.25; transform: scale(1.05); }
                }

                .circular-glow-bg {
                    position: absolute;
                    width: 550px;
                    height: 550px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(139, 92, 246, 0.09) 0%, transparent 70%);
                    filter: blur(40px);
                    pointer-events: none;
                    animation: pulseSlow 8s infinite ease-in-out;
                }

                .spin-slow {
                    animation: spin 12s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* Premium Card styling */
                .glass-card {
                    background: rgba(255, 255, 255, 0.75) !important;
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(226, 232, 240, 0.8) !important;
                    border-radius: 28px !important;
                    box-shadow: 0 10px 30px -10px rgba(148, 163, 184, 0.08) !important;
                    transition: all 0.3s ease !important;
                }

                .glass-card:hover {
                    background: #ffffff !important;
                    box-shadow: 0 24px 50px -18px rgba(107, 33, 168, 0.1) !important;
                    border-color: rgba(107, 33, 168, 0.2) !important;
                }

                .amber-glow-card {
                    background: linear-gradient(135deg, #fffbeb 0%, #f0fdf4 100%) !important;
                    border: 1.5px solid rgba(245, 158, 11, 0.2) !important;
                }

                .amber-glow-card:hover {
                    background: linear-gradient(135deg, #fef3c7 0%, #ecfdf5 100%) !important;
                    box-shadow: 0 24px 50px -18px rgba(245, 158, 11, 0.15) !important;
                    border-color: rgba(245, 158, 11, 0.45) !important;
                }

                .sky-glow-card {
                    background: linear-gradient(135deg, #eff6ff 0%, #faf5ff 100%) !important;
                    border: 1.5px solid rgba(14, 165, 233, 0.2) !important;
                }

                .sky-glow-card:hover {
                    background: linear-gradient(135deg, #e0f2fe 0%, #f5f3ff 100%) !important;
                    box-shadow: 0 24px 50px -18px rgba(14, 165, 233, 0.15) !important;
                    border-color: rgba(14, 165, 233, 0.45) !important;
                }

                .stat-box {
                    padding: 32px 24px;
                    border-radius: 24px;
                    text-align: center;
                    height: 100%;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .stat-box-purple { background: #faf5ff; border: 1.5px solid #e9d5ff; }
                .stat-box-purple:hover { background: #f3e8ff; border-color: #d8b4fe; box-shadow: 0 12px 36px rgba(107, 33, 168, 0.1); }
                .stat-box-sky { background: #eff6ff; border: 1.5px solid #bfdbfe; }
                .stat-box-sky:hover { background: #dbeafe; border-color: #93c5fd; box-shadow: 0 12px 36px rgba(14, 165, 233, 0.1); }
                .stat-box-indigo { background: #e0e7ff; border: 1.5px solid #c7d2fe; }
                .stat-box-indigo:hover { background: #c7d2fe; border-color: #818cf8; box-shadow: 0 12px 36px rgba(79, 70, 229, 0.1); }
                .stat-box-emerald { background: #ecfdf5; border: 1.5px solid #a7f3d0; }
                .stat-box-emerald:hover { background: #d1fae5; border-color: #34d399; box-shadow: 0 12px 36px rgba(16, 185, 129, 0.1); }

                /* Simulator result metrics */
                .hud-display {
                    background: #0f172a;
                    border: 1px solid #1e293b;
                    border-radius: 20px;
                    padding: 24px;
                    color: #fff;
                    font-family: monospace;
                    position: relative;
                    overflow: hidden;
                    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.6);
                }

                .hud-line-glow {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #0284c7, transparent);
                    animation: scanningBar 3s linear infinite;
                }

                @keyframes scanningBar {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(220px); }
                }

                .interactive-slider-input .ant-slider-track {
                    background-color: #6b21a8 !important;
                }
                .interactive-slider-input .ant-slider-handle::after {
                    box-shadow: 0 0 0 2px #6b21a8 !important;
                }

                .interactive-slider-input-sky .ant-slider-track {
                    background-color: #0284c7 !important;
                }
                .interactive-slider-input-sky .ant-slider-handle::after {
                    box-shadow: 0 0 0 2px #0284c7 !important;
                }

                /* Custom timeline style rules */
                .timeline-container {
                    position: relative;
                    padding: 50px 0;
                    width: 100%;
                }

                .timeline-line {
                    position: absolute;
                    left: 50%;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    background: #cbd5e1;
                    transform: translateX(-50%);
                    z-index: 1;
                }

                .timeline-active-line {
                    position: absolute;
                    left: 50%;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    background: linear-gradient(to bottom, #6b21a8, #0284c7);
                    transform: translateX(-50%);
                    transform-origin: top;
                    z-index: 2;
                }

                .timeline-item {
                    margin-bottom: 90px;
                    position: relative;
                    display: flex;
                    justify-content: flex-end;
                    width: 100%;
                    transform-style: preserve-3d;
                }

                .timeline-item:last-child {
                    margin-bottom: 0;
                }

                .timeline-item:nth-child(even) {
                    flex-direction: row-reverse;
                }

                .timeline-badge {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 17px;
                    color: #fff;
                    position: absolute;
                    left: 50%;
                    top: 15px;
                    transform: translateX(-50%);
                    z-index: 10;
                    box-shadow: 0 4px 15px rgba(107, 33, 168, 0.25);
                    border: 4px solid #ffffff;
                    background-color: #6b21a8;
                }

                .timeline-panel {
                    width: 44%;
                    padding: 28px;
                    border-radius: 24px;
                    background: rgba(255, 255, 255, 0.75);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(226, 232, 240, 0.85);
                    box-shadow: 0 4px 24px rgba(15, 23, 42, 0.02);
                    position: relative;
                    transition: all 0.3s ease;
                }

                .timeline-panel:hover {
                    background: #ffffff;
                    transform: translateY(-3px);
                    box-shadow: 0 12px 36px rgba(107, 33, 168, 0.05);
                    border-color: rgba(107, 33, 168, 0.15);
                }

                .timeline-panel::after {
                    content: '';
                    position: absolute;
                    top: 28px;
                    width: 0;
                    height: 0;
                    border-style: solid;
                }

                .timeline-item:nth-child(odd) .timeline-panel::after {
                    right: -10px;
                    border-width: 10px 0 10px 10px;
                    border-color: transparent transparent transparent rgba(226, 232, 240, 0.85);
                }

                .timeline-item:nth-child(even) .timeline-panel::after {
                    left: -10px;
                    border-width: 10px 10px 10px 0;
                    border-color: transparent rgba(226, 232, 240, 0.85) transparent transparent;
                }

                /* Team card image hover zoom effects */
                .team-card-wrap {
                    transition: all 0.3s ease;
                }

                .team-image-wrapper {
                    overflow: hidden;
                    height: 310px;
                    position: relative;
                }

                .team-card-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .team-card-wrap:hover .team-card-image {
                    transform: scale(1.08);
                }

                .team-social-icon {
                    transition: all 0.3s ease;
                }
                .team-social-icon:hover {
                    transform: scale(1.15) translateY(-2px);
                }

                /* Mobile View Adjustments for Timeline */
                @media (max-width: 768px) {
                    .timeline-line, .timeline-active-line {
                        left: 24px;
                        transform: none;
                    }

                    .timeline-item, .timeline-item:nth-child(even) {
                        flex-direction: row;
                        justify-content: flex-start;
                        margin-bottom: 60px;
                    }

                    .timeline-badge {
                        left: 24px;
                        transform: translateX(-50%);
                    }

                    .timeline-panel {
                        width: calc(100% - 60px);
                        margin-left: 60px !important;
                    }

                    .timeline-panel::after {
                        left: -10px !important;
                        right: auto !important;
                        border-width: 10px 10px 10px 0 !important;
                        border-color: transparent rgba(226, 232, 240, 0.85) transparent transparent !important;
                    }
                }

                /* ===== TEAM CARDS ===== */
                @keyframes shimmerSlide {
                    0% { transform: translateX(-100%) rotate(25deg); }
                    100% { transform: translateX(300%) rotate(25deg); }
                }
                @keyframes floatUp {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes ringPulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.06); }
                }
                @keyframes dotFade {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 0.45; }
                }

                .team-card-outer {
                    perspective: 1200px;
                    cursor: pointer;
                }
                .team-card-inner {
                    position: relative;
                    width: 100%;
                    transition: transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
                    transform-style: preserve-3d;
                    border-radius: 28px;
                }
                .team-card-outer:hover .team-card-inner {
                    transform: rotateY(180deg);
                }
                .team-card-front, .team-card-back {
                    position: absolute;
                    width: 100%;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                    border-radius: 28px;
                    overflow: hidden;
                }
                .team-card-back {
                    transform: rotateY(180deg);
                }

                .team-card-shimmer {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%);
                    transform: translateX(-100%) rotate(25deg);
                    pointer-events: none;
                    border-radius: inherit;
                }
                .team-card-outer:hover .team-card-shimmer {
                    animation: shimmerSlide 0.75s ease forwards;
                }

                .team-avatar-ring {
                    animation: ringPulse 3s ease-in-out infinite;
                }
                .team-card-outer:hover .team-float-img {
                    animation: floatUp 3s ease-in-out infinite;
                }

                .team-dot-bg span {
                    animation: dotFade 2.5s ease-in-out infinite;
                }
                .team-dot-bg span:nth-child(2n) { animation-delay: 0.4s; }
                .team-dot-bg span:nth-child(3n) { animation-delay: 0.8s; }
                .team-dot-bg span:nth-child(4n) { animation-delay: 1.2s; }
                .team-dot-bg span:nth-child(5n) { animation-delay: 1.6s; }

                .team-back-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    padding: 36px 28px;
                    text-align: center;
                    gap: 12px;
                }
                .team-social-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    font-size: 16px;
                    text-decoration: none;
                }
                .team-social-btn:hover {
                    transform: scale(1.15) translateY(-2px);
                }

                /* ===== DIRECTORY CARDS ===== */
                @keyframes cardEntrance {
                    from { opacity: 0; transform: translateY(28px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes searchPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0); }
                    50%      { box-shadow: 0 0 0 4px rgba(124,58,237,0.12); }
                }
                @keyframes badgePop {
                    0%   { transform: scale(0.7); opacity: 0; }
                    70%  { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes avatarGlow {
                    0%, 100% { box-shadow: 0 0 0 3px transparent; }
                    50%      { box-shadow: 0 0 0 3px var(--dept-color, #7c3aed44); }
                }

                .dir-card {
                    background: #ffffff;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 20px;
                    padding: 24px 16px 20px 16px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    cursor: pointer;
                    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
                                box-shadow 0.3s ease,
                                border-color 0.3s ease,
                                background 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    animation: cardEntrance 0.45s ease both;
                }
                .dir-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 20px 48px rgba(15,23,42,0.1);
                    border-color: var(--dir-accent, #7c3aed44);
                    background: var(--dir-light, #faf5ff);
                    z-index: 2;
                }

                .dir-card-shimmer {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.7) 50%, transparent 65%);
                    transform: translateX(-100%) rotate(20deg);
                    pointer-events: none;
                }
                .dir-card:hover .dir-card-shimmer {
                    animation: shimmerSlide 0.6s ease forwards;
                }

                .dir-avatar {
                    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
                }
                .dir-card:hover .dir-avatar {
                    transform: scale(1.1) translateY(-4px);
                }

                .dir-dept-badge {
                    animation: badgePop 0.35s ease both;
                    transition: transform 0.2s ease;
                }
                .dir-card:hover .dir-dept-badge {
                    transform: scale(1.06);
                }

                .dir-code-chip {
                    opacity: 0;
                    transform: translateY(4px);
                    transition: opacity 0.25s ease, transform 0.25s ease;
                }
                .dir-card:hover .dir-code-chip {
                    opacity: 1;
                    transform: translateY(0);
                }

                .dir-filter-chip {
                    border-radius: 20px !important;
                    font-size: 12px !important;
                    font-weight: 600 !important;
                    transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1) !important;
                    border: 1.5px solid #e2e8f0 !important;
                }
                .dir-filter-chip:hover {
                    transform: translateY(-2px) scale(1.04) !important;
                    border-color: #7c3aed44 !important;
                }
                .dir-filter-chip.active {
                    background: linear-gradient(135deg, #7c3aed, #0284c7) !important;
                    border-color: transparent !important;
                    color: #ffffff !important;
                    box-shadow: 0 4px 14px rgba(124,58,237,0.3) !important;
                }

                .dir-search-wrap input:focus {
                    border-color: #7c3aed !important;
                    animation: searchPulse 1.5s ease infinite;
                }

                .dir-empty {
                    padding: 60px 0;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 15px;
                }

                .dir-count-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #7c3aed, #0284c7);
                    color: #ffffff;
                    font-size: 11px;
                    font-weight: 700;
                    border-radius: 20px;
                    padding: 2px 10px;
                    margin-left: 10px;
                    vertical-align: middle;
                }
                /* ====== COMPACT MOBILE DIRECTORY OVERRIDES ====== */
                @media (max-width: 576px) {
                    .dir-card {
                        padding: 12px 6px 10px 6px !important;
                        border-radius: 14px !important;
                    }
                    .dir-avatar {
                        width: 56px !important;
                        height: 56px !important;
                        border-width: 1.5px !important;
                        margin-bottom: 8px !important;
                    }
                    .dir-name-text {
                        font-size: 11px !important;
                        letter-spacing: -0.01em !important;
                        line-height: 1.2 !important;
                    }
                    .dir-role-text {
                        font-size: 9px !important;
                        margin-bottom: 6px !important;
                        line-height: 1.2 !important;
                    }
                    .dir-dept-badge {
                        font-size: 7.5px !important;
                        padding: 1px 5px !important;
                    }
                    .dir-filter-row {
                        display: flex !important;
                        overflow-x: auto !important;
                        justify-content: flex-start !important;
                        padding: 4px 16px !important;
                        width: 100vw !important;
                        margin-left: -24px !important;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none;
                    }
                    .dir-filter-row::-webkit-scrollbar {
                        display: none;
                    }
                    .dir-filter-chip {
                        padding: 4px 10px !important;
                        font-size: 11px !important;
                        flex-shrink: 0 !important;
                        border-radius: 12px !important;
                    }
                }
                `}


            </style>

            {/* --- HERO SECTION --- */}
            <section 
                ref={heroRef} 
                onMouseMove={handleHeroMouseMove}
                className="relative overflow-hidden" 
                style={{ padding: '170px 24px 110px 24px', textAlign: 'center', background: 'linear-gradient(180deg, #f1f5f9 0%, #f8fafc 100%)', cursor: 'default' }}
            >
                <div className="circular-glow-bg" style={{ top: '-10%', left: '10%' }} />
                <div className="circular-glow-bg" style={{ bottom: '-20%', right: '5%' }} />

                {/* Mouse interaction spotlight glow overlay */}
                <div
                    style={{
                        left: `${mousePos.x}px`,
                        top: `${mousePos.y}px`,
                        transform: 'translate(-50%, -50%)',
                        position: 'absolute',
                        width: '450px',
                        height: '450px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(30, 58, 138, 0.08) 50%, transparent 80%)',
                        filter: 'blur(35px)',
                        pointerEvents: 'none',
                        transition: 'left 0.12s ease-out, top 0.12s ease-out',
                        zIndex: 1
                    }}
                />

                <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                    <div className="gsap-hero-tag opacity-0">
                        <Tag className="premium-tag" color="purple" style={{ padding: '5px 18px', borderRadius: '24px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            CIRCULAR TECH PLATFORM
                        </Tag>
                    </div>
                    <Title level={1} className="gsap-hero-title opacity-0" style={{ fontSize: 'clamp(2.6rem, 6.5vw, 4.4rem)', lineHeight: '1.15', color: '#0f172a', fontWeight: 900, letterSpacing: '-0.04em', marginTop: '24px' }}>
                        Innovating for a Zero-Waste Future
                    </Title>
                    <Paragraph className="gsap-hero-paragraph opacity-0" style={{ fontSize: 'clamp(1.15rem, 2.6vw, 1.55rem)', color: '#475569', fontWeight: 500, maxWidth: '850px', margin: '24px auto 0 auto', lineHeight: '1.55' }}>
                        Exigo Cleantech is a technology-led product lifecycle management platform. We build closed-loop business ecosystems that recover battery minerals and sanitize corporate hardware, steering industries toward a zero-waste economy.
                    </Paragraph>
                </div>
            </section>

            {/* --- CORE STATS GRID (gsap-stats-section) --- */}
            <section className="gsap-stats-section" style={{ padding: '30px 24px 90px 24px', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} sm={12} lg={6} className="gsap-stat-card opacity-0">
                            <div className="stat-box stat-box-purple">
                                <div style={{ fontSize: '34px', marginBottom: '12px' }}><RiseOutlined className="text-purple-600" /></div>
                                <div style={{ fontSize: '38px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                    <CountUp end={300} suffix="%" />
                                </div>
                                <Text type="secondary" style={{ display: 'block', fontSize: '13.5px', marginTop: '8px', lineHeight: '1.4', fontWeight: 700 }}>
                                    Operational Scale Growth YoY
                                </Text>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} lg={6} className="gsap-stat-card opacity-0">
                            <div className="stat-box stat-box-sky">
                                <div style={{ fontSize: '34px', marginBottom: '12px' }}><SyncOutlined className="text-sky-600 spin-slow" /></div>
                                <div style={{ fontSize: '38px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                    <CountUp end={145} suffix=" Lbs" />
                                </div>
                                <Text type="secondary" style={{ display: 'block', fontSize: '13.5px', marginTop: '8px', lineHeight: '1.4', fontWeight: 700 }}>
                                    Carbon Saved Per Asset Refurbished
                                </Text>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} lg={6} className="gsap-stat-card opacity-0">
                            <div className="stat-box stat-box-indigo">
                                <div style={{ fontSize: '34px', marginBottom: '12px' }}><GlobalOutlined className="text-indigo-600" /></div>
                                <div style={{ fontSize: '38px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                    <CountUp end={100} suffix="%" />
                                </div>
                                <Text type="secondary" style={{ display: 'block', fontSize: '13.5px', marginTop: '8px', lineHeight: '1.4', fontWeight: 700 }}>
                                    Full Circular Custody Traceability
                                </Text>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} lg={6} className="gsap-stat-card opacity-0">
                            <div className="stat-box stat-box-emerald">
                                <div style={{ fontSize: '34px', marginBottom: '12px' }}><SafetyCertificateOutlined className="text-emerald-600" /></div>
                                <div style={{ fontSize: '38px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                    NIST 800-88
                                </div>
                                <Text type="secondary" style={{ display: 'block', fontSize: '13.5px', marginTop: '8px', lineHeight: '1.4', fontWeight: 700 }}>
                                    Verified Secure Sanitization Standards
                                </Text>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* --- COMPREHENSIVE BUSINESS MODEL (gsap-divisions-section) --- */}
            <section className="gsap-divisions-section" style={{ padding: '100px 24px 100px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <Tag color="indigo" style={{ padding: '4px 12px', borderRadius: '10px', fontWeight: 700 }}>OPERATIONAL DOMAINS</Tag>
                        <Title level={2} style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginTop: '16px', letterSpacing: '-0.03em' }}>
                            Our Integrated B2B Divisions
                        </Title>
                        <Paragraph style={{ color: '#64748b', fontSize: '16px', maxWidth: '650px', margin: '12px auto 0 auto' }}>
                            Hover over cards to interact with the 3D depth tilt and learn how we connect EV battery BaaS models with secure IT asset liquidations.
                        </Paragraph>
                    </div>

                    <Row gutter={[32, 40]}>
                        {divisions.map((div: any, idx: number) => (
                            <Col xs={24} lg={12} key={idx} className="gsap-division-card-wrap opacity-0">
                                <TiltCard className={`glass-card ${div.color}-card h-full`} style={{ border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                                    <div style={{ padding: '40px' }} className="h-full flex flex-col justify-between">
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                                    {div.icon}
                                                </div>
                                                <div>
                                                    <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '1.5rem' }}>{div.title}</Title>
                                                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 800, color: '#6b21a8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{div.subtitle}</Text>
                                                </div>
                                            </div>

                                            <Paragraph style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7', marginBottom: '28px' }}>
                                                {div.description}
                                            </Paragraph>

                                            <div style={{ marginBottom: '32px' }}>
                                                <Text style={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em', display: 'block', marginBottom: '16px' }}>Core System Capabilities</Text>
                                                <Row gutter={[16, 12]}>
                                                    {div.points.map((pt: string, pIdx: number) => (
                                                        <Col span={24} key={pIdx}>
                                                            <Space align="start" size="middle">
                                                                <CheckCircleOutlined className="text-emerald-500" style={{ fontSize: '15px', marginTop: '3px' }} />
                                                                <Text style={{ fontSize: '14px', color: '#334155', fontWeight: 600 }}>{pt}</Text>
                                                            </Space>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </div>
                                        </div>

                                        <div>
                                            <Divider style={{ margin: '24px 0' }} />
                                            <Button
                                                type="link"
                                                href={div.linkUrl}
                                                style={{ padding: 0, height: 'auto', fontWeight: 700, color: '#6b21a8', fontSize: '14.5px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                                                className="group"
                                            >
                                                {div.linkText} <ArrowRightOutlined className="transition-transform group-hover:translate-x-1.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </TiltCard>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* --- NEW: INTERACTIVE CIRCULAR IMPACT SIMULATOR (gsap-simulator-section) --- */}
            <section className="gsap-simulator-section" style={{ padding: '100px 24px', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
                <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <Tag color="cyan" style={{ padding: '4px 12px', borderRadius: '10px', fontWeight: 700 }}>REAL-TIME PLAYGROUND</Tag>
                        <Title level={2} style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', marginTop: '16px', letterSpacing: '-0.03em' }}>
                            Simulate Your Circular Carbon Savings
                        </Title>
                        <Paragraph style={{ color: '#64748b', fontSize: '15px' }}>
                            Adjust the sliders below to see the carbon offset, EV miles, and material resources saved by recycling through Exigo's ecosystems.
                        </Paragraph>
                    </div>

                    <Card className="glass-card gsap-simulator-card opacity-0" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%)', border: '1.5px solid rgba(59, 130, 246, 0.25)', boxShadow: '0 20px 40px rgba(107, 33, 168, 0.04)' }} styles={{ body: { padding: '40px' } }}>
                        <Row gutter={[40, 32]}>
                            {/* Sliders Control Panel */}
                            <Col xs={24} md={12}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                                💻 Corporate Laptops Liquidated
                                            </span>
                                            <span style={{ color: '#6b21a8', fontWeight: 800, fontSize: '16px' }}>{laptops} units</span>
                                        </div>
                                        <Slider
                                            min={0}
                                            max={10000}
                                            step={100}
                                            value={laptops}
                                            onChange={(val) => setLaptops(val)}
                                            className="interactive-slider-input"
                                            tooltip={{ open: false }}
                                        />
                                        <Text type="secondary" style={{ fontSize: '11px' }}>Saves approx. 145 lbs CO2 and 2.2 lbs silicon/heavy metals per laptop.</Text>
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                                ⚡ EV battery packs Leased (Urja)
                                            </span>
                                            <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '16px' }}>{batteries} packs</span>
                                        </div>
                                        <Slider
                                            min={0}
                                            max={2000}
                                            step={20}
                                            value={batteries}
                                            onChange={(val) => setBatteries(val)}
                                            className="interactive-slider-input-sky"
                                            tooltip={{ open: false }}
                                        />
                                        <Text type="secondary" style={{ fontSize: '11px' }}>Saves 840 lbs CO2 extraction carbon, powering sustainable BaaS miles.</Text>
                                    </div>
                                </div>
                            </Col>

                            {/* Simulation Outputs HUD */}
                            <Col xs={24} md={12}>
                                <div className="hud-display flex flex-col justify-between h-full gap-5">
                                    <div className="hud-line-glow" />
                                    <div>
                                        <div style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                                            // CALIBRATING CIRCULAR MATRIX OUTPUTS
                                        </div>
                                        <Divider style={{ margin: '8px 0', borderColor: '#1e293b' }} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <span style={{ color: '#94a3b8', fontSize: '11px', display: 'block' }}>CARBON EMISSIONS MITIGATION:</span>
                                            <span style={{ color: '#10b981', fontSize: '26px', fontWeight: 900 }}>
                                                {co2Saved.toLocaleString()} Lbs CO2
                                            </span>
                                        </div>

                                        <div>
                                            <span style={{ color: '#94a3b8', fontSize: '11px', display: 'block' }}>CLEAN ELECTRIC EV MILES ENABLED:</span>
                                            <span style={{ color: '#38bdf8', fontSize: '26px', fontWeight: 900 }}>
                                                {milesPowered.toLocaleString()} Miles
                                            </span>
                                        </div>

                                        <div>
                                            <span style={{ color: '#94a3b8', fontSize: '11px', display: 'block' }}>RAW MINERALS & SILICON WIPE RECLAIMED:</span>
                                            <span style={{ color: '#a78bfa', fontSize: '26px', fontWeight: 900 }}>
                                                {materialsSaved.toLocaleString()} Lbs
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <Divider style={{ margin: '8px 0', borderColor: '#1e293b' }} />
                                        <div style={{ color: '#10b981', fontSize: '9px', letterSpacing: '0.05em' }}>
                                            ● STATUS: METRIC YIELDS COMPLIANT NIST 800-88
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </section>

            {/* --- PILLARS OF EXCELLENCE (gsap-pillars-section) --- */}
            <section className="gsap-pillars-section" style={{ padding: '100px 24px', backgroundColor: '#f8fafc' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <Tag color="purple" style={{ padding: '4px 12px', borderRadius: '10px', fontWeight: 700 }}>CORE PILLARS</Tag>
                        <Title level={2} style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginTop: '16px' }}>
                            Our Design & Quality Philosophy
                        </Title>
                    </div>

                    <Row gutter={[32, 32]}>
                        {pillars.map((pl: any, idx: number) => (
                            <Col xs={24} md={8} key={idx} className="gsap-pillar-card opacity-0">
                                <div style={{ height: '100%', padding: '24px' }}>
                                    <div style={{ fontSize: '32px', color: '#6b21a8', marginBottom: '20px' }}>
                                        {pl.icon}
                                    </div>
                                    <Title level={4} style={{ fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                                        {pl.title}
                                    </Title>
                                    <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.7', margin: 0 }}>
                                        {pl.text}
                                    </Paragraph>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* --- INTERACTIVE MILESTONE TIMELINE (gsap-timeline-section) --- */}
            <section className="gsap-timeline-section" style={{ padding: '100px 24px 140px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', position: 'relative' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <Tag color="cyan" style={{ padding: '4px 12px', borderRadius: '10px', fontWeight: 700 }}>EVOLUTIONARY PATHWAY</Tag>
                        <Title level={2} style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginTop: '16px' }}>
                            The Corporate Roadmap
                        </Title>
                    </div>

                    <div className="timeline-container gsap-timeline-box opacity-0">
                        {/* Vertical Path Lines */}
                        <div className="timeline-line" />
                        <div className="timeline-active-line" />

                        {/* Timeline Items */}
                        <div className="timeline-item">
                            <div className="timeline-badge" style={{ backgroundColor: '#7c3aed', boxShadow: '0 4px 18px rgba(124,58,237,0.35)', border: '4px solid #f5f3ff' }}>
                                <HistoryOutlined style={{ color: '#ffffff' }} />
                            </div>
                            <div className="timeline-panel" style={{
                                background: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 50%, #f5f3ff 100%)',
                                borderColor: 'rgba(167,139,250,0.45)',
                                borderLeft: '4px solid #7c3aed',
                                boxShadow: '0 6px 32px rgba(124,58,237,0.08)'
                            }}>
                                <span className="text-[11px] font-bold text-purple-600 font-mono block mb-1">PHASE 1 // 2021-2022</span>
                                <Title level={4} style={{ margin: '0 0 8px 0', fontWeight: 800, color: '#581c87' }}>Diagnostic Inception</Title>
                                <Paragraph style={{ fontSize: '13.5px', color: '#6b21a8', lineHeight: '1.6', margin: 0 }}>
                                    Exigo Cleantech establishes research pathways in battery management architectures and automated hardware lifecycle diagnostic platforms.
                                </Paragraph>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-badge" style={{ backgroundColor: '#0284c7', boxShadow: '0 4px 18px rgba(2,132,199,0.35)', border: '4px solid #f0f9ff' }}>
                                <RocketOutlined style={{ color: '#ffffff' }} />
                            </div>
                            <div className="timeline-panel" style={{
                                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0feff 100%)',
                                borderColor: 'rgba(56,189,248,0.45)',
                                borderLeft: '4px solid #0284c7',
                                boxShadow: '0 6px 32px rgba(2,132,199,0.08)'
                            }}>
                                <span className="text-[11px] font-bold text-sky-600 font-mono block mb-1">PHASE 2 // 2022-2023</span>
                                <Title level={4} style={{ margin: '0 0 8px 0', fontWeight: 800, color: '#075985' }}>Division Deployments</Title>
                                <Paragraph style={{ fontSize: '13.5px', color: '#0369a1', lineHeight: '1.6', margin: 0 }}>
                                    Launches QwikSELL IT re-commerce testing lines and deploys Urja Mobility's commercial EV battery lease systems in Northern India.
                                </Paragraph>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-badge" style={{ backgroundColor: '#059669', boxShadow: '0 4px 18px rgba(5,150,105,0.35)', border: '4px solid #ecfdf5' }}>
                                <SafetyCertificateOutlined style={{ color: '#ffffff' }} />
                            </div>
                            <div className="timeline-panel" style={{
                                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #f0fdf4 100%)',
                                borderColor: 'rgba(52,211,153,0.45)',
                                borderLeft: '4px solid #059669',
                                boxShadow: '0 6px 32px rgba(5,150,105,0.08)'
                            }}>
                                <span className="text-[11px] font-bold text-emerald-700 font-mono block mb-1">PHASE 3 // 2023-2025</span>
                                <Title level={4} style={{ margin: '0 0 8px 0', fontWeight: 800, color: '#064e3b' }}>Scale & Compliance Wipes</Title>
                                <Paragraph style={{ fontSize: '13.5px', color: '#047857', lineHeight: '1.6', margin: 0 }}>
                                    Expands fleet metrics to cover over 12,000+ IoT nodes. Achieves 100% NIST SP 800-88 compliance across all electronic asset liquidations.
                                </Paragraph>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-badge" style={{ backgroundColor: '#d97706', boxShadow: '0 4px 18px rgba(217,119,6,0.35)', border: '4px solid #fffbeb' }}>
                                <GlobalOutlined style={{ color: '#ffffff' }} />
                            </div>
                            <div className="timeline-panel" style={{
                                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fef9ee 100%)',
                                borderColor: 'rgba(251,191,36,0.45)',
                                borderLeft: '4px solid #d97706',
                                boxShadow: '0 6px 32px rgba(217,119,6,0.08)'
                            }}>
                                <span className="text-[11px] font-bold text-amber-700 font-mono block mb-1">PHASE 4 // PRESENT</span>
                                <Title level={4} style={{ margin: '0 0 8px 0', fontWeight: 800, color: '#78350f' }}>Circular Ecosystem</Title>
                                <Paragraph style={{ fontSize: '13.5px', color: '#92400e', lineHeight: '1.6', margin: 0 }}>
                                    Scaling BaaS leases globally, maximizing EV battery cell second-life applications, and expanding circular mineral extraction capabilities.
                                </Paragraph>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- LEADERSHIP TEAM SECTION (gsap-team-section) --- */}
            {/* --- CORPORATE DIRECTORY SECTION (gsap-directory-section) --- */}
            <section className="gsap-directory-section opacity-0" style={{ padding: '100px 24px 130px 24px', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', borderTop: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>

                {/* ambient bg */}
                <div style={{ position: 'absolute', top: '-100px', right: '-120px', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-100px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <Tag color="cyan" style={{ padding: '4px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em' }}>CORPORATE DIRECTORY</Tag>
                        <Title level={2} style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 900, color: '#0f172a', marginTop: '16px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                            Our Professional Team
                        </Title>
                        <Paragraph style={{ color: '#64748b', fontSize: '15px', maxWidth: '600px', margin: '12px auto 0 auto', lineHeight: 1.7 }}>
                            A complete listing of our managers, executives, and department specialists leading operations across divisions.
                        </Paragraph>
                        <div style={{ width: '48px', height: '4px', borderRadius: '4px', background: 'linear-gradient(90deg, #06b6d4, #7c3aed)', margin: '20px auto 0 auto' }} />
                    </div>

                    {/* Search & Filter Bar */}
                    <div style={{ marginBottom: '48px', display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center' }}>
                        {/* Search */}
                        <div className="dir-search-wrap" style={{ width: '100%', maxWidth: '520px' }}>
                            <Input
                                placeholder="Search by name or role..."
                                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ borderRadius: '14px', padding: '10px 16px', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', fontSize: '14px', transition: 'border-color 0.2s ease' }}
                                suffix={searchText && (
                                    <button onClick={() => setSearchText('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '13px', padding: 0 }}>✕</button>
                                )}
                            />
                        </div>

                        {/* Department filter chips */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '960px' }}>
                            {departments.map((dept) => {
                                const isActive = selectedDept === dept;
                                const dStyle = dept !== 'All' ? getDeptStyle(dept) : { color: '#7c3aed', light: '#f5f3ff' };
                                return (
                                    <button
                                        key={dept}
                                        onClick={() => setSelectedDept(dept)}
                                        className={`dir-filter-chip${isActive ? ' active' : ''}`}
                                        style={{
                                            padding: '6px 16px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            border: isActive ? 'none' : `1.5px solid ${dStyle.color}33`,
                                            background: isActive
                                                ? `linear-gradient(135deg, ${dStyle.color}, ${dStyle.color}bb)`
                                                : `${dStyle.color}0d`,
                                            color: isActive ? '#ffffff' : dStyle.color,
                                            boxShadow: isActive ? `0 4px 14px ${dStyle.color}44` : 'none',
                                            transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                                        }}
                                    >
                                        {dept}
                                        {dept === selectedDept && dept !== 'All' && (
                                            <span style={{ marginLeft: '6px', opacity: 0.8 }}>✓</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Result count */}
                        <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>
                            Showing <span className="dir-count-badge">{filteredEmployees.length}</span> team member{filteredEmployees.length !== 1 ? 's' : ''}
                            {selectedDept !== 'All' && <span> in <strong style={{ color: '#0f172a' }}>{selectedDept}</strong></span>}
                        </div>
                    </div>

                    {/* Directory Grid */}
                    <Row gutter={[20, 20]}>
                        {filteredEmployees.map((emp, index) => {
                            const dStyle = getDeptStyle(emp.department);
                            const isHovered = hoveredEmp === index;
                            return (
                                <Col xs={12} sm={8} md={6} lg={4} key={`${emp.id}-${index}`}>
                                    <div
                                        className="dir-card"
                                        style={{
                                            '--dir-accent': `${dStyle.color}44`,
                                            '--dir-light': dStyle.light,
                                            animationDelay: `${(index % 12) * 0.04}s`,
                                        } as React.CSSProperties}
                                        onMouseEnter={() => setHoveredEmp(index)}
                                        onMouseLeave={() => setHoveredEmp(null)}
                                    >
                                        {/* Shimmer */}
                                        <div className="dir-card-shimmer" />

                                        {/* Top accent bar */}
                                        <div style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                                            background: `linear-gradient(90deg, ${dStyle.color}, ${dStyle.color}66)`,
                                            borderRadius: '20px 20px 0 0',
                                            opacity: isHovered ? 1 : 0,
                                            transition: 'opacity 0.3s ease'
                                        }} />

                                        {/* Avatar */}
                                        <div
                                            className="dir-avatar"
                                            style={{
                                                width: '72px',
                                                height: '72px',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                border: `2.5px solid ${isHovered ? dStyle.color : '#e2e8f0'}`,
                                                boxShadow: isHovered ? `0 0 0 4px ${dStyle.color}22, 0 8px 24px ${dStyle.color}22` : '0 2px 8px rgba(0,0,0,0.07)',
                                                background: `linear-gradient(135deg, ${dStyle.light}, ${dStyle.color}22)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                                flexShrink: 0,
                                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                                marginBottom: '12px',
                                            }}
                                        >
                                            <img
                                                alt={emp.name}
                                                src={emp.image || ''}
                                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: emp.image ? 'block' : 'none' }}
                                            />
                                        </div>

                                        {/* Name */}
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, display: 'block', marginBottom: '3px' }}>{emp.name}</span>

                                        {/* Role */}
                                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500, display: 'block', lineHeight: 1.4, marginBottom: '10px' }}>{emp.role}</span>

                                        {/* Dept badge */}
                                        <span
                                            className="dir-dept-badge"
                                            style={{
                                                display: 'inline-block',
                                                fontSize: '9.5px',
                                                fontWeight: 700,
                                                letterSpacing: '0.05em',
                                                color: dStyle.color,
                                                background: `${dStyle.color}18`,
                                                border: `1px solid ${dStyle.color}33`,
                                                borderRadius: '20px',
                                                padding: '2px 9px',
                                                textTransform: 'uppercase',
                                            }}
                                        >{emp.department}</span>

                                    </div>
                                </Col>
                            );
                        })}

                        {filteredEmployees.length === 0 && (
                            <Col span={24}>
                                <div className="dir-empty">
                                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
                                    <div style={{ fontWeight: 700, color: '#475569', fontSize: '16px', marginBottom: '6px' }}>No results found</div>
                                    <div style={{ color: '#94a3b8', fontSize: '13px' }}>Try adjusting your search or department filter.</div>
                                    <button onClick={() => { setSearchText(''); setSelectedDept('All'); }} style={{ marginTop: '16px', padding: '8px 20px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#ffffff', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#7c3aed' }}>
                                        Clear all filters
                                    </button>
                                </div>
                            </Col>
                        )}
                    </Row>

                    {/* Stats footer bar */}
                    <div style={{ marginTop: '64px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                        {[
                            { label: 'Total Members', value: String(filteredEmployees.length), color: '#7c3aed' },
                            { label: 'Departments', value: String(departments.length - 1), color: '#0284c7' },
                            { label: 'Avg. Tenure', value: '3+ yrs', color: '#059669' },
                        ].map((stat) => (
                            <div key={stat.label} style={{ padding: '16px 28px', borderRadius: '16px', background: '#ffffff', border: '1.5px solid #e2e8f0', textAlign: 'center', minWidth: '120px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                                <div style={{ fontSize: '22px', fontWeight: 900, color: stat.color, letterSpacing: '-0.02em' }}>{stat.value}</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </Content>
    );
}
