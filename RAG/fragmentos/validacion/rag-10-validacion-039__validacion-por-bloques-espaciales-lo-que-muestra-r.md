@id: rag-10-validacion-039
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Validación por bloques espaciales: lo que muestra Roberts et al. (2017)
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping validacion bloques roberts aleatoria cifra cruzada datos dependencias espaciales estructura muestra predictores residuos temporal agrupadas aleatorias casos causales central colaboradores conclusion correlacion cross-validation data debe
@fuente: Roberts, D. R. et al. (2017). Cross-validation strategies for data with temporal, spatial, hierarchical, or phylogenetic structure. Ecography, 40(8), 913-929. https://doi.org/10.1111/ecog.02881
# Validación por bloques espaciales: lo que muestra Roberts et al. (2017)

(Literatura, verificado.) Roberts y colaboradores revisaron la validación cruzada para datos con estructura temporal, espacial, jerárquica o filogenética. Su conclusión central es que la validación cruzada aleatoria ignora esas dependencias, y que cuando las dependencias persisten en los residuos del modelo el error
predictivo se subestima de forma seria. En sus simulaciones y casos de estudio, la validación por bloques funcionó mejor que la aleatoria para predecir hacia datos o espacios de predictores nuevos y para seleccionar predictores causales. Su recomendación práctica es usar validación por bloques siempre que exista
estructura de dependencia, aun cuando los residuos no muestren correlación visible. Para el proyecto, una cifra de RMSE obtenida con particiones aleatorias de parcelas agrupadas por municipio no equivale a una estimación para municipios no observados; el tipo de partición debe declararse junto con la cifra.

Fuente: Roberts, D. R. et al. (2017). Cross-validation strategies for data with temporal, spatial, hierarchical, or phylogenetic structure. Ecography, 40(8), 913-929. https://doi.org/10.1111/ecog.02881
