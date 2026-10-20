@id: rag-07-teledeteccion-020
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Ajuste de curvas: calidad y convergencia en nuestros datos
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores arranques ajuste ajustes calidad convergencia coste curvas curvatura datos level nuestros plateau propio alcanzan casos cercanos cero change convergen curva dentro desde detiene docs dynamic
@fuente: dynamic_change__phenocurve__docs__F1_fits.md
# Ajuste de curvas: calidad y convergencia en nuestros datos

Con Planet NDVI, el 98 % de los ajustes bak convergen desde los 16 arranques, y el mejor coste se obtiene en todos los arranques cercanos (12 de 16 arranques dentro de 1 % del coste mínimo). Hay límites que se alcanzan: en 19.3 % de los ajustes bak, d1 = d0 (la curva se detiene en el punto de inflexión), y en 4.6 % la
curvatura a es cero. En esos casos K se extrapola y su error estándar es 7.2 veces el de plateau_level (0.071 frente a 0.010). Por eso, la recomendación del propio pipeline es usar plateau_level y su tiempo, no K ni la curvatura. Esta lectura es un resultado propio sobre la identificabilidad del modelo.

Fuente: dynamic_change__phenocurve__docs__F1_fits.md
