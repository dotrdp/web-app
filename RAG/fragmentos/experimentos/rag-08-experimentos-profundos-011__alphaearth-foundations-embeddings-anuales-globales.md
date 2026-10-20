@id: rag-08-experimentos-profundos-011
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: AlphaEarth Foundations: embeddings anuales globales
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn alphaearth embeddings foundations anuales globales version articulo arxiv brown cifras etiquetas global pocas abierto ablacion acceso accurate anual autores calculan campo caracteristica caracteristicas citarse combina
@fuente: Brown, C. F. et al. (2025). AlphaEarth Foundations: An embedding field model for accurate and efficient global mapping from sparse label data. arXiv:2507.22291.
# AlphaEarth Foundations: embeddings anuales globales

AlphaEarth Foundations (Brown et al., 2025, arXiv:2507.22291) es un modelo de campo de embeddings que combina información espacial, temporal y de medición de múltiples fuentes. Los autores lo proponen para mapeos globales con pocas etiquetas: los embeddings se calculan una vez y luego se usan con modelos sencillos. El
artículo describe un conjunto de datos global y anual de embeddings para 2017 a 2024, de acceso abierto.

Para nosotros, AlphaEarth es una fuente de características anuales por pixel o por parcela (64 dimensiones en la versión que usa nuestro proyecto). Esta característica permite usar pocas etiquetas sin reentrenar la red. En la ablación TabPFN más AlphaEarth, con validación cruzada, esos embeddings mejoraron ligeramente
las cifras (ver la sección de transferencia). Las cifras de desempeño dependen de la versión del artículo, así que debe citarse la versión usada.

Fuente: Brown, C. F. et al. (2025). AlphaEarth Foundations: An embedding field model for accurate and efficient global mapping from sparse label data. arXiv:2507.22291.
