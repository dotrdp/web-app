@id: rag-10-validacion-047
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Comparar candidatos frente a una referencia: prueba de realidad y SPA de Hansen (2005)
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping hansen referencia candidatos prueba comparar realidad white bloque check diferencias forma frente indirecta mejor modelos pruebas reality superior ability alternativos ambas anidada articulo aumenta azar
@fuente: Hansen, P. R. (2005). A test for superior predictive ability. Journal of Business and Economic Statistics, 23(4), 365-380; White, H. (2000). A reality check for data snooping. Econometrica (citada de forma indirecta).
# Comparar candidatos frente a una referencia: prueba de realidad y SPA de Hansen (2005)

(Literatura, verificado en parte.) White (2000) propuso una prueba de realidad (reality check) que compara el mejor de muchos modelos con la hipótesis de que ninguno supera a una referencia, para controlar el azar de la búsqueda; su descripción se confirmó de forma indirecta, a través de Hansen (2005), y el artículo
original no se leyó. Hansen (2005) propone la prueba de capacidad predictiva superior (SPA), que modifica la de White normalizando las diferencias medias por una estimación de su desviación estándar, lo que aumenta la potencia. Ambas usan un bootstrap estacionario con longitud de bloque geométrica para construir la
distribución nula. Una limitación reportada es que estas pruebas no funcionan bien cuando la referencia está anidada en los modelos alternativos, salvo que la referencia no tenga parámetros estimados. Para comparar candidatos del proyecto, esta familia de pruebas exige que todos los candidatos evaluados se cuenten, no
solo el mejor, y que las diferencias se calculen por unidad independiente (parcela o bloque), no por pliegue repetido.

Fuente: Hansen, P. R. (2005). A test for superior predictive ability. Journal of Business and Economic Statistics, 23(4), 365-380; White, H. (2000). A reality check for data snooping. Econometrica (citada de forma indirecta).
