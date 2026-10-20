@id: rag-08-experimentos-profundos-004
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: CNN temporal: convoluciones a lo largo del tiempo
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn temporal convoluciones largo tiempo arquitectura convolutional kolter koltun lstm pelletier petitjean serie series webb abril ademas aplica arxiv citados clasificacion clasificar classification codigo convolucional corta
@fuente: Bai, S., Kolter, J. Z. y Koltun, V. (2018). An Empirical Evaluation of Generic Convolutional and Recurrent Networks for Sequence Modeling. arXiv:1803.01271. Pelletier, C., Webb, G. I. y Petitjean, F. (2019). Temporal Convolutional Neural Network for the Classification of Satellite Image Time Series…
# CNN temporal: convoluciones a lo largo del tiempo

Una CNN temporal aplica convoluciones unidimensionales a lo largo del eje de tiempo de una serie de observaciones. Bai, Kolter y Koltun (2018) mostraron, en un estudio empírico de secuencias, que una arquitectura convolucional simple superó a las LSTM en diversas tareas, con una memoria efectiva más larga. Su código
está en el repositorio locuslab/TCN.

En teledetección, Pelletier, Webb y Petitjean (2019) propusieron una TempCNN para clasificar series de imágenes satelitales y reportaron que fue más precisa que Random Forest y que las redes recurrentes con datos de Formosat-2. Dieron además pautas de arquitectura, regularización y tamaño de lote.

Las CNN temporales son útiles cuando la serie es regular y corta, como las 7 fechas mensuales de abril a octubre. Su ventaja sobre las LSTM en pocas etiquetas no está demostrada para rendimiento; los estudios citados son de clasificación con muchas más muestras.

Fuente: Bai, S., Kolter, J. Z. y Koltun, V. (2018). An Empirical Evaluation of Generic Convolutional and Recurrent Networks for Sequence Modeling. arXiv:1803.01271. Pelletier, C., Webb, G. I. y Petitjean, F. (2019). Temporal Convolutional Neural Network for the Classification of Satellite Image Time Series. Remote
Sensing 11(5):523. DOI 10.3390/rs11050523.
