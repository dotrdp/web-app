@id: rag-02-glosario-018
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Glosario: estadística y validación (fuga, sesgo de selección y dominio)
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos fuga validacion literatura seleccion conjunto distribucion informacion research sesgo aplicacion cambio comparison datos distancia dominio estadistica etiqueta etiquetas fijo filas hasta infla iterate leakage
@fuente: validacion/iterate_20261017__research__critique_leakage.md; experimentos_tabulares/iterate_20261017__research__A3_headroom.md; literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparis…
# Glosario: estadística y validación (fuga, sesgo de selección y dominio)

Contexto: en un conjunto pequeño, la forma de evaluar puede inflar los resultados sin que el modelo sea mejor. Los riesgos más citados en el proyecto son la fuga de información, la selección con las mismas etiquetas y el cambio de distribución entre campañas o regiones.

- **Fuga de información (data leakage)**: uso de información que no estaría disponible al predecir, como la etiqueta de la parcela, datos posteriores al horizonte o el orden de filas del archivo. La auditoría del proyecto trata el orden de almacenamiento de las filas como fuga de la etiqueta.
- **Fuga temporal**: uso de imágenes o datos posteriores a la fecha de corte de predicción. Por ejemplo, usar observaciones después del 31 de octubre si la predicción debe hacerse antes.
- **Sesgo de selección**: elegir variables, modelos o restricciones mirando el desempeño en las mismas etiquetas. Infla la validación aunque cada paso parezca razonable.
- **Efecto de conjunto fijo (fixed-pool effect)**: en un conjunto fijo de parcelas, la validación cruzada infla las ganancias de reglas que fijan niveles municipales (resultado interno).
- **Línea base (baseline)**: referencia sencilla para comparar. Meroni y colaboradores hallaron que referencias sencillas superaban hasta 60 % de las configuraciones de aprendizaje automático (literatura).
- **Desplazamiento de distribución (distribution shift)**: cambio entre entrenamiento y prueba por región, campaña, sensor o fuente. EarthShift reporta un deterioro medio de 15 a 20 % fuera de distribución, en sus tareas (literatura).
- **Área de aplicabilidad (AOA)**: región del espacio de predictores donde el modelo es confiable, según Meyer y Pebesma.
- **Semivariograma**: gráfica de la diferencia entre pares de observaciones contra la distancia. Muestra hasta qué distancia las parcelas se parecen.

Fuente: validacion/iterate_20261017__research__critique_leakage.md; experimentos_tabulares/iterate_20261017__research__A3_headroom.md; literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt;
Kapoor y Narayanan (2023).
