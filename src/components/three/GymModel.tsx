import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
import { theme } from '../../config/theme';

const materialCache = new Map<string, THREE.MeshStandardMaterial>();
/** Re-finish the pack's flat materials (matched by material name) with the IRON//VOID metal palette. */
function finish(rawName: string, fallback: THREE.Material, remap?: Record<string, string>) {
  const name = remap?.[rawName] ?? rawName;
  const spec = theme.materials[name];
  if (!spec) return fallback;
  let m = materialCache.get(name);
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      name, color: spec.color, metalness: spec.metalness, roughness: spec.roughness,
      emissive: new THREE.Color(spec.emissive ?? '#000000'), emissiveIntensity: spec.emissiveIntensity ?? 0,
      envMapIntensity: 1.15,
    });
    materialCache.set(name, m);
  }
  return m;
}

type Props = {
  url: string;
  /** longest side of the model after normalisation, in world units */
  fit?: number;
  /** sit the model on y = 0 instead of centring it vertically */
  ground?: boolean;
  /** smooth curved surfaces (skip for very large scenes) */
  crease?: boolean;
  shadows?: boolean;
  /** swap a material for another theme material, e.g. { accent: 'accentMuted' } */
  remap?: Record<string, string>;
};

/**
 * Loads one of the downloaded GLB assets, normalises its size / origin and applies theme materials.
 * Geometry is used as shipped — only normals are recomputed so cylinders read as round under studio light.
 */
export function GymModel({ url, fit = 2.4, ground = false, crease = true, shadows = false, remap }: Props) {
  const { scene } = useGLTF(url, false, true);
  const object = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (crease) mesh.geometry = toCreasedNormals(mesh.geometry, THREE.MathUtils.degToRad(38));
      mesh.material = finish((mesh.material as THREE.Material).name, mesh.material as THREE.Material, remap);
      mesh.castShadow = shadows; mesh.receiveShadow = shadows;
    });
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    root.position.set(-center.x, ground ? -box.min.y : -center.y, -center.z);
    const wrap = new THREE.Group();
    wrap.add(root);
    wrap.scale.setScalar(fit / Math.max(size.x, size.y, size.z));
    return wrap;
  }, [scene, fit, ground, crease, shadows, remap]);
  return <primitive object={object} />;
}
