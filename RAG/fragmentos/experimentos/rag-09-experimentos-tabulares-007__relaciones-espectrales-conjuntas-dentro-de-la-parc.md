@id: rag-09-experimentos-tabulares-007
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Relaciones espectrales conjuntas dentro de la parcela (CANOPY_JOINT)
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error parcela canopy espectrales joint cuatro dentro obtuvo area atencion base conjuntas covarianzas daily describen linea mayor procedimiento relaciones ajustaron alcanzo atenciones aunque cabezas
@fuente: experimentos_tabulares/modelado__CANOPY_JOINT.md
# Relaciones espectrales conjuntas dentro de la parcela (CANOPY_JOINT)

CANOPY_JOINT extrajo información que comparten varias imágenes de Sentinel-2 de 2022 a 2025, dentro de cada parcela, en celdas de 20 m. Calculó NDVI, NDRE, NDMI y MSI; para cada parcela obtuvo cuatro medias ponderadas por área, tres covarianzas, correlaciones y pendientes entre índices, y estadísticas en subconjuntos
de vegetación densa (NDVI mayor que 0.2 y 0.5). Son 756 columnas para 197 parcelas, con un soporte mínimo de 50 % del área. Estas variables describen mezclas espectrales, no cobertura de cebada, daño ni nitrógeno. Se ajustaron 80 modelos Daily, 411 de atención y 210 estadísticos, con cuatro recetas Daily y atenciones
de dos o cuatro cabezas.

La atención primaria obtuvo MAE 0.344238, RMSE 0.490955 t/ha y R² 0.664866. Su variante seleccionada por MAE alcanzó 0.332045 / 0.481819 / 0.677222: menor RMSE pero mayor MAE que la línea base fija. El procedimiento estadístico primario obtuvo 0.350804 / 0.495321 / 0.658879. Ningún procedimiento cumplió los umbrales de
mejora de 30 % y la línea base se mantuvo. Este resultado debe leerse como exploratorio, porque los mismos pliegues de 2025 se usaron repetidamente. Para el proyecto, la lección es que las covarianzas espectrales intraparcela no revelan rendimiento, aunque sí describen la heterogeneidad de la parcela.

Fuente: experimentos_tabulares/modelado__CANOPY_JOINT.md
