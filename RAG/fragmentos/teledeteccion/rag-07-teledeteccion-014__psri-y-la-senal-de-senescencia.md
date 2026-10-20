@id: rag-07-teledeteccion-014
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: PSRI y la señal de senescencia
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores psri senescencia dosel merzlyak debe senal solo sube alto anderegg antes aproximacion aproximada bandas barley calculo centrada cerca cerrado change cierre clorofila corpus coverage datos
@fuente: dynamic_change__phenocurve__docs__A2_rededge.md; literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; Merzlyak et al. (1999), Physiologia Plantarum 106(1):135-141, doi 10.1034/j.1399-3054.1999.106119.x
# PSRI y la señal de senescencia

PSRI (índice de reflectancia de senescencia de plantas) sube cuando la clorofila disminuye y el dosel envejece. La definición original de Merzlyak et al. (1999) es (R680 − R500)/R750. El corpus usa la aproximación con bandas de Sentinel-2, (B04 − B02)/B06; B6 está centrada en 740 nm, no en 750 nm, así que es una
equivalencia aproximada. El software SNAP documenta otro cálculo, PSRI = (R − B)/RE2, que no debe mezclarse con el de Merzlyak. En Anderegg et al. (2020), el PSRI siguió la senescencia visual mejor que otros índices evaluados en más de 300 variedades de trigo (verificado). En nuestros datos, PSRI es alto sobre suelo
desnudo (cerca de 0.3 de enero a mayo) y cae a unos 0.05 con el dosel cerrado. Sólo sube de nuevo en la senescencia (en AGC_023, desde finales de septiembre). Por tanto, PSRI sólo se debe leer en el tramo posterior al pico, no antes del cierre del dosel.

Fuente: dynamic_change__phenocurve__docs__A2_rededge.md; literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; Merzlyak et al. (1999), Physiologia Plantarum 106(1):135-141, doi 10.1034/j.1399-3054.1999.106119.x
