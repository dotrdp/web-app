@id: rag-02-glosario-021
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Glosario: aprendizaje automático (incertidumbre, calibración y reproducibilidad)
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos intervalo calibracion cobertura cuantiles incertidumbre literatura literature prediccion review amplitud aplicacion aprendizaje automatico calibrado comparison estimacion intercambiabilidad observaciones regresion report reproducibilidad validacion alrededor aplican
@fuente: literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt; validacion/literature_review__report__sections__06_validacion.typ.txt; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt
# Glosario: aprendizaje automático (incertidumbre, calibración y reproducibilidad)

Contexto: el reto pide presentar cada estimación con su incertidumbre. Un intervalo solo es útil si se conocen su procedimiento y las condiciones en que fue calibrado.

- **Intervalo de predicción**: rango plausible alrededor de una predicción.
- **Amplitud del intervalo**: diferencia entre el límite superior y el inferior del intervalo. Véase el glosario de regionalismos sobre "amplitud".
- **Cobertura (coverage)**: fracción de observaciones que caen dentro de su intervalo. Un intervalo calibrado al 90 % debe cubrir cerca de 90 % de los casos de prueba.
- **Predicción conforme (conformal prediction)**: método de intervalos con garantías de cobertura bajo intercambiabilidad. Romano, Patterson y Candès lo aplican con regresión por cuantiles (literatura).
- **Intercambiabilidad (exchangeability)**: supuesto de que el orden de las observaciones no importa. La dependencia espacial y los cambios de distribución lo violan.
- **Regresión por cuantiles**: estimación de cuantiles condicionales, como el 10 % o el 90 %, en lugar de la media.
- **Calibración**: concordancia entre la cobertura nominal y la empírica de un intervalo.
- **Huella digital (hash, SHA-256)**: suma de verificación que identifica un archivo. El proyecto la usa para verificar que las predicciones de comparación no cambiaron.

Fuente: literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt; validacion/literature_review__report__sections__06_validacion.typ.txt; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt
