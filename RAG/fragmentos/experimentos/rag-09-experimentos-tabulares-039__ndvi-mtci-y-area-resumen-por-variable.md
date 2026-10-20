@id: rag-09-experimentos-tabulares-039
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: NDVI, MTCI y área: resumen por variable
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error area tabulares chignahuapan frente modelo resumen senal variable audit borde cambio change clima control correccion correspondiente curvas docs dynamic encima espacial identificable
@fuente: experimentos_tabulares/spatial_regression__README.md; experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md; experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md
# NDVI, MTCI y área: resumen por variable

El NDVI de temporada no mejora el modelo: en la regresión espacial, M1 con NDVI dio RMSE 0.5140 (Δ −0.0049) y 0 de 20 splits mejores que la referencia. En las curvas, la ridge con NDVI de M1 quedó por encima del control (0.5054 frente a 0.5033). El MTCI (índice de borde rojo) tampoco: en M1 la versión con MTCI dio
0.5035 frente a 0.5033 sin él; en A6, una señal de MTCI p10 en Chignahuapan (−0.34) fue nominal y no pasó la corrección. El área de parcela sólo tiene señal local en Chignahuapan (ver el fragmento correspondiente). Las pruebas con clima de Kumo no mostraron una ventaja identificable. Ninguna de estas variables fue
suficiente para justificar un cambio en el modelo.

Fuente: experimentos_tabulares/spatial_regression__README.md; experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md; experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md
