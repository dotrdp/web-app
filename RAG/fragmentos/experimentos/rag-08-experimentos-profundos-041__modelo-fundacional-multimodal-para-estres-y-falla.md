@id: rag-08-experimentos-profundos-041
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Modelo fundacional multimodal para estrés y falla de rendimiento (2026): AgriFM
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn frente modelo falla multimodal rendimiento agrifm dias estres fundacional pruebas albahli alertas auprc auroc division fusion shiraz tardia across agroclimaticas altiplano anticipacion anticipates aprendizaje arroz
@fuente: Albahli, S. y Shiraz, M. (2026), «A multimodal geospatial foundation model anticipates crop stress and yield failure across climates and species», Frontiers in Plant Science 17: 1883297, doi:10.3389/fpls.2026.1883297 (publicado el 27 de julio de 2026; cifras leídas en el artículo completo en la ron…
# Modelo fundacional multimodal para estrés y falla de rendimiento (2026): AgriFM

Albahli y Shiraz (2026) presentan AgriFM, un modelo fundacional multimodal que combina series de imágenes satelitales, radar, térmicas, clima, suelo, topografía y variables de manejo dispersas. Se preentrenó con aprendizaje autosupervisado sobre 2.4 millones de secuencias campaña-campo. La evaluación usó un benchmark
etiquetado de maíz, trigo, soya, arroz y sorgo en cinco regiones agroclimáticas, con 186,214 registros de campo o de parche no traslapado. En pruebas con división por geografía, el AUROC para detectar estrés fue de 0.879 frente a 0.821 de una fusión tardía, y el AUPRC fue de 0.523 frente a 0.418. En pruebas con
división temporal, el AUROC para predecir falla de rendimiento fue de 0.891 frente a 0.846, y el AUPRC de 0.556 frente a 0.428. La mediana de anticipación de alertas fue de 24 días, frente a 13 días de la fusión tardía y 8 días del modelo solo satelital. La calibración de incertidumbre redujo las falsas alertas a
recall fijo en 17.3 % (sequía) y 14.8 % (falla de rendimiento). El estudio es retrospectivo, no reporta R² ni RMSE y no hace pruebas de significancia. Para nuestro proyecto, es una hipótesis que un modelo de esta clase requeriría datos de cebada y de la región del Altiplano para evaluarse.

Fuente: Albahli, S. y Shiraz, M. (2026), «A multimodal geospatial foundation model anticipates crop stress and yield failure across climates and species», Frontiers in Plant Science 17: 1883297, doi:10.3389/fpls.2026.1883297 (publicado el 27 de julio de 2026; cifras leídas en el artículo completo en la ronda 4).
