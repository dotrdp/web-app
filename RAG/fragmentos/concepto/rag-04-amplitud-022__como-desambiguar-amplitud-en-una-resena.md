@id: rag-04-amplitud-022
@documento: rag-04-amplitud | temas/04_amplitud_significados.md
@categoria: concepto
@titulo: Cómo desambiguar "amplitud" en una reseña
@titulo_documento: Significados de "amplitud" en el Reto AgroCebada (térmica, NDVI estacional, intervalos e ventanas)
@etiquetas: amplitud; amplitud térmica; tmax tmin; chirts-era5; ndvi; amplitud estacional; línea base; intervalo de predicción; ancho de intervalo; ventana de siembra; fenología; heladas; temperatura base; grados-día; predicción conformal
@claves: amplitud amplitud termica tmax tmin chirts-era5 ndvi amplitud estacional linea base intervalo de prediccion ancho de intervalo ventana de siembra fenologia heladas temperatura base grados-dia prediccion conformal habla base desambiguar dias intervalo linea mensuales pico rango rendimientos resena siembra significado unidades advertencia ancho anteriores archivo caida calculada calculan clima cobertura
@fuente: síntesis de las secciones anteriores de este archivo
# Cómo desambiguar "amplitud" en una reseña

Usa el contexto de la oración para decidir el significado:
- Si habla de temperatura, clima, noches, heladas, máximas o mínimas, o grados, es **amplitud térmica**: Tmax − Tmin, en °C, calculada con los rasters mensuales (y con la advertencia de que son medias mensuales).
- Si habla de NDVI, curva, pico, verdor, senescencia, caída, dosel o fenología, es **amplitud estacional (fenológica)**: pico menos línea base, en unidades de NDVI (0.0 a 1.0), con los umbrales del 50 % y 90 %. Conviene declarar qué definición de línea base se usa, porque TIMESAT y el proyecto no la calculan igual.
- Si habla de intervalo, incertidumbre, cobertura, error, ±, o de qué tan confiable es una predicción, es **ancho de intervalo**: la distancia entre el límite inferior y el superior, en t/ha.
- Si habla de fechas de siembra, días entre siembra y cosecha, o periodos posibles, es **amplitud de la ventana**, en días.
- Si habla del rango de los rendimientos de las parcelas, o de la dispersión de la variable objetivo, es **amplitud del rango de rendimientos**, en t/ha.
- Si no hay pistas, pregunta cuál es la magnitud medida y en qué unidades. No inventes un significado.

Fuente: síntesis de las secciones anteriores de este archivo
