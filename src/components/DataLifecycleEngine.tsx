import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Environment, ContactShadows, Text, Sky } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import gsap from 'gsap';
import * as THREE from 'three';

// Brand Logo Assets
import urjaLogo from '../assets/urja-logo.png';
import qwikLogo from '../assets/quik-logo.png';
import exigoLogo from '../assets/exigo-logo.png';

const isMobileDevice = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

// ========================================================
// REAL AUDIO SYNTH THUD GENERATOR (Web Audio API)
// ========================================================

const playKnockSound = () => {
    try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        const triggerKnock = (delay: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, ctx.currentTime + delay);
            osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + delay + 0.14);

            gain.gain.setValueAtTime(0.7, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.14);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.14);
        };

        triggerKnock(0.0);
        triggerKnock(0.22);
    } catch (err) {
        console.warn('Audio context blocked by browser policy:', err);
    }
};

// ========================================================
// 1. OUTSIDE PICKET FENCE & WALKWAY COMPONENTS
// ========================================================

const PicketFence = () => {
    return (
        <group position={[0, 0, 7.0]}>
            {/* Modern glass-steel boundary fences */}
            <RoundedBox position={[-4.5, 0.4, 0]} args={[5.0, 0.8, 0.06]} radius={0.015} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
            </RoundedBox>
            <RoundedBox position={[4.5, 0.4, 0]} args={[5.0, 0.8, 0.06]} radius={0.015} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
            </RoundedBox>

            {/* Concrete walk path to door */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, -1.75]} receiveShadow>
                <planeGeometry args={[2.0, 3.5]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.85} />
            </mesh>

            {/* Premium Slate Curb Borders for the Entry Walkway */}
            <RoundedBox position={[-1.03, 0.03, -1.75]} args={[0.06, 0.06, 3.5]} radius={0.01} smoothness={2} castShadow receiveShadow>
                <meshStandardMaterial color="#475569" roughness={0.7} />
            </RoundedBox>
            <RoundedBox position={[1.03, 0.03, -1.75]} args={[0.06, 0.06, 3.5]} radius={0.01} smoothness={2} castShadow receiveShadow>
                <meshStandardMaterial color="#475569" roughness={0.7} />
            </RoundedBox>

            {/* Modern Geometric Manicured Hedgerows along the fence line */}
            {[-6.5, -5.5, -4.5, -3.5, 3.5, 4.5, 5.5, 6.5].map((x, i) => (
                <RoundedBox key={i} position={[x, 0.2, -0.2]} args={[0.8, 0.4, 0.4]} radius={0.05} smoothness={3} castShadow receiveShadow>
                    <meshStandardMaterial color="#15803d" roughness={0.9} />
                </RoundedBox>
            ))}
        </group>
    );
};

export const EXIGO_STEPS = [
    { title: 'Eco Foundations', desc: 'Sustainable asset lifecycle management.' },
    { title: 'Green Technology', desc: 'Optimizing material recovery with low carbon footprint.' },
    { title: 'Circular Economy', desc: 'Closing the loop for commercial energy systems.' },
    { title: 'Compliance & Safety', desc: 'Meeting global environmental tier-1 standards.' },
    { title: 'Future Scale', desc: 'Expanding clean-tech infrastructure globally.' }
];

interface PavementPathProps {
    activeCard: number;
    onSlabClick: (idx: number) => void;
}

export const ExigoPavementPath: React.FC<PavementPathProps> = ({ activeCard, onSlabClick }) => {
    const totalSteps = EXIGO_STEPS.length;
    const startZ = 13.2;
    const endZ = 7.6;

    return (
        <group position={[0, 0.016, 0]}>
            {EXIGO_STEPS.map((_, index) => {
                const zPos = startZ - (index * (startZ - endZ) / (totalSteps - 1));
                const isActive = index === activeCard;

                return (
                    <IndividualPavementSlab
                        key={index}
                        index={index}
                        isActive={isActive}
                        position={[0, 0, zPos]}
                        onClick={() => onSlabClick(index)}
                    />
                );
            })}
        </group>
    );
};

interface SlabProps {
    index: number;
    isActive: boolean;
    position: [number, number, number];
    onClick: () => void;
}

const IndividualPavementSlab: React.FC<SlabProps> = ({ index, isActive, position, onClick }) => {
    const slabRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (!slabRef.current) return;

        const targetY = isActive ? 0.08 : 0.0;
        const targetScale = isActive ? 1.04 : 1.0;

        slabRef.current.position.y = THREE.MathUtils.lerp(slabRef.current.position.y, targetY, delta * 6);
        slabRef.current.scale.setScalar(
            THREE.MathUtils.lerp(slabRef.current.scale.x, targetScale, delta * 6)
        );
    });

    return (
        <group ref={slabRef} position={position}>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
                castShadow
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                    document.body.style.cursor = 'default';
                }}
            >
                <planeGeometry args={[2.5, 0.75]} />
                <meshStandardMaterial
                    color={isActive ? '#4b5563' : '#9ca3af'}
                    roughness={0.8}
                    metalness={isActive ? 0.3 : 0.0}
                    emissive={isActive ? '#374151' : '#000000'}
                    emissiveIntensity={isActive ? 0.5 : 0}
                />
            </mesh>
        </group>
    );
};

interface MainGateProps {
    isOpen: boolean;
    onClick: () => void;
    urjaTex: THREE.Texture | null;
    urjaAspect: number;
    qwikTex: THREE.Texture | null;
    qwikAspect: number;
}

const MainGate: React.FC<MainGateProps> = ({ isOpen, onClick, urjaTex, urjaAspect, qwikTex, qwikAspect }) => {
    const leftGateRef = useRef<THREE.Group>(null);
    const rightGateRef = useRef<THREE.Group>(null);

    useEffect(() => {
        gsap.to(leftGateRef.current!.rotation, {
            y: isOpen ? -1.5 : 0,
            duration: 1.6,
            ease: 'power2.inOut'
        });
        gsap.to(rightGateRef.current!.rotation, {
            y: isOpen ? 1.5 : 0,
            duration: 1.6,
            ease: 'power2.inOut'
        });
    }, [isOpen]);

    return (
        <group position={[0, 0, 7.0]}>
            {/* Concrete Gate Pillars */}
            <RoundedBox position={[-2.0, 0.65, 0]} args={[0.3, 1.3, 0.3]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
            </RoundedBox>

            {/* Left Gate Panel - pivot at pillar hinge */}
            <group ref={leftGateRef} position={[-2.0, 0.5, 0]}>
                <mesh onClick={onClick} position={[0.98, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1.96, 0.9, 0.05]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.15} />
                </mesh>
                {/* Architectural Vertical Gate Bars */}
                {[-0.8, -0.5, -0.2, 0.1, 0.4, 0.7].map((armX, idx) => (
                    <mesh key={idx} position={[0.98 + armX, 0, 0.01]} castShadow>
                        <boxGeometry args={[0.02, 0.86, 0.055]} />
                        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
                    </mesh>
                ))}
                {urjaTex && (
                    <mesh position={[0.98, 0, 0.04]} scale={0.45} onClick={onClick}>
                        <planeGeometry args={[urjaAspect, 1]} />
                        <meshBasicMaterial map={urjaTex} transparent side={THREE.DoubleSide} depthWrite={false} />
                    </mesh>
                )}
            </group>

            <RoundedBox position={[2.0, 0.65, 0]} args={[0.3, 1.3, 0.3]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
            </RoundedBox>

            {/* Right Gate Panel - pivot at pillar hinge */}
            <group ref={rightGateRef} position={[2.0, 0.5, 0]}>
                <mesh onClick={onClick} position={[-0.98, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1.96, 0.9, 0.05]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.15} />
                </mesh>
                {/* Architectural Vertical Gate Bars */}
                {[-0.7, -0.4, -0.1, 0.2, 0.5, 0.8].map((armX, idx) => (
                    <mesh key={idx} position={[-0.98 + armX, 0, 0.01]} castShadow>
                        <boxGeometry args={[0.02, 0.86, 0.055]} />
                        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
                    </mesh>
                ))}
                {qwikTex && (
                    <mesh position={[-0.98, 0, 0.04]} scale={0.45} onClick={onClick}>
                        <planeGeometry args={[qwikAspect, 1]} />
                        <meshBasicMaterial map={qwikTex} transparent side={THREE.DoubleSide} depthWrite={false} />
                    </mesh>
                )}
            </group>
        </group>
    );
};

// ========================================================
// 2. INTERACTIVE INFINITY POOL COMPONENT (Shifted Left)
// ========================================================

const InfinityPool = () => {
    const { gl } = useThree();
    const size = 256;

    const targets = useMemo(() => {
        const tA = new THREE.WebGLRenderTarget(size, size, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.HalfFloatType
        });
        const tB = tA.clone();
        return { tA, tB };
    }, []);

    useEffect(() => {
        return () => {
            targets.tA.dispose();
            targets.tB.dispose();
        };
    }, [targets]);

    const simScene = useMemo(() => new THREE.Scene(), []);
    const simCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

    const simMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D uCurrentBuffer;
                uniform vec2 uTexelSize;
                uniform vec2 uMouse;
                uniform float uMouseActive;
                uniform float uDamping;
                varying vec2 vUv;

                void main() {
                    float left   = texture2D(uCurrentBuffer, vUv + vec2(-uTexelSize.x, 0.0)).r;
                    float right  = texture2D(uCurrentBuffer, vUv + vec2(uTexelSize.x, 0.0)).r;
                    float top    = texture2D(uCurrentBuffer, vUv + vec2(0.0, uTexelSize.y)).r;
                    float bottom = texture2D(uCurrentBuffer, vUv + vec2(0.0, -uTexelSize.y)).r;
                    
                    vec2 currentSample = texture2D(uCurrentBuffer, vUv).rg;
                    float H_t = currentSample.r;
                    float H_t_minus_1 = currentSample.g;
                    
                    float H_new = (left + right + top + bottom) * 0.5 - H_t_minus_1;
                    H_new *= uDamping;
                    
                    if (uMouseActive > 0.5) {
                        float dist = distance(vUv, uMouse);
                        if (dist < 0.07) {
                            float factor = 1.0 - (dist / 0.07);
                            H_new += factor * factor * 0.15;
                        }
                    }
                    
                    gl_FragColor = vec4(H_new, H_t, 0.0, 1.0);
                }
            `,
            uniforms: {
                uCurrentBuffer: { value: null },
                uTexelSize: { value: new THREE.Vector2(1 / size, 1 / size) },
                uMouse: { value: new THREE.Vector2(-1, -1) },
                uMouseActive: { value: 0 },
                uDamping: { value: 0.98 }
            },
            depthWrite: false,
            depthTest: false
        });
    }, []);

    useEffect(() => {
        const geom = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geom, simMaterial);
        simScene.add(mesh);
        return () => {
            simScene.remove(mesh);
            geom.dispose();
        };
    }, [simScene, simMaterial]);

    const displayMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tHeightMap;
                uniform vec2 uTexelSize;
                varying vec2 vUv;

                void main() {
                    float left   = texture2D(tHeightMap, vUv + vec2(-uTexelSize.x, 0.0)).r;
                    float right  = texture2D(tHeightMap, vUv + vec2(uTexelSize.x, 0.0)).r;
                    float top    = texture2D(tHeightMap, vUv + vec2(0.0, uTexelSize.y)).r;
                    float bottom = texture2D(tHeightMap, vUv + vec2(0.0, -uTexelSize.y)).r;
                    
                    vec2 normalOffset = vec2(left - right, bottom - top) * 0.45;
                    vec3 N = normalize(vec3(normalOffset.x * 15.0, normalOffset.y * 15.0, 1.0));
                    
                    vec3 V = vec3(0.0, 0.0, 1.0);
                    vec3 R = reflect(-V, N);
                    
                    vec3 waterColor = mix(vec3(0.06, 0.5, 0.68), vec3(0.18, 0.8, 0.95), smoothstep(-0.3, 0.5, R.y));
                    
                    float gridX = step(0.02, fract(vUv.x * 40.0 + normalOffset.x * 1.5));
                    float gridY = step(0.02, fract(vUv.y * 40.0 + normalOffset.y * 1.5));
                    float tiles = gridX * gridY;
                    vec3 tileColor = mix(vec3(0.72, 0.88, 1.0), vec3(0.9, 0.96, 1.0), tiles);
                    
                    vec3 color = mix(tileColor * waterColor, vec3(1.0), 0.12 + 0.35 * pow(1.0 - max(dot(N, V), 0.0), 3.0));
                    
                    float spec = pow(max(dot(N, normalize(vec3(0.3, 0.8, 0.5))), 0.0), 256.0) * 2.0;
                    gl_FragColor = vec4(color + vec3(spec), 1.0);
                }
            `,
            uniforms: {
                tHeightMap: { value: null },
                uTexelSize: { value: new THREE.Vector2(1 / size, 1 / size) }
            }
        });
    }, []);

    const mouseUV = useRef(new THREE.Vector2(-1, -1));
    const mouseActive = useRef(false);

    useFrame(() => {
        if (isMobileDevice) return;

        if (mouseActive.current) {
            simMaterial.uniforms.uMouse.value.copy(mouseUV.current);
            simMaterial.uniforms.uMouseActive.value = 1.0;
        } else {
            simMaterial.uniforms.uMouseActive.value = 0.0;
        }

        const currentInputTexture = targets.tA.texture;
        const currentOutputTarget = targets.tB;

        simMaterial.uniforms.uCurrentBuffer.value = currentInputTexture;
        gl.setRenderTarget(currentOutputTarget);
        gl.render(simScene, simCamera);
        gl.setRenderTarget(null);

        const temp = targets.tA;
        targets.tA = targets.tB;
        targets.tB = temp;

        displayMaterial.uniforms.tHeightMap.value = targets.tA.texture;
    });

    return (
        <group position={[3.5, 0.05, 5.25]}>
            {/* Concrete Pool Border */}
            <mesh position={[0, -0.04, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.7, 0.08, 3.4]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
            </mesh>
            {/* Simulation plane */}
            {isMobileDevice ? (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[2.5, 3.2]} />
                    <meshStandardMaterial color="#38bdf8" roughness={0.15} metalness={0.9} transparent opacity={0.65} />
                </mesh>
            ) : (
                <mesh
                    rotation={[-Math.PI / 2, 0, 0]}
                    onPointerMove={(e) => {
                        if (e.uv) {
                            mouseUV.current.copy(e.uv);
                            mouseActive.current = true;
                        }
                    }}
                    onPointerOut={() => {
                        mouseActive.current = false;
                    }}
                >
                    <planeGeometry args={[2.5, 3.2]} />
                    <primitive object={displayMaterial} attach="material" />
                </mesh>
            )}
        </group>
    );
};

// ========================================================
// 3. VILLA FRAME (Modern structural rounded design)
// ========================================================

const VillaFrame = () => {
    return (
        <group>
            {/* floors */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0.5]} receiveShadow>
                <planeGeometry args={[4.0, 9.0]} />
                <meshStandardMaterial color="#451a03" roughness={0.35} metalness={0.1} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.5, -0.01, -1.0]} receiveShadow>
                <planeGeometry args={[5.0, 5.0]} />
                <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.5, -0.01, -1.0]} receiveShadow>
                <planeGeometry args={[5.0, 5.0]} />
                <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>

            {/* Beveled Concrete Walls */}
            <RoundedBox position={[-7.0, 1.1, -1.0]} args={[0.12, 2.2, 5.0]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>
            <RoundedBox position={[7.0, 1.1, -1.0]} args={[0.12, 2.2, 5.0]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>

            {/* Left chamber walls */}
            <RoundedBox position={[-4.5, 1.1, -3.5]} args={[5.0, 2.2, 0.12]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>
            {/* Left chamber front wall (Segmented to cut out opening for visual garage door at X=-5.0) */}
            <RoundedBox position={[-6.15, 1.1, 1.5]} args={[1.7, 2.2, 0.12]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>
            <RoundedBox position={[-3.35, 1.1, 1.5]} args={[2.7, 2.2, 0.12]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>
            <RoundedBox position={[-5.0, 1.55, 1.5]} args={[0.6, 1.3, 0.12]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>

            {/* Right chamber walls */}
            <RoundedBox position={[4.5, 1.1, -3.5]} args={[5.0, 2.2, 0.12]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>
            {/* Right chamber front wall (Segmented & replaced with premium translucent sliding glass doors) */}
            <RoundedBox position={[2.15, 1.1, 1.5]} args={[0.3, 2.2, 0.12]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>
            <RoundedBox position={[6.85, 1.1, 1.5]} args={[0.3, 2.2, 0.12]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>
            <RoundedBox position={[4.5, 2.15, 1.5]} args={[4.4, 0.1, 0.12]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>

            {/* Glass Sliding Door Assembly */}
            <group position={[4.5, 1.05, 1.5]}>
                {/* Structural Outer Frame (Hollowed out using separate edge beams) */}
                {/* Top border */}
                <RoundedBox position={[0, 1.025, 0]} args={[4.4, 0.05, 0.08]} radius={0.005} smoothness={2}>
                    <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </RoundedBox>
                {/* Bottom border */}
                <RoundedBox position={[0, -1.025, 0]} args={[4.4, 0.05, 0.08]} radius={0.005} smoothness={2}>
                    <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </RoundedBox>
                {/* Left border */}
                <RoundedBox position={[-2.175, 0, 0]} args={[0.05, 2.1, 0.08]} radius={0.005} smoothness={2}>
                    <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </RoundedBox>
                {/* Right border */}
                <RoundedBox position={[2.175, 0, 0]} args={[0.05, 2.1, 0.08]} radius={0.005} smoothness={2}>
                    <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </RoundedBox>
                {/* Center mullion vertical divider */}
                <RoundedBox position={[0, 0, 0]} args={[0.05, 2.1, 0.08]} radius={0.005} smoothness={2}>
                    <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </RoundedBox>

                {/* Translucent Sliding Glass Panels (Using bulletproof standard materials for device compatibility) */}
                <RoundedBox position={[-1.05, 0, 0.01]} args={[2.1, 1.95, 0.02]} radius={0.005}>
                    <meshStandardMaterial transparent opacity={0.4} color="#00f5ff" roughness={0.1} metalness={0.1} />
                </RoundedBox>
                <RoundedBox position={[1.05, 0, -0.01]} args={[2.1, 1.95, 0.02]} radius={0.005}>
                    <meshStandardMaterial transparent opacity={0.4} color="#00f5ff" roughness={0.1} metalness={0.1} />
                </RoundedBox>
            </group>

            {/* Main lobby back wall */}
            <RoundedBox position={[0, 1.1, -3.5]} args={[4.0, 2.2, 0.12]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>

            {/* Corridor lobby side walls */}
            <RoundedBox position={[-2.0, 1.1, 2.5]} args={[0.12, 2.2, 4.0]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>
            <RoundedBox position={[2.0, 1.1, 2.5]} args={[0.12, 2.2, 4.0]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>

            {/* Inner hallway splits */}
            <RoundedBox position={[-2.0, 1.1, -2.5]} args={[0.12, 2.2, 2.0]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>
            <RoundedBox position={[2.0, 1.1, -2.5]} args={[0.12, 2.2, 2.0]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>
            <RoundedBox position={[-2.0, 1.1, 0.1]} args={[0.12, 2.2, 0.8]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>
            <RoundedBox position={[2.0, 1.1, 0.1]} args={[0.12, 2.2, 0.8]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>

            {/* Front portal entrance wall split */}
            <RoundedBox position={[-1.5, 1.1, 3.5]} args={[1.0, 2.2, 0.12]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>
            <RoundedBox position={[1.5, 1.1, 3.5]} args={[1.0, 2.2, 0.12]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>
            <RoundedBox position={[0, 2.15, 3.5]} args={[2.0, 0.1, 0.12]} radius={0.01} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </RoundedBox>

            {/* Concrete columns */}
            <mesh position={[-2.0, 1.1, 5.0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.08, 0.08, 2.2, 16]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
            </mesh>
            <mesh position={[2.0, 1.1, 5.0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.08, 0.08, 2.2, 16]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
            </mesh>

            {/* Flat Cantilever Roof slabs */}
            <RoundedBox position={[0, 2.24, 0.5]} args={[4.2, 0.08, 9.2]} radius={0.015} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </RoundedBox>
            <RoundedBox position={[-4.5, 2.24, -1.0]} args={[5.2, 0.08, 5.2]} radius={0.015} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </RoundedBox>
            <RoundedBox position={[4.5, 2.24, -1.0]} args={[5.2, 0.08, 5.2]} radius={0.015} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </RoundedBox>
            <RoundedBox position={[0, 2.24, 5.2]} args={[4.2, 0.08, 1.5]} radius={0.015} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </RoundedBox>
        </group>
    );
};

// ========================================================
// SECOND STORY ARCHITECTURAL UPGRADE (Cantilever & Rails)
// ========================================================

const SecondFloor = () => {
    return (
        <group position={[0, 2.24, 0.5]}>
            {/* Upper Room main concrete block (Left side cantilever) */}
            <RoundedBox position={[-2.2, 1.1, -1.5]} args={[2.4, 2.2, 4.5]} radius={0.025} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#f8fafc" roughness={0.85} />
            </RoundedBox>

            {/* Upper Room front panoramic window - lowered to create blank space above */}
            <RoundedBox position={[-2.2, 0.8, 0.76]} args={[2.0, 1.2, 0.05]} radius={0.01} smoothness={3} castShadow>
                <meshPhysicalMaterial transmission={0.92} roughness={0.08} ior={1.5} thickness={0.4} color="#e0f2fe" transparent />
            </RoundedBox>

            {/* Balcony Luxury Glass Sliding Doors & Dark Framing */}
            <group position={[-1.02, 1.1, -1.5]} rotation={[0, Math.PI / 2, 0]}>
                {/* Structural Frame */}
                <RoundedBox position={[0, 0, 0]} args={[4.5, 2.1, 0.08]} radius={0.01} smoothness={2}>
                    <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </RoundedBox>
                {/* Glass Window Inserts */}
                <RoundedBox position={[-1.1, 0, 0.01]} args={[2.1, 1.95, 0.02]} radius={0.005}>
                    <meshPhysicalMaterial transmission={0.9} transparent opacity={0.6} color="#e0f2fe" roughness={0.1} />
                </RoundedBox>
                <RoundedBox position={[1.1, 0, -0.01]} args={[2.1, 1.95, 0.02]} radius={0.005}>
                    <meshPhysicalMaterial transmission={0.9} transparent opacity={0.6} color="#e0f2fe" roughness={0.1} />
                </RoundedBox>
            </group>

            {/* Balcony deck slab on the right side */}
            <RoundedBox position={[2.1, 0.04, -1.0]} args={[2.0, 0.08, 5.5]} radius={0.015} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
            </RoundedBox>

            {/* Glass balcony railings */}
            {/* Front rail */}
            <RoundedBox position={[2.1, 0.5, 1.7]} args={[2.0, 0.9, 0.04]} radius={0.01} smoothness={3} castShadow>
                <meshPhysicalMaterial transmission={0.95} roughness={0.05} ior={1.5} thickness={0.3} color="#bae6fd" transparent />
            </RoundedBox>
            {/* Side rail */}
            <RoundedBox position={[3.08, 0.5, -1.0]} args={[0.04, 0.9, 5.4]} radius={0.01} smoothness={3} castShadow>
                <meshPhysicalMaterial transmission={0.95} roughness={0.05} ior={1.5} thickness={0.3} color="#bae6fd" transparent />
            </RoundedBox>

            {/* Upper cantilever flat roof */}
            <RoundedBox position={[0, 2.24, -1.0]} args={[6.5, 0.08, 6.0]} radius={0.015} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </RoundedBox>
        </group>
    );
};

// ========================================================
// OUTDOOR LANDSCAPING AND SCONCES DETALLING
// ========================================================

const PlanterBox = ({ position }: { position: [number, number, number] }) => {
    const foliageRef = useRef<THREE.Group>(null);
    const frameCount = useRef(0);

    useFrame((state) => {
        if (isMobileDevice) {
            frameCount.current++;
            if (frameCount.current % 4 !== 0) return;
        }
        if (foliageRef.current) {
            foliageRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.04;
            foliageRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 1.5) * 0.02;
        }
    });

    return (
        <group position={position}>
            {/* Stone Planter Pot */}
            <RoundedBox args={[0.55, 0.4, 0.55]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#64748b" roughness={0.8} />
            </RoundedBox>
            {/* Foliage leaves spheres */}
            <group ref={foliageRef}>
                <mesh position={[0, 0.28, 0]} castShadow>
                    <sphereGeometry args={[0.26, 12, 12]} />
                    <meshStandardMaterial color="#16a34a" roughness={0.9} />
                </mesh>
                <mesh position={[0.08, 0.4, -0.06]} castShadow>
                    <sphereGeometry args={[0.2, 10, 10]} />
                    <meshStandardMaterial color="#15803d" roughness={0.9} />
                </mesh>
            </group>
        </group>
    );
};

const OutdoorLights = () => {
    const light1 = useRef<THREE.SpotLight>(null);
    const light2 = useRef<THREE.SpotLight>(null);
    const fixture1 = useRef<THREE.Mesh>(null);
    const fixture2 = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const time = state.clock.elapsedTime * 0.5;
        const color = new THREE.Color().setHSL(time % 1.0, 0.85, 0.65);

        if (light1.current) light1.current.color.copy(color);
        if (light2.current) light2.current.color.copy(color);

        if (fixture1.current) {
            const mat = fixture1.current.material as THREE.MeshStandardMaterial;
            mat.emissive.copy(color);
        }
        if (fixture2.current) {
            const mat = fixture2.current.material as THREE.MeshStandardMaterial;
            mat.emissive.copy(color);
        }
    });

    return (
        <group>
            {/* Left Column Sconce */}
            <group position={[-2.0, 1.6, 5.0]}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </mesh>
                <mesh position={[0, -0.07, 0]} ref={fixture1}>
                    <sphereGeometry args={[0.035, 8, 8]} />
                    <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
                </mesh>
                <spotLight
                    ref={light1}
                    position={[0, -0.08, 0]}
                    angle={0.65}
                    penumbra={0.5}
                    intensity={6.0}
                    distance={3.5}
                    castShadow
                />
            </group>

            {/* Right Column Sconce */}
            <group position={[2.0, 1.6, 5.0]}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </mesh>
                <mesh position={[0, -0.07, 0]} ref={fixture2}>
                    <sphereGeometry args={[0.035, 8, 8]} />
                    <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
                </mesh>
                <spotLight
                    ref={light2}
                    position={[0, -0.08, 0]}
                    angle={0.65}
                    penumbra={0.5}
                    intensity={6.0}
                    distance={3.5}
                    castShadow
                />
            </group>
        </group>
    );
};

const Fireflies = () => {
    const count = 12;
    const meshRef = useRef<THREE.Group>(null);

    const particles = useMemo(() => {
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push({
                x: (Math.random() - 0.5) * 8.0,
                y: 0.2 + Math.random() * 1.5,
                z: 3.5 + Math.random() * 4.0,
                speed: 0.2 + Math.random() * 0.3,
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.65),
                phase: Math.random() * Math.PI * 2
            });
        }
        return data;
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.elapsedTime;

        meshRef.current.children.forEach((child, i) => {
            const p = particles[i];
            child.position.x = p.x + Math.sin(time * p.speed + p.phase) * 0.4;
            child.position.y = p.y + Math.cos(time * p.speed * 1.5 + p.phase) * 0.25;
            child.position.z = p.z + Math.sin(time * p.speed * 0.8 + p.phase) * 0.3;

            const scale = (Math.sin(time * 3 + p.phase) * 0.2 + 0.8) * 0.08;
            child.scale.set(scale, scale, scale);
        });
    });

    return (
        <group ref={meshRef}>
            {particles.map((p, i) => (
                <mesh key={i} position={[p.x, p.y, p.z]}>
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshBasicMaterial color={p.color} transparent opacity={0.8} depthWrite={false} />
                </mesh>
            ))}
        </group>
    );
};

const Tree = ({ position }: { position: [number, number, number] }) => {
    const foliageRef = useRef<THREE.Group>(null);
    const frameCount = useRef(0);
    useFrame((state) => {
        if (isMobileDevice) {
            frameCount.current++;
            if (frameCount.current % 4 !== 0) return; // animate at 15fps on mobile
        }
        if (foliageRef.current) {
            foliageRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
        }
    });

    return (
        <group position={position}>
            {/* Trunk */}
            <mesh castShadow receiveShadow position={[0, 1.25, 0]}>
                <cylinderGeometry args={[0.15, 0.22, 2.5, 8]} />
                <meshStandardMaterial color="#78350f" roughness={0.9} />
            </mesh>
            {/* Leaves */}
            <group ref={foliageRef} position={[0, 2.6, 0]}>
                <mesh castShadow>
                    <sphereGeometry args={[0.75, 8, 8]} />
                    <meshStandardMaterial color="#166534" roughness={0.85} />
                </mesh>
                <mesh position={[0.2, 0.5, -0.1]} castShadow>
                    <sphereGeometry args={[0.58, 8, 8]} />
                    <meshStandardMaterial color="#15803d" roughness={0.85} />
                </mesh>
                <mesh position={[-0.2, 0.4, 0.2]} castShadow>
                    <sphereGeometry args={[0.52, 8, 8]} />
                    <meshStandardMaterial color="#166534" roughness={0.85} />
                </mesh>
            </group>
        </group>
    );
};

const Clouds = () => {
    const cloudGroupRef = useRef<THREE.Group>(null);
    const frameCount = useRef(0);

    useFrame(() => {
        frameCount.current++;
        // On mobile: update clouds every 6 frames (~10fps); on desktop every 2 frames (~30fps)
        const skip = isMobileDevice ? 6 : 2;
        if (frameCount.current % skip !== 0) return;
        if (cloudGroupRef.current) {
            cloudGroupRef.current.children.forEach((child) => {
                child.position.x += 0.008 * skip;
                if (child.position.x > 30) {
                    child.position.x = -30;
                }
            });
        }
    });

    return (
        <group ref={cloudGroupRef}>
            {/* Cloud Cluster 1 */}
            <group position={[-15, 8, -12]}>
                <mesh><sphereGeometry args={[2.5, 8, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8} /></mesh>
                <mesh position={[1.8, -0.4, 0]}><sphereGeometry args={[1.8, 8, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8} /></mesh>
                <mesh position={[-1.8, -0.4, 0.2]}><sphereGeometry args={[1.8, 8, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8} /></mesh>
            </group>
            {/* Cloud Cluster 2 */}
            <group position={[12, 9, -15]}>
                <mesh><sphereGeometry args={[3.0, 8, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.75} /></mesh>
                <mesh position={[2.2, -0.5, -0.2]}><sphereGeometry args={[2.2, 8, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.75} /></mesh>
                <mesh position={[-2.2, -0.3, 0.3]}><sphereGeometry args={[2.0, 8, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.75} /></mesh>
            </group>
            {/* Cloud Cluster 3 */}
            <group position={[-2, 10, -18]}>
                <mesh><sphereGeometry args={[2.0, 8, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85} /></mesh>
                <mesh position={[1.4, -0.3, 0.1]}><sphereGeometry args={[1.5, 8, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85} /></mesh>
                <mesh position={[-1.4, -0.2, -0.1]}><sphereGeometry args={[1.4, 8, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85} /></mesh>
            </group>
        </group>
    );
};

const EVChargingArea = () => {
    const electronRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (electronRef.current) {
            const t = (state.clock.elapsedTime * 0.8) % 1.0;
            const x = -2.2 - (2.85 - 2.2) * t;
            const z = 3.5 + (4.15 - 3.5) * t;
            const y = 0.65 + (0.32 - 0.65) * t - Math.sin(t * Math.PI) * 0.12;
            electronRef.current.position.set(x, y, z);
        }
    });

    return (
        <group>
            {/* 1. Sleek EV Charger Pillar */}
            <group position={[-2.2, 0, 3.5]}>
                {/* Pillar base */}
                <RoundedBox position={[0, 0.5, 0]} args={[0.2, 1.0, 0.2]} radius={0.015} smoothness={3} castShadow receiveShadow>
                    <meshStandardMaterial color="#334155" roughness={0.7} />
                </RoundedBox>
                {/* Glowing LED status screen */}
                <mesh position={[0, 0.75, 0.105]}>
                    <planeGeometry args={[0.12, 0.16]} />
                    <meshBasicMaterial color="#10b981" />
                </mesh>
                {/* Charger status text label */}
                <Suspense fallback={null}>
                    <Text
                        position={[0, 0.9, 0.11]}
                        fontSize={0.06}
                        color="#10b981"
                        anchorX="center"
                        anchorY="middle"
                    >
                        EV
                    </Text>
                </Suspense>
            </group>

            {/* 2. Stylized Charging Cable */}
            <mesh position={[-2.525, 0.38, 3.825]} rotation={[0.4, 0.7, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.9, 6]} />
                <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>

            {/* 3. Glowing animated charging electron */}
            <mesh ref={electronRef}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshBasicMaterial color="#34d399" />
            </mesh>

            {/* 4. Parking Paver Tile under TukTuk */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.2, 0.01, 4.5]} receiveShadow>
                <planeGeometry args={[1.6, 2.4]} />
                <meshStandardMaterial color="#475569" roughness={0.8} />
            </mesh>

            {/* 5. Electric TukTuk */}
            <group position={[-3.2, 0, 4.5]} rotation={[0, Math.PI / 4, 0]}>
                {/* Back Left Wheel */}
                <mesh position={[-0.32, 0.15, -0.45]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 0.1, 12]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.9} />
                </mesh>
                {/* Back Right Wheel */}
                <mesh position={[0.32, 0.15, -0.45]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 0.1, 12]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.9} />
                </mesh>
                {/* Front Wheel */}
                <mesh position={[0, 0.15, 0.55]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 0.1, 12]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.9} />
                </mesh>

                {/* Main Body Chassis */}
                <RoundedBox position={[0, 0.4, 0]} args={[0.7, 0.4, 1.3]} radius={0.04} smoothness={3} castShadow receiveShadow>
                    <meshStandardMaterial color="#10b981" roughness={0.4} metalness={0.7} />
                </RoundedBox>
                {/* Front fender/nose */}
                <RoundedBox position={[0, 0.45, 0.65]} args={[0.42, 0.35, 0.2]} radius={0.03} smoothness={3} castShadow>
                    <meshStandardMaterial color="#10b981" roughness={0.4} metalness={0.7} />
                </RoundedBox>

                {/* Cabin Canopy roof support struts */}
                <mesh position={[-0.3, 0.85, -0.45]} castShadow>
                    <cylinderGeometry args={[0.015, 0.015, 0.6, 6]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>
                <mesh position={[0.3, 0.85, -0.45]} castShadow>
                    <cylinderGeometry args={[0.015, 0.015, 0.6, 6]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>
                <mesh position={[0, 0.85, 0.35]} castShadow>
                    <cylinderGeometry args={[0.015, 0.015, 0.6, 6]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>

                {/* Roof Canopy */}
                <RoundedBox position={[0, 1.15, -0.05]} args={[0.72, 0.04, 1.2]} radius={0.02} smoothness={3} castShadow>
                    <meshStandardMaterial color="#0f172a" roughness={0.7} />
                </RoundedBox>

                {/* Driver Seat */}
                <RoundedBox position={[0, 0.45, 0.1]} args={[0.55, 0.12, 0.35]} radius={0.02} smoothness={3} castShadow>
                    <meshStandardMaterial color="#1e293b" roughness={0.9} />
                </RoundedBox>
                {/* Passenger Seat */}
                <RoundedBox position={[0, 0.45, -0.35]} args={[0.55, 0.12, 0.35]} radius={0.02} smoothness={3} castShadow>
                    <meshStandardMaterial color="#1e293b" roughness={0.9} />
                </RoundedBox>

                {/* Front glowing headlight */}
                <mesh position={[0, 0.45, 0.76]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.06, 0.06, 0.04, 8]} />
                    <meshBasicMaterial color="#fef08a" />
                </mesh>
            </group>
        </group>
    );
};

const ExteriorDecorations = () => {
    const turbineRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (isMobileDevice && Math.round(state.clock.elapsedTime * 60) % 3 !== 0) return;
        if (turbineRef.current) {
            // Spin the wind turbine blades
            turbineRef.current.rotation.y = state.clock.elapsedTime * 2.0;
        }
    });

    return (
        <group>
            {/* 1. Poolside Luxury Lounge Chairs (on the right of the pool) */}
            <group position={[5.5, 0.02, 5.2]} rotation={[0, -Math.PI / 6, 0]}>
                {/* Chair 1 */}
                <group position={[-0.4, 0, 0]}>
                    {/* Base frame */}
                    <RoundedBox position={[0, 0.08, 0]} args={[0.5, 0.06, 1.2]} radius={0.01} smoothness={2} castShadow>
                        <meshStandardMaterial color="#334155" roughness={0.7} />
                    </RoundedBox>
                    {/* Cushions */}
                    <RoundedBox position={[0, 0.13, -0.1]} args={[0.46, 0.06, 0.95]} radius={0.015} smoothness={2} castShadow>
                        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
                    </RoundedBox>
                    {/* Reclined backrest */}
                    <RoundedBox position={[0, 0.28, -0.45]} rotation={[-0.35, 0, 0]} args={[0.46, 0.06, 0.5]} radius={0.015} smoothness={2} castShadow>
                        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
                    </RoundedBox>
                </group>

                {/* Chair 2 */}
                <group position={[0.4, 0, 0.2]} rotation={[0, -0.05, 0]}>
                    {/* Base frame */}
                    <RoundedBox position={[0, 0.08, 0]} args={[0.5, 0.06, 1.2]} radius={0.01} smoothness={2} castShadow>
                        <meshStandardMaterial color="#334155" roughness={0.7} />
                    </RoundedBox>
                    {/* Cushions */}
                    <RoundedBox position={[0, 0.13, -0.1]} args={[0.46, 0.06, 0.95]} radius={0.015} smoothness={2} castShadow>
                        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
                    </RoundedBox>
                    {/* Reclined backrest */}
                    <RoundedBox position={[0, 0.28, -0.45]} rotation={[-0.35, 0, 0]} args={[0.46, 0.06, 0.5]} radius={0.015} smoothness={2} castShadow>
                        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
                    </RoundedBox>
                </group>

                {/* Shared Drinks Table */}
                <group position={[0, 0.02, -0.2]}>
                    {/* Table column */}
                    <mesh position={[0, 0.18, 0]} castShadow>
                        <cylinderGeometry args={[0.02, 0.02, 0.36, 8]} />
                        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
                    </mesh>
                    {/* Table top */}
                    <mesh position={[0, 0.36, 0]} castShadow>
                        <cylinderGeometry args={[0.22, 0.22, 0.02, 16]} />
                        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
                    </mesh>
                    {/* Tiny visual drinking glass */}
                    <mesh position={[0.05, 0.40, -0.05]}>
                        <cylinderGeometry args={[0.02, 0.015, 0.06, 8]} />
                        <meshPhysicalMaterial transmission={0.9} transparent roughness={0.1} color="#38bdf8" />
                    </mesh>
                </group>
            </group>

            {/* 2. Cleantech Kinetic Wind Helix Sculpture (on the left lawn) */}
            <group position={[-5.3, 0, 6.5]}>
                {/* Base plinth */}
                <RoundedBox position={[0, 0.1, 0]} args={[0.6, 0.2, 0.6]} radius={0.02} smoothness={3} castShadow receiveShadow>
                    <meshStandardMaterial color="#1e293b" roughness={0.8} />
                </RoundedBox>

                {/* Central mast */}
                <mesh position={[0, 0.8, 0]} castShadow>
                    <cylinderGeometry args={[0.03, 0.04, 1.4, 8]} />
                    <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
                </mesh>

                {/* Rotating double-helix turbine head */}
                <group ref={turbineRef} position={[0, 1.6, 0]}>
                    {/* Rotor hub */}
                    <mesh position={[0, 0, 0]} castShadow>
                        <cylinderGeometry args={[0.06, 0.06, 0.15, 8]} />
                        <meshStandardMaterial color="#0f172a" />
                    </mesh>
                    {/* Helix Blade 1 */}
                    {Array.from({ length: 12 }).map((_, i) => {
                        const yOffset = -0.4 + (i / 11) * 0.8;
                        const angle = (i / 11) * Math.PI * 1.5;
                        const radius = 0.2;
                        return (
                            <mesh key={`h1-${i}`} position={[Math.sin(angle) * radius, yOffset, Math.cos(angle) * radius]} rotation={[0, angle, 0]} castShadow>
                                <boxGeometry args={[0.16, 0.04, 0.02]} />
                                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.3} roughness={0.3} />
                            </mesh>
                        );
                    })}
                    {/* Helix Blade 2 (180deg offset) */}
                    {Array.from({ length: 12 }).map((_, i) => {
                        const yOffset = -0.4 + (i / 11) * 0.8;
                        const angle = (i / 11) * Math.PI * 1.5 + Math.PI;
                        const radius = 0.2;
                        return (
                            <mesh key={`h2-${i}`} position={[Math.sin(angle) * radius, yOffset, Math.cos(angle) * radius]} rotation={[0, angle, 0]} castShadow>
                                <boxGeometry args={[0.16, 0.04, 0.02]} />
                                <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} roughness={0.3} />
                            </mesh>
                        );
                    })}
                </group>
            </group>

            {/* 3. Futuristic Pathway Light Bollards (bordering the entrance walk) */}
            {[
                [-1.4, 7.5],
                [1.4, 7.5],
                [-1.4, 5.2],
                [1.4, 5.2],
            ].map(([xPos, zPos], idx) => (
                <group key={`bollard-${idx}`} position={[xPos, 0, zPos]}>
                    {/* Post */}
                    <mesh position={[0, 0.22, 0]} castShadow>
                        <cylinderGeometry args={[0.02, 0.022, 0.44, 8]} />
                        <meshStandardMaterial color="#0f172a" roughness={0.7} />
                    </mesh>
                    {/* Glowing LED Cap */}
                    <mesh position={[0, 0.44, 0]}>
                        <cylinderGeometry args={[0.025, 0.025, 0.04, 8]} />
                        <meshBasicMaterial color="#38bdf8" />
                    </mesh>
                    {/* Small accent glow light */}
                    <pointLight position={[0, 0.45, 0]} color="#38bdf8" intensity={0.4} distance={1.2} decay={2} />
                </group>
            ))}
        </group>
    );
};

const Skyline = () => {
    const buildings = useMemo(() => {
        const count = 35;
        const list = [];
        for (let i = 0; i < count; i++) {
            const width = 1.6 + Math.random() * 2.4;
            const height = 4.5 + Math.random() * 5.5;
            const depth = 1.6 + Math.random() * 2.4;
            const x = -70 + (140 * i) / count + (Math.random() - 0.5) * 2.0;
            const z = -60 - Math.random() * 10.0;
            const ry = (Math.random() - 0.5) * 0.15;
            
            const hasAntenna = Math.random() > 0.4;
            const antennaHeight = 0.8 + Math.random() * 1.2;

            // Generate structural window grid rows/cols for details
            const rows = Math.floor(height * 1.2);
            const cols = Math.floor(width * 1.5);

            list.push({ x, y: height / 2 - 1.5, z, width, height, depth, ry, hasAntenna, antennaHeight, rows, cols });
        }
        return list;
    }, []);

    return (
        <group>
            {buildings.map((b, idx) => (
                <group key={idx} position={[b.x, 0, b.z]} rotation={[0, b.ry, 0]}>
                    {/* Skyscraper Shell */}
                    <mesh>
                        <boxGeometry args={[b.width, b.height, b.depth]} />
                        <meshStandardMaterial color="#2d3748" roughness={0.7} metalness={0.3} />
                    </mesh>

                    {/* Window Grid Details */}
                    {Array.from({ length: b.rows }).map((_, rIdx) => 
                        Array.from({ length: b.cols }).map((_, cIdx) => {
                            // Randomly skip windows for realism
                            if (Math.random() > 0.75) return null;
                            const winW = 0.08;
                            const winH = 0.14;
                            const posX = -b.width / 2 + 0.2 + (cIdx * (b.width - 0.4)) / Math.max(1, b.cols - 1);
                            const posY = b.y - b.height / 2 + 0.4 + (rIdx * (b.height - 0.8)) / Math.max(1, b.rows - 1);
                            return (
                                <mesh key={`${rIdx}-${cIdx}`} position={[posX, posY, b.depth / 2 + 0.01]}>
                                    <planeGeometry args={[winW, winH]} />
                                    <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.5} roughness={0.2} />
                                </mesh>
                            );
                        })
                    )}

                    {/* Antenna Tips */}
                    {b.hasAntenna && (
                        <group position={[0, b.height - 1.5, 0]}>
                            <mesh position={[0, b.antennaHeight / 2, 0]}>
                                <cylinderGeometry args={[0.015, 0.012, b.antennaHeight, 4]} />
                                <meshStandardMaterial color="#475569" />
                            </mesh>
                            <mesh position={[0, b.antennaHeight, 0]}>
                                <sphereGeometry args={[0.04, 6, 6]} />
                                <meshBasicMaterial color="#ef4444" />
                            </mesh>
                        </group>
                    )}
                </group>
            ))}
        </group>
    );
};

const Hills = () => {
    return (
        <group position={[0, -12, -25]}>
            {/* Left low rolling hill */}
            <mesh position={[-20, 0, 0]} receiveShadow>
                <sphereGeometry args={[14, 32, 16]} />
                <meshStandardMaterial color="#14532d" roughness={0.95} />
            </mesh>
            {/* Right low rolling hill */}
            <mesh position={[20, -1, -5]} receiveShadow>
                <sphereGeometry args={[15, 32, 16]} />
                <meshStandardMaterial color="#14532d" roughness={0.95} />
            </mesh>
            {/* Center distant low hill */}
            <mesh position={[0, -3, -10]} receiveShadow>
                <sphereGeometry args={[18, 32, 16]} />
                <meshStandardMaterial color="#0f3f20" roughness={0.98} />
            </mesh>
        </group>
    );
};

const SolarCanopy = () => {
    return (
        <group position={[0, 4.52, -0.5]}>
            <mesh position={[-2.2, -0.3, -1.0]} castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.7} />
            </mesh>
            <mesh position={[2.2, -0.3, -1.0]} castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.7} />
            </mesh>

            <group rotation={[0.12, 0, 0]}>
                {[-1.8, -0.6, 0.6, 1.8].map((x, idx) => (
                    <RoundedBox key={idx} position={[x, 0.0, -1.0]} args={[1.0, 0.03, 1.4]} radius={0.01} smoothness={2} castShadow receiveShadow>
                        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
                    </RoundedBox>
                ))}
                <RoundedBox position={[0, -0.02, -1.0]} args={[5.0, 0.02, 1.5]} radius={0.01} smoothness={2}>
                    <meshStandardMaterial color="#1e293b" roughness={0.5} />
                </RoundedBox>
            </group>
        </group>
    );
};

const WindTurbine = ({ position }: { position: [number, number, number] }) => {
    const bladesRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (bladesRef.current) {
            bladesRef.current.rotation.z = state.clock.elapsedTime * 1.2;
        }
    });

    return (
        <group position={position}>
            <mesh position={[0, 1.75, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.03, 0.07, 3.5, 12]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
            </mesh>

            <RoundedBox position={[0, 3.5, 0]} args={[0.12, 0.12, 0.24]} radius={0.01} smoothness={2} castShadow>
                <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
            </RoundedBox>

            <group position={[0, 3.5, 0.14]} ref={bladesRef}>
                <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
                </mesh>
                {[0, 120, 240].map((angle, idx) => {
                    const r = (angle * Math.PI) / 180;
                    return (
                        <group key={idx} rotation={[0, 0, r]}>
                            <mesh position={[0, 0.6, 0]} castShadow>
                                <boxGeometry args={[0.024, 1.2, 0.004]} />
                                <meshStandardMaterial color="#ffffff" roughness={0.4} />
                            </mesh>
                        </group>
                    );
                })}
            </group>
        </group>
    );
};

const LeftSideRoad = () => {
    const roadSegments = 40;
    const pathPoints: THREE.Vector3[] = [];
    
    // Generates a beautiful highway stretching along the far left environment (shifted left to clear villa)
    for (let i = 0; i <= roadSegments; i++) {
        const z = -20 + (40 * i) / roadSegments;
        const x = -10.5 + Math.sin((z * Math.PI) / 10) * 1.2;
        pathPoints.push(new THREE.Vector3(x, 0.025, z));
    }

    return (
        <group>
            {pathPoints.map((pt, idx) => {
                if (idx === pathPoints.length - 1) return null;
                const nextPt = pathPoints[idx + 1];
                const dx = nextPt.x - pt.x;
                const dz = nextPt.z - pt.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                const angle = Math.atan2(dx, dz);
                const midX = (pt.x + nextPt.x) / 2;
                const midZ = (pt.z + nextPt.z) / 2;

                return (
                    <group key={idx} position={[midX, 0.01, midZ]} rotation={[0, angle, 0]}>
                        {/* 🛣️ Broad Asphalt Highway */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                            <planeGeometry args={[2.6, distance + 0.03]} />
                            <meshStandardMaterial color="#1e293b" roughness={0.9} />
                        </mesh>

                        {/* 🟡 Double Yellow Center Line */}
                        <mesh position={[-0.04, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[0.02, distance + 0.03]} />
                            <meshBasicMaterial color="#eab308" />
                        </mesh>
                        <mesh position={[0.04, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[0.02, distance + 0.03]} />
                            <meshBasicMaterial color="#eab308" />
                        </mesh>

                        {/* ⚪ Left & Right White Edge/Shoulder Lines */}
                        <mesh position={[-1.2, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[0.03, distance + 0.03]} />
                            <meshBasicMaterial color="#ffffff" />
                        </mesh>
                        <mesh position={[1.2, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[0.03, distance + 0.03]} />
                            <meshBasicMaterial color="#ffffff" />
                        </mesh>

                        {/* 🧱 Left Raised Concrete Footpath/Sidewalk */}
                        <mesh position={[-1.5, 0.03, 0]} castShadow receiveShadow>
                            <boxGeometry args={[0.4, 0.06, distance + 0.03]} />
                            <meshStandardMaterial color="#94a3b8" roughness={0.8} />
                        </mesh>

                        {/* 🧱 Right Raised Concrete Footpath/Sidewalk */}
                        <mesh position={[1.5, 0.03, 0]} castShadow receiveShadow>
                            <boxGeometry args={[0.4, 0.06, distance + 0.03]} />
                            <meshStandardMaterial color="#94a3b8" roughness={0.8} />
                        </mesh>

                        {/* 💡 Futuristic Highway Streetlight (placed every 7th segment on the left) */}
                        {idx % 7 === 0 && (
                            <group position={[-1.65, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                                {/* Light Post Base */}
                                <mesh position={[0, 0.1, 0]}>
                                    <cylinderGeometry args={[0.03, 0.04, 0.2, 6]} />
                                    <meshStandardMaterial color="#475569" roughness={0.5} />
                                </mesh>
                                {/* Light Post Pole */}
                                <mesh position={[0, 0.9, 0]} castShadow>
                                    <cylinderGeometry args={[0.015, 0.02, 1.4, 6]} />
                                    <meshStandardMaterial color="#64748b" metalness={0.7} />
                                </mesh>
                                {/* Curved Top Arm */}
                                <mesh position={[0.15, 1.55, 0]} rotation={[0, 0, -0.6]} castShadow>
                                    <cylinderGeometry args={[0.01, 0.015, 0.4, 6]} />
                                    <meshStandardMaterial color="#64748b" metalness={0.7} />
                                </mesh>
                                {/* Glowing Light Fixture */}
                                <mesh position={[0.3, 1.68, 0]}>
                                    <boxGeometry args={[0.14, 0.04, 0.08]} />
                                    <meshStandardMaterial color="#1e293b" />
                                </mesh>
                                <mesh position={[0.3, 1.658, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                                    <planeGeometry args={[0.12, 0.06]} />
                                    <meshBasicMaterial color="#fef08a" />
                                </mesh>
                                {/* Soft Streetlight Pointlight */}
                                <pointLight position={[0.3, 1.5, 0]} color="#fef08a" intensity={0.5} distance={3.5} decay={2} />
                            </group>
                        )}
                    </group>
                );
            })}
        </group>
    );
};

interface MovingVehicleProps {
    color: string;
    speedOffset: number;
    delay: number;
}

const LeftSideVehicle: React.FC<MovingVehicleProps> = ({ color, speedOffset, delay }) => {
    const carRef = useRef<THREE.Group>(null);
    const wheelRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const time = state.clock.elapsedTime * 0.15 * speedOffset + delay;
        const zRange = 40;
        const cycle = time % 1.0; // 0 to 1 continuous loop

        const z = -20 + cycle * zRange;
        const x = -10.5 + Math.sin((z * Math.PI) / 10) * 1.2;

        // Calculate continuous forward heading angle
        const nextZ = z + 0.1;
        const nextX = -10.5 + Math.sin((nextZ * Math.PI) / 10) * 1.2;
        const angle = Math.atan2(nextX - x, nextZ - z);

        if (carRef.current) {
            carRef.current.position.set(x, 0.12, z);
            carRef.current.rotation.y = angle;
        }

        if (wheelRef.current) {
            wheelRef.current.rotation.x = state.clock.elapsedTime * 15 * speedOffset;
        }
    });

    return (
        <group ref={carRef}>
            {/* Larger Car Body Chassis */}
            <RoundedBox position={[0, 0.08, 0]} args={[0.36, 0.16, 0.65]} radius={0.03} smoothness={2} castShadow>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
            </RoundedBox>
            {/* Larger Windshield */}
            <mesh position={[0, 0.18, 0.06]} rotation={[-0.4, 0, 0]}>
                <boxGeometry args={[0.3, 0.1, 0.16]} />
                <meshPhysicalMaterial transmission={0.9} color="#bae6fd" transparent roughness={0.15} />
            </mesh>
            {/* Headlights */}
            <mesh position={[-0.13, 0.08, 0.326]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.015, 8]} />
                <meshBasicMaterial color="#fef08a" />
            </mesh>
            <mesh position={[0.13, 0.08, 0.326]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.015, 8]} />
                <meshBasicMaterial color="#fef08a" />
            </mesh>
        </group>
    );
};


const BESSUnits = () => {
    const pulseLightRef = useRef<THREE.MeshStandardMaterial>(null);

    useFrame((state) => {
        if (pulseLightRef.current) {
            const intensity = 0.2 + Math.abs(Math.sin(state.clock.elapsedTime * 2.5)) * 0.8;
            pulseLightRef.current.emissiveIntensity = intensity;
        }
    });

    return (
        <group position={[4.6, 0, 3.8]}>
            <RoundedBox position={[0, 0.7, 0]} args={[0.6, 1.4, 0.6]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.7} />
            </RoundedBox>

            <RoundedBox position={[0, 1.35, 0.302]} args={[0.4, 0.05, 0.01]} radius={0.005}>
                <meshStandardMaterial color="#0f172a" />
            </RoundedBox>
            <RoundedBox position={[0, 1.25, 0.302]} args={[0.4, 0.05, 0.01]} radius={0.005}>
                <meshStandardMaterial color="#0f172a" />
            </RoundedBox>

            {[0.95, 0.7, 0.45, 0.2].map((y, idx) => (
                <group key={idx} position={[0, y, 0]}>
                    <RoundedBox position={[0, 0, 0.08]} args={[0.5, 0.18, 0.42]} radius={0.01} smoothness={2}>
                        <meshStandardMaterial color="#334155" roughness={0.4} />
                    </RoundedBox>
                    <mesh position={[0, 0, 0.292]}>
                        <planeGeometry args={[0.34, 0.02]} />
                        <meshStandardMaterial
                            ref={idx === 0 ? pulseLightRef : null}
                            color="#00f5ff"
                            emissive="#00f5ff"
                            emissiveIntensity={1.0}
                        />
                    </mesh>
                </group>
            ))}

            <Suspense fallback={null}>
                <Text
                    position={[0, 1.15, 0.31]}
                    fontSize={0.05}
                    color="#00f5ff"
                    anchorX="center"
                    anchorY="middle"
                    font="monospace"
                >
                    BESS-01
                </Text>
            </Suspense>
        </group>
    );
};

const FuturisticDrone = () => {
    const droneRef = useRef<THREE.Group>(null);
    const prop1Ref = useRef<THREE.Mesh>(null);
    const prop2Ref = useRef<THREE.Mesh>(null);
    const prop3Ref = useRef<THREE.Mesh>(null);
    const prop4Ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        if (droneRef.current) {
            droneRef.current.position.y = 4.4 + Math.sin(time * 1.8) * 0.12;
            droneRef.current.position.x = 2.1 + Math.cos(time * 0.8) * 0.2;
            droneRef.current.rotation.y = time * 0.15;
            droneRef.current.rotation.z = Math.sin(time * 0.8) * 0.04;
        }

        const rotSpeed = time * 24;
        if (prop1Ref.current) prop1Ref.current.rotation.y = rotSpeed;
        if (prop2Ref.current) prop2Ref.current.rotation.y = rotSpeed;
        if (prop3Ref.current) prop3Ref.current.rotation.y = rotSpeed;
        if (prop4Ref.current) prop4Ref.current.rotation.y = rotSpeed;
    });

    return (
        <group>
            <group position={[2.1, 2.33, -1.0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <cylinderGeometry args={[0.65, 0.65, 0.02, 24]} />
                    <meshStandardMaterial color="#334155" roughness={0.8} />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
                    <ringGeometry args={[0.54, 0.58, 24]} />
                    <meshBasicMaterial color="#10b981" />
                </mesh>
                <Suspense fallback={null}>
                    <Text
                        position={[0, 0.02, 0]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        fontSize={0.3}
                        color="#10b981"
                        fontWeight={900}
                        anchorX="center"
                        anchorY="middle"
                    >
                        E
                    </Text>
                </Suspense>
            </group>

            <group ref={droneRef} position={[2.1, 4.4, -1.0]}>
                <RoundedBox position={[0, 0, 0]} args={[0.22, 0.08, 0.22]} radius={0.01} smoothness={2} castShadow>
                    <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
                </RoundedBox>
                {[-0.15, 0.15].map((x, i) =>
                    [-0.15, 0.15].map((z, k) => (
                        <group key={`${i}-${k}`} position={[0, 0, 0]}>
                            <mesh position={[x / 2, 0.01, z / 2]} rotation={[0.0, Math.atan2(z, x), Math.PI / 2]}>
                                <cylinderGeometry args={[0.01, 0.01, 0.25, 4]} />
                                <meshStandardMaterial color="#334155" />
                            </mesh>
                            <mesh position={[x, 0.02, z]} castShadow>
                                <cylinderGeometry args={[0.028, 0.028, 0.04, 6]} />
                                <meshStandardMaterial color="#0f172a" />
                            </mesh>
                            <mesh
                                ref={
                                    i === 0 && k === 0 ? prop1Ref :
                                        i === 0 && k === 1 ? prop2Ref :
                                            i === 1 && k === 0 ? prop3Ref : prop4Ref
                                }
                                position={[x, 0.045, z]}
                            >
                                <cylinderGeometry args={[0.07, 0.07, 0.002, 6]} />
                                <meshBasicMaterial color="#94a3b8" transparent opacity={0.35} />
                            </mesh>
                        </group>
                    ))
                )}

                <RoundedBox position={[0, -0.09, 0]} args={[0.1, 0.09, 0.1]} radius={0.008} smoothness={2} castShadow>
                    <meshStandardMaterial color="#10b981" roughness={0.5} />
                </RoundedBox>

                <spotLight
                    position={[0, -0.1, 0]}
                    angle={0.25}
                    penumbra={0.6}
                    intensity={4.0}
                    distance={4.0}
                    color="#34d399"
                    castShadow
                />
            </group>
        </group>
    );
};

const QwikSELLDropBox = () => {
    const holoRef = useRef<THREE.Group>(null);
    const glowRef = useRef<THREE.MeshBasicMaterial>(null);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        if (holoRef.current) {
            holoRef.current.rotation.y = time * 0.9;
            holoRef.current.position.y = 1.15 + Math.sin(time * 2.0) * 0.04;
        }
        if (glowRef.current) {
            glowRef.current.opacity = 0.5 + Math.abs(Math.sin(time * 3.5)) * 0.4;
        }
    });

    return (
        <group position={[-2.8, 0, 7.0]}>
            <RoundedBox position={[0, 0.45, 0]} args={[0.5, 0.9, 0.5]} radius={0.02} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
            </RoundedBox>

            <mesh position={[0, 0.35, 0.252]}>
                <planeGeometry args={[0.3, 0.015]} />
                <meshBasicMaterial color="#10b981" />
            </mesh>

            <mesh position={[0, 0.902, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.16, 0.01, 12]} />
                <meshStandardMaterial color="#475569" roughness={0.3} />
            </mesh>

            <group ref={holoRef}>
                <mesh position={[0, 0.0, 0]} castShadow>
                    <boxGeometry args={[0.32, 0.01, 0.22]} />
                    <meshBasicMaterial ref={glowRef} color="#00f5ff" transparent opacity={0.75} wireframe />
                </mesh>
                <mesh position={[0, 0.08, -0.095]} rotation={[0.4, 0, 0]}>
                    <boxGeometry args={[0.32, 0.18, 0.008]} />
                    <meshBasicMaterial color="#00f5ff" transparent opacity={0.65} wireframe />
                </mesh>
                <mesh position={[0, -0.15, 0]}>
                    <cylinderGeometry args={[0.06, 0.18, 0.35, 12, 1, true]} />
                    <meshBasicMaterial color="#00f5ff" transparent opacity={0.1} />
                </mesh>
            </group>
        </group>
    );
};

// ========================================================
// 4. INTERIOR SWINGING DOORS & FURNITURE COMPONENTS
// ========================================================

interface DoorProps {
    isOpen: boolean;
    position: [number, number, number];
    offsetZ: number;
    direction: number;
    logoTexture: THREE.Texture | null;
    logoAspect: number;
    onClick?: () => void;
}

const ChamberDoor: React.FC<DoorProps> = ({ isOpen, position, offsetZ, direction, logoTexture, logoAspect, onClick }) => {
    const doorRef = useRef<THREE.Group>(null);
    useEffect(() => {
        gsap.to(doorRef.current!.rotation, {
            y: isOpen ? direction * 1.55 : 0,
            duration: 1.3,
            ease: 'power2.inOut'
        });
    }, [isOpen, direction]);

    return (
        <group ref={doorRef} position={position} onClick={onClick}>
            <RoundedBox position={[0, 0, offsetZ]} args={[0.05, 2.1, 1.2]} radius={0.015} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial color="#334155" roughness={0.75} />
            </RoundedBox>

            {logoTexture && (
                <mesh
                    position={[-direction * 0.028, 0.4, offsetZ]}
                    rotation={[0, direction === 1 ? -Math.PI / 2 : Math.PI / 2, 0]}
                    scale={0.38}
                >
                    <planeGeometry args={[logoAspect, 1]} />
                    <meshBasicMaterial map={logoTexture} transparent side={THREE.DoubleSide} depthWrite={false} />
                </mesh>
            )}

            <group position={[direction * 0.04, 0.0, -1.05]}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
                </mesh>
                <mesh position={[0, 0.03, -0.06]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
                </mesh>
            </group>
        </group>
    );
};

interface DoorKnockerProps {
    position: [number, number, number];
    onKnock: () => void;
}

const DoorKnocker: React.FC<DoorKnockerProps> = ({ position, onKnock }) => {
    const ringRef = useRef<THREE.Group>(null);

    const handleKnock = (e: any) => {
        e.stopPropagation();
        playKnockSound();

        const tl = gsap.timeline({ onComplete: onKnock });
        tl.to(ringRef.current!.rotation, { x: 0.45, duration: 0.15, ease: 'power1.out' })
            .to(ringRef.current!.rotation, { x: 0, duration: 0.1, ease: 'power1.in' })
            .to(ringRef.current!.rotation, { x: 0.45, duration: 0.12, ease: 'power1.out' })
            .to(ringRef.current!.rotation, { x: 0, duration: 0.08, ease: 'power1.in' });
    };

    return (
        <group position={position}>
            <RoundedBox args={[0.08, 0.12, 0.015]} radius={0.005} smoothness={3} castShadow>
                <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
            </RoundedBox>
            <mesh position={[0, 0.04, 0.01]} castShadow>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial color="#b45309" metalness={0.9} roughness={0.1} />
            </mesh>
            <group ref={ringRef} position={[0, 0.04, 0.01]} onClick={handleKnock}>
                <mesh position={[0, -0.06, 0.005]} castShadow>
                    <torusGeometry args={[0.05, 0.012, 8, 24]} />
                    <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
                </mesh>
            </group>
        </group>
    );
};

interface FrontDoorProps {
    isOpen: boolean;
    onKnock: () => void;
    onClick: () => void;
}

const FrontDoor: React.FC<FrontDoorProps> = ({ isOpen, onKnock, onClick }) => {
    const leftHingeRef = useRef<THREE.Group>(null);
    const rightHingeRef = useRef<THREE.Group>(null);

    useEffect(() => {
        gsap.to(leftHingeRef.current!.rotation, {
            y: isOpen ? 1.55 : 0,
            duration: 1.4,
            ease: 'power2.inOut'
        });
        gsap.to(rightHingeRef.current!.rotation, {
            y: isOpen ? -1.55 : 0,
            duration: 1.4,
            ease: 'power2.inOut'
        });
    }, [isOpen]);

    return (
        <group position={[0, 1.05, 3.5]}>
            <group ref={leftHingeRef} position={[-1.0, 0, 0]}>
                <RoundedBox position={[0.5, 0, 0]} args={[0.96, 2.1, 0.06]} radius={0.02} smoothness={3} castShadow receiveShadow onClick={onClick}>
                    <meshStandardMaterial color="#1e293b" roughness={0.7} />
                </RoundedBox>
                <RoundedBox position={[0.92, 0, 0.05]} args={[0.02, 0.9, 0.02]} radius={0.005} smoothness={3} castShadow onClick={onClick}>
                    <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
                </RoundedBox>
            </group>
            <group ref={rightHingeRef} position={[1.0, 0, 0]}>
                <RoundedBox position={[-0.5, 0, 0]} args={[0.96, 2.1, 0.06]} radius={0.02} smoothness={3} castShadow receiveShadow onClick={onClick}>
                    <meshStandardMaterial color="#1e293b" roughness={0.7} />
                </RoundedBox>
                <RoundedBox position={[-0.92, 0, 0.05]} args={[0.02, 0.9, 0.02]} radius={0.005} smoothness={3} castShadow onClick={onClick}>
                    <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
                </RoundedBox>

                {!isOpen && (
                    <DoorKnocker position={[-0.45, 0.2, 0.05]} onKnock={onKnock} />
                )}
            </group>
        </group>
    );
};

// ========================================================
// KINETIC NETWORK FLUX — Lobby Data-Stream Particles
// ========================================================
const LobbyNetworkFlux = () => {
    return null;
};

interface HallwayTableProps {
    onBackClick: () => void;
}

const HallwayTable: React.FC<HallwayTableProps> = ({ onBackClick }) => {
    const [urjaActive, setUrjaActive] = useState(false);
    const [qwikActive, setQwikActive] = useState(false);
    const [urjaHover, setUrjaHover] = useState(false);
    const [qwikHover, setQwikHover] = useState(false);

    const batteriesGroupRef = useRef<THREE.Group>(null);
    const laptopsGroupRef = useRef<THREE.Group>(null);
    const urjaRingRef = useRef<THREE.Mesh>(null);
    const qwikRingRef = useRef<THREE.Mesh>(null);
    const laptopScreenMatRef = useRef<THREE.MeshBasicMaterial>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Batteries float & sway rotationally
        if (batteriesGroupRef.current) {
            batteriesGroupRef.current.position.y = Math.sin(time * 1.8) * 0.02;
            batteriesGroupRef.current.rotation.y = time * 0.15;
        }

        // Laptops float & sway rotationally (opposite direction)
        if (laptopsGroupRef.current) {
            laptopsGroupRef.current.position.y = Math.cos(time * 1.8) * 0.02;
            laptopsGroupRef.current.rotation.y = -time * 0.15;
        }

        // Pulse pedestal neon rings
        if (urjaRingRef.current) {
            const s = 1.0 + Math.sin(time * 2.8) * 0.06;
            urjaRingRef.current.scale.set(s, s, 1);
        }
        if (qwikRingRef.current) {
            const s = 1.0 + Math.cos(time * 2.8) * 0.06;
            qwikRingRef.current.scale.set(s, s, 1);
        }

        // Pulse open laptop screen light intensity
        if (laptopScreenMatRef.current) {
            laptopScreenMatRef.current.opacity = 0.55 + Math.sin(time * 4) * 0.35;
        }
    });

    return (
        <group position={[0, 0, -0.6]}>
            {/* 🛋️ PREMIUM CENTRAL LOBBY SOFA */}
            <group position={[0, 0, 0.3]} onClick={onBackClick} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'default'; }}>
                {/* Sofa base frame */}
                <RoundedBox position={[0, 0.18, 0]} args={[1.4, 0.12, 0.65]} radius={0.015} castShadow>
                    <meshStandardMaterial color="#0f172a" roughness={0.7} />
                </RoundedBox>

                {/* Left & Right armrests */}
                <RoundedBox position={[-0.67, 0.3, 0.02]} args={[0.12, 0.36, 0.6]} radius={0.02} castShadow>
                    <meshStandardMaterial color="#0f172a" roughness={0.7} />
                </RoundedBox>
                <RoundedBox position={[0.67, 0.3, 0.02]} args={[0.12, 0.36, 0.6]} radius={0.02} castShadow>
                    <meshStandardMaterial color="#0f172a" roughness={0.7} />
                </RoundedBox>

                {/* Main seat cushions */}
                <RoundedBox position={[-0.32, 0.26, 0.02]} args={[0.6, 0.12, 0.56]} radius={0.02} castShadow>
                    <meshStandardMaterial color="#1e293b" roughness={0.8} />
                </RoundedBox>
                <RoundedBox position={[0.32, 0.26, 0.02]} args={[0.6, 0.12, 0.56]} radius={0.02} castShadow>
                    <meshStandardMaterial color="#1e293b" roughness={0.8} />
                </RoundedBox>

                {/* Cozy backrest */}
                <RoundedBox position={[0, 0.5, -0.22]} args={[1.24, 0.45, 0.15]} radius={0.02} castShadow>
                    <meshStandardMaterial color="#1e293b" roughness={0.8} />
                </RoundedBox>

                {/* Metallic legs */}
                {[-0.62, 0.62].map((xVal, idx) => (
                    <group key={idx}>
                        <mesh position={[xVal, 0.06, 0.22]} castShadow>
                            <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
                            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
                        </mesh>
                        <mesh position={[xVal, 0.06, -0.22]} castShadow>
                            <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
                            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
                        </mesh>
                    </group>
                ))}
            </group>

            {/* 🔋 TOP LEFT: BATTERY DISPLAY PEDESTAL */}
            <group 
                position={[-1.2, 0, -0.4]} 
                scale={urjaHover ? [1.06, 1.06, 1.06] : [1, 1, 1]}
                onClick={(e) => { e.stopPropagation(); setUrjaActive(!urjaActive); }}
                onPointerOver={(e) => { e.stopPropagation(); setUrjaHover(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { setUrjaHover(false); document.body.style.cursor = 'default'; }}
            >
                <RoundedBox position={[0, 0.25, 0]} args={[0.55, 0.5, 0.55]} radius={0.01} castShadow receiveShadow>
                    <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
                </RoundedBox>
                <mesh ref={urjaRingRef} position={[0, 0.502, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.22, 0.24, 32]} />
                    <meshBasicMaterial color="#10b981" />
                </mesh>

                {/* Floating Holographic Info Text */}
                <Suspense fallback={null}>
                    <Text position={[0, 0.82, 0]} color="#10b981" fontSize={0.05} fontWeight={900} material-depthWrite={false}>
                        {urjaActive ? "URJA // LEASING" : "URJA"}
                    </Text>
                    <Text position={[0, 0.75, 0]} color="#94a3b8" fontSize={0.026} fontWeight={700} material-depthWrite={false}>
                        {urjaActive ? "Active BaaS Subscription Plan" : "Battery Leasing & Recycling"}
                    </Text>
                </Suspense>

                {/* Levitating Battery Group */}
                <group ref={batteriesGroupRef}>
                    {/* Pack 1 (Flat on pedestal) */}
                    <group position={[-0.08, 0.53, 0.05]}>
                        <mesh castShadow>
                            <boxGeometry args={[0.22, 0.06, 0.14]} />
                            <meshStandardMaterial color="#334155" roughness={0.4} />
                        </mesh>
                        <mesh position={[0, 0.031, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
                            <meshStandardMaterial color="#64748b" metalness={0.8} />
                        </mesh>
                        <mesh position={[-0.08, 0, 0.071]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.008, 0.008, 0.002, 8]} />
                            <meshBasicMaterial color="#10b981" />
                        </mesh>
                    </group>

                    {/* Pack 2 (Tilted on wedge) */}
                    <group position={[0.08, 0.56, -0.05]} rotation={[0.2, -0.2, 0.1]}>
                        <mesh castShadow>
                            <boxGeometry args={[0.22, 0.06, 0.14]} />
                            <meshStandardMaterial color="#475569" roughness={0.4} />
                        </mesh>
                        <mesh position={[0, 0.031, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
                            <meshStandardMaterial color="#64748b" metalness={0.8} />
                        </mesh>
                        <mesh position={[-0.08, 0, 0.071]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.008, 0.008, 0.002, 8]} />
                            <meshBasicMaterial color="#10b981" />
                        </mesh>
                    </group>
                </group>
            </group>

            {/* 💻 TOP RIGHT: LAPTOP DISPLAY PEDESTAL */}
            <group 
                position={[1.2, 0, -0.4]} 
                scale={qwikHover ? [1.06, 1.06, 1.06] : [1, 1, 1]}
                onClick={(e) => { e.stopPropagation(); setQwikActive(!qwikActive); }}
                onPointerOver={(e) => { e.stopPropagation(); setQwikHover(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { setQwikHover(false); document.body.style.cursor = 'default'; }}
            >
                <RoundedBox position={[0, 0.25, 0]} args={[0.55, 0.5, 0.55]} radius={0.01} castShadow receiveShadow>
                    <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
                </RoundedBox>
                <mesh ref={qwikRingRef} position={[0, 0.502, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.22, 0.24, 32]} />
                    <meshBasicMaterial color="#00f5ff" />
                </mesh>

                {/* Floating Holographic Info Text */}
                <Suspense fallback={null}>
                    <Text position={[0, 0.82, 0]} color="#00f5ff" fontSize={0.05} fontWeight={900} material-depthWrite={false}>
                        {qwikActive ? "QWIKSELL // RECYCLING" : "QWIKSELL"}
                    </Text>
                    <Text position={[0, 0.75, 0]} color="#94a3b8" fontSize={0.026} fontWeight={700} material-depthWrite={false}>
                        {qwikActive ? "Hardware Circular Asset Loop" : "Laptop Leasing & Recycling"}
                    </Text>
                </Suspense>

                {/* Levitating Laptops Group */}
                <group ref={laptopsGroupRef}>
                    {/* Laptop 1 (Open facing front-left) */}
                    <group position={[-0.08, 0.51, 0.05]} rotation={[0, 0.2, 0]}>
                        {/* Keyboard Base */}
                        <mesh castShadow>
                            <boxGeometry args={[0.18, 0.008, 0.12]} />
                            <meshStandardMaterial color="#334155" roughness={0.5} />
                        </mesh>
                        {/* Opened Screen Lid */}
                        <group position={[0, 0.004, -0.06]} rotation={[-1.25, 0, 0]}>
                            <mesh castShadow position={[0, 0.06, 0]}>
                                <boxGeometry args={[0.18, 0.12, 0.006]} />
                                <meshStandardMaterial color="#1e293b" roughness={0.5} />
                            </mesh>
                            <mesh position={[0, 0.06, 0.0045]}>
                                <planeGeometry args={[0.17, 0.11]} />
                                <meshBasicMaterial ref={laptopScreenMatRef} color="#00f5ff" transparent toneMapped={false} />
                            </mesh>
                        </group>
                    </group>

                    {/* Laptop 2 (Closed stacked / offset) */}
                    <group position={[0.08, 0.51, -0.05]} rotation={[0, -0.3, 0]}>
                        <mesh castShadow>
                            <boxGeometry args={[0.18, 0.016, 0.12]} />
                            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
                        </mesh>
                        <mesh position={[0, 0.008, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.004, 0.004, 0.004, 8]} />
                            <meshBasicMaterial color="#00f5ff" />
                        </mesh>
                    </group>
                </group>
            </group>
        </group>
    );
};

// ========================================================
// 5. CLEAN MODERN ROOMS LAYOUTS (No sci-fi objects)
const URJA_BATTERY_ITEMS = [
    { id: 1, label: "LFP PACK TYPE: 105Ah FLEET CELL ARRAY" },
    { id: 2, label: "LFP PACK TYPE: 105Ah FLEET CELL ARRAY" },
    { id: 3, label: "LFP PACK TYPE: 105Ah FLEET CELL ARRAY" }
];

interface RoomProps {
    currentView: string;
    logoTexture: THREE.Texture | null;
    logoAspect: number;
    onClick: () => void;
}

// Reusable animated target hotspot ring for subsystem information overlays
const InfoHotspot = ({ position, label, subtext, color }: { position: [number, number, number]; label: string; subtext: string; color: string }) => {
    const ringRef = useRef<THREE.Mesh>(null);
    const cardRef = useRef<THREE.Group>(null);
    const [active, setActive] = useState(false);
    const scaleRef = useRef(0);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (ringRef.current) {
            ringRef.current.rotation.y = time * 1.5;
            ringRef.current.scale.setScalar(1.0 + Math.sin(time * 4) * 0.08);
        }

        // Billboard & smooth scale animation for the label card
        if (cardRef.current) {
            cardRef.current.quaternion.copy(state.camera.quaternion);
            const targetScale = active ? 1.0 : 0.0;
            scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.15);
            cardRef.current.scale.setScalar(scaleRef.current);
            cardRef.current.visible = scaleRef.current > 0.01;
        }
    });

    return (
        <group position={position}>
            {/* Pulsing Outer Target Geometries */}
            <mesh 
                ref={ringRef}
                onPointerOver={(e) => { e.stopPropagation(); setActive(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { setActive(false); document.body.style.cursor = 'default'; }}
            >
                <torusGeometry args={[0.08, 0.008, 6, 24]} />
                <meshBasicMaterial color={color} transparent opacity={0.8} />
            </mesh>
            <mesh>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial color={color} />
            </mesh>

            {/* In-Camera HUD Parameter Readout */}
            <group ref={cardRef} position={[0, 0.22, 0.02]}>
                {/* Glow Border Outline */}
                <mesh position={[0, 0, -0.002]}>
                    <planeGeometry args={[0.59, 0.24]} />
                    <meshBasicMaterial color={color} transparent opacity={0.4} />
                </mesh>
                {/* Main Dark Card Body */}
                <mesh>
                    <planeGeometry args={[0.57, 0.22]} />
                    <meshBasicMaterial color="#090f1e" transparent opacity={0.92} />
                </mesh>
                <Suspense fallback={null}>
                    <Text position={[0, 0.04, 0.001]} color={color} fontSize={0.024} fontWeight={900} material-depthWrite={false}>
                        {label}
                    </Text>
                    <Text position={[0, -0.035, 0.001]} color="#cbd5e1" fontSize={0.016} fontWeight={600} material-depthWrite={false} maxWidth={0.52} textAlign="center">
                        {subtext}
                    </Text>
                </Suspense>
            </group>
        </group>
    );
};

const UrjaRoom: React.FC<RoomProps> = ({ currentView, logoTexture, logoAspect, onClick }) => {
    const { size } = useThree();
    const isMobile = size.width < 768 || size.width < size.height;
    const mobileScale = isMobile ? 0.65 : 1.0;
    const textScale = 1 / mobileScale;
    const [swapState, setSwapState] = useState<'idle' | 'entering' | 'extracting' | 'balancing' | 'inserting' | 'leaving'>('idle');
    
    const batteryGlowRefs = [useRef<THREE.MeshStandardMaterial>(null), useRef<THREE.MeshStandardMaterial>(null), useRef<THREE.MeshStandardMaterial>(null)];
    const conduitRefs = [useRef<THREE.MeshStandardMaterial>(null), useRef<THREE.MeshStandardMaterial>(null)];
    const techLaserRef = useRef<THREE.Mesh>(null);
    const telemetryCircleRef = useRef<THREE.Mesh>(null);
    const tukTukRef = useRef<THREE.Group>(null);
    const flyingPackRef = useRef<THREE.Mesh>(null);
    const flyingPackGroupRef = useRef<THREE.Group>(null);
    const entryDoorRef = useRef<THREE.Group>(null);
    const exitDoorRef = useRef<THREE.Group>(null);
    const chargeBarGroupRef = useRef<THREE.Group>(null);
    const cellGraphGroupRef = useRef<THREE.Group>(null);
    const socNeedleRef = useRef<THREE.Group>(null);

    const [statusText, setStatusText] = useState("MONITORING ENERGY ARRAYS");
    const [leftStat, setLeftTelemetry] = useState("[STATE: IDLE]");
    const [rightStat, setRightTelemetry] = useState("[FREQ: 51.2V NOM]");
    const [themeColor, setThemeColor] = useState("#10b981");

    const lastTimeRef = useRef(0);
    const stateStartRef = useRef(0);
    const lastStateRef = useRef(swapState);

    const handleTriggerSimulation = (e?: any) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (swapState !== 'idle') return;
        setSwapState('entering');
    };

    useFrame((state) => {
        if (currentView === 'outside') return;

        const time = state.clock.getElapsedTime();
        lastTimeRef.current = time;

        if (swapState !== lastStateRef.current) {
            stateStartRef.current = time;
            lastStateRef.current = swapState;
        }

        const elapsedInState = time - stateStartRef.current;

        if (techLaserRef.current) techLaserRef.current.position.y = Math.sin(time * 2.2) * 0.16;
        if (telemetryCircleRef.current) telemetryCircleRef.current.rotation.z = time * 0.4;

        // 🛺 SYSTEM SWAP SIMULATION LIFECYCLE CONTROLLER
        if (swapState === 'idle') {
            setStatusText("🔋 SYSTEM BAAS DOCK: READY FOR SIMULATION");
            setThemeColor("#10b981");
            if (tukTukRef.current) {
                tukTukRef.current.scale.set(0.8, 0.8, 0.8); // Scaled up 2.1x to look substantial and grand
                tukTukRef.current.position.set(-0.5, -0.98, -0.5); // Aligned center platform intersection (shifted back/left)
                tukTukRef.current.rotation.y = Math.PI; // Faces rightward along the visual travel vector
            }
            if (flyingPackGroupRef.current) flyingPackGroupRef.current.scale.set(0, 0, 0);
        } 
        else if (swapState === 'entering') {
            setStatusText("🛺 VEHICLE DETECTED: ROLLING IN FOR SWAP...");
            setThemeColor("#f59e0b");
            if (tukTukRef.current) {
                const progress = Math.min(elapsedInState / 2.0, 1.0);
                tukTukRef.current.position.x = -0.5;
                tukTukRef.current.position.y = -0.98;
                tukTukRef.current.position.z = THREE.MathUtils.lerp(2.5, -0.5, progress); // Travel from Visual Left (+Z) to Center Platform Z (-0.5)
                tukTukRef.current.rotation.y = Math.PI; // Faces Visual Right during movement
                if (progress >= 1.0) setSwapState('extracting');
            }
        } 
        else if (swapState === 'extracting') {
            setStatusText("🔒 EXTRACTING DEPLETED LIQUIDATION PACK LOAD");
            setThemeColor("#ef4444");
            if (flyingPackGroupRef.current && flyingPackRef.current) {
                flyingPackGroupRef.current.scale.set(1.5, 1.5, 1.5); // Scaled up pack module
                const mat = flyingPackRef.current.material as THREE.MeshStandardMaterial;
                if (mat) { mat.color.set('#ef4444'); mat.emissive.set('#ef4444'); mat.emissiveIntensity = 0.8; }
                const progress = Math.min(elapsedInState / 1.5, 1.0);
                // Translate depleted pack out of TukTuk's battery bay slot to corner tower (-1.4, -0.95, -1.8)
                flyingPackGroupRef.current.position.x = THREE.MathUtils.lerp(-0.5, -1.4, progress);
                flyingPackGroupRef.current.position.y = THREE.MathUtils.lerp(-0.88, -0.4, progress);
                flyingPackGroupRef.current.position.z = THREE.MathUtils.lerp(-0.54, -1.8, progress);
                if (progress >= 1.0) setSwapState('balancing');
            }
        } 
        else if (swapState === 'balancing') {
            setStatusText("⚡ DIAGNOSTICS: ACTIVE CELL AUTOMATED BALANCING");
            setThemeColor("#00f5ff");
            if (flyingPackGroupRef.current) flyingPackGroupRef.current.scale.set(0, 0, 0);
            batteryGlowRefs.forEach((ref, idx) => {
                if (ref.current) {
                    ref.current.color.set(idx % 2 === 0 ? '#00f5ff' : '#10b981');
                    ref.current.emissive.set(idx % 2 === 0 ? '#00f5ff' : '#10b981');
                    ref.current.emissiveIntensity = 1.2 * Math.abs(Math.sin(time * 10));
                }
            });
            const progress = Math.min(elapsedInState / 2.5, 1.0);
            if (progress >= 1.0) setSwapState('inserting');
        } 
        else if (swapState === 'inserting') {
            setStatusText("✔ BALANCING COMPLETE: INSERTING CHARGED LFP UNITS");
            setThemeColor("#10b981");
            if (flyingPackGroupRef.current && flyingPackRef.current) {
                flyingPackGroupRef.current.scale.set(1.5, 1.5, 1.5); // Scaled up pack module
                const mat = flyingPackRef.current.material as THREE.MeshStandardMaterial;
                if (mat) { mat.color.set('#10b981'); mat.emissive.set('#10b981'); mat.emissiveIntensity = 0.6; }
                const progress = Math.min(elapsedInState / 1.5, 1.0);
                // Translate charged pack from battery tower back into TukTuk's battery bay slot
                flyingPackGroupRef.current.position.x = THREE.MathUtils.lerp(-1.4, -0.5, progress);
                flyingPackGroupRef.current.position.y = THREE.MathUtils.lerp(-0.4, -0.88, progress);
                flyingPackGroupRef.current.position.z = THREE.MathUtils.lerp(-1.8, -0.54, progress);
                if (progress >= 1.0) setSwapState('leaving');
            }
        } 
        else if (swapState === 'leaving') {
            setStatusText("🛺 SYSTEM LOCK: OPTIMAL SOE SECURED. DEPARTING.");
            setThemeColor("#10b981");
            if (flyingPackGroupRef.current) flyingPackGroupRef.current.scale.set(0, 0, 0);
            if (tukTukRef.current) {
                const progress = Math.min(elapsedInState / 2.0, 1.0);
                tukTukRef.current.position.x = -0.5;
                tukTukRef.current.position.y = -0.98;
                tukTukRef.current.position.z = THREE.MathUtils.lerp(-0.5, -2.5, progress); // Travel from Center Z (-0.5) to Visual Right (-Z)
                tukTukRef.current.rotation.y = Math.PI; // Faces Visual Right during movement
                if (progress >= 1.0) setSwapState('idle');
            }
        }

        // Sliding Garage Doors Animations
        let entryDoorY = -0.65;
        if (swapState === 'entering') {
            if (elapsedInState < 0.5) {
                entryDoorY = THREE.MathUtils.lerp(-0.65, 0.25, elapsedInState / 0.5);
            } else if (elapsedInState < 1.5) {
                entryDoorY = 0.25;
            } else {
                entryDoorY = THREE.MathUtils.lerp(0.25, -0.65, (elapsedInState - 1.5) / 0.5);
            }
        }
        if (entryDoorRef.current) entryDoorRef.current.position.y = entryDoorY;

        let exitDoorY = -0.65;
        if (swapState === 'leaving') {
            if (elapsedInState < 0.5) {
                exitDoorY = THREE.MathUtils.lerp(-0.65, 0.25, elapsedInState / 0.5);
            } else if (elapsedInState < 1.5) {
                exitDoorY = 0.25;
            } else {
                exitDoorY = THREE.MathUtils.lerp(0.25, -0.65, (elapsedInState - 1.5) / 0.5);
            }
        }
        if (exitDoorRef.current) exitDoorRef.current.position.y = exitDoorY;

        // Dynamic status charts calculations
        let activeSegs = 2;
        let soc = 0.2;
        if (swapState === 'balancing') {
            const p = Math.min(elapsedInState / 2.5, 1.0);
            activeSegs = Math.floor(THREE.MathUtils.lerp(2, 10, p));
            soc = THREE.MathUtils.lerp(0.2, 1.0, p);
        } else if (swapState === 'inserting' || swapState === 'leaving') {
            activeSegs = 10;
            soc = 1.0;
        }

        // Animate Segmented Charge Bar
        if (chargeBarGroupRef.current) {
            chargeBarGroupRef.current.children.forEach((mesh, idx) => {
                const m = mesh as THREE.Mesh;
                const mat = m.material as THREE.MeshBasicMaterial;
                if (mat) {
                    if (idx < activeSegs) {
                        if (activeSegs <= 3) mat.color.set(new THREE.Color('#f43f5e'));
                        else if (activeSegs <= 7) mat.color.set(new THREE.Color('#eab308'));
                        else mat.color.set(new THREE.Color('#10b981'));
                    } else {
                        mat.color.set(new THREE.Color('#1e293b'));
                    }
                }
            });
        }

        // Animate Cell balancing Wave Graph
        if (cellGraphGroupRef.current) {
            cellGraphGroupRef.current.children.forEach((mesh, idx) => {
                if (idx < 8) {
                    const m = mesh as THREE.Mesh;
                    let h = 0.1;
                    if (swapState === 'balancing') {
                        h = 0.06 + Math.sin(time * 12 + idx * 2) * 0.03;
                    } else if (swapState === 'inserting' || swapState === 'leaving') {
                        h = 0.09;
                    } else {
                        h = 0.03 + Math.sin(idx * 1.5) * 0.015;
                    }
                    m.scale.y = h / 0.1;
                    m.position.y = h / 2;
                    const mat = m.material as THREE.MeshBasicMaterial;
                    if (mat) mat.color.set(new THREE.Color(themeColor));
                }
            });
        }

        // Rotate SOC Dial Needle
        if (socNeedleRef.current) {
            socNeedleRef.current.rotation.z = Math.PI * 0.75 - soc * Math.PI * 1.5;
        }

        setLeftTelemetry(`[STATE: ${swapState.toUpperCase()}]`);
        setRightTelemetry(`[FREQ: 51.2V NOM]`);
        conduitRefs.forEach((ref) => {
            if (ref.current) {
                ref.current.color.copy(new THREE.Color(themeColor));
                ref.current.emissive.copy(new THREE.Color(themeColor));
            }
        });
    });

    return (
        <group position={[-4.5, 1.1, -1.0]}>
            {/* Clear Floor Plane Base with Reflective Sheen */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
                <planeGeometry args={[4.8, 4.8]} />
                <meshStandardMaterial color="#090f1e" roughness={0.4} metalness={0.5} />
            </mesh>

            <group scale={[mobileScale, mobileScale, mobileScale]} position={[0, -1.1 * (1 - mobileScale), 0]}>
                {/* Central Docking Platform (Shifted Closer to the Wall X=-0.5, Z=-0.5) */}
                <mesh position={[-0.5, -1.07, -0.5]} receiveShadow castShadow>
                <cylinderGeometry args={[1.1, 1.15, 0.12, 32]} />
                <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[-0.5, -1.01, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.05, 1.09, 32]} />
                <meshBasicMaterial color={themeColor} />
            </mesh>

            {/* Subtle Accent Spotlight over Central Platform */}
            <pointLight position={[-0.5, 1.2, -0.5]} color="#00f5ff" intensity={2.5} distance={4.5} decay={2} castShadow />

            {/* Detailed Transiting Pack Module Group */}
            <group ref={flyingPackGroupRef}>
                <mesh ref={flyingPackRef} castShadow>
                    <boxGeometry args={[0.22, 0.06, 0.14]} />
                    <meshStandardMaterial roughness={0.3} metalness={0.5} />
                </mesh>
                <mesh position={[-0.111, 0, 0]} castShadow>
                    <boxGeometry args={[0.004, 0.064, 0.144]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.8} />
                </mesh>
                <mesh position={[0.111, 0, 0]} castShadow>
                    <boxGeometry args={[0.004, 0.064, 0.144]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.8} />
                </mesh>
                <mesh position={[0, 0.035, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.003, 0.003, 0.06, 8]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.8} />
                </mesh>
            </group>

            {/* 🎯 TARGET HOTSPOTS */}
            <InfoHotspot position={[-1.4, 0.2, -1.8]} color="#00f5ff" label="DIAGNOSTICS ARRAYS" subtext="State-of-Charge monitoring with rapid cell micro-balancing modules." />
            <InfoHotspot position={[1.2, 0.2, -1.8]} color="#10b981" label="GRID STORAGE MATRIX" subtext="Repurposing spent lot vehicle fields into active enterprise hardware panels." />

            {/* 📊 HIGH-VISIBILITY FLOATING TECH HUD PARAMETERS SPEC CARD (Moved to Left Wall Z=2.41) */}
            <group position={[-1.3, 0.35, 2.41]} rotation={[0, Math.PI, 0]} scale={[1.1, 1.1, 1.1]}>
                {/* Clean dark background backplate canvas layer */}
                <mesh>
                    <planeGeometry args={[1.45, 0.7]} />
                    <meshBasicMaterial color="#070a12" transparent opacity={0.94} />
                </mesh>
                
                <Suspense fallback={null}>
                    {/* NO SECOND INVERSION LAYERS — Text meshes inherit parent wall coordinates to face out into the chamber aisle */}
                    <Text position={[0, 0.24, 0.01]} color="#38bdf8" fontSize={0.045 * textScale} fontWeight={900} material-depthWrite={false}>
                        DIAGNOSTIC ARRAYS
                    </Text>
                    
                    {/* Aligned left margins using uniform positive offsets */}
                    <Text position={[-0.58, 0.12, 0.01]} anchorX="left" color="#ffffff" fontSize={0.034 * textScale} fontWeight={800} material-depthWrite={false}>
                        CHEMISTRY: LFP COMPLIANT
                    </Text>
                    <Text position={[-0.58, 0.02, 0.01]} anchorX="left" color="#cbd5e1" fontSize={0.032 * textScale} fontWeight={700} material-depthWrite={false}>
                        CONFIG: 16S2P / 51.2V NOM
                    </Text>
                    <Text position={[-0.58, -0.08, 0.01]} anchorX="left" color="#cbd5e1" fontSize={0.032 * textScale} fontWeight={700} material-depthWrite={false}>
                        CERT: AIS-156 OK
                    </Text>
                    <Text position={[-0.58, -0.18, 0.01]} anchorX="left" color="#10b981" fontSize={0.034 * textScale} fontWeight={800} material-depthWrite={false}>
                        SOH STATUS: 100% BALANCED
                    </Text>
                    
                    {/* Analog State-Of-Charge Circular Needle Dial Gauge */}
                    <group position={[0.42, -0.04, 0.01]} scale={0.8}>
                        <mesh><ringGeometry args={[0.16, 0.18, 32, 1, Math.PI * 0.25, Math.PI * 1.5]} /><meshStandardMaterial color="#334155" roughness={0.5} /></mesh>
                        <mesh><ringGeometry args={[0.16, 0.18, 32, 1, Math.PI * 0.25, Math.PI * 0.5]} /><meshBasicMaterial color="#f43f5e" /></mesh>
                        <mesh><ringGeometry args={[0.16, 0.18, 32, 1, Math.PI * 0.75, Math.PI * 0.5]} /><meshBasicMaterial color="#eab308" /></mesh>
                        <mesh><ringGeometry args={[0.16, 0.18, 32, 1, Math.PI * 1.25, Math.PI * 0.5]} /><meshBasicMaterial color="#10b981" /></mesh>
                        
                        {/* Dynamic Sweep needle point rotation mesh axis indicator */}
                        <group ref={socNeedleRef}>
                            <mesh position={[0, 0.07, 0.002]}>
                                <boxGeometry args={[0.012, 0.14, 0.002]} />
                                <meshBasicMaterial color="#ffffff" />
                            </mesh>
                        </group>
                        
                        <Text position={[0, -0.12, 0.005]} anchorX="center" color="#38bdf8" fontSize={0.032 * textScale} fontWeight={800} material-depthWrite={false}>
                            SOC
                        </Text>
                    </group>
                </Suspense>
            </group>

            {/* 🔋 COMPACT BATTERY TOWER (Shifted a bit right to X=-1.4, Z=-1.8, Detailed battery boxes) */}
            <group position={[-1.4, -0.95, -1.8]} rotation={[0, Math.PI / 2, 0]}>
                {URJA_BATTERY_ITEMS.map((item, idx) => {
                    const yPos = idx * 0.25; // Stack interval scaled up
                    return (
                        <group key={item.id} position={[0, yPos, 0]}>
                            {/* Main Box */}
                            <RoundedBox position={[0, 0, 0]} args={[0.65, 0.16, 0.42]} radius={0.012} castShadow>
                                <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.1} />
                            </RoundedBox>
                            {/* Side Bumpers */}
                            <mesh position={[-0.33, 0, 0]} castShadow>
                                <boxGeometry args={[0.01, 0.17, 0.43]} />
                                <meshStandardMaterial color="#1e293b" roughness={0.8} />
                            </mesh>
                            <mesh position={[0.33, 0, 0]} castShadow>
                                <boxGeometry args={[0.01, 0.17, 0.43]} />
                                <meshStandardMaterial color="#1e293b" roughness={0.8} />
                            </mesh>
                            {/* Top Handle */}
                            <mesh position={[0, 0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
                                <cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />
                                <meshStandardMaterial color="#334155" metalness={0.8} />
                            </mesh>
                            {/* Cooling Fins / Grille Pattern */}
                            <mesh position={[0, 0.045, 0.212]} castShadow>
                                <boxGeometry args={[0.54, 0.012, 0.002]} />
                                <meshStandardMaterial color="#475569" roughness={0.5} />
                            </mesh>
                            <mesh position={[0, -0.045, 0.212]} castShadow>
                                <boxGeometry args={[0.54, 0.012, 0.002]} />
                                <meshStandardMaterial color="#475569" roughness={0.5} />
                            </mesh>
                            {/* Status LED light */}
                            <mesh position={[-0.22, 0, 0.213]} rotation={[Math.PI / 2, 0, 0]}>
                                <cylinderGeometry args={[0.012, 0.012, 0.005, 8]} />
                                <meshBasicMaterial color="#00f5ff" />
                            </mesh>
                            <mesh position={[0, 0, 0.212]}>
                                <planeGeometry args={[0.34, 0.042]} />
                                <meshStandardMaterial ref={batteryGlowRefs[idx]} color="#10b981" emissive="#10b981" />
                            </mesh>
                            <Suspense fallback={null}>
                                <Text position={[0, 0, 0.215]} color="#0f172a" fontSize={0.022 * textScale} fontWeight={900} material-depthWrite={false}>
                                    LFP PACK
                                </Text>
                            </Suspense>
                        </group>
                    );
                })}
            </group>

            {/* 🛺 HIGH-FIDELITY, STYLIZED ELECTRIC TUKTUK (Green chassis, safety bars, dashboard, mirrors, headlights, and detailed hubcap wheels) */}
            <group ref={tukTukRef}>
                {/* Sleek Green Main Body Chassis */}
                <mesh position={[0, 0.1, 0]} castShadow>
                    <boxGeometry args={[0.3, 0.2, 0.5]} />
                    <meshStandardMaterial color="#10b981" roughness={0.2} metalness={0.5} />
                </mesh>

                {/* Explicit Open Battery Bay Slot Cutout */}
                <mesh position={[0, 0.12, -0.05]} receiveShadow>
                    <boxGeometry args={[0.24, 0.16, 0.18]} />
                    <meshStandardMaterial color="#090f1e" roughness={0.8} />
                </mesh>

                {/* Cabin Seats */}
                {/* Driver Seat */}
                <mesh position={[0, 0.15, 0.05]} castShadow>
                    <boxGeometry args={[0.22, 0.04, 0.12]} />
                    <meshStandardMaterial color="#111827" roughness={0.8} />
                </mesh>
                {/* Passenger Seat */}
                <mesh position={[0, 0.18, -0.16]} castShadow>
                    <boxGeometry args={[0.26, 0.04, 0.1]} />
                    <meshStandardMaterial color="#111827" roughness={0.8} />
                </mesh>

                {/* Windshield Frame & Glass */}
                <group position={[0, 0.28, 0.17]} rotation={[-0.15, 0, 0]}>
                    <RoundedBox position={[0, 0, 0]} args={[0.28, 0.18, 0.015]} radius={0.002} castShadow>
                        <meshStandardMaterial color="#1e293b" roughness={0.5} />
                    </RoundedBox>
                    <mesh position={[0, 0, 0.002]}>
                        <planeGeometry args={[0.26, 0.16]} />
                        <meshPhysicalMaterial transmission={0.9} transparent opacity={0.4} color="#bae6fd" roughness={0.1} />
                    </mesh>
                </group>

                {/* Rear-View Side Mirrors */}
                <group position={[-0.15, 0.32, 0.16]}>
                    <mesh rotation={[0, 0, -Math.PI / 4]}><cylinderGeometry args={[0.004, 0.004, 0.06]} /><meshStandardMaterial color="#475569" metalness={0.7} /></mesh>
                    <mesh position={[-0.03, 0.03, 0.01]}><boxGeometry args={[0.01, 0.04, 0.02]} /><meshStandardMaterial color="#1f2937" /></mesh>
                </group>
                <group position={[0.15, 0.32, 0.16]}>
                    <mesh rotation={[0, 0, Math.PI / 4]}><cylinderGeometry args={[0.004, 0.004, 0.06]} /><meshStandardMaterial color="#475569" metalness={0.7} /></mesh>
                    <mesh position={[0.03, 0.03, 0.01]}><boxGeometry args={[0.01, 0.04, 0.02]} /><meshStandardMaterial color="#1f2937" /></mesh>
                </group>

                {/* Side Safety Bars */}
                <mesh position={[-0.155, 0.2, -0.05]}>
                    <cylinderGeometry args={[0.005, 0.005, 0.25]} />
                    <meshStandardMaterial color="#eab308" roughness={0.5} />
                </mesh>
                <mesh position={[0.155, 0.2, -0.05]}>
                    <cylinderGeometry args={[0.005, 0.005, 0.25]} />
                    <meshStandardMaterial color="#eab308" roughness={0.5} />
                </mesh>

                {/* Front Bumper Guard */}
                <mesh position={[0, 0.06, 0.26]} castShadow>
                    <boxGeometry args={[0.22, 0.04, 0.04]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.8} />
                </mesh>

                {/* Cabin Canopy Pillars */}
                <mesh position={[-0.14, 0.3, 0.18]}>
                    <cylinderGeometry args={[0.01, 0.01, 0.25, 8]} />
                    <meshStandardMaterial color="#334155" metalness={0.7} />
                </mesh>
                <mesh position={[0.14, 0.3, 0.18]}>
                    <cylinderGeometry args={[0.01, 0.01, 0.25, 8]} />
                    <meshStandardMaterial color="#334155" metalness={0.7} />
                </mesh>

                {/* Steering Handlebars & Dashboard */}
                <mesh position={[0, 0.18, 0.14]} rotation={[0.3, 0, 0]}>
                    <cylinderGeometry args={[0.008, 0.008, 0.14]} />
                    <meshStandardMaterial color="#64748b" metalness={0.8} />
                </mesh>
                <mesh position={[0, 0.25, 0.16]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.008, 0.008, 0.18]} />
                    <meshStandardMaterial color="#1f2937" />
                </mesh>
                <mesh position={[0, 0.22, 0.15]}>
                    <planeGeometry args={[0.08, 0.04]} />
                    <meshBasicMaterial color="#0284c7" />
                </mesh>

                {/* Canopy Roof Plate */}
                <mesh position={[0, 0.42, 0]} castShadow>
                    <boxGeometry args={[0.3, 0.01, 0.48]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.5} />
                </mesh>

                {/* Glowing LED Headlights */}
                <mesh position={[-0.09, 0.14, 0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.024, 0.024, 0.01, 16]} />
                    <meshStandardMaterial color="#ffedd5" emissive="#ffedd5" emissiveIntensity={2.5} />
                </mesh>
                <mesh position={[0.09, 0.14, 0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.024, 0.024, 0.01, 16]} />
                    <meshStandardMaterial color="#ffedd5" emissive="#ffedd5" emissiveIntensity={2.5} />
                </mesh>

                {/* Taillights & License Plate */}
                <mesh position={[-0.11, 0.14, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.016, 0.016, 0.01, 16]} />
                    <meshStandardMaterial color="#fca5a5" emissive="#ef4444" emissiveIntensity={2} />
                </mesh>
                <mesh position={[0.11, 0.14, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.016, 0.016, 0.01, 16]} />
                    <meshStandardMaterial color="#fca5a5" emissive="#ef4444" emissiveIntensity={2} />
                </mesh>
                <mesh position={[0, 0.1, -0.252]}>
                    <planeGeometry args={[0.1, 0.04]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>

                {/* 3 Dark Wheels with Shiny Chrome Hubcaps */}
                {/* Front Wheel */}
                <group position={[0, 0.03, 0.2]} rotation={[0, 0, Math.PI / 2]}>
                    <mesh castShadow>
                        <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
                        <meshStandardMaterial color="#1f2937" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, 0.001, 0]}>
                        <cylinderGeometry args={[0.035, 0.035, 0.052, 12]} />
                        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
                    </mesh>
                </group>
                {/* Rear Left Wheel */}
                <group position={[-0.17, 0.03, -0.16]} rotation={[0, 0, Math.PI / 2]}>
                    <mesh castShadow>
                        <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
                        <meshStandardMaterial color="#1f2937" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, 0.001, 0]}>
                        <cylinderGeometry args={[0.035, 0.035, 0.052, 12]} />
                        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
                    </mesh>
                </group>
                {/* Rear Right Wheel */}
                <group position={[0.17, 0.03, -0.16]} rotation={[0, 0, Math.PI / 2]}>
                    <mesh castShadow>
                        <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
                        <meshStandardMaterial color="#1f2937" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, 0.001, 0]}>
                        <cylinderGeometry args={[0.035, 0.035, 0.052, 12]} />
                        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
                    </mesh>
                </group>
            </group>

            {/* 🎮 CONTROLS INTERFACE CONSOLE (Shifted backward/leftward to [0.9, -0.4, 1.1], rotated to face the platform Math.PI * 0.75) */}
            {currentView !== 'outside' && (
                <group position={[0.9, -0.4, 1.1]} rotation={[0, Math.PI * 0.75, 0]}>
                    <RoundedBox position={[0, -0.2, 0]} args={[0.55, 0.5, 0.22]} radius={0.01}>
                        <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.8} />
                    </RoundedBox>
                    <mesh position={[0, 0.05, 0]} rotation={[-0.35, 0, 0]}>
                        <planeGeometry args={[0.52, 0.22]} />
                        <meshStandardMaterial color="#0f172a" />
                    </mesh>
                    <group position={[-0.15, 0.08, 0.03]} rotation={[-0.35, 0, 0]}>
                        <mesh onClick={handleTriggerSimulation} rotation={[Math.PI / 2, 0, 0]} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'default'; }}>
                            <cylinderGeometry args={[0.07, 0.075, 0.03, 16]} />
                            <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={swapState === 'idle' ? 1.2 : 0.2} />
                        </mesh>
                        <Suspense fallback={null}>
                            <Text position={[0, 0.09, 0.01]} color="#00f5ff" fontSize={0.024 * textScale} fontWeight={900} material-depthWrite={false}>[ RUN ]</Text>
                        </Suspense>
                    </group>
                    <group position={[0.15, 0.08, 0.03]} rotation={[-0.35, 0, 0]}>
                        <mesh onClick={onClick} rotation={[Math.PI / 2, 0, 0]} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'default'; }}>
                            <cylinderGeometry args={[0.07, 0.075, 0.03, 16]} />
                            <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={1.2} />
                        </mesh>
                        <Suspense fallback={null}>
                            <Text position={[0, 0.09, 0.01]} color="#f43f5e" fontSize={0.024 * textScale} fontWeight={900} material-depthWrite={false}>[ EXIT ]</Text>
                        </Suspense>
                    </group>
                </group>
            )}

            {/* TELEMETRY DISPLAY MODULE SCREEN (Left Wall Area - Stacked vertically at Y=0.6, Z=0.8, with drawings) */}
            {currentView !== 'outside' && (
                <group position={[-2.42, 0.6, 0.8]} rotation={[0, Math.PI / 2, 0]} scale={[1.1, 1.1, 1.1]}>
                    <RoundedBox position={[0, 0, 0]} args={[2.4, 0.62, 0.05]} castShadow radius={0.01} receiveShadow>
                        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
                    </RoundedBox>
                    <mesh position={[0, 0, 0.022]}>
                        <planeGeometry args={[2.32, 0.54]} />
                        <meshStandardMaterial color="#050812" roughness={0.2} metalness={0.3} />
                    </mesh>
                    <Suspense fallback={null}>
                        <group>
                            {/* Left Column: Live Cell Voltage wave graph drawing */}
                            <group ref={cellGraphGroupRef} position={[-0.88, -0.08, 0.028]}>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <mesh key={i} position={[i * 0.025 - 0.0875, 0.05, 0]}>
                                        <planeGeometry args={[0.014, 0.1]} />
                                        <meshBasicMaterial color={themeColor} />
                                    </mesh>
                                ))}
                                {/* Base Line */}
                                <mesh position={[0, -0.005, 0]}>
                                    <planeGeometry args={[0.22, 0.002]} />
                                    <meshBasicMaterial color="#334155" />
                                </mesh>
                                <Text position={[0, -0.03, 0]} color="#64748b" fontSize={0.016 * textScale} fontWeight={700} material-depthWrite={false}>CELL BALANCING</Text>
                            </group>

                            {/* Center Column: Telemetry info text */}
                            <group position={[0.05, 0.04, 0.028]}>
                                <Text position={[0, 0.1, 0]} color="#94a3b8" fontSize={0.024 * textScale} fontWeight={800} material-depthWrite={false}>URJA INFRASTRUCTURE</Text>
                                <Text position={[0, 0.0, 0]} color={themeColor} fontSize={0.036 * textScale} fontWeight={900} letterSpacing={0.01} material-depthWrite={false}>{statusText}</Text>
                                <Text position={[-0.4, -0.08, 0]} color={themeColor} fontSize={0.02 * textScale} fontWeight={700} material-depthWrite={false}>{leftStat}</Text>
                                <Text position={[0.4, -0.08, 0]} color={themeColor} fontSize={0.02 * textScale} fontWeight={700} material-depthWrite={false}>{rightStat}</Text>
                            </group>

                            {/* Right Column: Dynamic Segmented Charge Bar drawing */}
                            <group position={[0.78, 0.0, 0.028]}>
                                <Text position={[0, 0.08, 0]} color="#64748b" fontSize={0.016 * textScale} fontWeight={700} material-depthWrite={false}>CHARGE STATUS</Text>
                                <group ref={chargeBarGroupRef} position={[0, 0, 0]}>
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <mesh key={i} position={[(i - 4.5) * 0.024, -0.02, 0]}>
                                            <planeGeometry args={[0.016, 0.04]} />
                                            <meshBasicMaterial color="#1e293b" />
                                        </mesh>
                                    ))}
                                </group>
                                <Text position={[0, -0.09, 0]} color="#cbd5e1" fontSize={0.018 * textScale} fontWeight={800} material-depthWrite={false}>BaaS NETWORK</Text>
                            </group>
                        </group>
                    </Suspense>
                </group>
            )}

            {/* BACK WALL HARDWARE STORAGE CABINET RACKS */}
            {currentView !== 'outside' && (
                <group position={[1.2, -0.2, -1.8]}>
                    <RoundedBox position={[0, 0, 0]} args={[0.55, 1.4, 0.45]} radius={0.01} castShadow>
                        <meshStandardMaterial color="#0f172a" roughness={0.9} />
                    </RoundedBox>
                    {[-0.32, 0.02, 0.36].map((y, i) => (
                        <mesh key={i} position={[0, y + 0.45, 0.252]}><boxGeometry args={[0.42, 0.14, 0.02]} /><meshStandardMaterial color="#334155" /></mesh>
                    ))}
                </group>
            )}

                {/* Corporate brand signature plaque (Stacked vertically at Y=-0.3, Z=0.8) */}
                {currentView !== 'outside' && logoTexture && (
                    <group position={[-2.42, -0.3, 0.8]} rotation={[0, Math.PI / 2, 0]}>
                        <RoundedBox position={[0, 0, 0]} args={[2.0, 0.45, 0.03]} radius={0.012} castShadow>
                            <meshStandardMaterial color="#1e293b" roughness={0.5} />
                        </RoundedBox>
                        <mesh position={[0, 0, 0.018]} scale={0.34}>
                            <planeGeometry args={[logoAspect, 1]} />
                            <meshBasicMaterial map={logoTexture} transparent depthWrite={false} />
                        </mesh>
                    </group>
                )}
            </group>

            {/* Entry Garage Door Portal (Front Wall Z=2.4) */}
            <mesh position={[-0.5, -0.65, 2.41]}>
                <planeGeometry args={[0.56, 0.9]} />
                <meshBasicMaterial color="#020617" />
            </mesh>
            <group ref={entryDoorRef} position={[-0.5, -0.65, 2.43]}>
                <RoundedBox position={[0, 0, 0]} args={[0.54, 0.9, 0.02]} radius={0.005} castShadow>
                    <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.5} />
                </RoundedBox>
                {[-0.3, -0.1, 0.1, 0.3].map((yVal, i) => (
                    <mesh key={i} position={[0, yVal, 0.012]} castShadow>
                        <boxGeometry args={[0.54, 0.02, 0.005]} />
                        <meshStandardMaterial color="#475569" roughness={0.4} />
                    </mesh>
                ))}
            </group>
            {/* Entry Shutter Frame (Tracks & Header Housing) */}
            <mesh position={[-0.77, -0.65, 2.44]} castShadow>
                <boxGeometry args={[0.03, 0.9, 0.03]} />
                <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[-0.23, -0.65, 2.44]} castShadow>
                <boxGeometry args={[0.03, 0.9, 0.03]} />
                <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[-0.5, -0.18, 2.45]} castShadow>
                <boxGeometry args={[0.58, 0.08, 0.05]} />
                <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Exit Garage Door Portal (Back Wall Z=-2.4) */}
            <mesh position={[-0.5, -0.65, -2.41]}>
                <planeGeometry args={[0.56, 0.9]} />
                <meshBasicMaterial color="#020617" />
            </mesh>
            <group ref={exitDoorRef} position={[-0.5, -0.65, -2.43]}>
                <RoundedBox position={[0, 0, 0]} args={[0.54, 0.9, 0.02]} radius={0.005} castShadow>
                    <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.5} />
                </RoundedBox>
                {[-0.3, -0.1, 0.1, 0.3].map((yVal, i) => (
                    <mesh key={i} position={[0, yVal, 0.012]} castShadow>
                        <boxGeometry args={[0.54, 0.02, 0.005]} />
                        <meshStandardMaterial color="#475569" roughness={0.4} />
                    </mesh>
                ))}
            </group>
            {/* Exit Shutter Frame (Tracks & Header Housing) */}
            <mesh position={[-0.77, -0.65, -2.44]} castShadow>
                <boxGeometry args={[0.03, 0.9, 0.03]} />
                <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[-0.23, -0.65, -2.44]} castShadow>
                <boxGeometry args={[0.03, 0.9, 0.03]} />
                <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[-0.5, -0.18, -2.45]} castShadow>
                <boxGeometry args={[0.58, 0.08, 0.05]} />
                <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
            </mesh>
        </group>
    );
};

const CONVEYOR_ITEMS = [
    { id: 1, offset: 0 },
    { id: 2, offset: 0.5 },
    { id: 3, offset: 1.0 }
];

let globalConveyorX = 0;

const QwikSellConveyor = () => {
    const conveyorGroup = useRef<THREE.Group>(null);
    const laserRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (laserRef.current) {
            laserRef.current.position.z = Math.sin(time * 3.5) * 0.25;
        }

        if (!conveyorGroup.current) return;
        const children = conveyorGroup.current.children;

        CONVEYOR_ITEMS.forEach((item, index) => {
            const child = children[index] as THREE.Group;
            if (!child) return;

            const progress = ((time * 0.25 + item.offset) % 1.5) / 1.5;
            const startZ = 0.8;
            const endZ = -0.8;
            const currentZ = THREE.MathUtils.lerp(startZ, endZ, progress);
            child.position.z = currentZ;

            if (index === 0) globalConveyorX = currentZ;

            child.traverse((node) => {
                if ((node as THREE.Mesh).isMesh) {
                    const mesh = node as THREE.Mesh;
                    if (mesh.name === 'screen') {
                        const mat = mesh.material as THREE.MeshStandardMaterial;
                        if (mat) {
                            if (currentZ > 0) {
                                mat.color.set('#ef4444');
                                mat.emissive.set('#ef4444');
                                mat.emissiveIntensity = 0.6;
                            } else {
                                mat.color.set('#10b981');
                                mat.emissive.set('#10b981');
                                mat.emissiveIntensity = 0.8;
                            }
                        }
                    }
                }
            });

            if (currentZ > 0) {
                child.rotation.y = 0;
            } else {
                child.rotation.y = time * 2.0;
            }
        });
    });

    return (
        <group position={[0.6, -1.1, 0.75]}>
            {/* Main Workbench Conveyor Bed Block */}
            <RoundedBox position={[0, 0.25, 0]} args={[0.5, 0.65, 1.8]} radius={0.015} castShadow receiveShadow>
                <meshStandardMaterial color="#334155" roughness={0.5} />
            </RoundedBox>

            {/* Dark Track Surface Strip */}
            <mesh position={[0, 0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.42, 1.76]} />
                <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>

            {/* Physical Roller Shafts */}
            {[-0.7, -0.35, 0, 0.35, 0.7].map((zPos, idx) => (
                <mesh key={`roller-${idx}`} position={[0, 0.565, zPos]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.012, 0.012, 0.44, 12]} />
                    <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
                </mesh>
            ))}

            {/* Industrial Side Guard Rails */}
            <RoundedBox position={[-0.23, 0.6, 0]} args={[0.015, 0.06, 1.78]} radius={0.002} castShadow>
                <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
            </RoundedBox>
            <RoundedBox position={[0.23, 0.6, 0]} args={[0.015, 0.06, 1.78]} radius={0.002} castShadow>
                <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
            </RoundedBox>

            {/* 🏷️ START POINT: INTAKE ZONE LANDMARK TEXT */}
            <group position={[0, 0.585, 0.78]} rotation={[-Math.PI / 2, 0, 0]}>
                <Suspense fallback={null}>
                    <Text anchorX="center" anchorY="middle" color="#ef4444" fontSize={0.032} fontWeight={800} material-depthWrite={false}>
                        [ INTAKE ]
                    </Text>
                </Suspense>
            </group>

            {/* 🏷️ END POINT: CERTIFIED PASS LANDMARK TEXT */}
            <group position={[0, 0.585, -0.78]} rotation={[-Math.PI / 2, 0, 0]}>
                <Suspense fallback={null}>
                    <Text anchorX="center" anchorY="middle" color="#10b981" fontSize={0.032} fontWeight={800} material-depthWrite={false}>
                        [ CERTIFIED ]
                    </Text>
                </Suspense>
            </group>

            {/* Cyan Scanning Arch Gate */}
            <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.26, 0.012, 8, 24, Math.PI]} />
                <meshBasicMaterial color="#00f5ff" />
            </mesh>
            <mesh ref={laserRef} position={[0, 0.59, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.38, 0.015]} />
                <meshBasicMaterial color="#00f5ff" transparent opacity={0.6} depthWrite={false} />
            </mesh>

            {/* Moving Hardware Assets — ELEVATED to Y=0.6 to sit perfectly on top of the rollers */}
            <group ref={conveyorGroup}>
                {CONVEYOR_ITEMS.map((item) => (
                    <group key={item.id} position={[0, 0.6, 0]} scale={0.75}>
                        <mesh name="base" castShadow>
                            <boxGeometry args={[0.28, 0.012, 0.2]} />
                            <meshStandardMaterial color="#475569" roughness={0.4} />
                        </mesh>
                        <group position={[0, 0.006, -0.095]} rotation={[-0.45, 0, 0]}>
                            <mesh name="lid" castShadow position={[0, 0.09, 0]}>
                                <boxGeometry args={[0.28, 0.18, 0.01]} />
                                <meshStandardMaterial color="#334155" roughness={0.5} />
                            </mesh>
                            <mesh name="screen" position={[0, 0.09, 0.006]}>
                                <planeGeometry args={[0.26, 0.16]} />
                                <meshStandardMaterial color="#ef4444" roughness={0.1} />
                            </mesh>
                        </group>
                    </group>
                ))}
            </group>
        </group>
    );
};


// ========================================================
// QWIKSELL BLUEPRINT DIAGRAM FACTORY PIPELINE
// ========================================================

const QwikSellFactoryPipeline = () => {
    const laserLineRef = useRef<THREE.Mesh>(null);
    const conveyorBeltRef = useRef<THREE.Group>(null);

    const activeAssets = [
        { id: 1, stagger: 0 },
        { id: 2, stagger: 0.5 },
        { id: 3, stagger: 1.0 }
    ];

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // 1. Moving Cyber Laser Scan
        if (laserLineRef.current) {
            laserLineRef.current.position.x = Math.sin(time * 4) * 0.3;
        }

        // 2. Continuous Asset Translation Loop
        if (conveyorBeltRef.current) {
            conveyorBeltRef.current.children.forEach((child, idx) => {
                const progress = ((time * 0.2 + activeAssets[idx].stagger) % 1.5) / 1.5;

                // Slide horizontally along the main processing table surface
                const startX = 1.0;
                const endX = -1.0;
                const currentX = THREE.MathUtils.lerp(startX, endX, progress);
                child.position.x = currentX;

                const assetMesh = child.children[0] as THREE.Mesh;
                const assetMat = assetMesh.material as THREE.MeshStandardMaterial;
                if (!assetMat) return;

                // BEFORE SCANNER (Right Side): Old broken device state
                if (currentX > 0.1) {
                    assetMat.color.set('#ef4444');
                    assetMat.emissive.set('#ef4444');
                    assetMat.emissiveIntensity = 0.2;
                    child.position.y = 0.52;
                    child.rotation.y = 0;
                }
                // INSIDE SCANNER CHAMBER (Center): Active logical sanitization
                else if (currentX <= 0.1 && currentX > -0.1) {
                    assetMat.color.set('#00f5ff');
                    assetMat.emissive.set('#00f5ff');
                    assetMat.emissiveIntensity = 0.8;
                    child.position.y = 0.52 + Math.sin(progress * Math.PI * 10) * 0.01; // physical hum jitter
                }
                // AFTER CERTIFICATION (Left Side): Pristine, premium refurbished state
                else {
                    assetMat.color.set('#10b981');
                    assetMat.emissive.set('#10b981');
                    assetMat.emissiveIntensity = 0.3;
                    child.position.y = 0.52;
                    child.rotation.y = time * 2.0; // premium slow spin showcase
                }
            });
        }
    });

    return (
        <group position={[1.4, -1.1, -1.2]} rotation={[0, Math.PI / 2, 0]}>
            {/* Massive Factory Production Workbench Surface */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[2.4, 0.5, 0.6]} />
                <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>

            {/* The Ingestion Track Layer */}
            <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.3, 0.5]} />
                <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>

            {/* Central High-Tech Audit Archway scanner */}
            <mesh position={[0, 0.45, 0]} rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.3, 0.015, 8, 32, Math.PI]} />
                <meshBasicMaterial color="#00f5ff" />
            </mesh>
            <mesh ref={laserLineRef} position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.01, 0.45]} />
                <meshBasicMaterial color="#00f5ff" transparent opacity={0.7} depthWrite={false} />
            </mesh>

            {/* Scattered Scrap Pile Base on Ingestion Entryway (Right Edge) */}
            <group position={[1.0, 0.28, 0]}>
                <mesh castShadow><boxGeometry args={[0.15, 0.04, 0.15]} /><meshStandardMaterial color="#f43f5e" /></mesh>
                <mesh castShadow position={[0.04, 0.04, -0.02]} rotation={[0, 0.4, 0]}><boxGeometry args={[0.12, 0.03, 0.12]} /><meshStandardMaterial color="#ef4444" /></mesh>
            </group>

            {/* Clean Storage Crates for Outgoing Lots (Left Edge) */}
            <group position={[-1.0, 0.28, 0]}>
                <mesh castShadow><boxGeometry args={[0.22, 0.06, 0.22]} /><meshStandardMaterial color="#065f46" roughness={0.5} /></mesh>
            </group>

            {/* Dynamic Moving Hardware Stream */}
            <group ref={conveyorBeltRef}>
                {activeAssets.map((asset) => (
                    <group key={asset.id} position={[0, 0.52, 0]}>
                        <mesh castShadow>
                            <boxGeometry args={[0.16, 0.02, 0.12]} />
                            <meshStandardMaterial roughness={0.4} />
                        </mesh>
                    </group>
                ))}
            </group>
        </group>
    );
};

const QwikSellStatusBoard = ({ logoTexture, logoAspect }: { logoTexture: THREE.Texture | null; logoAspect: number }) => {
    const { size } = useThree();
    const isMobileSB = size.width < 768 || size.width < size.height;
    const textScaleSB = isMobileSB ? (1 / 0.65) : 1.0;
    const [statusText, setStatusText] = useState("AWAITING INGESTION");
    const [leftTelemetry, setLeftTelemetry] = useState("[SYS: INIT]");
    const [rightTelemetry, setRightTelemetry] = useState("[BIT-RATE: 0B/s]");
    const [themeColor, setThemeColor] = useState("#94a3b8");
    
    const diagnosticLaserRef = useRef<THREE.Mesh>(null);
    const diagramCoreRef = useRef<THREE.Mesh>(null);
    const outerRingRef = useRef<THREE.Mesh>(null);
    const waveGroupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // 1. Maintain background visual rendering loops
        if (diagnosticLaserRef.current) {
            diagnosticLaserRef.current.position.y = Math.sin(time * 2.5) * 0.2;
        }
        if (diagramCoreRef.current) diagramCoreRef.current.rotation.z = time * 0.5;
        if (outerRingRef.current) outerRingRef.current.rotation.z = -time * 0.8;
        
        if (waveGroupRef.current) {
            waveGroupRef.current.children.forEach((bar, idx) => {
                const mesh = bar as THREE.Mesh;
                const scaleY = 1.0 + Math.sin(time * 6.0 + idx * 0.8) * 0.85;
                mesh.scale.y = scaleY;
                mesh.position.y = -0.1 + (scaleY * 0.02) / 2;
            });
        }

        // 2. INJECT PITCH DECK BUSINESS METRICS LOGIC
        setLeftTelemetry("MARKET: $5B | 50M UNITS");

        if (globalConveyorX > 0.2) {
            // STAGE 1: Asset Intake & Initial Inspection
            setStatusText("💻 INGESTING LAPTOP (ASP: ₹10K - ₹20K)");
            setRightTelemetry("[TECH: DIAGNOSTIC SOFTWARE]");
            setThemeColor("#f59e0b"); // Ingestion Warning Amber
        } else if (globalConveyorX <= 0.2 && globalConveyorX > -0.2) {
            // STAGE 2: Real-time Live Machine Valuating
            setStatusText("🔒 RUNNING LIVE AI VALUATION ENGINE...");
            setRightTelemetry("[TECH: AI PRICING ENGINE]");
            setThemeColor("#00f5ff"); // Scanning Cyan
        } else {
            // STAGE 3: Asset Certified and Ready for Bulk Liquidation
            setStatusText("✔ CERTIFIED LOT PASSED TO B2B MARKETPLACE");
            setRightTelemetry("[TECH: B2B LIQUIDATION]");
            setThemeColor("#10b981"); // Success Emerald Green
        }
    });

    return (
        // BOARD POSITION & SCALE INCREASE: Board scaled up to 1.25 for clear layout command
        <group position={[2.42, 0.72, -0.6]} rotation={[0, -Math.PI / 2, 0]} scale={[1.25, 1.25, 1.25]}>
            {/* Expanded Outer High-Tech Frame Casing */}
            <RoundedBox position={[0, 0, 0]} args={[2.1, 0.52, 0.04]} castShadow radius={0.012} receiveShadow>
                <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
            </RoundedBox>

            {/* Premium Matte Screen Glass Matrix Backdrop */}
            <mesh position={[0, 0, 0.022]}>
                <planeGeometry args={[2.04, 0.46]} />
                <meshStandardMaterial color="#050810" roughness={0.2} metalness={0.4} />
            </mesh>

            {/* TECHNICAL BLUEPRINT BACKDROP DRAWINGS */}
            <group position={[0, 0, 0.024]}>
                {/* Dense Matrix Grid lines */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <mesh key={`grid-v-${i}`} position={[-0.9 + i * 0.25, 0, 0]}>
                        <planeGeometry args={[0.002, 0.42]} />
                        <meshBasicMaterial color="#0e4f75" transparent opacity={0.18} depthWrite={false} />
                    </mesh>
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                    <mesh key={`grid-h-${i}`} position={[0, -0.18 + i * 0.09, 0]}>
                        <planeGeometry args={[2.0, 0.002]} />
                        <meshBasicMaterial color="#0e4f75" transparent opacity={0.18} depthWrite={false} />
                    </mesh>
                ))}

                {/* LEFT FLANK: Dual-Layer Spinning Telemetry Radar Crosshair Drawing */}
                <group position={[-0.78, 0.04, 0]}>
                    <mesh ref={diagramCoreRef}>
                        <ringGeometry args={[0.05, 0.055, 3, 1]} />
                        <meshBasicMaterial color={themeColor} transparent opacity={0.4} depthWrite={false} />
                    </mesh>
                    <mesh ref={outerRingRef}>
                        <ringGeometry args={[0.065, 0.07, 8, 1]} />
                        <meshBasicMaterial color={themeColor} transparent opacity={0.2} depthWrite={false} />
                    </mesh>
                </group>

                {/* RIGHT FLANK: Live Audio Frequency Pulse Bar Graph Drawings */}
                <group ref={waveGroupRef} position={[0.68, 0, 0]}>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <mesh key={`wave-bar-${i}`} position={[-0.08 + i * 0.025, -0.1, 0]}>
                            <planeGeometry args={[0.014, 0.02]} />
                            <meshBasicMaterial color={themeColor} transparent opacity={0.4} depthWrite={false} />
                        </mesh>
                    ))}
                </group>

                {/* Sweeping Neon Data Radar Laser Line */}
                <mesh ref={diagnosticLaserRef} position={[0, 0, 0.001]}>
                    <planeGeometry args={[2.02, 0.004]} />
                    <meshBasicMaterial color={themeColor} transparent opacity={0.5} depthWrite={false} />
                </mesh>
            </group>

            {/* TECHNICAL PARAMETER TEXT INJECTIONS */}
            <Suspense fallback={null}>
                <Text position={[-0.52, -0.14, 0.028]} anchorX="center" anchorY="middle" color={themeColor} fontSize={0.022 * textScaleSB} fontWeight={700} material-depthWrite={false}>
                    {leftTelemetry}
                </Text>
                <Text position={[0.52, -0.14, 0.028]} anchorX="center" anchorY="middle" color={themeColor} fontSize={0.022 * textScaleSB} fontWeight={700} material-depthWrite={false}>
                    {rightTelemetry}
                </Text>

                {/* Master System Central Processing Output Text String */}
                <Text position={[0, 0.04, 0.028]} anchorX="center" anchorY="middle" color={themeColor} fontSize={0.044 * textScaleSB} fontWeight={900} letterSpacing={0.01} material-depthWrite={false}>
                    {statusText}
                </Text>
            </Suspense>

            {/* BRAND LOGO OVERLAY SIGN: Positioned precisely just below the board bounds */}
            {logoTexture && (
                <group position={[0, -0.42, 0]}>
                    {/* Highly prominent console panel plate housing */}
                    <RoundedBox position={[0, 0, 0]} args={[1.32, 0.28, 0.02]} radius={0.01}>
                        <meshStandardMaterial color="#1e293b" roughness={0.5} />
                    </RoundedBox>
                    <mesh position={[0, 0, 0.011]} scale={0.21}>
                        <planeGeometry args={[logoAspect, 1]} />
                        <meshBasicMaterial map={logoTexture} transparent depthWrite={false} />
                    </mesh>
                </group>
            )}
        </group>
    );
};

const BlinkingLED = ({ color, speed, offset, position }: { color: string; speed: number; offset: number; position: [number, number, number] }) => {
    const matRef = useRef<THREE.MeshStandardMaterial>(null);
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (matRef.current) {
            const flash = Math.sin(time * speed + offset) > 0 ? 1.0 : 0.2;
            matRef.current.emissiveIntensity = flash;
        }
    });
    return (
        <mesh position={position}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial ref={matRef} color={color} emissive={color} emissiveIntensity={1.0} />
        </mesh>
    );
};

const QwikSellRoom: React.FC<RoomProps> = ({ currentView, logoTexture, logoAspect, onClick }) => {
    const { size } = useThree();
    const isMobile = size.width < 768 || size.width < size.height;
    const mobileScale = isMobile ? 0.65 : 1.0;
    const textScale = 1 / mobileScale;
    const laserMeshRef = useRef<THREE.Mesh>(null);
    const laserPlaneRef = useRef<THREE.Mesh>(null);
    const lidRef = useRef<THREE.Group>(null);
    const [sanitized, setSanitized] = useState(false);

    useFrame((state) => {
        if (currentView === 'outside') return;

        const time = state.clock.elapsedTime;
        if (laserMeshRef.current) {
            laserMeshRef.current.rotation.z = Math.sin(time * 2.0) * 0.2;
            const laserScale = 1.0 + Math.sin(time * 3.0) * 0.25;
            laserMeshRef.current.scale.set(laserScale, 1.0, laserScale);
        }
        
        let currentY = 0.22 + Math.sin(time * 2.0) * 0.18;
        if (laserPlaneRef.current) {
            laserPlaneRef.current.position.y = currentY;
        }

        // Smoothly hinge the laptop screen open when camera zooms into QwikSell room
        const targetLidRot = currentView === 'qwik' ? -0.35 : -Math.PI / 2;
        if (lidRef.current) {
            lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, targetLidRot, 0.08);
        }

        // Screen state shift logic: trigger bright green sanitized badge when laser swept over it
        if (currentView === 'qwik') {
            if (currentY < 0.18 && !sanitized) {
                setSanitized(true);
            }
        } else {
            if (sanitized) setSanitized(false);
        }
    });

    return (
        <group position={[4.5, 1.1, -1.0]}>
            {currentView !== 'outside' && (
                <group scale={[mobileScale, mobileScale, mobileScale]} position={[0, -1.1 * (1 - mobileScale), 0]}>
                    {/* Main Desk */}
                    <RoundedBox position={[0, -0.3, 0.8]} args={[1.8, 0.75, 0.8]} radius={0.02} smoothness={3} castShadow receiveShadow onClick={onClick}>
                        <meshStandardMaterial color="#1e293b" roughness={0.8} />
                    </RoundedBox>
            <mesh position={[0, 0.08, 0.8]} rotation={[-Math.PI / 2, 0, 0]} onClick={onClick}>
                <planeGeometry args={[1.0, 0.5]} />
                <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>

            {/* Mounted Conveyor System track loop */}
            <QwikSellConveyor />

            {/* Room Title */}
            <Suspense fallback={null}>
                <Text position={[0, 0.85, 0.8]} anchorX="center" anchorY="middle" color="#cbd5e1" fontSize={0.22 * textScale} material-depthWrite={false} onClick={onClick}>
                    QwikSell Chamber
                </Text>
            </Suspense>

            {/* NIST Data Wiping Workbench (Laptop on Desk) */}
            <group position={[0, 0.12, 0.85]}>
                <RoundedBox position={[0, 0, 0]} args={[0.3, 0.015, 0.2]} radius={0.005} castShadow>
                    <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
                </RoundedBox>
                <group ref={lidRef} position={[0, 0.005, -0.09]} rotation={[-Math.PI / 2, 0, 0]}>
                    <RoundedBox position={[0, 0.09, 0]} args={[0.3, 0.18, 0.012]} radius={0.005} castShadow>
                        <meshStandardMaterial color="#334155" roughness={0.5} />
                    </RoundedBox>
                    <mesh position={[0, 0.09, 0.008]}>
                        <planeGeometry args={[0.28, 0.16]} />
                        <meshStandardMaterial 
                            color={sanitized ? "#22c55e" : "#ef4444"} 
                            emissive={sanitized ? "#22c55e" : "#ef4444"} 
                            emissiveIntensity={1.2} 
                        />
                    </mesh>
                    <Suspense fallback={null}>
                        {sanitized ? (
                            <Text position={[0, 0.09, 0.011]} anchorX="center" anchorY="middle" color="#ffffff" fontSize={0.01 * textScale} material-depthWrite={false} maxWidth={0.26}>
                                [ NIST SP 800-88 SECURE ]{"\n\n"}Data Sanitized: 100% Secure{"\n"}Cryptographic Erasure OK
                            </Text>
                        ) : (
                            <Text position={[0, 0.09, 0.011]} anchorX="center" anchorY="middle" color="#ffffff" fontSize={0.012 * textScale} material-depthWrite={false} maxWidth={0.26}>
                                [ INGESTING DEVICE ]{"\n\n"}Performing diagnostics...{"\n"}NIST SP 800-88 Active
                            </Text>
                        )}
                    </Suspense>
                </group>
            </group>

            {/* Sweeping laser plane */}
            <mesh ref={laserPlaneRef} position={[0, 0.22, 0.85]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.5, 0.35]} />
                <meshBasicMaterial color="#00f5ff" transparent={true} opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>

            {/* Intake Scanning Pedestal (Left Front) */}
            <group position={[-1.4, -0.3, 1.3]}>
                <RoundedBox position={[0, 0.25, 0]} args={[0.45, 0.6, 0.45]} radius={0.02} smoothness={3} castShadow receiveShadow>
                    <meshStandardMaterial color="#0f172a" roughness={0.7} />
                </RoundedBox>
                <RoundedBox position={[0, 0.6, 0]} args={[0.35, 0.1, 0.35]} radius={0.01} castShadow>
                    <meshStandardMaterial color="#334155" roughness={0.4} />
                </RoundedBox>
                <mesh ref={laserMeshRef} position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <coneGeometry args={[0.26, 0.9, 4, 1, true]} />
                    <meshBasicMaterial color="#00f5ff" transparent={true} opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
                </mesh>
            </group>

            {/* IT Refurbishment Vault Matrix (Right Wall) */}
            <group position={[0.0, -0.2, -2.42]} rotation={[0, 0, 0]}>
                <RoundedBox position={[0, 0.45, 0]} args={[0.9, 1.4, 0.4]} radius={0.01} castShadow>
                    <meshStandardMaterial color="#0f172a" roughness={0.9} />
                </RoundedBox>
                {[-0.35, -0.1, 0.15, 0.4].map((y, idx) => (
                    <group key={idx} position={[0, y + 0.2, 0.05]}>
                        <RoundedBox args={[0.7, 0.16, 0.32]} radius={0.01} castShadow>
                            <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.8} />
                        </RoundedBox>
                        <mesh position={[0.22, 0, 0.162]}>
                            <planeGeometry args={[0.06, 0.06]} />
                            <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={1.2} />
                        </mesh>
                        <mesh position={[-0.24, 0, 0.162]}>
                            <sphereGeometry args={[0.015, 8, 8]} />
                            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.8} />
                        </mesh>
                    </group>
                ))}
            </group>

            {/* 🖥️ ADDITION 1: THE MAINFRAME SERVER TOWER BANK (Back-Left Corner Area) */}
            <group position={[2.42, -1.1, 1.1]} rotation={[0, -Math.PI / 2, 0]}>
                {/* Dual Server Enclosure Cabinets */}
                <RoundedBox position={[0, 0.9, 0]} args={[0.5, 1.8, 0.6]} castShadow radius={0.01}>
                    <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.7} />
                </RoundedBox>
                {/* Layered Internal Blade Slots with Staggered Blinking Connectivity Lights */}
                {[-0.6, -0.3, 0, 0.3, 0.6].map((yOffset, i) => (
                    <group key={`blade-${i}`} position={[0, yOffset + 0.9, 0.301]}>
                        <mesh><planeGeometry args={[0.42, 0.08]} /><meshStandardMaterial color="#1e293b" roughness={0.6} /></mesh>
                        {/* Blinking Optical LEDs */}
                        <BlinkingLED color="#00f5ff" speed={3.0 + i} offset={0} position={[-0.15, 0, 0]} />
                        <BlinkingLED color="#10b981" speed={2.0 + i} offset={Math.PI / 2} position={[-0.1, 0, 0]} />
                    </group>
                ))}
            </group>

            {/* 🧪 ADDITION 2: THE QUALITY ASSURANCE (QA) TECH WORKBENCH (Left Wall Area) */}
            <group position={[1.0, -1.1, -2.3]} rotation={[0, 0, 0]}>
                {/* Lab Testing Table Base */}
                <RoundedBox position={[0, 0.325, 0]} args={[1.2, 0.65, 0.45]} castShadow radius={0.01}>
                    <meshStandardMaterial color="#334155" roughness={0.7} />
                </RoundedBox>
                {/* Frosted Secondary Blueprint Diagnostic Monitor Display */}
                <group position={[0, 0.52, -0.1]} rotation={[-0.1, 0, 0]}>
                    <mesh castShadow><boxGeometry args={[0.5, 0.3, 0.02]} /><meshStandardMaterial color="#0f172a" /></mesh>
                    <mesh position={[0, 0, 0.011]}><planeGeometry args={[0.46, 0.26]} /><meshStandardMaterial color="#042f2e" emissive="#14b8a6" emissiveIntensity={0.2} /></mesh>
                    <Suspense fallback={null}>
                        <Text position={[0, 0, 0.013]} color="#14b8a6" fontSize={0.02 * textScale} fontWeight={800} material-depthWrite={false}>
                            [ SYSTEM DIAGNOSTIC: READY ]
                        </Text>
                    </Suspense>
                </group>
            </group>

            {/* Concrete factory pipeline track running sequentially */}
            <QwikSellFactoryPipeline />
            <QwikSellStatusBoard logoTexture={logoTexture} logoAspect={logoAspect} />
                </group>
            )}
        </group>
    );
};

// ========================================================
// 6. DYNAMIC CAMERA GEOMETRY CONTROLLER
// ========================================================

interface CameraControllerProps {
    currentView: string;
}

const CameraController: React.FC<CameraControllerProps> = ({ currentView }) => {
    const { camera, size } = useThree();

    const viewCoords = useMemo(() => {
        const isPortrait = size.width < size.height;
        if (isPortrait) {
            return {
                outside: { pos: new THREE.Vector3(0, 6.2, 23.5), look: new THREE.Vector3(0, 1.5, 4.5) },
                // Mobile lobby: camera moved back (z=7.5) so Urja & QwikSell gates are visible
                lobby: { pos: new THREE.Vector3(0, 1.6, 7.5), look: new THREE.Vector3(0, 1.4, -3.5) },
                urja: { pos: new THREE.Vector3(-1.8, 1.4, -0.6), look: new THREE.Vector3(-4.8, 1.15, -1.0) },
                qwik: { pos: new THREE.Vector3(1.8, 1.4, -0.6), look: new THREE.Vector3(4.8, 1.45, -1.0) }
            };
        }
        return {
            outside: { pos: new THREE.Vector3(0, 5.8, 19.5), look: new THREE.Vector3(0, 1.6, 5.0) },
            lobby: { pos: new THREE.Vector3(0, 1.55, 3.2), look: new THREE.Vector3(0, 1.5, -3.5) },
            urja: { pos: new THREE.Vector3(-2.0, 1.5, -1.0), look: new THREE.Vector3(-4.8, 1.15, -1.0) },
            qwik: { pos: new THREE.Vector3(2.0, 1.5, -1.0), look: new THREE.Vector3(4.8, 1.45, -1.0) }
        };
    }, [size.width, size.height]);

    const currentLookAt = useRef(new THREE.Vector3(0, 1.6, 5.0));

    useEffect(() => {
        const target = viewCoords[currentView as keyof typeof viewCoords];
        if (!target) return;

        gsap.to(camera.position, {
            x: target.pos.x,
            y: target.pos.y,
            z: target.pos.z,
            duration: 1.8,
            ease: 'power2.inOut'
        });

        gsap.to(currentLookAt.current, {
            x: target.look.x,
            y: target.look.y,
            z: target.look.z,
            duration: 1.8,
            ease: 'power2.inOut'
        });
    }, [currentView, camera, viewCoords]);

    // Adjust camera FOV for portrait screen layout to prevent left/right cutoffs
    useEffect(() => {
        const aspect = size.width / size.height;
        const pCam = camera as THREE.PerspectiveCamera;
        if (pCam.isPerspectiveCamera) {
            if (aspect < 1.0) {
                pCam.fov = Math.max(45, Math.min(68, 45 * (1.15 / aspect)));
            } else {
                pCam.fov = 45;
            }
            pCam.updateProjectionMatrix();
        }
    }, [size.width, size.height, camera]);

    useFrame(() => {
        camera.lookAt(currentLookAt.current);
    });

    return null;
};

const FarLeftEVStation = () => {
    return (
        <group position={[-14.2, 0, 1.0]}>
            {/* Concrete Pad */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
                <planeGeometry args={[3.0, 4.0]} />
                <meshStandardMaterial color="#475569" roughness={0.9} />
            </mesh>
            {/* Slate Curbs */}
            <RoundedBox position={[-1.52, 0.04, 0]} args={[0.05, 0.08, 4.0]} radius={0.01}>
                <meshStandardMaterial color="#1e293b" />
            </RoundedBox>
            <RoundedBox position={[1.52, 0.04, 0]} args={[0.05, 0.08, 4.0]} radius={0.01}>
                <meshStandardMaterial color="#1e293b" />
            </RoundedBox>

            {/* EV Commercial Charger Stand */}
            <group position={[-1.1, 0, 0]}>
                <RoundedBox position={[0, 0.65, 0]} args={[0.2, 1.3, 0.2]} radius={0.015} castShadow>
                    <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </RoundedBox>
                {/* Glowing Charger UI Screen */}
                <mesh position={[0, 0.95, 0.105]}>
                    <planeGeometry args={[0.12, 0.18]} />
                    <meshBasicMaterial color="#10b981" />
                </mesh>
            </group>

            {/* Low-Poly Parked Electric Vehicle */}
            <group position={[0.3, 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
                <RoundedBox position={[0, 0.15, 0]} args={[0.6, 0.3, 1.2]} radius={0.04} castShadow>
                    <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
                </RoundedBox>
                <mesh position={[0, 0.35, -0.1]} rotation={[-0.35, 0, 0]}>
                    <boxGeometry args={[0.5, 0.15, 0.4]} />
                    <meshPhysicalMaterial transmission={0.9} transparent color="#bae6fd" roughness={0.1} />
                </mesh>
            </group>

            {/* Glowing Neon Green Laser Power Cable */}
            <mesh position={[-0.4, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.015, 0.012, 1.2, 4]} />
                <meshBasicMaterial color="#10b981" />
            </mesh>
        </group>
    );
};

const FarRightQwikSellKiosk = () => {
    const holoRef = React.useRef<THREE.Group>(null);
    const glowRef = React.useRef<THREE.MeshBasicMaterial>(null);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        if (holoRef.current) {
            holoRef.current.rotation.y = time * 0.9;
            holoRef.current.position.y = 1.15 + Math.sin(time * 2.5) * 0.04;
        }
        if (glowRef.current) {
            glowRef.current.opacity = 0.4 + Math.abs(Math.sin(time * 3.5)) * 0.4;
        }
    });

    return (
        <group position={[11.5, 0, 2.0]}>
            {/* Foundation Pavement slab */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
                <planeGeometry args={[2.8, 2.8]} />
                <meshStandardMaterial color="#334155" roughness={0.85} />
            </mesh>

            {/* Main Re-Commerce Intake Vault Cabinet */}
            <RoundedBox position={[0, 0.5, 0]} args={[0.7, 1.0, 0.7]} radius={0.02} castShadow>
                <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
            </RoundedBox>

            {/* Glowing Matrix Interactive Intake Dock Drawer */}
            <mesh position={[0, 0.45, 0.352]}>
                <planeGeometry args={[0.45, 0.2]} />
                <meshBasicMaterial color="#00f5ff" />
            </mesh>

            {/* Hologram Projector Emitter Base */}
            <mesh position={[0, 1.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.15, 0.2, 0.02, 16]} />
                <meshStandardMaterial color="#475569" />
            </mesh>

            {/* Floating Wireframe Device Asset Scanning Matrix */}
            <group ref={holoRef}>
                {/* Laptop wireframe representation */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.45, 0.02, 0.3]} />
                    <meshBasicMaterial ref={glowRef} color="#00f5ff" transparent opacity={0.7} wireframe />
                </mesh>
                <mesh position={[0, 0.14, -0.14]} rotation={[0.35, 0, 0]}>
                    <boxGeometry args={[0.45, 0.28, 0.01]} />
                    <meshBasicMaterial color="#00f5ff" transparent opacity={0.5} wireframe />
                </mesh>
                {/* Scanner conical light cone ray */}
                <mesh position={[0, -0.18, 0]}>
                    <cylinderGeometry args={[0.06, 0.24, 0.35, 16, 1, true]} />
                    <meshBasicMaterial color="#00f5ff" transparent opacity={0.1} />
                </mesh>
            </group>
        </group>
    );
};

// ========================================================
// CORE EXIGO HEADQUARTERS HOUSING ENGINE
// ========================================================

export default function DataLifecycleEngine() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentView, setCurrentView] = useState('outside');
    const [gateOpen, setGateOpen] = useState(false);
    const [knockText, setKnockText] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const [urjaTexture, setUrjaTexture] = useState<THREE.Texture | null>(null);
    const [qwikTexture, setQwikTexture] = useState<THREE.Texture | null>(null);
    const [exigoTexture, setExigoTexture] = useState<THREE.Texture | null>(null);

    const [urjaAspect, setUrjaAspect] = useState(1.0);
    const [qwikAspect, setQwikAspect] = useState(1.0);
    const [exigoAspect, setExigoAspect] = useState(1.0);
    const [activePavementIdx, setActivePavementIdx] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleCardScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollLeft = e.currentTarget.scrollLeft;
        const cardWidth = window.innerWidth * 0.85 + 20;
        const currentIdx = Math.round(scrollLeft / cardWidth);

        if (currentIdx !== activePavementIdx && currentIdx >= 0 && currentIdx <= 4) {
            setActivePavementIdx(currentIdx);
        }
    };

    useEffect(() => {
        const loader = new THREE.TextureLoader();

        loader.load(urjaLogo, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = 16;
            setUrjaAspect(tex.image.width / tex.image.height);
            setUrjaTexture(tex);
        }, undefined, (err) => console.error('Failed loading Urja logo:', err));

        loader.load(qwikLogo, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = 16;
            setQwikAspect(tex.image.width / tex.image.height);
            setQwikTexture(tex);
        }, undefined, (err) => console.error('Failed loading QwikSell logo:', err));

        loader.load(exigoLogo, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = 16;
            setExigoAspect(tex.image.width / tex.image.height);
            setExigoTexture(tex);
        }, undefined, (err) => console.error('Failed loading Exigo logo:', err));
    }, []);

    const handleGateClick = () => {
        setGateOpen(true);
        setCurrentView('lobby');
        setScrollProgress(35);
    };

    const handleKnockEntry = () => {
        setKnockText(true);
        setTimeout(() => setKnockText(false), 800);

        setGateOpen(true);
        setTimeout(() => {
            setCurrentView('lobby');
            setScrollProgress(35);
        }, 550);
    };

    const displayPavementIndex = activePavementIdx !== null ? activePavementIdx : 0;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            setScrollProgress(prev => {
                const next = Math.max(0, Math.min(100, prev + e.deltaY * 0.04));

                if (next < 25) {
                    setCurrentView('outside');
                    setGateOpen(false);
                } else if (next >= 25 && next < 55) {
                    setCurrentView('lobby');
                    setGateOpen(true);
                } else if (next >= 55 && next < 80) {
                    setCurrentView('urja');
                    setGateOpen(true);
                } else {
                    setCurrentView('qwik');
                    setGateOpen(true);
                }

                return next;
            });
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    return (
        <section ref={containerRef} style={styles.stage}>
            <style>
                {`
                @media (max-width: 768px) {
                    .exigo-header-brand {
                        left: 16px !important;
                        top: 16px !important;
                        padding: 10px 16px !important;
                        border-radius: 12px !important;
                    }
                    .exigo-action-guide {
                        bottom: 24px !important;
                        width: calc(100% - 32px) !important;
                        font-size: 10.5px !important;
                        padding: 10px 18px !important;
                    }
                    .exigo-scroll-dots {
                        right: 16px !important;
                    }
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(-360deg); }
                }
                @keyframes pulse-height {
                    from { transform: scaleY(0.88); }
                    to { transform: scaleY(1.12); }
                }
                `}
            </style>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${scrollProgress}%`,
                height: '3px',
                background: 'linear-gradient(90deg, #0284c7 0%, #06b6d4 100%)',
                zIndex: 15,
                transition: 'width 0.1s ease',
                pointerEvents: 'none'
            }} />

            <div className="exigo-header-brand" style={styles.headerBrand}>
                <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.05em' }}>
                    EXIGO HQ
                </h1>
                <span style={{ fontSize: '9px', color: '#06b6d4', letterSpacing: '0.15em', fontWeight: 800, textTransform: 'uppercase' }}>
                    Interactive 3D Walkthrough
                </span>
            </div>

            <div className="exigo-action-guide" style={styles.actionGuide}>
                {currentView === 'outside' && "Tap the Gates or Double-Tap the Door Knocker to Enter"}
                {currentView === 'lobby' && "Tap the Urja or QwikSell labeled doors to enter rooms, or the lobby sofa to go outside"}
                {currentView === 'urja' && "Tap EXIT to exit and tap RUN to run"}
                {currentView === 'qwik' && "QwikSell Chamber. Tap the desk or wall logo to return to the Lobby"}
            </div>

            {knockText && (
                <div style={styles.knockOverlay}>
                    KNOCK KNOCK!
                </div>
            )}

            <div className="exigo-scroll-dots" style={styles.scrollDotsContainer}>
                <div style={{ fontSize: '9px', color: '#0284c7', writingMode: 'vertical-lr', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px', fontWeight: 700 }}>
                    TOUR PATH
                </div>
                <div style={{ ...styles.scrollDot, ...(currentView === 'outside' ? styles.scrollDotActive : {}) }} />
                <div style={{ ...styles.scrollDot, ...(currentView === 'lobby' ? styles.scrollDotActive : {}) }} />
                <div style={{ ...styles.scrollDot, ...(currentView === 'urja' ? styles.scrollDotActive : {}) }} />
                <div style={{ ...styles.scrollDot, ...(currentView === 'qwik' ? styles.scrollDotActive : {}) }} />
            </div>

            {/* 🔀 MOBILE NAVIGATION OVERLAY ARROWS */}
            {currentView === 'lobby' && (
                <>
                    {/* Left Arrow (Urja Room) */}
                    <button
                        onClick={() => {
                            setCurrentView('urja');
                            setScrollProgress(68);
                        }}
                        style={{
                            position: 'absolute',
                            left: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 12,
                            background: 'rgba(15, 23, 42, 0.65)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#10b981',
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}
                        title="Go to Urja Chamber"
                    >
                        ←
                    </button>

                    {/* Right Arrow (QwikSell Room) */}
                    <button
                        onClick={() => {
                            setCurrentView('qwik');
                            setScrollProgress(90);
                        }}
                        style={{
                            position: 'absolute',
                            right: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 12,
                            background: 'rgba(15, 23, 42, 0.65)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#00f5ff',
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}
                        title="Go to QwikSell Chamber"
                    >
                        →
                    </button>
                </>
            )}

            <div style={styles.webglCanvasWrapper}>
                <Canvas
                    shadows={!isMobileDevice}
                    dpr={[1, isMobileDevice ? 1.0 : 1.5]}
                    performance={{ min: 0.5 }}
                    camera={{ 
                        position: isMobileDevice ? [0, 6.2, 23.5] : [0, 5.8, 19.5], 
                        fov: isMobileDevice ? 68 : 45 
                    }}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Suspense fallback={null}>
                        <color attach="background" args={['#7dd3fc']} />
                        <Sky distance={450000} sunPosition={[10, 12, 15]} turbidity={1} rayleigh={0.25} mieCoefficient={0.005} mieDirectionalG={0.8} />
                        <fog attach="fog" args={['#7dd3fc', 75, 280]} />
                        <ambientLight intensity={0.15} />
                        <directionalLight
                            position={[15, 20, 15]}
                            intensity={1.8}
                            castShadow={!isMobileDevice}
                            shadow-mapSize-width={isMobileDevice ? 512 : 1024}
                            shadow-mapSize-height={isMobileDevice ? 512 : 1024}
                            shadow-bias={-0.00015}
                        />

                        <pointLight position={[0, 1.0, -1.3]} color="#fbbf24" intensity={2.0} distance={4} />
                        {(currentView === 'urja' || currentView === 'lobby') && <pointLight position={[-4.5, 2.0, -1.0]} color="#34d399" intensity={2.0} distance={5} />}
                        {(currentView === 'qwik' || currentView === 'lobby') && <pointLight position={[4.5, 2.0, -1.0]} color="#38bdf8" intensity={2.0} distance={5} />}

                        <PicketFence />

                        <MainGate
                            isOpen={gateOpen}
                            onClick={handleGateClick}
                            urjaTex={urjaTexture}
                            urjaAspect={urjaAspect}
                            qwikTex={qwikTexture}
                            qwikAspect={qwikAspect}
                        />

                        <FrontDoor
                            isOpen={currentView !== 'outside'}
                            onKnock={handleKnockEntry}
                            onClick={handleGateClick}
                        />

                        <ChamberDoor
                            isOpen={currentView === 'urja'}
                            position={[-2.0, 1.05, -0.3]}
                            offsetZ={-0.6}
                            direction={-1}
                            logoTexture={urjaTexture}
                            logoAspect={urjaAspect}
                            onClick={() => {
                                setCurrentView('urja');
                                setScrollProgress(68);
                            }}
                        />
                        <ChamberDoor
                            isOpen={currentView === 'qwik'}
                            position={[2.0, 1.05, -0.3]}
                            offsetZ={-0.6}
                            direction={1}
                            logoTexture={qwikTexture}
                            logoAspect={qwikAspect}
                            onClick={() => {
                                setCurrentView('qwik');
                                setScrollProgress(90);
                            }}
                        />

                        {exigoTexture && (
                            <mesh position={[0, 1.3, -3.43]} scale={0.75}>
                                <planeGeometry args={[exigoAspect, 1]} />
                                <meshBasicMaterial map={exigoTexture} transparent depthWrite={false} />
                            </mesh>
                        )}

                        {/* Kinetic Data-Stream Particles from Exigo Central Hub */}
                        <LobbyNetworkFlux />

                        {/* Exterior Corporate Logo on the Upper Floor Facade */}
                        {exigoTexture && (
                            <group position={[-2.2, 4.05, 1.28]}>
                                {/* Official White Rounded Signboard Backplate (Self-Illuminated Basic Material to defy shadows) */}
                                <RoundedBox position={[0, 0, -0.008]} args={[2.3, 0.65, 0.02]} radius={0.08} smoothness={4} castShadow>
                                    <meshBasicMaterial 
                                        color="#ffffff" 
                                    />
                                </RoundedBox>

                                {/* High-Clarity Corporate Brand Logo Overlay (Emblem + Text, Scaled Up) */}
                                <mesh position={[0, 0, 0.012]} scale={0.58}>
                                    <planeGeometry args={[exigoAspect, 1]} />
                                    <meshBasicMaterial 
                                        map={exigoTexture} 
                                        transparent={true} 
                                        depthWrite={false}
                                    />
                                </mesh>
                            </group>
                        )}

                        <Clouds />

                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
                            <planeGeometry args={[100, 100]} />
                            <meshStandardMaterial color="#166534" roughness={0.9} />
                        </mesh>

                        <Skyline />
                        <Hills />
                        <SolarCanopy />
                        <WindTurbine position={[-16, 0, -12]} />
                        <WindTurbine position={[16, 0, -15]} />

                        <LeftSideRoad />
                        <LeftSideVehicle color="#38bdf8" speedOffset={1.1} delay={0} />
                        <LeftSideVehicle color="#ec4899" speedOffset={0.8} delay={1.5} />

                        <BESSUnits />
                        <FuturisticDrone />
                        <QwikSELLDropBox />

                        <ExigoPavementPath
                            activeCard={activePavementIdx !== null ? activePavementIdx : -1}
                            onSlabClick={(index) => setActivePavementIdx(index)}
                        />

                        <Tree position={[-14.5, 0, -2.5]} />
                        <Tree position={[-14.8, 0, 3.5]} />
                        <Tree position={[8.5, 0, -2.5]} />
                        <Tree position={[9.5, 0, 4.0]} />
                        <Tree position={[-6.0, 0, -6.0]} />
                        <Tree position={[6.0, 0, -6.0]} />

                        <InfinityPool />

                        <VillaFrame />

                        <SecondFloor />

                        {/* Mount the new environment zones here */}
                        <FarLeftEVStation />
                        <FarRightQwikSellKiosk />

                        <PlanterBox position={[-2.8, 0.2, 7.0]} />
                        <PlanterBox position={[2.8, 0.2, 7.0]} />
                        {!isMobileDevice && <Fireflies />}

                        <OutdoorLights />

                        <EVChargingArea />
                        <ExteriorDecorations />

                        <HallwayTable onBackClick={() => {
                            setGateOpen(false);
                            setCurrentView('outside');
                            setScrollProgress(0);
                        }} />

                        <UrjaRoom
                            currentView={currentView}
                            logoTexture={urjaTexture}
                            logoAspect={urjaAspect}
                            onClick={() => {
                                setCurrentView('lobby');
                                setScrollProgress(35);
                            }}
                        />
                        {(currentView === 'qwik' || currentView === 'lobby') && <QwikSellRoom
                            currentView={currentView}
                            logoTexture={qwikTexture}
                            logoAspect={qwikAspect}
                            onClick={() => {
                                setCurrentView('lobby');
                                setScrollProgress(35);
                            }}
                        />}

                        <Environment preset="city" />

                        <ContactShadows position={[0, -0.005, 0]} opacity={isMobileDevice ? 0.4 : 0.65} scale={isMobileDevice ? 10 : 18} blur={isMobileDevice ? 0.8 : 1.4} far={1.0} frames={isMobileDevice ? 1 : Infinity} />

                        {!isMobileDevice && (
                            <EffectComposer>
                                <Bloom luminanceThreshold={0.65} mipmapBlur intensity={0.4} />
                                <Vignette eskil={false} offset={0.3} darkness={0.4} />
                            </EffectComposer>
                        )}

                        <CameraController currentView={currentView} />
                    </Suspense>
                </Canvas>
            </div>

            {isMobileDevice && (
                <div ref={scrollContainerRef} onScroll={handleCardScroll} style={styles.mobileGestureOverlay}>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} style={styles.mobileGestureSpacer} />
                    ))}
                </div>
            )}

            {isMobileDevice && (
                <div style={styles.mobileHudOverlay}>
                    <span style={styles.mobileHudBadge}>Exigo Cleantech — Step {displayPavementIndex + 1} of 5</span>
                    <h2 style={styles.mobileHudTitle}>{EXIGO_STEPS[displayPavementIndex].title}</h2>
                    <p style={styles.mobileHudDesc}>{EXIGO_STEPS[displayPavementIndex].desc}</p>
                </div>
            )}

            {activePavementIdx !== null && (
                <div style={popupStyles.overlayBackdrop} onClick={() => setActivePavementIdx(null)}>
                    <div style={popupStyles.squareCard} onClick={(e) => e.stopPropagation()}>
                        <button style={popupStyles.closeBtn} onClick={() => setActivePavementIdx(null)}>✕</button>

                        <div style={popupStyles.cardGrid}>
                            <div style={popupStyles.diagramPane}>
                                {activePavementIdx === 0 && (
                                    <div style={popupStyles.canvasAsset}>
                                        <div style={{ ...popupStyles.orbitRing, width: '120px', height: '120px', animation: 'spin 12s linear infinite' }} />
                                        <div style={{ ...popupStyles.orbitRing, width: '70px', height: '70px', borderColor: '#06b6d4', animation: 'spin-reverse 8s linear infinite' }} />
                                        <div style={popupStyles.pulseCore} />
                                    </div>
                                )}

                                {activePavementIdx === 1 && (
                                    <div style={popupStyles.canvasAsset}>
                                        <div style={popupStyles.matrixContainer}>
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} style={{ ...popupStyles.matrixColumn, height: `${20 + i * 18}px`, animation: `pulse-height ${1 + i * 0.2}s ease-in-out infinite alternate` }} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activePavementIdx === 2 && (
                                    <div style={popupStyles.canvasAsset}>
                                        <div style={{ ...popupStyles.loopArrow, transform: 'rotate(45deg)' }} />
                                        <div style={{ ...popupStyles.loopArrow, transform: 'rotate(225deg)', borderColor: '#06b6d4' }} />
                                    </div>
                                )}

                                {activePavementIdx === 3 && (
                                    <div style={popupStyles.canvasAsset}>
                                        <div style={popupStyles.radarScope}>
                                            <div style={popupStyles.radarSweep} />
                                            <div style={popupStyles.shieldCheck}>✓</div>
                                        </div>
                                    </div>
                                )}

                                {activePavementIdx === 4 && (
                                    <div style={popupStyles.canvasAsset}>
                                        <div style={popupStyles.networkNode} />
                                        <div style={{ ...popupStyles.networkLine, transform: 'rotate(30deg)' }} />
                                        <div style={{ ...popupStyles.networkLine, transform: 'rotate(-45deg)' }} />
                                        <div style={{ ...popupStyles.networkLine, transform: 'rotate(90deg)' }} />
                                    </div>
                                )}
                            </div>

                            <div style={popupStyles.textPane}>
                                <span style={popupStyles.stepTag}>EXIGO MANAGEMENT DIRECTIVE — STEP {activePavementIdx + 1} OF 5</span>
                                <h2 style={popupStyles.stepTitle}>{EXIGO_STEPS[activePavementIdx].title}</h2>
                                <p style={popupStyles.stepDesc}>{EXIGO_STEPS[activePavementIdx].desc}</p>

                                <div style={popupStyles.metaParameterBox}>
                                    <span>INFRASTRUCTURE NODE // SECURE</span>
                                    <span style={popupStyles.greenCheck}>COMPLIANT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

const styles = {
    stage: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
    } as React.CSSProperties,
    webglCanvasWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1,
        pointerEvents: 'auto'
    } as React.CSSProperties,
    mobileGestureOverlay: {
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
    } as React.CSSProperties,
    mobileGestureSpacer: {
        minWidth: '85vw',
        height: '100vh',
        marginLeft: '7.5vw',
        marginRight: '7.5vw',
        flexShrink: 0,
        scrollSnapAlign: 'center'
    } as React.CSSProperties,
    mobileHudOverlay: {
        position: 'absolute',
        left: '50%',
        bottom: '3.5rem',
        transform: 'translateX(-50%)',
        zIndex: 30,
        background: 'rgba(255,255,255,0.92)',
        padding: '16px 20px',
        borderRadius: '24px',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '88vw',
        textAlign: 'center'
    } as React.CSSProperties,
    mobileHudBadge: {
        fontSize: '10px',
        fontWeight: 800,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#0f766e',
        marginBottom: '8px'
    } as React.CSSProperties,
    mobileHudTitle: {
        fontSize: '18px',
        fontWeight: 900,
        color: '#0f172a',
        margin: 0,
        lineHeight: 1.15
    } as React.CSSProperties,
    mobileHudDesc: {
        fontSize: '12px',
        color: '#334155',
        marginTop: '8px',
        lineHeight: 1.5
    } as React.CSSProperties,
    headerBrand: {
        position: 'absolute',
        left: '40px',
        top: '40px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '16px 24px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        pointerEvents: 'none'
    } as React.CSSProperties,
    actionGuide: {
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        color: '#cbd5e1',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.05em',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '12px 28px',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        textAlign: 'center',
        pointerEvents: 'none',
        textTransform: 'uppercase'
    } as React.CSSProperties,
    knockOverlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 30,
        fontSize: '48px',
        fontWeight: 900,
        color: '#f59e0b',
        letterSpacing: '0.1em',
        textShadow: '0 0 20px rgba(245, 158, 11, 0.8), 0 0 40px rgba(245, 158, 11, 0.4)',
        pointerEvents: 'none',
        fontFamily: 'system-ui, sans-serif'
    } as React.CSSProperties,
    scrollDotsContainer: {
        position: 'absolute',
        right: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'none'
    } as React.CSSProperties,
    scrollDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'rgba(2, 132, 199, 0.25)',
        border: '1px solid rgba(2, 132, 199, 0.4)',
        transition: 'all 0.3s ease'
    } as React.CSSProperties,
    scrollDotActive: {
        background: '#06b6d4',
        borderColor: '#06b6d4',
        transform: 'scale(1.4)',
        boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)'
    } as React.CSSProperties
};

// 1. Update the responsive constant to catch phone widths accurately
const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 768;

const popupStyles = {
    overlayBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(5, 8, 16, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        boxSizing: 'border-box'
    } as React.CSSProperties,
    
    squareCard: {
        width: isMobileScreen ? '92%' : '600px',
        height: isMobileScreen ? 'auto' : '340px', 
        maxHeight: '90vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: isMobileScreen ? '18px' : '32px', // Tightened inner spacing on mobile
        boxSizing: 'border-box',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden' // ✕ Completely disables scrollbar instantiation
    } as React.CSSProperties,

    closeBtn: {
        position: 'absolute',
        top: isMobileScreen ? '12px' : '18px',
        right: isMobileScreen ? '12px' : '18px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        color: '#94a3b8',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        zIndex: 10
    } as React.CSSProperties,

    cardGrid: {
        display: 'flex',
        flexDirection: 'column', 
        width: '100%',
        gap: isMobileScreen ? '12px' : '32px', // Tightened gap to save vertical area
        alignItems: 'center'
    } as React.CSSProperties,

    diagramPane: {
        width: isMobileScreen ? '80px' : '180px', 
        height: isMobileScreen ? '80px' : '180px',
        background: '#04070d',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0
    } as React.CSSProperties,

    canvasAsset: {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: isMobileScreen ? 'scale(0.55)' : 'scale(1)' 
    } as React.CSSProperties,

    textPane: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        textAlign: isMobileScreen ? 'center' : 'left' 
    } as React.CSSProperties,

    stepTag: {
        fontSize: '7.5px', // Micro-scaled tag sizing
        fontWeight: 800,
        color: '#94a3b8',
        backgroundColor: 'rgba(148, 163, 184, 0.08)',
        padding: '3px 8px',
        borderRadius: '4px',
        letterSpacing: '0.06em',
        alignSelf: isMobileScreen ? 'center' : 'flex-start', 
        marginBottom: '4px', // Reduced margin
        textTransform: 'uppercase'
    } as React.CSSProperties,

    stepTitle: {
        fontSize: isMobileScreen ? '15px' : '24px', // Downscaled to fit perfectly on single line
        fontWeight: 900,
        color: '#ffffff',
        margin: '0 0 4px 0', // Compact separation margin
        letterSpacing: '-0.02em'
    } as React.CSSProperties,

    stepDesc: {
        fontSize: isMobileScreen ? '10px' : '13.5px', // Highly compact layout text profile
        color: '#94a3b8',
        lineHeight: 1.4,
        margin: isMobileScreen ? '0 0 10px 0' : '0 0 20px 0',
        fontWeight: 400
    } as React.CSSProperties,

    metaParameterBox: {
        background: '#04070d',
        border: '1px solid rgba(255, 255, 255, 0.03)',
        padding: isMobileScreen ? '6px 10px' : '12px 16px',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '8px', // Micro-scale parameter data print
        fontWeight: 800,
        color: '#64748b',
        letterSpacing: '0.04em'
    } as React.CSSProperties,

    greenCheck: {
        color: '#4b5563',
        backgroundColor: 'rgba(75, 85, 99, 0.15)',
        padding: '2px 6px',
        borderRadius: '4px'
    } as React.CSSProperties,
    
    orbitRing: { position: 'absolute', border: '1px dashed rgba(255, 255, 255, 0.15)', borderRadius: '50%' } as React.CSSProperties,
    pulseCore: { width: '12px', height: '12px', background: '#6b7280', borderRadius: '50%', boxShadow: '0 0 15px #6b7280' } as React.CSSProperties,
    matrixContainer: { display: 'flex', alignItems: 'flex-end', gap: '8px' } as React.CSSProperties,
    matrixColumn: { width: '6px', background: '#4b5563', borderRadius: '99px' } as React.CSSProperties,
    loopArrow: { position: 'absolute', width: '70px', height: '70px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'transparent', borderRadius: '50%' } as React.CSSProperties,
    radarScope: { width: '80px', height: '80px', border: '1px solid rgba(156, 163, 175, 0.3)', borderRadius: '50%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' } as React.CSSProperties,
    radarSweep: { position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(45deg, rgba(156, 163, 175, 0.15) 0%, transparent 50%)', borderRadius: '50%' } as React.CSSProperties,
    shieldCheck: { fontSize: '22px', color: '#6b7280', fontWeight: 900 } as React.CSSProperties,
    networkNode: { width: '14px', height: '14px', background: '#9ca3af', borderRadius: '50%', zIndex: 5 } as React.CSSProperties,
    networkLine: { position: 'absolute', width: '90px', height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, transparent 100%)' } as React.CSSProperties
};