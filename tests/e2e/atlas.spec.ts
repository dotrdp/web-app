import { navigateSidebar, openAccount } from './navigation';
import { test, expect, type Page } from '@playwright/test';
async function login(page:Page) {
  await page.goto('/');await page.getByRole('button',{name:'Usar cuenta de prueba'}).click();await page.getByRole('button',{name:'Entrar a AgroCebada'}).click();await expect(page.getByTestId('map')).toBeVisible();
}
async function advanced(page:Page) { if (await page.getByRole('button',{name:'Controles avanzados',exact:true}).count()) await page.getByRole('button',{name:'Controles avanzados',exact:true}).click();else await page.getByRole('button',{name:'Análisis Pro',exact:true}).click(); }
const nav = navigateSidebar;

test('Full tab, no selection, real Landsat thresholds, coordinate search and climate month selection',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width:1440,height:900});await login(page);
  await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count','197');await expect(page.getByTestId('map')).toHaveAttribute('data-period','2025-07');await expect(page.getByRole('complementary',{name:'Ficha de parcela'})).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight)).toBe(true);
  const search=page.getByRole('textbox',{name:'Buscar municipio, ID o coordenadas'});await search.fill('Chignahuapan');await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count','100');await search.fill('AGC_002');await search.press('Enter');await expect(page.getByRole('heading',{name:'AGC_002',exact:true})).toBeVisible();
  await search.fill('19.54, -98.56');await search.press('Enter');await expect(page.getByText('Ubicación encontrada.',{exact:false})).toBeVisible();await page.getByRole('button',{name:'Limpiar búsqueda'}).click();
  await advanced(page);await page.getByRole('button',{name:'NDVI · Landsat C2',exact:true}).click();await expect.poll(async()=>Number(await page.getByTestId('map').getAttribute('data-valid-pixels'))).toBeGreaterThan(0);
  const before=Number(await page.getByTestId('map').getAttribute('data-displayed-pixels'));await advanced(page);await page.getByRole('spinbutton',{name:'Valor del umbral NDVI'}).fill('0.8');await page.getByRole('checkbox',{name:'Filtrar también parcelas',exact:true}).check();await page.getByRole('button',{name:'Cerrar controles avanzados'}).click();
  await expect.poll(async()=>Number(await page.getByTestId('map').getAttribute('data-displayed-pixels'))).toBeLessThan(before);await expect.poll(async()=>Number(await page.getByTestId('map').getAttribute('data-parcel-count'))).toBeLessThan(197);
  await page.getByRole('button',{name:'Agosto 2025'}).click();await expect(page.getByTestId('map')).toHaveAttribute('data-period','2025-08');await advanced(page);await page.getByRole('checkbox',{name:'Filtrar también parcelas',exact:true}).uncheck();await page.getByRole('button',{name:'Cerrar controles avanzados'}).click();
  await page.getByRole('button',{name:'Clima',exact:true}).click();await page.getByRole('button',{name:'Septiembre 2025'}).click();await expect(page.getByTestId('map')).toHaveAttribute('data-period','2025-09');await page.screenshot({path:'test-results/climate-desktop.png'});expect(errors).toEqual([]);
});

test('AlphaEarth annual imagery and original technical charts, exports and labeled example analysis',async({page})=>{
  await login(page);const search=page.getByRole('textbox',{name:'Buscar municipio, ID o coordenadas'});await search.fill('AGC_001');await search.press('Enter');await advanced(page);await page.getByRole('button',{name:'AlphaEarth',exact:true}).click();
  await expect.poll(async()=>Number(await page.getByTestId('map').getAttribute('data-embedding-count'))).toBeGreaterThan(0);await expect(page.getByRole('button',{name:'Julio 2025'})).toBeDisabled();await page.screenshot({path:'test-results/alphaearth-desktop.png'});
  await page.getByRole('button',{name:'Ver evolución',exact:true}).click();await expect(page.getByRole('heading',{name:'Evolución de la vegetación'})).toBeVisible();await expect(page.getByRole('heading',{name:'AlphaEarth Foundations'})).toBeVisible();await expect(page.getByRole('img',{name:'Las 64 dimensiones del embedding'})).toBeVisible();await expect(page.getByText('Valor fijo de ejemplo, sin inferencia.')).toBeVisible();
  await nav(page,'Mis parcelas');await page.getByRole('textbox',{name:'Buscar en mis parcelas'}).fill('AGC_001');await page.getByRole('button',{name:'Analizar',exact:true}).click();await expect(page.getByText('El rendimiento de',{exact:false})).toBeVisible();await page.getByRole('button',{name:'Analizar parcela',exact:true}).click();await expect(page.getByText('EJEMPLO · SIN INFERENCIA')).toBeVisible();await expect(page.getByText('Guardado en tus análisis.',{exact:false})).toBeVisible();await page.getByRole('button',{name:'Volver al mapa',exact:true}).click();
});

test('Automatic delineation entry, manual fallback, saving and vertex editing preserve page-memory behavior',async({page})=>{
  await login(page);await page.getByRole('button',{name:'Analizar mi terreno',exact:true}).click();await page.getByRole('button',{name:'Dibujar manualmente'}).click();await expect(page.getByRole('heading',{name:'Dibuja tu parcela'})).toBeVisible();await expect(page.getByRole('button',{name:'Reproducir meses'})).toBeDisabled();
  const canvas=page.getByRole('application',{name:'Mapa interactivo',exact:false});const bounds=await canvas.boundingBox();if(!bounds)throw new Error('Map missing');const point=(x:number,y:number)=>({x:bounds.width*x,y:bounds.height*y});
  await canvas.click({position:point(.4,.42)});await canvas.click({position:point(.57,.42)});await canvas.click({position:point(.57,.62)});await canvas.dblclick({position:point(.4,.62)});
  await expect(page.getByRole('button',{name:'Guardar parcela',exact:true})).toBeEnabled();await page.getByRole('textbox',{name:'Nombre de la parcela'}).fill('Parcela e2e');await page.getByRole('button',{name:'Guardar parcela',exact:true}).click();await expect(page.getByRole('heading',{name:'Parcela e2e'})).toBeVisible();
  await page.getByRole('button',{name:'Corregir límites'}).click();await expect(page.getByRole('button',{name:'Guardar límites',exact:true})).toBeEnabled();await page.getByRole('button',{name:'Guardar límites',exact:true}).click();await expect(page.getByText('Límites ajustados',{exact:false})).toBeVisible();await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count','198');await page.reload();
  if(process.env.AGROCEBADA_DEMO==='1'){await expect(page.getByRole('button',{name:'Entrar a AgroCebada'})).toBeVisible();await login(page);await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count','197');}else await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count','198');
  await nav(page,'Administración');await expect(page.getByRole('heading',{name:'Usuarios del espacio'})).toBeVisible();await openAccount(page,'testuser');await page.getByRole('button',{name:'Cerrar sesión',exact:true}).click();await expect(page.getByRole('button',{name:'Entrar a AgroCebada'})).toBeVisible();
});

test('Mobile full map, scrollable pills, dates, bottom sheet and navigation without overflow',async({page})=>{
  await page.setViewportSize({width:390,height:844});await login(page);await page.getByRole('button',{name:'Clima',exact:true}).click();await page.getByRole('button',{name:'Octubre 2025'}).click();await expect(page.getByTestId('map')).toHaveAttribute('data-period','2025-10');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth && document.documentElement.scrollHeight<=innerHeight)).toBe(true);
  const search=page.getByRole('textbox',{name:'Buscar municipio, ID o coordenadas'});await search.fill('AGC_001');await search.press('Enter');await expect(page.getByRole('button',{name:'Ver evolución'})).toBeVisible();await expect(page.getByRole('button',{name:'Analizar parcela',exact:true})).toBeVisible();await page.screenshot({path:'test-results/map-mobile.png'});await nav(page,'Datos y fuentes');await expect(page.getByRole('heading',{name:'Cada dato tiene una historia.'})).toBeVisible();
});
