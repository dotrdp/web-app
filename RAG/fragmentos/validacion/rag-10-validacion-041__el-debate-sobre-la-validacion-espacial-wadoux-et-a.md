@id: rag-10-validacion-041
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: El debate sobre la validación espacial: Wadoux et al. (2021) frente a Meyer y Pebesma (2022)
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping wadoux espacial meyer pebesma validacion exactitud municipios recomendacion colaboradores debate ecological frente https mapa particion pertinente pregunta proyecto accuracy aleatoria assessing bajo basada bloque challenge
@fuente: Wadoux, A. M. J.-C. et al. (2021). Spatial cross-validation is not the right way to evaluate map accuracy. Ecological Modelling, 457, 109692. https://doi.org/10.1016/j.ecolmodel.2021.109692; Meyer, H. y Pebesma, E. (2022). Machine learning-based global maps of ecological variables and the challenge…
# El debate sobre la validación espacial: Wadoux et al. (2021) frente a Meyer y Pebesma (2022)

(Literatura y recomendación.) Wadoux y colaboradores sostienen que la validación cruzada espacial no tiene un fundamento teórico claro para estimar la exactitud de un mapa, y proponen obtener la exactitud a partir de muestreo probabilístico con inferencia basada en el diseño. Meyer y Pebesma (2022) resumen esta
discusión junto con la posición de Ploton y colaboradores (2020), que defiende la validación espacial, y no la zanjan. Para el proyecto, la recomendación práctica es declarar qué pregunta responde la cifra: si el despliegue cae en municipios ya observados, la partición aleatoria dentro de municipios es la pertinente;
si pregunta por municipios sin observaciones, la partición por municipio o bloque es la pertinente. Esta distinción es una recomendación propia del proyecto; las dos cifras son estimaciones de desempeño bajo supuestos distintos, y ninguna se presenta como exactitud de mapa en el sentido de Wadoux et al.

Fuente: Wadoux, A. M. J.-C. et al. (2021). Spatial cross-validation is not the right way to evaluate map accuracy. Ecological Modelling, 457, 109692. https://doi.org/10.1016/j.ecolmodel.2021.109692; Meyer, H. y Pebesma, E. (2022). Machine learning-based global maps of ecological variables and the challenge of assessing
them. Nature Communications, 13. https://doi.org/10.1038/s41467-022-29838-9
