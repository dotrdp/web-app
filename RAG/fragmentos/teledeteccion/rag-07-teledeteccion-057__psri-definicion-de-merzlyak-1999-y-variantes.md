@id: rag-07-teledeteccion-057
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: PSRI: definición de Merzlyak (1999) y variantes
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores merzlyak psri anderegg definicion physiologia plantarum senescencia variantes aproximacion aproximada articulo aumenta bandas calcula carotenoides centradas cita clorofila confirmarse corpus debe define disminuye dosel encontraron
@fuente: Merzlyak et al. (1999), Physiologia Plantarum 106(1):135-141, doi 10.1034/j.1399-3054.1999.106119.x; Anderegg et al. (2020), doi 10.3389/fpls.2019.01749
# PSRI: definición de Merzlyak (1999) y variantes

El índice de reflectancia de senescencia de plantas (PSRI) se define según Merzlyak et al. (1999), en Physiologia Plantarum 106(1):135–141, como (R680 − R500)/R750. Sube cuando disminuye la clorofila y aumenta la proporción de carotenoides, típica del envejecimiento del dosel y de la maduración de frutos. Una revisión
de 2016 cita una variante con 550 nm en lugar de 500 nm, así que la longitud de onda de referencia verde debe confirmarse en el artículo original. El software SNAP de ESA calcula otra expresión, (R − B)/RE2, que no es el PSRI de Merzlyak. En Sentinel-2, la aproximación del corpus (B04 − B02)/B06 usa bandas centradas en
665, 490 y 740 nm, no exactamente 680, 500 y 750 nm, así que es una equivalencia aproximada. Anderegg et al. (2020) encontraron que el PSRI siguió la senescencia visual mejor que otros índices en trigo.

Fuente: Merzlyak et al. (1999), Physiologia Plantarum 106(1):135-141, doi 10.1034/j.1399-3054.1999.106119.x; Anderegg et al. (2020), doi 10.3389/fpls.2019.01749
