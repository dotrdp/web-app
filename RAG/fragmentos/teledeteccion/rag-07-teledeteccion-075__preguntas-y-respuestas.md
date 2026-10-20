@id: rag-07-teledeteccion-075
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Preguntas y respuestas
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores parcelas tiene pico planet rendimiento curva octubre plateau proyecto bandas biomasa datos dosel fenologia golay hasta mayor meris parcela savitzky solo
@fuente: [literature_review__report__chapters__02_observacion.typ.txt, literature_review__report__chapters__03_representaciones.typ.txt, literature_review__reports__Panicle_coverage_and_barley_yield.md, literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md,
# Preguntas y respuestas

**P:** ¿Qué resolución nativa tienen las bandas red-edge de Sentinel-2 en el proyecto?
**R:** Las bandas red-edge (B05, B06, B07, B8A) y SWIR (B11, B12) se distribuyen principalmente a 20 m; las visibles y NIR de uso frecuente, a 10 m. En el proyecto, las de 20 m se remuestrearon a 10 m por vecino más cercano.

**P:** ¿Por qué HLS no sirve para índices red-edge?
**R:** HLS sí tiene red-edge, pero sólo en su componente S30 (derivado de Sentinel-2). Su componente L30 (HLSL30, de Landsat 8 y 9) no tiene bandas red-edge.

**P:** ¿Cuántos píxeles puros de HLS caben en una parcela de 1 ha?
**R:** Según un cálculo propio con un margen de un píxel, entre 1 y 4 píxeles de 30 m. Sentinel-2 de 10 m tiene 49–64; PlanetScope de 3 m, más de 800.

**P:** ¿Cuál es el criterio de calidad de nubes del proyecto?
**R:** Una observación falla si cloud_pct es mayor que 20 % o falta. Con todos los criterios de calidad, pasan 80.9 % de las filas de Sentinel-2 entre abril y octubre de 2025.

**P:** ¿Qué diferencia hay entre el NDVI de Planet y el de Sentinel-2 en las mismas fechas?
**R:** Tienen r = 0.991 (n = 3,819 parejas). Planet es +0.075 mayor en promedio, con una regresión 0.063 + 1.035 × S2.

**P:** ¿Por qué el pico de NDVI no basta para estimar el rendimiento de cebada?
**R:** Porque el NDVI satura en dosel cerrado y el pico refleja biomasa, no número de granos. En el corpus, el pico suavizado de Sentinel-2 varía sólo de 0.69 a 0.84 entre parcelas, y la información útil está en su tiempo y en la bajada.

**P:** ¿El corte del 31 de octubre trunca la fenología de nuestros datos?
**R:** Sí, en parte. Con Planet NDVI, 65.5 % de las parcelas perdieron menos del 50 % de su amplitud hasta el 31 de octubre (99.5 % con datos hasta el 31 de diciembre, en modo retrospectivo). Con el HLS binario, 114 de 197 parcelas no habían perdido la mitad de su amplitud.

**P:** ¿Qué correlación con rendimiento encontraron nuestros experimentos de fenología?
**R:** Ninguna documentada. Los pipelines A1, A2 y F1 no leyeron etiquetas de rendimiento. Sus correlaciones son internas, por ejemplo plateau con pico (r = 0.952) o K con plateau (r = 0.517) en Planet NDVI.

**P:** ¿En qué municipios se concentra el colapso del dosel de A2?
**R:** En Chignahuapan, con 23 de sus 100 parcelas, y en Calpulalpan, con 7 de 44. Son 30 de 197 parcelas en total, con el colapso entre el 14 de julio y el 3 de agosto de 2025.

**P:** ¿Qué pasa si se ajusta la curva de Bak a Planet NDVI?
**R:** En 19.3 % de los ajustes d1 = d0, la curva se detiene en el punto de inflexión, y en 4.6 % la curvatura a es cero. K tiene un error estándar 7.2 veces mayor que plateau_level, por lo que se recomienda usar plateau_level y su tiempo.

**P:** ¿Cuál es la cifra de cobertura de panícula de arroz que se sugiere trasladar a la cebada?
**R:** K, la meseta de la curva, con r = 0.87 con el rendimiento en 152 parcelas de arroz (Bak et al. 2025). Su traslado a la cebada es una hipótesis: la espiga de cebada no se ve desde satélite, así que se sugiere usar la forma de la curva con un dosel continuo, no la máscara de espiga.

**P:** ¿Qué se sabe del estrés por calor en cebada de temporal?
**R:** En trigo de la India, la senescencia se aceleró tras exposiciones por encima de 34 °C (Lobell et al. 2012). Para el Altiplano, no hay evidencia publicada en el corpus; el calor debe tratarse como hipótesis y el frío nocturno como un riesgo más probable.

**P:** ¿Qué fuente de precipitación usar para el análisis de lluvia del proyecto?
**R:** Depende del análisis. AgERA5 es la fuente preferida de los pipelines de fenología, con datos hasta el 31 de octubre de 2025. CHIRPS tiene malla de 0.05° y ERA5-Land de unos 9 km; ambos son de soporte más amplio que una parcela.

**P:** ¿Qué transforma el MTCI de Sentinel-2 en la fórmula de MERIS?
**R:** El ESA SNAP usa (B6 − B5)/(B5 − B4), con centros de 740, 705 y 665 nm. El diseño viene de Dash y Curran (2004) para MERIS, pero los valores no son comparables directamente con los de MERIS.

**P:** ¿Por qué el NDVI puede subestimar la diferencia entre parcelas de biomasa alta?
**R:** Porque satura: Huete et al. (2002) mostraron que el NDVI se estabiliza en biomasa alta, mientras el EVI sigue variando. En nuestro caso, el pico de NDVI de Sentinel-2 varía sólo de 0.69 a 0.84 entre parcelas.

**P:** ¿Qué hace el suavizado de Whittaker frente al de Savitzky–Golay?
**R:** Eilers (2003) propuso el de Whittaker con penalización continua de la suavidad (parámetro λ), rápido, con interpolación automática de huecos y validación cruzada. Savitzky–Golay usa una ventana y un grado de polinomio. En nuestro pipeline se usa Whittaker con λ = 100 y Savitzky–Golay no se usa.

**P:** ¿En qué revista se publicó el artículo de Gómez Mercado et al. sobre cebada maltera y el método FAO?
**R:** En Agricultura Técnica en México, volumen 35, número 1, páginas 13–23, en 2009. No es Agrociencia.

**P:** ¿Qué precisión tiene la estimación de rendimiento con satélite en parcelas pequeñas intercaladas?
**R:** En 150 parcelas de maíz de pequeños productores del sur de Malaui, con parcela media de 0.17 ha y cerca de la mitad intercalada con leguminosas, Sentinel-2 dio R² = 0.51 y PlanetScope de 3 m dio R² = 0.52 (nRMSE de 19.95 %; Li et al. 2022). Es una referencia de maíz, no de cebada.
