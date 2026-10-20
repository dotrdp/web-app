@id: rag-04-amplitud-003
@documento: rag-04-amplitud | temas/04_amplitud_significados.md
@categoria: concepto
@titulo: Amplitud térmica mensual frente a otras formas de medirla
@titulo_documento: Significados de "amplitud" en el Reto AgroCebada (térmica, NDVI estacional, intervalos e ventanas)
@etiquetas: amplitud; amplitud térmica; tmax tmin; chirts-era5; ndvi; amplitud estacional; línea base; intervalo de predicción; ancho de intervalo; ventana de siembra; fenología; heladas; temperatura base; grados-día; predicción conformal
@claves: amplitud amplitud termica tmax tmin chirts-era5 ndvi amplitud estacional linea base intervalo de prediccion ancho de intervalo ventana de siembra fenologia heladas temperatura base grados-dia prediccion conformal termica tmax tmin mensual datos diarios formas frente medias medirla mensuales oscilacion otras porque rasters reto valores audit auditoria caluroso cambio cantidades confundirse contienen
@fuente: reto_y_datos/modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md; reto_y_datos/DESCRIPCION_oficial_dataset.txt
# Amplitud térmica mensual frente a otras formas de medirla

Con promedios mensuales hay tres cantidades distintas que no deben confundirse. (1) Amplitud térmica mensual, Tmax_mes − Tmin_mes, que es el promedio de las oscilaciones diarias del mes. (2) Oscilación extrema del mes, máxima Tmax del mes menos mínima Tmin del mes; los rasters no la contienen, porque los valores son
medias. (3) Amplitud estacional entre meses, por ejemplo la diferencia entre la Tmax de mayo y la Tmin de diciembre; no mide oscilación diaria, sino el cambio a lo largo del año.

Por eso, una reseña que diga "la amplitud térmica de julio fue de 15 °C" no se puede verificar directamente con los rasters, porque no son valores diarios. El documento de auditoría del proyecto lo dice así: Tmin y Tmax son "medias mensuales de mínimos y máximos diarios, no el día más frío o más caluroso del mes".

Fuente: reto_y_datos/modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md; reto_y_datos/DESCRIPCION_oficial_dataset.txt
