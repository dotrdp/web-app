@id: rag-10-validacion-046
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Corregir la elección del mejor candidato: Tibshirani y Tibshirani (2009) y Tsamardinos et al. (2018)
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping tibshirani candidato error tsamardinos correccion cruzada mejor validacion borboudakis candidatos corregir cross-validation eleccion elegir greasidou https pliegue proponen accurate adicional afirman ajuste anidada annals aoas224
@fuente: Tibshirani, R. J. y Tibshirani, R. (2009). A bias correction for the minimum error rate in cross-validation. Annals of Applied Statistics, 3(2), 822-829. https://doi.org/10.1214/08-AOAS224; Tsamardinos, I., Greasidou, E. y Borboudakis, G. (2018). Bootstrapping the out-of-sample predictions for effi…
# Corregir la elección del mejor candidato: Tibshirani y Tibshirani (2009) y Tsamardinos et al. (2018)

(Literatura, verificado.) Tibshirani y Tibshirani (2009) muestran que el error mínimo de validación cruzada usado para elegir el parámetro de ajuste está sesgado a la baja como estimador del error de prueba, y proponen una corrección que se obtiene de las curvas de error de cada pliegue, sin costo computacional
adicional. Tsamardinos, Greasidou y Borboudakis (2018) proponen un procedimiento bootstrap que corrige el puntaje de validación cruzada del mejor candidato usando sus predicciones fuera de pliegue, sin reentrenar el modelo; en su versión publicada la variante con descarte de candidatos se llama BBCD-CV, y los autores
afirman que es más barato que la validación cruzada anidada y que sirve para cualquier métrica. El nombre BBC-CV de las notas del corpus es cercano a esa familia, pero no es el título del artículo. La corrección no elimina el sesgo de elegir entre muchos candidatos: lo estima. Por eso el resultado de la comparación
debe reportarse con su corrección junto a la cifra de cada candidato.

Fuente: Tibshirani, R. J. y Tibshirani, R. (2009). A bias correction for the minimum error rate in cross-validation. Annals of Applied Statistics, 3(2), 822-829. https://doi.org/10.1214/08-AOAS224; Tsamardinos, I., Greasidou, E. y Borboudakis, G. (2018). Bootstrapping the out-of-sample predictions for efficient and
accurate cross-validation. Machine Learning. https://doi.org/10.1007/s10994-018-5714-4
