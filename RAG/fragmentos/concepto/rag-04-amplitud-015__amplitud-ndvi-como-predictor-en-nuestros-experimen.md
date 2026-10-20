@id: rag-04-amplitud-015
@documento: rag-04-amplitud | temas/04_amplitud_significados.md
@categoria: concepto
@titulo: Amplitud NDVI como predictor en nuestros experimentos
@titulo_documento: Significados de "amplitud" en el Reto AgroCebada (térmica, NDVI estacional, intervalos e ventanas)
@etiquetas: amplitud; amplitud térmica; tmax tmin; chirts-era5; ndvi; amplitud estacional; línea base; intervalo de predicción; ancho de intervalo; ventana de siembra; fenología; heladas; temperatura base; grados-día; predicción conformal
@claves: amplitud amplitud termica tmax tmin chirts-era5 ndvi amplitud estacional linea base intervalo de prediccion ancho de intervalo ventana de siembra fenologia heladas temperatura base grados-dia prediccion conformal municipio experimentos base dentro linea nuestros verdor change docs dynamic frente nulo phenocurve predictor previa resultado senal tabulares cerca control curva equivalente estaticas
@fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md; experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md
# Amplitud NDVI como predictor en nuestros experimentos

Nuestros experimentos probaron la amplitud y otras métricas de la curva en un marco de validación dentro de municipio. El resultado fue nulo para la mayoría. Un modelo de dos variables, pico de Planet NDVI más verdor al 50 %, dio un resultado nulo frente a la línea base de municipio (0.5190 con municipio frente a
0.5151 con estáticas y municipio, con un control B0 de +0.003 y un intervalo [-0.024, +0.031]).

En la prueba de sonda (M2), con la línea base previa al verdor retirada, los parámetros K, g, d0, d1 y a no mostraron señal dentro de municipio. Lo único con señal fue la línea base previa al verdor (b), con un techo dentro de municipio de R² cerca de 0.05–0.10, equivalente a 0.013–0.026 t/ha de RMSE.

Fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md; experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md
