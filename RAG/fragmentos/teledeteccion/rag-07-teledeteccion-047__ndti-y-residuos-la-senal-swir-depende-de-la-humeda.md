@id: rag-07-teledeteccion-047
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: NDTI y residuos: la señal SWIR depende de la humedad del suelo
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores ndti humedad campos resumen suelo swir usgs verificado bandas depende deventer labranza residuo residuos senal swir1 swir2 ademas analisis articulo banda cambia clasificar clasifico cobertura
@fuente: van Deventer et al. (1997), Photogrammetric Engineering & Remote Sensing (resumen verificado); USGS, https://pubs.usgs.gov/publication/70201200
# NDTI y residuos: la señal SWIR depende de la humedad del suelo

Van Deventer et al. (1997) usaron Landsat 5 TM (imagen del 11 de mayo de 1990, condado de Seneca, Ohio) y las diferencias normalizadas de las bandas 5 y 7 para clasificar la labranza en 27 campos; el modelo logístico clasificó correctamente 89 % de los campos (verificado en el resumen del artículo). La forma (SWIR1 −
SWIR2)/(SWIR1 + SWIR2), que hoy se llama NDTI, proviene de esa línea de trabajo y es de uso posterior en la literatura. En Sentinel-2 se usan las bandas B11 (1610 nm) y B12 (2190 nm). Un estudio con WorldView-3 encontró que el SINDRI, de banda más estrecha, superó al NDTI para estimar la cobertura de residuo, y que el
NDTI es menos robusto cuando cambia la humedad del suelo; además, el análisis se limitó a campos con NDVI < 0.3 porque la vegetación verde interfiere con los índices SWIR (verificado en el resumen del USGS). Para el proyecto, esto refuerza la recomendación de tratar NDTI como covariable de residuo y humedad, no como
medida de labranza.

Fuente: van Deventer et al. (1997), Photogrammetric Engineering & Remote Sensing (resumen verificado); USGS, https://pubs.usgs.gov/publication/70201200
