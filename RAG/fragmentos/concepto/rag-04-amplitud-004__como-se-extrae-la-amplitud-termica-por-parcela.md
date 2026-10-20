@id: rag-04-amplitud-004
@documento: rag-04-amplitud | temas/04_amplitud_significados.md
@categoria: concepto
@titulo: Cómo se extrae la amplitud térmica por parcela
@titulo_documento: Significados de "amplitud" en el Reto AgroCebada (térmica, NDVI estacional, intervalos e ventanas)
@etiquetas: amplitud; amplitud térmica; tmax tmin; chirts-era5; ndvi; amplitud estacional; línea base; intervalo de predicción; ancho de intervalo; ventana de siembra; fenología; heladas; temperatura base; grados-día; predicción conformal
@claves: amplitud amplitud termica tmax tmin chirts-era5 ndvi amplitud estacional linea base intervalo de prediccion ancho de intervalo ventana de siembra fenologia heladas temperatura base grados-dia prediccion conformal parcela media pixeles dataset dentro desviacion espacial estandar extrae raster reto termica valida variacion agro area calculada calculo cobertura columnas cruzan datos debe dispersion
@fuente: reto_y_datos/dataset__DATASET_RETO_AGRO_2026__plot_features__README.md
# Cómo se extrae la amplitud térmica por parcela

Las 197 parcelas se cruzan con cada raster. El proyecto calculó, por parcela y mes, la media ponderada por área de los píxeles válidos, la desviación estándar poblacional, y los valores mínimo y máximo de los píxeles que intersectan la parcela. La cobertura válida de cada parcela queda en `row_quality.csv`. Las
columnas tienen el formato `raster__{variable}__{YYYY-MM}__{estadístico}`.

Ojo: la desviación estándar dentro de la parcela mide variación espacial entre píxeles, no variación de un día a otro dentro del mes. Una amplitud calculada a partir de la media de Tmax y la media de Tmin de la misma parcela y mes es válida; la dispersión espacial no debe interpretarse como oscilación temporal.

Fuente: reto_y_datos/dataset__DATASET_RETO_AGRO_2026__plot_features__README.md
