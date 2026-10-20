---
id: rag-20-datos-mcp
titulo: Datos estructurados del proyecto y su consulta con el servidor MCP agrocebada
categoria: datos
etiquetas: [datos, mcp, sqlite, sql, parcelas, sentinel-2, landsat, planet, hls, alphaearth, chirps, siap, herramientas]
idioma: es
fecha: 2026-10-18
fuentes_internas: [datos/agrocebada.sqlite, mcp/servidor_agrocebada.py, 01_reto_agrocebada_y_datos.md, 14_clima_y_riesgo_climatico_altiplano.md, 17_medicion_del_rendimiento_y_estadistica_agricola.md]
fuentes_externas: [Zepeda Villarreal, E. A., López-Ridaura, S. y Sonder, K. Municipal Agricultural Production Database (Mexico, 2003–2024): SIACON–SIAP Harmonized Dataset, Figshare v3, DOI 10.6084/m9.figshare.32065674.v3; Google, AlphaEarth Foundations Satellite Embedding V1; NASA, Harmonized Landsat Sentinel-2 (HLS)
v2.0; CHIRPS y CHIRTS-ERA5 (Climate Hazards Center); INEGI, Continuo de Elevaciones Mexicano 4]
---

Resumen

El RAG incluye una base de datos SQLite de solo lectura, `datos/agrocebada.sqlite`, con los datasets oficiales del reto y los que obtuvo el proyecto, y un servidor MCP, `mcp/servidor_agrocebada.py`, que expone siete herramientas: dos para buscar en el RAG y cinco para consultar datos. El texto del RAG explica qué
significan las cifras; la base de datos permite calcularlas. Las tablas no contienen predicciones de modelos, resultados de modelos ni particiones de evaluación, y las 59 parcelas de PREDICCION no tienen rendimiento.

## Qué datos hay y para qué sirve cada tabla

La base tiene once tablas. Datos oficiales del reto: `parcelas` (197 parcelas con área, rendimiento de las 138 de ENTRENAMIENTO, municipio, estado, centroide y polígono), `obs_basico` (107,666 observaciones de Sentinel-2 y Landsat, 2022–2025), `obs_pro` (47,804 observaciones de Planet en 2025), `clima_mensual`
(precipitación y temperatura mensuales por parcela, 2022–2025) y `terreno` (elevación y pendiente). Datos obtenidos por el proyecto: `alphaearth_anual` (embeddings anuales 2017–2025), `hls_2025` (reflectancia HLS por fecha), `rasgos_hls_2025` (rasgos de temporada de un experimento propio) y `siap_municipal`
(estadística municipal de cebada grano de temporal, 2003–2024). Tablas de apoyo: `catalogo_tablas`, `diccionario_columnas`, `documentos_oficiales` (texto de la descripción oficial y del diccionario de índices) y `catalogo_fuentes` (rasters y escenas que no están tabulados, con su ruta).

Fuente: datos/agrocebada.sqlite, tabla catalogo_tablas.

## Herramientas del servidor MCP

El servidor `agrocebada` funciona por stdio y no necesita paquetes externos. Herramientas: `rag_buscar` (regex con tgrep; ámbito «indices», «temas», «fragmentos» o «todo»), `rag_leer_fragmento` (texto de un fragmento por su @id), `datos_listar_tablas`, `datos_describir_tabla` (columnas, significado, advertencias y
ejemplo), `datos_consultar_sql` (SELECT o WITH, hasta 500 filas y 10 s), `datos_parcela` (ficha de una parcela) y `datos_serie_temporal` (serie de una variable por parcela). La base se abre en modo de solo lectura y un autorizador de SQLite rechaza cualquier escritura, así que el agente no puede modificar los datos.
Flujo recomendado: buscar el concepto en el RAG, describir la tabla, consultar con agregados y citar tanto el @id como la tabla usada.

Fuente: mcp/servidor_agrocebada.py; mcp/LEEME.md.

## Tabla parcelas: etiquetas, área y ubicación

`parcelas` tiene una fila por parcela, de AGC_001 a AGC_197. Las 197 parcelas están en nueve municipios: Chignahuapan, Puebla (100); Calpulalpan, Tlaxcala (44); Singuilucan (23), Almoloya (14), Cuautepec de Hinojosa (9), Emiliano Zapata (3), Apan (1) y Tepeapulco (1), Hidalgo; y Nanacamilpa de Mariano Arista, Tlaxcala
(2). Por estado, las 138 de ENTRENAMIENTO dan medias de 4.477 t/ha en Puebla (71), 3.762 en Hidalgo (36) y 2.984 en Tlaxcala (31). La columna `cultivo` mezcla «Cebada» y «CEBADA» tal como viene en el shapefile oficial. La tabla no registra la variedad (Doña Josefa de 6 hileras o Voyager de 2 hileras), ni manejo, ni
suelo.

Fuente: datos/agrocebada.sqlite, tabla parcelas (cálculo propio con datos oficiales).

## Tablas obs_basico y obs_pro: índices satelitales oficiales

`obs_basico` trae, por parcela y fecha, estadísticos (promedio, std, max, min) de 22 índices de Sentinel-2 (59,040 filas) y del índice espectral-térmico VI6T de Landsat (48,626 filas, sin NDVI). `obs_pro` trae NDVI, EVI, LAI y MSAVI de Planet en 2025 (47,804 filas). La columna `fecha` es la fecha ISO derivada de
`fecha_captura`. El diccionario oficial advierte que los índices de Planet y los de Sentinel-2 provienen de fuentes distintas y no deben fusionarse como si fueran la misma medición. Filtra por `porcentaje_nubosidad`: de las filas de Sentinel-2, 39,442 tienen nubosidad de 10 % o menos.

Fuente: Diccionario de índices satelitales (oficial), tabla documentos_oficiales; conteos sobre obs_basico.

## Tabla clima_mensual: precipitación y temperatura

`clima_mensual` tiene 9,456 filas (197 parcelas × 48 meses, 2022-01 a 2025-12) con la media de cada raster oficial sobre la parcela: `precip_mm_mes` de CHIRPS y `tmin_c`/`tmax_c` de CHIRTS-ERA5 (medias mensuales de la mínima y la máxima diarias). La resolución es de 0.05° (unos 5 km), mayor que cualquier parcela, así
que parcelas vecinas comparten valor. Los promedios de precipitación anual del conjunto fueron de unos 609 mm en 2022, 668 en 2023, 1,006 en 2024 y 1,054 en 2025 (media de parcelas). Con datos mensuales no se cuentan días de helada ni lluvia diaria; las temperaturas son de un producto en malla, no de estación, y sus
valores absolutos deben contrastarse con estaciones del SMN.

Fuente: LEEME de los rasters oficiales de temperatura y CHIRPS; datos/agrocebada.sqlite, tabla clima_mensual (cálculo propio).

## Tabla alphaearth_anual: embeddings de 64 dimensiones

`alphaearth_anual` tiene 1,773 filas: un vector de 64 dimensiones (a00–a63) por parcela y año, de 2017 a 2025, obtenido de AlphaEarth Foundations Satellite Embedding V1 a 10 m. El proyecto descargó los rasters de las 197 parcelas y los resumió como indica su documentación: descuantización con signo·(x/127.5)², media
ponderada por la fracción de área de cada píxel dentro de la parcela y normalización a norma 1. Las dimensiones no tienen significado físico individual: se usan para comparar parcelas o años (por ejemplo, similitud coseno) o como entrada de un modelo, no para interpretar «la dimensión a17». En 9 filas la malla del año
no coincide con la máscara de área y se usó media simple (`ponderado_por_area = 0`).

Fuente: dataset/alphaearth/README.md del proyecto; datos/agrocebada.sqlite, tabla alphaearth_anual.

## Tablas hls_2025 y rasgos_hls_2025

`hls_2025` tiene 26,805 filas de reflectancia HLS v2.0 (L30 de Landsat y S30 de Sentinel-2, 30 m) por parcela y fecha, del 5 de enero al 28 de octubre de 2025; 12,354 tienen más de la mitad de la parcela despejada, y las bandas son NULL cuando no hay píxeles despejados. `rasgos_hls_2025` resume la temporada 2025 de
cada parcela con rasgos de un experimento propio: fAPAR estimado por inversión de PROSAIL con una hoja tipo cebada (`apar_dj`), NDVI medio, LAI y clorofila estimados, bandas medias y sus versiones en el llenado de grano (15 de agosto a 27 de octubre). Son rasgos de experimento, no datos oficiales, y en nuestros
experimentos no mejoraron el error frente a usar solo el área.

Fuente: spatial_regression/README.md del proyecto (método); datos/agrocebada.sqlite, tablas hls_2025 y rasgos_hls_2025.

## Tabla siap_municipal: estadística oficial por municipio

`siap_municipal` tiene 1,838 filas de cebada grano de temporal en 95 municipios de Hidalgo, Puebla y Tlaxcala, por año agrícola y ciclo, de 2003 a 2024. Viene del SIACON del SIAP, a través de la base armonizada de Zepeda Villarreal, López-Ridaura y Sonder (CIMMYT, Figshare v3, licencia CC BY 4.0). El rendimiento es
producción entre superficie cosechada del municipio: un agregado, no una medición de parcela. En el ciclo Primavera-Verano 2015–2024, el rendimiento agregado fue de 2.06 t/ha en Hidalgo, 2.98 en Puebla y 2.47 en Tlaxcala. En los nueve municipios del reto quedó entre 2.26 y 2.79 t/ha, por debajo de la media de las
etiquetas de esas parcelas (3.0 a 4.6 t/ha según el municipio).

Fuente: Zepeda Villarreal, López-Ridaura y Sonder, DOI 10.6084/m9.figshare.32065674.v3; datos/agrocebada.sqlite, tabla siap_municipal (cálculo propio).

## Etiquetas por encima del rendimiento municipal: cómo interpretarlo

Que las etiquetas del reto superen el rendimiento municipal del SIAP no indica por sí solo un error. Hay al menos tres explicaciones compatibles: las parcelas del reto pueden no ser una muestra representativa del municipio (por ejemplo, productores con mejor manejo o acceso a contrato), el SIAP divide entre superficie
cosechada de todo el municipio e incluye parcelas con bajo rendimiento, y las etiquetas tienen su propio método de medición, desconocido, con 45 de 138 valores exactos en la rejilla de 0.5 t/ha. Ninguna de estas explicaciones está demostrada con los datos disponibles. Lo correcto en una reseña es señalar la diferencia
y no usar el rendimiento municipal como etiqueta de la parcela.

Fuente: Interpretación propia a partir de siap_municipal y parcelas; rag-17-medicion-rendimiento (rendimiento parcelario frente a municipal; redondeo de etiquetas).

## Datos obtenidos que no están tabulados

`catalogo_fuentes` lista los datasets del proyecto que quedaron fuera de la base por ser rasters o escenas, con su ruta en fira2026: los 1,773 GeoTIFF de AlphaEarth y sus máscaras de área, los rasters oficiales de CHIRPS, temperatura y topografía INEGI CEM 4, el shapefile y el proyecto QGIS, el manifiesto de escenas
HLS de la segmentación de agua y anomalías, el Sentinel-2 recalculado y las ventanas CHIRPS v3 de los experimentos profundos, las series Sentinel-2 y Granite 2016–2024 de los modelos fundacionales, y los embeddings TESSERA 2024 y 2025. Para preguntas sobre esos datos, el agente debe citar la ruta y la tabla resumida
que corresponda, y no inventar valores por píxel.

Fuente: datos/agrocebada.sqlite, tabla catalogo_fuentes.

## Recetas de SQL frecuentes

Rendimiento por municipio: `SELECT municipio, count(rendimiento_t_ha) n, round(avg(rendimiento_t_ha),3) media FROM parcelas GROUP BY municipio`. NDVI máximo de 2025 por parcela con Sentinel-2 despejado: `SELECT id_poligono, max(ndvi_promedio) FROM obs_basico WHERE sensor='Sentinel-2' AND fecha LIKE '2025%' AND
porcentaje_nubosidad <= 10 GROUP BY id_poligono`. Lluvia de la temporada por parcela: `SELECT id_poligono, sum(precip_mm_mes) FROM clima_mensual WHERE mes BETWEEN '2025-05' AND '2025-10' GROUP BY id_poligono`. Unir con etiquetas: `JOIN parcelas USING (id_poligono)` y filtrar `rendimiento_t_ha IS NOT NULL`. Serie del
SIAP de un municipio: `SELECT anio, rendimiento_t_ha FROM siap_municipal WHERE municipio='Chignahuapan' AND ciclo='Primavera-Verano' ORDER BY anio`.

Fuente: datos/agrocebada.sqlite (consultas verificadas con el servidor MCP).

## Reglas para analizar con los datos

Una correlación calculada con 138 parcelas es exploratoria: reporta n, el intervalo o al menos el signo y la magnitud, y no la presentes como causa. No compares cifras de error entre protocolos distintos; las cifras de desempeño del proyecto son de validación cruzada sobre las 138 parcelas y están en el texto del RAG,
no en la base. No uses las 59 parcelas de PREDICCION para calcular métricas de rendimiento, porque no tienen etiqueta. No mezcles índices de Planet con los de Sentinel-2 como si fueran la misma variable. Recuerda que el reto no da la variedad, el manejo ni el suelo por parcela, y que una plaga puede propagarse sin que
el satélite la perciba, así que la falta de anomalía en los índices no prueba ausencia de daño.

Fuente: rag-10-validacion; rag-06-plagas-danos; documentos_oficiales; AGENTS.md.

## Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** "El rendimiento del SIAP del municipio es el rendimiento de la parcela." → **Corrección:** Es producción entre superficie cosechada de todo el municipio. En los municipios del reto, 2015–2024, quedó entre 2.26 y 2.79 t/ha, por debajo de las etiquetas.
- **Afirmación errónea:** "La base de datos trae el rendimiento de las 59 parcelas de predicción." → **Corrección:** `rendimiento_t_ha` es NULL en las 59 parcelas de PREDICCION; no hay etiquetas ocultas en la base.
- **Afirmación errónea:** "El NDVI de Planet y el de Sentinel-2 son la misma variable y se pueden promediar." → **Corrección:** El diccionario oficial indica que vienen de fuentes distintas y no deben fusionarse automáticamente.
- **Afirmación errónea:** "La dimensión a17 de AlphaEarth mide la humedad del suelo." → **Corrección:** Las dimensiones del embedding no tienen significado físico individual.
- **Afirmación errónea:** "Landsat del dataset Básico trae NDVI." → **Corrección:** En el Básico, las filas de Landsat solo traen VI6T; el NDVI es de Sentinel-2.
- **Afirmación errónea:** "clima_mensual da la temperatura de cada parcela medida en campo." → **Corrección:** Es la media de una malla de unos 5 km (CHIRTS-ERA5 y CHIRPS); parcelas vecinas comparten valor.

## Preguntas y respuestas

**P:** ¿Qué tablas de datos tiene el RAG?
**R:** Once: parcelas, obs_basico, obs_pro, clima_mensual, terreno, alphaearth_anual, hls_2025, rasgos_hls_2025, siap_municipal, documentos_oficiales y catalogo_fuentes, además de catalogo_tablas y diccionario_columnas. Usa la herramienta datos_listar_tablas.

**P:** ¿Cómo consulta el agente los datos?
**R:** Con el servidor MCP agrocebada: datos_describir_tabla para ver columnas y advertencias, y datos_consultar_sql para consultas SELECT de solo lectura (hasta 500 filas y 10 s).

**P:** ¿Cuál es el rendimiento medio de las etiquetas por estado?
**R:** Puebla 4.477 t/ha (71 parcelas), Hidalgo 3.762 (36) y Tlaxcala 2.984 (31), sobre las 138 de ENTRENAMIENTO.

**P:** ¿En cuántos municipios están las parcelas?
**R:** En nueve; Chignahuapan, Puebla, concentra 100 de las 197 y Calpulalpan, Tlaxcala, 44.

**P:** ¿De dónde salen los datos del SIAP?
**R:** Del SIACON del SIAP, mediante la base armonizada de Zepeda Villarreal, López-Ridaura y Sonder (CIMMYT), Figshare v3, DOI 10.6084/m9.figshare.32065674.v3, licencia CC BY 4.0.

**P:** ¿Qué años cubre AlphaEarth en la base?
**R:** De 2017 a 2025, las 197 parcelas en cada año (1,773 filas).

**P:** ¿Hay predicciones o resultados de modelos en la base?
**R:** No. La base solo tiene datos de entrada, etiquetas oficiales y estadística externa. Las cifras de desempeño del proyecto están en el texto del RAG.

**P:** ¿Puede el agente modificar los datos?
**R:** No. La base se abre en modo de solo lectura y el servidor rechaza cualquier sentencia que no sea de lectura.
