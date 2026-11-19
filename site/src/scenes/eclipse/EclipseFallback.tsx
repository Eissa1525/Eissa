/** Static eclipse — used for reduced motion, no WebGL, or a scene error. Pure CSS, no assets. */
export default function EclipseFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden bg-obsidian" aria-hidden>
      <div className="absolute size-[150vmin] rounded-full bg-[radial-gradient(circle,rgb(124_92_255/0.22),transparent_60%)]" />
      <div className="relative size-[min(56vmin,420px)] rounded-full shadow-[0_0_0_1.5px_rgb(228_226_236/0.85),0_0_60px_8px_rgb(124_92_255/0.55),0_0_180px_40px_rgb(124_92_255/0.25)]">
        <div className="absolute inset-0 rounded-full bg-obsidian" />
        <div className="absolute -inset-[9%] rounded-full border border-platinum/15" />
        <div className="absolute -inset-[20%] rounded-full border border-platinum/[0.07]" />
      </div>
    </div>
  )
}
