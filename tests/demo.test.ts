import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createDemoApi } from '../src/demo';
import type { Analysis, Assignment, Field, User, Workspace } from '../src/types';
const originalIds = JSON.parse(readFileSync(new URL('../public/data/parcels.geojson',import.meta.url),'utf8')).features.map((f: { properties: { id: string } })=>f.properties.id) as string[];
const create = () => createDemoApi(async()=>originalIds);
const geometry = { type: 'Polygon', coordinates: [[[-98.56,19.54],[-98.559,19.54],[-98.559,19.541],[-98.56,19.541],[-98.56,19.54]]] };
const post = (body:unknown): RequestInit => ({method:'POST',body:JSON.stringify(body)});
const login = (api: ReturnType<typeof create>,username='testuser') => api<{user:User}>('/api/auth/login',post({username,password:'Fira2026!'}));
const core = (w:Workspace) => ({fields:w.fields,overrides:w.overrides,analyses:w.analyses});

test('Page memory isolates users, edits, assignments and fixed example yields; logout resets everything',async()=>{
  const api=create(); assert.equal((await api<{user:null}>('/api/auth/session')).user,null);
  await assert.rejects(api('/api/workspace'),/Inicia sesión/);
  await assert.rejects(api('/api/auth/login',post({username:'testuser',password:'wrong'})),/no coinciden/);
  assert.equal((await login(api)).user.role,'admin');
  const field=await api<Field>('/api/fields',post({geometry,name:'Temporal'})); assert.ok(field.area>1);
  const result=await api<Analysis>('/api/analyses',post({geometry,parcelId:field.id,name:field.name}));
  assert.equal(result.status,'placeholder');assert.equal(result.yield,4.2);assert.equal(result.production,Math.round(result.area*4.2*100)/100);
  await api(`/api/parcels/${field.id}/geometry`,{method:'PUT',body:JSON.stringify({geometry})});
  const workspace=await api<Workspace>('/api/workspace');assert.equal(workspace.fields.length,1);assert.equal(workspace.analyses.length,1);assert.equal(Object.keys(workspace.overrides).length,1);
  workspace.fields.length=0;assert.equal((await api<Workspace>('/api/workspace')).fields.length,1);
  const newPage=create();await login(newPage);assert.deepEqual(core(await newPage<Workspace>('/api/workspace')),{fields:[],overrides:{},analyses:[]});
  await api('/api/auth/logout',{method:'POST'});await login(api);assert.deepEqual(core(await api<Workspace>('/api/workspace')),{fields:[],overrides:{},analyses:[]});
  assert.equal((await api<{users:User[]}>('/api/admin/users')).users.length,4);
});

test('Crossed and open boundaries are rejected before adding fields or analyses',async()=>{
  const api=create();await login(api);
  const crossing={type:'Polygon',coordinates:[[[-98.56,19.54],[-98.559,19.541],[-98.559,19.54],[-98.56,19.541],[-98.56,19.54]]]};
  await assert.rejects(api('/api/fields',post({geometry:crossing})),/se cruzan/);
  await assert.rejects(api('/api/analyses',post({geometry:crossing,parcelId:'AGC_001'})),/se cruzan/);
  assert.deepEqual(core(await api<Workspace>('/api/workspace')),{fields:[],overrides:{},analyses:[]});
});

test('Producer/technician assignments enforce all reads and writes independently of UI presentation',async()=>{
  const api=create();await login(api,'productor1');
  const producer=await api<Workspace>('/api/workspace');assert.equal(producer.accessibleParcelIds!.length,99);
  assert.ok(producer.accessibleParcelIds!.includes('AGC_001'));assert.ok(!producer.accessibleParcelIds!.includes('AGC_002'));
  await assert.rejects(api('/api/admin/users'),/administrador/);
  await assert.rejects(api('/api/admin/users',post({username:'intruder',role:'admin',password:'12345678'})),/administrador/);
  await assert.rejects(api('/api/parcels/AGC_002/geometry',{method:'PUT',body:JSON.stringify({geometry})}),/asignada/);
  await assert.rejects(api('/api/analyses',post({geometry,parcelId:'AGC_002'})),/asignada/);
  await assert.rejects(api('/api/fields',post({geometry,ownerId:'producer-2'})),/esa cuenta/);
  const field=await api<Field>('/api/fields',post({geometry,name:'Owned'}));assert.equal(field.ownerId,'producer-1');
  await login(api,'productor2');assert.equal((await api<Workspace>('/api/workspace')).fields.length,0);
  await assert.rejects(api(`/api/fields/${field.id}`,{method:'DELETE'}),/asignada/);
  await login(api,'tecnico');const tech=await api<Workspace>('/api/workspace');assert.ok(tech.accessibleParcelIds!.includes(field.id));assert.ok(!tech.accessibleParcelIds!.includes('AGC_002'));
  await login(api);const assignment=await api<Assignment>('/api/admin/assignments',{method:'PUT',body:JSON.stringify({parcelId:'AGC_002',producerId:'producer-1',technicianId:'tech-1'})});assert.equal(assignment.technicianId,'tech-1');
  await login(api,'tecnico');assert.ok((await api<Workspace>('/api/workspace')).accessibleParcelIds!.includes('AGC_002'));
  await api('/api/parcels/AGC_002/geometry',{method:'PUT',body:JSON.stringify({geometry})});
});

test('Administrators manage active roles and accounts; disabled users cannot log in',async()=>{
  const api=create();await login(api);
  const created=await api<User>('/api/admin/users',post({username:'new_producer',name:'Nueva',role:'producer',password:'newpassword'}));
  assert.equal(created.role,'producer');await api(`/api/admin/users/${created.id}`,{method:'PUT',body:JSON.stringify({role:'technician',active:false})});
  await assert.rejects(api('/api/auth/login',post({username:'new_producer',password:'newpassword'})),/desactivada/);
  await assert.rejects(api('/api/admin/users/test-admin',{method:'PUT',body:JSON.stringify({role:'producer'})}),/administradora/);
  await api('/api/admin/users/producer-2',{method:'PUT',body:JSON.stringify({role:'technician'})});
  await login(api,'productor2');assert.equal((await api<Workspace>('/api/workspace')).accessibleParcelIds!.length,0);
});
