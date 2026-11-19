import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { createShardGeometry } from './shards'
import { createShardMaterial, coronaFragment, coronaVertex, type ShardUniforms } from '../../shaders/eclipseShards'
import { scroll } from '../../lib/store'

const { clamp, lerp, damp } = THREE.MathUtils
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// colour/material keyframes (origin → awakening → formation)
const COL = [new THREE.Color('#121018'), new THREE.Color('#2b2934'), new THREE.Color('#cfcdd9')]
const ROUGH = [0.82, 0.48, 0.13]
const METAL = [0.25, 0.65, 1.0]
const ENV = [0.22, 0.6, 1.3]

// camera keyframes — x/z are scaled for narrow viewports
const CAM = [new THREE.Vector3(0, 0, 6.2), new THREE.Vector3(2.2, 0.9, 6.9), new THREE.Vector3(0, -0.15, 5.4), new THREE.Vector3(0, 0, 0.7)]

function Director({ mobile, onFirstFrame }: { mobile: boolean; onFirstFrame?: () => void }) {
  const group = useRef<THREE.Group>(null)
  const key = useRef<THREE.DirectionalLight>(null)
  const { camera, size } = useThree()
  const { geometry, formScale } = useMemo(() => createShardGeometry(mobile ? 2 : 3), [mobile])
  const uniforms = useMemo<ShardUniforms>(
    () => ({
      uTime: { value: 0 },
      uK1: { value: 0 },
      uK2: { value: 0 },
      uFormScale: { value: formScale },
      uSweep: { value: -3 },
      uGlowColor: { value: new THREE.Color('#b9a6ff') },
      uGlassColor: { value: new THREE.Color('#150a2e') },
    }),
    [formScale],
  )
  const material = useMemo(() => createShardMaterial(uniforms), [uniforms])
  const corona = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: coronaVertex,
        fragmentShader: coronaFragment,
        uniforms: { uTime: { value: 0 }, uIntensity: { value: 0 }, uDisc: { value: 1 } },
        transparent: true,
        depthWrite: false,
      }),
    [],
  )
  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
      corona.dispose()
    },
    [geometry, material, corona],
  )

  const s = useRef({ p: 0, intro: 0, frames: 0 })
  const look = useMemo(() => new THREE.Vector3(), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, dt) => {
    const st = s.current
    if (st.frames < 3 && ++st.frames === 3) onFirstFrame?.()
    st.p = damp(st.p, scroll.eclipse, 6, dt)
    st.intro = damp(st.intro, scroll.intro, 2.2, dt)
    const p = st.p
    const t = state.clock.elapsedTime

    const k1 = clamp((p - 0.1) / 0.3, 0, 1)
    const k2 = clamp((p - 0.42) / 0.28, 0, 1)
    const k3 = ease(clamp((p - 0.76) / 0.24, 0, 1))
    const e1 = ease(k1)
    const e2 = ease(k2)

    uniforms.uTime.value = t
    uniforms.uK1.value = k1
    uniforms.uK2.value = k2
    uniforms.uSweep.value = lerp(-3.2, 3.2, k1)

    // material evolution
    const m = material
    const ph = e2 > 0 ? 1 + e2 : e1
    const i0 = Math.min(1, Math.floor(ph))
    const f = ph - i0
    m.color.copy(COL[i0]).lerp(COL[i0 + 1], f)
    m.roughness = lerp(ROUGH[i0], ROUGH[i0 + 1], f)
    m.metalness = lerp(METAL[i0], METAL[i0 + 1], f)
    m.envMapIntensity = lerp(ENV[i0], ENV[i0 + 1], f) * st.intro
    m.clearcoat = e2

    // eclipse corona
    corona.uniforms.uTime.value = t
    corona.uniforms.uIntensity.value = st.intro * (0.08 * e1 + 0.55 * e2 + 0.45 * k3)

    // key light reveals the object after the preloader
    if (key.current) key.current.intensity = 3.2 * st.intro

    // sculpture transform
    const g = group.current
    if (g) {
      const px = state.pointer.x
      const py = state.pointer.y
      const free = 1 - e2
      const ry = (Math.sin(t * 0.12) * 0.7 + px * 0.35) * free + (0.32 - px * 0.08) * e2 * (1 - k3)
      const rx = (Math.cos(t * 0.1) * 0.25 - py * 0.2) * free + (-0.42 + py * 0.06) * e2 * (1 - k3)
      g.rotation.y = damp(g.rotation.y, ry, 3, dt)
      g.rotation.x = damp(g.rotation.x, rx, 3, dt)
      g.rotation.z = t * 0.05 * e2
      const scale = (0.94 + 0.06 * st.intro) * (1 + k3 * k3 * 2.4)
      g.scale.setScalar(scale)
      g.position.y = Math.sin(t * 0.5) * 0.05 * free
    }

    // camera path (responsive framing)
    const aspect = size.width / size.height
    const fit = Math.max(1, Math.pow(1.25 / aspect, 0.92))
    const seg = e2 > 0 ? 1 + e2 : e1
    const j = Math.min(1, Math.floor(seg))
    tmp.copy(CAM[j]).lerp(CAM[j + 1], seg - j)
    tmp.x *= fit
    tmp.z *= fit
    tmp.lerp(CAM[3], k3)
    camera.position.x = damp(camera.position.x, tmp.x + state.pointer.x * 0.15 * (1 - k3), 4, dt)
    camera.position.y = damp(camera.position.y, tmp.y + state.pointer.y * 0.1 * (1 - k3), 4, dt)
    camera.position.z = damp(camera.position.z, tmp.z, 4, dt)
    look.set(0, 0, lerp(0, -2, k3))
    camera.lookAt(look)
  })

  return (
    <>
      <directionalLight ref={key} position={[-3, 4, 3]} intensity={0} color="#f2efff" />
      <directionalLight position={[4, -2, -3]} intensity={0.6} color="#7c5cff" />
      <ambientLight intensity={0.04} />
      <group ref={group}>
        <mesh geometry={geometry} material={material} frustumCulled={false} />
        <mesh position={[0, 0, -0.3]} material={corona} renderOrder={-1}>
          <planeGeometry args={[6, 6]} />
        </mesh>
      </group>
    </>
  )
}

export default function EclipseScene({ mobile, onFirstFrame }: { mobile: boolean; onFirstFrame?: () => void }) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={mobile ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0, 6.2], fov: 35, near: 0.05, far: 60 }}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
      aria-hidden
    >
      <color attach="background" args={['#060609']} />
      <fog attach="fog" args={['#060609', 9, 24]} />
      <Environment resolution={mobile ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 5, -3]} scale={[10, 2, 1]} color="#ffffff" />
        <Lightformer form="ring" intensity={2.4} position={[-5, 1, 2]} scale={3} color="#7c5cff" />
        <Lightformer form="rect" intensity={1.4} position={[5, 0, 3]} scale={[2, 7, 1]} color="#e4e2ec" />
        <Lightformer form="circle" intensity={2} position={[0, -5, 1]} scale={4} color="#3b1f7a" />
      </Environment>
      <Director mobile={mobile} onFirstFrame={onFirstFrame} />
      <Sparkles count={mobile ? 60 : 140} scale={[12, 8, 8]} size={1.4} speed={0.2} opacity={0.45} color="#b9a6ff" />
      <Sparkles count={mobile ? 30 : 70} scale={[10, 6, 6]} size={1} speed={0.12} opacity={0.35} color="#e4e2ec" />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.75} luminanceThreshold={0.7} luminanceSmoothing={0.2} mipmapBlur />
        <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
        <Vignette darkness={0.7} offset={0.22} />
      </EffectComposer>
    </Canvas>
  )
}

