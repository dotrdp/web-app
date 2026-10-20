@id: rag-10-validacion-055
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Pruebas t corregidas para validación cruzada: Nadeau y Bengio (2003)
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping prueba bengio cruzada nadeau validacion entrenamiento pliegues calculo correccion corregidas diferencias error errores factor particiones propio pruebas varianza aleatorias analisis aplicada articulo compara conjuntos crece
@fuente: Nadeau, C. y Bengio, Y. (2003). Inference for the generalization error. Machine Learning, 52, 239-281. https://doi.org/10.1023/A:1024068626366
# Pruebas t corregidas para validación cruzada: Nadeau y Bengio (2003)

(Literatura y cálculo propio.) Una prueba t pareada aplicada a los errores de validación cruzada trata las diferencias entre pliegues como independientes, pero los conjuntos de entrenamiento se traslapan. Nadeau y Bengio (2003) mostraron que, por esa dependencia, la varianza de la diferencia de errores se subestima y
la prueba rechaza en exceso. Su corrección multiplica la varianza de las diferencias por un factor 1/k + n_prueba/n_entrenamiento, válido para validación cruzada con k pliegues o para particiones aleatorias. Con 138 parcelas y 10 pliegues, n_prueba/n_entrenamiento = 1/9, de modo que el factor pasa de 0.10 (prueba
ingenua) a 0.21, y el error estándar crece unas 1.45 veces. La corrección no sustituye la unidad de análisis: sirve cuando se compara dos modelos sobre las mismas particiones. El cálculo es propio sobre la fórmula; el resumen del artículo no se leyó en esta ronda.

Fuente: Nadeau, C. y Bengio, Y. (2003). Inference for the generalization error. Machine Learning, 52, 239-281. https://doi.org/10.1023/A:1024068626366
