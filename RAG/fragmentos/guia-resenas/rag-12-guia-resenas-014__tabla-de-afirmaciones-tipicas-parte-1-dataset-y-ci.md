@id: rag-12-guia-resenas-014
@documento: rag-12-guia-resenas | temas/12_guia_analista_de_resenas.md
@categoria: guia-resenas
@titulo: Tabla de afirmaciones típicas (parte 1: dataset y cifras del reto)
@titulo_documento: Guía operativa para analizar reseñas del Reto AgroCebada (verificación de afirmaciones, taxonomía de errores, rúbrica y análisis de datos)
@etiquetas: analisis de resenas; verificacion de afirmaciones; errores frecuentes; rubrica de evaluacion; plantillas de respuesta; analisis de datos; mapa de documentos; reto agrocebada; jerga agronomica; clima de temporal; mercado de la cebada; malteo y calidad; medicion del rendimiento; fisiologia de la cebada
@claves: analisis de resenas verificacion de afirmaciones errores frecuentes rubrica de evaluacion plantillas de respuesta analisis de datos mapa de documentos reto agrocebada jerga agronomica clima de temporal mercado de la cebada malteo y calidad medicion del rendimiento fisiologia de la cebada rag-01-reto-datos incorrecta parcelas correcta rendimiento dataset entrenamiento media reto tabla tienen afirmacion afirmaciones cero cifras documentado documento mensuales parte porque rag-11-literatura redondeo referencia tiene tipica
@fuente: 01_reto_agrocebada_y_datos.md; 02_glosario_terminos_es.md; 07_teledeteccion_y_fenologia.md; 10_validacion_fugas_y_muestras_pequenas.md; 11_revision_de_literatura_y_transferencia.md.
# Tabla de afirmaciones típicas (parte 1: dataset y cifras del reto)

Esta tabla consolida los errores frecuentes de los documentos rag-01 a rag-13. Columnas: número, afirmación típica, veredicto y documento de referencia.

| # | Afirmación típica | Veredicto | Documento de referencia |
|---|---|---|---|
| 1 | Las 197 parcelas tienen rendimiento medido en campo | incorrecta | rag-01-reto-datos (138 visibles, 59 ocultas) |
| 2 | El rendimiento de las 197 parcelas está disponible para entrenar | incorrecta | rag-01-reto-datos |
| 3 | Los rasters tienen resolución de 15 m | incorrecta | rag-01-reto-datos (120 m) |
| 4 | Las temperaturas mensuales son la máxima y la mínima del mes | incorrecta | rag-01-reto-datos (promedios mensuales) |
| 5 | Un 0 en un índice es una medición real de cero | incorrecta | rag-01-reto-datos (celda vacía vs cero) |
| 6 | Unir shapefile y CSV por posición de fila es correcto | incorrecta | rag-01-reto-datos (unir por ID) |
| 7 | Planet y Sentinel-2 dan el mismo NDVI porque el nombre es igual | incorrecta | rag-01-reto-datos; rag-07-teledeteccion |
| 8 | El total de 1,032,892 observaciones son parcelas de cebada | incorrecta | rag-01-reto-datos |
| 9 | La media municipal del SIAP es la etiqueta de cada parcela | incorrecta | rag-01-reto-datos; rag-11-literatura |
| 10 | El valor 4.5 t/ha aparece 27 veces porque así se midió | no verificable | rag-01-reto-datos (redondeo no documentado) |
| 11 | Las 197 parcelas se reparten en nueve municipios | correcta | rag-01-reto-datos |
| 12 | Chignahuapan tiene 100 parcelas (71 de entrenamiento y 29 de predicción) | correcta | rag-01-reto-datos |
| 13 | El rendimiento de entrenamiento tiene media de 4 t/ha | imprecisa | rag-01-reto-datos (media 3.955 t/ha) |
| 14 | Las fechas de noviembre y diciembre de 2025 sirven para predecir en octubre | incorrecta | rag-01-reto-datos; rag-11-literatura |
| 15 | El Dataset Básico y el PRO se pueden fusionar | incorrecta | rag-01-reto-datos |
| 16 | La precipitación está en mm y la temperatura en °C | correcta | rag-01-reto-datos |
| 17 | Las 138 parcelas de entrenamiento tienen rendimiento entre 2.00 y 5.59 t/ha | correcta | rag-01-reto-datos |
| 18 | El valor de 4.5 t/ha en 27 parcelas es un error de captura | no verificable | rag-01-reto-datos (método de redondeo no documentado) |

Fuente: 01_reto_agrocebada_y_datos.md; 02_glosario_terminos_es.md; 07_teledeteccion_y_fenologia.md; 10_validacion_fugas_y_muestras_pequenas.md; 11_revision_de_literatura_y_transferencia.md.
