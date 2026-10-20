@id: rag-09-experimentos-tabulares-013
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Kumo sobre lluvia: entradas y estado del entrenamiento
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error columnas area entrenamiento estado entradas parcela activo agera5 alphaearth anterior categoricas cierre columna completa completo conservan corpus documento esquema estacionales estan estrictamente evaluacion
@fuente: experimentos_tabulares/modelado__KUMO_RAINFED.md
# Kumo sobre lluvia: entradas y estado del entrenamiento

El esquema activo tiene 486 columnas numéricas y 7 categóricas, que tras la expansión de Kumo quedan en 500 columnas. Incluye 338 columnas de AgERA5 v2 con las 27 variables en ventanas estacionales, 25 de geografía e historia de rendimiento estrictamente anterior, 66 de AlphaEarth previo, 10 de área, 42 de
observaciones ópticas originales, el año y 4 de área de parcela experimental. No hay ninguna columna de riego ni de "Temporal": el régimen sólo se usa para filtrar. Estado al cierre del documento: el corpus y las tablas de preentrenamiento están verificados, pero el entrenamiento completo quedó programado y no hay
evaluación held-out completa. Por tanto, no existe un R² nuevo que reportar. Lo que sí está verificado es que las columnas de área de parcela se conservan.

Fuente: experimentos_tabulares/modelado__KUMO_RAINFED.md
