@id: rag-08-experimentos-profundos-023
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Nuestros experimentos: transferencia con datos nuevos
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn rmse transferencia alphaearth atencion cinco datos experimentos pliegues caracteristicas nuestros nuevos obtuvo usaron ablacion adaptacion agrocebada ajustes alcanzo anadidos anadir arquitectura comparacion comparaciones cruzada
@fuente: Proyecto FIRA 2026 «Reto AgroCebada», iteración de transferencia del 7 de octubre de 2026 y ablación TabPFN + AlphaEarth (validación cruzada de cinco pliegues).
# Nuestros experimentos: transferencia con datos nuevos

Los experimentos de transferencia usaron imágenes verificadas de 2025, suelos, radar, escenarios de estrés hídrico de temporal, preentrenamiento en trigo y adaptación de modelos fundacionales. Todas las comparaciones usaron el mismo protocolo de 138 etiquetas con cinco pliegues. Con datos añadidos, ninguna variante
alcanzó 0.100 t/ha ni estableció un techo de información. La mejor puntuación medida sigue siendo 0.3226 t/ha.

En una comparación independiente de TabPFN y AlphaEarth (120 ajustes de atención con cinco pliegues), TabPFN nativo obtuvo MAE 0.4095 y RMSE 0.5570 t/ha. Sus características extraídas con un solo experto de atención obtuvieron MAE 0.4357 y RMSE 0.5979 t/ha. Con la misma arquitectura de atención, MMST más DailyCropNet
obtuvo MAE 0.3492 y RMSE 0.5247 t/ha, y al añadir las características de TabPFN y AlphaEarth el MAE mejoró a 0.3452 y el RMSE a 0.5111 t/ha.

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», iteración de transferencia del 7 de octubre de 2026 y ablación TabPFN + AlphaEarth (validación cruzada de cinco pliegues).
