import { asset } from './assets';

/**
 * Showroom line-up. Every entry is a real downloaded GLB from the CC0
 * "Gym and Fitness Studio" pack (3dassets.dev). Dimensions come from the pack manifest.
 * `name` / `blurb` are IRON//VOID demo copy — edit freely.
 */
export type Equipment = {
  id: string;
  name: string;
  kind: string;
  model: string;
  /** width × height × depth in metres (from the asset manifest) */
  size: [number, number, number];
  triangles: number;
  blurb: string;
  zone: 'Free weights' | 'Rigs & racks' | 'Machines' | 'Engine room';
};

const list: Equipment[] = [
  { id: 'rack', name: 'CAGE / R4', kind: 'Four-post power rack', model: '/models/power-rack.glb', size: [2.04, 2.32, 1.5], triangles: 4760, zone: 'Rigs & racks',
    blurb: 'A 2.3 m four-post rack with numbered hole patterns, a knurled pull-up bar, J-hooks and full-length safety arms, shown with a bar racked at working height.' },
  { id: 'barbell', name: 'VOID BAR 01', kind: 'Olympic barbell, loaded', model: '/models/barbell-loaded.glb', size: [2.98, 0.45, 0.45], triangles: 2976, zone: 'Free weights',
    blurb: 'A 2.2 m Olympic bar carrying two 20 kg bumpers and a 10 kg change plate a side behind spring collars. The object everything else in the building is organised around.' },
  { id: 'dumbbells', name: 'HEX WALL', kind: 'Three-tier dumbbell rack', model: '/models/dumbbell-rack.glb', size: [1.96, 1.15, 1.15], triangles: 5728, zone: 'Free weights',
    blurb: 'A 1.9 m A-frame rack with twelve rubber hex dumbbells on saddled trays, rubber cradle strips and weight labels along the front rail.' },
  { id: 'legpress', name: 'SLED 45', kind: '45° plate-loaded leg press', model: '/models/leg-press.glb', size: [1.26, 1.14, 2.0], triangles: 3944, zone: 'Machines',
    blurb: 'A raked twin-rail carriage with a ribbed footplate, reclined back pad, shoulder rests and two loading horns carrying 20 kg bumpers.' },
  { id: 'crossover', name: 'SPAN / X', kind: 'Cable crossover frame', model: '/models/cable-crossover.glb', size: [3.65, 2.42, 1.1], triangles: 3192, zone: 'Machines',
    blurb: 'Two floor-mounted towers under a 3.4 m spanning beam: four carriage pulleys on their tracks, parked handles and a chin-up bar slung beneath.' },
  { id: 'pulldown', name: 'PULL / S12', kind: 'Lat pulldown station', model: '/models/lat-pulldown.glb', size: [1.14, 2.25, 1.55], triangles: 3256, zone: 'Machines',
    blurb: 'A 2.2 m station with a twelve-plate selectorised stack on guide rods, a cantilevered top pulley, angled lat bar and adjustable thigh pads.' },
  { id: 'rower', name: 'AIR / ROW', kind: 'Air rowing machine', model: '/models/rower.glb', size: [0.5, 0.66, 2.33], triangles: 2448, zone: 'Engine room',
    blurb: 'A caged flywheel on a front tower, an aluminium monorail, a padded seat on rollers and pivoting footplates. 2.4 m end to end.' },
  { id: 'treadmill', name: 'DECK / T2', kind: 'Commercial treadmill', model: '/models/treadmill.glb', size: [0.91, 1.42, 2.07], triangles: 1296, zone: 'Engine room',
    blurb: 'A cushioned running deck between side rails, a motor cowl, tubular uprights with gripped handrails and a tilting console head.' },
  { id: 'bike', name: 'FLY / 01', kind: 'Studio spin bike', model: '/models/spin-bike.glb', size: [0.54, 1.26, 1.18], triangles: 2036, zone: 'Engine room',
    blurb: 'An exposed weighted flywheel in a heavy tubular frame, with saddle and bar on quick-release posts, a resistance lever and compact console.' },
  { id: 'kettlebell', name: 'CAST 24', kind: 'Cast kettlebell', model: '/models/kettlebell.glb', size: [0.2, 0.25, 0.2], triangles: 376, zone: 'Free weights',
    blurb: 'A 24 kg cast bell, 235 mm tall, with a squared handle loop and a flat base ring so it stands square on rubber flooring.' },
  { id: 'bag', name: 'HEAVY / B', kind: 'Free-standing heavy bag', model: '/models/punching-bag.glb', size: [0.97, 2.1, 0.96], triangles: 2140, zone: 'Engine room',
    blurb: 'A weighted drum base, tubular upright and cranked top arm carrying a 1.05 m bag on a four-strap swivel.' },
  { id: 'bench', name: 'INCLINE / A', kind: 'Adjustable bench, inclined', model: '/models/bench-incline.glb', size: [0.46, 0.75, 1.04], triangles: 1840, zone: 'Free weights',
    blurb: 'An adjustable bench with its back section set to a 45° incline on the ladder bracket.' },
];

export const equipment: Equipment[] = list.map((e) => ({ ...e, model: asset(e.model) }));
