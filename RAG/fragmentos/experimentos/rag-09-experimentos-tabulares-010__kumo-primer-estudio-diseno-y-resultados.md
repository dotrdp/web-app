@id: rag-09-experimentos-tabulares-010
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Kumo, primer estudio: diseño y resultados
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error fira municipal pesos estudio nvidia referencia actualizar adaptacion atencion desde diseno entrenamiento episodios media obtuvo paso primer resultados siap usan abiertos agera5 ajuste ajusto
@fuente: experimentos_tabulares/modelado__KUMO.md
# Kumo, primer estudio: diseño y resultados

Kumo (NVIDIA Kumo-Tabular, versión small) es un modelo tabular de pesos abiertos que en este estudio se ajustó por completo en dos etapas. Primero, 200 episodios de optimización sobre 1,791 registros municipales SIAP de temporal primavera-verano (2003-2024), con 474 columnas numéricas y dos categóricas que resumen
AgERA5, AlphaEarth previo, geografía e historia SIAP. Después, por cada uno de los cinco pliegues canónicos, 100 episodios sobre 110 o 111 parcelas de entrenamiento, con tasa de aprendizaje 1e-5. Se compararon dos inicializaciones: "fira_only", desde los pesos originales de NVIDIA, y "municipal_then_fira", desde el
checkpoint municipal. Los controles de paso 0 usan las etiquetas de entrenamiento como contexto, sin actualizar pesos. Las predicciones usan ocho estimadores y se reportan la media de los 999 cuantiles y la mediana.

El primario declarado, Kumo canopy_mra con adaptación municipal y paso 100 en media, obtuvo MAE 0.403162, RMSE 0.558267 t/ha y R² 0.566670. Frente a este, la misma arquitectura solo con datos FIRA alcanzó 0.395159 / 0.537672 / 0.598052, y el Kumo congelado de NVIDIA, 0.380212 / 0.528519 / 0.611620. La adaptación
municipal sin actualizar pesos FIRA dio 0.380850 / 0.522351 / 0.620632. La referencia histórica "aspiring_sota" (atención sobre MMST original y Daily DeepCropNet) obtuvo 0.322601 / 0.489072 / 0.667431, y la atención retenida en 90/10, 0.321798 / 0.487283 / 0.669861. Conclusión: el ajuste fino no superó la referencia, y
el municipio no aportó una ventaja verificable. El MAE de Kumo fue 25 % mayor que el de la referencia.

Fuente: experimentos_tabulares/modelado__KUMO.md
