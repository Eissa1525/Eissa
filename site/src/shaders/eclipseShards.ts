import * as THREE from 'three'

/**
 * Shard motion is computed in the vertex shader. Four states blend through three uniforms:
 *   uK1  origin → awakening (orbital separation)
 *   uK2  awakening → formation (halo assembly)
 * Each shard has its own delay (aRand.w) so transitions ripple instead of snapping.
 */
export const shardHeader = /* glsl */ `
uniform float uTime;
uniform float uK1;
uniform float uK2;
uniform float uFormScale;
uniform float uSweep;
attribute vec3 aCenter;
attribute vec3 aTarget;
attribute vec3 aTargetN;
attribute vec4 aRand;
attribute float aU;
varying float vGlow;
varying float vGlass;

vec3 rotAxis(vec3 v, vec3 k, float a){
  float c = cos(a), s = sin(a);
  return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c);
}
vec3 rotX(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }
vec3 rotZ(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(c*p.x - s*p.y, s*p.x + c*p.y, p.z); }
vec3 align(vec3 v, vec3 from, vec3 to){
  vec3 ax = cross(from, to);
  float s = length(ax);
  if (s < 1e-4) return dot(from, to) < 0.0 ? -v : v;
  return rotAxis(v, ax / s, atan(s, dot(from, to)));
}
float stagger(float k, float d){ return smoothstep(0.0, 1.0, clamp(k * 1.45 - d * 0.45, 0.0, 1.0)); }
`

export const shardBegin = /* glsl */ `
  float k1 = stagger(uK1, aRand.w);
  float k2 = stagger(uK2, aRand.w);
  vec3 n0 = normalize(aCenter);
  vec3 axis = normalize(aRand.xyz * 2.0 - 1.0 + vec3(0.001));

  // 01 ORIGIN — fractured, unfinished sphere; a few shards drift away like debris
  float debris = step(0.86, aRand.y);
  vec3 c1 = aCenter * (1.0 + aRand.x * 0.07 + debris * (0.35 + 0.15 * sin(uTime * 0.4 + aRand.z * 6.0)));
  float a1 = (aRand.z - 0.5) * 0.5 + debris * uTime * 0.2;

  // 02 AWAKENING — shards separate into three tilted orbital bands
  float band = floor(aRand.y * 3.0);
  float radius = 1.75 + band * 0.55 + aRand.x * 0.3;
  float ang = aRand.z * 6.2831 + uTime * (0.32 - band * 0.07) * (mod(band, 2.0) * 2.0 - 1.0);
  vec3 c2 = vec3(cos(ang) * radius, (aRand.w - 0.5) * 0.35, sin(ang) * radius);
  c2 = rotX(c2, 0.35 + band * 0.55);
  c2 = rotZ(c2, band * 0.9 - 0.4);
  float a2 = uTime * (0.6 + aRand.x) + aRand.y * 6.2831;

  // 03 FORMATION — every shard locks onto the halo surface
  vec3 c3 = aTarget;

  vec3 l1 = rotAxis(position, axis, a1);
  vec3 l2 = rotAxis(position, axis, a2) * 0.92;
  vec3 l3 = align(position, n0, aTargetN) * uFormScale;
  vec3 n1 = rotAxis(normal, axis, a1);
  vec3 n2 = rotAxis(normal, axis, a2);
  vec3 n3 = align(normal, n0, aTargetN);

  vec3 cc = mix(mix(c1, c2, k1), c3, k2);
  vec3 shardPos = cc + mix(mix(l1, l2, k1), l3, k2);
  vec3 objectNormal = normalize(mix(mix(n1, n2, k1), n3, k2));

  // light travelling through the geometry (awakening) + a glint orbiting the halo (formation)
  float sweepBand = exp(-pow((dot(cc, normalize(vec3(1.0, 0.4, 0.2))) - uSweep) * 1.6, 2.0));
  float wake = sin(3.14159 * clamp(uK1, 0.0, 1.0)) * (1.0 - k2);
  float du = abs(mod(aU - uTime * 0.6 + 3.14159, 6.28318) - 3.14159);
  float glint = exp(-du * du * 6.0) * k2;
  vGlow = sweepBand * wake * 1.6 + glint * 0.9 + debris * (1.0 - k1) * 0.08;
  vGlass = step(0.58, aRand.x) * k2;
`

export type ShardUniforms = {
  uTime: { value: number }
  uK1: { value: number }
  uK2: { value: number }
  uFormScale: { value: number }
  uSweep: { value: number }
  uGlowColor: { value: THREE.Color }
  uGlassColor: { value: THREE.Color }
}

export function createShardMaterial(uniforms: ShardUniforms) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: '#16141c',
    roughness: 0.85,
    metalness: 0.3,
    clearcoat: 0,
    clearcoatRoughness: 0.15,
    envMapIntensity: 0.3,
    flatShading: false,
  })
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${shardHeader}`)
      .replace('#include <beginnormal_vertex>', shardBegin)
      .replace('#include <begin_vertex>', 'vec3 transformed = shardPos;')
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\nuniform vec3 uGlowColor;\nuniform vec3 uGlassColor;\nvarying float vGlow;\nvarying float vGlass;`,
      )
      .replace('#include <color_fragment>', `#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, uGlassColor, vGlass);`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.06, vGlass);`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor, 0.25, vGlass);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\ntotalEmissiveRadiance += uGlowColor * vGlow;`)
  }
  mat.customProgramCacheKey = () => 'aether-shards-v1'
  return mat
}

/** Corona behind the eclipse: dark disc + atmospheric violet/platinum ring + soft rays. */
export const coronaVertex = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
export const coronaFragment = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
uniform float uDisc;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y); }
void main(){
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  float a = atan(p.y, p.x);
  float R = 0.32;
  float rays = noise(vec2(a * 6.0, uTime * 0.15)) * 0.6 + noise(vec2(a * 17.0, -uTime * 0.1)) * 0.4;
  float corona = exp(-max(r - R, 0.0) * (7.0 - rays * 3.0)) * smoothstep(R - 0.01, R + 0.004, r);
  float rim = exp(-pow((r - R) * 90.0, 2.0));
  vec3 violet = vec3(0.42, 0.28, 1.0);
  vec3 plat = vec3(0.92, 0.9, 1.0);
  vec3 col = violet * corona * 0.9 + plat * rim * 1.4;
  float alpha = (corona * 0.85 + rim) * uIntensity;
  float disc = (1.0 - smoothstep(R - 0.006, R, r)) * uDisc;
  gl_FragColor = vec4(col * uIntensity, max(alpha, disc));
}
`
