@id: rag-10-validacion-026
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Redondear predicciones a la rejilla: cuándo ayuda y la trampa de la validación
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping validacion redondear rejilla ayuda research desviacion iterate media prediccion predicciones trampa ademas ajuste alrededor bajo barley calculo calpulalpan casi ceiling completo completos condicional conjunto
@fuente: validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/iterate_20261017__research__critique_leakage.md
# Redondear predicciones a la rejilla: cuándo ayuda y la trampa de la validación

(Cálculo propio) Bajo error cuadrático el óptimo es la media condicional E[y|x]. Redondear la predicción a la rejilla de 0.5 solo ayuda si la desviación predictiva es menor que alrededor de h/8 ≈ 0.065 t/ha. Con σ = 0.474, redondear empeora el RMSE: 0.495 sin redondear frente a 0.516 redondeado.

Esa ganancia no es una evidencia válida: 3.0 es la media y la moda del municipio con datos completos, de modo que el nivel del conjunto completo, que incluye las etiquetas del pliegue de prueba, entra en la validación. Además, la predicción de Calpulalpan casi no varía (desviación 0.039).

(Regla) Reportar cualquier ajuste de rejilla como decisión de métrica (MAE) y no como mejora de RMSE validada.

Fuente: validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/iterate_20261017__research__critique_leakage.md
