@id: rag-10-validacion-048
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Contracción hacia la media de grupo: Efron y Morris (1975)
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping contraccion efron morris media grupos hacia municipios depende grupo stein tamano varianza american analysis aplicaron articulo association bateo beneficio cantidad casi caso chi-cuadrada conjunto
@fuente: Efron, B. y Morris, C. (1975). Data analysis using Stein's estimator and its generalizations. Journal of the American Statistical Association, 70(350), 311-319.
# Contracción hacia la media de grupo: Efron y Morris (1975)

(Literatura, verificado.) Efron y Morris (1975) aplicaron el estimador de Stein y sus generalizaciones a promedios de bateo, a tasas de prevalencia de toxoplasmosis y al tamaño exacto de una prueba chi-cuadrada de Pearson. En cada ejemplo, el error cuadrático medio de estas reglas fue menor que la mitad del de la media
muestral (resumen del artículo). El principio es encoger las medias de grupos pequeños hacia la media global, con una cantidad que depende de cuánta varianza hay entre grupos frente a la varianza de muestreo. Con grupos de tamaño muy distinto, como los municipios de este conjunto, la contracción es fuerte para
municipios de una o pocas parcelas y casi nula para municipios grandes. Los resultados de Efron y Morris no implican que la contracción mejore siempre el RMSE en nuestro caso: el beneficio depende de la estructura de varianzas, y en nuestros datos la recuperación es pequeña (como máximo unas 0.01 t/ha de RMSE; véase la
sección de contracción empírica).

Fuente: Efron, B. y Morris, C. (1975). Data analysis using Stein's estimator and its generalizations. Journal of the American Statistical Association, 70(350), 311-319.
