@id: rag-01-reto-datos-015
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Dataset Básico: sensores y estructura
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem basico dataset fechas landsat captura columnas estructura fecha filas sensor sensores archivo audit clave columna combinacion conservan contiene cuatro descripcion distintas docs estadisticos fira
@fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (tabla de BASICO); DESCRIPCION_oficial_dataset.txt (sección 2).
# Dataset Básico: sensores y estructura

El Dataset Básico contiene observaciones de Sentinel-2 y Landsat para 2022–2025, en un archivo de 107,666 filas y 96 columnas. Hay 59,040 filas de Sentinel-2 (301 fechas de captura distintas) y 48,626 de Landsat (392 fechas, de 2022-01-05 a 2025-12-31). La clave única es la combinación de ID_POLIGONO, sensor y
fecha_captura. Las fechas vienen en formato día/mes/año. Las columnas son tres de identificación (ID, sensor, fecha), 23 índices con cuatro estadísticos por parcela (_promedio, _std, _max, _min) y la columna porcentaje_nubosidad. Sentinel-2 y Landsat se conservan como registros separados.

Fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (tabla de BASICO); DESCRIPCION_oficial_dataset.txt (sección 2).
