@id: rag-08-experimentos-profundos-038
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: MMST-ViT original: conjunto de datos del artículo de ICCV 2023
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn articulo conjunto iccv arxiv condado datos usda condados crop dataset experimentos original rendimiento algodon anos cebada change-aware cifras cita climate comparables componentes computed contiene
@fuente: Lin, F. et al. (2023). MMST-ViT: Climate Change-aware Crop Yield Prediction via Multi-Modal Spatial-Temporal Vision Transformer. ICCV 2023, arXiv:2309.09067 (sección 3, Datasets).
# MMST-ViT original: conjunto de datos del artículo de ICCV 2023

Lin et al. (ICCV 2023, arXiv:2309.09067) presentan MMST-ViT para predecir rendimiento a nivel condado en Estados Unidos. Su conjunto de datos tiene tres componentes. El USDA Crop Dataset reúne producción y rendimiento por condado de maíz, algodón, soya y trigo de invierno (el artículo cita «USDA (2022)» sin URL ni
nombre del producto; verificado en la ronda 4 con el PDF de arXiv:2309.09067). El HRRR Computed Dataset contiene variables
meteorológicas diarias (temperaturas media, máxima y mínima, precipitación, humedad relativa, ráfagas y velocidad del viento, radiación de onda corta descendente y déficit de presión de vapor), con parámetros de 2017 a 2022 según el artículo. Las imágenes Sentinel-2 se dividen en cuadrículas de 9 km por condado.

Los experimentos del artículo cubren más de 200 condados. Su preentrenamiento multimodal contrastivo reduce la necesidad de etiquetas humanas. No hay cebada ni condados de México en ese conjunto, así que sus cifras no son comparables con el MAE de 0.3226 t/ha de nuestros experimentos. Los años del USDA no se extrajeron
del PDF.

Fuente: Lin, F. et al. (2023). MMST-ViT: Climate Change-aware Crop Yield Prediction via Multi-Modal Spatial-Temporal Vision Transformer. ICCV 2023, arXiv:2309.09067 (sección 3, Datasets).
