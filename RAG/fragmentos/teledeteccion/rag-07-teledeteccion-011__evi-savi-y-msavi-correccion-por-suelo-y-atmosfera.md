@id: rag-07-teledeteccion-011
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: EVI, SAVI y MSAVI: corrección por suelo y atmósfera
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores savi suelo msavi huete indices atmosfera change constante correccion datos docs dynamic factor forma phenocurve propio verificado abierto ajuste aparecio armonizar articulo atmosfericos
@fuente: dynamic_change__phenocurve__docs__A2_rededge.md; dynamic_change__phenocurve__docs__A1_series.md; reto_y_datos/Diccionario_de_indices_satelitales.txt; Huete et al. (2002), doi 10.1016/S0034-4257(02)00096-2; Qi et al. (1994), doi 10.1016/0034-4257(94)90134-1
# EVI, SAVI y MSAVI: corrección por suelo y atmósfera

EVI (índice de vegetación mejorado) reduce parte de la influencia del suelo y de efectos atmosféricos (Huete et al. 2002; verificado en el resumen de MODIS). SAVI introdujo un factor de ajuste de suelo en el denominador del NDVI (Huete, 1988, Remote Sensing of Environment 25(3):295-309, doi
10.1016/0034-4257(88)90106-X; registro verificado). MSAVI, de Qi et al. (1994), sustituye el factor constante de SAVI por una función variable que se deriva del propio NDVI; en la práctica, muchos programas usan MSAVI2, una versión inductiva sin constante L (la ecuación del artículo original se localizó en
IndexDatabase como 2·NIR + 1 − √((2·NIR + 1)² − 8·(NIR − RED)), citando a Qi et al. 1994; el divisor 1/2 de la forma estándar no apareció en la extracción).
Estos índices son útiles en dosel abierto, como las etapas tempranas de la cebada de temporal, cuando el suelo desnudo pesa en la señal. En nuestros datos, EVI de Sentinel-2 tiene r = 0.997 con el EVI oficial, pero el EVI propio es 0.016 más bajo en promedio. MSAVI de Planet y SAVI de Sentinel-2 tienen r = 0.985. Estos
índices no son intercambiables entre fuentes sin armonizar, aunque ordenen las parcelas de forma similar.

Fuente: dynamic_change__phenocurve__docs__A2_rededge.md; dynamic_change__phenocurve__docs__A1_series.md; reto_y_datos/Diccionario_de_indices_satelitales.txt; Huete et al. (2002), doi 10.1016/S0034-4257(02)00096-2; Qi et al. (1994), doi 10.1016/0034-4257(94)90134-1
