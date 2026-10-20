@id: rag-10-validacion-019
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Compuertas sin etiquetas: descartar antes de mirar el rendimiento
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping etiquetas compuerta compuertas antes datos descartar critique exigia ganancia iterate mirar parcelas profundidad rendimiento research validacion advertencia advirtio ajuste algunas auditoria calcular cambio candidato casos
@fuente: validacion/iterate_20261017__research__critique_feasibility.md; validacion/iterate_20261017__research__critique_expected_value.md
# Compuertas sin etiquetas: descartar antes de mirar el rendimiento

(Nuestros experimentos) Algunas compuertas pudieron evaluarse con datos sin etiquetas, lo que evitó consultas innecesarias. Dos casos ilustran el procedimiento. (a) Para la profundidad de depresión, el modelo de elevación GLO-30 a 30 m dio, en 84 parcelas no reiniciadas de Chignahuapan, cero parcelas con profundidad
mayor que 0.05 m (máximo 0.018 m); la compuerta exigía al menos 10. (b) Para un componente de retardo de cosecha con Sentinel-1, el cociente entre la varianza del cambio en VH durante la tormenta y la del par previo fue 0.91; la compuerta exigía 1.5.

(Regla) Antes de descargar datos o consultar etiquetas, calcular la compuerta con datos disponibles y estimar la ganancia que el candidato podría producir. Si la ganancia máxima plausible es menor que la resolución del criterio, descartar.

(Advertencia) La auditoría advirtió que redefinir la variable hasta que pase la compuerta es "compra de compuertas" y tiene el mismo problema que el ajuste sobre etiquetas.

Fuente: validacion/iterate_20261017__research__critique_feasibility.md; validacion/iterate_20261017__research__critique_expected_value.md
