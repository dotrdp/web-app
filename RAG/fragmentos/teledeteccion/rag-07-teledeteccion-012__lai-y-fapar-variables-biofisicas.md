@id: rag-07-teledeteccion-012
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: LAI y fAPAR: variables biofísicas
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores fapar variables biofisicas planet ambas change docs dynamic foliar phenocurve superficie absorbida activa aislado algoritmo area armonizar baret biofisico calibracion combinarse cultivos datos deben
@fuente: dynamic_change__phenocurve__docs__A1_series.md; dynamic_change__phenocurve__docs__F1_fits.md
# LAI y fAPAR: variables biofísicas

LAI (índice de área foliar) es la superficie foliar por unidad de superficie de terreno. fAPAR es la fracción de radiación fotosintéticamente activa absorbida por la vegetación. Ambas son variables biofísicas que dependen de un modelo de transferencia radiativa, a diferencia de los índices (definición estándar; SIN
EVIDENCIA en línea en la ronda 4). En Sentinel-2, el procesador biofísico de SNAP (algoritmo SL2P, Weiss y Baret 2016) estima ambas variables; su validación en cultivos se resume en el fragmento de LAI y fAPAR de la sección de expansión. Sus valores varían según el proveedor. En nuestros datos, Planet LAI es mayor que
Sentinel-2 LAI por +1.12 en promedio, con r = 0.929. Esto no es un error de medición aislado, sino un desacuerdo de calibración: la regresión de Planet frente a Sentinel-2 es 0.857 + 1.838 ×
S2. Por eso LAI de Planet y de Sentinel-2 no deben combinarse sin armonizar.

Fuente: dynamic_change__phenocurve__docs__A1_series.md; dynamic_change__phenocurve__docs__F1_fits.md
