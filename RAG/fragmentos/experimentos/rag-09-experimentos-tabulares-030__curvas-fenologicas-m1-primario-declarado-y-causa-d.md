@id: rag-09-experimentos-tabulares-030
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Curvas fenológicas (M1): primario declarado y causa del fallo
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error curva curvas causa frente municipales municipio primario columnas declarado dentro desviacion fallo fenologicas indicadores planet ridge ajustada alfa antes area base capturan change chignahuapan comparacion
@fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md
# Curvas fenológicas (M1): primario declarado y causa del fallo

M1 modeló el rendimiento a partir de los parámetros de una curva de desarrollo del dosel ajustada a los índices (subida, meseta, senescencia y momentos de inicio), con 76 variables: 64 de curva para Planet NDVI, Planet LAI, fAPAR de Sentinel-2 y NDRE705, más área, elevación, pendiente y nueve indicadores municipales.
El primario, preregistrado antes de ver resultados, fue una ridge estandarizada. Resultado: RMSE de 0.5841 y MAE de 0.4405, R² 0.526, frente a 0.5126 del promedio municipal con contracción (B0); la diferencia es +0.0715 con IC 95 % [+0.021, +0.122]. Como
referencia de comparación, el ensamble del corpus (ENS3) dio 0.4744. Las curvas no mejoran la línea base con la regla declarada.

La causa es que una sola penalización trata igual a los indicadores municipales y a las 64 columnas de curva. El alfa elegido por validación interna (18 a 56) encoge los efectos municipales a ±0.11 a 0.23 t/ha por desviación estándar, y las columnas de curva, confundidas con el municipio, llenan ese hueco. Dentro de
Chignahuapan la desviación de las predicciones sube a 0.29 frente a 0.58 real, y la habilidad dentro del municipio es −0.07 frente a B0. Las curvas capturan sobre todo el nivel entre municipios: la ridge sólo con curva llega a R² 0.25, pero la correlación de la ganancia con el residuo es de 0.045. Esto muestra que el
problema no es de datos sino de cómo se mezcla la información de municipio con la de parcela.

Fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md
