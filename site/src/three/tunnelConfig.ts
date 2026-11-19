import { projects } from '../content'

// أبعاد النفق مشتركة بين مشهد WebGL وواجهة DOM (ملف خفيف حتى لا يُحمّل three مبكراً)
export const GAP = 5.5
export const START_Z = 6
export const DEPTH = (projects.length - 1) * GAP + 6
