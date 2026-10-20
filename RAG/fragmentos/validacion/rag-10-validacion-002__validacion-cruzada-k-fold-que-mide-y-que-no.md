@id: rag-10-validacion-002
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Validación cruzada k-fold: qué mide y qué no
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping validacion k-fold cruzada error particiones aleatorio bloque datos ecog grupos mide municipio municipios numero observaciones obtenido roberts supuesto tipo advierte agrupamiento ajustable ajustado aleatorias
@fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md; Roberts et al. (2017), Ecography 40(8), 913-929, https://doi.org/10.1111/ecog.02881
# Validación cruzada k-fold: qué mide y qué no

(Literatura) La validación cruzada k-fold divide las observaciones en k bloques; cada bloque se predice con un modelo ajustado con los demás, y el error se promedia. Estima el error de predicción para datos parecidos a los de entrenamiento, bajo el supuesto de que las observaciones son intercambiables. Cuando hay
agrupamiento (parcelas de un mismo productor, localidad o bloque espacial), ese supuesto falla y el k-fold aleatorio tiende a subestimar el error (Roberts et al., 2017; verificado, DOI 10.1111/ecog.02881).

(Nuestros experimentos) Evaluamos modelos con particiones aleatorias y con particiones por municipio. Un RMSE obtenido con k-fold aleatorio no es comparable con uno obtenido con particiones por municipio, porque responden a preguntas distintas: interpolar dentro de municipios frente a estimar municipios no observados.

(Recomendación) Reportar siempre el tipo de partición junto con el RMSE, el número de pliegues y el número de repeticiones. Sin esa información, una cifra de RMSE no indica qué tipo de generalización se midió. El documento de validación del proyecto propone un punto de partida de cuatro o cinco grupos externos,
ajustable a la estructura real de los datos, y advierte que crear muchos grupos casi idénticos no aporta precisión.

Fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md; Roberts et al. (2017), Ecography 40(8), 913-929, https://doi.org/10.1111/ecog.02881
