@id: rag-10-validacion-044
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Fuga de información: definición según Kaufman et al. (2012)
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping datos fuga kaufman informacion data definicion etapas perlich rosset segun separacion stitelman usan acceso ajuste analisis analista aprendizaje avoidance calcularse causales coeficientes controlo cuidadoso deben
@fuente: Kaufman, S., Rosset, S., Perlich, C. y Stitelman, O. (2012). Leakage in data mining: formulation, detection, and avoidance. ACM Transactions on Knowledge Discovery from Data, 6(4), 15. https://doi.org/10.1145/2382577.2382579
# Fuga de información: definición según Kaufman et al. (2012)

(Literatura, verificado.) Kaufman, Rosset, Perlich y Stitelman (2012) definen la fuga de datos como la situación en que el modelo tiene acceso a información relacionada con el objetivo que no tendría en el momento real de predecir. Plantean que la fuga puede evitarse con un manejo cuidadoso de los datos seguido de una
separación entre aprendizaje y predicción (learn-predict separation), y proponen métodos para detectarla cuando el analista no controló cómo se recolectaron los datos. Su análisis incluye también una mirada desde modelos causales. Para el proyecto, la separación implica que las etapas que usan rendimientos (ajuste de
coeficientes, selección de variables, elección de hipótesis) deben ocurrir solo con datos de entrenamiento de cada partición, mientras que las etapas que no usan etiquetas pueden calcularse sobre todas las parcelas.

Fuente: Kaufman, S., Rosset, S., Perlich, C. y Stitelman, O. (2012). Leakage in data mining: formulation, detection, and avoidance. ACM Transactions on Knowledge Discovery from Data, 6(4), 15. https://doi.org/10.1145/2382577.2382579
