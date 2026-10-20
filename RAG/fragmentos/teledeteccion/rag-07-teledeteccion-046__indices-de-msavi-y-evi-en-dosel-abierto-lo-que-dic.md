@id: rag-07-teledeteccion-046
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Índices de MSAVI y EVI en dosel abierto: lo que dice la literatura
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores dosel msavi suelo indices abierto constante dice huete literatura senal usan vegetacion algodon alternativa alto aparecer articulo atmosfera aumentar avion base campo confirmar
@fuente: Qi et al. (1994), Remote Sensing of Environment 48(2):119-126, doi 10.1016/0034-4257(94)90134-1; Huete et al. (2002), doi 10.1016/S0034-4257(02)00096-2
# Índices de MSAVI y EVI en dosel abierto: lo que dice la literatura

Qi et al. (1994) propusieron el MSAVI para aumentar el rango dinámico de la señal de vegetación y reducir la influencia del suelo. En lugar del factor constante L de SAVI, usan una función variable que se deriva por inducción o a partir del producto de NDVI y WDVI. Lo probaron en dosel de algodón medido en campo y
desde avión, con una relación entre señal de vegetación y ruido del suelo mayor que la de otros índices (verificado en el resumen). Muchos programas usan MSAVI2, una versión inductiva sin constante L. Para cebada temprana, con suelo visible entre hileras, el MSAVI es una alternativa razonable al NDVI; su ecuación
exacta debe confirmarse en el artículo original. La base IndexDatabase la transcribe como 2·NIR + 1 − √((2·NIR + 1)² − 8·(NIR − RED)); el divisor 1/2 que suele aparecer en la forma estándar queda por confirmar. El EVI de Huete et al. (2002) es otra opción de corrección de suelo y atmósfera, con sensibilidad en dosel
alto.

Fuente: Qi et al. (1994), Remote Sensing of Environment 48(2):119-126, doi 10.1016/0034-4257(94)90134-1; Huete et al. (2002), doi 10.1016/S0034-4257(02)00096-2
