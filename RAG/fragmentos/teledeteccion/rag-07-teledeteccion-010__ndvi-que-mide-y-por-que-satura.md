@id: rag-07-teledeteccion-010
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: NDVI: qué mide y por qué satura
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores biomasa mide satura barley coverage dosel huete indice literature panicle pico review vegetacion verdor yield ademas alta alto amazonia asintoticamente aumento aunque bajar caida
@fuente: literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; literature_review__reports__Panicle_coverage_and_barley_yield.md; Huete et al. (2002), doi 10.1016/S0034-4257(02)00096-2
# NDVI: qué mide y por qué satura

El NDVI (índice de vegetación de diferencia normalizada) mide presencia y vigor de vegetación verde a partir del contraste entre NIR y rojo. Es el índice más usado para fenología, pero en dosel cerrado satura: un aumento de biomasa ya no se refleja en el valor. Huete et al. (2002) mostraron con MODIS que el NDVI se
estabiliza asintóticamente en regiones de biomasa alta (como la Amazonia), mientras el EVI sigue siendo sensible a la variación del dosel (verificado en resumen). En nuestra serie de Sentinel-2, el pico suavizado de NDVI varía entre parcelas sólo de 0.69 a 0.84 (percentiles 10 y 90). Además, en trigo el NDVI empieza a
bajar al inicio del llenado de grano aunque la inspección visual del verdor no cambie. Por eso una caída de NDVI no siempre es pérdida de verdor, y un pico alto puede esconder diferencias de biomasa.

Fuente: literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; literature_review__reports__Panicle_coverage_and_barley_yield.md; Huete et al. (2002), doi 10.1016/S0034-4257(02)00096-2
