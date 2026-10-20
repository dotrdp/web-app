@id: rag-01-reto-datos-069
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Errores frecuentes y cómo detectarlos
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem afirmacion correccion erronea parcelas tienen rendimiento tiene variables cebada dias documentacion fira grano hasta parcela resolucion revisita satelite siap superficie variedad agera5 capas celda
@fuente: [BASES_oficiales_Reto_AgroCebada.txt, DESCRIPCION_oficial_dataset.txt, Descripcion_general_variables_DataSet.txt, Diccionario_de_indices_satelitales.txt, HECHOS_CALCULADOS_dataset_oficial.md, modelado__ORIGINAL_FIRA_AUDIT.md, modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md, modelado__DATASET.md,
# Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** Las 197 parcelas tienen rendimiento medido en campo. → **Corrección:** Las bases y las auditorías no documentan el método; solo 138 tienen valor visible y 59 están ocultas. Revisar la sección de procedencia del rendimiento.
- **Afirmación errónea:** La resolución del terreno es de 15 m porque lo dice la descripción oficial. → **Corrección:** Los rasters entregados tienen 120 m (2,900 × 3,362 píxeles en EPSG:6372). Usar la resolución del archivo real.
- **Afirmación errónea:** Planet y Sentinel-2 tienen el mismo NDVI porque el nombre es igual. → **Corrección:** Los valores provienen de fuentes distintas y no deben fusionarse; conservar el sensor en el identificador.
- **Afirmación errónea:** Las temperaturas mensuales son la máxima y la mínima del mes. → **Corrección:** Son promedios mensuales de las temperaturas diarias mínimas y máximas, en °C.
- **Afirmación errónea:** Un valor de 0 en un índice es una medición real de cero. → **Corrección:** Una celda vacía es dato no disponible; el cero debe confirmarse en la fila, ya que las filas de 100 % de nubes no tienen NDVI.
- **Afirmación errónea:** Unir shapefile y CSV por posición de fila es correcto. → **Corrección:** El orden difiere; unir por ID_POLIGON con ID_POLIGONO.
- **Afirmación errónea:** La media municipal de SIAP sirve como etiqueta de cada parcela. → **Corrección:** Las estadísticas municipales no coinciden con las etiquetas de las parcelas (Spearman −0.30, n = 8); no sustituyen el rendimiento parcelario.
- **Afirmación errónea:** El total de 1,032,892 observaciones son parcelas de cebada. → **Corrección:** Son observaciones multicultivo y de temporal de varias fuentes; solo 3,437 son municipios × año de cebada en México y 197 son parcelas FIRA.
- **Afirmación errónea:** AgERA5 tiene 27 variables meteorológicas en su versión 2. → **Corrección:** La documentación de CDS y ECMWF describe unas 22 variables; la cifra de 27 del proyecto debe justificarse por variables derivadas.
- **Afirmación errónea:** El CEM 4.0 tiene 15 m de resolución y por eso la pendiente del reto es de 15 m. → **Corrección:** El 15 m documentado por INEGI corresponde al CEM 3.0; no se encontró documentación de la versión 4.0. Las capas entregadas son de 120 m.
- **Afirmación errónea:** CHIRPS mide la lluvia en cada parcela como un pluviómetro de 5 km. → **Corrección:** CHIRPS es una malla de 0.05° que combina satélite y estaciones; una celda cubre unos 29 km² en esta latitud y no es una medición puntual.
- **Afirmación errónea:** Sentinel-2 revisita cada 5 días con cada satélite. → **Corrección:** La revisita combinada de 2A y 2B es de unos 5 días; cada satélite por separado revisita cada 10 días.
- **Afirmación errónea:** Las 197 parcelas del reto tienen variedad conocida o no tienen variedad. → **Corrección:** Se confirmó que las parcelas se reparten entre Doña Josefa (6 hileras) y Voyager (2 hileras); el dataset no indica cuál variedad tiene cada parcela.

- **Afirmación errónea:** AlphaEarth no tiene capa de 2025. → **Corrección:** el proyecto descargó y validó capas de 2017 a 2025 (1,773 rasters para 197 parcelas); la página del catálogo consultada mostraba metadatos hasta 2024, por lo que conviene citar la fecha de descarga.
- **Afirmación errónea:** Las Reglas de Operación del DOF de diciembre de 2025 son un documento exclusivo de FIRA. → **Corrección:** la nota del DOF del 1 de diciembre de 2025 cubre apoyos de varios sectores y menciona a los fideicomisos de FIRA como fuente de recursos.
- **Afirmación errónea:** AgERA5 v2 tiene 27 variables diarias. → **Corrección:** no hay total confirmado; la página del CDS lista 16 variables principales y la documentación de ECMWF cita unas 22.

- **Afirmación errónea:** El Censo 2022 da 1.55 t/ha de rendimiento de cebada en Hidalgo. → **Corrección:** Es producción entre superficie sembrada; no es el rendimiento por superficie cosechada de SIAP.
- **Afirmación errónea:** El boletín de SIAP para Hidalgo 2022 estima la superficie de cebada. → **Corrección:** Estima maíz grano, sorgo grano, frijol y trigo grano con 556 parcelas y 10 imágenes SPOT.
- **Afirmación errónea:** Solórzano et al. (2020) dan el porcentaje de escenas Sentinel-2 válidas de junio a octubre en México. → **Corrección:** El resumen da conteos por píxel (hasta 121 al año; hasta 6.58 al mes); el porcentaje no se leyó.
