@id: rag-07-teledeteccion-006
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Cuándo sirve Landsat térmico (LST) y cuándo no
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores landsat sirve predictors ronda solo termico angeles appeears area atribuyo banda barley campos cifra coleccion consultada contrastes cuatro debe defendible diferencia documentacion durante earth earthaccess
@fuente: modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md
# Cuándo sirve Landsat térmico (LST) y cuándo no

La temperatura de superficie de Landsat (banda ST_B10, 100 m nativos remuestreados a 30 m) sólo resuelve campos de unas 3–4 ha o más (al menos cuatro píxeles puros). Esta cifra de remuestreo se atribuyó a la documentación de Landsat Colección 2; la página de productos de USGS consultada en la ronda 4 no la menciona
(SIN EVIDENCIA). ECOSTRESS ofrece 70 m, pero en Google Earth Engine
sólo tiene tiles del área de Los Ángeles; para México se debe pedir por AppEEARS o earthaccess (no verificado en esta ronda). MODIS LST, a 1 km, sirve para horas de helada regionales, no para contrastes entre parcelas. La variable más defendible es una diferencia ΔT entre la parcela y la mediana del municipio, en la
misma escena, durante el espigamiento y el llenado de grano. Esta es una recomendación de la fuente, no un resultado del proyecto.

Fuente: modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md
