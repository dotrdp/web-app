@id: rag-04-amplitud-018
@documento: rag-04-amplitud | temas/04_amplitud_significados.md
@categoria: concepto
@titulo: Cobertura, intervalos de validación cruzada y comparación entre modelos
@titulo_documento: Significados de "amplitud" en el Reto AgroCebada (térmica, NDVI estacional, intervalos e ventanas)
@etiquetas: amplitud; amplitud térmica; tmax tmin; chirts-era5; ndvi; amplitud estacional; línea base; intervalo de predicción; ancho de intervalo; ventana de siembra; fenología; heladas; temperatura base; grados-día; predicción conformal
@claves: amplitud amplitud termica tmax tmin chirts-era5 ndvi amplitud estacional linea base intervalo de prediccion ancho de intervalo ventana de siembra fenologia heladas temperatura base grados-dia prediccion conformal intervalos validacion cobertura cruzada modelos bates benchmark comparacion demasiado entrenamiento error intervalo modelo resumen verificado ajustado ajustados anidada aproximadamente articulo arxiv autores basados bootstrap
@fuente: experimentos_profundos/benchmark_20260930__REPORT.md; validacion/iterate_20261017__research__B3_small_n_methods.md; https://arxiv.org/abs/2104.00673 (Bates et al. 2024, JASA 119(546), verificado en resumen)
# Cobertura, intervalos de validación cruzada y comparación entre modelos

Una validación cruzada (CV) tiende a dar intervalos demasiado estrechos. Bates, Hastie y Tibshirani (2024) muestran que la CV no estima el error del modelo ajustado con sus propios datos de entrenamiento, sino el error promedio de modelos ajustados con otros conjuntos de entrenamiento de la misma población. Sus
intervalos estándar basados en CV pueden cubrir muy por debajo del nivel deseado, porque cada punto sirve a la vez para entrenar y para probar, y la varianza usual sale demasiado pequeña. La CV anidada, propuesta por los autores, da intervalos con cobertura aproximadamente correcta en muchos de sus ejemplos (verificado
en el resumen del artículo). El proyecto usa el intervalo bootstrap pareado (95 %) de la diferencia de RMSE entre el mejor y el segundo
modelo, que en el benchmark fue [-0.0506, 0.0390] t/ha. Como ese intervalo incluye el cero, el resultado es inconcluso. Su amplitud es de 0.0896 t/ha, pero esa amplitud no mide la incertidumbre de una predicción individual.

Fuente: experimentos_profundos/benchmark_20260930__REPORT.md; validacion/iterate_20261017__research__B3_small_n_methods.md; https://arxiv.org/abs/2104.00673 (Bates et al. 2024, JASA 119(546), verificado en resumen)
