@id: rag-04-amplitud-002
@documento: rag-04-amplitud | temas/04_amplitud_significados.md
@categoria: concepto
@titulo: Amplitud térmica: definición y cálculo con los rasters del reto
@titulo_documento: Significados de "amplitud" en el Reto AgroCebada (térmica, NDVI estacional, intervalos e ventanas)
@etiquetas: amplitud; amplitud térmica; tmax tmin; chirts-era5; ndvi; amplitud estacional; línea base; intervalo de predicción; ancho de intervalo; ventana de siembra; fenología; heladas; temperatura base; grados-día; predicción conformal
@claves: amplitud amplitud termica tmax tmin chirts-era5 ndvi amplitud estacional linea base intervalo de prediccion ancho de intervalo ventana de siembra fenologia heladas temperatura base grados-dia prediccion conformal mensual reto media rasters termica oficial tmax tmin calculo datos definicion descripcion diaria diarias diferencia ambas archivo audit calcular celdas cerca dataset dias diciembre
@fuente: reto_y_datos/DESCRIPCION_oficial_dataset.txt; reto_y_datos/modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md
# Amplitud térmica: definición y cálculo con los rasters del reto

La amplitud térmica es la diferencia entre la temperatura máxima y la mínima. En la forma diaria es Tmax del día menos Tmin del mismo día. En el Reto, los rasters entregan un promedio mensual: cada archivo tiene la media mensual de las mínimas diarias y la media mensual de las máximas diarias, en °C. La descripción
oficial sugiere explícitamente calcular "amplitud térmica" a partir de estos insumos (sección 3 del documento oficial).

Hay 48 rasters de Tmin y 48 de Tmax, de enero de 2022 a diciembre de 2025, cada uno de 65 × 72 píxeles en EPSG:4326 con celdas de unos 0.05° (cerca de 5 km) y NoData −9999. Por tanto, la amplitud mensual de un píxel es Tmax_mes − Tmin_mes. Como ambas son medias, su diferencia es la media mensual de la oscilación diaria
(la linealidad de la media lo garantiza si se usan los mismos días).

Fuente: reto_y_datos/DESCRIPCION_oficial_dataset.txt; reto_y_datos/modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md
