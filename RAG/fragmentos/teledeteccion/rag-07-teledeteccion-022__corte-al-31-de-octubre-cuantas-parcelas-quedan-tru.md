@id: rag-07-teledeteccion-022
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Corte al 31 de octubre: cuántas parcelas quedan truncadas
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores parcelas corte octubre amplitud cuantas quedan truncadas ajuste alcanza analisis barley binaria binario change cosecha coverage cruce dato datos deja diciembre docs dynamic fecha
@fuente: literature_review__reports__Panicle_coverage_and_barley_yield.md; dynamic_change__phenocurve__docs__F1_fits.md
# Corte al 31 de octubre: cuántas parcelas quedan truncadas

El corte del 31 de octubre de 2025 deja fuera gran parte de la senescencia. Con la forma de Bak sobre el HLS binario, 114 de 197 parcelas no habían perdido el 50 % de su amplitud de NDVI en esa fecha, y la mediana del cruce fue el 1 de noviembre. Ese dato (de la línea de análisis con máscara binaria) probablemente
sobrestima el retraso, porque el rastrojo y las malezas mantienen el NDVI tras la cosecha. Con Planet NDVI, en el ajuste de nuestro pipeline, 65.5 % de las parcelas perdieron menos del 50 % de la amplitud, el hombro no se alcanza en 5.1 % de las parcelas, y en modo retrospectivo (datos hasta el 31 de diciembre) la
pérdida de más del 50 % se observa en 99.5 %.

Fuente: literature_review__reports__Panicle_coverage_and_barley_yield.md; dynamic_change__phenocurve__docs__F1_fits.md
