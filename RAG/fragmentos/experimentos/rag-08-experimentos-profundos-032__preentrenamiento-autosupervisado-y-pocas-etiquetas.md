@id: rag-08-experimentos-profundos-032
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Preentrenamiento autosupervisado y pocas etiquetas en teledetección
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn modelos teledeteccion autosupervisado etiquetas pocas preentrenamiento arxiv base benchmark datos escenarios etiquetados foundation fundacionales lacoste marsocci models parcelas representaciones ajustan algo anotacion antes aprende argumento
@fuente: Lacoste, A. et al. (2023). GEO-Bench: Toward Foundation Models for Earth Monitoring. arXiv:2306.03831. Marsocci, V. et al. (2024). PANGAEA: A Global and Inclusive Benchmark for Geospatial Foundation Models. arXiv:2412.04204.
# Preentrenamiento autosupervisado y pocas etiquetas en teledetección

El preentrenamiento autosupervisado aprende representaciones de imágenes de teledetección sin anotación humana y después esas representaciones se ajustan a una tarea con pocas etiquetas. Lacoste et al. (2023) lo presentan como el argumento general de los modelos fundacionales: preentrenar con grandes volúmenes de datos
no etiquetados puede aumentar la generalización a tareas posteriores, algo que en teledetección había sido poco probado antes de su benchmark. Marsocci et al. (2024) evalúan modelos fundacionales geoespaciales frente a líneas base supervisadas, precisamente en escenarios con datos etiquetados limitados, y reportan
limitaciones de estos modelos en distintos escenarios; la ventaja no está garantizada.

Para rendimiento de cebada, la literatura consultada no reporta un caso publicado con estos modelos. Con 138 parcelas de una sola temporada, la implicación es de método y no de resultado: comparar siempre contra una línea base supervisada sencilla, con validación por parcelas completas y con intervalos de la
diferencia.

Fuente: Lacoste, A. et al. (2023). GEO-Bench: Toward Foundation Models for Earth Monitoring. arXiv:2306.03831. Marsocci, V. et al. (2024). PANGAEA: A Global and Inclusive Benchmark for Geospatial Foundation Models. arXiv:2412.04204.
