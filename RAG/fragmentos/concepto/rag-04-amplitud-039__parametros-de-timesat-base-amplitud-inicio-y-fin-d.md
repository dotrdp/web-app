@id: rag-04-amplitud-039
@documento: rag-04-amplitud | temas/04_amplitud_significados.md
@categoria: concepto
@titulo: Parámetros de TIMESAT: base, amplitud, inicio y fin de temporada
@titulo_documento: Significados de "amplitud" en el Reto AgroCebada (térmica, NDVI estacional, intervalos e ventanas)
@etiquetas: amplitud; amplitud térmica; tmax tmin; chirts-era5; ndvi; amplitud estacional; línea base; intervalo de predicción; ancho de intervalo; ventana de siembra; fenología; heladas; temperatura base; grados-día; predicción conformal
@claves: amplitud amplitud termica tmax tmin chirts-era5 ndvi amplitud estacional linea base intervalo de prediccion ancho de intervalo ventana de siembra fenologia heladas temperatura base grados-dia prediccion conformal base temporada timesat inicio parametros eklundh manual nivel nsson https ajusta ajustada bordes cageo calcula cifra comparar computers curva defecto define definicion definiciones depende
@fuente: Eklundh, L. y Jönsson, P. (2011). TIMESAT 3.1 Software Manual, sección de definiciones de parámetros: https://web.nateko.lu.se/timesat/docs/timesat3_1_1_SoftwareManual.pdf; Jönsson, P. y Eklundh, L. (2004). Computers & Geosciences, 30(8), 833–845. https://doi.org/10.1016/j.cageo.2004.05.006
# Parámetros de TIMESAT: base, amplitud, inicio y fin de temporada

TIMESAT ajusta funciones a una serie temporal de un índice de vegetación y de ahí extrae parámetros de cada temporada. Según el manual de la versión 3.1 (Eklundh y Jönsson, 2011), la base (base level) es el promedio de los dos mínimos, izquierdo y derecho, de la curva ajustada. La amplitud estacional es el máximo de la
temporada menos esa base.

El inicio y el fin de temporada se fijan con un nivel que define el usuario. Ese nivel se puede dar como una proporción de la amplitud medida desde cada mínimo, o como un valor umbral fijo. El punto medio de la temporada se calcula con el 80 % del nivel en los dos bordes.

Por tanto, una "amplitud" de TIMESAT depende de cómo se elija la base y de los umbrales. Una cifra de amplitud sin su definición de base no permite comparar estudios. El manual no fija 50 % ni 90 % por defecto para el inicio y el fin de temporada.

Fuente: Eklundh, L. y Jönsson, P. (2011). TIMESAT 3.1 Software Manual, sección de definiciones de parámetros: https://web.nateko.lu.se/timesat/docs/timesat3_1_1_SoftwareManual.pdf; Jönsson, P. y Eklundh, L. (2004). Computers & Geosciences, 30(8), 833–845. https://doi.org/10.1016/j.cageo.2004.05.006
