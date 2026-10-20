@id: rag-10-validacion-010
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Maldición del ganador: probar muchos candidatos
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping candidatos mejor candidato estandar hansen muchos prueba seleccion tsamardinos bbc-cv desviacion efecto frente ganador ganancia maldicion nombre probar realidad referencia s10994-018-5714-4 seleccionado validacion white accurate
@fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; Tsamardinos et al. (2018), https://doi.org/10.1007/s10994-018-5714-4; Hansen (2005), Journal of Business and Economic Statistics, 23(4), 365-380
# Maldición del ganador: probar muchos candidatos

(Literatura) Cuando se prueban muchos candidatos y se reporta el mejor, la ganancia observada contiene una componente de azar que no se repetirá. White (2000) propuso una prueba de realidad (reality check) que compara el mejor candidato contra la hipótesis de que ninguno es mejor (citada de forma indirecta en Hansen,
2005; no leída en su fuente primaria). Hansen (2005) propone la prueba de capacidad predictiva superior (SPA), que modifica la de White normalizando las diferencias medias por una estimación de su desviación estándar, lo que da más potencia (verificado en descripción secundaria).

(Nuestros experimentos) Con 37 candidatos, la corrección por validación cruzada con bootstrap (BBC-CV, Tsamardinos et al., 2018) estimó un efecto de selección de +0.0028 t/ha (desarrollo) y +0.0027 t/ha (confirmación) frente a la referencia C2; es decir, el mejor candidato resultó peor fuera de bolsa. La probabilidad
de que el seleccionado superara a C2 fue de 0.38. El candidato más frecuentemente seleccionado en las remuestras lo fue solo entre 20 % y 25 % de las veces. La prueba de realidad sobre los 31 candidatos competitivos dio p = 0.63.

(Nota de nombre) El artículo de Tsamardinos, Greasidou y Borboudakis (2018, Machine Learning, DOI 10.1007/s10994-018-5714-4) se titula «Bootstrapping the out-of-sample predictions for efficient and accurate cross-validation». Su versión publicada llama BBCD-CV a la variante con descarte de candidatos; «BBC-CV» es el
nombre usado en las notas del corpus.

(Cifra clave) Una comparación única y preespecificada frente a la referencia tuvo −0.0025 t/ha con error estándar 0.0030. El efecto de selección tenía una desviación estándar cercana a 0.01 t/ha. Con esos números, la ganancia de selección no es distinguible de cero.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; Tsamardinos et al. (2018), https://doi.org/10.1007/s10994-018-5714-4; Hansen (2005), Journal of Business and Economic Statistics, 23(4), 365-380
