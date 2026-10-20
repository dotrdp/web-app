@id: rag-12-guia-resenas-032
@documento: rag-12-guia-resenas | temas/12_guia_analista_de_resenas.md
@categoria: guia-resenas
@titulo: Mapa de documentos: teledetección, experimentos, validación, literatura y seguros
@titulo_documento: Guía operativa para analizar reseñas del Reto AgroCebada (verificación de afirmaciones, taxonomía de errores, rúbrica y análisis de datos)
@etiquetas: analisis de resenas; verificacion de afirmaciones; errores frecuentes; rubrica de evaluacion; plantillas de respuesta; analisis de datos; mapa de documentos; reto agrocebada; jerga agronomica; clima de temporal; mercado de la cebada; malteo y calidad; medicion del rendimiento; fisiologia de la cebada
@claves: analisis de resenas verificacion de afirmaciones errores frecuentes rubrica de evaluacion plantillas de respuesta analisis de datos mapa de documentos reto agrocebada jerga agronomica clima de temporal mercado de la cebada malteo y calidad medicion del rendimiento fisiologia de la cebada validacion fenologia modelos experimentos grep canopy cruzada dona error estandar josefa literatura localiza pixel seguros teledeteccion acentos alphaearth antes apar apsim cimmyt deepcropnet documentos dssat
@fuente: 01_reto_agrocebada_y_datos.md; 02_glosario_terminos_es.md; 03_agronomia_cebada_altiplano.md; 04_amplitud_significados.md; 05_acelerar_crecimiento_a_costa_del_piso.md; 06_plagas_enfermedades_y_deteccion_de_danos.md; 07_teledeteccion_y_fenologia.md; 08_experimentos_modelos_profundos_y_fundacionales.m…
# Mapa de documentos: teledetección, experimentos, validación, literatura y seguros

Usa rag-07-teledeteccion para sensores (Sentinel-2, Sentinel-1, PlanetScope, HLS, Landsat), resolución de píxel, fenología (greenup, senescencia, espigamiento, floración), cobertura de espiga y la comparación entre sensores. Usa rag-08-experimentos-profundos para modelos de aprendizaje profundo y fundacionales
(MMST-ViT, AlphaEarth, Prithvi, DeepCropNet), modelos de proceso (WOFOST, DSSAT, APSIM, SCYM). Usa rag-09-experimentos-tabulares para Kumo, APAR, CANOPY_JOINT, pliegues, OOF, efectos municipales, kriging, tamaño de parcela y grados-día. Usa rag-10-validacion para fugas, validación cruzada, error estándar, muestras
pequeñas, redondeo, selección de modelos y validación espacial. Usa rag-11-literatura para revisión bibliográfica, transferencia, EarthShift, CIMMYT, FND, FIRA, seguros y hipótesis de impacto. Para comparaciones entre modelos, consulta siempre rag-10-validacion antes de citar una diferencia de RMSE de rag-08 o rag-09.

Palabras clave para grep: «PlanetScope» / «Planet», «Sentinel-2» / «Sentinel 2», «Sentinel-1» / «S1», «HLS», «HLSL30», «HLSS30», «DSWx», «píxel» / «pixel», «red-edge» / «red edge», «greenup», «senescencia», «espiga», «CDI», «Hassan», «Blum», «Presto», «EVI», «MTCI», «PSRI», «NDMI», «SAVI», «AlphaEarth»,
«GOOGLE_SATELLITE_EMBEDDING», «MMST», «Prithvi», «DeepCropNet», «WOFOST», «DSSAT», «APSIM», «SCYM», «CANOPY», «GRU», «PANGAEA», «GEO-Bench», «OOF», «fold» / «pliegue», «Kumo», «KumoRFM», «OpenMDW», «pinball», «APAR», «kriging», «Monteith», «Lowder», «McMaster», «WorldCover», «Desiere», «Nedungadi», «TabPFN»,
«validación cruzada» / «validacion cruzada», «fuga», «BBC-CV», «Tsamardinos», «Wang y Heitjan» / «heaping», «Ploton», «Wadoux», «Roberts», «Stein», «Nadeau», «Diebold», «Holm», «conformal», «error estándar» / «error estandar», «CIMMYT», «968», «Gardeazábal» / «Gardeazabal», «Ferguson», «EarthShift», «Franch», «Corley»,
«Iranzo», «Presto», «FND», «Fondo Nacional de Fomento», «liquidación» / «liquidacion», «AGROASEMEX», «seguro paramétrico» / «seguro parametrico», «FIRA», «Miranda», «Jain», «Lobell», «Gómez Mercado» / «Gomez Mercado», «AquaCrop», «Sharifi», «Acambay», «Fonteyne».

Para localizar una evidencia, busca sin distinguir mayúsculas y con y sin acentos, porque las citas y los nombres de archivo usan ambas formas. Ejemplos: `grep -il "fenologia\|fenología"` localiza fenología; `grep -il "piso de arado"` localiza el término de labranza; `grep -il "Doña Josefa\|Dona Josefa"` localiza la
variedad. Si una cifra no aparece en ningún documento, la afirmación es «no verificable» y no debe marcarse como incorrecta sin otra fuente. Antes de declarar que un término está ausente, repite la búsqueda con mayúsculas, con acentos y con guiones bajos, porque varios nombres aparecen como identificadores (por
ejemplo, CANOPY_JOINT o ID_POLIGONO).

Fuente: 01_reto_agrocebada_y_datos.md; 02_glosario_terminos_es.md; 03_agronomia_cebada_altiplano.md; 04_amplitud_significados.md; 05_acelerar_crecimiento_a_costa_del_piso.md; 06_plagas_enfermedades_y_deteccion_de_danos.md; 07_teledeteccion_y_fenologia.md; 08_experimentos_modelos_profundos_y_fundacionales.md;
09_experimentos_tabulares_espaciales_y_fenologicos.md; 10_validacion_fugas_y_muestras_pequenas.md; 11_revision_de_literatura_y_transferencia.md; 13_variedades_dona_josefa_y_voyager.md.
