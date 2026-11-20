import { site } from '../../data/site'
import { asset } from '../../lib/asset'
import { drawCivilian, drawSuited } from './placeholders'
import type { PortraitImages } from './SuitUpScene'

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = asset(src)
  })
}

/**
 * civilian + suited photos → crossfade between two real images.
 * civilian only → the shader builds the suit from that photo (procedural mode).
 * neither → drawn placeholder figures.
 */
export async function loadPortraits(): Promise<PortraitImages> {
  const { civilian, suited } = site.portraits
  const civil = civilian ? await loadImage(civilian).catch(() => null) : null
  if (!civil) return { civil: drawCivilian(), suit: drawSuited(), proc: false }
  if (!suited) return { civil, suit: civil, proc: true }
  const suit = await loadImage(suited).catch(() => null)
  return suit ? { civil, suit, proc: false } : { civil, suit: civil, proc: true }
}
