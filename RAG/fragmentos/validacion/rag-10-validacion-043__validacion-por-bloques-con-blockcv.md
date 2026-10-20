@id: rag-10-validacion-043
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Validación por bloques con blockCV
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping bloques blockcv validacion espacial autocorrelacion bloque cruzada especies estimar modelos paquete particiones puede rango tamano valavi ademas agrupadas aleatoria ambientalmente antes argumento aunque cifra coincide
@fuente: Valavi, R., Elith, J., Lahoz-Monfort, J. J. y Guillera-Arroita, G. (2019). blockCV: An R package for generating spatially or environmentally separated folds for k-fold cross-validation of species distribution models. Methods in Ecology and Evolution, 10(2), 225-232. https://doi.org/10.1111/2041-210…
# Validación por bloques con blockCV

(Literatura, verificado.) Valavi y colaboradores (2019) presentaron blockCV, un paquete de R para generar pliegues separados espacial o ambientalmente en la validación cruzada de modelos de distribución de especies. Su argumento coincide con el de Roberts et al. (2017): la validación cruzada aleatoria puede subestimar
el error de predicción cuando los datos tienen estructura espacial, y eso además puede llevar a elegir mal entre modelos. El paquete incluye herramientas para estimar el rango de autocorrelación espacial de las covariables y para construir bloques, aunque su uso no se limita a especies. Como práctica recomendada para
estudios como el nuestro, conviene estimar el rango de autocorrelación de las variables de teledetección antes de fijar el tamaño de los bloques, y comparar las particiones por bloque con las particiones por municipio. Con 138 parcelas agrupadas en nueve municipios, los bloques pequeños tendrán muy pocas observaciones
y su cifra será ruidosa; por eso el tamaño del bloque debe declararse y justificarse.

Fuente: Valavi, R., Elith, J., Lahoz-Monfort, J. J. y Guillera-Arroita, G. (2019). blockCV: An R package for generating spatially or environmentally separated folds for k-fold cross-validation of species distribution models. Methods in Ecology and Evolution, 10(2), 225-232. https://doi.org/10.1111/2041-210X.13107
