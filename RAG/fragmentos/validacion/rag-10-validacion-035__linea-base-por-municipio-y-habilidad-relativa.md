@id: rag-10-validacion-035
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Línea base por municipio y habilidad relativa
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping municipio media dentro habilidad validacion base linea relativa research debe fuera global iterate municipal pliegue accuracy alrededor bajo barley calcular calpulalpan casi caso conocidas
@fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md; validacion/iterate_20261017__research__critique_feasibility.md
# Línea base por municipio y habilidad relativa

(Nuestros experimentos) El RMSE de validación de la mejor versión evaluada es prácticamente igual a la desviación estándar dentro de municipio (0.474 frente a 0.475 t/ha). Con un RMSE de 0.46 y la varianza dentro de municipio, el R² de predicción dentro de municipio es de alrededor de 0.06. En Calpulalpan las
predicciones casi no se mueven (rango de la media entre 2.93 y 3.08) y no tienen habilidad dentro del municipio.

(Recomendación) Calcular la habilidad relativa como 1 − MSE del modelo / MSE de la media municipal, fuera de pliegue. Reportar el desglose por municipio con su tamaño de muestra.

Cuando un municipio tiene una sola parcela, su media municipal fuera de pliegue no existe; en ese caso la línea base debe ser la media global o la media contraída hacia ella, y debe declararse así. Un RMSE global bajo puede ocultar que la mayor parte de la ganancia viene de diferencias entre municipios que ya eran
conocidas.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md; validacion/iterate_20261017__research__critique_feasibility.md
