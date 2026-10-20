@id: rag-10-validacion-007
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Fuga por apilamiento con predicciones fuera de pliegue
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping predicciones validacion apilar fuera pesos pliegue referencia apilamiento conjunto cruzada fuga iterate margen miembros modo research stacking verificada verificado adicional afirmacion ajustar ambiguedad anidada anidado
@fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/iterate_20261017__research__critique_leakage.md
# Fuga por apilamiento con predicciones fuera de pliegue

(Literatura) Apilar (stacking) requiere predicciones de nivel uno generadas por validación cruzada, de modo que ninguna predicción use la etiqueta de la parcela que predice. Breiman (1996, Machine Learning, DOI 10.1007/bf00117832) es la referencia original de stacking; la referencia está verificada, pero la afirmación
de que los pesos no negativos son esenciales no se leyó en el texto (no verificado). Para evaluar el conjunto apilado de forma honesta hace falta una capa adicional de validación cruzada anidada (Varma y Simon, 2006, BMC Bioinformatics 7, 91, referencia verificada; Super Learner: van der Laan, Polley y Hubbard (2007),
Statistical Applications in Genetics and Molecular Biology 6(1), DOI 10.2202/1544-6115.1309, verificado en Crossref).

(Nuestros experimentos) Medimos el margen para apilar y ponderar los miembros del conjunto. La diversidad (ambigüedad) representaba cerca de 3.7 % del error cuadrático medio. Concluimos que el margen para apilar era de unas milésimas, y que una nueva combinación exige miembros con errores poco correlacionados.

(Regla de la auditoría) No ajustar una segunda etapa sobre predicciones de entrenamiento fuera de pliegue. Un miembro nuevo entra con peso fijo declarado de antemano; si los pesos se aprenden, deben aprenderse en modo anidado y encogerse hacia pesos iguales.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/iterate_20261017__research__critique_leakage.md
