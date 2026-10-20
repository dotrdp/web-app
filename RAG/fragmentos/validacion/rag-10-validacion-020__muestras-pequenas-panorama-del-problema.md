@id: rag-10-validacion-020
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Muestras pequeñas: panorama del problema
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping dentro desviacion estandar media municipio distribucion frente global hechos muestras panorama pequenas problema research validacion auditorias barley base calculados calpulalpan casi ceiling chignahuapan conjunto cualquier
@fuente: reto_y_datos/HECHOS_CALCULADOS_dataset_oficial.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md
# Muestras pequeñas: panorama del problema

(Nuestros experimentos y hechos) El conjunto de entrenamiento tiene 138 parcelas con rendimiento, media 3.955 t/ha, mediana 4.34, desviación estándar 0.851, mínimo 2.00 y máximo 5.59. La distribución por municipio es extremadamente desigual (véase el fragmento de distribución). Dentro de Chignahuapan, la desviación
estándar es 0.58 t/ha; dentro de Calpulalpan, 0.37; la desviación estándar dentro de municipio global, que usan las auditorías como referencia, es 0.475 t/ha.

(Implicación) Con tan pocas observaciones, un error de 0.47 t/ha equivale casi exactamente a la dispersión dentro del municipio, de modo que un modelo que solo predice la media municipal obtiene un RMSE parecido. Cualquier mejora debe demostrarse frente a esa línea base, no frente a una media global.

Fuente: reto_y_datos/HECHOS_CALCULADOS_dataset_oficial.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md
