import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, PerformanceMonitor } from '@react-three/drei';
import type { OrbitControls as OrbitImpl } from 'three-stdlib';
import * as THREE from 'three';
import gsap from 'gsap';
import { GymModel } from './GymModel';
import { media } from '../../data/assets';
import { theme } from '../../config/theme';

export type FloorView = { azimuth: number; polar: number; distance: number };
const R = 20;
const REMAP = { accent: 'accentMuted' }; // base orbit radius for distance = 1
const TARGET = new THREE.Vector3(0, 0.4, 0);

function Rig({ view, touch, reduced }: { view: FloorView; touch: boolean; reduced: boolean }) {
  const ctl = useRef<OrbitImpl>(null!);
  const { camera } = useThree();
  const cur = useRef({ ...view });
  useEffect(() => {
    const apply = () => {
      const { azimuth, polar, distance } = cur.current;
      camera.position.setFromSphericalCoords(R * distance, polar, azimuth).add(TARGET);
      ctl.current?.update();
    };
    if (reduced) { Object.assign(cur.current, view); apply(); return; }
    const tw = gsap.to(cur.current, { ...view, duration: 1.6, ease: 'power3.inOut', onUpdate: apply });
    return () => { tw.kill(); };
  }, [view, camera, reduced]);
  return (
    <OrbitControls ref={ctl} makeDefault target={TARGET} enablePan={false} enableZoom={touch} enableDamping
      minDistance={7} maxDistance={26} minPolarAngle={0.08} maxPolarAngle={Math.PI / 2 - 0.12} rotateSpeed={0.6}
      onEnd={() => {
        // keep the tween origin in sync after a manual drag
        const sph = new THREE.Spherical().setFromVector3(camera.position.clone().sub(TARGET));
        cur.current = { azimuth: sph.theta, polar: sph.phi, distance: sph.radius / R };
      }} />
  );
}

export default function FloorScene({ view, active, quality, touch, reduced }: { view: FloorView; active: boolean; quality: 'low' | 'high'; touch: boolean; reduced: boolean }) {
  const [dpr, setDpr] = useState(quality === 'high' ? 1.5 : 1.1);
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={Math.min(dpr, typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
      camera={{ fov: 30, near: 0.1, far: 120, position: [9, 8, 9] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}
      aria-label="Interactive 3D model of a training floor"
      role="img"
    >
      <PerformanceMonitor onDecline={() => setDpr((v) => Math.max(1, v - 0.3))} />
      <hemisphereLight args={['#dfe3ee', '#0a0a0c', 0.5]} />
      <directionalLight position={[8, 14, 6]} intensity={2.2} color="#fff0e2" />
      <pointLight position={[-7, 4, -6]} intensity={90} color={theme.colors.accent} distance={30} />
      <Suspense fallback={null}>
        <Environment files={media.hdr} environmentIntensity={0.45} />
        <GymModel url={media.models.floor} fit={13} ground crease={false} remap={REMAP} />
      </Suspense>
      <Rig view={view} touch={touch} reduced={reduced} />
    </Canvas>
  );
}
