@id: rag-02-glosario-016
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Glosario: estadística y validación (métricas de error)
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos error media validacion errores medio metricas municipio varianza absoluto chicco comparison cruzada cuadrado ejemplo entrenamiento estadistica etiquetas explicada mean misma modelo observado parcelas
@fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt; Chicco et al. (2021); reto_y_datos/Descripcion_general_variables_DataSet.txt
# Glosario: estadística y validación (métricas de error)

Contexto: las métricas se calculan sobre las 138 parcelas con rendimiento conocido, en validación cruzada. Todas usan las mismas unidades que la variable (t/ha), salvo R². Un valor de error solo es comparable con otro si se usó el mismo conjunto de parcelas y la misma partición.

- **RMSE (Root Mean Squared Error; raíz del error cuadrático medio)**: raíz de la media de los errores al cuadrado. Penaliza más los errores grandes. Ejemplo del proyecto (validación cruzada, media de 20 particiones): la media municipal del entrenamiento, con la media de la misma fuente cuando el municipio no estaba en
  entrenamiento, tuvo RMSE de 0.4929 t/ha; un modelo de referencia tuvo 0.4802 t/ha.
- **MAE (Mean Absolute Error; error absoluto medio)**: promedio del valor absoluto del error. Es menos sensible a errores extremos. Ejemplo del proyecto: 0.322601 t/ha para la selección por MAE en cinco pliegues sobre 138 etiquetas.
- **R² (coeficiente de determinación)**: proporción de la varianza explicada. Puede ser negativo si el modelo es peor que predecir la media. Chicco y colaboradores (2021) argumentan que es más informativo que RMSE o MAE.
- **R² de Pearson (r²)**: cuadrado de la correlación de Pearson. Ignora desplazamientos y cambios de escala, por lo que no equivale al R² de scikit-learn.
- **Error medio con signo (sesgo; bias)**: promedio de predicción menos observado. Indica sobreestimación o subestimación sistemática.
- **Residual (residuo)**: observado menos predicho, por parcela.
- **Varianza explicada por el municipio**: en las etiquetas del reto, el municipio explica 68.6 % de la varianza del rendimiento (resultado interno).

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt; Chicco et al. (2021); reto_y_datos/Descripcion_general_variables_DataSet.txt
