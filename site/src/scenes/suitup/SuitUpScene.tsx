import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { fragment, vertex } from './suitupShader'
import { scroll } from '../../lib/store'

export type PortraitImages = { civil: TexImageSource; suit: TexImageSource }
type Portraits = { civil: THREE.Texture; suit: THREE.Texture }

function toTexture(img: TexImageSource) {
  const t = new THREE.Texture(img as HTMLImageElement)
  t.minFilter = THREE.LinearFilter
  t.generateMipmaps = false
  t.needsUpdate = true
  return t
}

function aspectOf(t: THREE.Texture) {
  const img = t.image as { width: number; height: number }
  return img.width / img.height
}

function Quad({ tex, mobile, onFirstFrame }: { tex: Portraits; mobile: boolean; onFirstFrame?: () => void }) {
  const { size } = useThree()
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          tCivil: { value: tex.civil },
          tSuit: { value: tex.suit },
          uRes: { value: new THREE.Vector2() },
          uAspectA: { value: aspectOf(tex.civil) },
          uAspectB: { value: aspectOf(tex.suit) },
          uP: { value: 0 },
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2() },
          uScale: { value: 1 },
          uCenter: { value: new THREE.Vector2(0.5, 0.5) },
          uIntro: { value: 0 },
        },
      }),
    [tex],
  )
  useEffect(() => () => material.dispose(), [material])
  const st = useRef({ p: 0, intro: 0, frames: 0 })

  useFrame((state, dt) => {
    const s = st.current
    if (s.frames < 3 && ++s.frames === 3) onFirstFrame?.()
    const u = material.uniforms
    const dpr = state.gl.getPixelRatio()
    u.uRes.value.set(size.width * dpr, size.height * dpr)
    s.p = THREE.MathUtils.damp(s.p, scroll.hero, 7, dt)
    s.intro = THREE.MathUtils.damp(s.intro, scroll.intro, 2.4, dt)
    u.uP.value = s.p
    u.uIntro.value = s.intro
    u.uTime.value = state.clock.elapsedTime
    u.uMouse.value.x = THREE.MathUtils.damp(u.uMouse.value.x, mobile ? 0 : state.pointer.x, 3, dt)
    u.uMouse.value.y = THREE.MathUtils.damp(u.uMouse.value.y, mobile ? 0 : state.pointer.y, 3, dt)
    const portrait = size.width / size.height < 0.9
    u.uScale.value = portrait ? 0.74 : 1.04
    u.uCenter.value.set(portrait ? 0.5 : 0.47, portrait ? 0.55 : 0.48)
  })

  return (
    <mesh material={material} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}

export default function SuitUpScene({ images, mobile, onFirstFrame }: { images: PortraitImages; mobile: boolean; onFirstFrame?: () => void }) {
  const tex = useMemo<Portraits>(() => ({ civil: toTexture(images.civil), suit: toTexture(images.suit) }), [images])
  useEffect(() => () => { tex.civil.dispose(); tex.suit.dispose() }, [tex])
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={mobile ? [1, 1.5] : [1, 2]}
      flat
      linear
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      orthographic
      aria-hidden
    >
      <Quad tex={tex} mobile={mobile} onFirstFrame={onFirstFrame} />
    </Canvas>
  )
}
