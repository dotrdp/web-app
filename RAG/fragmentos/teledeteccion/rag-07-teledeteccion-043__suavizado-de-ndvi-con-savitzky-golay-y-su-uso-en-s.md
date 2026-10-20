@id: rag-07-teledeteccion-043
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Suavizado de NDVI con Savitzky–Golay y su uso en series de Sentinel-2
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores golay savitzky filtro series ventana chen longitud suavizado ajuste algoritmo alta analytical atmosfera atribuir bajan bise calcula calidad chemistry compararon compuestos conjunto
@fuente: Chen et al. (2004), Remote Sensing of Environment 91(3-4):332-344, doi 10.1016/j.rse.2004.03.014; Savitzky y Golay (1964), Analytical Chemistry 36(8):1627-1639
# Suavizado de NDVI con Savitzky–Golay y su uso en series de Sentinel-2

Chen et al. (2004) propusieron reconstruir series NDVI de alta calidad con un filtro Savitzky–Golay iterativo. El método supone que nubes o mala atmósfera bajan el NDVI, por lo que empuja los valores hacia la envolvente superior de la serie. Lo probaron con compuestos decenales de SPOT VGT-S, dieron recomendaciones de
parámetros y lo compararon con el algoritmo BISE y con un ajuste de Fourier, reportando mejores resultados en conjunto. El filtro original (Savitzky y Golay, 1964) calcula pesos de convolución a partir de polinomios de Gram que reproducen exactamente la regresión polinómica por mínimos cuadrados. Su uso exige fijar la
longitud de la ventana y el grado del polinomio. Para cebada de temporal con pocas observaciones (la mediana de Sentinel-2 válidas es 31 por parcela, con huecos en junio), la longitud de ventana decide cuánto se suaviza el verdeo. Recomendación: probar Savitzky–Golay frente a Whittaker y reportar la sensibilidad a la
ventana, sin atribuir a un filtro la forma real de la fenología.

Fuente: Chen et al. (2004), Remote Sensing of Environment 91(3-4):332-344, doi 10.1016/j.rse.2004.03.014; Savitzky y Golay (1964), Analytical Chemistry 36(8):1627-1639
