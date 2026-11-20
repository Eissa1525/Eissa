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
uniform float uProc;    // 1 = build the alter ego procedurally from the civilian photo
uniform vec2 uTexel;    // 1 / civilian texture size
uniform vec4 uFace;     // face ellipse in image uv: centre.xy, radius.xy
uniform vec3 uVisor;    // visor: y, half-width, half-height (image uv)
uniform vec2 uChest;    // chest emblem centre (image uv)
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
float lum(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }
float L(vec2 q){ return lum(texture2D(tCivil, q).rgb); }
float blurL(vec2 q, float r){
  float s = L(q) * 0.2;
  for (int i = 0; i < 8; i++){ float a = float(i) * 0.7854; s += L(q + vec2(cos(a), sin(a)) * uTexel * r) * 0.1; }
  return s;
}

// The alter ego, generated from the real photo: a tactical hologram — halftone body,
// orange silhouette glow, visor, chest emblem and travelling scanlines.
vec3 proceduralSuit(vec2 q, float t){
  vec3 orange = vec3(1.0, 0.353, 0.122);
  vec3 steel = vec3(0.42, 0.58, 0.86);
  float s6 = blurL(q, 6.0);
  float subject = smoothstep(0.03, 0.085, s6);
  vec2 fd = (q - uFace.xy) / uFace.zw;
  float face = 1.0 - smoothstep(0.85, 1.0, length(fd));

  // halftone dots on a screen-space grid, size driven by the (smoothed) light
  float l = blurL(q, 3.0);
  float cell = 5.0;
  vec2 g = gl_FragCoord.xy / cell;
  vec2 c = fract(g) - 0.5;
  float r = sqrt(clamp(l * 1.25, 0.0, 1.0)) * 0.62;
  float dotMask = 1.0 - smoothstep(r - 0.12, r, length(c));
  vec3 col = vec3(0.012, 0.02, 0.035);
  col += mix(steel * 0.55, vec3(0.86, 0.93, 1.0), smoothstep(0.45, 0.85, l)) * dotMask * subject;

  // silhouette glow (edge of the subject mask at large scale)
  float s18 = smoothstep(0.03, 0.085, blurL(q, 18.0));
  float rim = clamp(s18 * (1.0 - s18) * 4.0, 0.0, 1.0);
  col += orange * rim * 1.1;

  // travelling scanlines + flicker
  float scanl = smoothstep(0.92, 1.0, sin(q.y * 220.0 - t * 5.0)) * 0.25;
  col += steel * scanl * subject;
  col *= 0.92 + 0.08 * sin(t * 13.0 + q.y * 7.0);

  // helmet ridge
  float ridge = (1.0 - smoothstep(0.0, 0.0035, abs(q.x - uFace.x))) * step(uVisor.x + 0.025, q.y) * face;
  col += orange * ridge * 1.2;

  // visor (curved with the face)
  float dx = (q.x - uFace.x) / uVisor.y;
  float vy = uVisor.x - 0.018 * dx * dx;
  float visor = (1.0 - smoothstep(0.85, 1.0, abs(dx))) * (1.0 - smoothstep(uVisor.z * 0.6, uVisor.z, abs(q.y - vy)));
  float core = (1.0 - smoothstep(0.7, 0.95, abs(dx))) * (1.0 - smoothstep(0.0, uVisor.z * 0.35, abs(q.y - vy)));
  float halo = exp(-pow((q.y - vy) / (uVisor.z * 3.0), 2.0)) * (1.0 - smoothstep(0.9, 1.5, abs(dx)));
  col = mix(col, orange * 1.1, visor);
  col += vec3(1.0, 0.82, 0.68) * core + orange * halo * 0.5;

  // chest emblem
  float cd = length((q - uChest) * vec2(1.0, 1.5));
  float ring = 1.0 - smoothstep(0.0, 0.005, abs(cd - 0.05));
  col += vec3(0.19, 0.66, 1.0) * (ring * 1.5 + exp(-cd * 26.0) * 0.45) * subject;

  return col * max(subject, rim);
}

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
  float revealPre = smoothstep(-0.002, 0.002, d);
  if (uProc > 0.5) suit = (revealPre > 0.0 && inside(qa) > 0.0) ? proceduralSuit(qa, t) : vec3(0.0);

  float reveal = smoothstep(-0.002, 0.002, d);
  float ma = inside(qa) * edgeMask(qa);
  float mb = uProc > 0.5 ? ma : inside(qb) * edgeMask(qb);
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
