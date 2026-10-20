@id: rag-08-experimentos-profundos-002
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Redes LSTM: memoria para series temporales
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn lstm redes series temporales articulo hochreiter long memoria memory numero parametros parcelas paso problema recomendacion rendimiento schmidhuber short-term valor abril agricola alimenta alto basada capas
@fuente: Hochreiter, S. y Schmidhuber, J. (1997). Long Short-Term Memory. Neural Computation 9(8):1735-1780. DOI 10.1162/neco.1997.9.8.1735.
# Redes LSTM: memoria para series temporales

La red LSTM (long short-term memory) es una red recurrente con compuertas que regulan qué información se conserva o se olvida en cada paso. Hochreiter y Schmidhuber (1997) la propusieron para resolver el problema de desvanecimiento del gradiente en redes recurrentes. Según el resumen del artículo, la LSTM puede cubrir
retardos temporales de más de 1,000 pasos discretos, con un costo computacional de O(1) por paso y por peso. En estimación de rendimiento se alimenta con series semanales o mensuales de índices de vegetación y de clima, y produce un valor por parcela o por condado.

El artículo original no evalúa rendimiento agrícola. Su valor para nuestro problema depende del número de parámetros frente al número de etiquetas. Con 138 parcelas y una serie de 2025 (abril a octubre), una LSTM con muchos parámetros tiene un alto riesgo de sobreajuste. Esto es una recomendación basada en la lógica
del tamaño de muestra, no un resultado medido en el proyecto. La recomendación práctica es usar capas pequeñas, regularización y validación por parcelas completas.

Fuente: Hochreiter, S. y Schmidhuber, J. (1997). Long Short-Term Memory. Neural Computation 9(8):1735-1780. DOI 10.1162/neco.1997.9.8.1735.
