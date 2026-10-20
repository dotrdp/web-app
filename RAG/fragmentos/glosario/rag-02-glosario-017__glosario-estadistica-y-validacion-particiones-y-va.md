@id: rag-02-glosario-017
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Glosario: estadística y validación (particiones y validación cruzada)
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos validacion cruzada particiones prediccion proyecto literatura parcela parcelas particion pliegue agronomia campana colaboradores conjunto cross-validation datos dentro entrenamiento entrenar espacial estadistica estimacion evaluacion experimentos
@fuente: experimentos_tabulares/modelado__KUMO.md; validacion/iterate_20261017__research__B3_small_n_methods.md; experimentos_tabulares/iterate_20261017__research__A3_headroom.md; agronomia/literature_review__report__sections__03_agronomia_literatura.typ.txt;
# Glosario: estadística y validación (particiones y validación cruzada)

Contexto: como hay 138 parcelas con rendimiento conocido, cada estimación de error depende de cómo se parten los datos. Las particiones usadas por el proyecto son aleatorias dentro de una misma campaña y se reportan con su número de pliegues.

- **Validación cruzada (cross-validation)**: estimación del desempeño dividiendo los datos en subconjuntos de entrenamiento y prueba. Ejemplo del proyecto: cinco pliegues con 110 u 111 parcelas de entrenamiento y 27 o 28 de evaluación.
- **Pliegue (fold)**: cada partición de prueba en una validación cruzada.
- **Predicción fuera de pliegue (OOF; out-of-fold)**: predicción de una parcela hecha por un modelo que no la usó para entrenar. Con 138 parcelas, el proyecto obtiene una predicción OOF por parcela.
- **Validación cruzada anidada (nested cross-validation)**: selección de hiperparámetros dentro de cada pliegue externo. Es necesaria cuando la selección usa las mismas etiquetas que la evaluación.
- **Partición espacial (validación por bloques)**: separación por zonas para medir generalización espacial. Arizo-García y colaboradores muestran que la predicción a 10 m debe validarse por parcela y no por píxel.
- **Partición por campaña**: entrenar con una temporada y probar con otra. Franch y colaboradores obtuvieron R² superior a 0.65 para cebada entre campañas, y cerca de 0.45 entre regiones (literatura).
- **Conjunto de confirmación**: subconjunto de particiones reservado para verificar una decisión tomada en el conjunto de desarrollo. El proyecto lo usa en sus análisis de validación (resultado interno).

Fuente: experimentos_tabulares/modelado__KUMO.md; validacion/iterate_20261017__research__B3_small_n_methods.md; experimentos_tabulares/iterate_20261017__research__A3_headroom.md; agronomia/literature_review__report__sections__03_agronomia_literatura.typ.txt;
literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt
