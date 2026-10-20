@id: rag-14-clima-025
@documento: rag-14-clima | temas/14_clima_y_riesgo_climatico_altiplano.md
@categoria: clima
@titulo: Días con helada: no pueden contarse con medias mensuales
@titulo_documento: Clima y riesgo climático en el Altiplano central: lluvia de temporal, heladas, sequía e índices agroclimáticos
@etiquetas: clima de temporal; altiplano central; heladas; sequía; spi; spei; grados-día; chirps; chirts-era5; enso
@claves: clima de temporal altiplano central heladas sequia spi spei grados-dia chirps chirts-era5 enso dias helada diaria mensuales reto contar contarse data https maxima medias minima pueden rasters requiere serie tmin absoluta agrocebada aproximacion bajo base chirts-daily construida
@fuente: Verdin et al. (2020), Scientific Data 7, 303, https://doi.org/10.1038/s41597-020-00643-7, y https://www.chc.ucsb.edu/data/chirts-era5 (consultado en la ronda 2 y registrado en 01_reto_agrocebada_y_datos.md).
# Días con helada: no pueden contarse con medias mensuales

Los rasters CHIRTS-ERA5 del reto son promedios mensuales de la temperatura mínima diaria y de la máxima diaria, en °C. No son la mínima ni la máxima absoluta del mes. Por eso, un mes con media de Tmin de 3 °C puede haber tenido días con −2 °C, y el raster no lo muestra. Contar días con helada (Tmin < 0 °C) o días bajo
4 °C requiere la serie diaria, que el reto no incluye. Cualquier variable de "días con helada" construida con los rasters mensuales es una aproximación y debe declararse así.
Para contar días con helada se requiere una serie diaria, por ejemplo CHIRTS-daily para la línea base de 1983 a 2016, declarando la fuente y la versión en el texto.
Fuente: Verdin et al. (2020), Scientific Data 7, 303, https://doi.org/10.1038/s41597-020-00643-7, y https://www.chc.ucsb.edu/data/chirts-era5 (consultado en la ronda 2 y registrado en 01_reto_agrocebada_y_datos.md).
