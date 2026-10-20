@id: rag-07-teledeteccion-073
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Nubosidad en la temporada de lluvias: rellenado de huecos de Sentinel-2 con radar (Lasko 2022)
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores lasko huecos junio lluvias otro radar rellenado temporada banda bosque enero estudio ndwi uavsar africa aleatorio altos aparecieron asiatico autor bajo boosting
@fuente: Lasko, K. (2022), Gap filling cloudy Sentinel-2 NDVI and NDWI pixels with multi-frequency denoised C-band and L-band SAR, texture, and shallow learning techniques, Remote Sensing 14(17):4221, doi 10.3390/rs14174221.
# Nubosidad en la temporada de lluvias: rellenado de huecos de Sentinel-2 con radar (Lasko 2022)

La nubosidad es la principal limitación de las series ópticas en la temporada de lluvias. Lasko (2022) recuerda que en el este de Norteamérica más de 60 % de las observaciones diarias de MODIS estaban nubladas, y que en Sudamérica ecuatorial, África y el Sudeste asiático la cobertura supera 75 % del tiempo (citando a
otro estudio). Para evaluar el rellenado, el autor usó Sentinel-1 de banda C con eliminación de ruido, UAVSAR de banda L y textura GLCM, con modelos de bosque aleatorio, máquinas de vectores de soporte, gradient boosting y un conjunto, en el río Pee Dee (Carolina del Sur, EE. UU.), a lo largo de tres temporadas. En
septiembre, el mejor modelo predijo el NDVI de Sentinel-2 con R² = 0.868 (MAE = 0.094) y el NDWI con R² = 0.91; en enero y en junio, sin UAVSAR, el R² bajó a 0.60 (NDVI en enero) y llegó a 0.72 (NDVI en junio, MAE = 0.142). Los errores más altos aparecieron sobre suelo desnudo y bosque. Para el proyecto, el dato útil
es que el radar puede rellenar huecos de Sentinel-2 con R² de 0.6 a 0.9 según la fecha y el sensor. El hueco de junio en las parcelas de Hidalgo sería un caso de prueba natural, pero el estudio es de otro clima y otro cultivo, así que su transferencia es una hipótesis.

Fuente: Lasko, K. (2022), Gap filling cloudy Sentinel-2 NDVI and NDWI pixels with multi-frequency denoised C-band and L-band SAR, texture, and shallow learning techniques, Remote Sensing 14(17):4221, doi 10.3390/rs14174221.
