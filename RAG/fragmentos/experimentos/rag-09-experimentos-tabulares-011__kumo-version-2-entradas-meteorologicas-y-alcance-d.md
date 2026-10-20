@id: rag-09-experimentos-tabulares-011
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Kumo versión 2: entradas meteorológicas y alcance de la mejora
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error version entradas meteorologicas mejora referencia alcance control fira-only frente intervalos lider municipal obtuvo pasos procedimiento adaptacion adaptativa ademas agera5 ambos anadio aspiring
@fuente: experimentos_tabulares/modelado__KUMO_V2.md
# Kumo versión 2: entradas meteorológicas y alcance de la mejora

La versión 2 añadió resúmenes de AgERA5 de los 27 variables: rachas secas y húmedas, picos de lluvia de 5 y 10 días, conteos de lluvia intensa, extremos de temperatura, grados-día y déficit de precipitación frente a evapotranspiración de referencia. El procedimiento líder, "small_lean_geo_municipal" con diez pasos y
mediana, obtuvo MAE 0.317526, RMSE 0.484850 t/ha y R² 0.673149. Su control "FIRA-only" dio 0.317586 / 0.485121 / 0.672783; la adaptación municipal sin pasos FIRA dio 0.317740 / 0.484330 / 0.673849; Kumo congelado, 0.318874 / 0.485383 / 0.672429; la referencia aspiring_sota, 0.322601 / 0.489072 / 0.667431. La versión
medium, con las entradas meteorológicas directas, obtuvo 0.327020 / 0.497589 / 0.655748. Las campañas pasaron auditorías independientes de las 500 predicciones por pliegue y de las 200 lecturas.

El procedimiento líder reduce el MAE en 0.004272 t/ha (1.33 %) y el RMSE en 0.002433 t/ha (0.50 %) frente a la referencia. Los intervalos pareados por fila al 95 % son [−0.016874, 0.009125] para el MAE y [−0.013490, 0.010861] para el RMSE; ambos incluyen cero. Además, esos intervalos no reflejan la dependencia
geográfica, los contextos de entrenamiento compartidos ni la selección adaptativa de procedimientos. La versión 2 no demuestra superioridad en temporadas o regiones nuevas. Su control FIRA-only tiene prácticamente el mismo resultado, por lo que las entradas meteorológicas no pueden atribuirse el beneficio. Para el
proyecto, Kumo es una señal débil y no una mejora probada.

Fuente: experimentos_tabulares/modelado__KUMO_V2.md
