@id: rag-09-experimentos-tabulares-001
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Resumen del documento
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error documento resumen municipios parcelas proyecto rendimiento agrocebada alcanzo anadieron base cebada concentra conocido cruzada cultivo curvas demostrable dentro embeddings error espaciales estimamos fallas
@fuente: [experimentos_tabulares/spatial_regression__README.md, experimentos_tabulares/modelado__WITHIN_MUNICIPALITY.md, experimentos_tabulares/modelado__CANOPY_JOINT.md, experimentos_tabulares/modelado__CROSS_SENSOR.md, experimentos_tabulares/modelado__CROPLAND_PRETRAINING.md,
# Resumen del documento

**Resumen.** Este documento resume los experimentos tabulares, espaciales y fenológicos del proyecto FIRA 2026 "Reto AgroCebada", que predice el rendimiento de cebada maltera de temporal en Hidalgo, Puebla y Tlaxcala a partir de 138 parcelas con rendimiento conocido; la métrica principal es el RMSE en t/ha. Ninguno de
nuestros experimentos superó de forma robusta la referencia del proyecto ni alcanzó la meta de mejora de 30 % sobre la línea base. Los modelos fundacionales (Kumo, TabPFN, embeddings satelitales) y las curvas fenológicas no añadieron señal demostrable dentro de los municipios. El error se concentra entre municipios y
en unas pocas parcelas con fallas de cultivo, por lo que estimamos un techo práctico de RMSE de 0.465 a 0.470 t/ha en validación cruzada.
