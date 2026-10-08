import { navigateSidebar } from './navigation';
import {test,expect} from '@playwright/test';
test('Demo accounts, assignments and analyses reset on reload without app cookies or browser storage',async({page,context})=>{
  test.skip(process.env.AGROCEBADA_DEMO!=='1','Public demo only');const requests:string[]=[];page.on('request',r=>{const path=new URL(r.url()).pathname;if(path.startsWith('/api/') && !/^\/api\/(imagery|segmentation)\//.test(path)) requests.push(path);});
  const login=async()=>{await page.getByRole('button',{name:'Usar cuenta de prueba'}).click();await page.getByRole('button',{name:'Entrar a AgroCebada'}).click();await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count','197');};await page.goto('/');await login();
  const search=page.getByRole('textbox',{name:'Buscar municipio, ID o coordenadas'});await search.fill('AGC_001');await search.press('Enter');await page.getByRole('button',{name:'Analizar parcela',exact:true}).click();await page.getByRole('button',{name:'Analizar parcela',exact:true}).last().click();await expect(page.getByText('Guardado en tus análisis.',{exact:false})).toBeVisible();await page.getByRole('button',{name:'Volver al mapa'}).click();
  await navigateSidebar(page,'Mis parcelas');await expect(page.getByText('1 guardados',{exact:true})).toBeVisible();
  await page.goto('/');await page.reload();await login();await navigateSidebar(page,'Mis parcelas');await expect(page.getByText('0 guardados',{exact:true})).toBeVisible();expect(requests).toEqual([]);
  // Cloudflare may set its hosting clearance cookie independently of demo accounts.
  // Reject every other cookie, including the original server's agrocebada_session.
  const publicHost = new URL(page.url()).hostname === 'agrocebada.datascience-mexico.com';
  const appCookies = (await context.cookies()).filter(c => !(publicHost && c.name === 'cf_clearance' && c.domain === '.datascience-mexico.com' && c.httpOnly && c.secure));
  expect(appCookies.map(c => c.name)).toEqual([]);
  expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}))).toEqual({local:0,session:0});
});
