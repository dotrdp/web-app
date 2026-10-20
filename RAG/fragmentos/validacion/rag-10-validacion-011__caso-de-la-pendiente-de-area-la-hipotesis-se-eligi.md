@id: rag-10-validacion-011
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Caso de la pendiente de área: la hipótesis se eligió con todas las etiquetas
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping hipotesis area dentro exploracion pendiente seleccion auditoria caso critique eligio etiquetas iterate mediana nulo particiones percentil referencia research solo todas validacion version aceptacion advertencia analisis
@fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_feasibility.md
# Caso de la pendiente de área: la hipótesis se eligió con todas las etiquetas

(Nuestros experimentos, diagnóstico) Dentro de Chignahuapan, la correlación entre el residuo del modelo de referencia y el logaritmo del área de la parcela fue −0.225 en la primera exploración. Esa exploración usó las 21 particiones, incluidas las 10 de confirmación. La hipótesis se propuso como puntuación
preregistrada solo después de esa exploración, y su evaluación posterior en particiones nuevas no era independiente de la elección.

(Cálculo de la auditoría) Un análisis de selección por permutación de residuos dentro de municipio dio, para la mejor geometría descriptiva, una ganancia aparente con media 0.0055, mediana 0.0042 y percentil 95 de 0.0163 t/ha. El umbral de aceptación del candidato era 0.0064, entre la mediana y el percentil 95 del
nulo. El precursor de esa hipótesis tuvo p = 0.59 en su propia prueba de selección.

(Advertencia) La auditoría señaló que la regla de referencia usó un método de pendiente residual con fuga, por lo que solo es indicativa para la versión dentro de los miembros del conjunto; todavía no existe un nulo de selección para esa versión.

Fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_feasibility.md
