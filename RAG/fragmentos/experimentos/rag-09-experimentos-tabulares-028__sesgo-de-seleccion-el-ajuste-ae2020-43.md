@id: rag-09-experimentos-tabulares-028
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Sesgo de selección: el ajuste "ae2020_43"
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error seleccion ae2020 sesgo ajuste dentro ganancia mejora pliegue tiene variable alphaearth audit avance bajo chignahuapan datos debe demostro descriptores divisiones elegir etiquetas gano geometricos
@fuente: experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md
# Sesgo de selección: el ajuste "ae2020_43"

Una variable de AlphaEarth, ae2020_43, al reajustarse dentro de cada pliegue dio RMSE 0.4599 y ganó en 10 de 10 divisiones, lo que parecía un gran avance. A6 demostró que es un sesgo de selección: al elegir la mejor variable de entre puro ruido sobre todos los datos, la ganancia media dentro del pliegue fue de −0.0139
(5 % a 95 %: −0.025 a −0.004), y la de ae2020_43, de −0.0169, tiene p = 0.33. Las variantes honestas pierden entre 0.015 y 0.049. Por la misma razón, la mejora de 0.0033 de la pendiente de log-área en Chignahuapan tiene p = 0.59 bajo la selección de descriptores geométricos. Regla: ninguna ganancia obtenida tras mirar
todas las etiquetas debe reportarse como mejora sin una prueba de selección.

Fuente: experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md
