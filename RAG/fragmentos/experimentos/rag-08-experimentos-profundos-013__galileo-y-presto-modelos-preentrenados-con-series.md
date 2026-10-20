@id: rag-08-experimentos-profundos-013
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Galileo y Presto: modelos preentrenados con series de píxeles
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn presto arxiv galileo modelos pixeles series tseng autores cultivos icml imagenes objetivo preentrenado preentrenados remote sensing transformador alta ambos articulo benchmark benchmarks binario brasil caracteristicas
@fuente: Tseng, G. et al. (2025). Galileo: Learning Global & Local Features of Many Remote Sensing Modalities. ICML 2025, arXiv:2502.09356. Tseng, G. et al. (2023). Lightweight, Pre-trained Transformers for Remote Sensing Timeseries. arXiv:2304.14065.
# Galileo y Presto: modelos preentrenados con series de píxeles

Galileo (Tseng et al., ICML 2025, taller TerraBytes, arXiv:2502.09356) es un transformador preentrenado con muchas modalidades: óptico, radar, elevación, clima y pseudoetiquetas. Su objetivo combina predicciones globales y locales con estrategias de enmascarado distintas. Según los autores, un solo modelo supera a
modelos especialistas en once benchmarks de imágenes y series de píxeles. Mencionan mapeo de cultivos e inundaciones como usos objetivo.

Presto (Tseng et al., 2023, arXiv:2304.14065) es un transformador ligero preentrenado con series de píxeles de teledetección, diseñado para ser pequeño y competitivo. En el benchmark CropHarvest, sus autores reportan F1 binario de 0.891 para Brasil, 0.861 para Kenia (sin Dynamic World) y 0.798 para Togo. El artículo
indica que Presto no procesa imágenes de muy alta resolución (menores de 1 m), y está pensado para 10 m como Sentinel-1 y Sentinel-2.

Ambos modelos se evaluaron en clasificación de cultivos, no en regresión de rendimiento de cebada. Presto es, de los dos, el más compacto y el más fácil de usar como extractor de características con pocas etiquetas.

Fuente: Tseng, G. et al. (2025). Galileo: Learning Global & Local Features of Many Remote Sensing Modalities. ICML 2025, arXiv:2502.09356. Tseng, G. et al. (2023). Lightweight, Pre-trained Transformers for Remote Sensing Timeseries. arXiv:2304.14065.
