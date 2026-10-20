@id: rag-09-experimentos-tabulares-024
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Detectores de fallas: AUC necesaria para mejorar
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error fallas parcelas detector detectores dosel falla mejorar menor necesaria variables actual area baja bajo calibrado cercana cuatro curva definio encima error estandar etiquetas ganar
@fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md
# Detectores de fallas: AUC necesaria para mejorar

Una falla se definió como residuo menor que −1 t/ha (4 parcelas, 2.9 %) o menor que −0.75 (7 parcelas, 5.1 %). Simulando un detector calibrado con AUC (área bajo la curva ROC: probabilidad de que una falla puntúe por encima de una parcela normal), el RMSE del modelo de referencia baja a 0.4709 con AUC 0.8, 0.4587 con
AUC 0.9 y 0.4423 con AUC 0.95, para cuatro fallas en todas las parcelas. Para ganar 0.005 se necesita una AUC de 0.75 a 0.8; para 0.010, de 0.80 a 0.85; para 0.020, de 0.88 a 0.90. Con 4 a 7 positivos entre 138 parcelas, el error estándar de la AUC es de 0.08 a 0.13, así que no podemos validar un detector con estas
etiquetas. Las fallas se ven normales en las variables de dosel (z entre −0.8 y +2.3), por lo que la AUC actual de las variables de dosel sería presumiblemente cercana a 0.5.

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md
