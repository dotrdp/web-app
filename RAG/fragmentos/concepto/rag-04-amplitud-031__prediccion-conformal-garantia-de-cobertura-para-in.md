@id: rag-04-amplitud-031
@documento: rag-04-amplitud | temas/04_amplitud_significados.md
@categoria: concepto
@titulo: Predicción conformal: garantía de cobertura para intervalos
@titulo_documento: Significados de "amplitud" en el Reto AgroCebada (térmica, NDVI estacional, intervalos e ventanas)
@etiquetas: amplitud; amplitud térmica; tmax tmin; chirts-era5; ndvi; amplitud estacional; línea base; intervalo de predicción; ancho de intervalo; ventana de siembra; fenología; heladas; temperatura base; grados-día; predicción conformal
@claves: amplitud amplitud termica tmax tmin chirts-era5 ndvi amplitud estacional linea base intervalo de prediccion ancho de intervalo ventana de siembra fenologia heladas temperatura base grados-dia prediccion conformal cobertura conformal garantia prediccion intervalo intervalos angelopoulos arxiv bates datos ejemplo https marginal mismo modelo municipio nominal ademas alrededor base basica calibracion condicional confiable
@fuente: https://arxiv.org/pdf/2107.07511 (Angelopoulos y Bates, resumen verificado); https://doi.org/10.1561/2200000101
# Predicción conformal: garantía de cobertura para intervalos

La predicción conformal construye conjuntos o intervalos de predicción alrededor de cualquier modelo ya entrenado, sin suponer una distribución particular de los errores. Su garantía básica es de cobertura marginal: si los datos son intercambiables (por ejemplo, observaciones i.i.d. o con permutación simétrica), el
intervalo contiene el valor verdadero con la probabilidad nominal elegida, por ejemplo 90 %. Angelopoulos y Bates (2021, arXiv:2107.07511; monografía de 2023) presentan este enfoque para lectores no estadísticos, con ejemplos en Python.

La garantía es marginal, es decir, en promedio sobre las predicciones, y no condicional a una región o a una parcela. Además, depende de la intercambiabilidad, que puede fallar con datos espaciales o temporales dependientes, como las parcelas de un mismo municipio o las series de un mismo año. Un intervalo conformal de
90 % no es más estrecho ni más confiable por el hecho de serlo; su amplitud sigue dependiendo del modelo base y de la calibración.

Recomendación para el proyecto, no resultado: si se reporta un intervalo, indicar su nivel nominal, la cobertura medida en validación cruzada por grupos (por municipio o por año) y la amplitud media en t/ha.

Fuente: https://arxiv.org/pdf/2107.07511 (Angelopoulos y Bates, resumen verificado); https://doi.org/10.1561/2200000101
