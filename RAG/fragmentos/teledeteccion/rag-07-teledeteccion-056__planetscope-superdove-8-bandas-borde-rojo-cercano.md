@id: rag-07-teledeteccion-056
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: PlanetScope SuperDove: 8 bandas, borde rojo cercano a 705 nm y sin SWIR
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores bandas rojo borde swir cercano planetscope planet superdove https nasa resolucion tiene verde algunos amarillo analisis armonizar articulos assessment azul banda calcular centro cerca citan
@fuente: NASA, PlanetSuperDove geometric assessment (2024), https://www.earthdata.nasa.gov/s3fs-public/2024-05/NASA-PlanetSuperDoveGeometricAssessment-04092024%20Report.pdf; ESA eoportal, PlanetScope, https://dragon3.esa.int/eogateway/missions/PlanetScope
# PlanetScope SuperDove: 8 bandas, borde rojo cercano a 705 nm y sin SWIR

El satélite SuperDove de Planet tiene 8 bandas: costera, azul, verde I, verde, amarillo, rojo, borde rojo e infrarrojo cercano. La banda de borde rojo tiene un rango cercano a 697–713 nm, con centro cerca de 705 nm. Ninguna de sus bandas es SWIR, por lo que los índices que dependen de SWIR (como NDTI o el NDMI SWIR) no
se pueden calcular con esta constelación. Sobre la resolución, el tamaño de píxel nadir nativo se reporta como 3.7 m en la documentación de Planet y de ESA; los productos remuestreados de 8 bandas se citan como de unos 3 m, y algunos artículos usan 4 m. Las fuentes no son uniformes, así que el producto y la resolución
deben declararse en cada análisis. Para el proyecto, esto implica armonizar el borde rojo de Planet con el de Sentinel-2 por índice y no tratar las bandas como equivalentes.

Fuente: NASA, PlanetSuperDove geometric assessment (2024), https://www.earthdata.nasa.gov/s3fs-public/2024-05/NASA-PlanetSuperDoveGeometricAssessment-04092024%20Report.pdf; ESA eoportal, PlanetScope, https://dragon3.esa.int/eogateway/missions/PlanetScope
