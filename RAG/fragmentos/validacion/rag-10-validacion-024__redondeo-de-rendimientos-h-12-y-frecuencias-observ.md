@id: rag-10-validacion-024
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Redondeo de rendimientos: h²/12 y frecuencias observadas
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping rejilla valores datos error etiquetas frecuencias observadas oficial parcelas redondear redondeo rendimientos varianza anade ancho aproximada archivo barley caen calculados calculo calpulalpan ceiling contarlos dataset
@fuente: reto_y_datos/HECHOS_CALCULADOS_dataset_oficial.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md
# Redondeo de rendimientos: h²/12 y frecuencias observadas

(Cálculo propio) Redondear a una rejilla de ancho h añade un error con varianza aproximada h²/12. Para h = 0.5 t/ha, la varianza es 0.0208 (t/ha)² y la desviación estándar, 0.144 t/ha.

(Nuestros experimentos, datos oficiales) Los valores más repetidos de rendimiento son 4.5 (27 parcelas), 3.0 (20), 3.5 (14), 2.5 (11), 4.6 (9), 4.4 (8), 4.7 (7) y 4.1 (5). Calpulalpan usa solo 2.5, 3.0 y 3.5, con 8, 14 y 8 parcelas.

(Verificado con el archivo oficial de etiquetas) 45 de 138 etiquetas (32.6 %) caen exactamente en la rejilla de 0.5 t/ha: 19 en 3.0, 13 en 3.5, 11 en 2.5 y 2 en otros valores de la rejilla. Los valores próximos a 4.5 (4.49, 4.52, 4.55…) no son exactos; contarlos como 4.5 tras redondear a 0.1 t/ha es un error.

Fuente: reto_y_datos/HECHOS_CALCULADOS_dataset_oficial.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md
