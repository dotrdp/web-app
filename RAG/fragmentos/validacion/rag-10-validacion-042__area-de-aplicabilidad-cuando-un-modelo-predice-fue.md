@id: rag-10-validacion-042
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Área de aplicabilidad: cuándo un modelo predice fuera de su dominio
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping area aplicabilidad egu24-10278 modelo datos distancia dominio entrenamiento fuera https indice meyer pebesma predice puede punto solo zona aplicable applicability aprendio autores bandera calculan cast
@fuente: Meyer, H. y Pebesma, E. (2021). Predicting into unknown space? Estimating the area of applicability of spatial prediction models. Methods in Ecology and Evolution, 12, 1620-1633. https://doi.org/10.1111/2041-210X.13650; EGU24-10278 (2024), https://meetingorganizer.copernicus.org/EGU24/EGU24-10278.h…
# Área de aplicabilidad: cuándo un modelo predice fuera de su dominio

(Literatura, verificado.) Meyer y Pebesma (2021) proponen estimar un área de aplicabilidad (AOA, por sus siglas en inglés) para modelos de predicción espacial. Calculan un índice de disimilitud a partir de la distancia, en el espacio de predictores, entre cada punto nuevo y los datos de entrenamiento, y definen el AOA
como la zona donde el modelo aprendió de datos parecidos y donde se sostiene el desempeño estimado por validación. Los autores recomiendan presentar predicciones solo dentro del AOA. La implementación está disponible en el paquete CAST de R. Un resumen de congreso de 2024 (EGU24-10278) critica que el criterio depende
solo de la distancia al dato de referencia más cercano, de modo que un único punto de entrenamiento puede declarar aplicable una zona. Para el reto, un predictor como el área de la parcela puede extrapolarse a valores que no tienen etiqueta en su municipio. Un índice de este tipo sirve como bandera de extrapolación, no
como sustituto de un intervalo (recomendación propia).

Fuente: Meyer, H. y Pebesma, E. (2021). Predicting into unknown space? Estimating the area of applicability of spatial prediction models. Methods in Ecology and Evolution, 12, 1620-1633. https://doi.org/10.1111/2041-210X.13650; EGU24-10278 (2024), https://meetingorganizer.copernicus.org/EGU24/EGU24-10278.html
