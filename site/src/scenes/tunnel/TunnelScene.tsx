import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { projects } from '../../data/projects'
import { coverURL, drawCover } from '../../lib/covers'
import { scroll } from '../../lib/store'
import { DEPTH, GAP, START_Z } from './config'

const screenVertex = /* glsl */ `
uniform float uBend;
varying vec2 vUv;
varying float vFog;
void main(){
  vUv = uv;
  vec3 p = position;
  p.z -= (pow(uv.x - 0.5, 2.0) * 0.9 + pow(uv.y - 0.5, 2.0) * 0.35) * (0.6 + uBend); // curved CRT-like screen
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vFog = smoothstep(9.0, 26.0, -mv.z);
  gl_Position = projectionMatrix * mv;
}
`
const screenFragment = /* glsl */ `
uniform sampler2D uMap;
uniform vec2 uFit;
uniform float uShift;
uniform float uTime;
uniform float uHover;
varying vec2 vUv;
varying float vFog;
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 uv = (vUv - 0.5) * uFit * (1.0 - uHover * 0.05) + 0.5;
  float s = uShift + 0.0015;
  vec3 c = vec3(texture2D(uMap, uv + vec2(s, 0.0)).r, texture2D(uMap, uv).g, texture2D(uMap, uv - vec2(s, 0.0)).b);
  float g = dot(c, vec3(0.299, 0.587, 0.114));
  c = mix(vec3(g), c, 0.25 + uHover * 0.75) * 0.92;                 // muted, colour returns on hover
  c *= 0.9 + 0.1 * sin(vUv.y * 480.0 + uTime * 6.0);           // scanlines
  c += (hash(vUv * 900.0 + uTime) - 0.5) * 0.05;              // noise
  float edge = max(step(vUv.x, 0.004) + step(0.996, vUv.x), step(vUv.y, 0.006) + step(0.994, vUv.y));
  c = mix(c, vec3(1.0, 0.353, 0.122), edge * 0.9);            // ignition-orange frame
  gl_FragColor = vec4(mix(c, vec3(0.027, 0.031, 0.039), vFog), 1.0);
}
`

function Screen({ index, onOpen }: { index: number; onOpen: (i: number) => void }) {
  const p = projects[index]
  const hovered = useRef(false)
  const material = useMemo(() => {
    const tex = new THREE.CanvasTexture(drawCover(p, 1024, 640))
    tex.colorSpace = THREE.SRGBColorSpace
    const mat = new THREE.ShaderMaterial({
      vertexShader: screenVertex,
      fragmentShader: screenFragment,
      uniforms: { uMap: { value: tex }, uFit: { value: new THREE.Vector2(1, 1) }, uShift: { value: 0 }, uBend: { value: 0 }, uTime: { value: 0 }, uHover: { value: 0 } },
    })
    if (p.cover) {
      new THREE.TextureLoader().load(coverURL(p), (img) => {
        img.colorSpace = THREE.SRGBColorSpace
        const a = (img.image as HTMLImageElement).width / (img.image as HTMLImageElement).height
        const plane = 3.4 / 2.125
        mat.uniforms.uFit.value.set(a > plane ? plane / a : 1, a > plane ? 1 : a / plane) // object-fit: cover
        ;(mat.uniforms.uMap.value as THREE.Texture).dispose()
        mat.uniforms.uMap.value = img
      })
    }
    return mat
  }, [p])
  useEffect(() => () => { (material.uniforms.uMap.value as THREE.Texture).dispose(); material.dispose() }, [material])
  const side = index % 2 === 0 ? -1 : 1
  useFrame((state, dt) => {
    const u = material.uniforms
    const v = THREE.MathUtils.clamp(scroll.velocity * 0.0011, -0.8, 0.8)
    u.uBend.value = THREE.MathUtils.damp(u.uBend.value, Math.abs(v), 6, dt)
    u.uShift.value = THREE.MathUtils.damp(u.uShift.value, Math.abs(v) * 0.018, 6, dt)
    u.uHover.value = THREE.MathUtils.damp(u.uHover.value, hovered.current ? 1 : 0, 8, dt)
    u.uTime.value = state.clock.elapsedTime
  })
  return (
    <mesh
      material={material}
      position={[side * 1.05, (index % 3 - 1) * 0.25, -(index + 1) * GAP]}
      rotation={[0, side * -0.08, 0]}
      onPointerOver={() => { hovered.current = true; document.body.dataset.cursor = 'Open' }}
      onPointerOut={() => { hovered.current = false; delete document.body.dataset.cursor }}
      onClick={() => onOpen(index)}
    >
      <planeGeometry args={[3.4, 2.125, 32, 16]} />
    </mesh>
  )
}

function Frames() {
  const group = useMemo(() => {
    const g = new THREE.Group()
    const rect = (w: number, h: number) =>
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-w, -h, 0), new THREE.Vector3(w, -h, 0), new THREE.Vector3(w, h, 0), new THREE.Vector3(-w, h, 0)])
    const geo = rect(4.6, 2.7)
    const inner = rect(3.9, 2.25)
    const n = Math.ceil((DEPTH + 30) / 2)
    for (let i = 0; i < n; i++) {
      const accent = i % 4 === 0
      const mat = new THREE.LineBasicMaterial({ color: accent ? '#ff5a1f' : '#ededf0', transparent: true, opacity: accent ? 0.55 : 0.1, fog: true })
      const l = new THREE.LineLoop(i % 2 ? inner : geo, mat)
      l.position.z = START_Z + 2 - i * 2
      g.add(l)
    }
    // warp streaks along the walls
    const pts: number[] = []
    let seed = 7
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < 260; i++) {
      const a = r() * Math.PI * 2
      const x = Math.cos(a) * (4 + r() * 3), y = Math.sin(a) * (2.6 + r() * 2)
      const z = START_Z - r() * (DEPTH + 20), len = 0.6 + r() * 2.2
      pts.push(x, y, z, x, y, z - len)
    }
    const sg = new THREE.BufferGeometry()
    sg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    g.add(new THREE.LineSegments(sg, new THREE.LineBasicMaterial({ color: '#31a8ff', transparent: true, opacity: 0.35, fog: true })))
    return g
  }, [])
  useEffect(() => () => {
    group.traverse((o) => {
      const l = o as THREE.Line
      l.geometry?.dispose()
      ;(l.material as THREE.Material | undefined)?.dispose()
    })
  }, [group])
  return <primitive object={group} />
}

function Rig() {
  useFrame((state, dt) => {
    const cam = state.camera
    const z = START_Z - scroll.tunnel * DEPTH
    cam.position.z = THREE.MathUtils.damp(cam.position.z, z, 5, dt)
    cam.position.x = THREE.MathUtils.damp(cam.position.x, state.pointer.x * 0.45, 3, dt)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, state.pointer.y * 0.25, 3, dt)
    cam.rotation.z = THREE.MathUtils.damp(cam.rotation.z, THREE.MathUtils.clamp(scroll.velocity * -0.00004, -0.06, 0.06), 4, dt)
  })
  return null
}

export default function TunnelScene({ onOpen, mobile }: { onOpen: (i: number) => void; mobile: boolean }) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [0, 0, START_Z], fov: mobile ? 72 : 55, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      aria-hidden
    >
      <color attach="background" args={['#07080a']} />
      <fog attach="fog" args={['#07080a', 8, 26]} />
      <Frames />
      {projects.map((_, i) => <Screen key={i} index={i} onOpen={onOpen} />)}
      <Rig />
    </Canvas>
  )
}
