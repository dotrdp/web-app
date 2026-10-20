@id: rag-08-experimentos-profundos-003
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: GRU: variante recurrente con menos compuertas
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn compuertas lstm recurrente arxiv emnlp frente mismo variante actualizacion ancho arbitrada articulo automatica ayudar capacidad cebada cerrada codificadores-decodificadores comparacion conocemos cruzada d14-1179 encoder-decoder estadistica etiquetas
@fuente: Cho, K. et al. (2014). Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation. arXiv:1406.1078 (EMNLP 2014). DOI 10.3115/v1/D14-1179.
# GRU: variante recurrente con menos compuertas

La unidad recurrente cerrada (GRU, gated recurrent unit) fue presentada por Cho et al. (2014) en el artículo sobre codificadores-decodificadores RNN para traducción automática estadística (arXiv:1406.1078, publicado en EMNLP 2014). Usa dos compuertas (de actualización y de reinicio) en lugar de las tres de la LSTM, y
por eso tiene menos parámetros para un mismo tamaño oculto.

En pocas etiquetas, una GRU reduce la capacidad del modelo frente a una LSTM del mismo ancho, lo que puede ayudar a evitar sobreajuste. No conocemos una comparación arbitrada de GRU frente a LSTM para rendimiento de cebada de temporal en México; por eso esta ventaja es una hipótesis. En nuestro proyecto no se evaluó
una GRU con validación cruzada.

Fuente: Cho, K. et al. (2014). Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation. arXiv:1406.1078 (EMNLP 2014). DOI 10.3115/v1/D14-1179.
