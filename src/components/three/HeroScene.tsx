import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerformanceMonitor, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import { GymModel } from './GymModel';
import { media } from '../../data/assets';
import { theme } from '../../config/theme';
import { heroState, pointer } from '../../lib/store';

const lerp = THREE.MathUtils.lerp;

/** Barbell + camera choreography: pointer drives parallax, scroll drives the travel path. */
function Rig({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const spin = useRef<THREE.Group>(null!);
  const key = useRef<THREE.SpotLight>(null!);
  const s = useRef({ px: 0, py: 0, p: 0 });
  const { camera, size } = useThree();
  const portrait = size.width / size.height < 0.9;

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const st = s.current;
    st.px = lerp(st.px, reduced ? 0 : pointer.x, d * 2.6);
    st.py = lerp(st.py, reduced ? 0 : pointer.y, d * 2.6);
    st.p = lerp(st.p, heroState.progress, d * 5);
    const e = st.p * st.p * (3 - 2 * st.p); // smoothstep

    // model: sweeps from a wide horizontal pose to end-on, travelling toward the lens
    const g = group.current;
    g.position.set(lerp(portrait ? 0.1 : 0.5, portrait ? 0.45 : 1.9, e), lerp(portrait ? 0.85 : -0.35, portrait ? 0.6 : 0.25, e), lerp(0, portrait ? 1.6 : 2.4, e));
    g.rotation.set(lerp(0.12, 0.3, e) + st.py * 0.09, lerp(portrait ? 1.05 : 0.58, 1.52, e) + st.px * 0.26, lerp(-0.07, 0.2, e));
    if (!reduced) spin.current.rotation.x += d * (0.22 + e * 2.4);

    // camera parallax + slow push-in
    camera.position.set(st.px * 0.5, 0.2 - st.py * 0.32, lerp(6.6, 5.7, e));
    camera.lookAt(st.px * 0.12, 0, 0);

    // key light leans toward the pointer
    key.current.position.set(2.5 + st.px * 3.5, 4.2 - st.py * 1.5, 4);
  });

  return (
    <>
      <group ref={group}>
        <group ref={spin}>
          <GymModel url={media.models.hero} fit={portrait ? 3.1 : 4.6} />
        </group>
      </group>
      <spotLight ref={key} intensity={95} angle={0.5} penumbra={0.9} color="#fff1e6" distance={18} />
      <pointLight position={[-4, -1.5, -2.5]} intensity={70} color={theme.colors.accent} distance={14} />
      <pointLight position={[4.5, 2, -3]} intensity={30} color="#9fb4ff" distance={12} />
      <pointLight position={[3.5, -0.5, 3.5]} intensity={26} color="#ffe2cc" distance={10} />
      <SpotLight position={[0.6, 4.6, 0.4]} angle={0.42} penumbra={1} distance={9} attenuation={7} anglePower={4.5} intensity={30} color="#ffc9a3" opacity={0.42} />
    </>
  );
}

export default function HeroScene({ active, quality, reduced, onReady }: { active: boolean; quality: 'low' | 'high'; reduced: boolean; onReady?: () => void }) {
  const [dpr, setDpr] = useState(quality === 'high' ? 1.6 : 1.15);
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={Math.min(dpr, typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
      camera={{ fov: 32, position: [0, 0.2, 6.6], near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; }}
    >
      <PerformanceMonitor onDecline={() => setDpr((v) => Math.max(1, v - 0.3))} />
      <Suspense fallback={null}>
        <Environment files={media.hdr} environmentIntensity={0.55} />
        <Rig reduced={reduced} />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}

function Ready({ onReady }: { onReady?: () => void }) {
  const done = useRef(false);
  useFrame(() => { if (!done.current) { done.current = true; onReady?.(); } });
  return null;
}
