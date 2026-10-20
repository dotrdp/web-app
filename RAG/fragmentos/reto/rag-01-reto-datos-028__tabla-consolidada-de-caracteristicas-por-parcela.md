@id: rag-01-reto-datos-028
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Tabla consolidada de características por parcela
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem columnas consolidada tabla caracteristicas dataset parcela satelitales sensor aaaa-mm aaaa-mm-dd agro aparte archivos area audit basico calidad celda cero clima cobertura dato disponible ellas estadistico
@fuente: dataset__DATASET_RETO_AGRO_2026__plot_features__README.md; modelado__ORIGINAL_FIRA_AUDIT.md.
# Tabla consolidada de características por parcela

La tabla consolidada tiene 197 filas y 69,318 columnas: AREA_HA, RENDIMIENTO_T_HA y 69,316 columnas de medición. De ellas, 68,732 son índices satelitales por sensor y fecha (nombres sat__{sensor}__{AAAA-MM-DD}__{índice}), y 584 son de clima y terreno (raster__{variable}__{AAAA-MM}__{estadístico}). Las columnas de
metadatos (IDs, geometría, municipio, estado, partición) y las de calidad (presencia, nubosidad y cobertura) se guardaron en archivos aparte: row_metadata.csv y row_quality.csv. Son 155,470 observaciones satelitales en total (107,666 del Básico y 47,804 de PRO). Una celda vacía significa dato no disponible, no cero.

Fuente: dataset__DATASET_RETO_AGRO_2026__plot_features__README.md; modelado__ORIGINAL_FIRA_AUDIT.md.
