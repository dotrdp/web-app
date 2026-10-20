@id: rag-09-experimentos-tabulares-014
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Kumo sobre lluvia: exclusión de registros y errores de clima
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error exclusion registros clima dias errores mayor tmax tmedia tmin agera5 ambientes bajo banderas calidad completo conservar correcciones corregirlos cuatro decidimos desde desviacion detectamos
@fuente: experimentos_tabulares/modelado__KUMO_RAINFED.md
# Kumo sobre lluvia: exclusión de registros y errores de clima

El 15 de octubre de 2026 excluimos 3,336 registros: 13 rendimientos físicamente implausibles (por encima de 200 t/ha, desde 7,000 t/ha en marañón hasta 209 t/ha en plátano) y 3,320 observaciones de trigo IWIN en ambientes con riego completo o suplementario explícito. Tras la exclusión, la tabla de preentrenamiento
quedó en 1,032,892 filas; la desviación estándar del rendimiento bajó de 12.38 a 9.13 t/ha y el máximo es 196.9 t/ha. También detectamos un error en AgERA5 v2: cuatro días de invierno con Tmin mayor que Tmax (la inversión máxima fue de 0.5071 °C) y 169 días con Tmedia menor que Tmin, más dos con Tmedia mayor que Tmax.
El proveedor documenta que las correcciones independientes pueden romper el orden de las temperaturas. Decidimos conservar los valores originales con sus banderas de calidad, sin corregirlos.

Fuente: experimentos_tabulares/modelado__KUMO_RAINFED.md
