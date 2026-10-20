@id: rag-10-validacion-028
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Errores de reporte de agricultores: sesgos no clásicos
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping reporte clasicos cortes errores lobell verificado ajae cosecha parcela produccion aaz051 abay agricultores area articulo autorreportada cebada cifras desiere encuentran error gourlay grandes inversa jolliffe
@fuente: validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md; validacion/iterate_20261017__research__B3_small_n_methods.md; Gourlay, Kilic y Lobell (2019), JDE, DOI 10.1016/j.jdeveco.2019.102376; Desiere y Jolliffe (2018), JDE 130, 84-98; Abay et al. (…
# Errores de reporte de agricultores: sesgos no clásicos

(Literatura) En encuestas de pequeños productores, los reportes de rendimiento tienen errores no clásicos. En Uganda, Gourlay, Kilic y Lobell (2019), con un panel de dos rondas de hogares del este del país, encuentran que la relación inversa entre tamaño de parcela y productividad aparece con producción autorreportada
y se debilita con cortes de cosecha, y atribuyen el patrón a una sobreestimación persistente de la producción autorreportada frente a los cortes, sobre todo en la mitad inferior de la distribución de áreas (verificado en resumen y ficha del artículo). En Etiopía, Desiere y Jolliffe (2018) documentan un patrón de
sobrerreporte en parcelas pequeñas y subreporte en las grandes, con la relación inversa que desaparece al usar cortes de cosecha (verificado en resumen). Abay, Tadesse, Barrett y Bernard (2019) muestran que, con errores no clásicos correlacionados en área y producción, corregir solo uno de los dos puede aumentar el
sesgo (verificado en diapositivas del equipo de los autores).

(Aplicación) Lobell y colaboradores (2020) comparan rendimientos autorreportados, cortes de subparcela y cosecha de parcela completa, y encuentran brechas grandes entre métodos terrestres; sus cifras específicas (1,826, 728 y 676 kg/ha) no pudieron confirmarse: el artículo (DOI 10.1093/ajae/aaz051) es de acceso
cerrado, no hay PDF accesible y la fuente no pudo leerse (sin evidencia; no verificado en las cifras). Las parcelas de FIRA son comerciales y se venden por peso, pero no hay estudio en el corpus que mida el error de reporte de cebada comercial en México. Se recomienda probar si los residuos del modelo se correlacionan
con el área de la parcela: una correlación así indicaría un artefacto de reporte.

(Gap) No se encontró una medición del error de reporte para cebada maltera en México.

Fuente: validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md; validacion/iterate_20261017__research__B3_small_n_methods.md; Gourlay, Kilic y Lobell (2019), JDE, DOI 10.1016/j.jdeveco.2019.102376; Desiere y Jolliffe (2018), JDE 130, 84-98; Abay et al. (2019), JDE
139, 171-184; Lobell et al. (2020), AJAE, DOI 10.1093/ajae/aaz051
