// End-to-end QA: hero states, responsive overflow (320–1024), mobile menu, reduced motion, keyboard order, internal links.
// Usage: npm run build && npm run preview & npm run test:e2e
const { chromium } = require('playwright');
const ARGS = ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'];
const BASE = process.env.BASE_URL || 'http://localhost:4173';
const out = process.argv[2] || 'tests/screenshots'; require('fs').mkdirSync(out, { recursive: true });
const ROUTES = ['/', '/work', '/work/meridian-os', '/studio', '/contact'];
(async () => {
  const b = await chromium.launch({ args: ARGS });
  const report = [];
  const ready = (p) => p.waitForFunction(() => document.querySelector('#main') && !document.querySelector('[aria-label="Loading AETHER"]'), null, { timeout: 25000 });

  // 1. desktop hero re-check
  {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type()==='error' && errs.push(m.text()));
    await p.goto(BASE + '/'); await ready(p); await p.waitForTimeout(2500);
    const range = await p.evaluate(() => document.querySelector('section').offsetHeight - innerHeight);
    for (const pr of [0, 0.62, 0.72]) { await p.evaluate(y => scrollTo(0, y), Math.round(pr*range)); await p.waitForTimeout(1800); await p.screenshot({ path: `${out}/d-hero-${pr}.png` }); }
    report.push('desktop errors: ' + (errs.join(' | ') || 'none'));
    await p.close();
  }
  // 2. widths: horizontal overflow per route + screenshots
  for (const w of [320, 390, 768, 1024]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w < 700 ? 760 : 1000 }, hasTouch: w < 1024, isMobile: w < 700 });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    for (const r of ROUTES) {
      await p.goto(BASE + r); await ready(p); await p.waitForTimeout(r === '/' ? 2500 : 1500);
      const ov = await p.evaluate(() => {
        const W = document.documentElement.clientWidth;
        const bad = [...document.querySelectorAll('body *')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.right > W + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('[aria-hidden="true"]') && !e.closest('.overflow-hidden'); }).slice(0, 4).map(e => e.tagName + '.' + String(e.className).slice(0, 40));
        return { sw: document.documentElement.scrollWidth, W, bad };
      });
      report.push(`${w}px ${r}: scrollWidth ${ov.sw}/${ov.W} ${ov.bad.length ? 'OVERFLOW ' + ov.bad.join(',') : 'ok'}`);
      if (w === 390 || w === 320) await p.screenshot({ path: `${out}/m${w}${r.replace(/\//g, '_')}.png` });
      if (r === '/' && w <= 768) {
        const range = await p.evaluate(() => document.querySelector('section').offsetHeight - innerHeight);
        for (const pr of [0.35, 0.62, 0.85]) { await p.evaluate(y => scrollTo(0, y), Math.round(pr*range)); await p.waitForTimeout(1600); await p.screenshot({ path: `${out}/m${w}-hero-${pr}.png` }); }
      }
    }
    // mobile menu
    if (w === 390) {
      await p.goto(BASE + '/work'); await ready(p); await p.waitForTimeout(800);
      await p.click('button[aria-controls="mobile-menu"]'); await p.waitForTimeout(1200);
      await p.screenshot({ path: `${out}/m390-menu.png` });
      const focused = await p.evaluate(() => document.activeElement?.textContent);
      await p.keyboard.press('Escape'); await p.waitForTimeout(900);
      const closed = await p.evaluate(() => document.querySelector('#mobile-menu').getAttribute('aria-hidden'));
      await p.click('button[aria-controls="mobile-menu"]'); await p.waitForTimeout(1000);
      await p.click('#mobile-menu >> text=Studio'); await p.waitForTimeout(2200);
      report.push(`menu: focus on open="${focused}", aria-hidden after Esc=${closed}, navigated to ${new URL(p.url()).pathname}`);
    }
    report.push(`${w}px errors: ${errs.join(' | ') || 'none'}`);
    await ctx.close();
  }
  // 3. reduced motion
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE + '/'); await p.waitForTimeout(2000);
    await p.screenshot({ path: `${out}/reduced-home.png` });
    const canvases = await p.evaluate(() => document.querySelectorAll('canvas').length);
    report.push(`reduced motion: canvases=${canvases}, preloader=${await p.evaluate(() => !!document.querySelector('[aria-label="Loading AETHER"]'))}, errors=${errs.join('|') || 'none'}`);
    // keyboard
    await p.keyboard.press('Tab'); const f1 = await p.evaluate(() => document.activeElement.textContent.trim());
    const seq = [f1];
    for (let i = 0; i < 5; i++) { await p.keyboard.press('Tab'); seq.push(await p.evaluate(() => document.activeElement.textContent.trim().slice(0, 30))); }
    report.push('tab order: ' + seq.join(' → '));
    // client-side navigation via keyboard
    await p.goto(BASE + '/'); await p.waitForTimeout(800);
    await p.click('header >> text=Work'); await p.waitForTimeout(1800);
    report.push('nav click → ' + new URL(p.url()).pathname + ' title=' + await p.title());
    await ctx.close();
  }
  // 4. link check: every internal href resolves to a non-404 page
  {
    const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
    const seen = new Set(); const bad = [];
    for (const r of ROUTES) {
      await p.goto(BASE + r); await ready(p).catch(() => {}); await p.waitForTimeout(600);
      const links = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
      links.forEach(h => seen.add(h));
    }
    for (const h of seen) {
      if (h.startsWith('/')) {
        await p.goto(BASE + h); await p.waitForTimeout(700);
        if (await p.evaluate(() => document.body.innerText.includes('404 — lost in orbit'))) bad.push(h);
      } else if (h === '#' || h === '') bad.push('dead:' + h);
    }
    report.push(`links checked: ${[...seen].join(', ')} | broken: ${bad.join(', ') || 'none'}`);
  }
  console.log(report.join('\n'));
  await b.close();
})();
