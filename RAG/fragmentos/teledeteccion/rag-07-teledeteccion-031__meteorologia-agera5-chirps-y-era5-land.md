@id: rag-07-teledeteccion-031
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Meteorología: AgERA5, CHIRPS y ERA5-Land
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores agera5 chirps era5-land octubre abril base datos literature mediana meteorologia nuestros panicle precipitacion review tiene varias acumulan ambiente ambos analisis ausencia barley campos cercanos change
@fuente: dynamic_change__phenocurve__docs__A1_series.md; literature_review__report__chapters__02_observacion.typ.txt; literature_review__reports__Panicle_coverage_and_barley_yield.md
# Meteorología: AgERA5, CHIRPS y ERA5-Land

Para el clima se usan varias fuentes con soportes distintos. AgERA5 (preferido en nuestros pipelines) da temperatura media diaria y precipitación por parcela, con datos hasta el 31 de octubre de 2025. Los grados-día de crecimiento (GDD0 con base 0 °C, GDD5 con base 5 °C) se acumulan desde el 1 de abril. CHIRPS tiene
malla de 0.05° y ERA5-Land de unos 9 km; ambos suelen cubrir varias parcelas. Un contraste débil entre campos cercanos puede deberse a esa resolución compartida, no a ausencia de influencia del ambiente. En nuestros datos, la precipitación de abril a octubre (AgERA5) tiene mediana de 652 mm en 2022, 515 mm en 2023, 983
mm en 2024 y 1,096 mm en 2025. El análisis de Panicle usa CHIRPS de mayo a octubre (mediana de 950 mm en 2025, frente a 484 mm en 2022 y 496 mm en 2023); las ventanas no son comparables directamente.

Fuente: dynamic_change__phenocurve__docs__A1_series.md; literature_review__report__chapters__02_observacion.typ.txt; literature_review__reports__Panicle_coverage_and_barley_yield.md
