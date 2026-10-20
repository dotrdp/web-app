@id: rag-10-validacion-004
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Validación cruzada repetida y error estándar del RMSE
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping error estandar validacion barley modelado notes particion research yield aproximacion cruzada highlands label mexican pliegues predictors proyecto regla repetida accuracy aproxima azar calculo
@fuente: validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md;
# Validación cruzada repetida y error estándar del RMSE

(Nuestros experimentos y cálculo propio) Con n = 138 y una desviación de error cercana a 0.474 t/ha, el error estándar de un RMSE de una sola partición se aproxima por σ/√(2n): 0.474/√276 ≈ 0.029 t/ha. Es una aproximación heurística del proyecto, no una fórmula estándar del RMSE; el error estándar real depende del
esquema de partición. Con esa aproximación, un RMSE de 0.46 o de 0.47 puede deberse al azar de la partición.

Para reducir la variabilidad de la estimación se recomiendan validaciones repetidas (por ejemplo, 5 pliegues repetidos 20 o 50 veces con semillas distintas), comparando modelos con diferencias pareadas por pliegue o por parcela, y reportando la media de la diferencia con un intervalo bootstrap. Aun así, las
repeticiones no eliminan el sesgo de selección si los mismos pliegues se usan para elegir entre candidatos.

(Regla práctica del proyecto) Las notas de métodos para muestras pequeñas proponen tratar como indistinguibles de cero las mejoras menores de 0.01 a 0.02 t/ha, salvo que el error estándar pareado sea claramente menor. Esta regla es una recomendación, no un resultado experimental.

Fuente: validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md;
validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md
