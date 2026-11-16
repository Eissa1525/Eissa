import { Suspense, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import type { OrbitControls as OrbitImpl } from 'three-stdlib';
import * as THREE from 'three';
import gsap from 'gsap';
import { GymModel } from './GymModel';
import { media } from '../../data/assets';
import { theme } from '../../config/theme';
import { pointer } from '../../lib/store';

export type ShowroomHandle = { reset: () => void; zoom: (dir: 1 | -1) => void };
const HOME = new THREE.Vector3(3.1, 1.55, 4.1);
const TARGET = new THREE.Vector3(0, 0.72, 0);
const MIN = 2.6, MAX = 8;

/** Model swap with a short settle so the change reads as a physical hand-over. */
function Stage({ url, shadows }: { url: string; shadows: boolean }) {
  const g = useRef<THREE.Group>(null!);
  const t = useRef(0);
  useEffect(() => { t.current = 0; }, [url]);
  useFrame((_, dt) => {
    t.current = Math.min(1, t.current + dt * 1.6);
    const e = 1 - Math.pow(1 - t.current, 4);
    g.current.scale.setScalar(0.86 + 0.14 * e);
    g.current.rotation.y = (1 - e) * -0.9;
    g.current.position.y = (1 - e) * 0.25;
  });
  return <group ref={g}><GymModel url={url} fit={2.5} ground shadows={shadows} /></group>;
}

function Lights({ shadows }: { shadows: boolean }) {
  const key = useRef<THREE.SpotLight>(null!);
  useFrame(() => { key.current.position.x = THREE.MathUtils.lerp(key.current.position.x, 3 + pointer.x * 2.5, 0.05); });
  return (
    <>
      <spotLight ref={key} position={[3, 6.5, 4]} angle={0.42} penumbra={0.85} intensity={160} color="#fff3ea" castShadow={shadows} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
      <pointLight position={[-2.6, 2.3, -2.8]} intensity={16} color={theme.colors.accent} distance={7} decay={2} />
      <pointLight position={[4, 3, -4]} intensity={35} color="#a9bcff" distance={14} />
    </>
  );
}

const Controls = forwardRef<ShowroomHandle, { touch: boolean; idle: boolean }>(function Controls({ touch, idle }, ref) {
  const ctl = useRef<OrbitImpl>(null!);
  const { camera, size } = useThree();
  const portrait = size.width / size.height < 1;
  const home = useRef(HOME.clone());
  useEffect(() => {
    home.current.copy(TARGET).add(HOME.clone().sub(TARGET).multiplyScalar(portrait ? 1.55 : 1));
    camera.position.copy(home.current);
    ctl.current?.update();
  }, [portrait, camera]);
  useImperativeHandle(ref, () => ({
    reset: () => {
      const HOME = home.current;
      gsap.to(camera.position, { x: HOME.x, y: HOME.y, z: HOME.z, duration: 1.1, ease: 'power3.inOut', onUpdate: () => ctl.current?.update() });
      gsap.to(ctl.current.target, { x: TARGET.x, y: TARGET.y, z: TARGET.z, duration: 1.1, ease: 'power3.inOut' });
    },
    zoom: (dir) => {
      const off = camera.position.clone().sub(ctl.current.target);
      const len = THREE.MathUtils.clamp(off.length() * (dir > 0 ? 0.8 : 1.25), MIN, MAX);
      const to = ctl.current.target.clone().add(off.setLength(len));
      gsap.to(camera.position, { x: to.x, y: to.y, z: to.z, duration: 0.6, ease: 'power3.out', onUpdate: () => ctl.current?.update() });
    },
  }), [camera]);
  // Wheel-zoom is off on desktop so the page keeps scrolling; pinch-zoom stays on for touch.
  return (
    <OrbitControls ref={ctl} makeDefault target={TARGET} enablePan={false} enableZoom={touch} enableDamping dampingFactor={0.08}
      minDistance={MIN} maxDistance={MAX} minPolarAngle={0.35} maxPolarAngle={Math.PI / 2 - 0.04}
      autoRotate={idle} autoRotateSpeed={0.9} rotateSpeed={touch ? 0.9 : 0.75} />
  );
});

const ShowroomScene = forwardRef<ShowroomHandle, { url: string; active: boolean; quality: 'low' | 'high'; touch: boolean; reduced: boolean }>(
  function ShowroomScene({ url, active, quality, touch, reduced }, ref) {
    const high = quality === 'high';
    const [dpr, setDpr] = useState(high ? 1.75 : 1.25);
    const [idle, setIdle] = useState(!reduced);
    return (
      <Canvas
        frameloop={active ? 'always' : 'never'} shadows={high}
        dpr={Math.min(dpr, typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
        camera={{ fov: 34, position: HOME.toArray(), near: 0.1, far: 60 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onPointerDown={() => setIdle(false)}
        style={{ touchAction: 'pan-y' }}
        aria-label="Interactive 3D equipment viewer"
        role="img"
      >
        <color attach="background" args={[theme.colors.void]} />
        <fog attach="fog" args={[theme.colors.void, 7, 17]} />
        <PerformanceMonitor onDecline={() => setDpr((v) => Math.max(1, v - 0.35))} />
        <Lights shadows={high} />
        <Suspense fallback={null}>
          <Environment files={media.hdr} environmentIntensity={0.5} />
          <Stage url={url} shadows={high} />
        </Suspense>
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[40, 64]} />
          <meshStandardMaterial color="#070708" metalness={0.4} roughness={0.62} envMapIntensity={0.12} />
        </mesh>
        <ContactShadows position={[0, 0.005, 0]} opacity={0.75} scale={9} blur={2.4} far={3} resolution={high ? 512 : 256} frames={high ? Infinity : 40} color="#000000" />
        <Controls ref={ref} touch={touch} idle={idle} />
        {high && (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur intensity={0.35} luminanceThreshold={0.85} luminanceSmoothing={0.2} />
            <Vignette offset={0.28} darkness={0.72} />
          </EffectComposer>
        )}
      </Canvas>
    );
  },
);
export default ShowroomScene;
