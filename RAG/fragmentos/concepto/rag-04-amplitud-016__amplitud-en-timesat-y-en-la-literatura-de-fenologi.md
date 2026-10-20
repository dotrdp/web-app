@id: rag-04-amplitud-016
@documento: rag-04-amplitud | temas/04_amplitud_significados.md
@categoria: concepto
@titulo: Amplitud en TIMESAT y en la literatura de fenología
@titulo_documento: Significados de "amplitud" en el Reto AgroCebada (térmica, NDVI estacional, intervalos e ventanas)
@etiquetas: amplitud; amplitud térmica; tmax tmin; chirts-era5; ndvi; amplitud estacional; línea base; intervalo de predicción; ancho de intervalo; ventana de siembra; fenología; heladas; temperatura base; grados-día; predicción conformal
@claves: amplitud amplitud termica tmax tmin chirts-era5 ndvi amplitud estacional linea base intervalo de prediccion ancho de intervalo ventana de siembra fenologia heladas temperatura base grados-dia prediccion conformal timesat base minimo eklundh nsson parametros temporada https manual seccion alcanza borde curva definicion definiciones definido derecho docs estacionales izquierdo literatura maximo nateko
@fuente: manual TIMESAT 3.1 (Eklundh y Jönsson, 2011), sección de definiciones de parámetros: https://web.nateko.lu.se/timesat/docs/timesat3_1_1_SoftwareManual.pdf (PDF leído con pdftotext); TIMESAT 3.3 (umbral definido por el usuario): https://web.nateko.lu.se/timesat/docs/TIMESAT33_SoftwareManual.pdf;
# Amplitud en TIMESAT y en la literatura de fenología

TIMESAT (Jönsson y Eklundh, 2004) ajusta curvas suaves a series de NDVI y extrae parámetros estacionales. La referencia está verificada (Computers & Geosciences, 30(8), 833–845). La definición de sus parámetros está en el manual del software (Eklundh y Jönsson, versión 3.1, sección de definiciones de parámetros
estacionales):

- Base (base level): promedio del mínimo izquierdo y el mínimo derecho de la curva ajustada.
- Amplitud estacional: diferencia entre el máximo de la temporada y la base.
- Inicio y fin de temporada: el momento en que el borde izquierdo o el derecho alcanza un nivel definido por el usuario, medido desde el mínimo de ese lado. El manual lo describe como una proporción de la amplitud o como un valor umbral fijo. No fija el 50 % ni el 90 % por defecto.
- Punto medio de la temporada: promedio de los tiempos en que cada borde alcanza el 80 % de su nivel.

El proyecto no usa esa base. Toma como línea base el mínimo de la curva suavizada antes del pico (ver la sección de amplitud fenológica del NDVI). Por tanto, la amplitud del proyecto y la de TIMESAT no son comparables sin declararlo. El producto HR-VPP de Copernicus define la amplitud como máximo menos mínimo de la
temporada sobre PPI, otro índice; esa definición vino de una búsqueda de la ronda 2 y no se leyó en la documentación completa.

Fuente: manual TIMESAT 3.1 (Eklundh y Jönsson, 2011), sección de definiciones de parámetros: https://web.nateko.lu.se/timesat/docs/timesat3_1_1_SoftwareManual.pdf (PDF leído con pdftotext); TIMESAT 3.3 (umbral definido por el usuario): https://web.nateko.lu.se/timesat/docs/TIMESAT33_SoftwareManual.pdf;
https://doi.org/10.1016/j.cageo.2004.05.006 (Jönsson y Eklundh, 2004)
