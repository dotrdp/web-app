@id: rag-10-validacion-009
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Ajustes de hiperparámetros sobre las mismas divisiones
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping validacion consulta cruzada hiperparametros iterate mismas research tibshirani verificado ajustes critique divisiones error etiquetas libro numero particiones sesgo ajuste antes aoas224 aparecian aquellas arxiv auditoria
@fuente: validacion/iterate_20261017__research__critique_expected_value.md; validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__B3_small_n_methods.md
# Ajustes de hiperparámetros sobre las mismas divisiones

(Literatura) El mínimo de un error de validación cruzada usado para elegir un modelo está sesgado a la baja (Tibshirani y Tibshirani, 2009, verificado, DOI 10.1214/08-AOAS224; Varma y Simon, 2006, referencia verificada, DOI 10.1186/1471-2105-7-91). Un procedimiento que elige hiperparámetros y reporta el error de los
mismos pliegues sobreestima el desempeño, y el sesgo crece con el número de configuraciones probadas. Bates, Hastie y Tibshirani (2024, JASA; título verificado) estudian qué estima la validación cruzada; el resumen indica que los intervalos de validación cruzada ingenuos pueden tener una cobertura «muy por debajo del
nivel deseado» (verificado en arXiv 2104.00673 y DOI 10.1080/01621459.2023.2197686).

(Nuestros experimentos) Varias propuestas se evaluaron con las mismas 20 particiones. La auditoría de la ronda contabilizó las familias de hipótesis, incluidas aquellas que aparecían como "nuevas" pero compartían datos con pruebas previas. Una lección operativa fue registrar cada consulta a las etiquetas antes de
puntuar cualquier candidato nuevo.

(Regla) Declarar en un libro de decisiones cada consulta de etiquetas, el tipo de consulta (diagnóstico, prueba o ajuste), las particiones usadas y el número de candidatos. Sin ese libro, el sesgo de selección no puede corregirse.

Fuente: validacion/iterate_20261017__research__critique_expected_value.md; validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__B3_small_n_methods.md
