@id: rag-10-validacion-033
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Comparación pareada, repeticiones y reporte de incertidumbre
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping frente pareada comparacion diferencia parcela repeticiones debe diferencias error incertidumbre media modelo reporte research validacion advertencia auditorias barley base bloque candidatos ceiling comparar
@fuente: validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md
# Comparación pareada, repeticiones y reporte de incertidumbre

(Recomendación) Comparar modelos con la diferencia pareada del error cuadrático por parcela (o por pliegue), sobre las mismas particiones repetidas, y reportar media, error estándar e intervalo bootstrap por parcela o bloque. Un modelo debe reportarse frente a su línea base de municipio y frente a la media global.

(Nuestros experimentos) Las auditorías del proyecto compararon candidatos frente a una referencia común y encontraron que, sin pareado y sin repeticiones, las diferencias de unas milésimas no eran distinguibles.

(Advertencia) Las diferencias de RMSE se comprimen frente a las de MSE: ΔRMSE ≈ ΔMSE/(2·RMSE). Una diferencia de 0.003 en MSE corresponde a unas 0.003 t/ha de RMSE; la comparación debe hacerse sobre la diferencia pareada por parcela, no sobre el RMSE de cada modelo por separado.

Fuente: validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md
