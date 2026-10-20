@id: rag-10-validacion-025
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Corrección de Sheppard y verosimilitud por intervalo: resultados negativos
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping sheppard correccion intervalo barnwal cheng frente media negativos research resultados ruido sesgo validacion verosimilitud volumen adicional agrupados anade annals aproximadamente articulo barley calculo ceiling cheng23a
@fuente: validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md; Cheng et al. (2023), https://proceedings.mlr.press/v202/cheng23a.html; Barnwal et al. (2022), JCGS 31(4), 1292-1302
# Corrección de Sheppard y verosimilitud por intervalo: resultados negativos

(Literatura) La corrección de Sheppard indica que la varianza de datos agrupados se infla en aproximadamente h²/12 cuando h es pequeño frente a la dispersión, y que el sesgo de la media es despreciable (la fórmula de −h²/12 se confirmó en fuentes secundarias; el año de Sheppard se resolvió: Crossref da 1897 para el
artículo del volumen 29 de Proc. London Math. Soc. (DOI 10.1112/plms/s1-29.1.353), y ProofWiki cita 1898 por el volumen; conviene citar el DOI junto con el año). Heitjan y Rubin (1991), «Ignorability and Coarse Data», Annals of Statistics, DOI 10.1214/aos/1176348396, referencia verificada; el contenido técnico no se
leyó. Cheng y colaboradores (ICML 2023) y XGBoost con intervalos (Barnwal et al., 2022) ofrecen formas de entrenar con etiquetas intervalo (verificados).

La probabilidad marginal dentro de cada pliegue no eligió ruido adicional en 105 de 105 pliegues. Conclusión: la ganancia es negligible.

(Cálculo) El sesgo de E[round(y)] frente a E[y] es menor que 10⁻⁵ t/ha; el redondeo no sesga la media, solo añade ruido, que ya está en el término gaussiano.

Fuente: validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md; Cheng et al. (2023), https://proceedings.mlr.press/v202/cheng23a.html; Barnwal et al. (2022), JCGS 31(4), 1292-1302
