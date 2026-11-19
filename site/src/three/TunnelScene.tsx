import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { BlendFunction, type ChromaticAberrationEffect } from 'postprocessing'
import * as THREE from 'three'
import { projects } from '../content'
import { makeCover } from '../lib/covers'
import { scroll } from '../lib/store'

import { DEPTH, GAP, START_Z } from './tunnelConfig'

const cardVertex = /* glsl */ `
uniform float uBend;
varying vec2 vUv;
varying float vFog;
void main(){
  vUv = uv;
  vec3 p = position;
  p.z += sin(uv.x * 3.14159) * uBend;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vFog = smoothstep(7.0, 24.0, -mv.z);
  gl_Position = projectionMatrix * mv;
}
`
const cardFragment = /* glsl */ `
uniform sampler2D uMap;
uniform float uShift;
uniform float uHover;
varying vec2 vUv;
varying float vFog;
void main(){
  vec2 uv = (vUv - 0.5) * (1.0 - uHover * 0.06) + 0.5;
  float r = texture2D(uMap, uv + vec2(uShift, 0.0)).r;
  float g = texture2D(uMap, uv).g;
  float b = texture2D(uMap, uv - vec2(uShift, 0.0)).b;
  gl_FragColor = vec4(mix(vec3(r, g, b), vec3(0.0035), vFog), 1.0);
  #include <colorspace_fragment>
}
`

function Card({ index }: { index: number }) {
  const p = projects[index]
  const ref = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const uniforms = useMemo(() => {
    const tex = new THREE.CanvasTexture(makeCover(p, 768, 960))
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return { uMap: { value: tex }, uShift: { value: 0 }, uBend: { value: 0 }, uHover: { value: 0 } }
  }, [p])
  const material = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: cardVertex, fragmentShader: cardFragment, uniforms }),
    [uniforms],
  )

  const angle = index * 2.35 + 0.6
  const x = Math.cos(angle) * 2.3
  const y = Math.sin(angle) * 1.25
  const z = -index * GAP

  useFrame((_, dt) => {
    const v = THREE.MathUtils.clamp(scroll.velocity * 0.0009, -0.6, 0.6)
    uniforms.uBend.value = THREE.MathUtils.damp(uniforms.uBend.value, v, 6, dt)
    uniforms.uShift.value = THREE.MathUtils.damp(uniforms.uShift.value, Math.abs(v) * 0.02, 6, dt)
    uniforms.uHover.value = THREE.MathUtils.damp(uniforms.uHover.value, hovered ? 1 : 0, 8, dt)
    if (ref.current) {
      const s = 1 + uniforms.uHover.value * 0.06
      ref.current.scale.set(s, s, s)
    }
  })

  return (
    <mesh
      ref={ref}
      material={material}
      position={[x, y, z]}
      rotation={[0, -x * 0.12, -x * 0.02]}
      onPointerOver={() => {
        setHovered(true)
        document.body.dataset.cursor = 'view'
      }}
      onPointerOut={() => {
        setHovered(false)
        delete document.body.dataset.cursor
      }}
    >
      <planeGeometry args={[2.2, 2.75, 24, 1]} />
    </mesh>
  )
}

function Rings() {
  const group = useMemo(() => {
    const g = new THREE.Group()
    const pts = new THREE.EllipseCurve(0, 0, 4.2, 2.8, 0, Math.PI * 2).getPoints(96)
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    const count = Math.ceil((DEPTH + 30) / 1.6)
    for (let i = 0; i < count; i++) {
      const mat = new THREE.LineBasicMaterial({
        color: i % 6 === 0 ? '#ff3b1f' : '#ece8e1',
        transparent: true,
        opacity: i % 6 === 0 ? 0.55 : 0.12,
      })
      const l = new THREE.LineLoop(geo, mat)
      l.position.z = START_Z - i * 1.6
      g.add(l)
    }
    return g
  }, [])
  return <primitive object={group} />
}

function Rig() {
  const ca = useRef<ChromaticAberrationEffect>(null)
  useFrame((state, dt) => {
    const cam = state.camera
    const targetZ = START_Z - scroll.tunnel * DEPTH
    cam.position.z = THREE.MathUtils.damp(cam.position.z, targetZ, 5, dt)
    cam.position.x = THREE.MathUtils.damp(cam.position.x, state.pointer.x * 0.6, 3, dt)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, state.pointer.y * 0.4, 3, dt)
    cam.rotation.z = THREE.MathUtils.damp(cam.rotation.z, scroll.tunnel * 0.6 + scroll.velocity * 0.00005, 3, dt)
    const v = Math.min(Math.abs(scroll.velocity) * 0.00015, 0.008)
    ca.current?.offset.set(0.0005 + v, 0.0002 + v * 0.5)
  })
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.6} luminanceThreshold={0.5} mipmapBlur />
      <ChromaticAberration ref={ca} offset={new THREE.Vector2(0.0005, 0.0002)} radialModulation modulationOffset={0.2} />
      <Noise opacity={0.07} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  )
}

export default function TunnelScene({ active }: { active: boolean }) {
  return (
    <Canvas
      className="tunnel__canvas"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, START_Z], fov: 55, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
    >
      <color attach="background" args={['#0b0b0c']} />
      <fog attach="fog" args={['#0b0b0c', 4, 22]} />
      <Rings />
      {projects.map((_, i) => (
        <Card key={i} index={i} />
      ))}
      <Rig />
    </Canvas>
  )
}
