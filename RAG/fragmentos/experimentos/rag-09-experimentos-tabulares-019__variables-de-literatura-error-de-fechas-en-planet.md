@id: rag-09-experimentos-tabulares-019
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Variables de literatura: error de fechas en Planet corregido
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error planet variables error fechas fecha solo correctas corregido filas literatura afecto analisis antes aparente apoyaba cambio captura coinciden columna conclusion concordancia construye correccion corregidas corregirlo
@fuente: experimentos_tabulares/literature_vars_20261017__README.md
# Variables de literatura: error de fechas en Planet corregido

Detectamos un error en el script que construye las variables: leía la columna de fecha de captura de PlanetScope, en formato día/mes/año, con análisis de mes primero. De las 47,804 filas, 28,304 quedaron sin fecha (los días mayores que 12) y 17,835 tenían día y mes intercambiados; sólo 1,665 (día igual a mes) eran
correctas. De las 31,708 filas despejadas de 2025, sólo 12,789 llegaron a las curvas, y 11,566 de ellas con fecha equivocada. El error afectó sólo a las 7 variables planet_*. Tras corregirlo, la conclusión no cambió: las siete variables corregidas dieron RMSE medios peores que C2, y la mejor, planet_evi_flower_pk, dio
0.4799 frente a 0.4793. Antes de la corrección, la aparente concordancia entre sensores se apoyaba en fechas revueltas; con fechas correctas, Sentinel, HLS y Planet coinciden.

Fuente: experimentos_tabulares/literature_vars_20261017__README.md
