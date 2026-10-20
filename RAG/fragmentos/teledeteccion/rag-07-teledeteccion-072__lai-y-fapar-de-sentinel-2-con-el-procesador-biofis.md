@id: rag-07-teledeteccion-072
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: LAI y fAPAR de Sentinel-2 con el procesador biofísico de SNAP: validación en cultivos
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores snap fapar resumen validacion busqueda cultivos sl2p algoritmo baret biofisico campo debe kganyago procesador weiss absorbida activa adecuado africa agricultura aplicadas area article atmosfericamente
@fuente: Weiss, M., Baret, F. (2016), algoritmo SL2P (citado en resumen de búsqueda; no leído); Kganyago et al. (2020) (resumen de búsqueda); European Journal of Remote Sensing (2021), https://doaj.org/article/ddb92b0737294a00a2812f7f5159bd8c (resumen).
# LAI y fAPAR de Sentinel-2 con el procesador biofísico de SNAP: validación en cultivos

El LAI (índice de área foliar) y la fAPAR (fracción de radiación fotosintéticamente activa absorbida) que se obtienen con SNAP se estiman con el algoritmo SL2P de Weiss y Baret (2016): redes neuronales entrenadas con simulaciones de PROSPECT y 4SAIL, aplicadas a reflectancia corregida atmosféricamente (L2A) para
producir productos L2B. El centro de procesamiento de Sentinel-2 no los genera de forma operativa, por lo que el usuario debe calcularlos en SNAP. Una revisión sobre SL2P reporta que su validación cumple los requisitos en cultivos (Djamai et al. 2019; Hu et al. 2020; Brown et al. 2021a), pero que subestima LAI y fAPAR
en bosques densos (según el resumen de búsqueda). En África, Kganyago et al. (2020) hallaron R² de 0.6 a 0.7 entre el LAI de SNAP y el medido en campo, con RMSE y MAE mayores de 2 m²/m², y concluyeron que el producto no es adecuado para agricultura de precisión a escala de parcela. Un estudio europeo de regresiones con
índices de vegetación en cereales obtuvo fAPAR con rRMSE de 14 % y LAI con 45 %, y recomendó un modelo de LAI en la etapa de macollaje; no usa SNAP. Para el proyecto, el LAI de Planet y el de Sentinel-2 no son intercambiables (diferencia de +1.12), y no encontramos una validación de fAPAR de SNAP en cebada: debe
validarse con mediciones de campo locales.

Fuente: Weiss, M., Baret, F. (2016), algoritmo SL2P (citado en resumen de búsqueda; no leído); Kganyago et al. (2020) (resumen de búsqueda); European Journal of Remote Sensing (2021), https://doaj.org/article/ddb92b0737294a00a2812f7f5159bd8c (resumen).
