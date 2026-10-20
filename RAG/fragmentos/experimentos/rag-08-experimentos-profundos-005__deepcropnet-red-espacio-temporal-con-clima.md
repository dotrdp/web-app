@id: rag-08-experimentos-profundos-005
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: DeepCropNet: red espacio-temporal con clima
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn deepcropnet aprendizaje articulo clima environmental espacio-temporal forest frente grados-dia lasso letters maiz nombre parte random research rmse temporal ab66cb agregar aparece atencion capas cebada cifras
@fuente: Lin, T. et al. (2020). DeepCropNet: a deep spatial-temporal learning framework for county-level corn yield estimation. Environmental Research Letters 15:034016. DOI 10.1088/1748-9326/ab66cb.
# DeepCropNet: red espacio-temporal con clima

DeepCropNet (DCN) es un marco de aprendizaje profundo para estimar el rendimiento de maíz a nivel de condado. Lin et al. (2020), en Environmental Research Letters, combinan una LSTM con atención para la parte temporal y capas de salida con aprendizaje multitarea para la parte espacial. Sus entradas son tres factores
meteorológicos semanales: grados-día de crecimiento, grados-día de muerte y precipitación. No usa imágenes satelitales; el artículo sugiere agregar índices de vegetación como trabajo futuro.

Según el artículo, en el conjunto de prueba 2015-2016 DCN obtuvo un RMSE de 0.82 Mg/ha, frente a 1.14 de LASSO y 1.05 de Random Forest. En validación cruzada de 6 pliegues reportó un RMSE global de 1.00 Mg/ha, frente a 1.16 de Random Forest y 1.15 de LASSO. Estas cifras son de maíz en Estados Unidos y no son
comparables con la cebada de temporal del reto.

Nota: el nombre DeepCropNet no corresponde a un modelo satelital publicado con ese nombre en la literatura consultada. Si aparece en otra fuente, debe revisarse la referencia.

Fuente: Lin, T. et al. (2020). DeepCropNet: a deep spatial-temporal learning framework for county-level corn yield estimation. Environmental Research Letters 15:034016. DOI 10.1088/1748-9326/ab66cb.
