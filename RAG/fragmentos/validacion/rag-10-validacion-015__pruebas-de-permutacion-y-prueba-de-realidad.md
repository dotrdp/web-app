@id: rag-10-validacion-015
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Pruebas de permutación y prueba de realidad
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping permutacion prueba ganancia iterate realidad research seleccion validacion candidato critique dentro distribucion misma municipio nulo nulos observada pruebas agrupados area auditoria bloque candidatos compara competitivos
@fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/iterate_20261017__research__critique_feasibility.md
# Pruebas de permutación y prueba de realidad

(Literatura) Una prueba de permutación construye la distribución nula rompiendo la relación entre predictores y etiqueta, y compara la ganancia observada con esa distribución. Para datos agrupados, la permutación debe respetar la estructura: permutar residuos dentro de municipio, en lugar de entre todas las parcelas.

(Nuestros experimentos) En la auditoría de selección, el nulo por permutación dentro de municipio sirvió como referencia para juzgar el umbral del candidato de área (véase el fragmento correspondiente). La prueba de realidad sobre candidatos competitivos dio p = 0.63: en la mayoría de los nulos, la selección pura
produce una ganancia igual o mayor a la observada.

(Recomendación) Para cada candidato nuevo, generar el nulo con las mismas particiones, la misma selección y la misma permutación por bloque, y registrar la proporción de nulos que superan la ganancia real. Si se prueban varias hipótesis, corregir el conjunto con el procedimiento de Holm (1979).

Fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/iterate_20261017__research__critique_feasibility.md
