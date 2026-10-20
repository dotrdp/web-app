@id: rag-10-validacion-058
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Regresión cuantílica conformalizada: intervalos con garantía finita
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping intervalo conformalizada cuantilica finita garantia regresion arxiv calibracion cand cobertura condicionales conjunto cuantil entrenamiento intervalos parcelas patterson romano ajusta ajustado bajo calcula caso conformalized conformidad
@fuente: Romano, Y., Patterson, E. y Candès, E. (2019). Conformalized quantile regression. NeurIPS 2019; arXiv:1905.03222. https://doi.org/10.48550/arxiv.1905.03222
# Regresión cuantílica conformalizada: intervalos con garantía finita

(Literatura.) Romano, Patterson y Candès (2019) proponen la regresión cuantílica conformalizada (CQR). El método ajusta dos cuantiles condicionales (por ejemplo, 5 % y 95 %) con los datos de entrenamiento, calcula en un conjunto de calibración independiente un puntaje de no conformidad para cada caso (qué tanto la
observación cae fuera del intervalo ajustado) y usa el cuantil finito de esos puntajes para ensanchar o encoger el intervalo. Bajo intercambiabilidad, el intervalo tiene cobertura marginal de al menos 1 − α en muestra finita, sin supuestos de normalidad. Con pocas observaciones el problema es práctico: el conjunto de
calibración reduce el tamaño de entrenamiento, el cuantil se vuelve discreto y el intervalo se ensancha. Las garantías son marginales, no condicionales a una parcela o a un municipio, y no cubren dependencia espacial entre parcelas. Con 138 parcelas, un intervalo de 90 % debe reportarse con su cobertura empírica en
validación cruzada, no solo con la garantía teórica.

Fuente: Romano, Y., Patterson, E. y Candès, E. (2019). Conformalized quantile regression. NeurIPS 2019; arXiv:1905.03222. https://doi.org/10.48550/arxiv.1905.03222
