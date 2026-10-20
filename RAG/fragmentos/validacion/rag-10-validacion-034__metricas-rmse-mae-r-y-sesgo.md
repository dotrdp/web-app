@id: rag-10-validacion-034
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Métricas: RMSE, MAE, R² y sesgo
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping metricas sesgo validacion conjunto equivale media mediana todas absoluto asimetria calculando chignahuapan correcto correlacion cuadrado definicion detecta direcciones distintas distintos error errores expresan fuera
@fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/iterate_20261017__research__B3_small_n_methods.md
# Métricas: RMSE, MAE, R² y sesgo

(Literatura y definición) RMSE = √((1/n) Σ (ŷᵢ − yᵢ)²) penaliza más los errores grandes; MAE = (1/n) Σ |ŷᵢ − yᵢ| es el error absoluto típico; el sesgo = (1/n) Σ (ŷᵢ − yᵢ) detecta sobreestimación o subestimación. R² de predicción = 1 − Σ(yᵢ − ŷᵢ)²/Σ(yᵢ − ȳ)² puede ser negativo y no equivale al cuadrado de la correlación
en general.

(Proyecto) Todas las métricas se expresan en t/ha. Para RMSE, la media es el objetivo correcto; para MAE, la mediana. En Chignahuapan, la mediana (4.52) supera a la media (4.48) por una asimetría de −1.28, de modo que las dos métricas tiran en direcciones ligeramente distintas.

(Recomendación) Reportar RMSE, MAE, R² y sesgo, guardando las predicciones fuera de pliegue de todas las parcelas y calculando las métricas sobre ese conjunto. Promediar RMSE de grupos de tamaños distintos no equivale al RMSE conjunto.

Fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/iterate_20261017__research__B3_small_n_methods.md
