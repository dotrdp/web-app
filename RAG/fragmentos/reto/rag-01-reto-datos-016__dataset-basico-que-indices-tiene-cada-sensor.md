@id: rag-01-reto-datos-016
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Dataset Básico: qué índices tiene cada sensor
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem indices basico dataset filas landsat sensor tiene vi6t abreviaturas algunos aparecen aporta audit bases cero combinarse datos deben definicion diccionario docs dswi2 dswi3 dswi4
@fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md; Diccionario_de_indices_satelitales.txt.
# Dataset Básico: qué índices tiene cada sensor

Los 23 índices del Dataset Básico son ndvi, evi, crc, mcrc, ndsvi, srndi, mra, lai, fapar, savi, vi6t, ndti, sti, ndwi, endwi, msi, emsi, dswi2, dswi3, dswi4, dswi5, nddi y enddi. Landsat aporta solo VI6T; los otros 22 aparecen en filas de Sentinel-2. Las filas de Landsat no deben combinarse con las de Sentinel-2 como
si fueran mediciones equivalentes. Las filas de Sentinel-2 sin datos de un índice son vacías, no cero. Los nombres de algunos índices, como MRA, son abreviaturas del proveedor sin definición pública en las bases.

Fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md; Diccionario_de_indices_satelitales.txt.
