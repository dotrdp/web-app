@id: rag-08-experimentos-profundos-024
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Nuestros experimentos: lluvia CHIRPS con redes lineales
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn chirps lluvia rmse lineales cinco control experimentos fira llamada mensual nuestros pliegues prediccion proyecto redes variantes agrocebada agrupado ajusto alternativos atencion backbones cabezas cero
@fuente: Proyecto FIRA 2026 «Reto AgroCebada», README de MMST-ViT, tabla CHIRPS-v3 (validación cruzada de cinco pliegues, RMSE agrupado).
# Nuestros experimentos: lluvia CHIRPS con redes lineales

Como prueba de datos de lluvia alternativos, se reentrenaron modelos DailyCropNet y MMST-ViT con cabezas de predicción lineales y se ajustó un MoE de atención. Se usó CHIRPS v3.0 Final en dos variantes diarias (IMERG, llamada sat, y ERA5, llamada rnl) sobre los mismos cinco pliegues de desarrollo. Cada pliegue
reentrenó los backbones desde cero con 88 parcelas de entrenamiento.

Los resultados fueron: control FIRA mensual, RMSE 0.5309 y MAE 0.3721 t/ha; CHIRPS sat, RMSE 0.6055 y MAE 0.4208 t/ha; CHIRPS rnl, RMSE 0.6306 y MAE 0.4355 t/ha. El control con lluvia mensual del proyecto superó a las dos variantes de CHIRPS. Así, la lluvia diaria de CHIRPS no mejoró la predicción en nuestro protocolo.

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», README de MMST-ViT, tabla CHIRPS-v3 (validación cruzada de cinco pliegues, RMSE agrupado).
