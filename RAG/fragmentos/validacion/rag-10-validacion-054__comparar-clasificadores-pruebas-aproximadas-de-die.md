@id: rag-10-validacion-054
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Comparar clasificadores: pruebas aproximadas de Dietterich (1998)
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping prueba error tipo dietterich pruebas aproximadas comparar cruzada diferencia validacion aceptable algoritmos cinco clasificadores ejecutarse mcnemar pliegues pueden recomendacion tiene aleatorias algo algorithms algoritmo alto
@fuente: Dietterich, T. G. (1998). Approximate statistical tests for comparing supervised classification learning algorithms. Neural Computation, 10, 1895-1923. https://doi.org/10.1162/089976698300017197
# Comparar clasificadores: pruebas aproximadas de Dietterich (1998)

(Literatura.) Al comparar dos algoritmos de aprendizaje supervisado sobre un mismo conjunto de datos, una diferencia pequeña en el error de validación cruzada no siempre es significativa. Dietterich (1998) evaluó cinco pruebas estadísticas aproximadas para decidir si un algoritmo supera a otro, midiendo su error tipo I
(declarar una diferencia que no existe) y su potencia. Según el resumen del artículo, dos pruebas usadas con frecuencia, la prueba de dos proporciones y la prueba t pareada sobre varias divisiones aleatorias entre entrenamiento y prueba, tienen un error tipo I alto y no deben usarse. La t de validación cruzada de 10
pliegues tiene un error tipo I algo elevado. La prueba 5×2 cv, basada en cinco repeticiones de validación cruzada de dos pliegues, tiene un error tipo I aceptable. Su recomendación depende del costo computacional: si los algoritmos solo pueden ejecutarse una vez, la prueba de McNemar es la única con error tipo I
aceptable; si pueden ejecutarse diez veces, se recomienda la prueba 5×2 cv, ligeramente más potente que McNemar. Con 138 parcelas, una diferencia de 0.003 t/ha no justifica una conclusión sin una prueba de este tipo o un intervalo pareado (recomendación).

Fuente: Dietterich, T. G. (1998). Approximate statistical tests for comparing supervised classification learning algorithms. Neural Computation, 10, 1895-1923. https://doi.org/10.1162/089976698300017197
