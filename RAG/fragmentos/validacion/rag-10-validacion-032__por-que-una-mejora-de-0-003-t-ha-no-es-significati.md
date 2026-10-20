@id: rag-10-validacion-032
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Por qué una mejora de 0.003 t/ha no es significativa
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping error mejora diferencia estandar research validacion iterate methods significativa small alrededor barley calculo comparacion conclusion considerarse control criterio critique debe decimo decir decision dentro
@fuente: validacion/iterate_20261017__research__critique_expected_value.md; validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md
# Por qué una mejora de 0.003 t/ha no es significativa

(Cálculo) Un RMSE de 0.47 t/ha con n = 138 tiene error estándar de alrededor de 0.029 t/ha. Una diferencia de 0.003 t/ha equivale a un décimo de ese error y a unas 0.6 % del RMSE. Con el error estándar de la comparación única (0.0030), z ≈ 1 y p ≈ 0.3; con el error del efecto de selección (≈ 0.01), z ≈ 0.3 y p ≈ 0.8.

(Nuestros experimentos) En remuestreos de 59 parcelas, la desviación estándar de la diferencia de RMSE entre dos modelos fue 0.0045 t/ha. Una mejora de 0.003 cae dentro del ruido de muestreo de la propia métrica.

(Conclusión) Una mejora de 0.003 t/ha no justifica decir que un modelo es mejor. Debe reportarse como empate, con intervalo, y solo puede considerarse decisión si se preregistró como criterio y la diferencia sobrevive a un control independiente.

Fuente: validacion/iterate_20261017__research__critique_expected_value.md; validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md
