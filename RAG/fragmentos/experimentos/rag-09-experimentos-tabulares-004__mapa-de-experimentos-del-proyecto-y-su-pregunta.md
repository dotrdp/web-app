@id: rag-09-experimentos-tabulares-004
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Mapa de experimentos del proyecto y su pregunta
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error tabulares modelado pregunta canopy cropland cross dentro diferencias indices joint mapa modelo parcelas pregunto pretraining proyecto rainfed sensor absorbida agricola apar auditaron ayuda
@fuente: experimentos_tabulares/spatial_regression__README.md; experimentos_tabulares/modelado__CANOPY_JOINT.md; experimentos_tabulares/modelado__CROSS_SENSOR.md; experimentos_tabulares/modelado__CROPLAND_PRETRAINING.md; experimentos_tabulares/modelado__KUMO_RAINFED.md;
# Mapa de experimentos del proyecto y su pregunta

Cada experimento respondió una pregunta distinta. La regresión espacial con índice APAR preguntó si la luz absorbida por el dosel explica el rendimiento. El centrado dentro de municipio preguntó si quitar las diferencias entre municipios revela diferencias entre parcelas. CANOPY_JOINT midió la covarianza entre índices
dentro de cada parcela. CROSS_SENSOR comparó Sentinel-2 con PlanetScope en fechas cercanas. CROPLAND_PRETRAINING ponderó el contexto municipal hacia la superficie agrícola. Kumo probó si un modelo tabular preentrenado con registros municipales SIAP ayuda a las parcelas. Kumo rainfed construyó un corpus de más de un
millón de rendimientos. Las campañas de GPU midieron el modelo conjunto. Las variables de literatura probaron los índices recomendados por la bibliografía. M1 y M2 estudiaron la curva fenológica. A3, A5 y A6 auditaron la señal y el margen de mejora, y B4 evaluó embeddings de modelos fundacionales.

Fuente: experimentos_tabulares/spatial_regression__README.md; experimentos_tabulares/modelado__CANOPY_JOINT.md; experimentos_tabulares/modelado__CROSS_SENSOR.md; experimentos_tabulares/modelado__CROPLAND_PRETRAINING.md; experimentos_tabulares/modelado__KUMO_RAINFED.md;
experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md
