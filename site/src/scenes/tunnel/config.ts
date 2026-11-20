import { projects } from '../../data/projects'
export const GAP = 6
export const START_Z = 5
export const DEPTH = projects.length * GAP + 2
/** index of the next screen ahead of the camera (screen i passes the camera when the value reaches i + 1) */
export const activeIndex = (p: number) =>
  Math.min(projects.length - 1, Math.max(0, Math.floor((p * DEPTH - START_Z) / GAP + 0.08)))
