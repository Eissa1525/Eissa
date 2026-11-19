import * as THREE from 'three'

export const RING = { R: 1.5, r: 0.3 }

/**
 * Builds the Eclipse sculpture: every face of a geodesic sphere becomes a thick glass/stone shard.
 * Per-vertex attributes carry each shard's origin (sphere), and its target on the final halo (torus),
 * so the GPU can interpolate all four states without any CPU work per frame.
 */
export function createShardGeometry(detail: number) {
  const base = new THREE.IcosahedronGeometry(1, detail) // already non-indexed
  const src = base.getAttribute('position') as THREE.BufferAttribute
  const faces = src.count / 3
  const V = 24 // 8 triangles per prism

  const position = new Float32Array(faces * V * 3)
  const normal = new Float32Array(faces * V * 3)
  const center = new Float32Array(faces * V * 3)
  const target = new Float32Array(faces * V * 3)
  const targetN = new Float32Array(faces * V * 3)
  const rand = new Float32Array(faces * V * 4)
  const ringU = new Float32Array(faces * V)

  let seed = 1337
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646

  const uCount = Math.round(Math.sqrt((faces * RING.R) / RING.r))
  const vCount = Math.ceil(faces / uCount)

  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  const C = new THREE.Vector3(), n = new THREE.Vector3(), tmp = new THREE.Vector3()
  let o = 0

  const push = (p: THREE.Vector3, nn: THREE.Vector3, f: number, r4: number[], tP: number[], tN: number[], u: number) => {
    position.set([p.x, p.y, p.z], o * 3)
    normal.set([nn.x, nn.y, nn.z], o * 3)
    center.set([C.x, C.y, C.z], o * 3)
    target.set(tP, o * 3)
    targetN.set(tN, o * 3)
    rand.set(r4, o * 4)
    ringU[o] = u
    void f
    o++
  }

  // shuffle face → torus cell mapping so neighbours on the sphere scatter across the ring
  const order = Array.from({ length: faces }, (_, i) => i)
  for (let i = faces - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }

  for (let f = 0; f < faces; f++) {
    a.fromBufferAttribute(src, f * 3)
    b.fromBufferAttribute(src, f * 3 + 1)
    c.fromBufferAttribute(src, f * 3 + 2)
    C.copy(a).add(b).add(c).divideScalar(3)
    n.copy(C).normalize()

    const shrink = 0.78 + rnd() * 0.16
    const thick = 0.05 + rnd() * 0.07
    const la = a.clone().sub(C).multiplyScalar(shrink)
    const lb = b.clone().sub(C).multiplyScalar(shrink)
    const lc = c.clone().sub(C).multiplyScalar(shrink)
    // ensure outward winding
    tmp.copy(lb).sub(la).cross(lc.clone().sub(la))
    if (tmp.dot(n) < 0) { const t = lb.clone(); lb.copy(lc); lc.copy(t) }

    const half = n.clone().multiplyScalar(thick / 2)
    const fa = la.clone().add(half), fb = lb.clone().add(half), fc = lc.clone().add(half)
    const ba = la.clone().sub(half), bb = lb.clone().sub(half), bc = lc.clone().sub(half)

    // torus target cell
    const cell = order[f]
    const iu = cell % uCount
    const iv = Math.floor(cell / uCount)
    const u = ((iu + (iv % 2) * 0.5) / uCount) * Math.PI * 2
    const v = (iv / vCount) * Math.PI * 2
    const tP = [(RING.R + RING.r * Math.cos(v)) * Math.cos(u), (RING.R + RING.r * Math.cos(v)) * Math.sin(u), RING.r * Math.sin(v)]
    const tN = [Math.cos(v) * Math.cos(u), Math.cos(v) * Math.sin(u), Math.sin(v)]
    const r4 = [rnd(), rnd(), rnd(), rnd()]

    const tri = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3) => {
      const nn = p2.clone().sub(p1).cross(p3.clone().sub(p1)).normalize()
      // side faces must point away from the shard centre
      const mid = p1.clone().add(p2).add(p3).divideScalar(3)
      if (nn.dot(mid) < 0 && Math.abs(nn.dot(n)) < 0.9) nn.negate()
      push(p1, nn, f, r4, tP, tN, u)
      push(p2, nn, f, r4, tP, tN, u)
      push(p3, nn, f, r4, tP, tN, u)
    }
    tri(fa, fb, fc)
    tri(ba, bc, bb)
    const side = (p: THREE.Vector3, q: THREE.Vector3, bp: THREE.Vector3, bq: THREE.Vector3) => {
      const nn = q.clone().sub(p).cross(bp.clone().sub(p)).normalize()
      const mid = p.clone().add(q).multiplyScalar(0.5)
      const flip = nn.dot(mid) < 0
      if (flip) { tri2(p, bp, q, mid); tri2(q, bp, bq, mid) } else { tri2(p, q, bp, mid); tri2(q, bq, bp, mid) }
    }
    const tri2 = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, mid: THREE.Vector3) => {
      const nn = p2.clone().sub(p1).cross(p3.clone().sub(p1)).normalize()
      if (nn.dot(mid) < 0) nn.negate()
      push(p1, nn, f, r4, tP, tN, u)
      push(p2, nn, f, r4, tP, tN, u)
      push(p3, nn, f, r4, tP, tN, u)
    }
    side(fa, fb, ba, bb)
    side(fb, fc, bb, bc)
    side(fc, fa, bc, ba)
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(position, 3))
  g.setAttribute('normal', new THREE.BufferAttribute(normal, 3))
  g.setAttribute('aCenter', new THREE.BufferAttribute(center, 3))
  g.setAttribute('aTarget', new THREE.BufferAttribute(target, 3))
  g.setAttribute('aTargetN', new THREE.BufferAttribute(targetN, 3))
  g.setAttribute('aRand', new THREE.BufferAttribute(rand, 4))
  g.setAttribute('aU', new THREE.BufferAttribute(ringU, 1))
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4)
  base.dispose()
  return { geometry: g, faces, formScale: Math.sqrt(Math.PI * RING.R * RING.r) * 0.9 }
}
