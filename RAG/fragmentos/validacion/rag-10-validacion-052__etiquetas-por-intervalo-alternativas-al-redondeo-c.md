@id: rag-10-validacion-052
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Etiquetas por intervalo: alternativas al redondeo (Cheng et al., 2023; Barnwal et al., 2022)
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping intervalo barnwal cheng valor alternativas dentro error etiquetas exacto hocking metodo modelo proponen redondeo regression xgboost accelerated acelerado alternativa analizan anidada base caer calpulalpan censura
@fuente: Cheng, X., Cao, Y., Li, X., An, B. y Feng, L. (2023). Weakly supervised regression with interval targets. ICML 2023, PMLR 202, 5428-5448. https://proceedings.mlr.press/v202/cheng23a.html; Barnwal, A., Cho, H. y Hocking, T. (2022). Survival regression with accelerated failure time model in XGBoost.…
# Etiquetas por intervalo: alternativas al redondeo (Cheng et al., 2023; Barnwal et al., 2022)

(Literatura, verificado.) Cuando la etiqueta es un intervalo y no un valor exacto, Cheng y colaboradores (2023) estudian la regresión con objetivos de intervalo: proponen un modelo estadístico del proceso de generación de datos, analizan un método base que elige un valor dentro de cada intervalo como objetivo, y
proponen un método que restringe las predicciones a caer dentro del intervalo, que es estadísticamente consistente y tiene una cota de error. Barnwal, Cho y Hocking (2022) incorporan el modelo de tiempo de falla acelerado a XGBoost con soporte para censura por intervalo. Para el reto, la pertinencia es que el
rendimiento de Calpulalpan, con valores en rejilla de 2.5 a 3.5, podría tratarse como intervalo en lugar de como valor exacto. Esta es una alternativa a estudiar, no un resultado del proyecto. Cualquier uso debe evaluarse con la misma validación anidada y por grupos, y no sustituye la medición del error de reporte.

Fuente: Cheng, X., Cao, Y., Li, X., An, B. y Feng, L. (2023). Weakly supervised regression with interval targets. ICML 2023, PMLR 202, 5428-5448. https://proceedings.mlr.press/v202/cheng23a.html; Barnwal, A., Cho, H. y Hocking, T. (2022). Survival regression with accelerated failure time model in XGBoost. Journal of
Computational and Graphical Statistics, 31(4), 1292-1302.
