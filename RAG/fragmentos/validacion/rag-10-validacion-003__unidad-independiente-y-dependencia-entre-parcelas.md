@id: rag-10-validacion-003
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Unidad independiente y dependencia entre parcelas
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping parcelas unidad validacion dependencia independiente informacion comparten debe lluvia misma mismo observaciones parcela puede roberts suelo veinte adecuado aisladas amplia aportar archivos asignarle barley cien
@fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md; Roberts et al. (2017), https://doi.org/10.1111/ecog.02881
# Unidad independiente y dependencia entre parcelas

(Literatura y proyecto) La unidad de evaluación debe ser la parcela o la parcela-campaña, según los archivos oficiales. Si una parcela se observa en veinte fechas, no hay veinte rendimientos independientes; si contiene cien píxeles, asignarle el mismo rendimiento a cada píxel no multiplica la información. Todas las
observaciones ligadas a una misma unidad deben quedar en la misma partición.

La dependencia puede ser más amplia: parcelas del mismo productor, localidad o sistema de riego comparten lluvia, suelo y manejo. Por eso 138 filas etiquetadas pueden aportar menos información independiente que 138 unidades aisladas. Roberts y colaboradores (2017) muestran que la validación debe reflejar la estructura
espacial, temporal o jerárquica de los datos, y que el diseño adecuado depende del uso previsto (verificado).

(Ejemplo conceptual) Si dos parcelas contiguas comparten lluvia y suelo, entrenar con una y evaluar con la otra mide un desempeño que incluye información contextual compartida. Eso puede ser pertinente para interpolar dentro de una zona, pero no demuestra que el modelo estime una región sin observaciones.

Fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md; Roberts et al. (2017), https://doi.org/10.1111/ecog.02881
