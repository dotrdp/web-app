@id: rag-07-teledeteccion-018
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Fenología satelital: las fechas que se pueden extraer
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores fecha extraer fechas greenup50 pico pueden amplitud emergencia espigamiento fenologia hombro inicio satelital senal antes aproximacion ascendente baja barley cercana change confirmada coverage cruce cruza
@fuente: dynamic_change__phenocurve__docs__F1_fits.md; literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md
# Fenología satelital: las fechas que se pueden extraer

Con una serie de un índice verde se pueden extraer varias fechas: inicio de verdeo (green-up, cuando la señal cruza un porcentaje de la amplitud, por ejemplo 50 %), fecha del pico, fecha de inicio de la senescencia o del hombro (cuando la señal baja del 90 % del pico), y duración del plateau. En nuestro pipeline,
greenup50 se define como el último cruce ascendente del 50 % de la amplitud antes del pico. La fecha de emergencia no se estima directamente en las fuentes: greenup50 es la aproximación más cercana, y greenup50 no equivale a la siembra ni a la emergencia. El espigamiento tampoco se observa; el hombro o d1 marca un
evento del dosel, no una fecha de espigamiento confirmada.

Fuente: dynamic_change__phenocurve__docs__F1_fits.md; literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md
