@id: rag-10-validacion-001
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Resumen
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping auditorias rendimiento resumen agrocebada ajustes amplias busquedas candidatos cebada cifras concretos confirmarse cuantifican debe desbalanceados detectaron distinguibles documento elegidas encontraron error estandar etiquetas externas
@fuente: ["validacion/iterate_20261017__research__critique_leakage.md", "validacion/literature_review__report__sections__06_validacion.typ.txt", "validacion/iterate_20261017__research__B3_small_n_methods.md", "validacion/iterate_20261017__research__critique_expected_value.md",
# Resumen

Este documento resume cómo debe validarse el modelo de rendimiento de cebada maltera de temporal del Reto AgroCebada (138 parcelas con rendimiento, nueve municipios muy desbalanceados, RMSE en t/ha) y qué fugas de información y sesgos de selección detectaron nuestras auditorías. Con n = 138, el error estándar del RMSE
ronda 0.03 t/ha, de modo que mejoras de 0.003 t/ha no son distinguibles del ruido. Las auditorías encontraron riesgos concretos (hipótesis elegidas con todas las etiquetas, búsquedas amplias de candidatos, ajustes sobre las mismas particiones) y cifras que los cuantifican. Las referencias externas se verificaron en
línea el 18 de octubre de 2026; las marcadas como «no verificado» no pudieron confirmarse en esa revisión.
