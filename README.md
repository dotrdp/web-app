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

- Actual looping GIF artwork combines georeferenced Esri imagery, INEGI boundaries and supplied parcels. Desktop is 48% artwork / 52% login; mobile ≤700 px has a compact banner above the form. The logo and copy remain HTML. Reduced motion explicitly selects a WebP poster.
- Desktop GIF: 720×1050, 120 frames, 10 seconds, 280,965 bytes. Mobile: 780×320, 120 frames, 10 seconds, 157,702 bytes. Both use optimized palettes, partial frames and infinite loops, with no player UI. Three storyboard frames per format and source metadata are in `public/artwork/`.
- All pages use a persistent sidebar adapted from Stealth UI's navbar, with a pill that follows the pointer and returns to the current page. The existing AgroCebada logo and account actions remain in the side menu; smaller screens use a left drawer. Pro settings open in a right drawer. Productor and Técnico accounts have no top bar and use the full available viewport height. Administrators retain a slim presentation bar. Floating search accepts parcel ID, municipality or coordinates. No parcel is initially selected.
- Stealth UI square icon buttons group layers (Rendimiento, Vegetación, Agua, Clima and Terreno), parcel tools, map navigation, direct basemap selection and monthly playback. Shared tooltips provide their names on hover and keyboard focus, with subtle press motion. Each toolbar independently compacts to a single icon and reopens, including when its data controls are disabled. Selected layers, dates, basemaps and compact preferences survive page navigation in memory; logout/reload resets the demo.
- Compact +/− zoom buttons control the actual OpenLayers view from levels 5–19 and disable at its limits. The water MNDWI threshold uses a Stealth slider in Análisis Pro, ranging from −1 to 1 in 0.05 steps with a default of 0. Its value bubble, pointer/touch drag and keyboard controls update the water tiles and map legend directly. React Aria retains group navigation, selected states, disabled controls and focus restoration. April–October fit the mobile dock; native date editing retains its own keys. Fullscreen keeps side panels available. `src/IconButton.tsx`, `src/MapSlider.tsx` and `src/Navbar.tsx` adapt Stealth UI's MIT-licensed sources to the app's CSS (`public/licenses/stealth-ui-MIT.txt`); React Aria grouping retains Intent UI's MIT attribution. Reduced motion disables springs, press scaling and drawer transitions.
- Map setup uses a request-driven agent timeline with parallel sources, elapsed time, expandable results and retry. Spectrum UI's nine-dot loading state also appears during imagery preparation and live delineation. Timers are hidden from screen readers; reduced motion disables the dots and text shimmer. Adapted components are in `src/AgentProgress.tsx`, with the Apache-2.0 license in `public/licenses/spectrum-ui.txt`.
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
- Login cartography: Esri World Imagery, INEGI and FIRA boundaries. Reproduce with `uv run --no-project --python /usr/bin/python3 python scripts/render_login.py`; its manifest records extents/checksums. The login needs no runtime map service.

Original preparation remains in `scripts/export_data.py` and `scripts/fetch_landsat.py`, using the neighboring supplied `dataset/` without changing original sources. OpenLayers, Material UI, Lucide, Inter and Manrope supply the interface.
