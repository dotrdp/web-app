@id: rag-10-validacion-051
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Errores de reporte de rendimiento: Uganda, Etiopía y la corrección de un solo error
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping cortes economics error journal lobell uganda cosecha development errores etiopia parcela produccion reporte solo verificado abay area autorreportada correccion desaparece desiere gourlay grandes https inversa
@fuente: Gourlay, S., Kilic, T. y Lobell, D. B. (2019). A new spin on an old debate. Journal of Development Economics. https://doi.org/10.1016/j.jdeveco.2019.102376; Desiere, S. y Jolliffe, D. (2018). Land productivity and plot size: Is measurement error driving the inverse relationship? Journal of Developm…
# Errores de reporte de rendimiento: Uganda, Etiopía y la corrección de un solo error

(Literatura.) En Uganda, Gourlay, Kilic y Lobell (2019), con un panel de dos rondas de hogares del este del país, encontraron que la relación inversa entre tamaño de parcela y productividad aparece con producción autorreportada y desaparece con estimaciones basadas en cortes de cosecha y satélite, que apuntan a
rendimientos a escala constante. Atribuyen el patrón a una sobreestimación persistente de la producción autorreportada frente a los cortes, sobre todo en la mitad inferior de la distribución de áreas (verificado en el resumen del artículo). Desiere y Jolliffe (2018) documentan un patrón similar en Etiopía:
sobrerreporte en parcelas pequeñas y subreporte en las grandes, con la relación inversa que desaparece al usar cortes de cosecha (verificado en el resumen). Abay, Tadesse, Barrett y Bernard (2019) muestran que, con errores no clásicos correlacionados en área y producción, corregir solo uno de los dos puede aumentar el
sesgo (verificado en diapositivas de los autores). Lobell y colaboradores (2020) comparan rendimientos autorreportados, cortes de subparcela y cosecha de parcela completa en Uganda, y encuentran brechas grandes entre métodos terrestres; sus cifras específicas no pudieron confirmarse en esta revisión. Para cebada
comercial de Hidalgo, Puebla y Tlaxcala, el corpus no contiene una medición de este error; la prueba recomendada es correlacionar los residuos del modelo con el área de la parcela, porque una correlación así indicaría un artefacto de reporte.

Fuente: Gourlay, S., Kilic, T. y Lobell, D. B. (2019). A new spin on an old debate. Journal of Development Economics. https://doi.org/10.1016/j.jdeveco.2019.102376; Desiere, S. y Jolliffe, D. (2018). Land productivity and plot size: Is measurement error driving the inverse relationship? Journal of Development
Economics, 130, 84-98; Abay, K. A. et al. (2019). Journal of Development Economics, 139, 171-184; Lobell, D. B. et al. (2020). American Journal of Agricultural Economics, https://doi.org/10.1093/ajae/aaz051
