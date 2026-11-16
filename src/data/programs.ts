import { media, type Img, type Vid } from './assets';

/**
 * The four training categories. All copy is original demo content describing
 * how sessions are structured — it makes no promises about results.
 */
export type Program = {
  id: 'strength' | 'performance' | 'conditioning' | 'recovery';
  index: string;
  name: string;
  line: string;
  body: string;
  focus: string[];
  format: { label: string; value: string }[];
  image: Img;
  video?: Vid;
  cta: { label: string; href: string };
};

export const programs: Program[] = [
  {
    id: 'strength', index: '01', name: 'STRENGTH',
    line: 'Heavy, slow, deliberate.',
    body: 'Barbell-first sessions built around the squat, hinge, press and pull. Loads are written against your own recent training rather than a wall chart, and every block ends with a planned lighter week.',
    focus: ['Barbell fundamentals', 'Accessory work by weak point', 'Tempo and pause variations'],
    format: [{ label: 'Session', value: '75 min' }, { label: 'Group size', value: 'Up to 8' }, { label: 'Level', value: 'All, coached' }],
    image: media.img.strength, video: media.video.strength,
    cta: { label: 'See strength sessions', href: '#schedule' },
  },
  {
    id: 'performance', index: '02', name: 'PERFORMANCE',
    line: 'Move weight fast.',
    body: 'Olympic lifting derivatives, jumps, throws and sprint mechanics for people who play a sport or simply want to feel athletic. Technique work comes first while you are fresh; intensity comes second.',
    focus: ['Cleans, snatches and their pulls', 'Jump and landing mechanics', 'Short acceleration work'],
    format: [{ label: 'Session', value: '60 min' }, { label: 'Group size', value: 'Up to 6' }, { label: 'Level', value: 'Intermediate +' }],
    image: media.img.philosophyB, video: media.video.performance,
    cta: { label: 'See performance sessions', href: '#schedule' },
  },
  {
    id: 'conditioning', index: '03', name: 'CONDITIONING',
    line: 'Build the engine.',
    body: 'Interval work on rowers, bikes, sleds and ropes, mixed with longer steady efforts. Sessions are scaled by effort level, so the same room works for a first-timer and a competitor.',
    focus: ['Machine intervals', 'Sleds, carries and ropes', 'Steady aerobic base work'],
    format: [{ label: 'Session', value: '45 min' }, { label: 'Group size', value: 'Up to 14' }, { label: 'Level', value: 'All' }],
    image: media.img.conditioning, video: media.video.conditioning,
    cta: { label: 'See conditioning sessions', href: '#schedule' },
  },
  {
    id: 'recovery', index: '04', name: 'RECOVERY',
    line: 'Earn the next session.',
    body: 'Guided mobility, soft-tissue work and breathing at an unhurried pace. Useful the day after something heavy, or as a way back into training after time away.',
    focus: ['Guided mobility flow', 'Foam roller and soft-tissue work', 'Down-regulation breathing'],
    format: [{ label: 'Session', value: '40 min' }, { label: 'Group size', value: 'Up to 12' }, { label: 'Level', value: 'All' }],
    image: media.img.recovery,
    cta: { label: 'See recovery sessions', href: '#schedule' },
  },
];
