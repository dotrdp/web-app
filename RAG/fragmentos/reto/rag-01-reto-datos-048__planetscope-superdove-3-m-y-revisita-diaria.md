@id: rag-01-reto-datos-048
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: PlanetScope (SuperDove): 3 m y revisita diaria
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem nasa superdove frontiers planetscope articulo bandas constelacion diaria earthdata https remote resolucion revisita sensing anos articles calibracion captar cientos coinciden comparar consulto cubre dataset
@fuente: [BASES_oficiales_Reto_AgroCebada.txt, DESCRIPCION_oficial_dataset.txt, Descripcion_general_variables_DataSet.txt, Diccionario_de_indices_satelitales.txt, HECHOS_CALCULADOS_dataset_oficial.md, modelado__ORIGINAL_FIRA_AUDIT.md, modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md, modelado__DATASET.md,
# PlanetScope (SuperDove): 3 m y revisita diaria

PlanetScope, con la constelación Dove y SuperDove, toma imágenes de unos 3 m de resolución. NASA indica que la constelación puede captar toda la superficie terrestre cada día con 3 m por píxel. Un artículo de 2025 en Frontiers in Remote Sensing describe SuperDove con ocho bandas a 3 m. Las fuentes no coinciden en el
tamaño de escena: NASA da unos 20 × 12 km, y el artículo de Frontiers unos 32.5 × 19.6 km. La especificación oficial de Planet no se consultó en esta ronda. En el reto, Planet solo cubre 2025 (Dataset PRO) y no tiene historia de 2022 a 2024, así que no sirve para comparar años. Para parcelas de 0.35 a 64 ha, la
resolución de 3 m da cientos a miles de píxeles por parcela, pero las bandas y la calibración de Planet no son equivalentes a las de Sentinel-2 y no deben fusionarse como mediciones iguales. Fuente: NASA Earthdata, https://www.earthdata.nasa.gov/es/node/12638; Frontiers in Remote Sensing 2025,
https://www.frontiersin.org/journals/remote-sensing/articles/10.3389/frsen.2025.1624783/pdf.
