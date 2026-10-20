@id: rag-07-teledeteccion-005
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Resolución frente al tamaño de la parcela
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores parcela pixeles calculo quedan barley bordes frente margen pixel predictors propio puros resolucion tamano yield adentro aritmetica borde caben campo conjunto contiene coverage cuadrada cuantos
@fuente: modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md; literature_review__reports__Panicle_coverage_and_barley_yield.md (cálculo propio con el margen de un píxel)
# Resolución frente al tamaño de la parcela

La pregunta práctica es cuántos píxeles puros caben dentro de una parcela. Para una parcela cuadrada de 1 ha (100 m × 100 m), con un píxel de margen hacia adentro para proteger de la mezcla de bordes, el cálculo es el siguiente. Con HLS de 30 m quedan 1–4 píxeles puros. Con Sentinel-2 de 10 m quedan 49–64. Con
PlanetScope de 3 m quedan más de 800. Esta aritmética es un cálculo propio, no un resultado publicado. La parcela más pequeña del conjunto (0.35 ha) contiene unos cuatro píxeles de 30 m, todos mezclados con bordes de campo. Un promedio HLS de parcelas pequeñas de temporal está dominado por píxeles de borde.

Fuente: modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md; literature_review__reports__Panicle_coverage_and_barley_yield.md (cálculo propio con el margen de un píxel)
