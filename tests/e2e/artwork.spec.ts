import { test, expect } from '@playwright/test';

test('Login selects actual GIFs or static reduced-motion posters with reserved desktop and mobile layouts',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/');
  const artwork=page.locator('.login-artwork img');await expect(artwork).toBeVisible();
  await expect.poll(()=>artwork.evaluate((image:HTMLImageElement)=>image.currentSrc)).toContain('login-desktop.gif');
  const story=await page.locator('.login-story').boundingBox();expect(story?.width).toBeCloseTo(1440*.48,0);
  expect(await page.locator('video').count()).toBe(0);
  const response=await page.request.get('/artwork/login-desktop.gif');expect(response.headers()['content-type']).toContain('image/gif');expect((await response.body()).subarray(0,6).toString()).toMatch(/^GIF8[79]a$/);
  await page.emulateMedia({reducedMotion:'reduce'});await expect.poll(()=>artwork.evaluate((image:HTMLImageElement)=>image.currentSrc)).toContain('login-desktop-poster.webp');
  await page.setViewportSize({width:390,height:844});await expect.poll(()=>artwork.evaluate((image:HTMLImageElement)=>image.currentSrc)).toContain('login-mobile-poster.webp');
  const mobileStory=await page.locator('.login-story').boundingBox();const form=await page.locator('.login-main').boundingBox();expect(mobileStory?.height).toBe(200);expect(form!.y).toBeGreaterThanOrEqual(200);
  await page.emulateMedia({reducedMotion:'no-preference'});await expect.poll(()=>artwork.evaluate((image:HTMLImageElement)=>image.currentSrc)).toContain('login-mobile.gif');
});

test('A loading login GIF does not block signing in',async({page})=>{
  await page.route('**/artwork/*.gif',()=>new Promise(()=>{}));await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:'Usar cuenta de prueba'}).click();await page.getByRole('button',{name:'Entrar a AgroCebada'}).click();await expect(page.getByTestId('map')).toBeVisible();
  await page.unrouteAll({behavior:'ignoreErrors'});
});
