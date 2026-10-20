@id: rag-07-teledeteccion-045
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Cobertura de dosel y sensores de borde rojo: el caso MERIS y MTCI
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores meris mtci borde rojo posicion caso cobertura curran dash dosel espectros sensores snap valores agencia altiplano altos articulo automatizar bandas campo centros cercanos
@fuente: Dash y Curran (2004), Int. J. Remote Sens. 25(23):5403-5413, doi 10.1080/0143116042000274015; ESA SNAP, https://step.esa.int/main/wp-content/help/versions/10.0.0/snap-toolboxes/eu.esa.opt.opttbx.radiometric.indices.ui/mtci/MtciAlgorithmSpecification.html
# Cobertura de dosel y sensores de borde rojo: el caso MERIS y MTCI

Dash y Curran (2004) propusieron el MTCI (MERIS Terrestrial Chlorophyll Index) como sustituto de la posición del borde rojo usando sólo bandas estándar del sensor MERIS. Lo evaluaron con espectros de modelo, espectros de campo y datos MERIS, y encontraron que es fácil de automatizar, que se correlaciona fuertemente con
la posición del borde rojo y que conserva sensibilidad con valores altos de clorofila, donde la posición del borde rojo ya no responde (verificado en el registro del artículo). La Agencia Espacial Europea lo incorporó como producto de nivel 2 de MERIS en marzo de 2004. La forma de Sentinel-2 que usa el ESA SNAP es (B6
− B5)/(B5 − B4), con centros cercanos a 740, 705 y 665 nm, y no es numéricamente idéntica a la de MERIS. Por eso los valores de MTCI de MERIS y de Sentinel-2 no son comparables directamente. Para cebada, la literatura de MTCI es de cultivos en general y no de cebada de temporal en el Altiplano.

Fuente: Dash y Curran (2004), Int. J. Remote Sens. 25(23):5403-5413, doi 10.1080/0143116042000274015; ESA SNAP, https://step.esa.int/main/wp-content/help/versions/10.0.0/snap-toolboxes/eu.esa.opt.opttbx.radiometric.indices.ui/mtci/MtciAlgorithmSpecification.html
