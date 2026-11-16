/**
 * Every media / model path used by the site lives here.
 * Files are in /public — swap a file or point a path somewhere else.
 * Licences and sources for each file: see ASSET_CREDITS.md.
 */
const img = (id: string, alt: string) => ({
  src: `/media/img/${id}-1600.webp`,
  srcSet: `/media/img/${id}-800.webp 800w, /media/img/${id}-1600.webp 1600w`,
  alt,
});
const vid = (name: string) => ({ src: `/media/video/${name}.mp4`, poster: `/media/video/${name}-poster.webp` });

export type Img = ReturnType<typeof img>;
export type Vid = ReturnType<typeof vid>;

export const media = {
  video: {
    hero: vid('hero'),
    strength: vid('strength'),
    performance: vid('performance'),
    conditioning: vid('conditioning'),
    bench: vid('bench'),
    floor: vid('floor'),
  },
  img: {
    philosophyA: img('896058', 'Monochrome photograph of an athlete curling a loaded barbell'),
    philosophyB: img('1552252', 'A loaded barbell resting on a platform in a dim training hall'),
    mistBarbell: img('6389516', 'A barbell on the floor of a misty, backlit gym'),
    strength: img('1431282', 'Black and white photograph of an athlete holding a barbell'),
    conditioning: img('4164513', 'Athlete driving battle ropes in a dark gym'),
    recovery: img('4804294', 'Athlete lying on a foam roller on a rubber gym floor'),
    plateClose: img('2261481', 'Close-up of a bumper plate and collar on a barbell'),
    platesMono: img('949131', 'Monochrome close-up of weight plates and a barbell'),
    ropesDuo: img('1552242', 'Two athletes training with heavy ropes in an industrial gym'),
    ropesFront: img('14121526', 'Athlete facing the camera mid battle-rope set'),
    dumbbellRack: img('4164763', 'Rows of chrome dumbbells on a vertical rack'),
    rigInterior: img('9545907', 'Empty training space with a steel rig, rings and air bikes'),
    barbellFloor: img('27810163', 'Barbell with bumper plates on black rubber flooring'),
    ropesLow: img('12890811', 'Athlete in a low stance working battle ropes'),
  },
  hdr: '/hdr/empty_warehouse_01_1k.hdr',
  models: {
    hero: '/models/barbell-loaded.glb',
    floor: '/models/gym-floor.glb',
  },
};
