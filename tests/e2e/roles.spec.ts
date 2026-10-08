import { navigateSidebar, openAccount } from './navigation';
import {test,expect} from '@playwright/test';

test('Administrator assignments appear in the technician workflow and presentation changes retain permissions',async({page})=>{
  test.skip(process.env.AGROCEBADA_DEMO!=='1','Simulated role workflows');await page.goto('/');await page.getByRole('button',{name:'Usar cuenta de prueba'}).click();await page.getByRole('button',{name:'Entrar a AgroCebada'}).click();await expect(page.getByTestId('map')).toBeVisible();
  await navigateSidebar(page,'Administración');await page.getByRole('textbox',{name:'Buscar parcela para asignar'}).fill('AGC_002');
  await page.getByRole('combobox',{name:'Productor de AGC_002'}).click();await page.getByRole('option',{name:'productor1',exact:true}).click();await expect(page.getByRole('combobox',{name:'Productor de AGC_002'})).toHaveText('productor1');
  await page.getByRole('combobox',{name:'Técnico de AGC_002'}).click();await page.getByRole('option',{name:'tecnico',exact:true}).click();await expect(page.getByRole('combobox',{name:'Técnico de AGC_002'})).toHaveText('tecnico');
  await openAccount(page,'testuser');await page.getByRole('button',{name:'Demo: tecnico · Técnico',exact:true}).click();await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count','100');
  await page.getByRole('button',{name:'Análisis Pro',exact:true}).click();await page.getByRole('button',{name:'Cerrar controles avanzados',exact:true}).click();await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count','100');await expect(page.getByRole('navigation',{name:'Navegación principal'}).getByRole('link',{name:'Administración',exact:true})).toHaveCount(0);await expect(page.locator('.atlas-header')).toHaveCount(0);
  await page.getByRole('textbox',{name:'Buscar municipio, ID o coordenadas'}).fill('AGC_002');await page.getByRole('button',{name:'Buscar',exact:true}).click();await expect(page.getByRole('heading',{name:'AGC_002',exact:true})).toBeVisible();await page.getByRole('button',{name:'Corregir límites',exact:true}).click();await page.getByRole('button',{name:'Guardar límites',exact:true}).click();await expect(page.getByText('Límites ajustados',{exact:false})).toBeVisible();
  await openAccount(page,'tecnico');await page.getByRole('button',{name:'Demo: productor2 · Productor',exact:true}).click();await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count','97');await page.getByRole('button',{name:'Productor',exact:true}).click();await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count','97');
});
