import type { Program } from './programs';

/** DEMONSTRATION SCHEDULE — invented sessions and coach initials, for layout only. */
export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export type Day = (typeof days)[number];

export type Session = { day: Day; time: string; title: string; category: Program['id']; coach: string; duration: number; spots: number };

const s = (day: Day, time: string, title: string, category: Program['id'], coach: string, duration: number, spots: number): Session => ({ day, time, title, category, coach, duration, spots });

export const sessions: Session[] = [
  s('Mon', '06:00', 'Barbell Foundations', 'strength', 'Coach A.', 75, 8),
  s('Mon', '12:15', 'Engine 45', 'conditioning', 'Coach R.', 45, 14),
  s('Mon', '18:30', 'Heavy Lower', 'strength', 'Coach A.', 75, 8),
  s('Mon', '20:00', 'Reset — Mobility', 'recovery', 'Coach M.', 40, 12),
  s('Tue', '06:30', 'Speed & Power', 'performance', 'Coach K.', 60, 6),
  s('Tue', '17:30', 'Sled & Carry', 'conditioning', 'Coach R.', 45, 14),
  s('Tue', '19:00', 'Heavy Upper', 'strength', 'Coach J.', 75, 8),
  s('Wed', '06:00', 'Olympic Lifting Skills', 'performance', 'Coach K.', 60, 6),
  s('Wed', '12:15', 'Reset — Soft Tissue', 'recovery', 'Coach M.', 40, 12),
  s('Wed', '18:30', 'Intervals — Row / Bike', 'conditioning', 'Coach R.', 45, 14),
  s('Thu', '06:30', 'Barbell Foundations', 'strength', 'Coach J.', 75, 8),
  s('Thu', '18:00', 'Jump & Sprint Mechanics', 'performance', 'Coach K.', 60, 6),
  s('Thu', '19:30', 'Reset — Breath & Mobility', 'recovery', 'Coach M.', 40, 12),
  s('Fri', '06:00', 'Heavy Total', 'strength', 'Coach A.', 75, 8),
  s('Fri', '12:15', 'Engine 45', 'conditioning', 'Coach R.', 45, 14),
  s('Fri', '17:30', 'Power Complexes', 'performance', 'Coach K.', 60, 6),
  s('Sat', '08:00', 'Open Platform', 'strength', 'Coach J.', 90, 10),
  s('Sat', '10:00', 'Long Aerobic', 'conditioning', 'Coach R.', 60, 14),
  s('Sat', '11:30', 'Reset — Full Flow', 'recovery', 'Coach M.', 50, 12),
  s('Sun', '09:00', 'Technique Clinic', 'performance', 'Coach K.', 75, 6),
  s('Sun', '10:30', 'Reset — Mobility', 'recovery', 'Coach M.', 40, 12),
];
