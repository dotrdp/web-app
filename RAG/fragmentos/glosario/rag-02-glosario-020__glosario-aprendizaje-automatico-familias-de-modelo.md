@id: rag-02-glosario-020
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Glosario: aprendizaje automático (familias de modelos)
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos modelos datos experimentos literatura modelo proyecto aprendizaje colaboradores conjunto familias kumo literature review tabulares aplicacion arboles automatico boosting cebada comparison cruzada entrenados lineal predicciones
@fuente: teledeteccion_fenologia/literature_review__report__chapters__03_representaciones.typ.txt; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt; experimentos_tabulares/modelado__KUMO.md; experimentos_profundos/mmst-vit__docs__model_selection_20261006.md;
# Glosario: aprendizaje automático (familias de modelos)

Contexto: estas familias se han usado en la literatura de cebada y en los experimentos del proyecto. Su desempeño en el reto se reporta solo en validación cruzada; no se afirma superioridad de ninguna.

- **Regresión lineal múltiple**: modelo lineal con varias variables. Iranzo y colaboradores la usan con radar, óptico y clima.
- **Bosque aleatorio (random forest)**: conjunto de árboles entrenados con muestras aleatorias. Li y colaboradores lo usan para rendimiento distrital en Suecia, con R² de 0.77 y RMSE de 488 kg/ha.
- **Boosting (gradient boosting, XGBoost, CatBoost)**: conjunto de árboles entrenados en secuencia. El proyecto lo incluye como referencia.
- **Proceso gaussiano (GP, GPR)**: regresión no paramétrica con incertidumbre explícita. Sharifi y colaboradores lo reportan como el mejor de cuatro modelos, con R² de 0.84 (literatura).
- **Red neuronal y aprendizaje profundo (deep learning)**: modelos con muchas capas. Las representaciones multimodales se entrenan con este tipo de modelos.
- **Transformador (Transformer; ViT)**: arquitectura basada en atención. Los experimentos del proyecto con transformadores para datos tabulares o de imagen son resultados internos.
- **Modelo tabular fundacional (Kumo, TabPFN)**: modelo preentrenado sobre datos tabulares que se ajusta al problema. El proyecto probó Kumo con datos municipales de SIAP y luego con parcelas, con resultados solo de validación cruzada.
- **Ajuste fino (fine-tuning)**: actualización de los pesos de un modelo preentrenado con datos del problema.
- **Conjunto (ensemble) y apilamiento (stacking)**: combinación de predicciones de varios modelos, directamente o con un metamodelo entrenado sobre predicciones fuera de pliegue.

Fuente: teledeteccion_fenologia/literature_review__report__chapters__03_representaciones.typ.txt; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt; experimentos_tabulares/modelado__KUMO.md; experimentos_profundos/mmst-vit__docs__model_selection_20261006.md;
literatura_aplicacion/literature_review__report__sections__05_modelos.typ.txt
