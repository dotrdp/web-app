@id: rag-09-experimentos-tabulares-025
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Regla de validación, conjunto fijo y métricas
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error conjunto media modelo niveles referencia fijo municipales pliegue regla validacion candidato cualquier diferencia mediana mejor mejorar metricas modelos municipal solo aceptar ademas ajuste alto
@fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md
# Regla de validación, conjunto fijo y métricas

Para aceptar un modelo nuevo sobre la referencia, A3 propone exigir una ganancia media Δ̂ de al menos max(0.002, z_N · 0.08 · D), donde D es la diferencia cuadrática media entre las predicciones de ambos modelos. El factor z_N vale 1.25 para un candidato preregistrado, 1.9 para el mejor de unos 20 variantes y 2.4 para
el mejor de unos 70. Por ejemplo, con D = 0.05 se requiere Δ̂ ≥ 0.005 para un candidato único. Además, como las 138 parcelas son un conjunto fijo, en validación cruzada un pliegue con nivel municipal alto tiende a tener otro bajo: esto infla las ganancias de cualquier regla que fije niveles municipales, como el
desplazamiento por mediana dentro de pliegue (0.4720 en CV, artefacto) o el redondeo a rejilla (0.4745). Cualquier cambio que toque niveles municipales debe evaluarse por pliegue.

En un mismo conjunto de prueba, R² de sklearn es 1 − MSE/Var(y), así que ordena los modelos igual que el RMSE; por tanto, son un solo criterio. El coeficiente de correlación de Pearson al cuadrado (r²) ignora desplazamientos y escalas, y está dominado por la diferencia entre municipios: los niveles municipales por sí
solos dan r² de 0.66 a 0.69 y el modelo de referencia de 0.68 a 0.71. Por eso, un ajuste que sólo mueve niveles puede mejorar r² sin mejorar el RMSE. El MAE prefiere medianas: en CV, la mediana municipal obtuvo MAE 0.307 frente a 0.322 de la media del modelo de referencia, pero su RMSE fue peor. Al estirar o desplazar
el modelo de referencia no se obtiene ninguna mejora robusta; el propio A3 recomienda mantener la media condicional tal como está.

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md
