import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AlertOutlined, SyncOutlined, CheckCircleOutlined } from '@ant-design/icons';

interface LaptopModel3DProps {
  stage: 'closed' | 'opening' | 'broken' | 'scanning' | 'rebuilt';
  scanProgress: number;
  activeGrade: string;
  terminalLogs?: string[];
}

const LaptopScene: React.FC<LaptopModel3DProps> = ({ stage, scanProgress, activeGrade, terminalLogs }) => {
  const laptopGroupRef = useRef<THREE.Group>(null);
  const lidGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!laptopGroupRef.current || !lidGroupRef.current) return;

    // Default rotation targets based on stage
    let baseRx = stage === 'closed' ? 0.75 : 0.35;
    let baseRy = 0;
    let baseRz = stage === 'closed' ? -0.35 : 0;

    // Read animated rotation values from GSAP CSS variables (if defined on .laptop-pivot in DOM)
    const pivotEl = document.querySelector('.laptop-pivot');
    if (pivotEl) {
      const style = window.getComputedStyle(pivotEl);
      const rxDeg = parseFloat(style.getPropertyValue('--laptop-rx'));
      const ryDeg = parseFloat(style.getPropertyValue('--laptop-ry'));
      const rzDeg = parseFloat(style.getPropertyValue('--laptop-rz'));
      
      if (!isNaN(rxDeg)) baseRx = rxDeg * (Math.PI / 180);
      if (!isNaN(ryDeg)) baseRy = ryDeg * (Math.PI / 180);
      if (!isNaN(rzDeg)) baseRz = rzDeg * (Math.PI / 180);
    }

    laptopGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      laptopGroupRef.current.rotation.x,
      baseRx,
      0.08
    );
    laptopGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      laptopGroupRef.current.rotation.y,
      baseRy,
      0.08
    );
    laptopGroupRef.current.rotation.z = THREE.MathUtils.lerp(
      laptopGroupRef.current.rotation.z,
      baseRz,
      0.08
    );

    // Lid hinge opening geometry math
    // Math.PI / 2 is flat closed. -0.25 rad (~14 deg tilted back) is open/upright.
    const currentLidRot = lidGroupRef.current.rotation.x;
    const targetLid = stage === 'closed' ? Math.PI / 2 : -0.25;
    lidGroupRef.current.rotation.x = THREE.MathUtils.lerp(currentLidRot, targetLid, 0.08);
  });

  return (
    <group ref={laptopGroupRef} position={[0, -0.8, 0]} scale={[0.7, 0.7, 0.7]}>
      {/* ========================================================
          1. PHYSICAL KEYBOARD CHASSIS DECK (LARGER CORE MESHES)
         ======================================================== */}
      <mesh receiveShadow castShadow position={[0, 0, 0]}>
        <boxGeometry args={[5.2, 0.16, 3.6]} />
        <meshPhysicalMaterial
          color={stage === 'rebuilt' ? '#ffffff' : '#f8fafc'}
          roughness={0.25}
          metalness={0.3}
          clearcoat={0.3}
        />
      </mesh>

      {/* Embedded text coordinates right onto the base deck structure panels */}
      <group position={[-1.9, 0.1, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[0, Math.PI, 0]}>
          <Html transform distanceFactor={4} className="select-none pointer-events-none">
            <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap', userSelect: 'none' }}>
              CHASSIS ID // EXIGO-800-88
            </div>
          </Html>
        </group>
      </group>

      <group position={[1.1, 0.1, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[0, Math.PI, 0]}>
          <Html transform distanceFactor={4} className="select-none pointer-events-none">
            <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap', textAlign: 'right', userSelect: 'none' }}>
              {stage === 'rebuilt' ? '⚡ STATUS: OPTIMAL' : '⚠️ UNVERIFIED INTAKE'}
            </div>
          </Html>
        </group>
      </group>

      {/* Keyboard trackbed details */}
      <mesh position={[0, 0.09, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.6, 2.2]} />
        <meshStandardMaterial color={stage === 'rebuilt' ? '#f1f5f9' : '#e2e8f0'} roughness={0.5} />
      </mesh>

      {/* Trackpad casing area */}
      <mesh position={[0, 0.09, 1.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.4, 0.85]} />
        <meshStandardMaterial color={stage === 'rebuilt' ? '#ffffff' : '#f1f5f9'} roughness={0.3} />
      </mesh>

      {/* ========================================================
          2. ROTATING DOUBLE-SIDED MONITOR DISPLAY LOOP
         ======================================================== */}
      {/* Pivot hinge point positioned at the back-top edge of the base deck */}
      <group ref={lidGroupRef} position={[0, 0.12, -1.8]}>

        {/* The screen panel extending along the rotational radius */}
        <group position={[0, 1.8, 0]}>
          <mesh castShadow>
            <boxGeometry args={[5.2, 3.6, 0.08]} />
            <meshPhysicalMaterial
              color={stage === 'rebuilt' ? '#ffffff' : '#e2e8f0'}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>

          {/* Screen Display Face Viewport */}
          <mesh position={[0, 0, 0.042]}>
            <planeGeometry args={[4.9, 3.3]} />
            <meshStandardMaterial color="#090d16" roughness={0.1} />
          </mesh>

          {/* DYNAMIC VIEWPORT CONTROLLER (Crisp, screen-projected HTML element overlay) */}
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[4.8, 3.2]} />
            <meshBasicMaterial color="#000000" opacity={0} transparent />

            {stage !== 'closed' && (
              <group rotation={[0, Math.PI, 0]}>
                <Html
                  transform
                  center
                  distanceFactor={5.2}
                  className="select-none pointer-events-none"
                  style={{
                    width: '360px',
                    height: '240px',
                    transition: 'opacity 0.3s ease',
                    opacity: stage === 'opening' && scanProgress < 5 ? 0 : 1
                  }}
                >
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    fontFamily: 'Outfit, Inter, sans-serif',
                    userSelect: 'none',
                    boxSizing: 'border-box'
                  }}>

                    {/* STATE 1: System Fault Error Banner */}
                    {(stage === 'opening' || stage === 'broken' || stage === 'scanning') && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0, right: 0, bottom: 0, left: 0,
                          backgroundColor: '#f8fafc',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          padding: '16px',
                          zIndex: 10,
                          border: '1px solid #cbd5e1',
                          borderRadius: '12px',
                          boxSizing: 'border-box',
                          clipPath: stage === 'scanning' ? `inset(${scanProgress}% 0 0 0)` : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace', fontSize: '9px', fontWeight: 'bold', color: '#f43f5e', letterSpacing: '1px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlertOutlined /> HARDWARE SEGMENT FAULT</span>
                          <span style={{ color: '#94a3b8' }}>CORE_SHELL</span>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          <svg viewBox="0 0 100 60" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.4, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
                            <path d="M15,15 L45,35 L25,55 M85,15 L65,45" stroke="#f43f5e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                          </svg>
                          <div style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: '900', color: '#e11d48', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', padding: '6px 12px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            ⚠️ DIAGNOSTIC: REPAIR ENGAGED
                          </div>
                        </div>

                        {terminalLogs && terminalLogs.length > 0 && (
                          <div style={{ backgroundColor: '#020617', padding: '6px 8px', borderRadius: '4px', fontSize: '7px', fontFamily: 'monospace', color: '#fb7185', display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', maxHeight: '42px', boxSizing: 'border-box' }}>
                            {terminalLogs.slice(-2).map((log, i) => (
                              <div key={i} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>&gt; {log}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* STATE 2: Matrix Wipe Sweep processing views */}
                    {stage === 'scanning' && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0, right: 0, bottom: 0, left: 0,
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '16px',
                          zIndex: 20,
                          border: '1px solid #cbd5e1',
                          borderRadius: '12px',
                          boxSizing: 'border-box',
                          clipPath: `inset(0 0 ${100 - scanProgress}% 0)`
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '9px', fontFamily: 'monospace', fontWeight: 'bold', color: '#0284c7' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><SyncOutlined spin /> ATOMIC SECTOR WIPE</span>
                          <span style={{ backgroundColor: '#f0f9ff', padding: '2px 6px', borderRadius: '4px', color: '#0369a1', fontWeight: '900' }}>{scanProgress}%</span>
                        </div>

                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', overflow: 'hidden' }}>
                          <div style={{ backgroundColor: '#020617', padding: '8px', borderRadius: '4px', fontSize: '7px', fontFamily: 'monospace', color: '#34d399', lineHeight: 'normal', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '2px' }}>
                            {terminalLogs && terminalLogs.length > 0 ? (
                              terminalLogs.slice(-3).map((log, i) => (
                                <div key={i} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>&gt; {log}</div>
                              ))
                            ) : (
                              <>
                                <div>&gt; SECURE DISK OVERWRITE...</div>
                                <div style={{ color: '#38bdf8' }}>&gt; ALIGNING LOGIC GATES...</div>
                              </>
                            )}
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '2px', padding: '4px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', alignContent: 'center' }}>
                            {Array.from({ length: 18 }).map((_, idx) => {
                              const limit = (idx / 18) * 100;
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    aspectRatio: '1',
                                    borderRadius: '2px',
                                    backgroundColor: scanProgress > limit ? '#10b981' : '#ef4444',
                                    opacity: scanProgress > limit ? 1 : 0.25,
                                    transition: 'all 0.2s ease'
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STATE 3: Pristine Certified Pass Dashboard */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0, right: 0, bottom: 0, left: 0,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                        zIndex: 30,
                        borderRadius: '12px',
                        boxSizing: 'border-box',
                        opacity: stage === 'rebuilt' ? 1 : 0,
                        transition: 'opacity 0.4s ease'
                      }}
                    >
                      <CheckCircleOutlined style={{ color: '#10b981', fontSize: '24px', marginBottom: '4px' }} />
                      <div style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '900', color: '#1e293b', letterSpacing: '1px' }}>CERTIFICATION SEAL PASS</div>
                      <div style={{ fontSize: '8px', fontFamily: 'monospace', fontWeight: 'bold', color: '#059669', marginTop: '2px' }}>GRADE {activeGrade} COMPLIANT APPROVED</div>

                      {/* Integrated dynamic stamp inside the screen */}
                      <div style={{
                        marginTop: '8px',
                        backgroundColor: '#ecfdf5',
                        border: '2px solid #10b981',
                        color: '#10b981',
                        fontFamily: 'monospace',
                        fontWeight: '900',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '9px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
                        transform: 'rotate(-5deg)'
                      }}>
                        GRADE {activeGrade} PASSED
                      </div>

                      <div style={{ marginTop: '10px', display: 'flex', gap: '16px', textAlign: 'left', borderTop: '1px solid #e2e8f0', paddingTop: '6px', width: '100%', justifyContent: 'center', fontSize: '7px', fontFamily: 'monospace' }}>
                        <div>
                          <span style={{ color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Sanitization</span>
                          <span style={{ color: '#334155', fontWeight: 'bold' }}>NIST 800-88</span>
                        </div>
                        <div>
                          <span style={{ color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Carbon Saved</span>
                          <span style={{ color: '#0284c7', fontWeight: 'bold' }}>145 LBS CO2</span>
                        </div>
                      </div>
                    </div>

                    {/* Sweeper Laser line layer */}
                    {stage === 'scanning' && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0, right: 0,
                          height: '2.5px',
                          backgroundColor: '#38bdf8',
                          pointerEvents: 'none',
                          boxShadow: '0 0 8px rgba(56,189,248,0.8)',
                          transform: `translateY(calc(${scanProgress} * 240px / 100))`,
                          top: 0,
                          zIndex: 50,
                          willChange: 'transform'
                        }}
                      />
                    )}

                  </div>
                </Html>
              </group>
            )}
          </mesh>

        </group>
      </group>
    </group>
  );
};

export const LaptopModel3D: React.FC<LaptopModel3DProps> = ({ stage, scanProgress, activeGrade, terminalLogs }) => {
  return (
    <div className="w-full h-full overflow-visible flex items-center justify-center" style={{ width: '100%', height: '400px', position: 'relative' }}>
      <Canvas 
        shadows 
        camera={{ position: [0, 3.2, 7.0], fov: 40 }}
        style={{ overflow: 'visible', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 10, 5]} intensity={0.85} castShadow />
        <pointLight position={[-6, -2, -4]} intensity={0.3} />

        <LaptopScene stage={stage} scanProgress={scanProgress} activeGrade={activeGrade} terminalLogs={terminalLogs} />
      </Canvas>
    </div>
  );
};
