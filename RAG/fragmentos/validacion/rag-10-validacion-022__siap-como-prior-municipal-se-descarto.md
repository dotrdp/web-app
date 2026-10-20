@id: rag-10-validacion-022
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: SIAP como prior municipal: se descartó
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping prior siap validacion municipios parcelas descarto ganancia media methods municipal municipales research signo small adoptarlo agronomico altos auditoria ayuda barley coeficiente comparables concentro conjunto correlacion
@fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md
# SIAP como prior municipal: se descartó

(Nuestros experimentos) Se probó usar los rendimientos municipales del SIAP como prior de la media de cada municipio. La correlación entre el rendimiento medio de las parcelas y la media SIAP 2010–2024 fue −0.22 entre los nueve municipios; con el valor SIAP 2025, −0.49. Ponderando por número de parcelas, las
correlaciones fueron −0.05 y −0.21. Las parcelas de FIRA son una población seleccionada con insumos más altos, y su ranking no sigue las estadísticas municipales.

(Resultado) La ganancia en validación cruzada se concentró en dos municipios de una sola parcela y el coeficiente resultó negativo, sin sentido agronómico. Ponderada a la mezcla de municipios del conjunto oculto, la ganancia fue de 0.0004 o 0.0001 t/ha. La decisión de la auditoría fue no adoptarlo.

(Lección) Un prior externo solo ayuda si la relación con la variable objetivo tiene el signo esperado y sobrevive a la validación por grupo. Un prior con signo invertido es una señal de que los datos no son comparables.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md
