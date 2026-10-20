@id: rag-07-teledeteccion-042
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Armonización por índice: Planet frente a Sentinel-2 en la literatura
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores planet armonizacion indice bandas frente literatura banda clevers gitelson indices resultado sensores solo tiene ajustar ajuste ancho appl barley calibracion cercana change clorofila
@fuente: Clevers y Gitelson (2013), Int. J. Appl. Earth Obs. Geoinf. 23:344-351; literature_review__reports__Panicle_coverage_and_barley_yield.md; dynamic_change__phenocurve__docs__A1_series.md
# Armonización por índice: Planet frente a Sentinel-2 en la literatura

Una comparación entre sensores exige ajustar cada índice por separado. Sentinel-2 tiene bandas red-edge a 20 m (B05–B07, B8A) y Planet, en su constelación SuperDove, tiene una banda red-edge cercana a 705 nm; las dos no son equivalentes en ancho de banda ni en respuesta espectral (verificado en la descripción de
bandas). Por eso los productos de Planet no traen bandas SWIR, y los índices que las usan no son comparables entre sensores (ver fragmento de PlanetScope). Clevers y Gitelson (2013) muestran que los índices red-edge de Sentinel-2 son estimadores lineales de clorofila y nitrógeno en cultivos, lo que da un punto de
partida para la armonización, pero no reemplaza la calibración local. Nuestro resultado interno (NDVI de Planet frente a Sentinel-2, r = 0.991; diferencia +0.075) muestra que la armonización debe ser por índice y por sensor, no un solo ajuste global. Esto es un resultado propio del proyecto; la literatura sólo indica
el procedimiento.

Fuente: Clevers y Gitelson (2013), Int. J. Appl. Earth Obs. Geoinf. 23:344-351; literature_review__reports__Panicle_coverage_and_barley_yield.md; dynamic_change__phenocurve__docs__A1_series.md
