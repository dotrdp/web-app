@id: rag-07-teledeteccion-030
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Origen de la señal: reflectancia cruda frente a valores oficiales
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores valores base cruda escenas linea oficiales origen reflectancia senal cambio frente octubre offset ademas analisis archivos cambia change cifra cortas crudas cuidado docs dynamic
@fuente: dynamic_change__phenocurve__docs__A2_rededge.md
# Origen de la señal: reflectancia cruda frente a valores oficiales

Un punto de cuidado es el origen de la señal. Los valores de nuestros pipelines provienen de reflectancia cruda de Sentinel-2 L2A (escenas de 500 archivos, de los tiles 14QNG y 14QNH, con 250 fechas de enero a octubre de 2022–2025), mientras los valores oficiales del reto son otra fuente. Las escenas crudas terminan el
27 de octubre de 2025, así que el análisis de red-edge no tiene modo retrospectivo. Además, la línea de base del offset −0.1 cambia entre procesamientos (377 escenas cortas y 113 largas con línea base ≥ 04.00). Por eso las series de 2022 y 2025 pueden tener un cambio de nivel de unos 0.02–0.03 en NDVI. (El cambio de
offset de línea base de Sentinel-2 es un hecho del producto, pero la cifra de 0.02–0.03 es interna.)

Fuente: dynamic_change__phenocurve__docs__A2_rededge.md
