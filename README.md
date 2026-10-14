# AgroCebada · FIRA 2026

Public demo: **https://agrocebada.datascience-mexico.com**. React, Material UI and OpenLayers retain the original 197 parcels, climate/terrain, Landsat and AlphaEarth products. A same-origin Cloudflare Worker connects live imagery and fixed SAM 2.1 tiny inference to rig.

## Run and deploy

```sh
npm ci
npm run dev:demo
npm run build:demo
npm run deploy
```

The demo development server runs at `http://127.0.0.1:8082`, proxying scientific requests to port 8090. `build:demo` uses `.env.demo`. Accounts, assignments, parcels, corrections and analyses exist only in page memory; reload/logout resets them. The public demo creates no session cookie, localStorage, sessionStorage or account database. Scientific caches on rig persist independently.

| Account | Role | Initial access |
| --- | --- | --- |
| `testuser` | Administrador | All 197 parcels; accounts, roles, status and assignments |
| `tecnico` | Técnico | Productor 1's 99 assigned parcels |
| `productor1` | Productor | 99 assigned parcels |
| `productor2` | Productor | 98 assigned parcels |

All seeded passwords are `Fira2026!`. The account menu demonstrates assignment boundaries while retaining page memory. Productor / Análisis Pro changes presentation; the dispatcher separately checks permissions for every workspace read/write. Original geometries remain immutable; corrections are separate overrides.

`npm run dev` and `npm run build && npm start` preserve the original local server at port 8080, with scrypt authentication, session cookies and a persistent local workspace. Use **demo** commands for the public deployment and simulated roles.

## Login and map

- **Design system.** `src/theme.css` defines neutral shadcn-style tokens (one ink primary, a leaf accent), Geist for text, Geist Mono for data and **Geist Pixel Circle** (dot-matrix) for display headings and key numbers. Fonts are vendored in `src/fonts/` under the SIL OFL (`public/licenses/geist-OFL.txt`). Material UI is themed onto the same tokens in `src/main.tsx`.
- **Login.** A night-side hero with dot-matrix type, drifting particles (`src/Particles.tsx`, adapted from Magic UI Floating 3D Particles) and a rising COBE globe (`src/Globe.tsx`, Magic UI Globe pattern) in the style of Cloudflare's banner: markers on Hidalgo, Puebla and Tlaxcala and arcs from the data sources (Copernicus/ESA, USGS Landsat, AlphaEarth) and FIRA. Drag spins the globe; reduced motion stops the sway. Mobile ≤760 px shows a compact banner above the form. The previous GIF artwork remains in `public/artwork/` but is no longer used.
- **Shell.** A shadcn-style sidebar (Stealth UI navbar pill, workspace card, Productor / Análisis Pro switch for every role, grouped navigation, account menu). There is no top bar; screens ≤1000 px use a left drawer.
- **Map**, modelled on [shadcn-map](https://shadcn-map.vercel.app): the default basemap is OpenFreeMap **Positron** vector tiles rendered by `ol-mapbox-style`, with OpenFreeMap Dark and Esri satellite in the layers popover (top right) alongside the state and municipality overlays (municipalities start hidden). Parcels below zoom 12.6 are Leaflet.markercluster-style bubbles (green/yellow/orange by count) and single dots coloured by the active data; above it they become outlined fields with labels. Search and the data-layer segmented control (Rendimiento, Vegetación, Agua, Clima, Terreno) sit top left; *Analizar mi terreno*, drawing and Análisis Pro top right; locate and zoom bottom right; a compact legend with live coordinates and scale bottom left. The month dock appears only for layers that change over time (AlphaEarth gets a year picker instead).
- **Loading.** Spectrum UI's nine loading dots remain for inline values and step markers. Larger moments use [Dot Matrix](https://dotmatrix.zzzzshawn.cloud) loaders vendored in `src/dotmatrix/` and exposed through `DotLoader` in `src/Loader.tsx` (radar for map preparation, scanline for Sentinel-2 imagery, spiral/lattice for SAM delineation, bars for charts…). Their license is in `public/licenses/dotmatrix-LICENSE.txt`. The setup screen adds a dot-matrix progress meter to the request-driven agent timeline.
- Compact +/− zoom buttons control the actual OpenLayers view from levels 5–19 and disable at its limits. The water MNDWI threshold uses a Stealth slider in Análisis Pro, ranging from −1 to 1 in 0.05 steps with a default of 0. React Aria provides toolbar keyboard navigation; Stealth UI icon buttons and tooltips (MIT, `public/licenses/stealth-ui-MIT.txt`) are restyled onto the tokens. Reduced motion disables springs, particles, globe sway and loader animation.
- Every page retains its cards, table columns and units during loading, with `—` values and the shared dotted indicator. Pending administration writes, example analyses and delineation areas use the same placeholders. Errors stop their animation and offer retry; pages with cached data show their values immediately. Unconnected model metrics remain explicitly labeled as pending.
- July 2025 is the opening month. April–October are directly available; the date picker covers 2022–2025. Playback waits for imagery, stops on service errors and pauses during editing or segmentation. Yield, terrain and annual AlphaEarth disable monthly playback.
- Selection opens a floating card; mobile uses a scrollable bottom sheet. Análisis Pro contains thresholds, water opacity, climate/terrain controls, historical Landsat, annual AlphaEarth and provenance exports. Selection/map movement preserve raster sources, with bounded browser caches.
- Rendimiento colors recorded 2025 yields only; missing values remain neutral. Yield estimates remain the explicit **4.2 t/ha example**, labeled `PLACEHOLDER_SIN_INFERENCIA`. No yield prediction model runs.

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
- [shadcn-map](https://github.com/tonghohin/shadcn-map) (MIT), [Magic UI](https://magicui.design) Globe and Floating 3D Particles (MIT), [COBE](https://github.com/shuding/cobe) (MIT), [Dot Matrix loaders](https://dotmatrix.zzzzshawn.cloud), [Geist](https://vercel.com/font) (OFL), [OpenFreeMap](https://openfreemap.org) basemaps © OpenMapTiles, OpenStreetMap contributors. Licenses are in `public/licenses/`.
- Former login cartography (GIF artwork, unused since the redesign): Esri World Imagery, INEGI and FIRA boundaries. Reproduce with `uv run --no-project --python /usr/bin/python3 python scripts/render_login.py`; its manifest records extents/checksums. The login needs no runtime map service.

Original preparation remains in `scripts/export_data.py` and `scripts/fetch_landsat.py`, using the neighboring supplied `dataset/` without changing original sources. OpenLayers, ol-mapbox-style, Material UI, Base UI, React Aria, Lucide and Geist supply the interface.
