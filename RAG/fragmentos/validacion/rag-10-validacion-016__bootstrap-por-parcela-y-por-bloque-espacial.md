@id: rag-10-validacion-016
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Bootstrap por parcela y por bloque espacial
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping parcela validacion ambos bloque bloques espacial espaciales municipios parcelas remuestrear advertencia aumenta base bbc-cv bolsa coinciden comparacion confianza confirmacion conjuntos contra debe dependencia desarrollo
@fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/literature_review__report__sections__06_validacion.typ.txt
# Bootstrap por parcela y por bloque espacial

(Literatura) El bootstrap para diferencias de desempeño debe remuestrear unidades independientes: parcelas o bloques espaciales, no píxeles ni fechas repetidas. Con solo tres estados o nueve municipios, remuestrear municipios no produce una inferencia sólida porque hay muy pocas realizaciones.

(Nuestros experimentos) La BBC-CV con 4,000 remuestreos por parcela dio +0.0028 (desarrollo) y +0.0027 (confirmación) t/ha; con bloques espaciales de 25 grupos dio +0.0027 en ambos conjuntos. Las probabilidades de que el seleccionado superara a la referencia fuera de bolsa fueron 0.38 y 0.35. Ambos resultados
coinciden, lo que aumenta la confianza en que el efecto de selección es pequeño.

(Advertencia) Un intervalo bootstrap sobre un RMSE de 138 parcelas puede subcubrir cuando hay dependencia no modelada. Presentarlo junto con la distribución por municipio y con la comparación contra una línea base.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/literature_review__report__sections__06_validacion.typ.txt
