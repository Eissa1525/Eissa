# EISSA — Alter Ego Portfolio

موقع بورتفوليو سينمائي (React + GSAP + Three.js) — مستوحى من فكرة "الشخصية البديلة"، مبني من الصفر بتصميم وكود أصلي.

## التشغيل
```bash
cd site
npm install
npm run dev      # تطوير
npm run build    # نسخة إنتاج في site/dist
```

## تعديل المحتوى
كل النصوص والمشاريع والروابط في ملف واحد: `site/src/content.ts`.
أغلفة المشاريع حالياً مولّدة برمجياً (`site/src/lib/covers.ts`) — تُستبدل بصورك الحقيقية في المرحلة 2.

## المكتبات
| المكتبة | الاستخدام |
|---|---|
| GSAP 3.15 (ScrollTrigger, SplitText, ScrambleText, CustomEase) | كل حركات التمرير والنصوص |
| Lenis | تمرير ناعم متزامن مع ScrollTrigger |
| Three.js + React Three Fiber + drei | المشهدين ثلاثيي الأبعاد |
| postprocessing | Bloom, Chromatic Aberration, Noise, Vignette |
| Motion | جاهزة للمرحلة 2 (انتقالات الصفحات) |

## الأقسام (المرحلة 1 ✅)
1. Preloader — عدّاد + ستارة
2. Hero — كرة WebGL بشيدر مخصص تتحول بالتمرير من "الذات" (لؤلؤية ناعمة) إلى "الشخصية البديلة" (أشواك حمراء + wireframe + scanlines)، والاسم يتشفّر إلى ALTER/EGO
3. Manifesto — كشف الكلمات بالتمرير (نمط ScrollReveal)
4. Projects Tunnel — نفق 3D تطير فيه الكاميرا بين المشاريع، البطاقات تنحني وتنفصل ألوانها حسب سرعة التمرير
5. Velocity Marquee — شريط يتسارع ويميل مع سرعة التمرير
6. Capabilities — تمرير أفقي مثبّت مع بارالاكس داخلي
7. Work Index — قائمة مع صورة تتبع المؤشر
8. Recognition — أرقام + جوائز
9. Footer — نموذج تواصل + اسم ضخم بتأثير Glitch
+ مؤشر مخصص، أزرار مغناطيسية، حبيبات فيلم، دعم reduced‑motion، وتصميم متجاوب للجوال

## الخارطة
- **المرحلة 2:** صفحات دراسة حالة لكل مشروع + انتقالات صفحات (Motion/Flip) + صورك الحقيقية
- **المرحلة 3:** صوت تفاعلي، وضع ليلي/نهاري حقيقي مرتبط بالشخصيتين، تحسين الأداء (KTX2، lazy scenes)
- **المرحلة 4:** نشر (Vercel/Netlify) + SEO + Open Graph
