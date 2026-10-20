@id: rag-10-validacion-029
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Intervalos de predicción y calibración conformal
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping calibracion cobertura validacion conformal intervalos ajuste ancho cuantil garantias intervalo municipio parcela prediccion absolutos arxiv bajo calibrar cand casos completo condicional conformalizada conjunto critique cuantiles
@fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/iterate_20261017__research__critique_expected_value.md
# Intervalos de predicción y calibración conformal

(Literatura) La regresión por cuantiles conformalizada (Romano, Patterson y Candès, 2019; referencia verificada, arXiv 1905.03222; las garantías se describen según el método y no se leyó el texto completo) ofrece cobertura marginal bajo intercambiabilidad. La calibración con residuos absolutos usa un cuantil finito de
los errores de un conjunto de calibración que no participó en el ajuste. Con pocos casos, el cuantil es discreto y el intervalo es ancho. Las garantías no cubren dependencia espacial ni cobertura condicional por parcela.

(Recomendación) Calibrar intervalos al 80 % o 90 % con validación por municipio (conformal estratificado), reportando cobertura observada y ancho medio, global y por grupo. Si la calibración reutiliza las etiquetas de ajuste, la garantía se pierde.

(Límite) Con 138 parcelas, la cobertura por municipio será ruidosa y no debe prometerse como exacta. El intervalo expresa incertidumbre de la parcela, no solo precisión de un promedio.

Fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/iterate_20261017__research__critique_expected_value.md
