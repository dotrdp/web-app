---
id: rag-08-experimentos-profundos
titulo: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
categoria: experimentos
etiquetas: [estimación de rendimiento, cebada maltera, validación cruzada, MMST-ViT, redes profundas, modelos fundacionales, modelos de cultivo, pocas etiquetas, techo de información, Prithvi, TabPFN]
idioma: es
fecha: 2026-10-18
fuentes_internas: [mmst-vit__README.md, mmst-vit__docs__model_selection_20261006.md, mmst-vit__docs__yield_information_identifiability_20261007.md, mmst-vit__outputs__transfer_iteration_20261007__research__information_ceiling_audit_20261007.md, model__README.md, prithvi-yield__README.md,
tabular-vit_approach__README.md, secciones_validas_documento_anterior.md]
fuentes_externas: ["Hochreiter, S. y Schmidhuber, J. (1997). Long Short-Term Memory. Neural Computation 9(8):1735-1780. DOI 10.1162/neco.1997.9.8.1735", "Cho, K. et al. (2014). Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation. arXiv:1406.1078 (EMNLP 2014). DOI
10.3115/v1/D14-1179 (pp. 1724-1734)", "Bai, S., Kolter, J. Z. y Koltun, V. (2018). An Empirical Evaluation of Generic Convolutional and Recurrent Networks for Sequence Modeling. arXiv:1803.01271", "Pelletier, C., Webb, G. I. y Petitjean, F. (2019). Temporal Convolutional Neural Network for the Classification of
Satellite Image Time Series. Remote Sensing 11(5):523. DOI 10.3390/rs11050523", "Lin, T., Zhong, R., Wang, Y., Xu, J., Jiang, H., Xu, J., Ying, Y., Rodriguez, L., Ting, K. C. y Li, H. (2020). DeepCropNet: a deep spatial-temporal learning framework for county-level corn yield estimation. Environmental Research Letters
15:034016. DOI 10.1088/1748-9326/ab66cb", "Lin, F. et al. (2023). MMST-ViT: Climate Change-aware Crop Yield Prediction via Multi-Modal Spatial-Temporal Vision Transformer. ICCV 2023. arXiv:2309.09067", "Szwarcman, D., Roy, S., Fraccaro, P. et al. (2024; v3 2026; 36 autores según metadatos de arXiv). Prithvi-EO-2.0: A
Versatile Multi-Temporal Foundation Model for Earth Observation Applications. arXiv:2412.02732 (lista de autores según arXiv)", "Cong, Y., Khanna, S. et al. (2022). SatMAE: Pre-training Transformers for Temporal and Multi-Spectral Satellite Imagery. NeurIPS 2022. arXiv:2207.08051", "Hong, D. et al. (2024). SpectralGPT:
Spectral Remote Sensing Foundation Model. IEEE TPAMI. DOI 10.1109/TPAMI.2024.3362475. arXiv:2311.07113", "Brown, C. F. et al. (2025). AlphaEarth Foundations: An embedding field model for accurate and efficient global mapping from sparse label data. arXiv:2507.22291", "Feng, Z. et al. (2025). TESSERA: Temporal
Embeddings of Surface Spectra for Earth Representation and Analysis. arXiv:2506.20380", "Tseng, G. et al. (2025). Galileo: Learning Global & Local Features of Many Remote Sensing Modalities. ICML 2025 (taller TerraBytes). arXiv:2502.09356", "Tseng, G., Cartuyvels, R., Zvonkov, I., Purohit, M., Rolnick, D. y Kerner, H.
(2023). Lightweight, Pre-trained Transformers for Remote Sensing Timeseries (Presto). arXiv:2304.14065", "Hollmann, N. et al. (2025). Accurate predictions on small data with a tabular foundation model. Nature 637:319-326. DOI 10.1038/s41586-024-08328-6", "de Wit, A. et al. (2019). 25 years of the WOFOST cropping
systems model. Agricultural Systems 168:154-167. DOI 10.1016/j.agsy.2018.06.018", "Jones, J. W. et al. (2003). The DSSAT Cropping System Model. European Journal of Agronomy 18(3-4):235-265. DOI 10.1016/S1161-0301(02)00107-7", "Holzworth, D. P. et al. (2014). APSIM - Evolution towards a new generation of agricultural
systems simulation. Environmental Modelling & Software 62:327-350. DOI 10.1016/j.envsoft.2014.07.009", "Lobell, D. B., Thau, D., Seifert, C., Engle, E. y Little, B. (2015). A scalable satellite-based crop yield mapper. Remote Sensing of Environment 164:324-333. DOI 10.1016/j.rse.2015.04.021", "Monteith, J. L. (1972).
Solar radiation and productivity in tropical ecosystems. Journal of Applied Ecology 9(3):747-766. DOI 10.2307/2401901", "Khaki, S., Wang, L. y Archontoulis, S. V. (2020). A CNN-RNN Framework for Crop Yield Prediction. Frontiers in Plant Science 10:1750. DOI 10.3389/fpls.2019.01750", "González González, Zamora Díaz y
Solano Hernández (2016; publicación en línea 2017-10-17). Evaluación agronómica y física en líneas avanzadas de cebada maltera. Revista Mexicana de Ciencias Agrícolas 7(1):159-171. https://cienciasagricolas.inifap.gob.mx/index.php/agricolas/article/view/380", "Anand, A. y Jhajharia, K. (2025). Advanced crop yield
prediction using machine learning and deep learning: a comprehensive review. TELKOMNIKA 23(2). DOI 10.12928/telkomnika.v23i2.26621", "Lacoste, A. et al. (2023). GEO-Bench: Toward Foundation Models for Earth Monitoring. arXiv:2306.03831", "Marsocci, V. et al. (2024). PANGAEA: A Global and Inclusive Benchmark for
Geospatial Foundation Models. arXiv:2412.04204", "Huang et al. (2019). Assimilation of remote sensing into crop growth models: Current status and perspectives. Agricultural and Forest Meteorology 276-277:107609. DOI 10.1016/j.agrformet.2019.06.008 (verificado en Crossref: título, revista, volumen y artículo, octubre de
2019; el resumen no se pudo obtener)", "Keating, B. A. et al. (2003). An overview of APSIM, a model designed
for farming systems simulation. European Journal of Agronomy 18:267-288. DOI 10.1016/S1161-0301(02)00108-9", "Hu et al. (2019). Improvement of sugarcane crop simulation by SWAP-WOFOST model via data assimilation. Field Crops Research 232:49-61. DOI 10.1016/j.fcr.2018.12.009", "Khaki, S., Pham, H. y Wang, L. (2021).
Simultaneous corn and soybean yield prediction from remote sensing data using deep transfer learning. Scientific Reports. DOI 10.1038/s41598-021-89779-z (verificado en Crossref: volumen 11, 27 de mayo de 2021; resumen leído: YieldNet, con 1,132 condados de maíz y 1,076 de soya en Estados Unidos, MAE de 8.74 % y 8.70 %
del rendimiento medio, de uno a cuatro meses antes de la cosecha; artículo completo no consultado)", "Wang et al. (2024). Satellite-based soybean yield prediction in Argentina: A comparison between panel
regression and deep learning. Computers and Electronics in Agriculture. DOI 10.1016/j.compag.2024.108978"]
  - "Albahli, S. y Shiraz, M. (2026), A multimodal geospatial foundation model anticipates crop stress and yield failure across climates and species, Frontiers in Plant Science 17: 1883297, doi:10.3389/fpls.2026.1883297 (publicado el 27 de julio de 2026)"
  - "Ma, Y., Shen, Y., Swatantran, A. y Lobell, D. B. (2025/2026), Harvesting AlphaEarth: Benchmarking the Geospatial Foundation Model for Agricultural Downstream Tasks, arXiv:2601.00857 (Tabla 4 leída en la ronda 4)"
---

## Resumen

Este fragmento describe las familias de modelos profundos, fundacionales y de proceso que se consideran para estimar el rendimiento de cebada maltera de temporal, resume lo que reporta la literatura arbitrada sobre cada una (con énfasis en pocas etiquetas) y reúne nuestros experimentos. Solo se presentan resultados de
validación cruzada de 5 pliegues sobre las 138 parcelas etiquetadas. En esos experimentos, el MAE más bajo de MMST-ViT fue 0.3226 t/ha, frente a 0.3342 t/ha de la configuración pareada, y el objetivo de 0.100 t/ha no se alcanzó. Ningún experimento estableció un techo de información. Las lecciones principales son que
los datos son escasos, que el clima grueso produce confusión entre parcelas con rendimientos distintos, y que los modelos de proceso necesitan calibración local.

## Redes LSTM: memoria para series temporales

La red LSTM (long short-term memory) es una red recurrente con compuertas que regulan qué información se conserva o se olvida en cada paso. Hochreiter y Schmidhuber (1997) la propusieron para resolver el problema de desvanecimiento del gradiente en redes recurrentes. Según el resumen del artículo, la LSTM puede cubrir
retardos temporales de más de 1,000 pasos discretos, con un costo computacional de O(1) por paso y por peso. En estimación de rendimiento se alimenta con series semanales o mensuales de índices de vegetación y de clima, y produce un valor por parcela o por condado.

El artículo original no evalúa rendimiento agrícola. Su valor para nuestro problema depende del número de parámetros frente al número de etiquetas. Con 138 parcelas y una serie de 2025 (abril a octubre), una LSTM con muchos parámetros tiene un alto riesgo de sobreajuste. Esto es una recomendación basada en la lógica
del tamaño de muestra, no un resultado medido en el proyecto. La recomendación práctica es usar capas pequeñas, regularización y validación por parcelas completas.

Fuente: Hochreiter, S. y Schmidhuber, J. (1997). Long Short-Term Memory. Neural Computation 9(8):1735-1780. DOI 10.1162/neco.1997.9.8.1735.

## GRU: variante recurrente con menos compuertas

La unidad recurrente cerrada (GRU, gated recurrent unit) fue presentada por Cho et al. (2014) en el artículo sobre codificadores-decodificadores RNN para traducción automática estadística (arXiv:1406.1078, publicado en EMNLP 2014). Usa dos compuertas (de actualización y de reinicio) en lugar de las tres de la LSTM, y
por eso tiene menos parámetros para un mismo tamaño oculto.

En pocas etiquetas, una GRU reduce la capacidad del modelo frente a una LSTM del mismo ancho, lo que puede ayudar a evitar sobreajuste. No conocemos una comparación arbitrada de GRU frente a LSTM para rendimiento de cebada de temporal en México; por eso esta ventaja es una hipótesis. En nuestro proyecto no se evaluó
una GRU con validación cruzada.

Fuente: Cho, K. et al. (2014). Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation. arXiv:1406.1078 (EMNLP 2014). DOI 10.3115/v1/D14-1179.

## CNN temporal: convoluciones a lo largo del tiempo

Una CNN temporal aplica convoluciones unidimensionales a lo largo del eje de tiempo de una serie de observaciones. Bai, Kolter y Koltun (2018) mostraron, en un estudio empírico de secuencias, que una arquitectura convolucional simple superó a las LSTM en diversas tareas, con una memoria efectiva más larga. Su código
está en el repositorio locuslab/TCN.

En teledetección, Pelletier, Webb y Petitjean (2019) propusieron una TempCNN para clasificar series de imágenes satelitales y reportaron que fue más precisa que Random Forest y que las redes recurrentes con datos de Formosat-2. Dieron además pautas de arquitectura, regularización y tamaño de lote.

Las CNN temporales son útiles cuando la serie es regular y corta, como las 7 fechas mensuales de abril a octubre. Su ventaja sobre las LSTM en pocas etiquetas no está demostrada para rendimiento; los estudios citados son de clasificación con muchas más muestras.

Fuente: Bai, S., Kolter, J. Z. y Koltun, V. (2018). An Empirical Evaluation of Generic Convolutional and Recurrent Networks for Sequence Modeling. arXiv:1803.01271. Pelletier, C., Webb, G. I. y Petitjean, F. (2019). Temporal Convolutional Neural Network for the Classification of Satellite Image Time Series. Remote
Sensing 11(5):523. DOI 10.3390/rs11050523.

## DeepCropNet: red espacio-temporal con clima

DeepCropNet (DCN) es un marco de aprendizaje profundo para estimar el rendimiento de maíz a nivel de condado. Lin et al. (2020), en Environmental Research Letters, combinan una LSTM con atención para la parte temporal y capas de salida con aprendizaje multitarea para la parte espacial. Sus entradas son tres factores
meteorológicos semanales: grados-día de crecimiento, grados-día de muerte y precipitación. No usa imágenes satelitales; el artículo sugiere agregar índices de vegetación como trabajo futuro.

Según el artículo, en el conjunto de prueba 2015-2016 DCN obtuvo un RMSE de 0.82 Mg/ha, frente a 1.14 de LASSO y 1.05 de Random Forest. En validación cruzada de 6 pliegues reportó un RMSE global de 1.00 Mg/ha, frente a 1.16 de Random Forest y 1.15 de LASSO. Estas cifras son de maíz en Estados Unidos y no son
comparables con la cebada de temporal del reto.

Nota: el nombre DeepCropNet no corresponde a un modelo satelital publicado con ese nombre en la literatura consultada. Si aparece en otra fuente, debe revisarse la referencia.

Fuente: Lin, T. et al. (2020). DeepCropNet: a deep spatial-temporal learning framework for county-level corn yield estimation. Environmental Research Letters 15:034016. DOI 10.1088/1748-9326/ab66cb.

## MMST-ViT: transformador multimodal espacio-temporal

MMST-ViT (multi-modal spatial-temporal vision transformer) es un transformador que fusiona imágenes de teledetección y datos meteorológicos cortos, con un transformador espacial para las dependencias entre condados y un transformador temporal para efectos climáticos de largo plazo. Lin et al. (ICCV 2023,
arXiv:2309.09067) lo evaluaron en más de 200 condados de Estados Unidos y propusieron un preentrenamiento contrastivo multimodal para reducir la necesidad de etiquetas humanas. Según el artículo, supera a las líneas base en tres métricas.

Esta arquitectura es el modelo central de nuestro proyecto, que parte del código público de los autores. Su desempeño en cebada de temporal de México debe leerse con nuestros propios resultados de validación cruzada, que aparecen más adelante en este documento. La literatura original no reporta cebada de temporal en
Valles Altos.

Fuente: Lin, F. et al. (2023). MMST-ViT: Climate Change-aware Crop Yield Prediction via Multi-Modal Spatial-Temporal Vision Transformer. ICCV 2023, arXiv:2309.09067.

## CNN-RNN: convolución y recurrencia para rendimiento

Khaki, Wang y Archontoulis (2020) propusieron un modelo CNN-RNN que combina convoluciones con redes recurrentes para predecir el rendimiento de maíz y soya en 13 estados del Corn Belt de Estados Unidos, con datos históricos de clima, suelo y manejo. Compararon el modelo con Random Forest, redes completamente conectadas
y LASSO. Según el resumen, el error RMSE fue de 9% y 8% del rendimiento promedio (para maíz y soya, según el orden que reporta el artículo). Los autores afirman que el modelo generaliza a ambientes no vistos sin una caída significativa de precisión.

La relevancia para nosotros es metodológica: la combinación convolución-recurrencia requiere muchos años y ambientes de entrenamiento. Nuestro dataset tiene una sola temporada (2025) y 138 etiquetas. Por eso, la evidencia de Estados Unidos no implica un desempeño similar. El error relativo reportado (8 a 9%) no es
comparable con el error absoluto en t/ha de nuestro proyecto sin dividir por el rendimiento promedio.

Fuente: Khaki, S., Wang, L. y Archontoulis, S. V. (2020). A CNN-RNN Framework for Crop Yield Prediction. Frontiers in Plant Science 10:1750. DOI 10.3389/fpls.2019.01750.

## Modelos fundacionales geoespaciales: Prithvi-EO-2.0

Prithvi-EO-2.0 es un modelo fundacional multitemporal de observación de la Tierra, preentrenado por IBM, NASA y colaboradores con el archivo HLS (Harmonized Landsat and Sentinel-2) a 30 m. El artículo (arXiv:2412.02732, primera versión de diciembre de 2024) reporta versiones de 300 millones y 600 millones de
parámetros, con embeddings temporales y de ubicación. Según sus autores, la versión de 600 millones supera al modelo Prithvi-EO anterior en un 8% en el banco GEO-Bench.

Los modelos fundacionales son útiles con pocas etiquetas porque se adaptan con una cabeza ligera. Sin embargo, su entrenamiento se hizo con imágenes de teledetección de uso general, no con rendimiento de cebada. La literatura consultada no reporta un desempeño de estimación de rendimiento de cebada de temporal con
Prithvi.

Fuente: Szwarcman, D., Roy, S., Fraccaro, P. et al. (2024; v3 2026). Prithvi-EO-2.0: A Versatile Multi-Temporal Foundation Model for Earth Observation Applications. arXiv:2412.02732. Lista de 36 autores según los metadatos de arXiv (v1: 3 de diciembre de 2024).

## SatMAE: enmascarado de imágenes multitemporales

SatMAE (Cong et al., NeurIPS 2022, arXiv:2207.08051) es un autoencoder enmascarado para imágenes satelitales multitemporales y multiespectrales. Añade un embedding temporal y enmascara parches de forma independiente en cada fecha. Agrupa las bandas espectrales y asigna a cada grupo una codificación posicional
espectral. Los autores reportan mejoras de hasta 7% en benchmarks supervisados y de hasta 14% en clasificación de cobertura del suelo con transferencia.

SatMAE se preentrenó con imágenes satelitales, no con series de parcelas de cebada. Su valor para nosotros es conceptual: enmascarar fechas y bandas obliga al modelo a aprender relaciones temporales. Con 138 parcelas, la adaptación de un transformador de este tamaño requiere cuidado, porque el número de parámetros
supera con mucho el número de etiquetas.

Fuente: Cong, Y., Khanna, S. et al. (2022). SatMAE: Pre-training Transformers for Temporal and Multi-Spectral Satellite Imagery. NeurIPS 2022, arXiv:2207.08051.

## SpectralGPT: modelo fundacional espectral

SpectralGPT (Hong et al., arXiv:2311.07113, IEEE TPAMI, DOI 10.1109/TPAMI.2024.3362475) es un modelo fundacional de teledetección espectral con un transformador generativo 3D. Según el resumen, se entrenó con cerca de un millón de imágenes espectrales y produce modelos de más de 600 millones de parámetros. Acepta
entradas de tamaño, resolución y series temporales variables. Se evaluó en clasificación de escenas (con una o varias etiquetas), segmentación semántica y detección de cambios.

Los autores no reportan estimación de rendimiento agrícola. Para nuestro caso, un modelo de este tamaño es una fuente de características (embeddings) y no un predictor entrenable con 138 parcelas. Cualquier uso debe congelar el modelo y evaluar con validación cruzada por parcelas completas.

Fuente: Hong, D. et al. (2024). SpectralGPT: Spectral Remote Sensing Foundation Model. IEEE TPAMI. DOI 10.1109/TPAMI.2024.3362475. arXiv:2311.07113.

## AlphaEarth Foundations: embeddings anuales globales

AlphaEarth Foundations (Brown et al., 2025, arXiv:2507.22291) es un modelo de campo de embeddings que combina información espacial, temporal y de medición de múltiples fuentes. Los autores lo proponen para mapeos globales con pocas etiquetas: los embeddings se calculan una vez y luego se usan con modelos sencillos. El
artículo describe un conjunto de datos global y anual de embeddings para 2017 a 2024, de acceso abierto.

Para nosotros, AlphaEarth es una fuente de características anuales por pixel o por parcela (64 dimensiones en la versión que usa nuestro proyecto). Esta característica permite usar pocas etiquetas sin reentrenar la red. En la ablación TabPFN más AlphaEarth, con validación cruzada, esos embeddings mejoraron ligeramente
las cifras (ver la sección de transferencia). Las cifras de desempeño dependen de la versión del artículo, así que debe citarse la versión usada.

Fuente: Brown, C. F. et al. (2025). AlphaEarth Foundations: An embedding field model for accurate and efficient global mapping from sparse label data. arXiv:2507.22291.

## TESSERA: embeddings temporales de superficie

TESSERA (Feng et al., 2025, arXiv:2506.20380) es un modelo autosupervisado de series temporales satelitales que genera embeddings por pixel a 10 m. Usa dos transformadores en paralelo, uno para radar Sentinel-1 y otro para óptico Sentinel-2, cuyas salidas se fusionan en mapas anuales. Según la versión 4 del artículo,
cada embedding anual tiene 128 dimensiones guardadas con 8 bits, con un factor de compresión de cerca de 24 en latitudes medias. Los autores argumentan que las series irregulares por órbitas y nubes afectan la fenología si se usan solo compuestos.

El artículo no reporta estimación de rendimiento de cebada. Como las versiones difieren en detalles (por ejemplo, la resolución de entrada de Sentinel-2 en la v2 y en la v3), la descripción debe citar la versión exacta antes de usarse en un documento técnico.

Fuente: Feng, Z. et al. (2025). TESSERA: Temporal Embeddings of Surface Spectra for Earth Representation and Analysis. arXiv:2506.20380 (versión 4).

## Galileo y Presto: modelos preentrenados con series de píxeles

Galileo (Tseng et al., ICML 2025, taller TerraBytes, arXiv:2502.09356) es un transformador preentrenado con muchas modalidades: óptico, radar, elevación, clima y pseudoetiquetas. Su objetivo combina predicciones globales y locales con estrategias de enmascarado distintas. Según los autores, un solo modelo supera a
modelos especialistas en once benchmarks de imágenes y series de píxeles. Mencionan mapeo de cultivos e inundaciones como usos objetivo.

Presto (Tseng et al., 2023, arXiv:2304.14065) es un transformador ligero preentrenado con series de píxeles de teledetección, diseñado para ser pequeño y competitivo. En el benchmark CropHarvest, sus autores reportan F1 binario de 0.891 para Brasil, 0.861 para Kenia (sin Dynamic World) y 0.798 para Togo. El artículo
indica que Presto no procesa imágenes de muy alta resolución (menores de 1 m), y está pensado para 10 m como Sentinel-1 y Sentinel-2.

Ambos modelos se evaluaron en clasificación de cultivos, no en regresión de rendimiento de cebada. Presto es, de los dos, el más compacto y el más fácil de usar como extractor de características con pocas etiquetas.

Fuente: Tseng, G. et al. (2025). Galileo: Learning Global & Local Features of Many Remote Sensing Modalities. ICML 2025, arXiv:2502.09356. Tseng, G. et al. (2023). Lightweight, Pre-trained Transformers for Remote Sensing Timeseries. arXiv:2304.14065.

## TabPFN: modelo fundacional tabular para datos pequeños

TabPFN (Hollmann et al.) es un transformador preentrenado con millones de conjuntos de datos sintéticos. No se entrena por tarea: al recibir una tabla nueva, predice mediante aprendizaje en contexto. Hollmann et al. (Nature 637:319-326, 2025, DOI 10.1038/s41586-024-08328-6) reportan que su mejor desempeño es en tablas
pequeñas, de hasta unas 10,000 muestras. En clasificación, según el artículo, supera en 2.8 segundos a un conjunto de los mejores métodos de referencia ajustados durante 4 horas.

TabPFN es el caso de modelo fundacional tabular más directamente relevante para 138 parcelas. El artículo original trata sobre datos tabulares generales y no sobre rendimiento agrícola. Una versión posterior (TabPFN-2.5) fue publicada después del artículo de Nature; el análisis crítico de arXiv:2505.20003 usa la
versión TabPFNv2. Los resultados de nuestro proyecto con TabPFN se presentan en la sección de experimentos.

Fuente: Hollmann, N. et al. (2025). Accurate predictions on small data with a tabular foundation model. Nature 637:319-326. DOI 10.1038/s41586-024-08328-6.

## WOFOST: modelo de proceso de cultivo

WOFOST es un modelo de simulación de cultivos basado en procesos fisiológicos (fotosíntesis, respiración, desarrollo fenológico y asignación de biomasa) que corre con variables de clima, suelo y manejo. De Wit et al. (2019) lo describen tras 25 años de uso operativo en el sistema MARS de pronóstico de rendimientos de
la Unión Europea. El artículo actualiza la descripción del modelo y revisa lecciones de calibración, parametrización y control de versiones. Incluye orientación para calibración espacial cuando los datos de campo son limitados.

WOFOST no requiere etiquetas de rendimiento para correr, pero sus parámetros de cultivar y de suelo sí deben calibrarse con datos locales para que sus salidas sean útiles. En nuestro caso, con 138 parcelas de una sola temporada, la calibración local es el paso más limitado. Esta es una lección, no un resultado de
nuestros experimentos; no se simuló WOFOST en el proyecto.

Fuente: de Wit, A. et al. (2019). 25 years of the WOFOST cropping systems model. Agricultural Systems 168:154-167. DOI 10.1016/j.agsy.2018.06.018.

## DSSAT y CERES-Barley: modelos de proceso con módulo de cebada

DSSAT (Decision Support System for Agrotechnology Transfer) es un sistema de modelos de cultivo cuyo núcleo, DSSAT-CSM, fue presentado por Jones et al. (2003) en European Journal of Agronomy 18:235-265. Según el resumen, el sistema reúne 16 modelos de cultivo con módulos comunes de suelo, clima, competencia por luz y
agua, y una plantilla de cultivo. CERES-Barley es el módulo de cebada dentro de DSSAT.

La calibración de CERES-Barley usa coeficientes genéticos del cultivar. Se han reportado calibraciones con GenCalc, Time Series Estimator y PEST en Corea, Alemania e Irán. Un estudio iraní de riego deficitario reportó errores SRMSE de 5.5% para el rendimiento de grano, 10.9% para paja y 3.6% para biomasa total. El DOI
de Jones et al. (2003) se confirmó en Crossref (10.1016/S1161-0301(02)00107-7). La referencia primaria de CERES-Barley no se encontró en la ronda 4: sin evidencia. Un registro de repositorio universitario atribuye el modelo de cebada a Ritchie et al. (1987), derivado del modelo de trigo de Ritchie et al. (1984) (fuente
secundaria, no verificada en el texto primario). Corrección: la cita de Otter-Nacke et al. (1991) que aparecía antes no corresponde a CERES-Barley; su registro en Crossref es un estudio de modelos de nitrógeno en campos de agricultores, y el trabajo de Ritchie y Otter (1985) describe el modelo de trigo.

Fuente: Jones, J. W. et al. (2003). The DSSAT Cropping System Model. European Journal of Agronomy 18(3-4):235-265. DOI 10.1016/S1161-0301(02)00107-7. Estudio de calibración de CERES-Barley: Irán, PEST, versión 4 de DSSAT (referencia de revista no verificada en esta sesión).

## APSIM: sistema de simulación agrícola

APSIM (Agricultural Production Systems sIMulator) es una plataforma de simulación de sistemas agrícolas que, según Holzworth et al. (2014), creció durante unos veinte años hasta cubrir desde la expresión génica hasta granjas de varios campos. El artículo, en Environmental Modelling & Software 62:327-350 (DOI
10.1016/j.envsoft.2014.07.009), describe su evolución hacia una nueva generación de sistemas de simulación.

APSIM incluye módulos de cultivo, de suelo y de manejo. Como WOFOST y DSSAT, su desempeño para rendimiento de cebada en Valles Altos depende de calibración local (fenología, rendimiento potencial y manejo). No hay en el corpus una calibración de APSIM para este reto, y no se recomienda usarla sin datos de manejo, que
el dataset no contiene.

Fuente: Holzworth, D. P. et al. (2014). APSIM - Evolution towards a new generation of agricultural systems simulation. Environmental Modelling & Software 62:327-350. DOI 10.1016/j.envsoft.2014.07.009.

## SCYM: rendimiento satelital con modelo de cultivo

SCYM (Scalable Crop Yield Mapper) es un método de Lobell et al. (2015) que combina simulaciones de un modelo de cultivo con imágenes satelitales y clima para estimar rendimiento a 30 m, sin calibración con datos de tierra en el área de estudio. El artículo apareció en Remote Sensing of Environment 164:324-333. Según la
descripción secundaria consultada, el método procesó datos Landsat en Google Earth Engine.

SCYM es un ejemplo de modelo híbrido: el modelo de cultivo aporta la fisiología y el satélite aporta la variación espacial. Su ventaja con pocas etiquetas es que no necesita etiquetas para calibrar. Su desventaja es que depende de la calibración del modelo de cultivo base. El DOI (10.1016/j.rse.2015.04.021) se confirmó
en Crossref.

Fuente: Lobell, D. B. et al. (2015). A scalable satellite-based crop yield mapper. Remote Sensing of Environment 164:324-333. DOI 10.1016/j.rse.2015.04.021.

## Eficiencia de uso de la radiación: modelo de Monteith

La eficiencia de uso de la radiación (RUE, radiation use efficiency) relaciona la materia seca producida con la radiación fotosintéticamente activa interceptada. Monteith (1972) en Journal of Applied Ecology presentó ecuaciones para estimar la producción de materia seca de cultivos entre 14 grados S y 43 grados N.
Según el resumen, las estimaciones concordaron con datos medidos durante el crecimiento vegetativo, pero sobrestimaron la producción en la fase reproductiva.

La RUE es la base de muchos modelos simples de rendimiento con índices satelitales. Con 138 parcelas, un modelo de RUE tiene pocos parámetros y puede calibrarse localmente. La limitación es la fase reproductiva de la cebada en temporal, que los datos de NDVI mensuales capturan mal. El volumen (9(3)) y el DOI
(10.2307/2401901) de Monteith (1972) se confirmaron en Crossref; la página final (766) no se confirmó en la ronda 4 (Crossref da 747 como página inicial).

Fuente: Monteith, J. L. (1972). Solar radiation and productivity in tropical ecosystems. Journal of Applied Ecology 9(3):747-766. DOI 10.2307/2401901.

## Cebada maltera en Valles Altos: rendimientos experimentales

El INIFAP evaluó líneas avanzadas de cebada maltera en condiciones de temporal de Valles Altos en los ciclos 2012 y 2013. En cinco ambientes de temporal, cuatro líneas experimentales (M176, M177, M178 y M184) rindieron 3.8, 3.5, 3.9 y 4.0 t/ha, respectivamente, en un diseño látice 4 x 4 con cuatro repeticiones. Son
líneas experimentales, no variedades comerciales. Estos valores son de ensayos de campo en parcelas experimentales, no de parcelas de productores.

Los rendimientos del reto (2.00 a 5.59 t/ha) están en el mismo rango que estos ensayos. Por eso, la cebada de temporal puede alcanzar rendimientos cercanos a los del experimento en buenos años, pero la variación entre parcelas de productores es mayor. Esta comparación es descriptiva, no una prueba de desempeño de
modelos.

Fuente: González González, Zamora Díaz y Solano Hernández (2016; publicación en línea 2017). Evaluación agronómica y física en líneas avanzadas de cebada maltera. Revista Mexicana de Ciencias Agrícolas 7(1):159-171. https://cienciasagricolas.inifap.gob.mx/index.php/agricolas/article/view/380

## Pocas etiquetas: qué reporta la literatura

Las revisiones de rendimiento con aprendizaje profundo coinciden en que las redes profundas requieren muchos datos etiquetados. Una revisión reciente, con el título "Advanced crop yield prediction using machine learning and deep learning: a comprehensive review" (Anand y Jhajharia, 2025; TELKOMNIKA 23(2)), concluye que
los modelos profundos funcionan mejor con grandes conjuntos y que el aprendizaje automático clásico es más robusto con conjuntos pequeños. Otros trabajos exploran la transferencia entre cultivos con datos de otra fuente (Khaki, Pham y Wang, 2021, maíz y soya). La búsqueda no respaldó que el ajuste fino sea la
estrategia principal para regiones con pocos datos: la afirmación previa sobre soya de Argentina y Brasil queda CORREGIDA y retirada.

Para nosotros, esto implica que un modelo profundo entrenado desde cero con 138 parcelas puede ser peor que un modelo sencillo. Esta es una conclusión de la literatura y de nuestro tamaño de muestra, y debe comprobarse con validación cruzada en cada caso. El año de la revisión (2025) y su conclusión sobre tamaño de
muestra se verificaron en el resumen.

Fuente: Anand, A. y Jhajharia, K. (2025). Advanced crop yield prediction using machine learning and deep learning: a comprehensive review. TELKOMNIKA 23(2). DOI 10.12928/telkomnika.v23i2.26621.

## Nuestros experimentos: búsqueda de arquitectura de MMST-ViT

Nuestros experimentos evaluaron MMST-ViT con validación cruzada de 5 pliegues sobre las 138 parcelas etiquetadas, con 28 o 27 parcelas en cada pliegue. Cada parcela se predijo una vez fuera de su pliegue de entrenamiento. El MAE más bajo medido fue 0.3226 t/ha, frente a 0.3342 t/ha de la configuración pareada. El
intervalo de confianza de la diferencia incluye cero, así que la mejora no es concluyente. Otras variantes (pérdida con atención, distribuciones de salida, atención geográfica, historia oficial de clima de cebada y apilamiento) no superaron 0.3226 t/ha.

El objetivo de 0.100 t/ha (100 kg/ha) no se alcanzó. Tampoco se logró demostrar un techo de información. Conclusión: la búsqueda de arquitectura no redujo el error de forma sustancial.

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», iteración de arquitectura del 7 de octubre de 2026 (mmst-vit README y registros de validación cruzada).

## Nuestros experimentos: transferencia con datos nuevos

Los experimentos de transferencia usaron imágenes verificadas de 2025, suelos, radar, escenarios de estrés hídrico de temporal, preentrenamiento en trigo y adaptación de modelos fundacionales. Todas las comparaciones usaron el mismo protocolo de 138 etiquetas con cinco pliegues. Con datos añadidos, ninguna variante
alcanzó 0.100 t/ha ni estableció un techo de información. La mejor puntuación medida sigue siendo 0.3226 t/ha.

En una comparación independiente de TabPFN y AlphaEarth (120 ajustes de atención con cinco pliegues), TabPFN nativo obtuvo MAE 0.4095 y RMSE 0.5570 t/ha. Sus características extraídas con un solo experto de atención obtuvieron MAE 0.4357 y RMSE 0.5979 t/ha. Con la misma arquitectura de atención, MMST más DailyCropNet
obtuvo MAE 0.3492 y RMSE 0.5247 t/ha, y al añadir las características de TabPFN y AlphaEarth el MAE mejoró a 0.3452 y el RMSE a 0.5111 t/ha.

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», iteración de transferencia del 7 de octubre de 2026 y ablación TabPFN + AlphaEarth (validación cruzada de cinco pliegues).

## Nuestros experimentos: lluvia CHIRPS con redes lineales

Como prueba de datos de lluvia alternativos, se reentrenaron modelos DailyCropNet y MMST-ViT con cabezas de predicción lineales y se ajustó un MoE de atención. Se usó CHIRPS v3.0 Final en dos variantes diarias (IMERG, llamada sat, y ERA5, llamada rnl) sobre los mismos cinco pliegues de desarrollo. Cada pliegue
reentrenó los backbones desde cero con 88 parcelas de entrenamiento.

Los resultados fueron: control FIRA mensual, RMSE 0.5309 y MAE 0.3721 t/ha; CHIRPS sat, RMSE 0.6055 y MAE 0.4208 t/ha; CHIRPS rnl, RMSE 0.6306 y MAE 0.4355 t/ha. El control con lluvia mensual del proyecto superó a las dos variantes de CHIRPS. Así, la lluvia diaria de CHIRPS no mejoró la predicción en nuestro protocolo.

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», README de MMST-ViT, tabla CHIRPS-v3 (validación cruzada de cinco pliegues, RMSE agrupado).

## Nuestros experimentos: CNN temporal con validación cruzada

Nuestra CNN temporal convoluciona a lo largo del tiempo sobre resúmenes parcela-nivel de índices satelitales, clima mensual, área y terreno. Tiene 11,145 parámetros entrenables. Usa cinco pliegues externos que retienen parcelas completas; en cada pliegue, las épocas de entrenamiento se eligen con una división interna.

La validación cruzada dio RMSE 0.5907 t/ha, MAE 0.4422 y R² 0.5149. La media de entrenamiento como línea base dio RMSE 0.8605, MAE 0.7592 y R² -0.0296. Los pliegues no son espaciales: parcelas vecinas pueden compartir condiciones, por lo que estas cifras no prueban transferencia a nuevas regiones o temporadas. 

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», README del modelo CNN temporal (validación cruzada de cinco pliegues sobre parcelas completas).

## Nuestros experimentos: modelo Prithvi con capa de salida

Nuestro experimento con Prithvi-EO-2.0-600M-TL usó el modelo sin cambios, salvo una red feed-forward al final, con 32 canales de entrada y 7 fotogramas mensuales. Carga 493 de 498 tensores preentrenados sin cambios. Las entradas son 7 meses (abril a octubre) de imágenes de 224 x 224 px a 10 m (2.24 km por lado): NDVI
de Sentinel-2, biomasa y altura de dosel de modelos Granite, temperatura superficial y 27 variables de AgERA5.

El entrenamiento fue en dos etapas: primero con rendimientos municipales de temporal de SIAP (89 municipios con etiquetas de 2016 a 2024) y luego con las parcelas FIRA. La documentación del experimento no reporta métricas, así que no es posible afirmar si funcionó. Este resultado queda como pendiente: se necesita la
evaluación con validación cruzada sobre las 138 parcelas para cerrar la comparación.

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», README del experimento Prithvi-yield (sin métricas documentadas).

## Nuestros experimentos: datos HLS y Landsat preparados

Los datos satelitales preparados incluyen 1,198 escenas HLS v2.0 (666 de Landsat 8/9 L30 y 532 de Sentinel-2 S30) de enero de 2022 a octubre de 2025, para las 197 parcelas. Cada parcela tiene una ventana de 224 x 224 px a 30 m. La temperatura superficial de Landsat se calculó por parcela con reglas de píxel y se
verificó contra valores previos: 17,310 observaciones parcela-escena, con diferencia media absoluta de 0.0008 °C.

En 2025, 130 de las 197 parcelas no tienen ninguna escena observada en septiembre, y 29 no tienen en junio. Esto limita el uso de temperatura superficial de septiembre y debe considerarse en los modelos. Estos archivos son datos; no aportan ningún RMSE. Los modelos Granite de temperatura superficial, biomasa y altura
de dosel se prepararon pero no se usaron en los experimentos de modelado.

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», documentación de datos HLS y Landsat (tabular-vit_approach).

## Nuestros experimentos: identificabilidad y techo de información

Las 138 etiquetas de rendimiento van de 2.00 a 5.59 t/ha, con 67 valores distintos en una cuadrícula de 0.01 t/ha. El archivo no incluye mediciones repetidas de una misma parcela-temporada, ni otros años etiquetados, ni una clasificación medida de riego o temporal. Tampoco hay fechas de siembra o cosecha, cultivar ni
fertilización. Por eso, "temporal" solo puede usarse como supuesto de modelado.

Con las representaciones de entrada, las 138 etiquetas tienen vectores distintos en AEF 2024 (64 valores), en Sentinel-2 corregido (155 valores), en SoilGrids (76 valores) y en Sentinel-1 (91 valores). Solo el clima y la cobertura (462 valores) producen 43 vectores distintos, con 11 grupos duplicados en conflicto. La
cota inferior con solo clima es 0.190724649 t/ha, sumando en los cinco pliegues el mínimo error absoluto de cada grupo. Esta cota muestra confusión por clima grueso, no un techo general. Con todas las entradas, la cota por duplicados es cero, y eso no prueba generalización perfecta ni un piso de error positivo.

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», registros de identificabilidad y auditoría del techo de información (7 de octubre de 2026).

## Lección: pocos datos y confusión climática

Con 138 parcelas de una sola temporada, las comparaciones de modelos son relativas. Por ejemplo, la CNN temporal (MAE 0.4422 t/ha) y la línea base de media (MAE 0.7592 t/ha) están separadas por más de 0.3 t/ha, pero la mejora de MMST-ViT frente a su configuración pareada (0.3226 frente a 0.3342 t/ha) no es concluyente.
Nuestro registro de identificabilidad muestra que el clima grueso (462 valores de clima y cobertura) asigna 43 vectores distintos a las 138 etiquetas, con grupos en conflicto, lo que apunta a confusión por clima más que a una relación municipal demostrada; el efecto municipal no se midió en nuestros experimentos.

La literatura de pocas etiquetas (TabPFN, Presto, modelos fundacionales) indica que los modelos preentrenados ayudan cuando hay pocas etiquetas, pero no garantizan mejora en cebada. Nuestra recomendación es usar validación cruzada por parcelas completas, comparar con líneas base sencillas y reportar intervalos de la
diferencia.

Fuente: Síntesis de la literatura citada en este documento y de nuestros resultados de validación cruzada (recomendación, no resultado publicado).

## Lección: calibración local de modelos de proceso

WOFOST, DSSAT (con CERES-Barley) y APSIM necesitan calibración con datos locales de fenología, rendimiento potencial y manejo. De Wit et al. (2019) recomiendan calibración espacial cuando los datos de campo son limitados. La calibración de CERES-Barley en Irán con PEST logró errores de 5.5% a 10.9% en grano y paja.
Nuestro dataset no incluye las variables de manejo y fenología que estos modelos necesitan, así que una calibración local directa no es posible sin datos adicionales.

Por eso, los modelos de proceso son más útiles como referencia o como generadores de características (por ejemplo, rendimiento potencial simulado) que como predictores directos. Esta es una recomendación basada en la literatura y en los datos disponibles, no un resultado de nuestros experimentos.

Fuente: de Wit, A. et al. (2019). Agricultural Systems 168:154-167; calibración de CERES-Barley con PEST en Irán (referencia de revista no verificada en esta sesión).

## Lección: el techo de información no está establecido

Una cota de error sirve solo si se conocen las fuentes del error. Con 138 observaciones únicas por vector de entrada, la cota por duplicados con todas las entradas es cero. Un ejemplo construido demuestra que observaciones únicas, por sí solas, no implican un piso positivo, porque una distribución condicional con
dispersión alrededor de la mediana produce un error mínimo positivo (0.2 t/ha en el ejemplo).

Para establecer un techo harían falta repeticiones con protocolo de medición, registros de manejo o nuevas temporadas etiquetadas. Con los datos actuales, el error de validación cruzada no puede separarse entre error del modelo, ruido de medición y variación no observada. Las comparaciones entre variantes son
relativas.

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», auditoría del techo de información (7 de octubre de 2026). Principio de cota por duplicados según la documentación del proyecto.

## Preentrenamiento autosupervisado y pocas etiquetas en teledetección

El preentrenamiento autosupervisado aprende representaciones de imágenes de teledetección sin anotación humana y después esas representaciones se ajustan a una tarea con pocas etiquetas. Lacoste et al. (2023) lo presentan como el argumento general de los modelos fundacionales: preentrenar con grandes volúmenes de datos
no etiquetados puede aumentar la generalización a tareas posteriores, algo que en teledetección había sido poco probado antes de su benchmark. Marsocci et al. (2024) evalúan modelos fundacionales geoespaciales frente a líneas base supervisadas, precisamente en escenarios con datos etiquetados limitados, y reportan
limitaciones de estos modelos en distintos escenarios; la ventaja no está garantizada.

Para rendimiento de cebada, la literatura consultada no reporta un caso publicado con estos modelos. Con 138 parcelas de una sola temporada, la implicación es de método y no de resultado: comparar siempre contra una línea base supervisada sencilla, con validación por parcelas completas y con intervalos de la
diferencia.

Fuente: Lacoste, A. et al. (2023). GEO-Bench: Toward Foundation Models for Earth Monitoring. arXiv:2306.03831. Marsocci, V. et al. (2024). PANGAEA: A Global and Inclusive Benchmark for Geospatial Foundation Models. arXiv:2412.04204.

## PANGAEA: protocolo estandarizado para modelos fundacionales geoespaciales

PANGAEA (Marsocci et al., diciembre de 2024, arXiv:2412.04204) es un protocolo de evaluación para modelos fundacionales geoespaciales (GFM, por sus siglas en inglés). Cubre conjuntos de datos, tareas, resoluciones, sensores y temporalidades diversos. Sus autores señalan que muchos benchmarks previos son demasiado
fáciles o estrechos y que están sesgados geográficamente hacia Norteamérica y Europa, por lo que buscan una cobertura global.

Los autores comparan los GFM disponibles con líneas base supervisadas, como UNet y ViT básico, y analizan su eficacia cuando hay pocas etiquetas. Para el proyecto, el aporte es metodológico: antes de adoptar un GFM para cebada de temporal conviene correrlo bajo el mismo protocolo que una línea base supervisada. En las
fuentes consultadas no se encontró una evaluación de PANGAEA en rendimiento agrícola de cebada ni en regresión por parcela.

Fuente: Marsocci, V. et al. (2024). PANGAEA: A Global and Inclusive Benchmark for Geospatial Foundation Models. arXiv:2412.04204.

## GEO-Bench: estructura de un benchmark para modelos de monitoreo de la Tierra

GEO-Bench (Lacoste et al., 2023, arXiv:2306.03831, 6 de junio de 2023) propone seis tareas de clasificación y seis de segmentación, curadas para ser relevantes al monitoreo de la Tierra y adecuadas para evaluar modelos. Acompaña el conjunto con una metodología de evaluación y de reporte agregado, pensada para medir el
avance de forma confiable. Los autores reportan resultados de 20 líneas base.

Para nuestro proyecto, el valor de GEO-Bench es de protocolo: reportar resultados agregados con una metodología común y no con una sola tarea. Sus tareas son de clasificación y segmentación, no de regresión de rendimiento agrícola, así que sus cifras no son comparables con el MAE en t/ha de nuestros experimentos.

Fuente: Lacoste, A. et al. (2023). GEO-Bench: Toward Foundation Models for Earth Monitoring. arXiv:2306.03831.

## Asimilación de datos satelitales en modelos de cultivo

La asimilación de datos combina observaciones de satélite con un modelo de crecimiento de cultivo para corregir sus variables de estado durante la temporada, en lugar de depender solo de la calibración inicial. Huang et al. (2019), en Agricultural and Forest Meteorology (volumen 276-277, artículo 107609), publicaron
una revisión sobre el estado actual y las perspectivas de este enfoque. El resumen no se recuperó en esta sesión; solo se verificaron título, autores y referencia.

Para cebada de temporal, la asimilación exige observaciones con buena cobertura de fechas. En nuestro dataset, 130 de 197 parcelas no tienen escena observada en septiembre de 2025 y 29 no tienen en junio (sección de datos HLS), lo que limita la asimilación en esas fechas. Esta es una implicación para el proyecto, no un
resultado publicado.

Fuente: Huang et al. (2019). Assimilation of remote sensing into crop growth models: Current status and perspectives. Agricultural and Forest Meteorology 276-277:107609. DOI 10.1016/j.agrformet.2019.06.008 (verificado en Crossref: título, revista, volumen y artículo, octubre de 2019; el resumen no se pudo obtener).

## APSIM: visión general del modelo de sistemas agrícolas

APSIM se presentó como un modelo diseñado para simular sistemas agrícolas completos. Keating et al. (2003), en European Journal of Agronomy (18:267-288), publicaron la visión general original de la plataforma, anterior a la revisión de Holzworth et al. (2014) que citamos en este documento. Un sistema de este tipo
integra módulos de cultivo, suelo y manejo.

Para cebada, la pregunta práctica es la parametrización: fenología, cultivar y manejo. Las evaluaciones de APSIM que encontramos en la búsqueda son de trigo (Punjab, India, 2011) y girasol (Mongolia Interior, China, 2016), no de cebada de temporal. Esos resultados no se trasladan directamente a cebada; cualquier uso en
el reto requiere recalibrar con datos de manejo que el dataset no contiene.

Fuente: Keating, B. A. et al. (2003). An overview of APSIM, a model designed for farming systems simulation. European Journal of Agronomy 18:267-288. DOI 10.1016/S1161-0301(02)00108-9.

## WOFOST y APSIM para cebada: calibración de parámetros de cultivo

La calibración de un modelo de proceso para cebada requiere parámetros de cultivar (fenología, rendimiento potencial y coeficientes de crecimiento) ajustados con experimentos que registren fechas de siembra, floración y madurez. De Wit et al. (2019) describen en WOFOST la calibración de parámetros y la necesidad de
datos locales para que las salidas sean útiles.

En la búsqueda bibliográfica realizada no encontramos calibraciones de WOFOST para cebada de temporal en México ni parámetros de cultivar de cebada publicados para WOFOST. Los trabajos recuperados de WOFOST corresponden a caña de azúcar, con asimilación de datos (Hu et al., 2019), y a una metodología reciente de
calibración de fenología sin cebada. Esta ausencia es una limitación de la evidencia, no un resultado: cualquier calibración local debe empezar por fenología con fechas observadas.

Fuente: de Wit, A. et al. (2019). 25 years of the WOFOST cropping systems model. Agricultural Systems 168:154-167. DOI 10.1016/j.agsy.2018.06.018. Hu et al. (2019). Field Crops Research 232:49-61. DOI 10.1016/j.fcr.2018.12.009.

## MMST-ViT original: conjunto de datos del artículo de ICCV 2023

Lin et al. (ICCV 2023, arXiv:2309.09067) presentan MMST-ViT para predecir rendimiento a nivel condado en Estados Unidos. Su conjunto de datos tiene tres componentes. El USDA Crop Dataset reúne producción y rendimiento por condado de maíz, algodón, soya y trigo de invierno (el artículo cita «USDA (2022)» sin URL ni
nombre del producto; verificado en la ronda 4 con el PDF de arXiv:2309.09067). El HRRR Computed Dataset contiene variables
meteorológicas diarias (temperaturas media, máxima y mínima, precipitación, humedad relativa, ráfagas y velocidad del viento, radiación de onda corta descendente y déficit de presión de vapor), con parámetros de 2017 a 2022 según el artículo. Las imágenes Sentinel-2 se dividen en cuadrículas de 9 km por condado.

Los experimentos del artículo cubren más de 200 condados. Su preentrenamiento multimodal contrastivo reduce la necesidad de etiquetas humanas. No hay cebada ni condados de México en ese conjunto, así que sus cifras no son comparables con el MAE de 0.3226 t/ha de nuestros experimentos. Los años del USDA no se extrajeron
del PDF.

Fuente: Lin, F. et al. (2023). MMST-ViT: Climate Change-aware Crop Yield Prediction via Multi-Modal Spatial-Temporal Vision Transformer. ICCV 2023, arXiv:2309.09067 (sección 3, Datasets).

## Aprendizaje profundo con pocas etiquetas: lo que dice la revisión de 2025

Anand y Jhajharia (2025), en TELKOMNIKA 23(2), revisan aprendizaje automático y profundo para predecir rendimiento de cultivos, con énfasis en datos de teledetección. Su resumen concluye que los modelos de aprendizaje profundo son más eficaces con conjuntos de datos grandes, mientras que los modelos de aprendizaje
automático clásico siguen siendo robustos con conjuntos pequeños. Propone además desarrollar modelos generalizables para distintos cultivos y regiones.

Para 138 parcelas, la implicación es que una red profunda entrenada desde cero puede no superar a métodos clásicos. Es una conclusión de la literatura y del tamaño de muestra, no un resultado de nuestros experimentos; el resumen tampoco cuantifica un umbral de tamaño de muestra.

Fuente: Anand, A. y Jhajharia, K. (2025). Advanced crop yield prediction using machine learning and deep learning: a comprehensive review. TELKOMNIKA 23(2). DOI 10.12928/telkomnika.v23i2.26621.

## Transferencia de aprendizaje profundo entre cultivos: maíz y soya

Khaki, Pham y Wang (2021), en Scientific Reports, presentan la predicción simultánea de rendimiento de maíz y soya a partir de datos de teledetección con aprendizaje profundo por transferencia (DOI 10.1038/s41598-021-89779-z). La transferencia consiste en preentrenar una red con un problema que tiene más datos, por
ejemplo otro cultivo o región, y ajustarla al problema de interés.

Los datos cuantitativos del artículo no se consultaron en esta sesión, porque el texto completo no fue accesible; por eso este fragmento solo describe el enfoque. Para cebada de temporal, la transferencia tendría que probarse con datos de cebada o de regiones comparables; un modelo entrenado con maíz y soya de Estados
Unidos no sustituye a datos de cebada mexicana.

Fuente: Khaki, S., Pham, H. y Wang, L. (2021). Simultaneous corn and soybean yield prediction from remote sensing data using deep transfer learning. Scientific Reports. DOI 10.1038/s41598-021-89779-z (metadatos de Crossref).

## Modelo fundacional multimodal para estrés y falla de rendimiento (2026): AgriFM

Albahli y Shiraz (2026) presentan AgriFM, un modelo fundacional multimodal que combina series de imágenes satelitales, radar, térmicas, clima, suelo, topografía y variables de manejo dispersas. Se preentrenó con aprendizaje autosupervisado sobre 2.4 millones de secuencias campaña-campo. La evaluación usó un benchmark
etiquetado de maíz, trigo, soya, arroz y sorgo en cinco regiones agroclimáticas, con 186,214 registros de campo o de parche no traslapado. En pruebas con división por geografía, el AUROC para detectar estrés fue de 0.879 frente a 0.821 de una fusión tardía, y el AUPRC fue de 0.523 frente a 0.418. En pruebas con
división temporal, el AUROC para predecir falla de rendimiento fue de 0.891 frente a 0.846, y el AUPRC de 0.556 frente a 0.428. La mediana de anticipación de alertas fue de 24 días, frente a 13 días de la fusión tardía y 8 días del modelo solo satelital. La calibración de incertidumbre redujo las falsas alertas a
recall fijo en 17.3 % (sequía) y 14.8 % (falla de rendimiento). El estudio es retrospectivo, no reporta R² ni RMSE y no hace pruebas de significancia. Para nuestro proyecto, es una hipótesis que un modelo de esta clase requeriría datos de cebada y de la región del Altiplano para evaluarse.

Fuente: Albahli, S. y Shiraz, M. (2026), «A multimodal geospatial foundation model anticipates crop stress and yield failure across climates and species», Frontiers in Plant Science 17: 1883297, doi:10.3389/fpls.2026.1883297 (publicado el 27 de julio de 2026; cifras leídas en el artículo completo en la ronda 4).

## Embeddings AlphaEarth frente a teledetección en transferencia de escala (2026)

En Ma et al. (arXiv:2601.00857), los embeddings de AlphaEarth Foundations se comparan con predictores de teledetección (RS) en rendimiento de campo de Estados Unidos, con más de 180,000 registros de Corteva. En la transferencia de escala, los modelos se entrenan con datos a nivel de condado y predicen rendimientos de
campo. Con XGBoost, el R² de AlphaEarth fue de 0.25 frente a 0.38 de RS en maíz, de 0.11 frente a 0.24 en soya y de −0.04 frente a 0.22 en trigo de invierno. Los autores atribuyen la pérdida a la compresión de los embeddings al promediarlos a nivel de condado, que diluye señales de crecimiento a escala de campo. En
cambio, con validación por año de condado a nivel de campo, AlphaEarth fue comparable: 0.44 frente a 0.46 en maíz y 0.37 frente a 0.35 en soya. La lección para el reto es que un embedding anual a 10 m puede competir con datos locales y, aun así, transferir mal entre escalas. Cualquier uso de AlphaEarth debería
validarse por municipio y por año, no solo por parcela. Estos resultados son de Estados Unidos y no de cebada.

Fuente: Ma, Y., Shen, Y., Swatantran, A. y Lobell, D. B. (2025/2026), «Harvesting AlphaEarth: Benchmarking the Geospatial Foundation Model for Agricultural Downstream Tasks», arXiv:2601.00857, Tabla 4 (leído en la ronda 4).

## Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** "DeepCropNet usa imágenes satelitales y alcanza 0.82 Mg/ha en cebada." → **Corrección:** DeepCropNet (Lin et al., 2020) usa solo tres variables meteorológicas semanales y se evaluó en maíz de Estados Unidos. El 0.82 Mg/ha es de la prueba 2015-2016 de maíz.
- **Afirmación errónea:** "MMST-ViT mejoró el error a 0.3226 t/ha, así que la mejora es significativa." → **Corrección:** 0.3226 t/ha es el MAE más bajo de la búsqueda; la diferencia frente a 0.3342 t/ha tiene un intervalo que incluye cero, así que no es concluyente.
- **Afirmación errónea:** "Prithvi-EO-2.0 con nuestra capa FFN ya tiene un error de validación cruzada documentado." → **Corrección:** la documentación del experimento no reporta métricas. No hay cifra publicable hasta completar la validación cruzada.
- **Afirmación errónea:** "La cota de 0.19 t/ha es el techo de información de la cebada." → **Corrección:** es la cota inferior con solo clima y cobertura, obtenida con las etiquetas de cinco pliegues. No es un techo general.
- **Afirmación errónea:** "Un resultado medido en una sola partición de entrenamiento y prueba equivale a validación cruzada." → **Corrección:** una partición única no es validación cruzada sobre las 138 parcelas; las cifras de desempeño de este documento proceden solo de validación cruzada.
- **Afirmación errónea:** "Los modelos de proceso como WOFOST se usan sin calibración para predecir el rendimiento de la cebada." → **Corrección:** WOFOST, DSSAT y APSIM requieren calibración local de cultivar, fenología y manejo, que el dataset no contiene.
- **Afirmación errónea:** "El ajuste fino de modelos preentrenados es la estrategia principal con pocos datos, como en soya de Argentina y Brasil." → **Corrección:** la referencia previa no se localizó. Los trabajos encontrados (Wang et al., 2024, Computers and Electronics in Agriculture, DOI
  10.1016/j.compag.2024.108978, que compara regresión de panel con aprendizaje profundo en soya de Argentina; Khaki et al., 2021) no establecen esa afirmación.
- **Afirmación errónea:** "El MMST-ViT original reporta resultados de cebada o de condados de México." → **Corrección:** el artículo usa condados de Estados Unidos y cuatro cultivos (maíz, algodón, soya y trigo de invierno).
- **Afirmación errónea:** "WOFOST ya tiene parámetros de cebada de temporal validados para México." → **Corrección:** en la búsqueda no se localizaron calibraciones de cebada de temporal en México; la calibración debe hacerse con datos locales.

- **Afirmación errónea:** AgriFM (2026) predice el rendimiento con R² de 0.9. → **Corrección:** el artículo no reporta R², RMSE ni exactitud; reporta AUROC y AUPRC para estrés y falla de rendimiento, con diseño retrospectivo.
- **Afirmación errónea:** Los embeddings de AlphaEarth transfieren bien de condado a campo. → **Corrección:** en Ma et al. (Tabla 4, XGB) la transferencia es peor que la de teledetección: 0.25 frente a 0.38 en maíz y −0.04 frente a 0.22 en trigo.
- **Afirmación errónea:** La referencia primaria de CERES-Barley es Otter-Nacke et al. (1991). → **Corrección:** ese trabajo trata modelos de nitrógeno; la referencia primaria de CERES-Barley no se localizó (SIN EVIDENCIA).

## Preguntas y respuestas

**P:** ¿Qué métrica mide el mejor resultado de MMST-ViT en nuestros experimentos?
**R:** El MAE más bajo de la validación cruzada de cinco pliegues sobre las 138 parcelas fue 0.3226 t/ha, frente a 0.3342 t/ha de la configuración pareada.

**P:** ¿Se alcanzó el objetivo de 0.100 t/ha?
**R:** No. Ninguna variante de MMST-ViT ni de los experimentos de transferencia alcanzó 0.100 t/ha.

**P:** ¿Qué RMSE y MAE tiene la CNN temporal con validación cruzada?
**R:** RMSE 0.5907 t/ha, MAE 0.4422 t/ha y R² 0.5149, frente a una línea base de media con RMSE 0.8605 t/ha.

**P:** ¿DeepCropNet usa datos satelitales?
**R:** No. Según Lin et al. (2020), usa solo tres variables meteorológicas semanales: grados-día de crecimiento, grados-día de muerte y precipitación.

**P:** ¿Qué dice la literatura sobre el desempeño de LSTM y CNN temporales?
**R:** Bai et al. (2018) encontraron que una CNN simple superó a las LSTM en diversas tareas de secuencias. Pelletier et al. (2019) reportaron que TempCNN fue más precisa que Random Forest y que las redes recurrentes en clasificación de series satelitales. Ninguno evalúa rendimiento de cebada.

**P:** ¿Qué es TabPFN y para qué tamaños de datos fue diseñado?
**R:** Es un modelo fundacional tabular preentrenado con datos sintéticos (Hollmann et al., 2025). Su mejor desempeño reportado es en tablas pequeñas, de hasta unos 10,000 muestras.

**P:** ¿Un modelo fundacional geoespacial como Prithvi-EO-2.0 ya demostró estimar el rendimiento de cebada?
**R:** No en la literatura consultada. En nuestro proyecto, el experimento con Prithvi-EO-2.0-600M-TL no tiene métricas documentadas.

**P:** ¿Cuántas escenas HLS se prepararon y cuántas parcelas hay?
**R:** 1,198 escenas HLS v2.0 (666 Landsat 8/9 L30 y 532 Sentinel-2 S30) para 197 parcelas, de enero de 2022 a octubre de 2025.

**P:** ¿La lluvia diaria de CHIRPS mejoró el error en nuestros experimentos?
**R:** No. El control con lluvia mensual FIRA tuvo RMSE 0.5309 t/ha, frente a 0.6055 (CHIRPS sat) y 0.6306 (CHIRPS rnl).

**P:** ¿Podemos afirmar que los datos permiten calcular un techo de información?
**R:** No. La cota con solo clima es 0.190724649 t/ha, y la cota por duplicados con todas las entradas es cero. Ninguna establece un techo general.

**P:** ¿Por qué no usar directamente WOFOST o APSIM para predecir el rendimiento?
**R:** Porque requieren calibración local de cultivar, fenología y manejo, y el dataset no incluye esas variables.

**P:** ¿Qué rendimientos de cebada se reportan en ensayos del INIFAP en Valles Altos?
**R:** Cuatro líneas experimentales de temporal rindieron 3.5 a 4.0 t/ha en cinco ambientes de los ciclos 2012 y 2013, en un diseño látice 4 x 4.

**P:** ¿Cuál es el DOI de Cho et al. (2014), la referencia de la GRU?
**R:** 10.3115/v1/D14-1179 (EMNLP 2014, pp. 1724-1734), según Crossref. El preprint es arXiv:1406.1078.

**P:** ¿Cuál es el DOI de Jones et al. (2003), la referencia de DSSAT?
**R:** 10.1016/S1161-0301(02)00107-7, European Journal of Agronomy 18(3-4):235-265, según Crossref.

**P:** ¿Qué concluye la revisión de TELKOMNIKA sobre pocos datos?
**R:** Anand y Jhajharia (2025) concluyen que los modelos de aprendizaje profundo son más eficaces con conjuntos grandes, mientras que el aprendizaje automático clásico se mantiene robusto con conjuntos pequeños.

**P:** ¿Qué conjunto de datos usó el MMST-ViT original?
**R:** El USDA Crop Dataset (producción y rendimiento por condado de maíz, algodón, soya y trigo de invierno), variables meteorológicas del HRRR y cuadrículas Sentinel-2 de 9 km, en más de 200 condados de Estados Unidos.

**P:** ¿PANGAEA o GEO-Bench evalúan rendimiento agrícola de cebada?
**R:** No en las fuentes consultadas. Son protocolos de evaluación de modelos fundacionales geoespaciales; su aporte para nosotros es metodológico, por ejemplo comparar con líneas base supervisadas.

**P:** ¿Hay parámetros de WOFOST o APSIM calibrados para cebada de temporal en México?
**R:** No se localizaron en la búsqueda bibliográfica realizada. Cualquier uso requiere calibración con datos locales de fenología, cultivar y manejo.

**P:** ¿Qué métricas reporta AgriFM (2026) para evaluar su desempeño?
**R:** AUROC y AUPRC para estrés y para falla de rendimiento, error de calibración esperado (ECE) y anticipación de alertas (mediana de 24 días). No reporta R² ni RMSE.

**P:** ¿Los embeddings de AlphaEarth transfieren bien de la escala de condado a la de campo?
**R:** No en Ma et al. (2026): con XGBoost, R² de 0.25 frente a 0.38 en maíz y de −0.04 frente a 0.22 en trigo de invierno, a favor de la teledetección.

**P:** ¿Qué fuente de rendimiento usa el conjunto MMST-ViT?
**R:** El USDA Crop Dataset por condado; el artículo cita «USDA (2022)» sin URL ni nombre del producto específico.
