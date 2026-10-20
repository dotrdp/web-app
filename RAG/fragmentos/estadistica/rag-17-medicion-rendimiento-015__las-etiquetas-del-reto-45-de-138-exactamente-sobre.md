@id: rag-17-medicion-rendimiento-015
@documento: rag-17-medicion-rendimiento | temas/17_medicion_del_rendimiento_y_estadistica_agricola.md
@categoria: estadistica
@titulo: Las etiquetas del reto: 45 de 138 exactamente sobre la rejilla de 0.5
@titulo_documento: Medición del rendimiento en campo y estadística agrícola: métodos, errores y límites para las etiquetas del reto
@etiquetas: rendimiento; cosecha de muestra; crop cut; autorreporte; humedad del grano; redondeo; heaping; siap; inegi; error de medición
@claves: rendimiento cosecha de muestra crop cut autorreporte humedad del grano redondeo heaping siap inegi error de medicion etiquetas rejilla exactamente reto valores archivo cifras datos oficial agrocebada aproximada artificialmente caen calculadas campo casi cifra coincide contarse corpus cuales deben entrenamiento exacto exactos
@fuente: 01_reto_agrocebada_y_datos.md del corpus (cifras calculadas sobre el archivo oficial de etiquetas); 10_validacion_fugas_y_muestras_pequenas.md (sección de redondeo, que coincide en cifras).
# Las etiquetas del reto: 45 de 138 exactamente sobre la rejilla de 0.5

En el archivo oficial de etiquetas de entrenamiento, 45 de 138 valores (32.6 %) caen exactamente en múltiplos de 0.5 t/ha: 19 en 3.0, 13 en 3.5, 11 en 2.5 y 2 en otros valores de la rejilla. Los valores 4.49, 4.52, 4.55 y similares no son exactos y no deben contarse como 4.5 tras redondear a 0.1 t/ha; con esa regla la
cifra de 4.5 subiría artificialmente. Que casi un tercio de las etiquetas sea exacto en una rejilla de 0.5 indica que una parte de los datos fue redondeada o registrada en forma aproximada al nivel del productor o del técnico de campo. No es posible saber cuáles etiquetas tienen esa procedencia sin el metadato del
método.

Fuente: 01_reto_agrocebada_y_datos.md del corpus (cifras calculadas sobre el archivo oficial de etiquetas); 10_validacion_fugas_y_muestras_pequenas.md (sección de redondeo, que coincide en cifras).
