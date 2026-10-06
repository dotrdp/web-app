# AgroCebada · FIRA 2026

React/Material UI atlas for the Reto AgroCebada. The interface is an original FIRA adaptation of the React Material Admin dashboard structure. It uses the real Agrocebada map found in `/home/rd/code/ds-mx.c/ds-mx.c/public/agrocebada/` and its original QGIS/FIRA data in the neighboring `dataset/` directory.

## Public demo deployment

The demo at **https://agrocebada.datascience-mexico.com** is deployed from `subdomains/agrocebada/` in `/home/rd/code/ds-mx.c/ds-mx.c`. It uses a separate Cloudflare Worker with static assets; its custom domain is declared in `wrangler.jsonc`.

```sh
npm ci
npm run dev:demo
npm run test:e2e:demo
npm run deploy
```

`build:demo` selects `.env.demo` and replaces server API calls with a browser-only demo adapter. The administrator credentials remain **testuser / Fira2026!**. Login, drawn parcels, boundary edits, and analyses exist only in page memory and reset when the page reloads or the user signs out. The demo has no backend, database, session cookie, localStorage, sessionStorage, or uploaded workspace state. Each visitor has an independent session. The fixed **4.2 t/ha** placeholder remains explicit, and downloads still work.

The original map datasets and raster PNGs are served from `public/data/` and `public/rasters/`. Python caches, source datasets, local server state and credentials are excluded from the deployment. `npm run build` and the Node server commands below retain the original local server mode; use `build:demo` for this public demo.

Run browser tests against the deployed site with `AGROCEBADA_DEMO=1 PLAYWRIGHT_BASE_URL=https://agrocebada.datascience-mexico.com npm run test:e2e`.

Start the local app at **http://localhost:8080**:

```sh
npm install
npm run dev
```

The server binds to `127.0.0.1:8080`. For a production build:

```sh
npm run build
npm start
```

The test administrator is **testuser**, password **Fira2026!**. This is the explicitly requested local demo account. Authentication runs on the server: scrypt password hash, HttpOnly/SameSite session cookie, protected workspace endpoints, and admin authorization. Session expiry is 12 hours. Sessions end on server restart; saved parcels and analyses persist in `.data-cache/server/workspace.json`. `ADMIN_PASSWORD` changes the seed password when creating a fresh workspace. `STATE_DIR`, `PORT`, and `HOST` can configure the runtime without editing code.

## Features

- Map with the 197 original parcel geometries, 138 training / 59 prediction parcels and 1301.05 declared hectares. INEGI boundaries for Hidalgo, Puebla and Tlaxcala.
- Search by ID, municipio, state, or coordinates (`latitude, longitude` or `longitude, latitude`); click parcels or clusters to inspect/zoom.
- Month pills and year selection. The 144 original monthly precipitation/Tmin/Tmax renders cover 2022–2025. Elevation and slope are the original 120 m INEGI products. The CRS and original QGIS raster extents are retained.
- **Landsat Collection 2 Level 2 NDVI**, 48 monthly composites from 2022–2025. The threshold actually masks individual raster pixels; optionally it also filters parcels by their valid-pixel mean. Missing data are never replaced with values. At up to 30 m native resolution, tiny parcels can have no valid pixel centers in a month.
- **AlphaEarth**, all 64 embedding dimensions for every parcel/year, 2017–2025. Native 10 m RGB previews are shown when zooming into parcels. A00/A01/A02 are a fixed display stretch; they do not represent vegetation health. The dataset is annual, so month buttons are disabled for this layer.
- Farmer and technical views; original satellite NDVI curves, monthly climate, all 64 AlphaEarth axes, scene provenance and exports.
- Draw a terrain polygon, save it, edit vertices, and analyze the result. Edits are stored separately and preserve original dataset boundaries. Environmental summaries on edited parcels still refer to the original boundaries, which is disclosed in the interface.
- CSV/GeoJSON and annual-vector downloads, persisted saved analyses, administrator view, desktop and mobile layouts.

## Model placeholder

**No prediction model is imported, loaded, trained, or executed.** Every estimated yield is the fixed placeholder **4.2 t/ha**, prominently labeled “Ejemplo”. The example production is simply area × 4.2. Original recorded yields are shown separately. Precision metrics and prediction explanations are pending; the technical view makes that status explicit. API analysis responses include `status: "placeholder"`, and CSV exports label example values and carry `PLACEHOLDER_SIN_INFERENCIA`.

## Data preparation with uv

The application itself is JavaScript/TypeScript and runs from its portable `public/data/` and `public/rasters/` files. Python is used only to prepare/reproduce the scientific data. Use **uv** for all Python commands. The preparation scripts use the existing system GDAL, NumPy, Pillow, PyProj, Shapely and requests environment:

```sh
uv run --no-project --python /usr/bin/python3 python scripts/export_data.py
uv run --no-project --python /usr/bin/python3 python scripts/fetch_landsat.py --years 2025 2024 2023 2022
```

`export_data.py` only reads the neighboring original dataset and writes the webapp's own output files. It preserves parcel x/y precision; simplifies only the INEGI display boundaries; and exports the original 146 QGIS raster renders. Per-parcel climate values come from the existing feature-table extraction and are matched using its row crosswalk. Sentinel-2/Planet NDVI curves use valid supplied observations with cloud cover ≤30%, monthly means and explicit missing months.

AlphaEarth means are computed after nonlinear dequantization, weighted by exact parcel/cell area fractions, then normalized to unit length. The signed int8 source uses −128 as NoData. Previews preserve the UTM 14N native raster grid and use RGB A00/A01/A02 with the fixed [−0.25,0.25] display stretch. Preview PNGs and the normalized 64-axis vectors are included for all 1,773 parcel-years.

`fetch_landsat.py` reads COG windows through the Planetary Computer catalog. It restricts scenes to **Landsat 8/9**, WRS path 026 / row 046, which covers the study area. It selects up to two scenes with the lowest scene cloud cover each month, converts red/NIR DN to reflectance using **×0.0000275 − 0.2**, and masks fill, dilated cloud, cirrus, cloud, shadow, snow and red/NIR saturation. NDVI is the monthly valid-pixel median. Parcel statistics are native 30 m pixel-center samples. The display image is averaged to a 640-pixel-wide EPSG:3857 grid; NDVI is encoded at 1e−4 precision in its R/G channels and validity in alpha. The browser decodes these values, colors them, and applies the selected inclusive threshold. Display resolution is lower than the native data, especially when zoomed closely. Native monthly GeoTIFFs remain in `.data-cache/landsat/`; scene IDs, dates, coverage and PNG SHA-256 values are in `public/data/landsat.json`.

The satellite/street basemaps use external Esri/OpenStreetMap tiles and need internet. Parcel geometry, climate/terrain, AlphaEarth and NDVI layers are served locally. A lost basemap connection does not remove the local scientific layers or parcel boundaries. Data preparation uses live public endpoints only when regenerating missing Landsat months.

## Verification

```sh
npm run build
npm test
npm run test:e2e
```

Unit/integration checks cover all 197 parcel records, all 146 climate/terrain renders, all 1,773 embedding vectors/previews, 48 Landsat 8/9 composites, exact threshold/no-data behavior, filters/coordinate order, safe boundary overrides, CSV placeholder labels, geometry validity, authentication/admin authorization, and persisted placeholder results.

Playwright exercises actual browser login, search, month changes, decoded raster thresholding, annual AlphaEarth pixels, technical curves, placeholder analysis, drawing/editing/persistence, admin/logout and mobile overflow. It starts an isolated server on 8081 with its own temporary workspace so the demo user's saved data are not modified. Screenshots are saved under `test-results/`. Install Chromium with `npx playwright install chromium` when needed, or set `CHROMIUM_PATH` to an existing installation. `node scripts/inspect.mjs` captures the actual app at port 8080 into `/tmp/agrocebada-preview/`.

## Sources and credits

- User ideas: `/home/rd/.codex/attachments/068a4c91-326e-431d-97b7-d835e07601e0/pasted-text-1.txt`.
- [React Material Admin reference](https://flatlogic.com/templates/react-material-admin-full/demo). No commercial template source was copied.
- FIRA Reto AgroCebada 2026 original shapefile/CSV/climate delivery and QGIS project, with source checksums in `public/data/provenance.json`.
- [INEGI Marco Geoestadístico](https://www.inegi.org.mx/servicios/catalogounico.html).
- [Google/Google DeepMind AlphaEarth encoding and source documentation](https://developers.google.com/earth-engine/guides/aef_on_gcs_readme), CC BY 4.0; regional subsets/previews are derivatives with out-of-parcel pixels masked.
- [Microsoft Planetary Computer Landsat C2 L2](https://planetarycomputer.microsoft.com/dataset/landsat-c2-l2) / USGS; [NDVI definition](https://www.usgs.gov/landsat-missions/landsat-normalized-difference-vegetation-index).
- QGIS/qgis2web original climate/terrain rendering, OpenLayers map engine, Material UI, Lucide icons, Inter and Manrope fonts.
