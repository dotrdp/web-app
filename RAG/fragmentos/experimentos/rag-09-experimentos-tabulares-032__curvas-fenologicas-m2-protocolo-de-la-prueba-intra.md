@id: rag-09-experimentos-tabulares-032
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Curvas fenológicas (M2): protocolo de la prueba intramunicipal
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error dentro media municipio prueba curvas fenologicas intramunicipal municipal protocolo usaron within-r agrupada aproximada bloques calibracion centro change columnas cruda cruzada cuanta curva docs dynamic
@fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md
# Curvas fenológicas (M2): protocolo de la prueba intramunicipal

M2 midió cuánta varianza dentro de cada municipio explican los bloques de curva, con la métrica within-R² = 1 − SSE(modelo)/SSE(media municipal) agrupada sobre 10 repeticiones de 5 pliegues. El objetivo se centró dentro de cada municipio y se restó la media de entrenamiento. Se usaron ridge con validación cruzada
leave-one-out y PCA de 8, 16, 32 o todas las columnas, con 300 permutaciones dentro de municipio para la prueba nula. La calibración reproduce los valores del README: Galileo +0.024 y S2 reflectancia cruda −0.015 (de referencia, 0.023 y −0.015). La ganancia aproximada en RMSE es RMSE_muni × (1 − √(1 − R²)); un
within-R² de 0.01 vale unos 0.0026 t/ha. Se usaron 138 etiquetas y el RMSE de la media municipal es 0.5123.

Fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md
