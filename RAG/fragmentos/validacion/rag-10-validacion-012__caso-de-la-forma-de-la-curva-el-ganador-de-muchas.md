@id: rag-10-validacion-012
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Caso de la forma de la curva: el ganador de muchas correlaciones
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping correlaciones busqueda curva aceptaria auditoria caso correccion critique dentro familia filas forma ganador iterate muchas research tuvo umbral validacion variable alrededor amplia anidada anotar aplicar
@fuente: validacion/iterate_20261017__research__critique_expected_value.md; validacion/iterate_20261017__research__critique_leakage.md
# Caso de la forma de la curva: el ganador de muchas correlaciones

(Nuestros experimentos) Un parámetro de la curva de reflectancia de Sentinel-2 (la pendiente de la línea base previa a la temporada) se seleccionó entre 357 filas de un tamizaje por bloques; el mejor tuvo un q de Benjamini-Hochberg de 0.095. Entre 5,096 correlaciones univariadas dentro de municipio, la misma variable
tuvo ρ = +0.318 con q = 0.185, es decir, no significativa tras corrección. La auditoría la calificó como la señal satelital más fuerte del proyecto, lo que es justamente el síntoma de una búsqueda muy amplia.

(Cálculo) Bajo la hipótesis nula, un umbral z = 1.4, usado como criterio para esta familia, aceptaría alrededor de 8 % de los candidatos nulos; un z = 1.6 aceptaría 5.5 %. El umbral correcto para una búsqueda de miles de correlaciones no se ha calculado todavía y, según la auditoría, está lejos de 1.4.

(Recomendación) Tratar la búsqueda completa como familia: anotar todas las filas tamizadas, aplicar corrección por comparaciones múltiples y, si la variable se conserva, validarla con una selección anidada dentro de los pliegues.

Fuente: validacion/iterate_20261017__research__critique_expected_value.md; validacion/iterate_20261017__research__critique_leakage.md
