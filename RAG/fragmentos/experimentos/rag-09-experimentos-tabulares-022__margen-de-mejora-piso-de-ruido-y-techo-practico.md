@id: rag-09-experimentos-tabulares-022
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Margen de mejora: piso de ruido y techo práctico
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error mejora practico techo detector etiquetas fallas margen piso ruido actuales alcanzable analisis apan calpulalpan cercano cifras concreta conocieran cotas cruzada cuantifico cultivo datos deben
@fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md
# Margen de mejora: piso de ruido y techo práctico

El análisis A3 cuantificó las fuentes de mejora posibles en RMSE de validación cruzada. Redondeo de las etiquetas en rejilla de 0.5 t/ha (Calpulalpan, Apan, Emiliano Zapata y Nanacamilpa) y 0.1 en Singuilucan: ≈0.007, irreducible. Incertidumbre de los niveles municipales: 0.006 a 0.014 si se conocieran exactamente, lo
cual no es alcanzable. Detector de fallas de cultivo: 0.006 a 0.013 con AUC 0.8, y 0.018 a 0.031 con AUC 0.9. Interpolación espacial de vecinos: ≤0.004. Prior externo SIAP: ≤0.001. Por eso estimamos un techo práctico de 0.465 a 0.470 t/ha. Un RMSE de 0.46 requiere un detector de fallas con AUC cercano a 0.9, que los
datos actuales no sostienen. Estas cifras son cotas teóricas con supuestos optimistas (tasas de falla y pérdidas tomadas de las mismas etiquetas), así que deben leerse como límites y no como pronósticos de una mejora concreta.

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md
