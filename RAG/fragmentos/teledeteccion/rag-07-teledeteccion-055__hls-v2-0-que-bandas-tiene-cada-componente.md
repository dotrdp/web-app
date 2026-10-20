@id: rag-07-teledeteccion-055
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: HLS v2.0: qué bandas tiene cada componente
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores bandas landsat version componente tiene daac debe deriva guia guide https nasa respuesta tambien user ajustan analisis angulo aplica basarse brdf completa confirmarse conserva
@fuente: NASA HLS, https://hls.gsfc.nasa.gov/products-description/s30; LP DAAC, HLS User Guide V2, https://lpdaac.usgs.gov/documents/1698/HLS_User_Guide_V2.pdf (solo portada consultada)
# HLS v2.0: qué bandas tiene cada componente

HLS (Harmonized Landsat Sentinel) distribuye dos productos. El HLSL30 deriva de Landsat 8 y Landsat 9 (sensores OLI y OLI-2) a 30 m y no tiene bandas red-edge. El HLSS30 deriva de Sentinel-2A y 2B, y la lista de la versión 2.0 también incluye 2C; a 30 m conserva la respuesta espectral original de MSI en las bandas NIR
y red-edge, mientras que las demás bandas se ajustan hacia la respuesta de Landsat. Según la guía de usuario de la versión 1.5, la corrección BRDF por ángulo de visión también se aplica a las bandas red-edge de Sentinel-2. Por eso, un análisis red-edge con HLS debe basarse en el componente S30. La guía de la versión
2.0 no se pudo leer completa en esta ronda, así que la tabla exacta de bandas de la versión 2.0 debe confirmarse en la documentación del LP DAAC.

Fuente: NASA HLS, https://hls.gsfc.nasa.gov/products-description/s30; LP DAAC, HLS User Guide V2, https://lpdaac.usgs.gov/documents/1698/HLS_User_Guide_V2.pdf (solo portada consultada)
