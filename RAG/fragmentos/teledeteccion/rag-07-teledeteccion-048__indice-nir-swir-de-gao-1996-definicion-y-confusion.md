@id: rag-07-teledeteccion-048
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Índice NIR–SWIR de Gao (1996): definición y confusión de nombres
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores swir agua indice confusion ndmi ndwi definicion estructura fuentes nombres referencia abierta analisis banda bandas busqueda cociente combina combinacion cuerpos deben definio desde distintos efecto
@fuente: Gao (1996), Remote Sensing of Environment 58(3):257-266 (volumen y páginas no verificados en esta ronda); búsqueda en fuentes de referencia sobre el NDMI/NDWI
# Índice NIR–SWIR de Gao (1996): definición y confusión de nombres

Gao (1996) definió un índice de agua líquida de la vegetación desde el espacio, usando la reflectancia en 0.86 µm (NIR) y 1.24 µm (SWIR): (ρ0.86 − ρ1.24)/(ρ0.86 + ρ1.24). Con frecuencia se le llama NDMI o «NDWI de Gao», lo que genera confusión con el NDWI de McFeeters (1996), que usa verde y NIR y se usa para cuerpos
de agua abierta; la literatura recomienda tratarlos como índices distintos (verificado en fuentes de referencia). El NIR–SWIR combina la señal de agua de la hoja con la estructura del mesófilo: el NIR responde sobre todo a la estructura y la materia seca, y el SWIR al agua, así que el cociente reduce el efecto
estructural. Sentinel-2 no tiene una banda de 1.24 µm, por lo que su versión del índice usa otra combinación de bandas y no es numéricamente igual al de Gao. En el proyecto, MSI y NDMI deben nombrarse con su fórmula exacta en cada análisis.

Fuente: Gao (1996), Remote Sensing of Environment 58(3):257-266 (volumen y páginas no verificados en esta ronda); búsqueda en fuentes de referencia sobre el NDMI/NDWI
