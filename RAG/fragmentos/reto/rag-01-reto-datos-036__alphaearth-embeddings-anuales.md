@id: rag-01-reto-datos-036
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: AlphaEarth: embeddings anuales
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem google alphaearth catalogo embedding cobertura embeddings satellite antes anuales area bandas dataset earth engine foundations nodata parcela proyecto rasters verificado annual anual aplicar atribucion capa
@fuente: dataset__alphaearth__README.md; referencia externa https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL.
# AlphaEarth: embeddings anuales

AlphaEarth Foundations Satellite Embedding V1 es un producto anual de embeddings de 64 bandas (A00–A63) a 10 m (verificado en el catálogo de Google Earth Engine). El proyecto descargó 1,773 rasters, una por parcela y año de 2017 a 2025, con cobertura válida de 100 % del área de cada parcela; los rasters están en
EPSG:32614 y el nodata es −128 en int8. Las bandas no son
reflectancias interpretables; para obtener el embedding hay que enmascarar nodata y aplicar la transformación del proveedor, sign(x)·(x/127.5)², antes de promediar con ponderación por área. La licencia es CC BY 4.0, con la atribución «The AlphaEarth Foundations Satellite Embedding dataset is produced by Google and
Google DeepMind» (verificado en la ficha del catálogo de Google Earth Engine en la ronda 3). El catálogo indica una cobertura de 2017 a 2024: la fecha final de los metadatos, 2025-01-01, es exclusiva, y una nota de IEEE Spectrum coincide. La cobertura «2017 a 2025» del proyecto no se confirma en el catálogo; debe
revisarse la capa de 2025 antes de citarla.

Fuente: dataset__alphaearth__README.md; referencia externa https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL.
