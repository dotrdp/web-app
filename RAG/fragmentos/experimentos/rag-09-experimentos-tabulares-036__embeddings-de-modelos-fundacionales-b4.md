@id: rag-09-experimentos-tabulares-036
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Embeddings de modelos fundacionales (B4)
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error alphaearth embeddings frente tessera componentes dieron fundacionales kernel modelos parcelas peor pixel referencia token varianza xgboost ae2024 aesum2325 ambos anaden anysat autocorrelacion bandas cambio cebada
@fuente: experimentos_tabulares/iterate_20261017__research__B4_foundation_models.md
# Embeddings de modelos fundacionales (B4)

B4 probó embeddings de AlphaEarth, TESSERA, Prithvi, Galileo, Presto, Clay, AnySat y OlmoEarth. Con AlphaEarth, 64 bandas en XGBoost municipal dieron un RMSE de ensamble de 0.5015 frente a 0.4576 de la referencia (peor); el kernel GP con las variables ae2024 y aesum2325 dio 0.4860 y 0.4858 frente a 0.4853 (sin
ganancia); y 10 componentes PCA en XGBoost dieron 0.4828 frente a 0.4791 (peor). Con TESSERA 2025 se probaron tres variantes preregistradas (kernel de embedding, componentes PCA centradas por municipio, y dispersión y cambio): ninguna superó de forma convincente a la referencia.

B4 identificó cuatro desajustes. Soporte espacial: un token de Prithvi-600M mide 420 m (17.6 ha), y 186 de 197 parcelas son más pequeñas (mediana 5.5 ha), así que el token describe sobre todo a los vecinos. Suavizado: AlphaEarth tiene autocorrelación de 0.90 en desviaciones dentro de parcela y una razón de varianza
intra/entre de 0.42; TESSERA, pixel a pixel, 0.85 y 0.71. Temporal: ambos resumen enero a diciembre, mientras la temporada de cebada es de junio a octubre. Reubicación: los ejes principales de AlphaEarth son regionales, y PCA sobre las parcelas recoge direcciones entre municipios que el GP ya explica. Con n ≈ 71 en
Chignahuapan, las dimensiones extra sólo añaden varianza. Recomendación de B4: dejar de gastar cómputo en embeddings para la puntuación.

Fuente: experimentos_tabulares/iterate_20261017__research__B4_foundation_models.md
