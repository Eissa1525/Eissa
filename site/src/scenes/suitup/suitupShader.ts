export const vertex = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`

export const fragment = /* glsl */ `
precision highp float;
uniform sampler2D tCivil;
uniform sampler2D tSuit;
uniform vec2 uRes;
uniform float uAspectA;
uniform float uAspectB;
uniform float uP;       // 0 civilian → 1 suited
uniform float uTime;
uniform vec2 uMouse;
uniform float uScale;   // portrait height as a fraction of the viewport
uniform vec2 uCenter;   // portrait centre in screen uv
uniform float uIntro;   // 0..1 fade-in after preloader
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }

vec2 portraitUV(vec2 p, float aspect){
  vec2 size = vec2(uRes.y * uScale * aspect, uRes.y * uScale);
  vec2 c = uRes * uCenter + uMouse * vec2(18.0, 10.0);
  return (p - (c - size * 0.5)) / size;
}
float inside(vec2 q){ return step(0.0, q.x) * step(q.x, 1.0) * step(0.0, q.y) * step(q.y, 1.0); }
float edgeMask(vec2 q){
  return smoothstep(0.0, 0.2, q.x) * smoothstep(1.0, 0.8, q.x) * smoothstep(0.0, 0.14, q.y) * smoothstep(1.0, 0.92, q.y);
}

void main(){
  vec2 uv = vUv;
  vec2 p = uv * uRes;
  float t = uTime;

  // ---- topographic contours (background)
  vec2 cp = vec2(uv.x * uRes.x / uRes.y, uv.y) * 1.35 + vec2(0.0, t * 0.008);
  float f = fbm(cp + fbm(cp * 0.7 + 3.1) * 0.6) * 15.0;
  float w = fwidth(f);
  float contour = 1.0 - smoothstep(0.0, w * 1.4, abs(fract(f) - 0.5) - 0.5 + w * 1.4);
  vec3 col = vec3(0.027, 0.031, 0.039) + vec3(0.93) * contour * 0.055;

  // ---- scan line position (top → bottom)
  float scan = mix(1.08, -0.08, uP);
  float scanOn = smoothstep(0.0, 0.03, uP) * smoothstep(1.0, 0.97, uP);
  float d = uv.y - scan + (noise(vec2(uv.x * 38.0, t * 4.0)) - 0.5) * 0.012;
  float band = exp(-pow(d / 0.045, 2.0)) * scanOn;

  // glitch slicing + chromatic split inside the band
  float row = floor(uv.y * uRes.y / 6.0);
  float slice = (hash(vec2(row, floor(t * 24.0))) - 0.5) * 0.09 * band;
  float split = 0.006 * band + 0.0015;
  vec2 pp = p + vec2(slice * uRes.x * 0.25, 0.0);

  vec2 qa = portraitUV(pp, uAspectA);
  vec2 qb = portraitUV(pp, uAspectB);
  vec2 dx = vec2(split, 0.0);
  vec3 a = vec3(texture2D(tCivil, qa + dx).r, texture2D(tCivil, qa).g, texture2D(tCivil, qa - dx).b);
  vec3 b = vec3(texture2D(tSuit, qb + dx).r, texture2D(tSuit, qb).g, texture2D(tSuit, qb - dx).b);

  // civilian is graded to cold black & white, suited stays in colour
  float luma = dot(a, vec3(0.299, 0.587, 0.114));
  vec3 civ = vec3(pow(luma, 1.08)) * vec3(0.96, 0.97, 1.0);
  vec3 suit = b * 1.05;

  float reveal = smoothstep(-0.002, 0.002, d);
  float ma = inside(qa) * edgeMask(qa);
  float mb = inside(qb) * edgeMask(qb);
  vec3 img = mix(civ, suit, reveal);
  float m = mix(ma, mb, reveal) * uIntro;
  col = mix(col, img, m);

  // ---- ignition line, haze and sparks
  vec3 orange = vec3(1.0, 0.353, 0.122);
  float line = exp(-pow(d / 0.0022, 2.0)) * scanOn;
  float haze = exp(-abs(d) / 0.05) * scanOn;
  col += orange * line * 2.2;
  col += orange * haze * (0.12 + contour * 0.9);
  float spark = step(0.985, hash(floor(p / 3.0) + floor(t * 30.0))) * exp(-abs(d) / 0.02) * scanOn;
  col += orange * spark * 1.6;

  // ---- finishing: scanlines, vignette, grain
  col *= 0.97 + 0.03 * sin(p.y * 1.6);
  float vig = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(uRes.x / uRes.y, 1.0)));
  col *= mix(0.55, 1.0, vig);
  col += (hash(p + t) - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}
`
