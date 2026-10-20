@id: rag-08-experimentos-profundos-025
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Nuestros experimentos: CNN temporal con validación cruzada
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn cruzada temporal validacion parcelas pliegues cinco completas entrenamiento experimentos nuestros rmse agrocebada area base cifras clima compartir condiciones convoluciona division eligen entrenables epocas espaciales externos
@fuente: Proyecto FIRA 2026 «Reto AgroCebada», README del modelo CNN temporal (validación cruzada de cinco pliegues sobre parcelas completas).
# Nuestros experimentos: CNN temporal con validación cruzada

Nuestra CNN temporal convoluciona a lo largo del tiempo sobre resúmenes parcela-nivel de índices satelitales, clima mensual, área y terreno. Tiene 11,145 parámetros entrenables. Usa cinco pliegues externos que retienen parcelas completas; en cada pliegue, las épocas de entrenamiento se eligen con una división interna.

La validación cruzada dio RMSE 0.5907 t/ha, MAE 0.4422 y R² 0.5149. La media de entrenamiento como línea base dio RMSE 0.8605, MAE 0.7592 y R² -0.0296. Los pliegues no son espaciales: parcelas vecinas pueden compartir condiciones, por lo que estas cifras no prueban transferencia a nuevas regiones o temporadas. 

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», README del modelo CNN temporal (validación cruzada de cinco pliegues sobre parcelas completas).
