import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createDemoApi } from '../src/demo';
import type { Field, User, Workspace } from '../src/types';
const originalIds = JSON.parse(readFileSync(new URL('../public/data/parcels.geojson',import.meta.url),'utf8')).features.map((f: { properties: { id: string } })=>f.properties.id) as string[];
const create = () => createDemoApi(async()=>originalIds);
const geometry = { type: 'Polygon', coordinates: [[[-98.56,19.54],[-98.559,19.54],[-98.559,19.541],[-98.56,19.541],[-98.56,19.54]]] };
const post = (body:unknown): RequestInit => ({method:'POST',body:JSON.stringify(body)});
const login = (api: ReturnType<typeof create>,username='testuser') => api<{user:User}>('/api/auth/login',post({username,password:'Fira2026!'}));

test('One account, page memory only: drawn fields and corrections reset on logout and per page',async()=>{
  const api=create(); assert.equal((await api<{user:null}>('/api/auth/session')).user,null);
  await assert.rejects(api('/api/workspace'),/Inicia sesión/);
  await assert.rejects(api('/api/auth/login',post({username:'testuser',password:'wrong'})),/no coinciden/);
  const { user } = await login(api); assert.equal(user.username,'testuser'); assert.equal(user.role,undefined);
  const field=await api<Field>('/api/fields',post({geometry,name:'Temporal'})); assert.ok(field.area>1);
  await api(`/api/parcels/${field.id}/geometry`,{method:'PUT',body:JSON.stringify({geometry})});
  await api('/api/parcels/AGC_002/geometry',{method:'PUT',body:JSON.stringify({geometry})});
  const workspace=await api<Workspace>('/api/workspace');assert.equal(workspace.fields.length,1);assert.equal(Object.keys(workspace.overrides).length,2);
  workspace.fields.length=0;assert.equal((await api<Workspace>('/api/workspace')).fields.length,1);
  const newPage=create();await login(newPage);assert.deepEqual(await newPage<Workspace>('/api/workspace'),{fields:[],overrides:{}});
  await api('/api/notes',{method:'PUT',body:JSON.stringify({text:'Visitar Calpulalpan'})});assert.equal((await api<{text:string}>('/api/notes')).text,'Visitar Calpulalpan');
  await assert.rejects(api('/api/notes',{method:'PUT',body:JSON.stringify({text:5})}),/texto/);
  assert.equal((await newPage<{text:string}>('/api/notes')).text,'');
  await api('/api/auth/logout',{method:'POST'});await login(api);assert.deepEqual(await api<Workspace>('/api/workspace'),{fields:[],overrides:{}});
  assert.equal((await api<{text:string}>('/api/notes')).text,'');
});

test('Producer and technician accounts no longer exist; admin and analysis endpoints are gone',async()=>{
  const api=create();
  for (const username of ['productor1','productor2','tecnico']) await assert.rejects(login(api,username),/no coinciden/);
  await login(api);
  await assert.rejects(api('/api/admin/users'),/no existe/);
  await assert.rejects(api('/api/analyses',post({geometry,parcelId:'AGC_001'})),/no existe/);
});

test('Crossed boundaries and unknown parcels are rejected',async()=>{
  const api=create();await login(api);
  const crossing={type:'Polygon',coordinates:[[[-98.56,19.54],[-98.559,19.541],[-98.559,19.54],[-98.56,19.541],[-98.56,19.54]]]};
  await assert.rejects(api('/api/fields',post({geometry:crossing})),/se cruzan/);
  await assert.rejects(api('/api/parcels/NOPE/geometry',{method:'PUT',body:JSON.stringify({geometry})}),/No encontramos/);
  assert.deepEqual(await api<Workspace>('/api/workspace'),{fields:[],overrides:{}});
});
