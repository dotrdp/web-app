@id: rag-10-validacion-008
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Selección de variables y transformaciones fuera del pliegue
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping pliegue datos dentro descubrimiento seleccion variables chignahuapan conjunto critique debe despues efecto eligio etiquetas evaluacion fuera iterate research restriccion transformaciones validacion algoritmos anidada area auditoria
@fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_expected_value.md
# Selección de variables y transformaciones fuera del pliegue

(Literatura) Seleccionar variables con la correlación con la etiqueta de todo el conjunto y después validar con las mismas particiones produce un error optimista que puede ser tan grande como la diferencia entre algoritmos (Cawley y Talbot, 2010, JMLR 11(70), 2079-2107, referencia verificada; la magnitud del sesgo no
se leyó en el texto). La selección debe ocurrir dentro de cada pliegue de entrenamiento.

(Nuestros experimentos) Una de las hipótesis evaluadas, un coeficiente de pendiente para el área de la parcela dentro de Chignahuapan, se eligió después de que una descomposición de los residuos (con todas las 138 etiquetas) sugiriera el efecto. La restricción a Chignahuapan también se eligió por la ausencia de efecto
en otros municipios observada en esos mismos datos. La auditoría concluyó que el candidato no era válido como prueba confirmatoria porque su descubrimiento y su evaluación compartían datos.

(Recomendación) Cuando una variable o una restricción geográfica se descubre con etiquetas, la evaluación posterior debe ser anidada: el descubrimiento se repite dentro de cada pliegue, o se usa un conjunto de datos que no participó en el descubrimiento.

Fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_expected_value.md
