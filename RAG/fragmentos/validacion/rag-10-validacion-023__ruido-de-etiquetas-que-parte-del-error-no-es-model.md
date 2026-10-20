@id: rag-10-validacion-023
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Ruido de etiquetas: qué parte del error no es modelable
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping error etiquetas ruido escenarios verdadero barley colaboradores dentro lobell modelable modelado municipio notes parte rendimiento research validacion varianza yield acceso accuracy ademas advertencia afecta aparente
@fuente: validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md
# Ruido de etiquetas: qué parte del error no es modelable

(Cálculo propio y literatura) Si la etiqueta observada es el rendimiento verdadero más un error independiente de varianza σe², el MSE observado es el MSE verdadero más σe². Por eso, el RMSE contra etiquetas ruidosas no puede bajar de σe, aunque el modelo sea perfecto. Además, la confiabilidad es λ = 1 − (σe² +
g²/12)/0.2256, donde 0.2256 es la varianza dentro de municipio y g²/12 el ruido de redondeo.

(Escenarios) Con σe = 0.10 t/ha, λ ≈ 0.86; con σe = 0.20, λ ≈ 0.73; con σe = 0.30, λ ≈ 0.51. Bajo esos escenarios, el R² verdadero dentro de municipio sería de 0.07 a 0.12. Los resultados de Lobell y colaboradores (2020) sobre cómo el ruido en las etiquetas de entrenamiento y de evaluación afecta la eficiencia y el R²
aparente no se confirmaron: el artículo de Lobell y colaboradores (2020) es de acceso cerrado y no se pudo leer (sin evidencia, no verificado); la atribución se retira hasta confirmarla.

(Advertencia) Estos escenarios son supuestos. No existe en el corpus una medición del error de los reportes de rendimiento para estas parcelas.

Fuente: validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md
