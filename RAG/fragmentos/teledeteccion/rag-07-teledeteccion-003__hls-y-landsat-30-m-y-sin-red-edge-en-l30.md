@id: rag-07-teledeteccion-003
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: HLS y Landsat: 30 m y sin red-edge en L30
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores landsat nasa observaciones tiene componente mediana octubre predictors solo verificado abril achieve alcanzo analisis aparecia aporta apoyarse aunque bandas barley brecha calidad change chapters
@fuente: literature_review__report__chapters__02_observacion.typ.txt; modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md; dynamic_change__phenocurve__docs__A1_series.md; NASA HLS, https://hls.gsfc.nasa.gov/products-description/s30
# HLS y Landsat: 30 m y sin red-edge en L30

HLS (Harmonized Landsat Sentinel) entrega observaciones a 30 m. En la versión 2.0, su componente L30 (HLSL30) proviene de Landsat 8 y Landsat 9 (OLI y OLI-2) y no tiene bandas red-edge; sólo el componente S30 (HLSS30, derivado de Sentinel-2A/B; la lista de v2.0 incluye también 2C) las tiene, con la respuesta espectral
original de MSI. Por eso un análisis red-edge con HLS debe apoyarse en las observaciones S30 o en Sentinel-2 nativo a 10–20 m (verificado: NASA, descripción del producto S30; LP DAAC, guía de usuario v2, sólo portada consultada). Landsat 6 no alcanzó órbita y no aporta observaciones operativas, aunque aparecía en notas
informales del repositorio (verificado: NASA indica que Landsat 6 «failed to achieve orbit» el 5 de octubre de 1993). Para nuestros datos, la serie Landsat usada en la tabla de calidad tiene una mediana de 15 observaciones válidas por parcela (rango 7–30) entre abril y octubre de 2025, y una brecha máxima mediana de 40
días.

Fuente: literature_review__report__chapters__02_observacion.typ.txt; modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md; dynamic_change__phenocurve__docs__A1_series.md; NASA HLS, https://hls.gsfc.nasa.gov/products-description/s30
