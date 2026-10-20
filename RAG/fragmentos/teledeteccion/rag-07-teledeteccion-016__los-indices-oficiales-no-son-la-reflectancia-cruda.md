@id: rag-07-teledeteccion-016
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Los índices oficiales no son la reflectancia cruda
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores oficiales reflectancia cruda indices oficial pero absoluto aditivo armonizar aunque causa change clara cobertura comparar consecuencia crece crudos deben dentro diferente docs documentada dosel
@fuente: dynamic_change__phenocurve__docs__A2_rededge.md
# Los índices oficiales no son la reflectancia cruda

Los valores oficiales de Sentinel-2 del reto (ndvi_promedio) y nuestra reflectancia cruda tienen r = 0.988 en todas las parejas, y r = 0.9952 en las limpias (nubosidad oficial 0, cobertura clara de al menos 80 %). Pero la relación es multiplicativa: la pendiente de nuestro NDVI sobre el oficial es 1.118 y el sesgo
crece con el dosel (+0.014 en NDVI ≤ 0.2; +0.097 en NDVI > 0.8). Un modelo aditivo con c = 0.0204 de reflectancia (unos 200 DN) reduce el error absoluto medio de 0.028 a 0.012. La causa más probable es un producto radiométrico diferente, aunque no está documentada. Consecuencia práctica: dentro de una misma fuente las
series se pueden comparar en el tiempo, pero no se deben mezclar niveles oficiales y crudos sin armonizar.

Fuente: dynamic_change__phenocurve__docs__A2_rededge.md
