@id: rag-10-validacion-049
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Estimación en áreas pequeñas: el modelo de Battese, Harter y Fuller (1988)
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping areas battese fuller harter modelo datos estimacion parcelas pequenas condado encuesta error informacion landsat reto american analoga anidado aplicacion area articulo association campo captura caso
@fuente: Battese, G. E., Harter, R. M. y Fuller, W. A. (1988). An error-components model for prediction of county crop areas using survey and satellite data. Journal of the American Statistical Association, 83(401), 28-36. https://doi.org/10.1080/01621459.1988.10478561
# Estimación en áreas pequeñas: el modelo de Battese, Harter y Fuller (1988)

(Literatura, verificado.) Battese, Harter y Fuller (1988) propusieron un modelo de componentes de error para predecir áreas de cultivo por condado combinando una encuesta de campo con datos del satélite Landsat. El caso original usa 12 condados de Iowa, datos de la encuesta de junio de 1978 del USDA y lecturas Landsat
de la temporada 1978, con una estructura de error anidado que captura la correlación de hectáreas dentro de cada condado. El artículo destaca que la predicción para áreas pequeñas rara vez se intentaba porque las encuestas tenían pocos datos en esas áreas. La idea transferible al reto es que un municipio con pocas
parcelas puede estimarse usando la información del conjunto (préstamo de información entre grupos), siempre que se declare la incertidumbre de esa estimación. Sin embargo, el modelo estima medias de área y no predicciones de parcelas individuales; el reto mide parcelas, por lo que su aplicación directa es limitada y
debe describirse como análoga.

Fuente: Battese, G. E., Harter, R. M. y Fuller, W. A. (1988). An error-components model for prediction of county crop areas using survey and satellite data. Journal of the American Statistical Association, 83(401), 28-36. https://doi.org/10.1080/01621459.1988.10478561
