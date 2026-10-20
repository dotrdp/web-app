@id: rag-07-teledeteccion-013
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Índices de red-edge: CIre, MTCI, NDRE
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores cire gitelson indices mtci clorofila dosel alto bandas borde clevers curran dash datos forma indice meris ndre rojo verificado ajuste aplicada appl
@fuente: dynamic_change__phenocurve__docs__A2_rededge.md; literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; Gitelson et al. (2003), J. Plant Physiol. 160:271-282; Clevers y Gitelson (2013), Int. J. Appl. Earth Obs. Geoinf. 23:344-351; Dash y Curran (2004), I…
# Índices de red-edge: CIre, MTCI, NDRE

Los índices de borde rojo usan las bandas 705, 740 y 783 nm de Sentinel-2 (B05, B06, B07). El CIre (índice de clorofila de borde rojo) se define como B07/B05 − 1, la forma de Gitelson et al. (2003) aplicada a Sentinel-2 (fórmula confirmada en una fuente secundaria; el artículo de 2003 se confirmó en sus datos
bibliográficos). Clevers y Gitelson (2013) reportaron el CIre, el CIgreen y el MTCI como estimadores lineales y precisos de clorofila y nitrógeno del dosel en cultivos y pastos con bandas red-edge de Sentinel-2 y -3 (verificado en resumen). El MTCI (índice de clorofila de terreno del MERIS) usa B06, B05 y B04, es decir
(B6 − B5)/(B5 − B4) con los centros de 740, 705 y 665 nm; la forma MERIS (R754, R709, R681) es de Dash y Curran (2004) (verificado en la especificación ESA SNAP). Estos índices tienen menos saturación que el NDVI a dosel alto. En el ajuste de nuestros datos, CIre llegó a 2.5 en octubre en la parcela AGC_175, mientras
su NDVI era de unos 0.8. Este comportamiento sugiere que CIre conserva información en dosel alto, aunque no hay evidencia de su relación con el rendimiento en el corpus.

Fuente: dynamic_change__phenocurve__docs__A2_rededge.md; literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; Gitelson et al. (2003), J. Plant Physiol. 160:271-282; Clevers y Gitelson (2013), Int. J. Appl. Earth Obs. Geoinf. 23:344-351; Dash y Curran (2004), Int. J. Remote
Sens. 25(23):5403-5413, doi 10.1080/0143116042000274015
