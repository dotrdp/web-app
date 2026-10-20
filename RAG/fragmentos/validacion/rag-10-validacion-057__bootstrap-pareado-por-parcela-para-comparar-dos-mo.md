@id: rag-10-validacion-057
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Bootstrap pareado por parcela para comparar dos modelos
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping parcelas comparar intervalo modelos parcela pareado diferencia efron general linea metodo particiones referencia ronda tibshirani absoluto agrupan apoyo azar bloque calcula cero chapman conjunto
@fuente: método general; referencia de apoyo Efron, B. y Tibshirani, R. J. (1993). An introduction to the bootstrap. Chapman & Hall (no consultada en línea en esta ronda).
# Bootstrap pareado por parcela para comparar dos modelos

(Método estándar y recomendación.) Para comparar dos modelos sobre las mismas parcelas, se calcula para cada parcela i la diferencia de pérdida d_i = e1_i² − e2_i² (o con valor absoluto), a partir de predicciones fuera de pliegue. El bootstrap pareado por unidad remuestrea las parcelas con reemplazo, conservando cada
par (d_i), recalcula la media de d en cada remuestra y toma los percentiles 2.5 y 97.5 como intervalo. Un procedimiento habitual usa B = 2000 remuestras. El intervalo refleja la incertidumbre de muestreo de las parcelas, no la de la elección de particiones: para cubrir esta última conviene repetir la validación cruzada
con varias particiones. Si las parcelas se agrupan en municipios, el remuestreo debe ser por municipio o por bloque espacial. Un intervalo que contiene el cero indica que la diferencia no se distingue del azar con este conjunto. La referencia general (Efron y Tibshirani, 1993) no se consultó en línea en esta ronda.

Fuente: método general; referencia de apoyo Efron, B. y Tibshirani, R. J. (1993). An introduction to the bootstrap. Chapman & Hall (no consultada en línea en esta ronda).
