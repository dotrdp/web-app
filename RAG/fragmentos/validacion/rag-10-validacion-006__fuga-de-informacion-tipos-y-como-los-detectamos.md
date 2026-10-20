@id: rag-10-validacion-006
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Fuga de información: tipos y cómo los detectamos
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping fuga etiquetas informacion parcelas tipos critique detectamos entrenamiento fugas iterate kaufman notas pliegue porque predicciones research usan validacion variables verificado acceso ajustaba ajustar apilar aprenderse
@fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_feasibility.md; Kaufman et al. (2012), https://doi.org/10.1145/2382577.2382579
# Fuga de información: tipos y cómo los detectamos

(Literatura) Kaufman y colaboradores (2012) definen la fuga como la situación en que el modelo tiene acceso a información relacionada con el objetivo que no tendría en el momento real de predecir (verificado, DOI 10.1145/2382577.2382579). Kapoor y Narayanan (2023) clasifican la fuga en ocho tipos (verificado); la
definición literal que usan las notas del corpus, con sus formas comunes (preprocesar con estadísticas de todo el conjunto, seleccionar variables con todos los datos, apilar predicciones mal generadas y ajustar hiperparámetros sobre la misma partición de evaluación), no se leyó en la fuente primaria y debe tomarse como
lista de las notas.

(Nuestras auditorías) Una auditoría de fugas revisó los candidatos de la ronda de iteración y encontró que, en las propuestas revisadas, no se ajustaba ninguna segunda etapa con predicciones fuera de pliegue de parcelas de entrenamiento, y que las construcciones de variables sin etiquetas (por ejemplo, centrado sobre
las 100 parcelas de Chignahuapan con sus rasgos de geometría, o medianas de cohorte) eran legítimas porque no usan rendimientos. Sí detectó fugas reales de otro tipo, descritas en los fragmentos siguientes.

(Regla) Las características pueden construirse con todas las parcelas porque no requieren etiquetas; los coeficientes, los umbrales y las selecciones deben aprenderse solo con las etiquetas del pliegue de entrenamiento.

Fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_feasibility.md; Kaufman et al. (2012), https://doi.org/10.1145/2382577.2382579
