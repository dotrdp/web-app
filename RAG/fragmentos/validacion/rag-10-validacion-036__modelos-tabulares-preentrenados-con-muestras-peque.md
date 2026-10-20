@id: rag-10-validacion-036
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Modelos tabulares preentrenados con muestras pequeñas
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping tabpfn validacion anidada evidencia modelo modelos muestras seleccion tabulares fuera mejor methods pequenas pequenos pipeline preentrenado preentrenados research small version afinar ajustado ajustar analisis aporte
@fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md
# Modelos tabulares preentrenados con muestras pequeñas

(Literatura) TabPFN v2 (Hollmann et al., Nature 2025, DOI 10.1038/s41586-024-08328-6; referencia verificada) es un modelo preentrenado para datos tabulares pequeños. TabArena (Erickson et al., arXiv 2506.16791) incluye conjuntos con al menos 500 muestras de entrenamiento y deja fuera los muy pequeños en su versión 0.1
(verificado en el texto), por lo que su evidencia no cubre n ≈ 138. El análisis JRC "From Rows to Yields" (validación dejando un año fuera; el número de filas de la versión previa no se verificó) encontró que TabPFN fue ligeramente peor que el mejor pipeline ML con selección anidada (maíz: TabPFN 8.8 % frente a 6.8 %
del mejor modelo de aprendizaje automático en rRMSEp; R² 0.86 y 0.91; Sabo et al., 2026, Scientific Reports, DOI 10.1038/s41598-026-50338-z), diferencia no significativa (sin
evidencia: la búsqueda no localizó el informe).

(Recomendación) Probar TabPFN o modelos similares con un conjunto compacto de variables (≤ 30 a 50), dentro de la misma validación anidada y por grupos, comparando con pares de pliegues. No ajustar hiperparámetros sobre las mismas particiones; afinar sumaría sesgo de selección.

(Nuestros experimentos) El corpus no contiene evidencia de que un modelo tabular preentrenado supere, con 138 parcelas, a un pipeline ajustado con selección anidada; por eso su aporte esperado se consideró pequeño.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md
