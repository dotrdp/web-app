---
id: rag-01-reto-datos
titulo: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
categoria: reto
etiquetas: [reto agrocebada, fira 2026, rendimiento cebada, hidalgo puebla tlaxcala, dataset parcelas, sentinel-2, planet, chirps, chirts-era5, topografia cem]
idioma: es
fecha: 2026-10-18
fuentes_internas: [BASES_oficiales_Reto_AgroCebada.txt, DESCRIPCION_oficial_dataset.txt, Descripcion_general_variables_DataSet.txt, Diccionario_de_indices_satelitales.txt, HECHOS_CALCULADOS_dataset_oficial.md, modelado__ORIGINAL_FIRA_AUDIT.md, modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md, modelado__DATASET.md,
iterate_20261017__research__A4_data_access.md, dataset__alphaearth__README.md, dataset__qgis__README.md, dataset__DATASET_RETO_AGRO_2026__plot_features__README.md, plots__README.md, literature_review__report__sections__02_reto_corpus.typ.txt, literature_review__report__sections__04_datos.typ.txt]
fuentes_externas: [https://www.chc.ucsb.edu/data/chirts-era5, https://www.chc.ucsb.edu/data/chirps, https://www.gob.mx/fira/acciones-y-programas/conoce-acerca-de-fira, https://doi.org/10.15780/G2F08J, https://doi.org/10.1038/sdata.2015.66, https://doi.org/10.1038/s41597-020-00643-7, Verdin, A., Funk, C., Peterson, P.,
Landsfeld, M., Tuholske, C. y Grace, K. (2020). Development and validation of the CHIRTS-daily quasi-global high-resolution daily temperature data set. Scientific Data 7, 303, https://doi.org/10.1038/s41597-020-00643-7, Rodríguez-Herrera, J. G., Amante-Orozco, A., Muñoz-Robles, C. A., Pimentel-López, J., Ruiz-Vera, V.
M. y Salvador-Osuna, E. (2025). Evaluation of precipitation data from CHIRPS images in dry and tropical (San Luis Potosi) and temperate (Mexico State) basins in Mexico. Terra Latinoamericana 43, https://doi.org/10.28940/terra.v43i.1953,
https://inegi.org.mx/contenidos/temas/relieve/continental/doc/continuo_elevaciones.pdf, https://www.earthdata.nasa.gov/sensors/msi, https://en.wikipedia.org/wiki/Sentinel-2, https://pages.cms.hu-berlin.de/EOL/geo_rs/S06_Data_acquisition.html, https://lpdaac.usgs.gov/documents/1698/HLS_User_Guide_V2.pdf,
https://www.earthdata.nasa.gov/es/node/12638, https://www.frontiersin.org/journals/remote-sensing/articles/10.3389/frsen.2025.1624783/pdf, https://arxiv.org/pdf/2607.04449, https://arxiv.org/pdf/2601.00857, https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL,
https://cds.climate.copernicus.eu/datasets/sis-agrometeorological-indicators, https://confluence.ecmwf.int/x/3FmaE, https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2023/CA_Def/CA_Def2022_Hgo.pdf, https://cienciasagricolas.inifap.gob.mx/index.php/agricolas/article/view/380,
https://www.gob.mx/cms/uploads/attachment/file/330747/Cierre_de_la_producci_n_Agropecuaria_2017.pdf, https://datamx.io/dataset/?tags=siap, https://repositorio.ausjal.org/handle/20.500.12032/165092, https://repository.uaeh.edu.mx/revistas/index.php/aactm/article/view/9118,
https://dof.gob.mx/nota_detalle.php?codigo=5774690&fecha=01/12/2025, Horn, B. K. P. (1981). Hill shading and the reflectance map. Proceedings of the IEEE, 69(1), 14-47, doi:10.1109/PROC.1981.11918, https://gdal.org/en/stable/programs/gdaldem.html,
https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL, https://cds.climate.copernicus.eu/datasets/sis-agrometeorological-indicators, https://www.gob.mx/cms/uploads/attachment/file/789519/NTGEBAP_2022.pdf, Journal of Hydrology: Regional Studies (2024),
doi:10.1016/j.ejrh.2024.102019, Journal of Hydroinformatics (2022), doi:10.2166/hydro.2022.122, Atmósfera (2020), doi:10.20937/atm.52789, https://ri.ibero.mx/bitstream/ibero/5898/1/GCJA_Art_01.pdf, Atmosphere (2025), doi:10.3390/atmos16101188, Atmosphere 12: 37 (2020), doi:10.3390/atmos12010037, Weather and Climate
Extremes (2023), doi:10.1016/j.wace.2023.100565, "SIAP, Estimación de Superficie Agrícola P-V 2022: Hidalgo, https://www.gob.mx/cms/uploads/attachment/file/829415/BOLETIN_Hidalgo_PV_2023.pdf", "INEGI, Censo Agropecuario 2022, boletines definitivos de Hidalgo y Tlaxcala (21 nov 2023),
https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2023/CA_Def/CA_Def2022_Hgo.pdf", "Solórzano, J. V., Mas, J. F., Gao, Y. y Gallardo Cruz, J. A. (2020), Revista de Teledetección 56: 103-115, doi:10.4995/raet.2020.14044, https://riunet.upv.es/handle/10251/159566", "CDS, sis-agrometeorological-indicators,
https://cds.climate.copernicus.eu/datasets/sis-agrometeorological-indicators (página leída en la ronda 4)"]
---

Resumen. El Reto AgroCebada 2026 es una convocatoria de FIRA para estimar el rendimiento de parcelas de cebada en Hidalgo, Puebla y Tlaxcala, con un modelo predictivo y una interfaz consultable. El conjunto oficial contiene 197 parcelas georreferenciadas: 138 con rendimiento visible (ENTRENAMIENTO) y 59 con rendimiento
oculto (PREDICCION), correspondientes al ciclo abril–octubre de 2025. Los insumos son series satelitales (Sentinel-2 y Landsat 2022–2025; Planet 2025), rasters mensuales de precipitación y temperatura (2022–2025) y dos rasters topográficos. Varias auditorías del proyecto señalan que el dataset no incluye fechas de
siembra, manejo ni mediciones de suelo, y que el origen de los rendimientos no está documentado.

## Antecedentes institucionales de FIRA

Los Fideicomisos Instituidos en Relación con la Agricultura (FIRA) son cuatro fondos de fomento constituidos por el Gobierno Federal, con la Secretaría de Hacienda y Crédito Público como fideicomitente y el Banco de México como fiduciario. Su fin es otorgar crédito, descuento y garantías, y fomentar capacitación,
asistencia técnica y transferencia de tecnología para la agricultura, ganadería, avicultura, agroindustria y pesca en el medio rural. Las bases citan las Reglas de Operación publicadas en el DOF el 1 de diciembre de 2025. El reto se inscribe en el apoyo de Innovación Tecnológica Industria 4.0, subcomponente
"Emprendedores Innovadores". El portal institucional oficial de FIRA es gob.mx/fira. (verificado en la ronda 2: la página oficial describe cuatro fideicomisos públicos, FONDO, FEFA, FEGA y FOPESCA; la SHCP como fideicomitente y el Banco de México como fiduciario, lo que concuerda con el párrafo anterior). Las Reglas de
Operación citadas por las bases se publicaron en el DOF del 1 de diciembre de 2025 (verificado en la ronda 3: nota «Reglas de Operación para apoyos a los sectores agropecuario, forestal, pesquero, alimentario y rural», de la Secretaría de Hacienda y Crédito Público, dof.gob.mx, nota 5774690). El texto indica que los
fideicomisos que integran FIRA (FONDO, FEFA, FEGA y FOPESCA) destinan recursos a cada apoyo. Es un conjunto de reglas para varios sectores, no un documento exclusivo de FIRA.

Fuente: BASES_oficiales_Reto_AgroCebada.txt (sección Antecedentes); referencia externa https://www.gob.mx/fira/acciones-y-programas/conoce-acerca-de-fira (leída en la ronda 2).

## Objetivo del reto

El objetivo oficial es desarrollar un modelo analítico capaz de predecir el rendimiento agrícola de parcelas de cebada en Hidalgo, Tlaxcala y Puebla, y convertirlo en una solución tecnológica funcional, como aplicación web o dashboard interactivo, que permita visualizar y consultar resultados. FIRA lo presenta como un
medio para impulsar el uso de la percepción remota en la toma de decisiones del sector agroalimentario, con miras a la productividad, la eficiencia y el desarrollo sostenible. Las bases solicitan explícitamente dos cosas: un modelo predictivo y una interfaz, y ambas se evalúan.

Fuente: BASES_oficiales_Reto_AgroCebada.txt (secciones Objetivo del reto y Contexto – Justificación).

## Estructura en dos etapas

La primera etapa consiste en desarrollar el modelo y la aplicación o interfaz web. Los tres equipos con mayor puntaje pasan como finalistas. La segunda etapa es una presentación de máximo 15 minutos ante un jurado, cuyo objetivo es valorar la comunicación de resultados, el dominio de herramientas, la interpretación de
valores, la relación con un problema de política pública (por ejemplo, la inclusión financiera en el sector rural) y la viabilidad de las propuestas. Si hay empate técnico numérico, el jurado puede decidir con base en la calidad de la presentación.

Fuente: BASES_oficiales_Reto_AgroCebada.txt (secciones Estructura del reto y Criterios de evaluación, Etapa 2).

## Criterios de evaluación de la primera etapa

La primera etapa se califica con dos criterios. El primero, con 70 %, es el desempeño predictivo y la justificación técnica: cercanía de las predicciones a los valores reales mediante métricas objetivas (RMSE, MAE, r² u otras que defina el Comité Organizador), además de solidez metodológica y variables empleadas. El
segundo, con 30 %, es el desarrollo de la aplicación o interfaz web, es decir, su implementación práctica y su utilidad para consultar y visualizar resultados. Las bases no publican una fórmula exacta de puntuación ni los pesos de las métricas dentro del 70 %.

Fuente: BASES_oficiales_Reto_AgroCebada.txt (sección Criterios de evaluación, Etapa-1).

## Entregables de la primera etapa

El informe técnico debe subirse a la plataforma con esta estructura y extensión orientativa: Introducción (400–550 palabras), Justificación (100–200), Objetivos (200), Metodología (600–700), Resultados y discusión (800), uso de la ciencia de datos en la inclusión financiera del sector agro (300), Conclusiones (400),
Bibliografía y Anexos (máximo dos cuartillas). Además, se requiere una aplicación, interfaz web o dashboard funcional que ejecute el modelo y consulte resultados; el código fuente del modelo y de la aplicación con su documentación; un video demostrativo de máximo 5 minutos y, si existe, el enlace a la herramienta para
el jurado.

Fuente: BASES_oficiales_Reto_AgroCebada.txt (sección Criterios de evaluación, a) y b)).

## Preguntas guía y uso de inteligencia artificial

Las bases proponen tres preguntas guía: qué índice es más importante en la predicción, qué variable climática tiene mayor peso y qué combinación de variables funciona mejor. Su desarrollo y justificación suman como bonus. Las disposiciones generales permiten el uso de inteligencia artificial siempre que los equipos
indiquen dónde se usó y anexen los prompts en su escrito. Las causas de descalificación incluyen presentar información falsa o de autoría ajena, no participar en la presentación en vivo y enviar un proyecto sobre un tema distinto.

Fuente: BASES_oficiales_Reto_AgroCebada.txt (secciones Preguntas guía y Disposiciones generales).

## Elegibilidad, calendario e incentivos

Pueden participar estudiantes de licenciatura con inscripción vigente en universidades de Hidalgo, Tlaxcala y Puebla, de carreras como ciencia de datos, actuaría o afines. Los equipos tienen de 3 a 5 integrantes. Calendario oficial: publicación de la convocatoria el 19 de agosto de 2026; entrega del dataset el 14 de
septiembre de 2026; cierre de entregables el 19 de octubre de 2026 a las 23:59 h; notificación de finalistas el 3 de noviembre; presentaciones en línea el 10 de noviembre; congreso y premiación el 20 de noviembre de 2026. Incentivos por integrante: 2,884.77 UDIS (primer lugar), 1,730.86 UDIS (segundo) y 1,153.91 UDIS
(tercero), según disponibilidad presupuestal.

Fuente: BASES_oficiales_Reto_AgroCebada.txt (secciones Elegibilidad y participantes, Calendario e Incentivo).

## Región de estudio

El dataset cubre parcelas de cebada en tres estados del centro de México: Hidalgo, Puebla y Tlaxcala. Las bases no dicen explícitamente que las parcelas sean de temporal ni incluyen una variable de régimen hídrico en los archivos oficiales. El proyecto usa como supuesto de trabajo que todas las parcelas son de temporal
(secano), declaración del usuario que no aparece en las bases; cualquier análisis que dependa de ese supuesto debe declararlo. Cada parcela del shapefile tiene un campo Municipio y un campo Estado, de modo que la unidad administrativa de cada parcela es verificable.

Fuente: BASES_oficiales_Reto_AgroCebada.txt (Objetivo del reto); HECHOS_CALCULADOS_dataset_oficial.md; modelado__ORIGINAL_FIRA_INPUT_AUDIT.md (campos del shapefile).

## Las 197 parcelas y su partición

El dataset contiene 197 parcelas con identificador único desde AGC_001 hasta AGC_197. Cada una tiene área en hectáreas (de 0.35 a 64.30 ha; mediana 5.46 ha) y el campo CONJUNTO, que indica ENTRENAMIENTO (138 parcelas, con rendimiento visible en t/ha) o PREDICCION (59 parcelas, con rendimiento oculto). La partición es
aproximadamente 70/30. Las bases no describen el mecanismo con que se seleccionaron las parcelas ocultas; si fue aleatorio entre vecinas, la evaluación mide sobre todo interpolación dentro de la región, y si se reservaron municipios o campañas, la transferencia es más exigente. Ese dato no está en las fuentes.

Fuente: DESCRIPCION_oficial_dataset.txt (sección 1, Parcelas de cultivo); BASES_oficiales_Reto_AgroCebada.txt (sección Dataset); literature_review__report__sections__02_reto_corpus.typ.txt.

## Municipios y distribución por partición

Según el cálculo sobre el dataset oficial, las 197 parcelas se reparten en nueve municipios. Chignahuapan (Puebla) concentra 100 parcelas (71 de entrenamiento y 29 de predicción). Le siguen Calpulalpan (Tlaxcala) con 44 (30 y 14), Singuilucan (Hidalgo) con 23 (16 y 7), Almoloya (Hidalgo) con 14 (10 y 4), Cuautepec de
Hinojosa (Hidalgo) con 9 (5 y 4), Nanacamilpa de Mariano Arista (Tlaxcala) con 2 (1 y 1), Emiliano Zapata (Hidalgo) con 3 de entrenamiento, y Apan y Tepeapulco (Hidalgo) con 1 de entrenamiento cada una. Más de la mitad de las parcelas están en un solo municipio, lo que condiciona cualquier conclusión sobre el efecto
geográfico.

Fuente: HECHOS_CALCULADOS_dataset_oficial.md (tabla por municipio); conteos derivados por suma de las filas de esa tabla.

## Estadísticas del rendimiento de entrenamiento

Sobre las 138 parcelas de ENTRENAMIENTO con rendimiento conocido, el rendimiento (t/ha, ciclo abril–octubre 2025) tiene media de 3.955, mediana de 4.34, desviación estándar de 0.851, mínimo de 2.00 y máximo de 5.59 t/ha. La distribución está sesgada hacia valores altos: la mediana supera a la media. Estos valores son
los del archivo oficial de entrenamiento; no incluyen las 59 parcelas ocultas, cuyo rendimiento no se conoce.

Fuente: HECHOS_CALCULADOS_dataset_oficial.md (sección de rendimiento de entrenamiento); DESCRIPCION_oficial_dataset.txt.

## Estadísticas del rendimiento por municipio

La tabla oficial de hechos calculados muestra, por municipio y partición, la media de rendimiento de entrenamiento en t/ha. Chignahuapan: 71 parcelas de entrenamiento, media 4.48, desviación estándar 0.58, rango 2.15–5.59. Calpulalpan: 30 parcelas, media 3.00, desviación 0.37, rango 2.50–3.50. Singuilucan: 16 parcelas,
media 3.08, desviación 0.43, rango 2.00–3.70. Almoloya: 10 parcelas, media 4.52, desviación 0.19, rango 4.14–4.87. Cuautepec de Hinojosa: 5 parcelas, media 4.60, rango 4.40–4.79. Emiliano Zapata: 3 parcelas, media 3.50 (todas iguales). Los municipios con una sola parcela de entrenamiento (Apan, Tepeapulco y
Nanacamilpa, esta con una de predicción) no permiten estimar dispersión.

Fuente: HECHOS_CALCULADOS_dataset_oficial.md (tabla por municipio).

## Valores de rendimiento repetidos ("amontonados")

Los valores exactos más frecuentes del entrenamiento son 3.0 t/ha (19 parcelas), 3.5 (13) y 2.5 (11); les siguen 4.55 y 4.52 (5 cada uno). Exactamente sobre la rejilla de 0.5 t/ha caen 45 de 138 etiquetas (32.6 %), y sobre la rejilla de 0.1 t/ha, 58 de 138. Los valores próximos a 4.5 (4.49, 4.51, 4.52…) no son 4.5
exacto: si se redondea a 0.1 t/ha parece haber 27 parcelas en 4.5, pero es un artefacto del redondeo. La auditoría de entrada encontró que, en las cadenas del CSV, 20 valores no tienen punto decimal, 38 tienen un decimal y 80 tienen dos. Esto describe la precisión del archivo, no la del método de medición. Las fuentes
no dicen si el rendimiento es medido, reportado por el productor o estimado. Por ello, la agrupación en valores redondeados no debe leerse como evidencia de un error de medición fijo, ni como un techo predecible.

Fuente: HECHOS_CALCULADOS_dataset_oficial.md (frecuencias); modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (precisión de cadenas y ausencia de protocolo).

## Dataset Básico: sensores y estructura

El Dataset Básico contiene observaciones de Sentinel-2 y Landsat para 2022–2025, en un archivo de 107,666 filas y 96 columnas. Hay 59,040 filas de Sentinel-2 (301 fechas de captura distintas) y 48,626 de Landsat (392 fechas, de 2022-01-05 a 2025-12-31). La clave única es la combinación de ID_POLIGONO, sensor y
fecha_captura. Las fechas vienen en formato día/mes/año. Las columnas son tres de identificación (ID, sensor, fecha), 23 índices con cuatro estadísticos por parcela (_promedio, _std, _max, _min) y la columna porcentaje_nubosidad. Sentinel-2 y Landsat se conservan como registros separados.

Fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (tabla de BASICO); DESCRIPCION_oficial_dataset.txt (sección 2).

## Dataset Básico: qué índices tiene cada sensor

Los 23 índices del Dataset Básico son ndvi, evi, crc, mcrc, ndsvi, srndi, mra, lai, fapar, savi, vi6t, ndti, sti, ndwi, endwi, msi, emsi, dswi2, dswi3, dswi4, dswi5, nddi y enddi. Landsat aporta solo VI6T; los otros 22 aparecen en filas de Sentinel-2. Las filas de Landsat no deben combinarse con las de Sentinel-2 como
si fueran mediciones equivalentes. Las filas de Sentinel-2 sin datos de un índice son vacías, no cero. Los nombres de algunos índices, como MRA, son abreviaturas del proveedor sin definición pública en las bases.

Fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md; Diccionario_de_indices_satelitales.txt.

## Nubosidad y filas inválidas en el Dataset Básico

Todas las 14,163 filas de Sentinel-2 con 100 % de nubosidad carecen de NDVI; las demás filas de Sentinel-2 sí lo tienen. En Landsat, 14,521 filas tienen 100 % de nubosidad y 3,056 no tienen metadatos de nubosidad; en conjunto, 17,577 filas no tienen VI6T. Ningún índice primario numérico aparece en una fila 100 %
nublada. Además, cuatro parcelas (AGC_019, AGC_086, AGC_103 y AGC_173) tienen los cuatro estadísticos de FAPAR ausentes en observaciones de Sentinel-2 del 7 de diciembre de 2022 con nubosidad cero. Las desviaciones estándar son no negativas y se cumple min ≤ promedio ≤ max en todos los cuartetos no vacíos.

Fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (sección BASICO records and quality).

## Fechas posteriores al cierre de octubre

El Dataset Básico original incluye 3,091 filas de Sentinel-2 y 1,914 de Landsat con fecha posterior al 31 de octubre de 2025. El ciclo de rendimiento es abril–octubre de 2025, y las auditorías del proyecto excluyeron esas observaciones de cualquier representación del ciclo. Las estadísticas de noviembre y diciembre de
2025 aparecen también en las tablas climáticas anchas, con 24 columnas, y quedan fuera del corte del modelo. Usar esas fechas para predecir el rendimiento sería una fuga temporal: la información no existe para una predicción emitida antes de la cosecha.

Fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md; modelado__ORIGINAL_FIRA_AUDIT.md (corte de octubre).

## Dataset PRO: Planet 2025

El Dataset PRO contiene observaciones derivadas de Planet para 2025, con los índices NDVI, EVI, LAI y MSAVI por parcela y fecha. El proyecto documenta 47,804 observaciones PRO. Aunque NDVI, EVI y LAI tienen nombres idénticos a columnas del Dataset Básico, sus valores provienen de otra fuente y, según el diccionario
oficial, no deben fusionarse automáticamente como mediciones equivalentes. Conviene conservar la identificación del sensor en todo el análisis. Planet no tiene observaciones históricas de 2022 a 2024 en el dataset.

Fuente: Diccionario_de_indices_satelitales.txt (sección Dataset PRO); dataset__qgis__README.md (conteo PRO); modelado__ORIGINAL_FIRA_AUDIT.md (sin historial de Planet).

## Nubosidad y cobertura como variables de calidad

Las bases entregan el porcentaje de nubosidad para que cada equipo defina su criterio de filtrado y de datos faltantes. El diccionario lo trata como variable de calidad y no como índice. En el proyecto se distinguen dos cosas: la fracción de nubes de una escena y la fracción del polígono de la parcela con observación
válida. Un criterio usado en las auditorías es exigir, para Sentinel-2, al menos 50 % de área válida de la parcela, y para Planet y Landsat, el filtrado de nubes entregado de 0 a 30 %. Esos criterios son decisiones del proyecto, no de FIRA. Los datos faltantes deben seguir faltantes; no conviene rellenarlos con ceros
ni con interpolación sin declararla.

Fuente: Diccionario_de_indices_satelitales.txt (nubosidad como calidad); modelado__ORIGINAL_FIRA_AUDIT.md (criterios de cobertura del proyecto).

## Índices de vigor y biofísicos

NDVI (Normalized Difference Vegetation Index) indica presencia, vigor y actividad de vegetación verde. EVI (Enhanced Vegetation Index) busca reducir parte de la influencia del suelo y de efectos atmosféricos. LAI (Leaf Area Index) es el área foliar por unidad de superficie de terreno. FAPAR es la fracción de la
radiación fotosintéticamente activa absorbida por la vegetación. SAVI (Soil-Adjusted Vegetation Index) reduce la influencia del brillo del suelo, y MSAVI, en Planet, es su versión modificada que lo hace de forma adaptativa. Estos índices se relacionan con la cubierta vegetal, pero el diccionario advierte que no hay
umbrales universales válidos para todas las parcelas, fechas y etapas fenológicas.

Fuente: Diccionario_de_indices_satelitales.txt (Dataset Básico y PRO); modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md.

## Índices de residuos y labranza

CRC (Crop Residue Cover Index) responde a la cobertura de residuos de cultivo sobre la superficie. MCRC es una variante modificada orientada al mismo fin. NDSVI (Normalized Difference Senescent Vegetation Index) es sensible a vegetación senescente y material no fotosintético. SRNDI (Shortwave Red Normalized Difference
Index) contrasta el infrarrojo de onda corta con el rojo. NDTI (Normalized Difference Tillage Index) y STI (Simple Tillage Index) caracterizan suelo, residuos y condiciones de labranza. MRA es una variable espectral entregada con esa abreviatura por el proveedor, sin una definición pública en las bases. Estas señales
pueden ser útiles para detectar manejo, pero no son mediciones directas de labranza.

Fuente: Diccionario_de_indices_satelitales.txt (Dataset Básico).

## Índices de agua, humedad y estrés

NDWI (Normalized Difference Water Index) se relaciona con agua o humedad por contraste entre bandas, y ENDWI es su variante enhanced. MSI (Moisture Stress Index) responde al contenido de agua de la vegetación y al estrés hídrico; EMSI es su variante ampliada. DSWI2, DSWI3, DSWI4 y DSWI5 pertenecen a la familia
Disease-Water Stress Index: cada uno usa una combinación distinta de bandas para detectar cambios de estrés hídrico y condición vegetal. NDDI (Normalized Difference Drought Index) integra vegetación y humedad para caracterizar sequedad, y ENDDI es su variante enhanced con una señal hídrica complementaria. La diferencia
entre las variantes no está detallada en el diccionario; el proyecto debe documentar cualquier interpretación adicional.

Fuente: Diccionario_de_indices_satelitales.txt (Dataset Básico).

## VI6T y la advertencia sobre los sensores

VI6T es el único índice de Landsat del Dataset Básico. Combina una banda espectral con información térmica de la superficie y se describe como índice espectral-térmico. El diccionario no lo identifica como temperatura superficial en grados Celsius, así que sus unidades deben conservarse tal como las entrega el
proveedor. Por la misma razón, las auditorías advierten que índices de nombre igual en sensores distintos (Sentinel-2 frente a Planet, o Sentinel-2 frente a Landsat) no son equivalentes. La regla práctica es conservar el sensor como parte del identificador de cada variable.

Fuente: Diccionario_de_indices_satelitales.txt; modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md.

## Clima: precipitación CHIRPS

La precipitación mensual acumulada viene de CHIRPS (Climate Hazards InfraRed Precipitation with Stations), en 48 rasters mensuales de enero de 2022 a diciembre de 2025, en mm por mes. Cada raster tiene 65 × 72 píxeles en EPSG:4326, con celdas de unos 0.05° (cerca de 5 km), y valor de nodata −9999. Un píxel abarca
muchas parcelas, así que no representa un pluviómetro en cada una. La referencia recomendada por las bases es Funk et al. (2015), Scientific Data 2, 150066, doi:10.1038/sdata.2015.66 (verificado en la ronda 2: el Climate Hazards Center enlaza ese artículo como descripción de CHIRPS2, con resolución de 0.05° y cobertura
de 50°S a 50°N desde 1981 hasta casi el presente). Recortar a los tres estados no crea mediciones más finas que la celda original. El CHC advierte que las estimaciones solo satelitales sufren sesgos en terreno complejo y tienden a subestimar eventos extremos; ver los fragmentos de validación en esta ronda.

Fuente: BASES_oficiales_Reto_AgroCebada.txt (sección Dataset, referencias); modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (rasters climáticos); referencia externa https://doi.org/10.1038/sdata.2015.66.

## Clima: temperaturas mínima y máxima CHIRTS-ERA5

Las temperaturas mínima y máxima vienen de CHIRTS-ERA5, en 48 rasters mensuales cada una, de enero de 2022 a diciembre de 2025. Cada valor es el promedio mensual de la temperatura diaria mínima o máxima, en °C. No es la temperatura mínima ni máxima del mes. Los rasters tienen casi la misma malla que CHIRPS (diferencia
de origen de unos 3 × 10⁻⁷ grados), y el proyecto calcula las intersecciones para cada malla por separado en lugar de asumir celdas idénticas. Las bases citan el DOI 10.15780/G2F08J del Climate Hazards Center (verificado en la página del CHC). La referencia del método es Verdin et al. (2020), Scientific Data 7, 303,
doi:10.1038/s41597-020-00643-7 (verificado por búsqueda; la serie CHIRTS base abarca 1983–2016). Según la página del CHC, CHIRTS-ERA5 cubre aproximadamente 60°S a 70°N con resolución de 0.05° (verificado), y combina
CHIRTS con el reanálisis ERA5 corregido por sesgo.

Fuente: BASES_oficiales_Reto_AgroCebada.txt (referencias); modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md; referencia externa https://www.chc.ucsb.edu/data/chirts-era5 (consultada por búsqueda).

## Topografía: elevación y pendiente (INEGI CEM)

Elevación y pendiente son dos rasters estáticos derivados del Continuo de Elevaciones Mexicano de INEGI. Los archivos entregados tienen 2,900 × 3,362 píxeles, EPSG:6372 y resolución de 120 m. La pendiente se da en grados (Horn 3 × 3). El algoritmo de Horn (1981, Proceedings of the IEEE 69: 14–47) usa una ventana de 3 ×
3 píxeles; GDAL ofrece Horn o Zevenbergen-Thorne y señala que Horn funciona mejor en terreno más accidentado (verificado en la ronda 3). Que el CEM o el procesamiento del proyecto usen exactamente esa fórmula no está documentado (sin evidencia). La descripción oficial menciona CEM 4.0 con resolución de 15 m, pero las
capas efectivamente entregadas son de 120 m; las auditorías toman el archivo real como referencia. En la verificación de la ronda 2, INEGI documenta el CEM versión 3.0 (2012) con resolución de 15 m y las versiones anteriores con 30 m; no se encontró documentación pública de una versión 4.0 ni de su resolución (sin
evidencia). Una malla de 120 m no coincide con la resolución nativa publicada, así que probablemente es un remuestreo; esto debe confirmarse con el equipo antes de citar la resolución del terreno. Algunas parcelas tienen cobertura baja: la pendiente cubre 0.65 de AGC_020, 0.29 de AGC_023, 0.55 de AGC_164 y solo 0.02 de
AGC_170, y la elevación 0.76 de AGC_170. Las estadísticas de terreno de esas parcelas deben tratarse
como incompletas.

Fuente: DESCRIPCION_oficial_dataset.txt (sección 4); modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (sección Terrain); dataset__DATASET_RETO_AGRO_2026__plot_features__README.md.

## Tabla consolidada de características por parcela

La tabla consolidada tiene 197 filas y 69,318 columnas: AREA_HA, RENDIMIENTO_T_HA y 69,316 columnas de medición. De ellas, 68,732 son índices satelitales por sensor y fecha (nombres sat__{sensor}__{AAAA-MM-DD}__{índice}), y 584 son de clima y terreno (raster__{variable}__{AAAA-MM}__{estadístico}). Las columnas de
metadatos (IDs, geometría, municipio, estado, partición) y las de calidad (presencia, nubosidad y cobertura) se guardaron en archivos aparte: row_metadata.csv y row_quality.csv. Son 155,470 observaciones satelitales en total (107,666 del Básico y 47,804 de PRO). Una celda vacía significa dato no disponible, no cero.

Fuente: dataset__DATASET_RETO_AGRO_2026__plot_features__README.md; modelado__ORIGINAL_FIRA_AUDIT.md.

## Problemas de calidad detectados: unión por ID y no por posición

El shapefile de parcelas no sigue el mismo orden que el CSV de rendimiento: sus primeros identificadores son AGC_196, AGC_044, AGC_020, AGC_174 y AGC_083, mientras el CSV empieza en AGC_001. Unir por posición de fila asignaría mal los 197 registros. Al unir ID_POLIGON con ID_POLIGONO, el área y la partición coinciden
exactamente en todas las parcelas. Las auditorías confirmaron que los constructores usan identificadores explícitos y que no hay una desalineación activa. Además, el shapefile no contiene campo de rendimiento: el rendimiento viene solo del CSV.

Fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (sección Terrain, geometry and column filtering); modelado__ORIGINAL_FIRA_AUDIT.md.

## Problemas de procedencia del rendimiento

Las descripciones oficiales no especifican si el rendimiento es medido, autoreportado, estimado o simulado. No hay protocolo de pesaje, corrección de humedad, superficie cosechada ni calibración de monitor de rendimiento, ni réplicas o incertidumbre de muestreo. Las repeticiones de un mismo valor en tablas derivadas
son copias de la fuente, no mediciones independientes. Por eso, el rendimiento debe tratarse como la etiqueta oficial disponible, sin asumir un error de medición conocido ni un techo predecible. Tampoco se conocen la fecha de cosecha por parcela, el manejo de fertilización ni los eventos de riego o daño. Sobre la
variedad, las parcelas del reto se reparten entre dos variedades de cebada, Doña Josefa (6 hileras) y Voyager (2 hileras), hecho confirmado por verificación local del equipo del proyecto (18 de octubre de 2026); el dataset no trae una columna de variedad por parcela, así que no se sabe cuál variedad tiene cada parcela.

Fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (sección Label provenance and precision); modelado__ORIGINAL_FIRA_AUDIT.md (variables no presentes).

## Lo que el dataset no contiene

Las auditorías concluyen que el dataset original no incluye mediciones de suelo, manejo, fechas de siembra y cosecha, cultivar, fertilizantes, riego ni daños al cultivo, y tampoco rasters de clima a escala de campo. La precipitación y las temperaturas son de celda de unos 5 km; el terreno, de 120 m. Las estadísticas
espaciales adicionales de los rasters climáticos existen en la tabla ancha, pero solo 31 de 197 parcelas tienen variación superior a 10⁻⁶ en la desviación estándar de cada variable climática, por lo que aportan poca información. Estas carencias limitan la interpretación de cualquier variable como causa del rendimiento.

Fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (secciones Climate raster support y Label provenance).

## Fuentes externas exploradas: disponibilidad de datos en la región

El proyecto probó qué datos públicos pueden obtenerse sin cuenta o con cuenta gratuita. Sin cuenta funcionaron Microsoft Planetary Computer (búsquedas STAC y firmas anónimas para Sentinel-2 L2A, Sentinel-1 RTC, HLS y Landsat C2 L2), Element84 earth-search, NASA POWER, Open-Meteo (ERA5, ERA5-Land, ECMWF IFS y modelos de
pronóstico histórico, con CAPE), los archivos de GOES-19 y el catálogo de AlphaEarth. Con cuenta o acceso restringido quedaron NASA Earthdata (OPERA, EMIT, IMERG, ECOSTRESS) y Earth Engine. Las comprobaciones se hicieron el 17 de octubre de 2026 y varias URL de SIAP antiguas ya no resuelven en DNS.

Fuente: iterate_20261017__research__A4_data_access.md (secciones 0, 1 y 3).

## Datos municipales: SIAP 2025 frente a las etiquetas

El cierre agrícola municipal de SIAP para 2025 se descargó como CSV (5.8 MB, 35,902 filas). Estas cifras son datos del proyecto; no se pudieron verificar en línea en esta ronda, porque varias URL de SIAP ya no resuelven. Para la metodología publicada del cierre agrícola, ver los fragmentos nuevos de esta ronda.
Filtrado a cebada de Hidalgo, Tlaxcala y Puebla, da 164 filas. Los rendimientos de temporal primavera–verano de 2025 son: Chignahuapan 3.22, Calpulalpan 4.00, Singuilucan 1.88, Almoloya 1.91, Cuautepec 2.35, Emiliano Zapata
1.81, Nanacamilpa 4.00, Tepeapulco 1.98 y Apan 2.25 t/ha. Comparados con las medias municipales de entrenamiento, la correlación de Spearman es −0.30 y la de Pearson −0.51 (n = 8, sin significancia). El análisis no leyó el archivo de etiquetas; usó las medias municipales citadas en la documentación del proyecto.
Conclusión del proyecto: SIAP no sirve como prior fiable a nivel parcela.

Fuente: iterate_20261017__research__A4_data_access.md (sección 4 c y 3.4).

## Estaciones meteorológicas y precipitación

Las estaciones del Servicio Meteorológico Nacional con datos de 2025 cerca de las parcelas son escasas y de calidad desigual. La estación El Tepozán (Almoloya) está a 0.5 km de la parcela más cercana y tiene 108 parcelas a menos de 10 km, con 184 de 184 días válidos entre mayo y octubre de 2025. En la comparación de
totales mensuales con CHIRPS, la correlación de Pearson entre estaciones y CHIRPS es cercana a cero de mayo a septiembre (por ejemplo −0.03 en junio) y de 0.59 en octubre. CHIRPS sobreestima en 3 a 57 % frente a las medias de estación. Estos resultados son de un análisis exploratorio, no una validación definitiva del
producto.

Fuente: iterate_20261017__research__A4_data_access.md (sección 3.4 y 4 b).

## Imágenes y productos de radar, y alcance dentro de la misma región

Para las 100 parcelas de Chignahuapan, el área cubre 9.9 × 6.6 km; la distancia mediana entre parcelas es 3.3 km. Un producto como ERA5 de 0.25° o NASA POWER de 0.5° asigna una o dos celdas a todo el municipio, así que no distingue parcelas dentro de él. Otros productos tienen soporte más fino pero no se usaron como
predictores: Sentinel-1 de coherencia por pares (vía OPERA CSLC-S1 o ASF HyP3, con cuenta de Earthdata), GOES-19 GLM de descargas eléctricas y ABI de tasa de lluvia de 2 km. El proyecto los considera hipótesis con posible ganancia pequeña, no resultados.

Fuente: iterate_20261017__research__A4_data_access.md (secciones 4 a y 5).

## AlphaEarth: embeddings anuales

AlphaEarth Foundations Satellite Embedding V1 es un producto anual de embeddings de 64 bandas (A00–A63) a 10 m (verificado en el catálogo de Google Earth Engine). El proyecto descargó 1,773 rasters, una por parcela y año de 2017 a 2025, con cobertura válida de 100 % del área de cada parcela; los rasters están en
EPSG:32614 y el nodata es −128 en int8. Las bandas no son
reflectancias interpretables; para obtener el embedding hay que enmascarar nodata y aplicar la transformación del proveedor, sign(x)·(x/127.5)², antes de promediar con ponderación por área. La licencia es CC BY 4.0, con la atribución «The AlphaEarth Foundations Satellite Embedding dataset is produced by Google and
Google DeepMind» (verificado en la ficha del catálogo de Google Earth Engine en la ronda 3). El catálogo indica una cobertura de 2017 a 2024: la fecha final de los metadatos, 2025-01-01, es exclusiva, y una nota de IEEE Spectrum coincide. La cobertura «2017 a 2025» del proyecto no se confirma en el catálogo; debe
revisarse la capa de 2025 antes de citarla.

Fuente: dataset__alphaearth__README.md; referencia externa https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL.

## AgERA5 y otros datos externos del proyecto

El proyecto preparó un conjunto tabular de datos de rendimiento externos de referencia que incluye AgERA5 versión 2, con 27 variables meteorológicas diarias a 0.1° (corregido en la ronda 2: la documentación del Copernicus Climate Data Store y de ECMWF describe unas 22 variables agronómicas para AgERA5 v2.0; la cifra de
27 del proyecto debe revisarse o explicarse, por ejemplo por variables derivadas; en las rondas 3 y 4, la página del CDS del conjunto sis-agrometeorological-indicators lista 16 «variables principales» (con enlaces «Show more» que no se pudieron leer) sin dar un total, así que la cifra de 27 sigue SIN EVIDENCIA y la de
unas 22 no se reconfirmó), y predictores de ventanas
climáticas de la temporada. Al mismo tiempo, combina registros de SIACON–SIAP (Mexico, 2003–2024, 338,607 registros admisibles de
temporal), USDA NASS, CIMMYT MasAgro (2012–2022), IBGE y MAPA España. El total de 1,032,892 observaciones es multicultivo y de temporal, no 1,032,892 parcelas de cebada; las observaciones de México (SIAP y MasAgro) se agregan por municipio o cuentan con coordenadas alteradas. Estos datos son contexto de entrenamiento
externo y no reemplazan las etiquetas de FIRA.

Fuente: modelado__DATASET.md (secciones Yield sources, Area and model schema y Audit limits).

## Herramientas de percepción remota del proyecto: HLS, Sentinel-2 y Sentinel-1

Las series HLS v2.0 (L30 y S30, 2022–2025, 1,198 escenas) y las de Sentinel-2 L2A, Sentinel-1 RTC y Landsat C2 L2 se obtuvieron de Planetary Computer con búsquedas STAC anónimas y firma SAS. Para el AOI de las parcelas, Sentinel-2 y HLS tienen cerca de 50 fechas en 2025 y Sentinel-1 RTC tiene 66. OPERA DIST-ALERT-HLS,
que deriva de HLS, es en gran parte redundante con lo ya descargado. Sentinel-1 de coherencia es el candidato con mayor posible señal intraparcelaria para fechas de cosecha o acame, aunque su ganancia esperada sigue siendo incierta.

Fuente: iterate_20261017__research__A4_data_access.md (sección 2 y 3.1; candidatos en la sección 5).

## Lo que no se puede concluir sobre la predicción

La información disponible no permite afirmar cuál índice o variable climática tiene el mayor peso: responder las preguntas guía exige comparar modelos con validación fuera de muestra, y las fuentes no contienen ese análisis. Tampoco permite fijar un umbral de sequía o calor, pues el diccionario y la literatura piden
justificación agronómica y sensibilidad. Las 138 etiquetas son pocas para seleccionar cientos de índices sobre toda la muestra; la selección debe ocurrir dentro de cada partición de entrenamiento. Cualquier mejora en RMSE debe compararse contra una referencia simple sobre las mismas parcelas.

Fuente: literature_review__report__sections__04_datos.typ.txt; BASES_oficiales_Reto_AgroCebada.txt (preguntas guía).

## Predicción retrospectiva frente a predicción anticipada

Las bases piden estimar el rendimiento de 59 parcelas sin fijar un horizonte universal anterior a la cosecha. Un modelo que usa observaciones de todo el ciclo abril–octubre es una estimación retrospectiva; no equivale a una alerta emitida semanas antes de la cosecha. Las fechas de corte cambian lo que es admisible: el
máximo estacional o la integral solo son válidas con la ventana completa, y los acumulados climáticos deben calcularse con datos disponibles hasta la fecha de emisión. Esta distinción debe declararse en la documentación del reto para no sobrevender el resultado.

Fuente: literature_review__report__sections__02_reto_corpus.typ.txt; literature_review__report__sections__04_datos.typ.txt; BASES_oficiales_Reto_AgroCebada.txt (calendario).

## CHIRPS: cobertura, resolución y qué representa una celda

CHIRPS (Climate Hazards Center InfraRed Precipitation with Stations) es un producto de precipitación en malla que combina estimaciones satelitales infrarrojas con datos de estaciones pluviométricas. Según el Climate Hazards Center (CHC), cubre 50°S a 50°N y todas las longitudes, desde 1981 hasta casi el presente, con
resolución de 0.05° (unos 5 km). Funk et al. (2015) describen la versión CHIRPS2 en Scientific Data. Para el centro de México, cada celda de 0.05° representa un área de unos 29 km², no un punto: una parcela de 5 ha es menos de 2 % de esa área. El CHC advierte que las estimaciones basadas solo en satélite promedian
áreas y sufren sesgos en terreno complejo, con tendencia a subestimar la intensidad de eventos extremos. El producto mitiga parcialmente este problema con un término de realce de la precipitación inducido por el relieve y con interpolación de estaciones. Recomendación: al interpretar CHIRPS en parcelas, declarar que el
valor es una estimación de malla y no una medición local.

Fuente: https://www.chc.ucsb.edu/data/chirps (leída en la ronda 2); Funk, C., et al. (2015). Scientific Data 2, 150066. doi:10.1038/sdata.2015.66.

## CHIRPS frente a estaciones en México: evidencia regional disponible

Rodríguez-Herrera et al. (2025) comparan CHIRPS con estaciones meteorológicas en tres cuencas: dos de San Luis Potosí (una árida y otra tropical) y una templada del Estado de México. Reportan una correlación de Spearman positiva y significativa (P < 0.05) en las tres cuencas, aunque el resumen no publica los valores de
ρ. El error cuadrático medio (RMSE) fue menor de 21 mm en las regiones templada y árida. En la cuenca tropical, CHIRPS subestimó la precipitación, sin magnitud reportada en el resumen. La mayor concordancia entre fuentes se observó en la cuenca templada. El resumen no menciona altitud ni relieve montañoso. Por tanto,
no encontramos en esta ronda una validación específica de CHIRPS en el Altiplano a más de 2,000 m; ese vacío sigue abierto. En la ronda 3 se hallaron otros estudios de productos satelitales en México (véase el fragmento «Validación de productos de lluvia satelital en México»): en la Sierra Madre Occidental, CHIRPS tuvo
mal desempeño en terreno complejo, y en el sur de México fue de los mejores productos frente a estaciones; ninguno cubre el Altiplano. Lectura prudente: la evidencia sugiere buen desempeño en totales y en la estacionalidad, y menor confianza en eventos diarios extremos y en zonas de relieve. Las cifras de
sobreestimación del propio proyecto (3 a 57 % frente a estaciones) son un análisis exploratorio y deben contrastarse con esta literatura.

Fuente: Rodríguez-Herrera, J. G., Amante-Orozco, A., Muñoz-Robles, C. A., Pimentel-López, J., Ruiz-Vera, V. M. y Salvador-Osuna, E. (2025). Evaluation of precipitation data from CHIRPS images in dry and tropical (San Luis Potosi) and temperate (Mexico State) basins in Mexico. Terra Latinoamericana 43.
doi:10.28940/terra.v43i.1953.

## CHIRTS-daily y CHIRTS-ERA5: método y cobertura

Verdin et al. (2020) describen CHIRTS-daily, un producto cuasi-global de temperatura diaria máxima y mínima a 0.05° (unos 5 km) para 60°S a 70°N. Su serie base abarca 1983 a 2016. Está diseñado para regiones con baja densidad de estaciones y combina estimaciones infrarrojas satelitales con observaciones de estaciones.
CHIRTS-ERA5 extiende la serie después de 2016 y es una versión del reanálisis ERA5 corregida por sesgo y reescalada para ser compatible con CHIRTS, según el CHC. Los valores de la serie son promedios de las temperaturas diarias mínimas o máximas del mes, en °C; no son la mínima ni la máxima absoluta del mes. Para el
reto, esto cambia la interpretación de cualquier umbral térmico. La validación del producto en México no se localizó en la ronda 3 (búsquedas en OpenAlex y Crossref sin estudios de CHIRTS en México; sí hay estudios de CHIRTS en Kenia y Mozambique, véase el fragmento nuevo sobre CHIRTS fuera de México): el artículo de
Verdin et al. (2020) incluye una validación del producto (no leída en detalle en esta ronda), y conviene buscar comparaciones con estaciones del SMN en los valles de Tlaxcala y Puebla antes de usar la temperatura como variable de campo.

Fuente: Verdin, A., Funk, C., Peterson, P., Landsfeld, M., Tuholske, C. y Grace, K. (2020). Development and validation of the CHIRTS-daily quasi-global high-resolution daily temperature data set. Scientific Data 7, 303. doi:10.1038/s41597-020-00643-7; https://www.chc.ucsb.edu/data/chirts-era5 (leída en la ronda 2).

## CEM de INEGI: resolución documentada y pendiente

INEGI describe el Continuo de Elevaciones Mexicano como un modelo digital del terreno de todo el territorio continental. La versión 3.0, publicada en 2012, tiene resolución de 15 m; las versiones anteriores tienen 30 m. La documentación de INEGI incluye un procedimiento para calcular el porcentaje de pendiente de cada
celda a partir de su altura. No se encontró documentación pública de una versión 4.0 ni de una resolución distinta de 15 m para ella. Para el reto, la pendiente y la elevación entregadas están en malla de 120 m. Un remuestreo de 15 m a 120 m suaviza las pendientes locales, así que las pendientes de parcelas pequeñas o
de bordes de terraza pueden quedar subestimadas. Recomendación: documentar la resolución de la capa usada y, si es posible, recalcular la pendiente desde la elevación de 15 m antes de tratarla como dato de campo.

Fuente: INEGI, Continuo de Elevaciones Mexicano, https://inegi.org.mx/contenidos/temas/relieve/continental/doc/continuo_elevaciones.pdf (búsqueda; resumen leído); INEGI, Indicadores DGGMA (fuente de búsqueda).

## Errores del CEM 3.0 en planicies de Hidalgo

Un estudio sobre el CEM 3.0 en Hidalgo reporta errores altos en planicies de inundación. Los autores lo atribuyen a barreras artificiales construidas alrededor de cuerpos de agua pequeños. Un trabajo publicado en 2024 señala que esas alteraciones no están documentadas en la literatura oficial de INEGI para este
producto. Para el reto, importa si alguna parcela está en una planicie de este tipo: en ese caso, su pendiente y su elevación podrían estar contaminadas por esas barreras. Recomendación (no es un hecho publicado): comparar la pendiente del CEM con un modelo de terreno alternativo en las parcelas con pendiente cercana a
cero, y revisar si el error coincide con cuerpos de agua o bordos. Este fragmento se basa en el resumen de búsqueda y no en el texto completo del artículo.

Fuente: repositorio UAEH, revista AACTM, artículo 9118, https://repository.uaeh.edu.mx/revistas/index.php/aactm/article/view/9118 (resumen de búsqueda; no leído completo).

## Sentinel-2: bandas y revisita

Sentinel-2A y Sentinel-2B operan en la misma órbita, desfasados 180 grados. Juntos ofrecen una revisita de unos 5 días; cada satélite, por separado, de unos 10 días. Las bandas de 10 m son azul, verde, rojo e infrarrojo cercano (B2, B3, B4 y B8). Las bandas de borde rojo, infrarrojo cercano estrecho y SWIR se toman a
20 m, y las de aerosoles, vapor de agua y cirros a 60 m. Para una parcela de la mediana del reto (5.46 ha, unos 55,000 m²), esto equivale a unos 550 píxeles de 10 m, lo que da margen para promedios por parcela. La revisita combinada de 5 días es el dato que determina cuántas fechas útiles puede haber en la temporada,
antes de considerar nubes. Fuente: NASA Earthdata, sensor MSI, https://www.earthdata.nasa.gov/sensors/msi; Wikipedia, Sentinel-2, https://en.wikipedia.org/wiki/Sentinel-2 (fuentes secundarias; confirmar con ESA para uso formal).

## Landsat 8 y 9: resolución y revisita

Las bandas ópticas principales de Landsat 8 y 9 (azul, verde, rojo, infrarrojo cercano, SWIR1 y SWIR2) tienen 30 m de resolución, con una franja de unos 185 km. Cada satélite revisita cada 16 días; con ambos, la revisita combinada es de unos 8 días. Para la mediana de 5.46 ha del reto, una parcela contiene unos 60
píxeles de 30 m (cerca de 900 m² cada uno), suficientes para un promedio pero con mezcla de bordes en parcelas pequeñas. Frente a Sentinel-2 tiene menos fechas y píxeles más gruesos, pero su serie histórica es más larga; en el reto Landsat solo aporta el índice VI6T en el Dataset Básico. Fuente: Humboldt-Universität zu
Berlin, EOL geo_rs, https://pages.cms.hu-berlin.de/EOL/geo_rs/S06_Data_acquisition.html y https://pages.cms.hu-berlin.de/EOL/geo_rs/S00_data-providers.html (fuente secundaria de curso; confirmar con USGS para uso formal).

## PlanetScope (SuperDove): 3 m y revisita diaria

PlanetScope, con la constelación Dove y SuperDove, toma imágenes de unos 3 m de resolución. NASA indica que la constelación puede captar toda la superficie terrestre cada día con 3 m por píxel. Un artículo de 2025 en Frontiers in Remote Sensing describe SuperDove con ocho bandas a 3 m. Las fuentes no coinciden en el
tamaño de escena: NASA da unos 20 × 12 km, y el artículo de Frontiers unos 32.5 × 19.6 km. La especificación oficial de Planet no se consultó en esta ronda. En el reto, Planet solo cubre 2025 (Dataset PRO) y no tiene historia de 2022 a 2024, así que no sirve para comparar años. Para parcelas de 0.35 a 64 ha, la
resolución de 3 m da cientos a miles de píxeles por parcela, pero las bandas y la calibración de Planet no son equivalentes a las de Sentinel-2 y no deben fusionarse como mediciones iguales. Fuente: NASA Earthdata, https://www.earthdata.nasa.gov/es/node/12638; Frontiers in Remote Sensing 2025,
https://www.frontiersin.org/journals/remote-sensing/articles/10.3389/frsen.2025.1624783/pdf.

## Delimitación de campos pequeños: 10 m frente a 3 m

Un preprint de 2026 sobre delimitación de límites de campos (arXiv 2607.04449, sin revisión por pares) reporta que a 10 m solo cerca de 7.5 % de los campos menores de 0.5 ha permanecen como polígonos separados, frente a cerca de 88 % a 3 m. Para el reto, la mayoría de las parcelas son mayores de 0.5 ha (la mediana es
5.46 ha), pero la parcela mínima mide 0.35 ha Recomendación metodológica: en parcelas menores de 1 ha, usar solo los píxeles interiores (un buffer negativo sobre el polígono) para promediar índices, y reportar cuántos píxeles quedaron tras el recorte. Esta recomendación no es un resultado del preprint. Fuente: arXiv
2607.04449, https://arxiv.org/pdf/2607.04449 (resumen leído; preprint).

## HLS v2.0: serie armonizada de Landsat y Sentinel-2 a 30 m

Harmonized Landsat Sentinel-2 (HLS) v2.0 combina Landsat 8/9 y Sentinel-2 en productos de reflectancia de superficie a 30 m. Según NASA, la revisita combinada es de unos 2 a 3 días; en el ecuador, una observación cada 3 días y más frecuente a mayor latitud. Los productos HLSS30 (de Sentinel-2) y HLSL30 (de Landsat)
están en la misma malla MGRS y se pueden apilar en series temporales. La versión 2.0 actualiza la corrección atmosférica, el enmascarado de nubes y la corrección BRDF, extiende la cobertura a todo el terreno global excepto la Antártida, y usa Landsat Collection 2 como insumo. Hay huecos documentados en HLSS30 por
problemas de adquisición de insumos y latencias de entrega. Las fuentes no coinciden en la lista de satélites Sentinel-2 incluidos (2A, 2B y 2C) ni en la versión de LaSRC; ambos puntos deben revisarse en la guía de usuario. Fuente: LP DAAC, HLS User Guide V2,
https://lpdaac.usgs.gov/documents/1698/HLS_User_Guide_V2.pdf; NASA HLS, https://www.earthdata.nasa.gov/data/projects/hls (leídas por búsqueda).

## AlphaEarth Satellite Embedding: qué representa cada banda

El Satellite Embedding V1 Annual de Google, basado en AlphaEarth Foundations, entrega un vector de 64 valores (A00 a A63) por píxel de 10 m y por año. Según el benchmark arXiv 2601.00857, que cita a Brown et al. (2025), el modelo se entrenó con datos de Landsat 8/9, Sentinel-2, Sentinel-1 (radar), GEDI (LiDAR),
ERA5-Land, GRACE, el modelo de elevación GLO-30 y texto de Wikipedia. Las bandas no son reflectancias: son embeddings latentes que hay que decodificar antes de promediar, y el catálogo indica que se publican en una versión de modelo distinta a la evaluada en el artículo original. Un benchmark de 2026 (arXiv 2601.00857)
evalúa AlphaEarth en tareas agrícolas posteriores; en esta ronda solo se leyó el resumen, por lo que sus resultados numéricos no se incluyen. Para el reto, AlphaEarth es un predictor de contexto del terreno y del uso del suelo, no una medición de la cosecha. Fuente: Google Earth Engine,
GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL, https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL; arXiv 2601.00857, https://arxiv.org/pdf/2601.00857.

## AgERA5: variables agronómicas diarias a 0.1°

AgERA5 es un conjunto diario de variables meteorológicas para agricultura del Copernicus Climate Data Store, que cubre de 1979 al presente a 0.1° (unos 11 km en el ecuador). Se deriva de ERA5 horario: los datos se agregan a días en hora local y se reescalan con ecuaciones de regresión entrenadas con el modelo de alta
resolución del ECMWF. Documenta unas 22 variables, entre ellas viento, temperatura, precipitación, humedad, nubosidad, radiación y evapotranspiración de referencia. La versión 2.0 corrige problemas de la v1.1, como valores de Tmin erróneos y Tmean mayores que Tmax. Para el reto, AgERA5 ofrece más variables que CHIRPS o
CHIRTS, pero su escala sigue siendo de varios kilómetros y no distingue parcelas dentro de un municipio. Recomendación: usar AgERA5 como fuente alterna para contrastar CHIRPS y CHIRTS-ERA5 en la misma ventana temporal, y declarar que la comparación es entre productos de malla. Fuente: Copernicus CDS,
https://cds.climate.copernicus.eu/datasets/sis-agrometeorological-indicators; ECMWF Confluence (AgERA5), https://confluence.ecmwf.int/x/3FmaE.

## FIRA: fideicomisos, funciones y alcance

FIRA (Fideicomisos Instituidos en Relación con la Agricultura) son cuatro fideicomisos públicos del Gobierno Federal: FONDO, FEFA, FEGA y FOPESCA. La Secretaría de Hacienda y Crédito Público (SHCP) funge como fideicomitente y el Banco de México como fiduciario. Su propósito es facilitar el acceso al crédito mediante
operaciones de crédito y descuento y el otorgamiento de garantías, para proyectos de agricultura, ganadería, avicultura, agroindustria, pesca y actividades rurales relacionadas. El portal oficial es gob.mx/fira. Para el reto, este marco explica por qué la convocatoria se vincula con inclusión financiera rural y con el
uso de percepción remota en la toma de decisiones del sector. Las bases citan las Reglas de Operación publicadas en el Diario Oficial de la Federación el 1 de diciembre de 2025, que no se verificaron en línea en esta ronda. Los nombres de los cuatro fideicomisos se toman de la página institucional; no se revisó la
historia de cada uno.

Fuente: https://www.gob.mx/fira/acciones-y-programas/conoce-acerca-de-fira (leída en la ronda 2); BASES_oficiales_Reto_AgroCebada.txt (antecedentes, para las Reglas de Operación).

## Cebada de temporal en México: contexto de producción

De acuerdo con un artículo del INIFAP sobre cebada maltera, en México alrededor de 67 % de la producción de cebada corresponde a siembras de temporal (primavera-verano) y 33 % a riego (otoño-invierno). Esta cifra proviene del resumen de búsqueda y no se confirmó en el texto completo. El Censo Agropecuario 2022 de INEGI
(año agrícola de octubre de 2021 a septiembre de 2022) reporta para la cebada grano en Hidalgo 95,432 ha sembradas y 147,448 t producidas, y en Tlaxcala 43,929 ha sembradas y 111,564 t. Dividiendo producción entre superficie sembrada (no cosechada, por lo que no es el rendimiento que define SIAP), el cociente es de
1.55 t/ha en Hidalgo y 2.54 t/ha en Tlaxcala (cálculo derivado; corregido en la ronda 4, que antes lo presentaba como rendimiento). Son cifras que mezclan temporal y
riego y que no se comparan directamente con el ciclo 2025 de las parcelas del reto. En el boletín de Puebla, la cebada grano no aparece entre los cultivos anuales principales, lo que indica una superficie menor a 21,002 ha, sin cifra exacta. Fuente: INEGI, Censo Agropecuario 2022, boletines de Hidalgo y Tlaxcala,
https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2023/CA_Def/CA_Def2022_Hgo.pdf y https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2023/CA_Def/CA_Def2022_Tlax.pdf (publicados el 21 de noviembre de 2023); INIFAP, Revista Ciencias Agrícolas (resumen de búsqueda).

## Líneas avanzadas de cebada maltera para temporal en Valles Altos

Adabella es una variedad maltera para Valles Altos, obtenida en el Campo Experimental Valle de México del INIFAP para siembras de temporal, con tolerancia a enfermedades comunes de la región y alto rendimiento potencial, según un artículo de 2008 (resumen de búsqueda). Un estudio más reciente evaluó 16 genotipos de
cebada en cinco ambientes de temporal con diseño látice (2012–2013). Las líneas M176, M177, M178 y M184 tuvieron rendimientos de 3.8, 3.5, 3.9 y 4.0 t/ha, respectivamente. Son líneas experimentales, no variedades liberadas, y el resumen no identifica las localidades. Como referencia cualitativa, estos rangos de 3.5 a
4.0 t/ha son del mismo orden que las medias municipales de entrenamiento del reto, aunque no son comparables porque los ambientes, años y métodos de medición difieren. Fuente: INIFAP, Revista Ciencias Agrícolas, "Evaluación agronómica y física en líneas avanzadas de cebada maltera",
https://cienciasagricolas.inifap.gob.mx/index.php/agricolas/article/view/380 (resumen de búsqueda; no se confirmó que sea el artículo exacto de las cifras de líneas).

## SIAP: lo que sí se documenta del cierre agrícola

Los documentos del SIAP y de SEMARNAT describen el cierre agrícola como la suma de los ciclos otoño-invierno y primavera-verano, complementada con cultivos perennes. Las variables publicadas son superficie sembrada, cosechada y siniestrada, volumen, rendimiento por hectárea cosechada y valor de la producción,
desglosadas por riego y temporal. El rendimiento es, por definición, la producción entre la superficie cosechada. La superficie sembrada la estiman los Distritos de Desarrollo Rural a partir de los cultivos en el predio, según una ficha de SEMARNAT que cita a la Sagarpa (2002). La frontera agrícola se actualiza por
fotointerpretación de imágenes SPOT, según un documento de trabajo del SIAP. Una limitación documentada es que no existe monitoreo continuo del abandono de terrenos agrícolas. La Normatividad Técnica para la Generación de Estadística Básica Agropecuaria (SIAP, edición 2022) define el rendimiento como la producción
obtenida entre la superficie cosechada y admite que puede medirse en campo, en laboratorio o por entrevista (verificado en la ronda 3). El procedimiento estadístico con que se estiman las cifras municipales del cierre sigue sin localizarse (SIN EVIDENCIA). Lo que sí está documentado es la Estimación de Superficie
Agrícola (ESA) de SIAP: en el boletín de Hidalgo, primavera-verano 2022, la superficie de maíz grano, sorgo grano, frijol y trigo grano se estimó con 556 parcelas georreferenciadas y 10 imágenes SPOT; la cebada no figura entre los cuatro cultivos elegibles de ese boletín (verificado, ronda 4). Por tanto, el rendimiento
municipal es un promedio reportado,
no una medición de parcela. Fuente: SEMARNAT, indicadores de superficie agrícola, https://apps1.semarnat.gob.mx:8443/dgeia/compendio_2020/archivos/02_agrigan/d2_agrigan03_01.pdf; SIAP, Cierre de la producción agropecuaria 2017,
https://www.gob.mx/cms/uploads/attachment/file/330747/Cierre_de_la_producci_n_Agropecuaria_2017.pdf (resúmenes de búsqueda).

## SIACON y datos abiertos de producción agrícola municipal

Existen series municipales históricas de producción agrícola de México publicadas por la antigua SAGARPA, que hoy se descargan desde portales de datos abiertos como DataMX. Ese portal aloja registros anualizados de superficie, rendimiento, precio y valor para 2001–2002 y 2007–2008, con última actualización de la página
en 2015, por lo que pueden estar desactualizados. Una tesis de la UNAM menciona el sistema SIACON con datos de 1980 a 2009. La vigencia de los enlaces antiguos de SIAP es limitada: en la comprobación del 17 de octubre de 2026, varias URL no resolvieron. Recomendación: para cualquier serie de 2025, consultar el portal
oficial gob.mx/siap, y registrar en la documentación la fecha de descarga, la versión del archivo y el diccionario de datos. Los datos municipales no reemplazan la etiqueta de cada parcela. Fuente: DataMX, https://datamx.io/dataset/?tags=siap (búsqueda); tesis UNAM con referencia a SIACON,
https://ru.dgb.unam.mx/bitstream/20.500.14330/TES01000662821/3/0662821_A1.pdf (resumen de búsqueda).

## Nubosidad de Sentinel-2 en la temporada de lluvias del centro de México

En la ronda 3 se localizó la publicación de Solórzano et al. (2020) sobre patrones espaciotemporales de las observaciones Sentinel-2 en México entre 2015 y 2019 (repositorio de la Universidad Iberoamericana; el PDF no devolvió un documento legible, así que sus cifras no se usan). El resumen de la publicación (leído en
RiuNet en la ronda 4) da conteos y no porcentajes: hasta 121 observaciones válidas por píxel al año y hasta 6.58 por mes, según el resumen. El PDF completo no se pudo descargar (la descarga devolvió HTML), así que el porcentaje de escenas válidas de junio a octubre sigue SIN EVIDENCIA. Como referencia de otra región,
un estudio del noreste de Brasil con MODIS, Landsat-8 y Sentinel-2 encontró una reducción de cerca de 50 % de las imágenes libres de nubes en los meses lluviosos, con mejores condiciones entre mayo y octubre. Implicación para el reto: el
número de fechas ópticas útiles es menor en los meses lluviosos, por lo que una fecha de Sentinel-2 sin máscara de nubes o con cobertura parcial no debe tratarse como observación válida. Fuente: Solórzano, J. V., Mas, J. F., Gao, Y. y Gallardo Cruz, J. A. (2020), «Patrones espaciotemporales de las observaciones de
Sentinel-2 a nivel de imagen y píxel sobre el territorio mexicano entre 2015 y 2019», Revista de Teledetección 56: 103–115, doi:10.4995/raet.2020.14044; resumen en https://riunet.upv.es/handle/10251/159566 (solo resumen leído); referencia brasileña no localizada.

## Escala de los datos frente a la parcela: una comparación para el reto

Las parcelas del reto tienen área de 0.35 a 64.30 ha, con mediana de 5.46 ha. Chignahuapan concentra 100 parcelas en un área de 9.9 × 6.6 km, con distancia mediana de 3.3 km entre parcelas. Frente a esa escala, CHIRPS y CHIRTS-ERA5 tienen celdas de 0.05° (unos 29 km² en esta latitud), así que dentro del área de
Chignahuapan caben solo unas 2 a 3 celdas. AgERA5 tiene celdas de 0.1° (unos 115 km²). El CEM de la capa entregada tiene 120 m (unos 1.44 ha por píxel), y Sentinel-2 y HLS tienen 10 y 30 m. Un píxel de CEM de 120 m es mayor que una parcela pequeña de 0.35 ha, por lo que la pendiente de esas parcelas proviene de una
fracción del píxel. Recomendación: presentar en el informe una tabla con la resolución efectiva de cada fuente frente al tamaño de la parcela, y no interpretar variables climáticas como si fueran de cada parcela. Fuente: cálculo a partir de BASES_oficiales_Reto_AgroCebada.txt, DESCRIPCION_oficial_dataset.txt e
iterate_20261017__research__A4_data_access.md (sección 4 a); resoluciones de las fuentes externas de este archivo.

## Validación de productos de lluvia satelital en México

CHIRPS es un producto de precipitación diaria a 0.05° (unos 5 km) que combina imágenes infrarrojas con estaciones. Su validación en México es desigual. En la Sierra Madre Occidental del noroeste, un estudio de 2024 comparó cuatro productos de malla (AORC, CHIRPS, Daymet y ERA5) con pluviómetros de la red NERN entre
2002 y 2004. Concluyó que CHIRPS y ERA5 tuvieron mal desempeño en la región de terreno complejo, que Daymet fue el más preciso a escala diaria y AORC a escala mensual, y que la elevación tuvo un efecto mínimo sobre la exactitud global. En el sur, en las cuencas del río La Sierra (2008 a 2010), CHIRPS fue de los
productos de mejor calidad frente a estaciones: mejor en lluvias de 10 a 50 mm y mayores de 100 mm, mientras ERA5 lo fue en lluvias de 0 a 10 y de 50 a 100 mm. A escala nacional, un estudio de 2022 comparó productos satelitales y de reanálisis disponibles en Google Earth Engine con 4,658 estaciones (2001 a 2017). Todos
reproducen los patrones anuales, estacionales y mensuales, pero pierden exactitud a escala diaria y sesgan los eventos de baja precipitación; su desempeño depende de la elevación. Según sus resúmenes, ninguno de estos estudios valida el Altiplano de Hidalgo, Tlaxcala y Puebla por encima de 2,000 m, por lo que la
validación local sigue pendiente.

Fuente: Journal of Hydrology: Regional Studies (2024), doi:10.1016/j.ejrh.2024.102019; Journal of Hydroinformatics (2022), doi:10.2166/hydro.2022.122; Atmósfera (2020), doi:10.20937/atm.52789.

## Metodología del SIAP: definiciones documentadas para superficie y rendimiento

El reto usa cifras municipales del cierre agrícola del SIAP, así que conviene distinguir lo documentado de lo que no lo está. La Normatividad Técnica para la Generación de Estadística Básica Agropecuaria (SIAP, edición 2022, publicada en gob.mx el 5 de enero de 2023) define el rendimiento como la producción obtenida
dividida entre la superficie cosechada, normalmente en toneladas por hectárea. Define la superficie sembrada como el área en la que se deposita la semilla, la superficie cosechada como el área en la que se cosechó el producto, y la superficie siniestrada como el área sembrada con pérdida total por fenómenos climáticos,
plagas o enfermedades. El índice de siniestralidad es la superficie siniestrada entre la sembrada, multiplicada por cien. El cierre anual definitivo consolida más de 550 cultivos, tipos y formas de producción. La norma admite que el rendimiento puede ser un dato medido en campo, en laboratorio o por entrevista. No
describe, en las secciones consultadas, el procedimiento estadístico con que se estiman las cifras municipales. Por eso el rendimiento municipal debe citarse como promedio reportado, no como medición de parcela.

Fuente: SIAP, Normatividad Técnica para la Generación de Estadística Básica Agropecuaria, edición 2022, https://www.gob.mx/cms/uploads/attachment/file/789519/NTGEBAP_2022.pdf (leída en la ronda 3).

## Nubosidad en la temporada de lluvias: qué se puede afirmar sin cifras

Para el centro de México, la referencia nacional más directa sobre la disponibilidad de observaciones Sentinel-2 es el estudio de Solórzano, Mas, Gao y Gallardo Cruz (2020). Analiza los patrones espaciotemporales de las observaciones Sentinel-2 en el territorio mexicano entre 2015 y 2019, a nivel de imagen y de píxel.
Solo se pudieron leer sus metadatos en esta ronda, así que no se citan porcentajes de escenas válidas. Lo que sí puede afirmarse es el principio: en la temporada de lluvias, una fecha óptica puede tener nubes parciales o cobertura incompleta. Por eso, antes de construir índices de temporada, conviene contar las fechas
válidas por parcela y no tratar una fecha con máscara parcial como observación completa. Esta recomendación es metodológica, no una cifra de la literatura.

Fuente: Solórzano, J. V., Mas, J. F., Gao, Y. y Gallardo Cruz, J. A. (2020), Patrones espaciotemporales de las observaciones de Sentinel-2 a nivel de imagen y píxel sobre el territorio mexicano entre 2015 y 2019, Universidad Iberoamericana, https://ri.ibero.mx/bitstream/ibero/5898/1/GCJA_Art_01.pdf (solo metadatos
leídos).

## CHIRTS fuera de México: validaciones y usos en otras regiones

Verdin et al. (2020) presentan CHIRTS-daily como un producto cuasi-global de temperatura diaria máxima y mínima a 0.05°, con validación de sus estimaciones; su serie base abarca 1983 a 2016. Estudios posteriores lo han usado en África: un análisis de olas de calor en Kenia (1987 a 2016) basado en CHIRTS y estaciones, y
otro en Mozambique (1983 a 2016) con resúmenes por ciudad. Un trabajo de 2025 en la revista Atmosphere reduce la resolución de CHIRTS de 5 km a 1 km mediante temperatura superficial MODIS y tres modelos de aprendizaje automático (Random Forest, XGBoost y regresión lineal). Esto indica que la resolución nativa de 5 km
limita la representación de la variación fina de la temperatura en terreno complejo. Estos estudios no sustituyen la validación en el Altiplano: no se localizó ningún estudio de CHIRTS en el centro de México por encima de 2,000 m.

Fuente: Verdin et al. (2020), Scientific Data 7: 303, doi:10.1038/s41597-020-00643-7; Atmosphere (2025), doi:10.3390/atmos16101188; Atmosphere 12: 37 (2020), doi:10.3390/atmos12010037 (Kenia); Weather and Climate Extremes (2023), doi:10.1016/j.wace.2023.100565 (Mozambique).

## Reglas de Operación del DOF de 2025: qué establecen para FIRA

La nota del Diario Oficial de la Federación del 1 de diciembre de 2025, publicada por la Secretaría de Hacienda y Crédito Público, contiene las Reglas de Operación para apoyos a los sectores agropecuario, forestal, pesquero, alimentario y rural. Su objetivo declarado es ampliar la inclusión financiera de las personas
productoras, elevar su productividad y rentabilidad, y promover un desarrollo sostenible. El texto indica que los fideicomisos que integran FIRA (FONDO, FEFA, FEGA y FOPESCA) destinan recursos a cada uno de los apoyos que comprenden las reglas. Para el reto, estas reglas describen apoyos financieros y no cambian
ninguna cifra de rendimiento ni de superficie. En esta ronda se leyó solo la primera parte del texto, de más de 200,000 caracteres; los apoyos específicos para cebada no se revisaron.

Fuente: Diario Oficial de la Federación, 1 de diciembre de 2025, «Reglas de Operación para apoyos a los sectores agropecuario, forestal, pesquero, alimentario y rural», https://dof.gob.mx/nota_detalle.php?codigo=5774690&fecha=01/12/2025 (leída en la ronda 3, primera parte).

## Licencia y cobertura de AlphaEarth: lo que el catálogo permite afirmar

El conjunto Satellite Embedding de AlphaEarth Foundations, publicado por Google y Google DeepMind en Google Earth Engine, se distribuye bajo licencia CC BY 4.0 con una frase de atribución obligatoria: «The AlphaEarth Foundations Satellite Embedding dataset is produced by Google and Google DeepMind». La ficha del
catálogo no pide citar un artículo adicional. Cobertura temporal: la página del catálogo consultada en la ronda 3 indicaba metadatos de 2017 a 2024 (fecha final 2025-01-01, exclusiva). Sin embargo, el proyecto descargó y validó capas anuales de 2017 a 2025 para las 197 parcelas (1,773 rasters = 197 × 9 años, con
cobertura válida de 100 %), de modo que la capa de 2025 sí existe en la fuente usada por el proyecto; la ficha del catálogo puede estar desactualizada. Al citar la capa de 2025, indicar la fecha de descarga y la versión del catálogo. Para el reto, el uso de los embeddings debe citar la atribución, indicar la versión
del catálogo y el año de cada capa.

Fuente: Google Earth Engine, catálogo GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL, https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL (leído en la ronda 3).

## Pendiente por el método de Horn en una ventana de 3 × 3

El cálculo de pendiente con el método de Horn (1981) estima el gradiente de altura a partir de una ventana de 3 × 3 píxeles centrada en cada celda, con pesos que favorecen a los vecinos directos. GDAL, en su herramienta gdaldem, ofrece Horn o Zevenbergen-Thorne; indica que la fórmula de Horn funciona mejor en terreno
más accidentado. Para una malla de 120 m, la ventana cubre unos 360 m por lado, así que la pendiente resume el relieve a esa escala y no la microtopografía de una parcela de 5 ha. Un detalle práctico: GDAL asigna nodata si al menos un píxel de la ventana es nodata. Eso explica por qué una parcela con cobertura baja de
pendiente debe revisarse antes de usar la estadística de terreno. Fuente: Horn, B. K. P. (1981), «Hill shading and the reflectance map», Proceedings of the IEEE 69(1): 14–47, doi:10.1109/PROC.1981.11918; documentación de GDAL, gdaldem, https://gdal.org/en/stable/programs/gdaldem.html (leída en la ronda 3).

## Calidad de las estadísticas agrícolas de SIAP: qué se mide y qué se estima

Las cifras municipales de superficie y producción de SIAP combinan procesos distintos. Uno es la Estimación de Superficie Agrícola (ESA), que mide la superficie por cultivo con insumos de alta precisión. En el boletín de Hidalgo, primavera-verano 2022, la superficie de maíz grano, sorgo grano, frijol y trigo grano se
estimó con 556 parcelas georreferenciadas por GPS y el análisis de 10 imágenes SPOT recibidas por la estación ERMEX de SIAP. La ventana de observación fue de finales de agosto a principios de octubre, cuando el cultivo está en su mayor desarrollo fenológico. La cebada no aparece entre los cuatro cultivos elegibles de
ese boletín, así que la superficie de cebada del cierre no proviene de esa estimación documentada. El rendimiento municipal de SIAP es un promedio reportado, no una medición de parcela, y el procedimiento estadístico del cierre sigue SIN EVIDENCIA. Recomendación: registrar en el informe la fecha de descarga y el
cultivo y ciclo de cada cifra.

Fuente: SIAP, Estimación de Superficie Agrícola, P-V 2022: Hidalgo, https://www.gob.mx/cms/uploads/attachment/file/829415/BOLETIN_Hidalgo_PV_2023.pdf (texto leído completo en la ronda 4).

## Censo Agropecuario 2022: cebada grano como referencia independiente

El Censo Agropecuario 2022 de INEGI es una fuente de conteo distinta del cierre de SIAP. Sus boletines definitivos, publicados el 21 de noviembre de 2023, tienen una tabla de principales cultivos anuales con producción (toneladas) y superficie sembrada (hectáreas). Para la cebada grano, con periodo de referencia de
octubre de 2021 a septiembre de 2022, Hidalgo registra 147,448 t producidas en 95,432 ha sembradas, y Tlaxcala 111,564 t en 43,929 ha sembradas. En el boletín de Puebla, la cebada grano no aparece entre los cultivos anuales principales del extracto leído, y no hay cifra. Las cifras mezclan temporal y riego y no separan
ciclos. Como el denominador es la superficie sembrada, el cociente producción/superficie sembrada no es el rendimiento por hectárea cosechada que define SIAP, y no debe compararse directamente con las etiquetas de las parcelas del reto.

Fuente: INEGI, Censo Agropecuario 2022, boletines definitivos de Hidalgo y Tlaxcala (21 de noviembre de 2023), https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2023/CA_Def/CA_Def2022_Hgo.pdf y https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2023/CA_Def/CA_Def2022_Tlax.pdf (tablas leídas en la ronda
4).

## Errores frecuentes y cómo detectarlos

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

## Preguntas y respuestas

**P:** ¿Qué pide el Reto AgroCebada 2026?
**R:** Desarrollar un modelo que prediga el rendimiento de parcelas de cebada en Hidalgo, Tlaxcala y Puebla, y una aplicación o interfaz web que permita consultar los resultados.

**P:** ¿Cuántas parcelas tiene el dataset y cómo se dividen?
**R:** 197 parcelas: 138 de ENTRENAMIENTO con rendimiento visible y 59 de PREDICCION con rendimiento oculto.

**P:** ¿Qué peso tiene cada criterio de evaluación en la primera etapa?
**R:** El desempeño predictivo y la justificación técnica pesan 70 % (con RMSE, MAE, r² u otras métricas del comité) y la aplicación o interfaz web 30 %.

**P:** ¿Qué periodo cubre el rendimiento?
**R:** El ciclo de producción de abril a octubre de 2025.

**P:** ¿Cuál es el rendimiento medio de entrenamiento?
**R:** Media de 3.955 t/ha, mediana de 4.34, desviación estándar de 0.851, mínimo de 2.00 y máximo de 5.59.

**P:** ¿Qué municipio tiene más parcelas?
**R:** Chignahuapan (Puebla), con 100 parcelas: 71 de entrenamiento y 29 de predicción.

**P:** ¿Por qué el valor 4.5 t/ha aparece tantas veces?
**R:** Al redondear a 0.1 t/ha, 27 de las 138 parcelas de entrenamiento tienen 4.5. Las fuentes no documentan el método de medición ni de redondeo, así que la causa no está determinada.

**P:** ¿Qué cubre el Dataset Básico?
**R:** Observaciones de Sentinel-2 y Landsat de 2022 a 2025 (107,666 filas, 96 columnas), con 23 índices, cuatro estadísticos por índice y el porcentaje de nubosidad.

**P:** ¿Qué diferencia hay entre el Dataset Básico y el PRO?
**R:** El PRO es de Planet y solo cubre 2025, con NDVI, EVI, LAI y MSAVI. Sus valores no deben fusionarse con los del Básico.

**P:** ¿Qué resolución tienen los rasters de precipitación y temperatura?
**R:** Unos 0.05° (cerca de 5 km), 48 rasters mensuales por variable de 2022 a 2025, en mm para CHIRPS y en °C para CHIRTS-ERA5.

**P:** ¿Qué se sabe de la topografía?
**R:** Elevación y pendiente son rasters estáticos de 120 m derivados del CEM de INEGI; la pendiente se expresa en grados y algunas parcelas tienen cobertura baja.

**P:** ¿Qué datos no incluye el dataset oficial?
**R:** Fechas de siembra y cosecha, manejo, cultivar, fertilización, riego, daños y mediciones de suelo.

**P:** ¿Por qué no se pueden usar las observaciones de noviembre y diciembre de 2025?
**R:** Están fuera del ciclo abril–octubre que el rendimiento describe; usarlas sería una fuga temporal en una predicción emitida antes de la cosecha.


**P:** ¿Qué cubre CHIRPS y con qué resolución?
**R:** Según el Climate Hazards Center, cubre 50°S a 50°N desde 1981 hasta casi el presente, con resolución de 0.05° (unos 5 km). Es una malla que combina satélite y estaciones, no un pluviómetro por parcela.

**P:** ¿Qué validación de CHIRPS existe para México?
**R:** Rodríguez-Herrera et al. (2025) encontraron correlación positiva y significativa con estaciones en tres cuencas, RMSE menor de 21 mm en regiones templada y árida, y subestimación en la cuenca tropical. No se encontró validación específica en el Altiplano de altitud elevada.

**P:** ¿Cuál es la revisita combinada de Sentinel-2 y de Landsat 8/9?
**R:** Sentinel-2A y 2B combinados revisitan cada 5 días (10 días cada uno). Landsat 8 y 9 combinados revisitan cada 8 días (16 días cada uno).

**P:** ¿Qué resolución tiene el CEM de INEGI?
**R:** INEGI documenta 15 m para el CEM 3.0 (2012) y 30 m para versiones anteriores. Las capas del reto tienen 120 m, lo que sugiere remuestreo; no se encontró documentación pública de un CEM 4.0.

**P:** ¿Cuántas variables tiene AgERA5 y qué resolución espacial?
**R:** Según CDS y ECMWF, unas 22 variables agronómicas diarias a 0.1° (unos 11 km), desde 1979. El proyecto menciona 27 variables; esa cifra debe revisarse.

**P:** ¿Qué son los cuatro fideicomisos de FIRA?
**R:** FONDO, FEFA, FEGA y FOPESCA. La SHCP es el fideicomitente y el Banco de México el fiduciario, según la página oficial de FIRA en gob.mx/fira.

**P:** ¿Qué variedades de cebada tienen las parcelas del reto?
**R:** Doña Josefa (6 hileras) y Voyager (2 hileras), confirmado por verificación local del equipo. El dataset no indica qué variedad corresponde a cada parcela.

**P:** ¿Qué porcentaje de la cebada de México se siembra en temporal?
**R:** Según un artículo del INIFAP, alrededor de 67 % de la producción corresponde a temporal (primavera-verano) y 33 % a riego (otoño-invierno). La cifra proviene del resumen y no se confirmó en el texto completo.

**P:** ¿Qué cultivos estima la ESA de SIAP para Hidalgo en primavera-verano 2022?
**R:** Maíz grano, sorgo grano, frijol y trigo grano, con 556 parcelas georreferenciadas y 10 imágenes SPOT. La cebada no está en esa lista.

**P:** ¿El Censo Agropecuario 2022 permite calcular el rendimiento de cebada por hectárea cosechada?
**R:** No. Con producción y superficie sembrada se obtiene un cociente por hectárea sembrada, que no es el rendimiento que define SIAP.

**P:** ¿Qué dice el resumen de Solórzano et al. (2020) sobre las observaciones Sentinel-2 en México?
**R:** Según el resumen, hasta 121 observaciones válidas por píxel al año y hasta 6.58 por mes. El porcentaje de escenas válidas de junio a octubre no se leyó.
