# AgroCebada: improvement plan (October 2026)

This plan rebuilds the webapp around three inputs:

1. **What FIRA's organisers asked for** in *Preguntas y respuestas adicionales*.
2. **The Noctalia / Caelestia (Quickshell) design language** from the reference video.
3. **What GIS users value in ArcGIS and in the QGIS plugin ecosystem**, from 14 Reddit threads plus plugin-repo and Esri sources.

It also removes the Productor / Técnico overhead. Everything technical now lives in a single "Indicadores avanzados" phase.

Status markers: ✅ implemented in this pass · ⏭ next.

---

## 1. What the organisers need (from the Q&A) and how the app answers it

| Q&A point | Requirement for the app | Where it lives |
| --- | --- | --- |
| Q1 · AREA_HA is the georeferenced polygon area; RENDIMIENTO_T_HA is harvested grain; one target for all 197 parcels | Show the area as the polygon area. Compute production as t/ha × AREA_HA. Treat every yield as a single variable. | ✅ Parcel card ("Superficie del polígono"), the Estimar table and the "Cómo leer estas cifras" notes |
| Q2 · RMSE, MAE and R² per ID_POLIGONO, not area-weighted | Report those three metrics computed per parcel, and deliver the predictions keyed by ID_POLIGONO | ✅ Estimar metric tiles, the dashboard *Modelo* gauges, per-fold table (Advanced), and the "Entrega · 59 parcelas" CSV `ID_POLIGONO,RENDIMIENTO_T_HA` |
| Q3/Q4 · Weighed on a scale, no moisture adjustment, mixed sources that cannot be told apart | Say so wherever yield is shown. Never imply the source can be identified. | ✅ Notes accordion and Sources page |
| Q5 · Stratified 70/30 split: 138 training, 59 reserved | Show both sets explicitly. Training estimates must be out-of-fold. | ✅ Set tabs, a "VC" mark on cross-validated estimates, and the reserved parcels use the mean of the fold models |
| Q6 · No mandatory cutoff, but teams must state when they predict and which data exist at that point | State the cutoff and show data availability along the season | ✅ "Corte 31 de octubre" in the header, the dashboard *Ciclo* tab (Sentinel-2, climate, AlphaEarth and harvest timeline with the cutoff marker), and the notes |
| Q7 · No official error threshold. Teams must interpret the error productively: what a deviation in t/ha means for a producer, and the limits of a real decision | Translate the error into tonnes and pesos for a real parcel, say how often it holds, and state the limitations | ✅ "¿Qué significa para un productor?" uses an editable price, the selected parcel's area, 50/80/90 % empirical intervals, and the share of parcels within 0.25 / 0.5 / 0.75 / 1 t/ha; limits are in the notes |
| Q8 · Evaluation uses only the 59 reserved parcels; no other seasons | Make the submission file trivial to produce, and do not claim generalisation to other years | ✅ Entrega CSV (unit-tested to contain exactly the 59 IDs) and a single-season caveat |
| Purpose: support productive, planning and *financial* decisions | Aggregate by geography and selection, and give production with its uncertainty | ✅ Box selection summary (ha, t, ± t), group-by municipality in Estimar, production by state in the dashboard |

**Model data.** `scripts/export_predictions.py` exports the selected ensemble into `public/data/predictions.json` without refitting. The ensemble is the 90/10 MMST-ViT + Daily DeepCropNet blend, MAE 0.322 / RMSE 0.487 t/ha / R² 0.670 on 5-fold CV over the 138 parcels. The fixed **4.2 t/ha placeholder is gone**. Intervals are empirical quantiles of the 138 out-of-fold absolute errors (split-conformal style). Drawn parcels show "Sin estimación" because they lack the model's inputs.

## 2. Removing the Productor / Técnico overhead

**Before:** four accounts (admin, técnico, productor 1 and 2), assignment tables, per-role parcel visibility, an Administración page, and a "Productor / Análisis Pro" switch that changed only the presentation.

**After** ✅:
- **One account** (`testuser`). Everyone sees all 197 parcels. `demo.ts`, `server/index.mjs` and the types drop roles, assignments, `/api/admin/*` and the placeholder `/api/analyses`.
- **Phases replace roles.** The bar has three workspace pills:
  1. **Explorar**: map, estimated yield, vegetation. No thresholds, no sensor jargon.
  2. **Estimar**: metrics, the productive reading, the linked table, aggregation and the submission.
  3. **Indicadores avanzados**: the *only* place for MNDWI and NDVI thresholds, Landsat, AlphaEarth, climate and terrain rasters, the model error map, fold diagnostics, the scatter and residual histogram, and provenance downloads.
- Choosing an advanced layer elsewhere (for example from the launcher) moves you into phase 3. Going back to Explorar returns the map to Rendimiento.
- Deleted: `AdminPage`, `AnalysisDialog`, `Placeholders`, the sidebar and header, `parcels-table`, `MapToolbar`, and the role and placeholder e2e specs.

## 3. Design: what makes Noctalia / Caelestia great, and how it maps here

| Shell trait (video) | AgroCebada translation | Status |
| --- | --- | --- |
| One continuous **frame**; content is an inset rounded rectangle | The map is the "wallpaper" inside a 22 px-radius viewport; the frame colour surrounds it | ✅ |
| **Popouts are extrusions of the frame**: same colour, concave fillets, square where they touch an edge | `Popout` component: 1 or 2 attached edges, fillets generated per free end, reveal animation that clips from the attached edge | ✅ |
| **Vertical bar**: logo at top, workspace pills with a sliding indicator, tray icons, rotated active title, clock, power | Barley mark opens the launcher. Phase pills use a sliding primary blob. The bar holds Capas, Mapa base, Tabla, Filtros, Marcadores and Complementos, the rotated active-layer name, an imagery-service status dot, the clock, sources, scheme, theme and logout. | ✅ |
| **Dashboard drops from the top centre**: tabs with icon over label and underline; tonal tiles (weather, system, calendar, media); circular gauges | *Resumen*: monthly climate, atlas facts, month, calendar, production by state, and a "now playing" parcel disc with prev / ▶ tour / next. *Modelo*: MAE, R² and RMSE arc gauges. *Ciclo*: data-availability timeline. | ✅ |
| **Launcher rises from the bottom**; ">" commands; wallpaper carousel with an enlarged centre item | Search parcels, municipalities and coordinates. ">" lists every command (phases, layers, tools, export, theme). `>base` and `>esquema` open carousels. | ✅ |
| **Material-You tonal palette derived from the wallpaper** | **Logo-driven palettes.** One hue seeds frame, tile, primary and container tones. Five schemes (Cebada, Trigo, Tierra, Noche, Laguna), each light and dark, and the mark recolours with the scheme. Data colours (NDVI, rain, heat) stay fixed. | ✅ |
| Notifications slide from the frame edge | Sonner toasts restyled as frame-coloured cards, top right | ✅ |
| Rubik and Material-style rounded geometry | Rubik Variable (OFL), pill controls, 16–20 px tile radii | ✅ |
| Smooth motion everywhere | Edge reveals, sliding phase indicator, gauge sweep, growing-grain logo while loading. Reduced-motion stops all of it. | ✅ |

Kept on purpose (from earlier feedback): the nine loading dots, the COBE globe and particles on the login, and icon-only map controls with tooltips.

Layout rules that keep popouts from colliding:
- The dashboard handle and the launcher centre in the *free* map area between the left and right popouts.
- The month strip appears only when it and the tool strip both fit.
- The tool strip carries the coordinate, zoom, scale and attribution row through a portal.

## 4. Functionality: the best of ArcGIS and QGIS plugins

The research summary is condensed in §6. Each tool is a **Complemento**: it can be switched on or off in a QGIS-style plugin manager, and enabled tools appear in the tool strip and as launcher commands. Plugin state is kept in page memory only.

| Tool | Inspired by | Status |
| --- | --- | --- |
| Delimitar con IA (SAM 2.1 on Sentinel-2) | ArcGIS Pro Segment Anything, QGIS SamGeo | ✅ (kept, restyled) |
| Dibujar parcela, corregir límites | ArcGIS Sketch | ✅ |
| Medir distancia / área | Measurement widget | ✅ |
| **Identificar al pasar**: estimate, observed, area, NDVI, rain, Tmax | QGIS Value Tool, ArcGIS pop-ups | ✅ |
| **Comparar con deslizador** (swipe the data layer against the basemap) | ArcGIS Swipe, QGIS MapSwipe | ✅ |
| **Seleccionar por área**: count, ha, production ± error, mean t/ha, CSV | ArcGIS select-by-rectangle and Dashboards indicators | ✅ |
| **Mapa de calor** of estimated production | ArcGIS smart mapping | ✅ |
| **Smart symbology**: estimated or observed, continuous / quantiles / equal intervals, live legend with counts | ArcGIS smart mapping, QGIS graduated renderer | ✅ |
| **Etiquetas de rendimiento** | Labeling | ✅ |
| **Tabla de atributos** linked to the map (hover highlights, click flies) | ArcGIS / QGIS attribute table | ✅ |
| **Agrupar por municipio** (ha, t, ± t) | QGIS "Dissolve with stats", mmqgis | ✅ |
| Rich parcel card: interval bar, observed marker, error chip, **percentile among 197**, **"Ver parecidas"** filter | Arcade-scored pop-ups, QGIS filter-from-pop-up | ✅ |
| Basemap gallery and carousel, bookmarks, search, my location, fullscreen, time slider with playback | QuickMapServices, Lat Lon Tools, Field Maps, Time Slider | ✅ |
| Exports: PNG, GeoJSON, CSV (estimate, interval, production), submission file | Print / Export, qgis2web | ✅ |
| Swipe with an independent date or index on each side | Most-requested swipe gap on the forums | ⏭ |
| Drag-and-drop import of KML, KMZ, SHP or GeoJSON | KML Tools ("stakeholders send atrocious KMLs") | ⏭ |
| One-page PDF parcel report | Print layouts | ⏭ |
| NDVI transect along a drawn line | Profile Tool | ⏭ |
| Click-to-filter yield histogram (cross-filter) | Dashboards | ⏭ |
| Persisted user notes and sketches (server mode only; the demo stays storage-free) | Memory Layer Saver | ⏭ |

Anti-patterns avoided, from the complaints:
- No layout builder and no ten-widget dashboards; there are opinionated phases instead.
- One properties surface per side, so the mouse doesn't ping-pong across the screen.
- Hidden layers aren't fetched, and tile sources stay bounded.
- One app with one mental model.
- Open exports everywhere.
- Index maps always come with an interpretation for the farmer (the "actionable" complaint from r/PrecisionAg).

## 5. Verification

- `npm run check`: types are clean.
- `npm test`: 14 unit tests pass. New ones check that predictions cover every ID_POLIGONO, that MAE and RMSE recompute from the out-of-fold errors, that the submission has exactly the 59 reserved IDs, the productive-error arithmetic, and that the removed roles and endpoints are gone.
- `npm run test:e2e` (local server) and `npm run test:e2e:demo` (public bundle): the new `shell.spec.ts` covers the role-free phases, technical layers only in phase 3, Estimar metrics and price, the linked table and the 59-row download, launcher search, ">" commands and scheme recolouring, dashboard gauges and cutoff, swipe, box selection, the plugin toggle, and mobile. The segmentation, setup-progress, login-artwork and storage-free demo specs still pass. 14 of 14 pass in demo mode.

## 6. Research notes (condensed)

| Product | What users praise |
| --- | --- |
| ArcGIS Dashboards | Add a widget and it works; cross-filtering between widgets |
| Instant Apps | A map ready for a meeting in 20 minutes |
| Arcade pop-ups | Computed fields per feature |
| New Map Viewer | One properties pane with a layer picker |
| Swipe and Wayback | Time comparison |

Most-recommended QGIS plugins: QuickMapServices, Semi-Automatic Classification, MapSwipe, Value Tool, Profile Tool, SamGeo, Lat Lon Tools, Memory Layer Saver, Dissolve with stats, qgis2web and KML Tools.

Complaints: Experience Builder's click count and layout fragility, slow maps that load every layer, the Esri app sprawl, Field Maps regressions, cost and lock-in, and index maps with no interpretation for farmers.

Main sources: r/gis threads 1ob9vx3, 1jwxcat, 1s2ls8u, 1mq9ue2, 1skdhpn, p384ne, 1tfwsna and 1pigpqf; r/QGIS jfzve6; r/ArcGIS 1k1flh7; r/PrecisionAg 1lrzvqn; plugins.qgis.org popularity; the Esri swipe blog.
