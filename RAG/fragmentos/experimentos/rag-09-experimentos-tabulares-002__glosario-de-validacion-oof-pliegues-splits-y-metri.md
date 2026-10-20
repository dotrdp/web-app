@id: rag-09-experimentos-tabulares-002
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Glosario de validación: OOF, pliegues, splits y métricas
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error pliegues tabulares error glosario iterate medio metricas parcelas penaliza pliegue prediccion prueba research splits validacion absoluto aleatoria audit azar benjamini-hochberg bloques bootstrap canonicos change
@fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md; experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md; experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md
# Glosario de validación: OOF, pliegues, splits y métricas

En nuestros experimentos, "OOF" (out-of-fold, predicción fuera de pliegue) es la predicción de cada parcela hecha por un modelo que no la vio durante el entrenamiento. Un "pliegue" o "fold" es uno de los bloques en que se reparten las 138 parcelas etiquetadas; los "pliegues canónicos" son los cinco de 80/20 que fija el
proyecto. Un "split" es una partición nueva y aleatoria con la que repetimos la prueba, normalmente 10 o 20 veces. RMSE (raíz del error cuadrático medio, en t/ha) penaliza más los errores grandes y es la métrica principal; MAE (error absoluto medio) penaliza de forma lineal; R² indica la fracción de la varianza
explicada. El bootstrap remuestrea parcelas con reemplazo para estimar incertidumbre; una prueba de permutación reasigna etiquetas al azar para construir la distribución nula; BH (Benjamini-Hochberg) corrige por comparaciones múltiples controlando la proporción de falsos descubrimientos.

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md; experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md; experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md
