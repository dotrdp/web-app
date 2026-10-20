@id: rag-10-validacion-060
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Estimación en áreas pequeñas aplicada a rendimientos municipales
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping estimacion areas area directa modelo municipales rendimientos aplicada herriot parcelas pequenas pocas prediccion propuesta regresion varianza acerca american aplicado aplico application association cebada census combina
@fuente: Fay, R. E. y Herriot, R. A. (1979). Estimates of income for small places: an application of James-Stein procedures to census data. Journal of the American Statistical Association, 74(366). https://doi.org/10.2307/2286322
# Estimación en áreas pequeñas aplicada a rendimientos municipales

(Literatura y propuesta.) El modelo de Fay y Herriot (1979) combina, para cada área, una estimación directa ruidosa con un modelo de regresión sobre covariables. La estimación directa se escribe y_i = θ_i + e_i, con varianza de muestreo ψ_i conocida, y θ_i = x_i'β + v_i, con varianza σ_v² del efecto de área. La
predicción de θ_i es un promedio ponderado con peso γ_i = σ_v² / (σ_v² + ψ_i) entre la estimación directa y la regresión. Cuando el área tiene pocas parcelas, ψ_i es grande, γ_i es pequeño y la predicción se acerca a la media del modelo. Aplicado a rendimientos de cebada, las áreas serían los municipios (nueve en el
reto, con tamaños muy desiguales). El riesgo principal es estimar σ_v² con tan pocas áreas, lo que vuelve inestable la contracción. Por eso esta estimación sirve para medias municipales y no para predicciones de parcelas individuales. Es una propuesta metodológica; no se aplicó a nuestros experimentos.

Fuente: Fay, R. E. y Herriot, R. A. (1979). Estimates of income for small places: an application of James-Stein procedures to census data. Journal of the American Statistical Association, 74(366). https://doi.org/10.2307/2286322
