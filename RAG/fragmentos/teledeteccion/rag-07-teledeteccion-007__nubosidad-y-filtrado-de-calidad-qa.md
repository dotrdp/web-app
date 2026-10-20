@id: rag-07-teledeteccion-007
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Nubosidad y filtrado de calidad (QA)
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores calidad dosel filas filtrado picos valor abril aparecen atipico caso change cloud dentro desviacion detectado docs dswi dynamic errores estandar falla falta filtro frecuentes
@fuente: dynamic_change__phenocurve__docs__A1_series.md
# Nubosidad y filtrado de calidad (QA)

En el proyecto, una observación falla la calidad si cloud_pct > 20 % (o si falta), si el valor es imposible según sus límites (NDVI, EVI, etc. en [-1, 1]; LAI en [-1.5, 10]), si la media cae fuera de [vmin, vmax] por más de 0.002, si la desviación estándar dentro de la parcela es un valor atípico para el nivel de
dosel, o si es un pico detectado con un filtro Hampel. Entre abril y octubre de 2025, pasan la calidad 81.5 % de las filas Landsat, 83.3 % de Planet y 80.9 % de Sentinel-2. Los picos aparecen en 2–5 % de las filas de dosel. En los índices de residuo y SWIR (CRC, DSWI, NDSVI, SRNDI) los picos son dos veces más
frecuentes tras lluvia; en ese caso no son errores de sensor, sino transitorios reales de humedad superficial.

Fuente: dynamic_change__phenocurve__docs__A1_series.md
