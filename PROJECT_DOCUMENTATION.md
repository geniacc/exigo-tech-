# Exigo Cleantech — Full Project Documentation

> A premium, production-grade corporate website for **Exigo Cleantech Private Limited**, a Product Life Cycle Management (PLM) technology platform company powering the Circular Economy in India.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Routing Architecture](#4-routing-architecture)
5. [Pages](#5-pages)
6. [Components](#6-components)
7. [Animation System](#7-animation-system)
8. [3D Engine](#8-3d-engine)
9. [Assets](#9-assets)
10. [Global Styles](#10-global-styles)
11. [Build & Dev Setup](#11-build--dev-setup)
12. [Deployment Notes](#12-deployment-notes)
13. [Key Design Decisions](#13-key-design-decisions)

---

## 1. Project Overview

**Company:** Exigo Cleantech Private Limited
**Mission:** "A Product life cycle management technology platform powering the circular economy."
**Website purpose:** Corporate marketing site + product platform showcase for two subsidiaries:

| Subsidiary | Focus Area |
|---|---|
| **QwikSELL** | Device Re-commerce — enterprise laptop/server buyback & liquidation |
| **Urja Mobility** | Battery-as-a-Service (BaaS) for EV fleet drivers |

The website is built as a **Single Page Application (SPA)** using React + Vite with **client-side routing** via React Router DOM. It features a heavy emphasis on animations (GSAP + Lenis), immersive 3D scenes (Three.js / React Three Fiber), and a premium glassmorphism/dark-mode design aesthetic.

---

## 2. Tech Stack

### Core Framework
| Technology | Version | Role |
|---|---|---|
| **React** | ^19.2.6 | UI framework |
| **TypeScript** | ~6.0.2 | Type safety |
| **Vite** | ^8.0.12 | Build tool & dev server |
| **React Router DOM** | ^7.18.0 | Client-side routing (SPA) |

### UI Library
| Technology | Version | Role |
|---|---|---|
| **Ant Design (antd)** | ^6.4.4 | Component library (Layout, Card, Button, Steps, Modal, Form, etc.) |
| **@ant-design/icons** | ^6.2.5 | Icon set |

### Animation
| Technology | Version | Role |
|---|---|---|
| **GSAP** | ^3.15.0 | Scroll-triggered animations, timeline sequences |
| **@gsap/react** | ^2.1.2 | React integration for GSAP |
| **Lenis** | ^1.3.23 | Smooth scroll inertia (replaces native scroll behavior) |

### 3D Graphics
| Technology | Version | Role |
|---|---|---|
| **Three.js** | ^0.185.1 | Core 3D rendering engine |
| **@react-three/fiber** | ^9.6.1 | React renderer for Three.js |
| **@react-three/drei** | ^10.7.7 | Three.js helpers (OrbitControls, Html, Text, Environment, etc.) |
| **@react-three/postprocessing** | ^3.0.4 | Post-process effects (Bloom, Vignette) |
| **@react-spring/three** | ^10.1.2 | Spring animations for 3D objects |
| **lamina** | ^1.2.2 | Layered materials for Three.js |

### Styling
- **Vanilla CSS** — `src/index.css` (globals) and `src/App.css` (page-level styles)
- Ant Design `ConfigProvider` for theming tokens

---

## 3. Project Structure

```
exigo-tech-/
├── index.html                    # Vite HTML entry point
├── vite.config.ts                # Vite config (base: '/')
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config
├── eslint.config.js              # ESLint configuration
│
├── public/                       # Static assets (served as-is)
│
└── src/
    ├── main.tsx                  # React app entry — mounts <App />
    ├── App.tsx                   # Root: routing, global layout, modals
    ├── App.css                   # Component-level CSS (navbar, cards, animations)
    ├── index.css                 # Global resets, fonts, utility classes
    │
    ├── assets/                   # Images: logos, team member photos, hero images
    │
    ├── pages/                    # Full-page route components
    │   ├── AboutPage.tsx         # /about — company story, team grid
    │   ├── QwikPage.tsx          # /qwiksell — device re-commerce platform
    │   ├── UrjaPage.tsx          # /urja — battery-as-a-service platform
    │   ├── CareersPage.tsx       # /careers — open positions + application form
    │   ├── ContactPage.tsx       # /contact — contact form + office info
    │   └── LaptopModel3D.tsx     # Reusable 3D laptop scene (used in QwikPage)
    │
    └── components/               # Shared/reusable components
        ├── Navbar.tsx            # Global navigation bar (smart hide/show)
        ├── Footer.tsx            # Global footer (dark, mouse parallax)
        ├── DataLifecycleEngine.tsx # Hero section — massive 3D animated scene
        ├── SmoothScroll.tsx      # Lenis smooth scroll wrapper
        ├── InvestorRelations.tsx # Investor section on Home page
        ├── BusinessCharter.tsx   # Legal charter viewer with keyword highlighting
        ├── HeroOverlay.tsx       # Decorative overlay for hero sections
        ├── ExigoCore.tsx         # Animated logo/core branding component
        ├── SpiralAnimation.tsx   # CSS/canvas spiral animation component
        ├── QwikSellVector.tsx    # Inline SVG vector for QwikSELL branding
        ├── UrjaVector.tsx        # Inline SVG vector for Urja Mobility branding
        └── ui/
            ├── demo.tsx          # Ant Design demo reference
            └── team.tsx          # Team card UI component
```

---

## 4. Routing Architecture

The app uses **React Router DOM v7** with `<BrowserRouter basename={import.meta.env.BASE_URL}>`.

| Route | Component | Description |
|---|---|---|
| `/` | `HomePageContent` (in App.tsx) | Landing page: hero, about, subsidiaries, metrics, investor relations |
| `/about` | `AboutPage` | Company story, team grid, business charter |
| `/qwiksell` | `QwikPage` | QwikSELL product platform page |
| `/urja` | `UrjaPage` | Urja Mobility BaaS platform page |
| `/careers` | `CareersPage` | Open job listings + job application modal |
| `/contact` | `ContactPage` | Contact form + office address |

### ScrollToTop Utility
A non-rendering component that listens to `pathname` changes and:
1. Instantly scrolls to top (`behavior: 'instant'`) on all scroll containers
2. Fires `ScrollTrigger.refresh()` after 50ms to re-compute GSAP scroll positions

---

## 5. Pages

### 5.1 Home Page — App.tsx / HomePageContent

Assembled directly in `App.tsx`. Sequential sections:

#### Hero: DataLifecycleEngine
- Full-viewport (`100vw × 100vh`) 3D animated scene
- See [DataLifecycleEngine](#63-datalifecycleengine) for details

#### Corporate Mission (`#about`)
- Tag: "CORPORATE MISSION"
- Headline: "Powering the Circular Economy"
- 3 glassmorphism feature cards:
  - Asset Traceability (purple glow icon)
  - Sustainable Power (blue glow icon)
  - Device Re-commerce (purple glow icon)
- GSAP: `fromTo` fade+scale on `.reveal-about` with `stagger: 0.15`

#### Subsidiary Matrix (`#subsidiary-matrix`)
- **QwikSELL card**: Interactive `<Steps>` (Diagnose → Price → Buyback → Liquidation) with "Learn More" modal trigger
- **Urja Mobility card**: Value props + "Launch Platform" CTA → `urjamobility.in`
- GSAP: Elastic slide-in from left/right on `.reveal-subsidiary-card`

#### Ecentric Metrics
- Gradient banner (purple → dark blue)
- Stat counters: 300% Operational Growth, 96% Driver Retention Matrix

#### Investor Relations (`#investors`)
- `<InvestorRelations />` component embedded here

#### QwikSELL Modal
- Ant Design `<Modal>` triggered by "Learn More"
- Explains device re-commerce division
- State: `qwiksellModalVisible` in root `<App>`

#### Back-to-Top Button
- Floating purple circular button, visible when `scrollY > 400`

---

### 5.2 About Page — pages/AboutPage.tsx

Largest page (~1,579 lines). Sections:

#### Hero Section
- Full-bleed hero image with overlay text
- GSAP scroll-triggered reveal

#### CountUp Statistics
- Custom `<CountUp>` component: `IntersectionObserver` + `requestAnimationFrame`
- Counts to target on scroll-into-view

#### Company Story / Timeline
- Narrative sections about founding and milestones

#### Business Charter
- `<BusinessCharter />` component with live search + keyword tag highlighting

#### Team Section (`#team`)
- ~30+ team members with real photos
- Live searchable by name/role (`useMemo` filter)
- Ant Design `<Row>/<Col>` responsive grid
- Members: DGMs, Sales Execs, HR, Supply Chain, Lab Associates, Credit Execs, etc.

---

### 5.3 QwikSELL Page — pages/QwikPage.tsx

Device re-commerce platform (~1,127 lines).

#### 3D Smartphone Scene
- CSS 3D `Smartphone3D` component
- Stages: `closed` → `opening` → `broken` → `scanning` → `rebuilt`
- Scan progress bar + grade labels (A/B/C/D)

#### 3D Laptop Model
- `<LaptopModel3D>` in Three.js `<Canvas>`
- Live terminal log overlays via `@react-three/drei`'s `<Html>`
- Grade status display

#### Grading Simulator
- User triggers scan stages via buttons
- `scanProgress` 0–100% tracked with `requestAnimationFrame`
- Terminal messages: "RUNNING DIAGNOSTICS...", "GRADE A CERTIFIED"

#### Fleet ROI Calculator
- `<Slider>` for device count
- Calculates estimated savings dynamically

---

### 5.4 Urja Mobility Page — pages/UrjaPage.tsx

Battery-as-a-Service platform (~445 lines).

#### Interactive Battery Swap Simulator
- `handleSwap()` drives timed message sequence:
  `"CHECKING DRIVER ID..."` → `"EJECTING DEPLETED PACK..."` → `"INSERTING CHARGED PACK..."` → `"SWAP COMPLETE — 23s"`
- Uses `setTimeout` chains

#### Impact Counters (scroll-triggered)
- Active Nodes: 12,450
- Carbon Offset: 840 tonnes CO2
- Uptime: 99%

#### Fleet ROI Calculator
- `<Slider>` for fleet size
- Displays per-month CAPEX savings

---

### 5.5 Careers Page — pages/CareersPage.tsx

Job listings + application flow (~335 lines).

#### Open Positions
- Senior Full Stack Developer (Engineering, Remote/Hybrid)
- Embedded Systems Engineer (Hardware, On-Site)
- Operations Manager (Logistics, On-Site)
- Data Scientist – Battery Analytics (Data & AI, Remote)
- B2B Sales Executive (Sales, Hybrid)

#### Application Modal
- "Apply Now" → Ant Design `<Modal>` with Form
- Fields: Name, Email, Phone, Cover Letter, Resume Upload
- `setTimeout` simulates API; shows `message.success()` on complete
- Form auto-resets after submission

---

### 5.6 Contact Page — pages/ContactPage.tsx

Contact form + office information (~201 lines).

#### Contact Form
- Fields: Full Name, Email, Subject, Message
- On submit: logs payload + shows "Secure transmission complete" toast
- Custom Ant Design theme: blue focus borders, rounded inputs, 50px button height

#### Info Cards
- Email, Phone, Address, 12-hour response SLA

---

## 6. Components

### 6.1 Navbar — components/Navbar.tsx

**Smart hide/show navbar:**
- Hides (`.nav-hidden`) when scrolling down past 50px
- Reappears (`.nav-visible`) when scrolling up
- Logo: `exigo-logo.png` with white background + padding + border-radius
- Desktop: inline nav links + "Contact Us" primary button
- Mobile: `<Drawer>` (right-side, 280px) with same links
- Deep links: `handleNavClick(path, elementId?)` — navigates then scrolls to anchor

### 6.2 Footer — components/Footer.tsx

**Interactive dark footer:**
- Background: `#090d1a`
- Mouse parallax: `onMouseMove` tracks cursor for dynamic gradient effect
- Navigation links, contact info, copyright
- Uses `useNavigate()` for SPA-compatible internal links

### 6.3 DataLifecycleEngine — components/DataLifecycleEngine.tsx

**The flagship hero component (~4,056 lines, ~195 KB).**
Full-viewport interactive 3D campus scene built with React Three Fiber.

#### 3D Scene Components
| Sub-component | Description |
|---|---|
| `PicketFence` | Modern glass-steel boundary fences |
| `ExigoBuilding` | Main corporate HQ 3D building |
| `QwikSellBuilding` | QwikSELL subsidiary building |
| `UrjaBuilding` | Urja Mobility subsidiary building |
| `AnimatedDevices` | Floating 3D laptop/device meshes |
| `DataParticles` | Particle system for data flow between buildings |
| `BatteryPacks` | 3D battery pack models |
| `SkyEnvironment` | `<Sky>` component for dynamic skybox |

#### Post-Processing
- `<EffectComposer>` with `<Bloom>` (neon glow) + `<Vignette>` (cinematic edge darkening)

#### Audio
- `playKnockSound()` — Web Audio API triangle oscillator + gain ramp on interactions
- Gracefully catches browser `AudioContext` policy blocks

#### Mobile Optimization
- `isMobileDevice` flag reduces geometry complexity, disables heavy effects

#### Brand Overlays
- Logo images as `THREE.Texture` on flat plane meshes in-scene
- Text via `@react-three/drei`'s `<Text>` and `<Html>`

---

### 6.4 SmoothScroll — components/SmoothScroll.tsx

Lenis initialization wrapper:
```ts
new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo out
  orientation: 'vertical',
  smoothWheel: true,
})
```
Drives via `requestAnimationFrame` loop. Cleans up on unmount. Wraps entire `<Layout>`.

---

### 6.5 InvestorRelations — components/InvestorRelations.tsx

- Low threshold IntersectionObserver (`0.05`) for reliable bottom-of-page triggering
- CSS `@keyframes fadeUp` animation
- `<Statistic>` cards with investor metrics
- PDF download buttons + "Contact IR Team" CTA

---

### 6.6 BusinessCharter — components/BusinessCharter.tsx

- Full legal business objective text (product lifecycle, battery chemistries, circular economy)
- Live search input with real-time text highlighting
- Clickable keyword tags (Lithium-ion, BMS, Product Lifecycle, Diagnostics, etc.)
- IntersectionObserver triggers section fade-in

---

### 6.7 LaptopModel3D — pages/LaptopModel3D.tsx

Props:
```ts
interface LaptopModel3DProps {
  stage: 'closed' | 'opening' | 'broken' | 'scanning' | 'rebuilt';
  scanProgress: number;    // 0–100
  activeGrade: string;     // 'A', 'B', 'C', 'D'
  terminalLogs?: string[];
}
```

- **Pointer tracking**: Laptop subtly follows mouse (`state.pointer.x/y`)
- **GSAP bridge**: Reads CSS custom properties (`--laptop-rx`, `--laptop-ry`, `--laptop-rz`) from `.laptop-pivot` DOM element to receive GSAP-driven rotation values inside `useFrame`
- **Lid hinge**: `THREE.MathUtils.lerp` between `Math.PI/2` (closed) and `-0.25` (open)
- **Overlays**: `<Html>` from drei for terminal logs and grade badges inside Canvas
- `<OrbitControls>` for user interaction

---

### 6.8 SpiralAnimation — components/SpiralAnimation.tsx

Decorative looping spiral/helix animation used as visual accents on page sections.

### 6.9 HeroOverlay — components/HeroOverlay.tsx

Glassmorphism overlay for hero sections (gradient masks, blur layers, particle effects).

### 6.10 ExigoCore — components/ExigoCore.tsx

Compact animated Exigo logo/wordmark with entrance transitions.

### 6.11 QwikSellVector / UrjaVector

Inline SVG brand illustrations for QwikSELL and Urja Mobility — scalable, crisp at all sizes.

---

## 7. Animation System

### Layer 1 — Lenis Smooth Scroll
Physics-based inertia scrolling with exponential ease-out decay.

### Layer 2 — GSAP + ScrollTrigger
- `gsap.fromTo()` with scroll triggers for reveal sequences
- Stagger effects (`stagger: 0.15`) for cascading entrances
- `gsap.context()` for React-safe cleanup on unmount
- `ScrollTrigger.refresh()` on route changes

### Layer 3 — IntersectionObserver (Custom Hooks)
- `useScrollReveal()` → `{ ref, isVisible }` — triggers CSS class or state changes
- `CountUp` component — starts count animation on first intersection

### Layer 4 — CSS Keyframes
- `fadeUp` on footer/investor sections
- Hover micro-animations on cards
- Navbar show/hide transitions

### Layer 5 — Three.js useFrame Physics
- Per-frame `THREE.MathUtils.lerp` for smooth pointer tracking and lid hinge
- Data particle trajectories in hero scene

### Layer 6 — requestAnimationFrame Count-Ups
- `useCountUp(end, duration)` — manual rAF loop with ease-out quadratic easing

---

## 8. 3D Engine

### DataLifecycleEngine Setup
```tsx
<Canvas shadows camera={{ position: [x, y, z], fov: 60 }}>
  <Suspense fallback={...}>
    <Environment />
    <ContactShadows />
    <SceneContent />
    <EffectComposer>
      <Bloom />
      <Vignette />
    </EffectComposer>
  </Suspense>
</Canvas>
```

### LaptopModel3D Setup
```tsx
<Canvas camera={{ position: [0, 1.5, 5], fov: 45 }}>
  <LaptopScene stage={stage} scanProgress={scanProgress} activeGrade={activeGrade} />
  <OrbitControls enableZoom={false} />
</Canvas>
```

### Material Types
- `meshStandardMaterial` — physically-based (buildings, structures)
- `meshPhysicalMaterial` — glass-like (`roughness: 0`, `transmission: 0.9`)
- `RoundedBox` — beveled box primitives (fence posts, walls)
- `THREE.Texture` — logo image overlays on flat planes

---

## 9. Assets

All in `src/assets/`. Imported as ES module URLs (Vite handles transformation).

### Logos
| File | Usage |
|---|---|
| `exigo-logo.png` | Navbar, Footer, 3D scene |
| `quik-logo.png` | QwikSELL cards, 3D scene |
| `urja-logo.png` | Urja cards, 3D scene |

### Hero Images
| File | Usage |
|---|---|
| `abouthero.png` | About page hero |
| `hero 4.png` | Alternative hero |
| `city_skyline.png` | Background layer |
| `homepage_fold7.png` | Home section background |
| `battery_solution_fold1_silde2.png` | Urja page illustration |
| `AboutExigoRecycling.png` | About page recycling visual |

### Team Photos (~30 members)
Named as `FirstName LastName - Role.ext`. Used in About page team grid.

---

## 10. Global Styles

### src/index.css
- CSS variable color tokens
- Google Fonts: **Outfit** + **Inter**
- Body reset: `margin: 0`, `box-sizing: border-box`
- Utility: `.desktop-only`, `.mobile-only`

### src/App.css
Key classes:

| Class | Description |
|---|---|
| `.smart-animated-navbar` | Sticky header with `backdrop-filter: blur` |
| `.nav-visible / .nav-hidden` | Scroll-based navbar transitions |
| `.premium-feature-showcase-card` | Glassmorphism card base |
| `.premium-corporate-card` | Elevated corporate card variant |
| `.mesh-gradient-section` | Animated mesh gradient background |
| `.icon-wrapper .purple-glow .blue-glow` | Icon containers with colored box-shadows |
| `.stat-counters-box` | Metric display boxes |
| `.back-to-top-floating` | Floating scroll-to-top button |
| `.reveal-about .reveal-subsidiary-card .reveal-stat-box` | GSAP animation targets |

### Ant Design Theme (ConfigProvider)
```ts
token: {
  colorPrimary: '#6b21a8',   // Purple
  colorInfo: '#1e3a8a',      // Dark Blue
  borderRadius: 16,
  fontFamily: 'Outfit, Inter, sans-serif',
}
```

---

## 11. Build & Dev Setup

### Prerequisites
- Node.js >= 18
- npm >= 9

### Commands
```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

Build runs `tsc -b` (TypeScript check) then `vite build`. Output is hashed for cache-busting.

---

## 12. Deployment Notes

- **Vite base**: `'/'` in `vite.config.ts` (changed from `'/exigo-tech-/'` for custom domain)
- **SPA Routing**: Server must redirect all paths to `index.html`. On GitHub Pages this needs a `404.html` redirect hack or custom domain config
- **GitHub Actions**: `.github/` directory exists — CI/CD workflow likely configured for automated builds/deployment
- **Static assets**: All images bundled and content-hashed by Vite in production

---

## 13. Key Design Decisions

| Decision | Rationale |
|---|---|
| **Ant Design** for UI | Saves time on form validation, modal, steps, layout — consistent corporate look |
| **GSAP** for scroll animations | Industry-standard scroll animation; ScrollTrigger is unmatched for performance |
| **Lenis** for smooth scroll | Polished Apple-like inertia without complex custom implementation |
| **React Three Fiber** for 3D | Idiomatic React API over Three.js; easy composition of 3D scene graph |
| **IntersectionObserver hooks** | Lightweight alternative to full GSAP for simple count-up and reveal needs |
| **CSS variables as GSAP→Three.js bridge** | Lets GSAP timelines drive `useFrame` values without tight coupling |
| **Vite** as build tool | Fastest HMR in class, native ESM, optimized production output |
| **TypeScript** | Type safety across complex state, props, and Three.js types |

---

*Generated: 2026-07-15 | Project: Exigo Cleantech Corporate Website | Version: 0.0.0*
