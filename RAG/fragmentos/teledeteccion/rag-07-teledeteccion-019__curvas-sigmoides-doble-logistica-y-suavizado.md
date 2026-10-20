@id: rag-07-teledeteccion-019
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Curvas sigmoides, doble logística y suavizado
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores doble logistica suavizado chen curvas eilers forma golay lambda savitzky sigmoides ac034173t ajusta analytical aplicaron automatica barley caida calendario cercana change chemistry clasica continuo
@fuente: dynamic_change__phenocurve__docs__F1_fits.md; literature_review__reports__Panicle_coverage_and_barley_yield.md; Eilers (2003), Analytical Chemistry 75(14):3631-3636, doi 10.1021/ac034173t; Chen et al. (2004), doi 10.1016/j.rse.2004.03.014
# Curvas sigmoides, doble logística y suavizado

El modelo piecewise de Bak et al. (2025) ajusta un crecimiento logístico K/(1 + e^(−g(x−d0))) hasta un día de transición d1, y después una caída cuadrática con curvatura a. En nuestro pipeline se usan dos familias: la de Bak (bak) y la doble logística (dlog), con parámetros t1, t2, g1 y g2. Como suavizado no
paramétrico se usa Whittaker con lambda = 100, de segundas diferencias (ventana de media potencia cercana a 20 días; la elección de lambda es del proyecto, no de la literatura). Eilers (2003) presentó este suavizador de mínimos cuadrados penalizados, rápido, con control continuo de la suavidad, interpolación automática
de huecos y validación cruzada dejando uno fuera (verificado). El filtro Savitzky–Golay (Savitzky y Golay, 1964) es otra opción clásica, y Chen et al. (2004) lo aplicaron de forma iterativa a series NDVI; en nuestros datos no se usa y el corpus no lo evalúa. Con Planet NDVI, la mediana de R² de la doble logística es
0.975 y la de la forma de Bak 0.973 (cutoff, eje calendario).

Fuente: dynamic_change__phenocurve__docs__F1_fits.md; literature_review__reports__Panicle_coverage_and_barley_yield.md; Eilers (2003), Analytical Chemistry 75(14):3631-3636, doi 10.1021/ac034173t; Chen et al. (2004), doi 10.1016/j.rse.2004.03.014
