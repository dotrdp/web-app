# AgroCebada · FIRA 2026

Public demo: **https://agrocebada.datascience-mexico.com**. React, shadcn/ui (Tailwind CSS v4 + Radix) and OpenLayers retain the original 197 parcels, climate/terrain, Landsat and AlphaEarth products. A same-origin Cloudflare Worker connects live imagery and fixed SAM 2.1 tiny inference to rig.

## Run and deploy

```sh
npm ci
npm run dev:demo
npm run build:demo
npm run deploy
```

The demo development server runs at `http://127.0.0.1:8082`, proxying scientific requests to port 8090. `build:demo` uses `.env.demo`. Drawn parcels and corrections exist only in page memory; reload/logout resets them. The public demo creates no session cookie, localStorage, sessionStorage or account database. Scientific caches on rig persist independently.

There is one account, `testuser` / `Fira2026!`, with access to all 197 parcels. The former Productor / Técnico / Administrador roles, assignments and the presentation switch were removed; technical tools now live in the **Indicadores avanzados** phase (see [PLAN.md](PLAN.md)).

`npm run dev` and `npm run build && npm start` preserve the original local server at port 8080, with scrypt authentication, session cookies and a persistent local workspace. Use **demo** commands for the public deployment.

## Interface

The shell follows Noctalia / Caelestia (Quickshell): the map is the wallpaper inside one continuous frame, and every panel is a popout attached to an edge with concave fillets (`src/shell/Popout.tsx`, `shell.css`). Components are shadcn/ui (Tailwind v4, Radix) styled with tonal tokens; palettes are seeded from the barley mark (`src/index.css`: Cebada, Trigo, Tierra, Noche, Laguna; light and dark). Font: Rubik Variable (OFL, `@fontsource-variable/rubik`).

- **Bar** (`src/shell/Bar.tsx`): the mark opens the launcher; three phase pills (Alt 1–3) — **Explorar**, **Estimar**, **Indicadores avanzados**; map panels (capas y simbología, mapa base, tabla de atributos, filtros, marcadores, complementos); active layer; imagery-service status; clock; sources, scheme, theme, logout. Below 768 px it becomes a bottom dock.
- **Dashboard** (top, Alt D): Resumen (monthly climate, atlas, calendar, production by state, parcel "player" with tour), Modelo (MAE / R² / RMSE gauges), Ciclo (data availability and the 31 October cutoff).
- **Launcher** (bottom, Ctrl/⌘ K): parcels, municipalities, coordinates; `>` commands; `>base` and `>esquema` carousels.
- **Estimar** (`src/panels/EstimationPanel.tsx`): metrics, productive reading in tonnes and pesos (editable price, 50/80/90 % empirical intervals), estimates per ID_POLIGONO linked to the map, group-by municipality, and the 59-row submission CSV.
- **Indicadores avanzados** (`src/panels/AdvancedPanel.tsx`): parcel series and AlphaEarth, model diagnostics (scatter, residuals, folds, largest errors, error map), and the scientific layers and thresholds (MNDWI, Landsat, AlphaEarth, climate, terrain, provenance). These controls appear nowhere else.
- **Complementos** (`src/plugins.tsx`): SAM delineation, drawing, measuring, hover identify, swipe, box selection with statistics, heat map, labels, attribute table, export and location — each can be switched off; enabled tools populate the tool strip and launcher.
- Loading keeps Spectrum UI's nine dots and the growing barley mark; the login keeps the COBE globe and particles. Reduced motion stops all animation.

Yield estimates come from `public/data/predictions.json`, exported without refitting by `python3 -I scripts/export_predictions.py` from `../final-model` (fixed 90/10 attention ensemble; 5-fold CV over 138 parcels: MAE 0.322, RMSE 0.487 t/ha, R² 0.670). Training parcels show out-of-fold estimates; the 59 reserved parcels use the mean of the fold models. Intervals are empirical quantiles of the out-of-fold absolute errors. Drawn parcels have no estimate.

## MCP for outside agents

Milli's tools (data, statistics, matplotlib-style figures, and control of the browser tab) are also published as the MCP server `agrocebada` over Streamable HTTP (`server/milli/mcp-http.mjs`).

- **One MCP per tab**: every logged-in browser tab gets its own secret address, `/mcp/<key>`, shown in Ajustes → MCP de esta pestaña (with a ready client configuration to copy). An agent there acts only on that tab; `screen_id` is optional. Any account, any number of people and tabs at once.
- **Alive while logged in**: logging out, the login expiring, or the tab staying closed ends the address and its sessions; a reloaded tab gets a new one.
- **Client configuration**: `{"mcpServers": {"agrocebada": {"type": "http", "url": "http://localhost:8080/mcp/<key>"}}}`
- **Isolation**: several agents can share a tab's address; each MCP session has its own datasets and figures, and Milli's chat keeps working in every tab.
- **Without a chat**: `plot_show` shows the figure in a panel on the tab and returns its PNG; `request_export` asks the person on the tab (a dialog, two minutes) and downloads only on «Permitir».
- **Shared notes**: agents append atomically; the Notas editor sends the version it started from, and concurrent edits are merged instead of overwritten.

Tested end to end in `tests/mcp-http.test.ts` (two logins, two agents on one tab, permissions, logout, a tab closing) and `tests/e2e/milli.spec.ts`.

## Rig service

Use **uv** and a CUDA GPU. `services/model-version.json` pins the official SAM commit and checkpoint SHA-256. No training or weight updates occur. The supplied systemd units target `%h/code/fira2026/webapp`; adjust paths if installing elsewhere.

```sh
bash services/setup.sh
mkdir -p ~/.config/systemd/user
cp services/agrocebada-*.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now agrocebada-imagery.service agrocebada-tunnel.service
loginctl enable-linger "$USER"
uv run --no-project --python services/.venv/bin/python python services/prewarm.py
```

Setup installs the locked Python environment, verifies fixed weights, prepares a private service token and builds all 48 manifests. Cloudflared must be installed at `/usr/local/bin/cloudflared`. Credentials stay in the ignored `.data-cache/deployment/` directory with mode 600 and never enter the browser bundle. The API refuses to start without its token.

For a newly configured Worker, create the `AGROCEBADA_SERVICE` KV binding in `wrangler.jsonc`, then install the same server token:

```sh
npx wrangler secret put SERVICE_TOKEN < .data-cache/deployment/service-token
npm run deploy
```

The existing Cloudflare authorization can deploy Workers but cannot edit DNS. A supervised Cloudflare Tunnel therefore registers its changing HTTPS origin through the token-protected `/__service/register` endpoint into KV. The public frontend keeps its existing custom domain and uses only same-origin endpoints. Registration repeats after restarts/reboots; both rig units automatically restart and use user lingering.

| Endpoint | Behavior |
| --- | --- |
| `GET /api/imagery/health` | Service/model availability |
| `GET /api/imagery/manifests/YYYY-MM` | Version, scenes, dates, calibration and tile template |
| `GET /api/imagery/tiles/{version}/{month}/{product}/{z}/{x}/{y}.png` | RGB, NDVI or MNDWI; optional threshold |
| `POST /api/segmentation/proposals` | WGS84 prompts, month, imagery version and request ID |

Scientific endpoints bypass the browser demo adapter. Public manifests omit source asset URLs and signed credentials. Limits: 16 KiB bodies, 240 requests/minute/client, four concurrent tile computations with a bounded queue, and one inference. Native data/tiles use a persistent 40 GiB LRU cache; successful public tiles also use Cloudflare caching.

During rig outages the welcome screen and original atlas products remain available. New layers/delineation report unavailability with retry/manual controls. Cold tiles may need a retry while native observations are prepared; prewarming prioritizes the July opening view and statewide overview.

## Scientific products and delineation

`services/data/states.geojson` contains the **complete** INEGI Hidalgo/Puebla/Tlaxcala boundaries. Source dates/checksums are alongside it. Public display boundaries are simplified only for cartography. Coverage is never restricted to the old parcel rectangle or a processing crop.

All 48 Sentinel-2 L2A manifests cover every intersecting footprint and 16 MGRS tiles. Reprocessed duplicates use the newest baseline/generation. Deterministic per-pixel mosaics order observations by scene cloud percentage, acquisition date and ID. SCL 4/5/6/7 are retained; fill, defects, shadows, clouds, cirrus and snow are masked. Source planes retain acquisition provenance. Classification can be imperfect; water is displayed as **candidates**, not confirmed boundaries.

Original, unharmonized Planetary Computer DNs use `DN × 0.0001 − 0.1` at processing baseline ≥04.00 and zero offset earlier. DN zero is missing. Calibration was checked against original product XML. RGB/NDVI use aligned 10 m grids. Green reflectance is area-averaged onto the 20 m SWIR1 grid **before** `(green − SWIR1) / (green + SWIR1)`. Cyan candidates default to MNDWI ≥0. Missing observations remain transparent without fabricated values or interpolation. Native indices are computed before tile resampling.

Renderer version 2 creates weighted display overviews after native index computation and thresholding, preserving transparent missing data. Its versioned manifests retain the original native imagery version so existing native caches and segmentation provenance stay reproducible. The July 2025 native grid, statewide zoom 6–9 overviews and zoom 10–11 opening view are prewarmed.

Fixed SAM 2.1 tiny uses an unstyled, georeferenced RGB crop of the selected imagery version. Edge-touching results expand the crop up to 5120 m. The editable WGS84 response includes scenes, prompts, crop grid, model version, confidence and latency. Prompt constraints are checked again after geometry processing. Ambiguity/missing observations are reported. The current editor accepts one exterior; excluded interior holes require manual correction.

Proposals remain separate from saved parcels. Users add inclusion/exclusion points, retry, adjust vertices, cancel, export and explicitly save. Abort/revision checks prevent stale responses from replacing drafts. Exports preserve proposed/corrected geometry for later training. Outlines are approximate at 10 m and require confirmation. This release adds no alerts, crop diagnoses, field visits or cloud prediction.

## Verification and rollback

```sh
npm run check
npm test
npm run test:e2e
AGROCEBADA_DEMO=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:8082 npm run test:e2e
uv run --no-project --python services/.venv/bin/python python -m unittest discover -s services -p 'test_*.py' -v
uv run --no-project --python services/.venv/bin/python python services/verify_live.py
```

Tests cover original data, calibration, masks, water aggregation, statewide manifests, tile seams, GIF resources/budgets, assignments, geometry, crop expansion and prompt constraints. Playwright checks loading/reduced motion, full map layouts, historical products, drawing/delineation, exports, stale requests and permissions. Evidence is retained in ignored `test-results/` and `.data-cache/verification/`.

`node scripts/check_recovery.mjs` performs a controlled rig outage and crash restart against the development demo. Run during a maintenance window. Live verification tests an unknown field in each state, real RGB/NDVI/water tiles outside the parcel cluster, and reference IoU against AGC_001. Model scores are not measured boundary accuracy; the unknown fields have no surveyed ground truth.

The previous frontend is archived at `.data-cache/rollback/frontend-before-20261007.tar.gz`, with Cloudflare versions in `cloudflare-before.json`. Previous public Worker: `9089d611-586a-4cc1-8d0a-24eb4f50509f`. Restore with `npx wrangler rollback 9089d611-586a-4cc1-8d0a-24eb4f50509f`, or redeploy the archived frontend. Fixed model source/checkpoint/version remain preserved independently.

## Sources and reproduction

- [Copernicus products](https://sentiwiki.copernicus.eu/web/s2-products), [processing/SCL](https://sentiwiki.copernicus.eu/web/s2-processing) and [Planetary Computer Sentinel-2](https://planetarycomputer.microsoft.com/dataset/sentinel-2-l2a).
- [MNDWI scientific reference](https://lpdaac.usgs.gov/documents/1370/GFCC_ATBD.pdf).
- [Official SAM 2](https://github.com/facebookresearch/sam2), pinned in `services/model-version.json`.
- [Spectrum UI AI assistant blocks](https://ui.spectrumhq.in/blocks/ai-assistants#agent-steps), Apache-2.0; loading-state and agent-steps adapted for the application.
- [INEGI Marco Geoestadístico](https://www.inegi.org.mx/servicios/catalogounico.html); source metadata in `services/data/boundary-sources.json`.
- FIRA original shapefile/CSV/climate delivery and QGIS project; checksums in `public/data/provenance.json`.
- [AlphaEarth source/encoding](https://developers.google.com/earth-engine/guides/aef_on_gcs_readme), CC BY 4.0. All 1,773 parcel-year previews and normalized 64-axis vectors are preserved. A00/A01/A02 are a display stretch, not vegetation health.
- [Landsat C2 L2](https://planetarycomputer.microsoft.com/dataset/landsat-c2-l2) / USGS: 48 preserved Landsat 8/9 composites, native 30 m statistics, scale 0.0000275, offset −0.2, QA masks and missing values.
- Interface built from [shadcn/ui](https://ui.shadcn.com) components and blocks (MIT), Radix primitives, Recharts, TanStack Table and Sonner. [Geist](https://vercel.com/font) (OFL). Basemaps: Esri World Topographic and World Imagery, [OpenFreeMap](https://openfreemap.org) © OpenMapTiles and OpenStreetMap contributors. Licenses are in `public/licenses/`.
- Former login cartography (GIF artwork in `public/artwork/`, unused since the redesign): Esri World Imagery, INEGI and FIRA boundaries. Reproduce with `uv run --no-project --python /usr/bin/python3 python scripts/render_login.py`; its manifest records extents/checksums. The login needs no runtime map service.

Original preparation remains in `scripts/export_data.py` and `scripts/fetch_landsat.py`, using the neighboring supplied `dataset/` without changing original sources. OpenLayers, ol-mapbox-style, Material UI, Base UI, React Aria, Lucide and Geist supply the interface.
