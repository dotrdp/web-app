@id: rag-07-teledeteccion-044
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Suavizado de Whittaker–Eilers: control continuo de la suavidad
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores eilers suavizado serie suavidad whittaker continuo control cruzada elegir huecos literatura validacion valor ac034173t ajustados alternativa analytical articulo automaticamente castiga chemistry continua controla cuadrados
@fuente: Eilers (2003), doi 10.1021/ac034173t
# Suavizado de Whittaker–Eilers: control continuo de la suavidad

Eilers (2003) presentó el suavizador de Whittaker como alternativa al filtro Savitzky–Golay. Es un suavizado por mínimos cuadrados penalizados que castiga las diferencias de los valores ajustados; el parámetro λ controla la suavidad de forma continua. El método es rápido, interpola automáticamente los huecos de la
serie y permite validación cruzada dejando uno fuera para elegir λ (verificado en el resumen del artículo, Analytical Chemistry 75(14):3631-3636). Por tanto, el suavizado es útil cuando la serie tiene huecos irregulares, como las observaciones de Sentinel-2 en junio. El valor λ = 100 usado en nuestro pipeline es una
elección del proyecto y no un valor recomendado por la literatura; la literatura no fija un λ óptimo para cebada. Recomendación: elegir λ por validación cruzada sobre la serie de cada parcela y reportar cuántas parcelas quedan con λ en el límite del rango.

Fuente: Eilers (2003), doi 10.1021/ac034173t
