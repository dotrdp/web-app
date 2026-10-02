import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { dateKey, filterParcels, mergedParcels, parcelCsv, parseCoordinates } from '../src/lib';
import { colorNdviPixels } from '../src/ndvi';
import type { Atlas, MapFilters } from '../src/types';

const read = (name: string) => JSON.parse(fs.readFileSync(new URL('../public/data/' + name, import.meta.url), 'utf8'));
const atlas: Atlas = { parcels: read('parcels.geojson'), details: read('parcel-data.json'), landsat: read('landsat.json'), rasters: read('layers.json'), provenance: read('provenance.json') };
const filters: MapFilters = { query: '', state: 'all', group: 'all', ndviEnabled: true, ndviThreshold: .35, onlyNdvi: false };

test('All 197 real parcels, original areas, training/prediction assignment and placeholder', () => {
  const features = atlas.parcels.features;
  assert.equal(features.length, 197); assert.equal(new Set(features.map(f => f.properties.id)).size, 197);
  assert.equal(features.filter(f => f.properties.group === 'training').length, 138);
  assert.equal(features.filter(f => f.properties.group === 'prediction').length, 59);
  assert.equal(Math.round(features.reduce((s, f) => s + f.properties.area, 0) * 100) / 100, 1301.05);
  assert.equal(features.filter(f => f.properties.observedYield != null).length, 138);
  for (const f of features) { assert.equal(f.properties.predictedYield, 4.2); assert.equal(f.properties.predictionSource, 'placeholder'); assert.equal(f.geometry.type, 'Polygon'); }
  assert.equal(read('model.json').status, 'placeholder'); assert.deepEqual(read('model.json').metrics, { rmse: null, mae: null, r2: null });
});
test('Months map to all original climate rasters and every annual AlphaEarth vector', () => {
  assert.equal(Object.keys(atlas.rasters).length, 146);
  for (let y = 2022; y <= 2025; y++) for (let m = 0; m < 12; m++) for (const v of ['precipitation', 'tmin', 'tmax']) {
    const r = atlas.rasters[`${v}/${dateKey(y, m)}`]; assert.ok(r); assert.ok(fs.existsSync(new URL('../public' + r.url, import.meta.url)));
  }
  for (const p of atlas.parcels.features) for (let y = 2017; y <= 2025; y++) {
    const vector = atlas.details[p.properties.id].embedding[String(y)]; assert.equal(vector.values.length, 64);
    assert.ok(Math.abs(Math.hypot(...vector.values) - 1) < .00003);
    assert.equal(vector.projection, 'EPSG:32614'); assert.ok(fs.existsSync(new URL('../public' + vector.url, import.meta.url)));
  }
});
test('Landsat NDVI has 48 real months, no Landsat 7 confusion, and preserves missing values', () => {
  assert.equal(Object.keys(atlas.landsat).length, 48);
  for (const r of Object.values(atlas.landsat)) {
    assert.equal(Object.keys(r.parcels).length, 197); assert.equal(r.nativeResolution, 30);
    for (const s of r.scenes) assert.match(s.id, /^LC0[89]_L2S/);
    for (const p of Object.values(r.parcels)) { assert.ok(p.mean == null || p.mean >= -1 && p.mean <= 1); assert.equal(p.mean == null, p.validPixels === 0); }
    assert.ok(fs.existsSync(new URL('../public' + r.url, import.meta.url)));
  }
});
test('NDVI threshold is inclusive, masks individual encoded pixels, preserves no-data', () => {
  const encode = (n: number, valid = true) => { const v = Math.round((n + 1) * 10000); return [v >> 8, v & 255, 0, valid ? 255 : 0]; };
  const source = new Uint8ClampedArray([ ...encode(.3499), ...encode(.35), ...encode(.9), ...encode(.8, false), ...encode(-.5) ]);
  const result = colorNdviPixels(source, .35, true);
  assert.equal(result.valid, 4); assert.equal(result.displayed, 2);
  assert.deepEqual([3, 7, 11, 15, 19].map(i => result.pixels[i]), [0, 240, 240, 0, 0]);
  assert.equal(colorNdviPixels(source, .35, false).displayed, 4);
});
test('Search by ID/municipality/state and coordinate order; NDVI filter matches actual data', () => {
  assert.equal(filterParcels(atlas.parcels.features, { ...filters, query: 'AGC_001' }, atlas, '2025-07').length, 1);
  assert.equal(filterParcels(atlas.parcels.features, { ...filters, query: 'chignahuapan' }, atlas, '2025-07').length, 100);
  assert.equal(filterParcels(atlas.parcels.features, { ...filters, state: 'Hidalgo' }, atlas, '2025-07').length, 51);
  assert.deepEqual(parseCoordinates('19.54, -98.56'), [-98.56, 19.54]); assert.deepEqual(parseCoordinates('-98.56, 19.54'), [-98.56, 19.54]); assert.equal(parseCoordinates('200, 95'), null);
  const selected = filterParcels(atlas.parcels.features, { ...filters, onlyNdvi: true, ndviThreshold: .6 }, atlas, '2025-07');
  assert.ok(selected.length > 0 && selected.length < 197); for (const p of selected) assert.ok(atlas.landsat['2025-07'].parcels[p.properties.id].mean! >= .6);
});
test('CSV makes placeholder results explicit; geometry overrides leave original data intact', () => {
  const csv = parcelCsv(atlas.parcels.features, atlas, '2025-07'); assert.ok(csv.includes('Rendimiento_EJEMPLO')); assert.ok(csv.includes('PLACEHOLDER_SIN_INFERENCIA'));
  const original = atlas.parcels.features[0], geometry = structuredClone(original.geometry); geometry.coordinates[0][1][0] += .00001;
  const merged = mergedParcels(atlas, { fields: [], analyses: [], overrides: { [original.properties.id]: { geometry, area: 99, updatedAt: new Date().toISOString() } } });
  assert.equal(merged[0].properties.area, 99); assert.notEqual(atlas.parcels.features[0].properties.area, 99); assert.equal(merged[0].properties.edited, true);
});
