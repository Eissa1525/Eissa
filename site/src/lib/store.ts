// حالة مشتركة بين DOM و WebGL بدون إعادة رسم React (قيم قابلة للتعديل تُقرأ في كل إطار).
export const scroll = {
  hero: 0, // 0..1 تقدم قسم البطل
  tunnel: 0, // 0..1 تقدم النفق
  velocity: 0, // سرعة التمرير من Lenis
}

type Listener = () => void
const readyListeners = new Set<Listener>()
let ready = false
export const appReady = {
  get value() {
    return ready
  },
  set() {
    ready = true
    readyListeners.forEach((l) => l())
  },
  on(l: Listener) {
    if (ready) l()
    else readyListeners.add(l)
    return () => readyListeners.delete(l)
  },
}
