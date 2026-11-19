import { site } from '../../data/site'
import { drawCivilian, drawSuited } from './placeholders'
import type { PortraitImages } from './SuitUpScene'

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Real photos when configured, otherwise the procedural placeholder figures. */
export async function loadPortraits(): Promise<PortraitImages> {
  const { civilian, suited } = site.portraits
  const [civil, suit] = await Promise.all([
    civilian ? loadImage(civilian).catch(() => drawCivilian()) : Promise.resolve(drawCivilian()),
    suited ? loadImage(suited).catch(() => drawSuited()) : Promise.resolve(drawSuited()),
  ])
  return { civil, suit }
}
