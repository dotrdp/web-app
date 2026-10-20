@id: rag-08-experimentos-profundos-009
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: SatMAE: enmascarado de imágenes multitemporales
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn satmae imagenes enmascarado multitemporales arxiv bandas cong hasta neurips numero parcelas satelitales temporal adaptacion agrupa anade aprender asigna autoencoder autores benchmarks cebada clasificacion cobertura codificacion
@fuente: Cong, Y., Khanna, S. et al. (2022). SatMAE: Pre-training Transformers for Temporal and Multi-Spectral Satellite Imagery. NeurIPS 2022, arXiv:2207.08051.
# SatMAE: enmascarado de imágenes multitemporales

SatMAE (Cong et al., NeurIPS 2022, arXiv:2207.08051) es un autoencoder enmascarado para imágenes satelitales multitemporales y multiespectrales. Añade un embedding temporal y enmascara parches de forma independiente en cada fecha. Agrupa las bandas espectrales y asigna a cada grupo una codificación posicional
espectral. Los autores reportan mejoras de hasta 7% en benchmarks supervisados y de hasta 14% en clasificación de cobertura del suelo con transferencia.

SatMAE se preentrenó con imágenes satelitales, no con series de parcelas de cebada. Su valor para nosotros es conceptual: enmascarar fechas y bandas obliga al modelo a aprender relaciones temporales. Con 138 parcelas, la adaptación de un transformador de este tamaño requiere cuidado, porque el número de parámetros
supera con mucho el número de etiquetas.

Fuente: Cong, Y., Khanna, S. et al. (2022). SatMAE: Pre-training Transformers for Temporal and Multi-Spectral Satellite Imagery. NeurIPS 2022, arXiv:2207.08051.
