@id: rag-08-experimentos-profundos-012
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: TESSERA: embeddings temporales de superficie
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn embeddings tessera temporales version articulo arxiv feng sentinel-2 series superficie afectan analysis antes anual anuales argumentan autores autosupervisado bits cebada cerca citar compresion compuestos cuyas
@fuente: Feng, Z. et al. (2025). TESSERA: Temporal Embeddings of Surface Spectra for Earth Representation and Analysis. arXiv:2506.20380 (versión 4).
# TESSERA: embeddings temporales de superficie

TESSERA (Feng et al., 2025, arXiv:2506.20380) es un modelo autosupervisado de series temporales satelitales que genera embeddings por pixel a 10 m. Usa dos transformadores en paralelo, uno para radar Sentinel-1 y otro para óptico Sentinel-2, cuyas salidas se fusionan en mapas anuales. Según la versión 4 del artículo,
cada embedding anual tiene 128 dimensiones guardadas con 8 bits, con un factor de compresión de cerca de 24 en latitudes medias. Los autores argumentan que las series irregulares por órbitas y nubes afectan la fenología si se usan solo compuestos.

El artículo no reporta estimación de rendimiento de cebada. Como las versiones difieren en detalles (por ejemplo, la resolución de entrada de Sentinel-2 en la v2 y en la v3), la descripción debe citar la versión exacta antes de usarse en un documento técnico.

Fuente: Feng, Z. et al. (2025). TESSERA: Temporal Embeddings of Surface Spectra for Earth Representation and Analysis. arXiv:2506.20380 (versión 4).
