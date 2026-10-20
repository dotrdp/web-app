@id: rag-02-glosario-019
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Glosario: aprendizaje automático (conceptos básicos)
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos modelo datos reto aprendizaje automatico entrenamiento literature modelos predecir regresion review valor ajuste aplicacion basicos comparison conceptos corpus etiquetas literatura numerico prediccion rendimiento report
@fuente: literatura_aplicacion/literature_review__report__sections__05_modelos.typ.txt; reto_y_datos/literature_review__report__sections__02_reto_corpus.typ.txt; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt
# Glosario: aprendizaje automático (conceptos básicos)

Contexto: el problema del reto es de regresión: predecir un valor numérico (t/ha) con unas 138 etiquetas y 59 casos de predicción. La escasez de etiquetas favorece modelos simples y regularizados, aunque el proyecto evalúa varias familias.

- **Aprendizaje automático (machine learning)**: ajuste de un modelo a partir de datos para predecir o clasificar.
- **Regresión**: predicción de un valor numérico continuo, como el rendimiento.
- **Etiqueta o variable objetivo (label, target)**: valor que se quiere predecir. En el reto, el rendimiento de cada parcela con dato conocido.
- **Característica (feature)**: variable de entrada del modelo, como un índice, la precipitación o la elevación.
- **Entrenamiento (fit)**: ajuste de los parámetros del modelo con datos de entrenamiento.
- **Sobreajuste (overfitting)**: el modelo memoriza el ruido de su entrenamiento y generaliza mal. El corpus advierte que los modelos de boosting con búsqueda extensa son propensos a él.
- **Subajuste (underfitting)**: el modelo es demasiado simple para captar la relación.
- **Regularización**: penalización que limita la complejidad del modelo, como en la regresión Ridge.
- **Hiperparámetro**: configuración que no se aprende de los datos, como la profundidad de los árboles.

Fuente: literatura_aplicacion/literature_review__report__sections__05_modelos.typ.txt; reto_y_datos/literature_review__report__sections__02_reto_corpus.typ.txt; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt
