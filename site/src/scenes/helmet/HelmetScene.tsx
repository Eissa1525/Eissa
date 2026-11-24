import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { scroll } from '../../lib/store'

/**
 * SUIT UP — an original procedural helmet and armour built in code.
 * Civilian: a holographic point-cloud head. Scrolling flies armour plates in from orbit,
 * locks them onto the head, lights the seams and finally ignites the visor.
 */

const { clamp, lerp, damp, smoothstep } = THREE.MathUtils
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const FRONT = Math.PI / 2 // SphereGeometry phi that faces +Z

type PlateDef = {
  key: string
  geo: () => THREE.BufferGeometry
  pos?: [number, number, number]
  rot?: [number, number, number]
  scale?: [number, number, number]
  mat: 'shell' | 'visor' | 'dark'
  order: number // assembly order 0..1
  head?: boolean
}

const shell = (r: number, phiS: number, phiL: number, thS: number, thL: number) => () =>
  new THREE.SphereGeometry(r, 48, 24, phiS, phiL, thS, thL)

const PLATES: PlateDef[] = [
  // ---- helmet (lives in the head group, which is scaled to a head-like ellipsoid)
  ...[0, 1, 2, 3].map((k) => ({ key: `crown${k}`, geo: shell(1.03, k * (Math.PI / 2) + 0.025, Math.PI / 2 - 0.05, 0, 0.95), mat: 'shell' as const, order: 0.04 + k * 0.05, head: true })),
  { key: 'back', geo: shell(1.04, FRONT + 1.7, Math.PI * 2 - 3.4, 0.93, 1.3), mat: 'shell', order: 0.2, head: true },
  { key: 'left', geo: shell(1.045, FRONT + 0.66, 1.0, 0.93, 1.3), mat: 'shell', order: 0.28, head: true },
  { key: 'right', geo: shell(1.045, FRONT - 0.66 - 1.0, 1.0, 0.93, 1.3), mat: 'shell', order: 0.32, head: true },
  { key: 'brow', geo: shell(1.075, FRONT - 0.72, 1.44, 1.28, 0.13), mat: 'shell', order: 0.42, head: true },
  { key: 'visor', geo: shell(1.065, FRONT - 0.62, 1.24, 1.42, 0.22), mat: 'visor', order: 0.6, head: true },
  { key: 'face', geo: shell(1.055, FRONT - 0.56, 1.12, 1.65, 0.48), mat: 'shell', order: 0.5, head: true },
  { key: 'chin', geo: shell(1.02, FRONT - 0.8, 1.6, 2.13, 0.42), mat: 'shell', order: 0.55, head: true },
  { key: 'fin', geo: () => new THREE.BoxGeometry(0.06, 0.12, 1.3), pos: [0, 1.02, -0.08], mat: 'shell', order: 0.14, head: true },
  { key: 'ridge', geo: () => new THREE.BoxGeometry(0.05, 0.62, 0.08), pos: [0, -0.36, 0.99], rot: [-0.32, 0, 0], mat: 'shell', order: 0.53, head: true },
  ...[0, 1, 2, 3].map((k) => ({ key: `slat${k}`, geo: () => new THREE.BoxGeometry(0.36 - k * 0.05, 0.022, 0.05), pos: [0, -0.5 - k * 0.075, 0.955 - k * 0.035] as [number, number, number], rot: [-0.45, 0, 0] as [number, number, number], mat: 'dark' as const, order: 0.58, head: true })),
  // ---- neck and shoulders
  { key: 'neck', geo: () => new THREE.CylinderGeometry(0.4, 0.46, 0.42, 48, 1, true), pos: [0, -1.12, -0.02], mat: 'dark', order: 0.64 },
  { key: 'collar', geo: () => new THREE.TorusGeometry(0.5, 0.055, 12, 64), pos: [0, -1.3, -0.02], rot: [Math.PI / 2, 0, 0], mat: 'shell', order: 0.68 },
  { key: 'gorget', geo: shell(1.1, 0, Math.PI * 2, 0.0, 0.62), pos: [0, -2.05, -0.05], scale: [1.25, 0.95, 0.8], mat: 'shell', order: 0.72 },
  ...[-1, 1].flatMap((sd) => [0, 1, 2].map((layer) => ({
    key: `pauldron${sd}${layer}`,
    geo: shell(0.78 - layer * 0.09, 0, Math.PI * 2, 0, 1.15),
    pos: [sd * (1.22 + layer * 0.17), -1.62 - layer * 0.17, -0.05] as [number, number, number],
    rot: [0, 0, sd * -(0.62 + layer * 0.12)] as [number, number, number],
    scale: [1.05, 0.62, 0.9] as [number, number, number],
    mat: 'shell' as const,
    order: 0.76 + layer * 0.04 + (sd > 0 ? 0.02 : 0),
  }))),
]

function seeded(i: number) {
  const s = Math.sin(i * 91.17 + 3.1) * 43758.5453
  return s - Math.floor(s)
}

/** The civilian: a breathing point cloud of a head, neck and shoulders. */
function Hologram({ mobile }: { mobile: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const geo = useMemo(() => {
    const n = mobile ? 4500 : 9000
    const pts: number[] = []
    for (let i = 0; i < n; i++) {
      const u = seeded(i * 2.3), v = seeded(i * 7.1 + 1)
      const part = seeded(i * 3.7)
      if (part < 0.62) {
        // head ellipsoid with brow, nose and jaw shaping
        const th = Math.acos(1 - 2 * u), ph = v * Math.PI * 2
        let x = Math.sin(th) * Math.cos(ph) * 0.8
        let y = Math.cos(th) * 1.02
        let z = Math.sin(th) * Math.sin(ph) * 0.88
        if (z > 0.55 && Math.abs(x) < 0.12 && y < 0.05 && y > -0.35) z += 0.12 * (1 - Math.abs(x) / 0.12) // nose
        if (y < -0.35) { x *= 1 - (-0.35 - y) * 0.55; z *= 1 - (-0.35 - y) * 0.35 } // jaw taper
        pts.push(x, y + 0.02, z)
      } else if (part < 0.75) {
        const a = v * Math.PI * 2, h = u
        pts.push(Math.cos(a) * 0.42, -0.85 - h * 0.45, Math.sin(a) * 0.38)
      } else {
        // shoulders slope away from the neck, then fall into the upper chest
        const x = (u - 0.5) * 3.6
        const ax = Math.abs(x)
        const top = -1.28 - Math.pow(ax / 1.8, 1.7) * 0.75
        const y = top - v * (0.9 - ax * 0.12)
        const z = Math.sqrt(Math.max(0, 1 - Math.pow(x / 1.9, 2))) * 0.55 * (0.6 + seeded(i + 11) * 0.4) - 0.1
        pts.push(x, y, z * (seeded(i + 13) > 0.5 ? 1 : -0.6))
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [mobile])
  const mat = useMemo(
    () => new THREE.PointsMaterial({ color: new THREE.Color('#7cc4ff').multiplyScalar(1.6), size: mobile ? 0.022 : 0.016, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }),
    [mobile],
  )
  useEffect(() => () => { geo.dispose(); mat.dispose() }, [geo, mat])
  useFrame((state) => {
    const p = scroll.hero
    mat.opacity = (0.95 - smoothstep(p, 0.25, 0.85) * 0.85) * Math.min(1, scroll.intro * 1.5)
    if (ref.current) ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.006)
  })
  return <points ref={ref} geometry={geo} material={mat} />
}

function Armour({ mobile }: { mobile: boolean }) {
  const group = useRef<THREE.Group>(null)
  const parts = useMemo(() => {
    const shellMat = new THREE.MeshPhysicalMaterial({ color: '#33445f', metalness: 0.8, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1, side: THREE.DoubleSide, envMapIntensity: 1.5 })
    const darkMat = new THREE.MeshPhysicalMaterial({ color: '#0b0f16', metalness: 0.6, roughness: 0.5, side: THREE.DoubleSide })
    const visorMat = new THREE.MeshPhysicalMaterial({ color: '#030304', metalness: 0.95, roughness: 0.06, clearcoat: 1, emissive: new THREE.Color('#ff5a1f'), emissiveIntensity: 0, side: THREE.DoubleSide })
    const seamMat = new THREE.LineBasicMaterial({ color: new THREE.Color('#ff6a2a').multiplyScalar(2.2), transparent: true, opacity: 0, toneMapped: false })
    const mats = { shell: shellMat, dark: darkMat, visor: visorMat }
    const list = PLATES.map((d, i) => {
      const geo = d.geo()
      const edges = new THREE.EdgesGeometry(geo, 35)
      const dir = new THREE.Vector3(...(d.pos ?? [0, 0, 0])).add(new THREE.Vector3(seeded(i) - 0.5, seeded(i + 9) - 0.2, seeded(i + 4) - 0.1).multiplyScalar(2)).normalize()
      return {
        d,
        geo,
        edges,
        home: new THREE.Vector3(...(d.pos ?? [0, 0, 0])),
        from: dir.multiplyScalar(7 + seeded(i + 2) * 4).add(new THREE.Vector3(0, 1.5, 2)),
        spin: new THREE.Euler((seeded(i + 5) - 0.5) * 4, (seeded(i + 6) - 0.5) * 5, (seeded(i + 7) - 0.5) * 3),
        rot: new THREE.Euler(...(d.rot ?? [0, 0, 0])),
        scale: new THREE.Vector3(...(d.scale ?? [1, 1, 1])),
      }
    })
    return { list, mats, seamMat }
  }, [])
  useEffect(() => () => {
    parts.list.forEach((p) => { p.geo.dispose(); p.edges.dispose() })
    Object.values(parts.mats).forEach((m) => m.dispose())
    parts.seamMat.dispose()
  }, [parts])

  const meshes = useRef<(THREE.Group | null)[]>([])
  const qa = useMemo(() => new THREE.Quaternion(), [])
  const qb = useMemo(() => new THREE.Quaternion(), [])

  useFrame((state, dt) => {
    const p = scroll.hero
    const t = state.clock.elapsedTime
    parts.list.forEach((part, i) => {
      const g = meshes.current[i]
      if (!g) return
      // each plate locks in across its own window of the scroll
      const k = easeOut(clamp((p - part.d.order * 0.62) / 0.26, 0, 1))
      const drift = (1 - k) * Math.sin(t * 0.8 + i) * 0.25
      g.position.lerpVectors(part.from, part.home, k).addScalar(drift)
      qa.setFromEuler(part.spin)
      qb.setFromEuler(part.rot)
      g.quaternion.slerpQuaternions(qa, qb, k)
      g.scale.copy(part.scale).multiplyScalar(lerp(0.6, 1, k))
      g.visible = k > 0.001
    })
    const assembled = smoothstep(p, 0.7, 0.95)
    const ignite = smoothstep(p, 0.86, 1)
    parts.seamMat.opacity = 0.15 + assembled * 0.85 * (0.85 + 0.15 * Math.sin(t * 6))
    parts.mats.visor.emissiveIntensity = ignite * (2.6 + Math.sin(t * 9) * 0.15)
    if (group.current) {
      const g = group.current
      g.rotation.y = damp(g.rotation.y, state.pointer.x * 0.45 + Math.sin(t * 0.25) * 0.12 * (1 - assembled * 0.5), 3, dt)
      g.rotation.x = damp(g.rotation.x, -state.pointer.y * 0.18, 3, dt)
    }
  })

  return (
    <group ref={group}>
      <Hologram mobile={mobile} />
      <group scale={[0.84, 1.06, 0.93]}>
        {parts.list.map((part, i) => part.d.head && (
          <group key={part.d.key} ref={(el) => { meshes.current[i] = el }}>
            <mesh geometry={part.geo} material={parts.mats[part.d.mat]} />
            <lineSegments geometry={part.edges} material={parts.seamMat} />
          </group>
        ))}
      </group>
      {parts.list.map((part, i) => !part.d.head && (
        <group key={part.d.key} ref={(el) => { meshes.current[i] = el }}>
          <mesh geometry={part.geo} material={parts.mats[part.d.mat]} />
          <lineSegments geometry={part.edges} material={parts.seamMat} />
        </group>
      ))}
    </group>
  )
}

function Rig({ onFirstFrame }: { onFirstFrame?: () => void }) {
  const { camera, size } = useThree()
  const frames = useRef(0)
  useFrame((_, dt) => {
    if (frames.current < 3 && ++frames.current === 3) onFirstFrame?.()
    const portrait = size.width / size.height < 0.9
    const z = (portrait ? 10.5 : 7.4) - smoothstep(scroll.hero, 0.6, 1) * 1.0
    camera.position.z = damp(camera.position.z, z, 3, dt)
    camera.position.y = damp(camera.position.y, portrait ? -0.9 : -0.55, 3, dt)
    camera.lookAt(0, portrait ? -0.9 : -0.55, 0)
  })
  return null
}

export default function HelmetScene({ mobile, onFirstFrame }: { mobile: boolean; onFirstFrame?: () => void }) {
  return (
    <Canvas className="!absolute inset-0" dpr={mobile ? [1, 1.5] : [1, 1.75]} camera={{ position: [0, -0.55, 7.4], fov: 32 }} gl={{ antialias: true, powerPreference: 'high-performance' }} aria-hidden>
      <color attach="background" args={['#07080a']} />
      <Environment resolution={mobile ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[-4, 3, 4]} scale={[4, 6, 1]} color="#dfe8ff" />
        <Lightformer form="rect" intensity={5} position={[5, 1, -3]} scale={[2, 8, 1]} color="#ff5a1f" />
        <Lightformer form="ring" intensity={1.6} position={[0, 5, 2]} scale={3} color="#9fc7ff" />
        <Lightformer form="rect" intensity={1.2} position={[0, -1, 6]} scale={[8, 3, 1]} color="#c9d6ec" />
      </Environment>
      <directionalLight position={[-3, 4, 5]} intensity={1.6} color="#e8eeff" />
      <directionalLight position={[2, -1, 6]} intensity={0.8} color="#b9c8e6" />
      <directionalLight position={[4, 0, -4]} intensity={2.2} color="#ff5a1f" />
      <Armour mobile={mobile} />
      <Rig onFirstFrame={onFirstFrame} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={mobile ? 0.7 : 0.95} luminanceThreshold={0.75} mipmapBlur />
        <Noise opacity={0.04} blendFunction={BlendFunction.OVERLAY} />
        <Vignette darkness={0.65} offset={0.25} />
      </EffectComposer>
    </Canvas>
  )
}
