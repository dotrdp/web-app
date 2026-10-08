import { chromium } from '@playwright/test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const command=promisify(execFile),unit='agrocebada-imagery.service',origin=process.env.PLAYWRIGHT_BASE_URL||'http://127.0.0.1:8082';
const browser=await chromium.launch({headless:true});const page=await browser.newPage();const report={origin};
async function healthy(){for(let attempt=0;attempt<25;attempt++){const result=await fetch('https://agrocebada-staging.rckydp1.workers.dev/api/imagery/health').catch(()=>null);if(result?.ok)return;await new Promise(resolve=>setTimeout(resolve,1000));}throw new Error('Service did not recover');}
try{
  await page.goto(origin);await page.getByRole('button',{name:'Usar cuenta de prueba'}).click();await page.getByRole('button',{name:'Entrar a AgroCebada'}).click();await page.getByTestId('map').waitFor();
  await command('systemctl',['--user','stop',unit]);const offline=await fetch('https://agrocebada-staging.rckydp1.workers.dev/api/imagery/health');assert.equal(offline.status,503);report.outageStatus=offline.status;
  await page.getByRole('tab',{name:'Vegetación',exact:true}).click();await page.getByRole('button',{name:'Reintentar servicio',exact:true}).waitFor();assert.equal(await page.getByTestId('map').getAttribute('data-parcel-count'),'197');
  await page.getByRole('tab',{name:'Clima',exact:true}).click();assert.equal(await page.getByTestId('map').getAttribute('data-mode'),'climate');
  await command('systemctl',['--user','start',unit]);await healthy();await page.getByRole('tab',{name:'Vegetación',exact:true}).click();await page.getByRole('button',{name:'Reintentar servicio',exact:true}).waitFor({state:'hidden'});report.atlasPreserved=true;
  const before=(await command('systemctl',['--user','show',unit,'-p','MainPID','--value'])).stdout.trim();const started=Date.now();await command('systemctl',['--user','kill','--kill-whom=main','--signal=KILL',unit]);await healthy();const after=(await command('systemctl',['--user','show',unit,'-p','MainPID','--value'])).stdout.trim();assert.notEqual(before,after);report.automaticRestartSeconds=(Date.now()-started)/1000;
  await mkdir('.data-cache/verification',{recursive:true});await writeFile('.data-cache/verification/recovery.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await command('systemctl',['--user','start',unit]);await browser.close();}
