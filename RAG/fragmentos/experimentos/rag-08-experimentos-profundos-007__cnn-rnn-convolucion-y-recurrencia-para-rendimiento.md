@id: rag-08-experimentos-profundos-007
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: CNN-RNN: convolución y recurrencia para rendimiento
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn rendimiento cnn-rnn error estados modelo ambientes archontoulis convolucion khaki maiz nuestro promedio recurrencia redes segun soya unidos wang absoluto afirman anos articulo autores belt caida
@fuente: Khaki, S., Wang, L. y Archontoulis, S. V. (2020). A CNN-RNN Framework for Crop Yield Prediction. Frontiers in Plant Science 10:1750. DOI 10.3389/fpls.2019.01750.
# CNN-RNN: convolución y recurrencia para rendimiento

Khaki, Wang y Archontoulis (2020) propusieron un modelo CNN-RNN que combina convoluciones con redes recurrentes para predecir el rendimiento de maíz y soya en 13 estados del Corn Belt de Estados Unidos, con datos históricos de clima, suelo y manejo. Compararon el modelo con Random Forest, redes completamente conectadas
y LASSO. Según el resumen, el error RMSE fue de 9% y 8% del rendimiento promedio (para maíz y soya, según el orden que reporta el artículo). Los autores afirman que el modelo generaliza a ambientes no vistos sin una caída significativa de precisión.

La relevancia para nosotros es metodológica: la combinación convolución-recurrencia requiere muchos años y ambientes de entrenamiento. Nuestro dataset tiene una sola temporada (2025) y 138 etiquetas. Por eso, la evidencia de Estados Unidos no implica un desempeño similar. El error relativo reportado (8 a 9%) no es
comparable con el error absoluto en t/ha de nuestro proyecto sin dividir por el rendimiento promedio.

Fuente: Khaki, S., Wang, L. y Archontoulis, S. V. (2020). A CNN-RNN Framework for Crop Yield Prediction. Frontiers in Plant Science 10:1750. DOI 10.3389/fpls.2019.01750.
