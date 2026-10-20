@id: rag-10-validacion-040
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Mapas de biomasa y validación no espacial: el caso de Ploton et al. (2020)
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping validacion biomasa espacial mapas modelo ploton caso nuestro predictivo puede advertencia afirmar africa aleatoria aleatorio alimentado altamente ambientales analisis arboles autocorrelacion autores basta bosque buen
@fuente: Ploton, P. et al. (2020). Spatial validation reveals poor predictive performance of large-scale ecological mapping models. Nature Communications, 11, 4540. https://doi.org/10.1038/s41467-020-18321-y
# Mapas de biomasa y validación no espacial: el caso de Ploton et al. (2020)

(Literatura, verificado.) Ploton y colaboradores reprodujeron el enfoque de mapas de biomasa forestal a gran escala con un inventario de 11.8 millones de árboles en África central, usando un modelo de bosque aleatorio alimentado con variables multiespectrales y ambientales. Con validación no espacial, el modelo parecía
explicar más de la mitad de la variación de biomasa. Con una validación espacial que considera la autocorrelación, el poder predictivo resultó casi nulo. Los autores concluyen que el análisis de grandes volúmenes de datos puede parecer altamente predictivo aun cuando los predictores tienen relaciones débiles con la
variable ecológica, lo que puede producir mapas erróneos. Para nuestro caso, la lección es que un buen resultado en validación aleatoria no basta para afirmar que el modelo funciona en zonas o municipios sin observaciones. Esta es una advertencia sobre la validación; no mide el desempeño de nuestro modelo, que depende
de sus propias particiones.

Fuente: Ploton, P. et al. (2020). Spatial validation reveals poor predictive performance of large-scale ecological mapping models. Nature Communications, 11, 4540. https://doi.org/10.1038/s41467-020-18321-y
