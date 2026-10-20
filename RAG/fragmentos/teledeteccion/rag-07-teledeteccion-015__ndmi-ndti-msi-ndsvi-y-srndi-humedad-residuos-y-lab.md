@id: rag-07-teledeteccion-015
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: NDMI, NDTI, MSI, NDSVI y SRNDI: humedad, residuos y labranza
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores ndmi srndi humedad ndsvi residuos indices labranza ndti agua ajuste change docs dynamic phenocurve swir vegetacion atribucion bandas biomasa caracterizan confirmo contenido contrario correlacion covariables
@fuente: dynamic_change__phenocurve__docs__F1_fits.md; dynamic_change__phenocurve__docs__A1_series.md; reto_y_datos/Diccionario_de_indices_satelitales.txt; Gao (1996), Remote Sensing of Environment 58(3):257-266
# NDMI, NDTI, MSI, NDSVI y SRNDI: humedad, residuos y labranza

Estos índices responden sobre todo a humedad del tejido, residuos o suelo expuesto, no a la biomasa verde. NDMI y MSI son sensibles al contenido de agua de la vegetación. NDTI, CRC, NDSVI y SRNDI caracterizan residuos y labranza con bandas SWIR. Sobre el origen de NDMI: Gao (1996) definió un índice NIR–SWIR (0.86 y
1.24 µm) para el agua líquida de la vegetación, que suele llamarse NDMI o «NDWI de Gao»; la atribución a Hunt y Rock (1989) no se confirmó en esta ronda. En nuestro ajuste, MSI y SRNDI tienen signo negativo respecto al NDVI, y NDSVI sube con el dosel (correlación +0.74), contrario a lo que suponía el texto de la tarea.
SRNDI tiene el ajuste más pobre: R² mediana de 0.626 con una curva doble logística. Estos índices sirven como covariables de humedad y residuo, no como sustitutos del verdor.

Fuente: dynamic_change__phenocurve__docs__F1_fits.md; dynamic_change__phenocurve__docs__A1_series.md; reto_y_datos/Diccionario_de_indices_satelitales.txt; Gao (1996), Remote Sensing of Environment 58(3):257-266
