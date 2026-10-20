@id: rag-01-reto-datos-051
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: AlphaEarth Satellite Embedding: qué representa cada banda
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem alphaearth embedding google satellite arxiv annual modelo banda benchmark https representa agricolas antes articulo bandas basado brown catalog catalogo cita contexto cosecha datasets datos decodificar
@fuente: [BASES_oficiales_Reto_AgroCebada.txt, DESCRIPCION_oficial_dataset.txt, Descripcion_general_variables_DataSet.txt, Diccionario_de_indices_satelitales.txt, HECHOS_CALCULADOS_dataset_oficial.md, modelado__ORIGINAL_FIRA_AUDIT.md, modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md, modelado__DATASET.md,
# AlphaEarth Satellite Embedding: qué representa cada banda

El Satellite Embedding V1 Annual de Google, basado en AlphaEarth Foundations, entrega un vector de 64 valores (A00 a A63) por píxel de 10 m y por año. Según el benchmark arXiv 2601.00857, que cita a Brown et al. (2025), el modelo se entrenó con datos de Landsat 8/9, Sentinel-2, Sentinel-1 (radar), GEDI (LiDAR),
ERA5-Land, GRACE, el modelo de elevación GLO-30 y texto de Wikipedia. Las bandas no son reflectancias: son embeddings latentes que hay que decodificar antes de promediar, y el catálogo indica que se publican en una versión de modelo distinta a la evaluada en el artículo original. Un benchmark de 2026 (arXiv 2601.00857)
evalúa AlphaEarth en tareas agrícolas posteriores; en esta ronda solo se leyó el resumen, por lo que sus resultados numéricos no se incluyen. Para el reto, AlphaEarth es un predictor de contexto del terreno y del uso del suelo, no una medición de la cosecha. Fuente: Google Earth Engine,
GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL, https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL; arXiv 2601.00857, https://arxiv.org/pdf/2601.00857.
