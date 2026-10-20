@id: rag-10-validacion-021
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Contracción empírica bayesiana y modelos jerárquicos
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping contraccion area jasa modelos parcelas battese bayesiana efron empirica fuller harter jerarquicos media medias morris pequena research validacion verificado analogo apartado aplican areas barley bayes
@fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; Efron y Morris (1975), JASA 70(350), 311-319; Battese, Harter y Fuller (1988), JASA 83(401), 28-36,
# Contracción empírica bayesiana y modelos jerárquicos

(Literatura) Los estimadores de James-Stein y empirical Bayes encogen las medias de grupo hacia la media global. Efron y Morris (1975) reportan, en su resumen, que el error cuadrático medio de estas reglas es menor que la mitad del de la media muestral en sus tres ejemplos (verificado; la cifra exacta por ejemplo no se
consultó). Los modelos de área pequeña, como el de Battese, Harter y Fuller (1988; verificado), aplican la misma idea para estimar medias de área, no predicciones de parcelas individuales. El modelo de Fay y Herriot (1979, JASA 74(366), DOI 10.2307/2286322) es el análogo de área con covariables (referencia verificada);
se describe en el apartado de estimación en áreas pequeñas.

(Cálculo propio) El factor de contracción es B = σ²/(σ² + n·τ²), con σ = 0.475 y τ ≈ 0.75. Para Chignahuapan (71 parcelas) B ≈ 0.006: el prior es irrelevante. Para Cuautepec (5) B ≈ 0.08; para una sola parcela (Nanacamilpa) B ≈ 0.3.

(Resultado) Con los grupos de este conjunto, la contracción recupera como máximo unas 0.01 t/ha de RMSE, casi todo en municipios de diez o menos parcelas. Es una mejora pequeña pero honesta, y debe reportarse como tal.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; Efron y Morris (1975), JASA 70(350), 311-319; Battese, Harter y Fuller (1988), JASA 83(401), 28-36,
https://doi.org/10.1080/01621459.1988.10478561
