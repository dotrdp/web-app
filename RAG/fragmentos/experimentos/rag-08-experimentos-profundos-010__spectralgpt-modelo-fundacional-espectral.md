@id: rag-08-experimentos-profundos-010
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: SpectralGPT: modelo fundacional espectral
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn modelo spectralgpt tpami espectral fundacional arxiv hong ieee parcelas tamano acepta agricola autores cambios caracteristicas caso cerca clasificacion completas congelar cruzada cualquier debe deteccion embeddings
@fuente: Hong, D. et al. (2024). SpectralGPT: Spectral Remote Sensing Foundation Model. IEEE TPAMI. DOI 10.1109/TPAMI.2024.3362475. arXiv:2311.07113.
# SpectralGPT: modelo fundacional espectral

SpectralGPT (Hong et al., arXiv:2311.07113, IEEE TPAMI, DOI 10.1109/TPAMI.2024.3362475) es un modelo fundacional de teledetección espectral con un transformador generativo 3D. Según el resumen, se entrenó con cerca de un millón de imágenes espectrales y produce modelos de más de 600 millones de parámetros. Acepta
entradas de tamaño, resolución y series temporales variables. Se evaluó en clasificación de escenas (con una o varias etiquetas), segmentación semántica y detección de cambios.

Los autores no reportan estimación de rendimiento agrícola. Para nuestro caso, un modelo de este tamaño es una fuente de características (embeddings) y no un predictor entrenable con 138 parcelas. Cualquier uso debe congelar el modelo y evaluar con validación cruzada por parcelas completas.

Fuente: Hong, D. et al. (2024). SpectralGPT: Spectral Remote Sensing Foundation Model. IEEE TPAMI. DOI 10.1109/TPAMI.2024.3362475. arXiv:2311.07113.
