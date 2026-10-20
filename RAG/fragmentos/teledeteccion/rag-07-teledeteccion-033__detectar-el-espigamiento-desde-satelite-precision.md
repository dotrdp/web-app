@id: rag-07-teledeteccion-033
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Detectar el espigamiento desde satélite: precisión y límites
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores dias espigamiento floracion remote fecha trigo verificado australia campo desde detectar encontro estudio harfenmeister indian invierno limites pagina precision resumen rmse satelite sens sensing
@fuente: literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; Harfenmeister et al. (2021), Remote Sensing 13:5036, doi 10.3390/rs13245036; Jha et al. (2026), J. Indian Soc. Remote Sens., doi 10.1007/s12524-026-02557-0
# Detectar el espigamiento desde satélite: precisión y límites

Los métodos de detección del espigamiento usan mínimos o máximos en series S1, la fecha del pico o del hombro de una curva doble logística de índices ópticos, o priors de grados-día. Las mejores precisiones reportadas son de unos 4–10 días. Ejemplos verificados: en trigo de invierno y cebada de invierno del noreste de
Alemania, un mínimo local de VH y VV de Sentinel-1 cayó a menos de 5 días de la fecha de entrada en espigamiento (Harfenmeister et al. 2021, Remote Sensing 13:5036; verificado en el resumen). En arroz de Nueva Gales del Sur, Australia, el índice CIG de Planet Fusion, con un desfase de unos 13 días, dio RMSE de 6.56 y 7
días para la fecha de floración (Jha et al. 2026, J. Indian Soc. Remote Sens. 54:4297-4310; verificado en el resumen; es floración, no espigamiento). Un estudio de fenología multiespectral de trigo y cebada en Australia (Zhao et al. 2025, in silico Plants 7(2); verificado en la página del artículo) dio un RMSE de 7.66
días para la floración (R² = 0.7) y de 8.67 días para la hoja bandera (R² = 0.61), con 110 campos en 2021 y 73 en 2022. La cifra de 7.7 días del corpus corresponde, por tanto, a la floración y no al espigamiento, y el sensor no se confirmó en la página. La regla de GRVI con 9.63 días no se encontró en las fuentes
consultadas (SIN EVIDENCIA).
No se encontró ningún estudio que detecte el espigamiento de trigo o cebada directamente con PlanetScope contra registros de campo. Las fechas de espigamiento en el reto no están validadas con datos de campo mexicanos.

Fuente: literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; Harfenmeister et al. (2021), Remote Sensing 13:5036, doi 10.3390/rs13245036; Jha et al. (2026), J. Indian Soc. Remote Sens., doi 10.1007/s12524-026-02557-0
