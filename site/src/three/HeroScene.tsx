import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction, type ChromaticAberrationEffect } from 'postprocessing'
import * as THREE from 'three'
import { simplex } from './noise.glsl'
import { scroll } from '../lib/store'

const vertex = /* glsl */ `
uniform float uTime;
uniform float uMorph;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;
varying float vDisp;
${simplex}
float disp(vec3 n){
  float t = uTime * 0.22;
  float a = snoise(n * 1.15 + t) * 0.17 + snoise(n * 3.2 - t * 1.4) * 0.035;
  float q = floor(snoise(n * 2.4 + t * 0.6) * 5.0) / 5.0;
  float spikes = pow(max(0.0, snoise(n * 2.0 + t * 1.8)), 3.0) * 0.95;
  float b = q * 0.12 + spikes;
  return mix(a, b, uMorph);
}
vec3 displaced(vec3 n, float r){ return n * (r + disp(n)); }
void main(){
  float r = length(position);
  vec3 n0 = normalize(position);
  vec3 up = abs(n0.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 t = normalize(cross(n0, up));
  vec3 b = normalize(cross(n0, t));
  float e = 0.012;
  vec3 p  = displaced(n0, r);
  vec3 pt = displaced(normalize(n0 + t * e), r);
  vec3 pb = displaced(normalize(n0 + b * e), r);
  vec3 nrm = normalize(cross(pt - p, pb - p));
  if (dot(nrm, n0) < 0.0) nrm = -nrm;
  vDisp = disp(n0);
  vPos = p;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vView = -mv.xyz;
  vNormal = normalize(normalMatrix * nrm);
  gl_Position = projectionMatrix * mv;
}
`

const fragment = /* glsl */ `
uniform float uTime;
uniform float uMorph;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;
varying float vDisp;
void main(){
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  float fres = pow(1.0 - max(dot(n, v), 0.0), 2.4);
  vec3 L = normalize(vec3(0.5, 0.9, 0.6));
  float diff = max(dot(n, L), 0.0);
  float spec = pow(max(dot(reflect(-L, n), v), 0.0), 48.0);

  vec3 irid = 0.5 + 0.5 * cos(6.2831 * (fres * 0.7 + vDisp * 1.6 + vec3(0.0, 0.33, 0.67)));
  vec3 self = vec3(0.02) + diff * vec3(0.07, 0.068, 0.066) + fres * irid * 0.75 + spec * 1.1;

  vec3 red = vec3(1.0, 0.23, 0.12);
  float scan = step(0.55, fract(vPos.y * 26.0 - uTime * 1.6));
  vec3 alter = vec3(0.01) + diff * vec3(0.05, 0.02, 0.02) + fres * red * 1.7 + spec * vec3(1.0, 0.75, 0.65) * 0.8
             + red * smoothstep(0.3, 0.9, vDisp) * 1.1 + scan * fres * red * 0.35;

  gl_FragColor = vec4(mix(self, alter, uMorph), 1.0);
  #include <colorspace_fragment>
}
`

const wireFragment = /* glsl */ `
uniform float uMorph;
void main(){ gl_FragColor = vec4(1.0, 0.3, 0.2, uMorph * 0.14); }
`

function Core() {
  const group = useRef<THREE.Group>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uMorph: { value: 0 } }), [])
  const [solid, wire] = useMemo(
    () => [
      new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms }),
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: wireFragment,
        uniforms,
        wireframe: true,
        transparent: true,
        depthWrite: false,
      }),
    ],
    [uniforms],
  )
  const morph = useRef(0)

  useFrame((state, dt) => {
    const target = THREE.MathUtils.smoothstep(scroll.hero, 0.28, 0.62)
    morph.current = THREE.MathUtils.damp(morph.current, target, 4, dt)
    uniforms.uTime.value += dt * (1 + morph.current * 1.5)
    uniforms.uMorph.value = morph.current
    const g = group.current
    if (!g) return
    const px = state.pointer.x
    const py = state.pointer.y
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.5 + scroll.hero * Math.PI * 1.2, 3, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.3, 3, dt)
    const s = 1 + scroll.hero * 0.25
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 3, dt))
    g.position.y = THREE.MathUtils.damp(g.position.y, 0.15 - scroll.hero * 0.3, 3, dt)
  })

  return (
    <group ref={group}>
      <mesh material={solid}>
        <icosahedronGeometry args={[0.92, 96]} />
      </mesh>
      <mesh scale={1.015} material={wire}>
        <icosahedronGeometry args={[0.92, 20]} />
      </mesh>
    </group>
  )
}

function Effects() {
  const ca = useRef<ChromaticAberrationEffect>(null)
  useFrame(() => {
    const m = THREE.MathUtils.smoothstep(scroll.hero, 0.28, 0.62)
    const v = Math.min(Math.abs(scroll.velocity) * 0.00012, 0.006)
    ca.current?.offset.set(0.0006 + m * 0.0022 + v, 0.0003 + m * 0.001)
  })
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.7} luminanceThreshold={0.55} luminanceSmoothing={0.25} mipmapBlur />
      <ChromaticAberration ref={ca} offset={new THREE.Vector2(0.0006, 0.0003)} radialModulation={false} modulationOffset={0} />
      <Noise opacity={0.06} blendFunction={BlendFunction.OVERLAY} />
      <Vignette darkness={0.65} offset={0.25} />
    </EffectComposer>
  )
}

export default function HeroScene({ active }: { active: boolean }) {
  return (
    <Canvas
      className="hero__canvas"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.2], fov: 38 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
    >
      <color attach="background" args={['#0b0b0c']} />
      <Core />
      <Sparkles count={70} scale={[9, 6, 4]} size={1.6} speed={0.25} opacity={0.5} color="#ece8e1" />
      <Effects />
    </Canvas>
  )
}
