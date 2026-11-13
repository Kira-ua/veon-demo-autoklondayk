// E2E checks of key scenarios (Playwright from ~/.veon/tools via the studio helper).
// Usage: node tests/e2e.mjs http://localhost:4321/   (dev or preview server)
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import os from 'node:os';
const studio = process.env.VEON_WEB_STUDIO || path.join(os.homedir(), 'Desktop', 'VEON WEB-STUDIO');
const { loadPlaywright, launchAttempts } = await import(pathToFileURL(path.join(studio, 'quality', 'scripts', 'veon_pw.mjs')).href);
const { chromium } = loadPlaywright();
const url = process.argv[2] || 'http://localhost:4321/';
let browser; for (const a of launchAttempts()) { try { browser = await chromium.launch(a); break; } catch { /* next */ } }
let fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) fails += 1; };

// 1440
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: 'networkidle' });
  ok(await p.locator('h1').count() === 1, 'one H1');
  ok((await p.locator('h1').innerText()).trim() === 'Автозапчастини для іномарок, підібрані за VIN-кодом вашого авто', 'H1 text from veon-concept');
  for (const id of ['header', 'pidbir', 'zamovlennia', 'katalog', 'marky', 'umovy', 'pryhon', 'kontakty', 'footer']) ok(await p.locator(`#${id}`).count() === 1, `block #${id}`);
  ok(await p.locator('a[href*="autoklondayk.com.ua"]').count() === 0, 'no links to the old site');
  ok(await p.locator('a[href="#"], a:not([href])').count() === 0, 'no empty links');
  ok(await p.locator('#way-vin').isVisible(), 'VIN way open by default');
  await p.click('#tab-kod');
  ok(await p.locator('#way-kod').isVisible() && !(await p.locator('#way-vin').isVisible()), 'tab «За кодом» switches panel');
  await p.keyboard.press('ArrowRight');
  ok(await p.locator('#way-avto').isVisible(), 'arrow key moves to «За авто»');
  await p.click('.vin__group--vds');
  ok((await p.locator('[data-vin-explain]').innerText()).includes('4–9'), 'VIN group explains itself');
  ok(await p.locator('.finder a[href="tel:+380676444441"]').count() >= 1, 'call link in the finder');
  await p.mouse.wheel(0, 1400); await p.waitForTimeout(400);
  ok(await p.locator('#header.is-solid').count() === 1, 'header turns solid after the first screen');
  await p.click('a.header__link[href="#kontakty"]'); await p.waitForTimeout(900);
  const top = await p.locator('#kontakty').evaluate((el) => el.getBoundingClientRect().top);
  ok(top >= 0 && top < 200, 'anchor «Контакти» scrolls to the block below the header');
  ok(await p.locator('#kontakty a[href^="https://www.google."][target="_blank"]').count() === 1, 'route opens Google Maps');
  const fl = p.locator('#marky .future-link').first();
  await fl.hover();
  ok(await fl.locator('.future-link__note').isVisible(), 'FutureLink shows its note on hover');
  await p.close();
}
// 390
{
  const p = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await p.goto(url, { waitUntil: 'networkidle' });
  const inFold = async (sel) => { const b = await p.locator(sel).first().boundingBox(); return b && b.y >= 0 && b.y + b.height <= 844 && b.x >= 0 && b.x + b.width <= 390; };
  ok(await inFold('.finder .btn--call'), '390: call button above the fold');
  ok(await inFold('.finder .btn--viber'), '390: Viber button above the fold');
  ok(await inFold('.header__call-m'), '390: header call inside the screen');
  ok(await p.evaluate(() => document.documentElement.scrollWidth) <= 390, '390: no horizontal scroll');
  await p.click('[data-menu-toggle]'); await p.waitForTimeout(300);
  ok(await p.locator('#menu .menu__link').first().isVisible(), '390: burger opens the menu');
  await p.click('#menu a[href="#umovy"]'); await p.waitForTimeout(900);
  ok(!(await p.locator('#menu.is-open').count()), '390: menu closes after an anchor');
  ok(await p.locator('.mbar.is-shown').count() === 1, '390: bottom bar after the first screen');
  await p.close();
}
// 320 and no JS
{
  const p = await browser.newPage({ viewport: { width: 320, height: 640 } });
  await p.goto(url, { waitUntil: 'networkidle' });
  ok(await p.evaluate(() => document.documentElement.scrollWidth) <= 320, '320: no horizontal scroll');
  await p.close();
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const q = await ctx.newPage(); await q.goto(url);
  ok(await q.locator('#way-kod').isVisible() && await q.locator('.vin__cell').first().isVisible(), 'no JS: content visible');
  await ctx.close();
}
// reduced motion
{
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage(); await p.goto(url, { waitUntil: 'networkidle' });
  ok(await p.locator('.vin__cell').nth(16).evaluate((el) => getComputedStyle(el).opacity) === '1', 'reduced motion: VIN cells in place');
  await ctx.close();
}
await browser.close();
console.log(fails ? `${fails} FAIL` : 'ALL PASS');
process.exit(fails ? 1 : 0);
