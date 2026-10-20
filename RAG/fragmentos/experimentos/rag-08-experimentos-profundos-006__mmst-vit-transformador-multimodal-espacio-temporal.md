@id: rag-08-experimentos-profundos-006
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: MMST-ViT: transformador multimodal espacio-temporal
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn transformador multimodal temporal arxiv cebada condados espacio-temporal iccv multi-modal spatial-temporal transformer vision adelante altos aparecen arquitectura articulo autores base central change-aware climate climaticos codigo
@fuente: Lin, F. et al. (2023). MMST-ViT: Climate Change-aware Crop Yield Prediction via Multi-Modal Spatial-Temporal Vision Transformer. ICCV 2023, arXiv:2309.09067.
# MMST-ViT: transformador multimodal espacio-temporal

MMST-ViT (multi-modal spatial-temporal vision transformer) es un transformador que fusiona imágenes de teledetección y datos meteorológicos cortos, con un transformador espacial para las dependencias entre condados y un transformador temporal para efectos climáticos de largo plazo. Lin et al. (ICCV 2023,
arXiv:2309.09067) lo evaluaron en más de 200 condados de Estados Unidos y propusieron un preentrenamiento contrastivo multimodal para reducir la necesidad de etiquetas humanas. Según el artículo, supera a las líneas base en tres métricas.

Esta arquitectura es el modelo central de nuestro proyecto, que parte del código público de los autores. Su desempeño en cebada de temporal de México debe leerse con nuestros propios resultados de validación cruzada, que aparecen más adelante en este documento. La literatura original no reporta cebada de temporal en
Valles Altos.

Fuente: Lin, F. et al. (2023). MMST-ViT: Climate Change-aware Crop Yield Prediction via Multi-Modal Spatial-Temporal Vision Transformer. ICCV 2023, arXiv:2309.09067.
