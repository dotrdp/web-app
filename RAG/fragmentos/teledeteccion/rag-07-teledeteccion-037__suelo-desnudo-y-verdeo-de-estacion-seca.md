@id: rag-07-teledeteccion-037
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Suelo desnudo y verdeo de estación seca
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores suelo desnudo estacion seca evidencia malezas mayo parcela predictors riego segun verdeo verdor verificado agotan agua anterior antes australia barbecho barley carbono cifra componentes compuesto
@fuente: modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md
# Suelo desnudo y verdeo de estación seca

Para propiedades de suelo a nivel de parcela, un compuesto de suelo desnudo de Sentinel-2 entre diciembre y mayo (con NDVI < 0.25 y NBR2 < 0.05, según Dvorakova et al. 2022, Geoderma 429:116128; verificado) dio un RMSE de 3.5 ± 0.3 g C/kg para carbono orgánico en validación cruzada (verificado); el R² de 0.5–0.6 para
textura no se encontró en la fuente (SIN EVIDENCIA) y se retira. SoilGrids, a 250 m, es demasiado grueso para una parcela. El verdor de
enero a mayo del año anterior es una señal confundida: puede indicar riego, cultivos forrajeros, malezas o suelos profundos. Las malezas de barbecho agotan agua y nitrógeno, pero la literatura consultada no cuantifica esas pérdidas en t/ha (SIN EVIDENCIA); Osten et al. (2004) reportan, según el resumen, reducciones del
rendimiento del trigo siguiente en Queensland y Australia Occidental, sin cifra. Por eso el verdor de estación seca debe separarse en componentes
(suelo y riego) antes de probarlo como predictor. Esta es una recomendación de la fuente, no un resultado del proyecto.

Fuente: modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md
