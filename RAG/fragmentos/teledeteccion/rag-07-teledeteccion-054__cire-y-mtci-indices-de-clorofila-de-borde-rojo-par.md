@id: rag-07-teledeteccion-054
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: CIre y MTCI: índices de clorofila de borde rojo para cultivos (Gitelson y Clevers)
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores gitelson mtci clorofila cire clevers indices borde cultivos rojo appl banda bandas dosel earth geoinf literatura physiol plant snap algoritmos amplias argumento atribuida
@fuente: Gitelson et al. (2003), J. Plant Physiol. 160:271-282; Clevers y Gitelson (2013), Int. J. Appl. Earth Obs. Geoinf. 23:344-351; ESA SNAP, MTCI, https://step.esa.int/main/wp-content/help/versions/10.0.0/snap-toolboxes/eu.esa.opt.opttbx.radiometric.indices.ui/mtci/MtciAlgorithmSpecification.html
# CIre y MTCI: índices de clorofila de borde rojo para cultivos (Gitelson y Clevers)

Gitelson et al. (2003) propusieron algoritmos para estimar la clorofila de hojas con pocas bandas amplias, en J. Plant Physiol. 160:271–282. El índice CIre, en Sentinel-2, se calcula como B07/B05 − 1 (banda B07 a 783 nm entre banda B05 a 705 nm), una forma que se encuentra en la documentación de Sentinel Hub atribuida
a Gitelson et al. (2003). Clevers y Gitelson (2013), en Int. J. Appl. Earth Obs. Geoinf. 23:344–351, reportaron que CIre, CIgreen y MTCI son estimadores lineales precisos de clorofila y nitrógeno del dosel en cultivos y pastos usando las bandas red-edge de Sentinel-2 y Sentinel-3, que tienen 20 m. El MTCI de Sentinel-2
en SNAP es (B6 − B5)/(B5 − B4). La razón habitual para preferirlos al NDVI en dosel denso es que el borde rojo responde a la clorofila sin saturarse tan pronto (argumento de la literatura citada; en esta ronda no se midió la saturación en cebada). Para la cebada de temporal, la literatura consultada no reporta una
relación de estos índices con el rendimiento; la prueba debe hacerse con datos locales.

Fuente: Gitelson et al. (2003), J. Plant Physiol. 160:271-282; Clevers y Gitelson (2013), Int. J. Appl. Earth Obs. Geoinf. 23:344-351; ESA SNAP, MTCI, https://step.esa.int/main/wp-content/help/versions/10.0.0/snap-toolboxes/eu.esa.opt.opttbx.radiometric.indices.ui/mtci/MtciAlgorithmSpecification.html
