import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../server/worker.mjs';

test('Worker keeps public assets available during a rig outage and rejects unknown API paths',async()=>{
  const env={ASSETS:{fetch:async()=>new Response('welcome')},SERVICE_TOKEN:'test-secret',AGROCEBADA_SERVICE:{get:async()=>null}};
  assert.equal(await (await worker.fetch(new Request('https://demo.test/'),env,{})).text(),'welcome');
  const api=await worker.fetch(new Request('https://demo.test/api/imagery/health'),env,{});assert.equal(api.status,503);assert.match((await api.json()).error,/seguir usando el atlas/);
  assert.equal((await worker.fetch(new Request('https://demo.test/api/auth/login'),env,{})).status,404);
  assert.equal((await worker.fetch(new Request('https://demo.test/__service/register',{method:'POST',body:'{}'}),env,{})).status,403);
});

test('Worker validates origin registration, forwards server credentials and recovers without replacing public assets',async()=>{
  let origin:string|null=null;const env={ASSETS:{fetch:async()=>new Response('welcome')},SERVICE_TOKEN:'test-secret',AGROCEBADA_SERVICE:{get:async()=>origin,put:async(_k:string,v:string)=>{origin=v;}}};
  const headers={'X-AgroCebada-Service-Token':'test-secret','Content-Type':'application/json'};
  assert.equal((await worker.fetch(new Request('https://demo.test/__service/register',{method:'POST',headers,body:JSON.stringify({origin:'http://127.0.0.1'})}),env,{})).status,422);
  assert.equal((await worker.fetch(new Request('https://demo.test/__service/register',{method:'POST',headers,body:JSON.stringify({origin:'https://live-test.trycloudflare.com'})}),env,{})).status,200);
  const original=globalThis.fetch;globalThis.fetch=async(input,options)=>{assert.ok(String(input).startsWith('https://live-test.trycloudflare.com/'));assert.equal(new Headers(options?.headers).get('X-AgroCebada-Service-Token'),'test-secret');return Response.json({status:'ok'});};
  try{const api=await worker.fetch(new Request('https://demo.test/api/imagery/health'),env,{});assert.equal(api.status,200);assert.equal((await api.json()).status,'ok');assert.equal(await (await worker.fetch(new Request('https://demo.test/artwork/login-desktop.gif'),env,{})).text(),'welcome');}finally{globalThis.fetch=original;}
});
