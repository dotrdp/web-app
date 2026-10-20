@id: rag-08-experimentos-profundos-014
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: TabPFN: modelo fundacional tabular para datos pequeños
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn datos tabular articulo fundacional hollmann modelo nature pequenos s41586-024-08328-6 version accurate agricola ajustados analisis aprendizaje arxiv caso clasificacion conjunto conjuntos contexto critico data desempeno
@fuente: Hollmann, N. et al. (2025). Accurate predictions on small data with a tabular foundation model. Nature 637:319-326. DOI 10.1038/s41586-024-08328-6.
# TabPFN: modelo fundacional tabular para datos pequeños

TabPFN (Hollmann et al.) es un transformador preentrenado con millones de conjuntos de datos sintéticos. No se entrena por tarea: al recibir una tabla nueva, predice mediante aprendizaje en contexto. Hollmann et al. (Nature 637:319-326, 2025, DOI 10.1038/s41586-024-08328-6) reportan que su mejor desempeño es en tablas
pequeñas, de hasta unas 10,000 muestras. En clasificación, según el artículo, supera en 2.8 segundos a un conjunto de los mejores métodos de referencia ajustados durante 4 horas.

TabPFN es el caso de modelo fundacional tabular más directamente relevante para 138 parcelas. El artículo original trata sobre datos tabulares generales y no sobre rendimiento agrícola. Una versión posterior (TabPFN-2.5) fue publicada después del artículo de Nature; el análisis crítico de arXiv:2505.20003 usa la
versión TabPFNv2. Los resultados de nuestro proyecto con TabPFN se presentan en la sección de experimentos.

Fuente: Hollmann, N. et al. (2025). Accurate predictions on small data with a tabular foundation model. Nature 637:319-326. DOI 10.1038/s41586-024-08328-6.
