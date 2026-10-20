@id: rag-07-teledeteccion-002
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Sentinel-2 y sus resoluciones nativas
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores bandas eopf cercano independientes nativas observaciones resoluciones swir tienen visibles antes armonizado borde calcular captura celdas change chapters clear conservarse conteo copernicus cualquier
@fuente: literature_review__report__chapters__02_observacion.typ.txt; dynamic_change__phenocurve__docs__A2_rededge.md; ESA EOPF, especificación MSI L2A, https://s2.pages.eopf.copernicus.eu/pdfs-adfs/MSI/L2/PDFS_S2_MSI_L2.myst.html
# Sentinel-2 y sus resoluciones nativas

Sentinel-2 Nivel 2A armonizado ofrece bandas visibles, infrarrojo cercano (NIR), red-edge (borde rojo) y SWIR. Las bandas visibles y NIR de uso frecuente (B2, B3, B4 y B8) tienen 10 m de resolución nativa. Las bandas red-edge (B05, B06, B07, B8A) y SWIR (B11, B12) se distribuyen a 20 m, y B1, B9 y B10 a 60 m
(verificado en la documentación ESA EOPF y en NASA Earthdata). En el proyecto, las bandas de 20 m se remuestrearon a 10 m por vecino más cercano, de modo que las parcelas pequeñas tienen pocas muestras red-edge independientes. El conteo n_clear_px cuenta celdas de 10 m, no observaciones independientes. Las
observaciones se filtran por nubes antes de calcular cualquier índice, y la fecha de captura debe conservarse junto a cada valor para reconstruir la serie.

Fuente: literature_review__report__chapters__02_observacion.typ.txt; dynamic_change__phenocurve__docs__A2_rededge.md; ESA EOPF, especificación MSI L2A, https://s2.pages.eopf.copernicus.eu/pdfs-adfs/MSI/L2/PDFS_S2_MSI_L2.myst.html
