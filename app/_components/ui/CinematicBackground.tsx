'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../_context/ThemeContext';

// Shared state for mouse position to sync background with cursor
const mouseState = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0
};

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function ParticleField({ theme }: { theme: 'light' | 'dark' }) {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const count = 4000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const rand = mulberry32(theme === 'dark' ? 1 : 2);
    const color1 = new THREE.Color(theme === 'dark' ? '#8F1242' : '#8F1242');
    const color2 = new THREE.Color(theme === 'dark' ? '#E59ABC' : '#5c1838');

    for (let i = 0; i < count; i++) {
      const r = 10 * Math.sqrt(rand());
      const theta = rand() * 2 * Math.PI;
      const phi = Math.acos(2 * rand() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const mixedColor = color1.clone().lerp(color2, rand());
      cols[i * 3] = mixedColor.r;
      cols[i * 3 + 1] = mixedColor.g;
      cols[i * 3 + 2] = mixedColor.b;
    }

    return [pos, cols];
  }, [theme]);

  useFrame((state) => {
    if (!ref.current) return;
    
    const t = state.clock.getElapsedTime();
    
    mouseState.x += (mouseState.targetX - mouseState.x) * 0.2;
    mouseState.y += (mouseState.targetY - mouseState.y) * 0.2;

    ref.current.rotation.x = t * 0.02;
    ref.current.rotation.y = t * 0.01;
    
    ref.current.position.x = mouseState.x * 0.5;
    ref.current.position.y = mouseState.y * 0.5;
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      colors={colors}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        vertexColors
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending}
        opacity={theme === 'dark' ? 0.4 : 0.6}
      />
    </Points>
  );
}

function MouseTracker() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseState.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseState.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return null;
}

type CinematicBackgroundProps = {
  isMenuOpen?: boolean;
};

export function CinematicBackground({ isMenuOpen = false }: CinematicBackgroundProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const bgColor = theme === 'dark' ? '#1c122d' : '#f9f6ee';
  const [navbarHidden, setNavbarHidden] = useState(false);
  const [scene, setScene] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleNavbarVisibility = (event: Event) => {
      const custom = event as CustomEvent<{ hidden?: boolean }>;
      const hidden = custom.detail?.hidden;
      if (typeof hidden === 'boolean') setNavbarHidden(hidden);
    };

    window.addEventListener('portfolio:navbar-visibility', handleNavbarVisibility);
    return () => window.removeEventListener('portfolio:navbar-visibility', handleNavbarVisibility);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScene = (event: Event) => {
      const custom = event as CustomEvent<{ x?: number; y?: number }>;
      const x = custom.detail?.x;
      const y = custom.detail?.y;
      setScene({
        x: typeof x === 'number' ? x : 0,
        y: typeof y === 'number' ? y : 0,
      });
    };

    window.addEventListener('portfolio:section', handleScene);
    return () => window.removeEventListener('portfolio:section', handleScene);
  }, []);

  const backgroundTransform = `translate3d(${(isMenuOpen ? 64 : 0) + scene.x}px, ${(navbarHidden ? -24 : 0) + scene.y}px, 0) scale(1.03)`;

  // Render con color neutral hasta que el componente esté montado
  if (!mounted) {
    return (
      <div
        className="fixed inset-0 -z-10"
        style={{ backgroundColor: '#1c122d' }}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 -z-10 transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: backgroundTransform }}
      >
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={[1, 2]}
        >
          <color attach="background" args={[bgColor]} />
          <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8} />
          <pointLight position={[10, 10, 10]} intensity={theme === 'dark' ? 1 : 0.5} color="#E59ABC" />
          <pointLight position={[-10, -10, -10]} intensity={theme === 'dark' ? 0.5 : 0.2} color="#8F1242" />
          
          <MouseTracker />
          <ParticleField theme={theme} />
          
          <fog attach="fog" args={[bgColor, 5, 15]} />
        </Canvas>
        
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-100' : 'opacity-20'}`}
            style={{
              background: `radial-gradient(circle_at_center, transparent 0%, ${theme === 'dark' ? 'rgba(28,18,45,0.6)' : 'rgba(143,18,66,0.1)'} 100%)`,
            }}
          />
          
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className={`absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[size:100%_2px,3px_100%] transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </div>
    </div>
  );
}
