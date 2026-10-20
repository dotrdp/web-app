---
id: rag-10-validacion
titulo: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
categoria: validacion
etiquetas: [validación cruzada, fuga de información, muestras pequeñas, ruido de etiquetas, redondeo de rendimientos, bootstrap, intervalos de confianza, rmse, sesgo de selección, validación espacial, heaping]
idioma: es
fecha: 2026-10-18
fuentes_internas: ["validacion/iterate_20261017__research__critique_leakage.md", "validacion/literature_review__report__sections__06_validacion.typ.txt", "validacion/iterate_20261017__research__B3_small_n_methods.md", "validacion/iterate_20261017__research__critique_expected_value.md",
"validacion/iterate_20261017__research__critique_feasibility.md", "validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md", "validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md",
"validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md", "reto_y_datos/HECHOS_CALCULADOS_dataset_oficial.md"]
fuentes_externas: ["Hunt, M. L., Blackburn, G. A., Carrasco, L., Redhead, J. W., Rowland, C. S. (2019). High resolution wheat yield mapping using Sentinel-2. Remote Sensing of Environment 233:111410, DOI 10.1016/j.rse.2019.111410 (metadatos de Crossref; cifras de resumen de búsqueda). ", "van der Laan, M. J., Polley,
E. C., Hubbard, A. E. (2007). Super Learner. Statistical Applications in Genetics and Molecular Biology 6(1), DOI 10.2202/1544-6115.1309 (Crossref). ", "Sabo, F., Meroni, M., Piles, M., Claverie, M., Ferreira, F., van den Berg, E., Collivignarelli, F., Rembold, F. (2026). From rows to yields: how foundation models for
tabular data simplify crop yield prediction. Scientific Reports, DOI 10.1038/s41598-026-50338-z (repositorio JRC142524). ", "Geoscientific Model Development 15(9), artículo 3519, 2022, DOI 10.5194/gmd-15-3519-2022 (DOI inferido de la URL del artículo; título y autores no obtenidos)", "Roberts, D. R. et al. (2017).
Cross-validation strategies for data with temporal, spatial, hierarchical, or phylogenetic structure. Ecography, 40(8), 913-929. https://doi.org/10.1111/ecog.02881", "Ploton, P. et al. (2020). Spatial validation reveals poor predictive performance of large-scale
ecological mapping models. Nature Communications, 11, 4540. https://doi.org/10.1038/s41467-020-18321-y", "Wadoux, A. M. J.-C. et al. (2021). Spatial cross-validation is not the right way to evaluate map accuracy. Ecological Modelling, 457, 109692. https://doi.org/10.1016/j.ecolmodel.2021.109692", "Meyer, H. y Pebesma,
E. (2021). Predicting into unknown space? Estimating the area of applicability of spatial prediction models. Methods in Ecology and Evolution, 12, 1620-1633. https://doi.org/10.1111/2041-210X.13650", "Meyer, H. y Pebesma, E. (2022). Machine learning-based global maps of ecological variables and the challenge of
assessing them. Nature Communications, 13. https://doi.org/10.1038/s41467-022-29838-9", "EGU24-10278 (2024), resumen de congreso sobre el área de aplicabilidad. https://meetingorganizer.copernicus.org/EGU24/EGU24-10278.html", "Valavi, R., Elith, J., Lahoz-Monfort, J. J. y Guillera-Arroita, G. (2019). blockCV: An R
package for generating spatially or environmentally separated folds for k-fold cross-validation of species distribution models. Methods in Ecology and Evolution, 10(2), 225-232. https://doi.org/10.1111/2041-210X.13107", "Kaufman, S., Rosset, S., Perlich, C. y Stitelman, O. (2012). Leakage in data mining: formulation,
detection, and avoidance. ACM Transactions on Knowledge Discovery from Data, 6(4), 15. https://doi.org/10.1145/2382577.2382579", "Kapoor, S. y Narayanan, A. (2023). Leakage and the reproducibility crisis in machine-learning-based science. Patterns, 4, 100804. https://doi.org/10.1016/j.patter.2023.100804", "Tibshirani,
R. J. y Tibshirani, R. (2009). A bias correction for the minimum error rate in cross-validation. Annals of Applied Statistics, 3(2), 822-829. https://doi.org/10.1214/08-AOAS224", "Tsamardinos, I., Greasidou, E. y Borboudakis, G. (2018). Bootstrapping the out-of-sample predictions for efficient and accurate
cross-validation. Machine Learning. https://doi.org/10.1007/s10994-018-5714-4", "Hansen, P. R. (2005). A test for superior predictive ability. Journal of Business and Economic Statistics, 23(4), 365-380.", "Efron, B. y Morris, C. (1975). Data analysis using Stein's estimator and its generalizations. Journal of the
American Statistical Association, 70(350), 311-319.", "Battese, G. E., Harter, R. M. y Fuller, W. A. (1988). An error-components model for prediction of county crop areas using survey and satellite data. Journal of the American Statistical Association, 83(401), 28-36. https://doi.org/10.1080/01621459.1988.10478561",
"Holm, S. (1979). A simple sequentially rejective multiple test procedure. Scandinavian Journal of Statistics, 6(2), 65-70. https://doi.org/10.2307/4615733", "Wang, H. y Heitjan, D. F. (2008). Modeling heaping in self-reported cigarette counts. Statistics in Medicine, 27(19), 3789-3804.", "Lobell, D. B. et al. (2020).
Eyes in the sky, boots on the ground: assessing satellite and ground-based approaches to crop yield measurement and analysis. American Journal of Agricultural Economics. https://doi.org/10.1093/ajae/aaz051", "Gourlay, S., Kilic, T. y Lobell, D. B. (2019). A new spin on an old debate. Journal of Development Economics.
https://doi.org/10.1016/j.jdeveco.2019.102376", "Desiere, S. y Jolliffe, D. (2018). Land productivity and plot size: Is measurement error driving the inverse relationship? Journal of Development Economics, 130, 84-98.", "Abay, K. A., Tadesse, G., Barrett, C. B. y Bernard, T. (2019). Correlated non-classical measurement
errors, 'second best' policy inference, and the inverse size-productivity relationship in agriculture. Journal of Development Economics, 139, 171-184.", "Cheng, X., Cao, Y., Li, X., An, B. y Feng, L. (2023). Weakly supervised regression with interval targets. ICML 2023, PMLR 202, 5428-5448.
https://proceedings.mlr.press/v202/cheng23a.html", "Barnwal, A., Cho, H. y Hocking, T. (2022). Survival regression with accelerated failure time model in XGBoost. Journal of Computational and Graphical Statistics, 31(4), 1292-1302.", "Ra Ximhai (2015), artículo sobre modelado de cebada con AquaCrop en Calpulalpan,
Tlaxcala (resumen). https://doaj.org/article/788f53d631594409addaca7f48af033d", "(prensa) Mexico Business News (2024), noticia sobre la sequía en el Altiplano y el rendimiento de cebada. https://mexicobusiness.news/agribusiness/news/climate-change-threatens-barley-supply", "Dietterich, T. G. (1998). Approximate
statistical tests for comparing supervised classification learning algorithms. Neural Computation, 10, 1895-1923. https://doi.org/10.1162/089976698300017197", "Nadeau, C. y Bengio, Y. (2003). Inference for the generalization error. Machine Learning, 52, 239-281. https://doi.org/10.1023/A:1024068626366", "Diebold, F. X.
y Mariano, R. S. (1995). Comparing predictive accuracy. Journal of Business & Economic Statistics. https://doi.org/10.1080/07350015.1995.10524599", "Steegen, S. et al. (2016). Increasing transparency through a multiverse analysis. Perspectives on Psychological Science. https://doi.org/10.1177/1745691616658637",
"Romano, Y., Patterson, E. y Candès, E. (2019). Conformalized quantile regression. NeurIPS 2019; arXiv:1905.03222. https://doi.org/10.48550/arxiv.1905.03222", "Fay, R. E. y Herriot, R. A. (1979). Estimates of income for small places: an application of James-Stein procedures to census data. Journal of the American
Statistical Association, 74(366). https://doi.org/10.2307/2286322", "Burke, M. y Lobell, D. B. (2017). Satellite-based assessment of yield variation and its determinants in smallholder African systems. PNAS, 114(9). https://doi.org/10.1073/pnas.1616919114", "Heitjan, D. F. y Rubin, D. B. (1991). Ignorability and coarse
data. Annals of Statistics. https://doi.org/10.1214/aos/1176348396", "Dwork, C. et al. (2015). Preserving statistical validity in adaptive data analysis. STOC 2015; arXiv:1411.2664. https://doi.org/10.48550/arxiv.1411.2664", "Breiman, L. (1996). Stacked regressions. Machine Learning.
https://doi.org/10.1007/bf00117832", "Cawley, G. C. y Talbot, N. L. C. (2010). On over-fitting in model selection and subsequent selection bias in performance evaluation. JMLR, 11, 2079-2107.", "Varma, S. y Simon, R. (2006). Bias in error estimation when using cross-validation for model selection. BMC Bioinformatics,
7, 91. https://doi.org/10.1186/1471-2105-7-91", "Hollmann, N. et al. (2025). Accurate predictions on small data with a tabular foundation model. Nature. https://doi.org/10.1038/s41586-024-08328-6", "Erickson, N. et al. (2025). TabArena: A living benchmark for machine learning on tabular data. arXiv:2506.16791.",
"Crawford, F. W., Weiss, R. E., Suchard, M. A. (2015). Sex, lies and self-reported counts: Bayesian mixture models for heaping in longitudinal count data via birth-death processes. Annals of Applied Statistics 9(2):572–596. https://doi.org/10.1214/15-aoas809 (metadatos de Crossref)", "Sheppard, W. F. (1897/1898). On
the calculation of the most probable
values of frequency-constants, for data arranged according to equidistant divisions of a scale. Proceedings of the London Mathematical Society, 29, desde p. 353. https://doi.org/10.1112/plms/s1-29.1.353", "Bates, S., Hastie, T. y Tibshirani, R. (2024). Cross-validation: what does it estimate and how well does it do it?
JASA. https://doi.org/10.1080/01621459.2023.2197686"]
---

## Resumen

Este documento resume cómo debe validarse el modelo de rendimiento de cebada maltera de temporal del Reto AgroCebada (138 parcelas con rendimiento, nueve municipios muy desbalanceados, RMSE en t/ha) y qué fugas de información y sesgos de selección detectaron nuestras auditorías. Con n = 138, el error estándar del RMSE
ronda 0.03 t/ha, de modo que mejoras de 0.003 t/ha no son distinguibles del ruido. Las auditorías encontraron riesgos concretos (hipótesis elegidas con todas las etiquetas, búsquedas amplias de candidatos, ajustes sobre las mismas particiones) y cifras que los cuantifican. Las referencias externas se verificaron en
línea el 18 de octubre de 2026; las marcadas como «no verificado» no pudieron confirmarse en esa revisión.

## Validación cruzada k-fold: qué mide y qué no

(Literatura) La validación cruzada k-fold divide las observaciones en k bloques; cada bloque se predice con un modelo ajustado con los demás, y el error se promedia. Estima el error de predicción para datos parecidos a los de entrenamiento, bajo el supuesto de que las observaciones son intercambiables. Cuando hay
agrupamiento (parcelas de un mismo productor, localidad o bloque espacial), ese supuesto falla y el k-fold aleatorio tiende a subestimar el error (Roberts et al., 2017; verificado, DOI 10.1111/ecog.02881).

(Nuestros experimentos) Evaluamos modelos con particiones aleatorias y con particiones por municipio. Un RMSE obtenido con k-fold aleatorio no es comparable con uno obtenido con particiones por municipio, porque responden a preguntas distintas: interpolar dentro de municipios frente a estimar municipios no observados.

(Recomendación) Reportar siempre el tipo de partición junto con el RMSE, el número de pliegues y el número de repeticiones. Sin esa información, una cifra de RMSE no indica qué tipo de generalización se midió. El documento de validación del proyecto propone un punto de partida de cuatro o cinco grupos externos,
ajustable a la estructura real de los datos, y advierte que crear muchos grupos casi idénticos no aporta precisión.

Fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md; Roberts et al. (2017), Ecography 40(8), 913-929, https://doi.org/10.1111/ecog.02881

## Unidad independiente y dependencia entre parcelas

(Literatura y proyecto) La unidad de evaluación debe ser la parcela o la parcela-campaña, según los archivos oficiales. Si una parcela se observa en veinte fechas, no hay veinte rendimientos independientes; si contiene cien píxeles, asignarle el mismo rendimiento a cada píxel no multiplica la información. Todas las
observaciones ligadas a una misma unidad deben quedar en la misma partición.

La dependencia puede ser más amplia: parcelas del mismo productor, localidad o sistema de riego comparten lluvia, suelo y manejo. Por eso 138 filas etiquetadas pueden aportar menos información independiente que 138 unidades aisladas. Roberts y colaboradores (2017) muestran que la validación debe reflejar la estructura
espacial, temporal o jerárquica de los datos, y que el diseño adecuado depende del uso previsto (verificado).

(Ejemplo conceptual) Si dos parcelas contiguas comparten lluvia y suelo, entrenar con una y evaluar con la otra mide un desempeño que incluye información contextual compartida. Eso puede ser pertinente para interpolar dentro de una zona, pero no demuestra que el modelo estime una región sin observaciones.

Fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md; Roberts et al. (2017), https://doi.org/10.1111/ecog.02881

## Validación cruzada repetida y error estándar del RMSE

(Nuestros experimentos y cálculo propio) Con n = 138 y una desviación de error cercana a 0.474 t/ha, el error estándar de un RMSE de una sola partición se aproxima por σ/√(2n): 0.474/√276 ≈ 0.029 t/ha. Es una aproximación heurística del proyecto, no una fórmula estándar del RMSE; el error estándar real depende del
esquema de partición. Con esa aproximación, un RMSE de 0.46 o de 0.47 puede deberse al azar de la partición.

Para reducir la variabilidad de la estimación se recomiendan validaciones repetidas (por ejemplo, 5 pliegues repetidos 20 o 50 veces con semillas distintas), comparando modelos con diferencias pareadas por pliegue o por parcela, y reportando la media de la diferencia con un intervalo bootstrap. Aun así, las
repeticiones no eliminan el sesgo de selección si los mismos pliegues se usan para elegir entre candidatos.

(Regla práctica del proyecto) Las notas de métodos para muestras pequeñas proponen tratar como indistinguibles de cero las mejoras menores de 0.01 a 0.02 t/ha, salvo que el error estándar pareado sea claramente menor. Esta regla es una recomendación, no un resultado experimental.

Fuente: validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md;
validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md

## Validación espacial por bloques y por municipio

(Literatura) Ploton y colaboradores (2020) mostraron que la validación no espacial sobreestima la capacidad predictiva de un mapa de biomasa basado en bosque aleatorio (verificado, DOI 10.1038/s41467-020-18321-y). Su propuesta de validación espacial (verificada en el texto, PMC7486894) tiene dos variantes: un K-fold
espacial en 44 conglomerados geográficos con un umbral de 150 km, algo mayor que el rango de autocorrelación de la biomasa aérea, y un leave-one-out con buffers de radio creciente (de 0 a 150 km). Con validación aleatoria de 10 pliegues, R² = 0.53 y RMSPE = 56.5 Mg/ha (19 %); con K-fold espacial de 44 pliegues, R² =
0.14 y RMSPE = 77.5 Mg/ha (26 %). Los autores concluyen que los conglomerados fueron demasiado pequeños para sacar todos los píxeles de prueba del rango de autocorrelación. Wadoux y colaboradores (2021) sostienen que la validación espacial no tiene un fundamento teórico claro para estimar la exactitud de un mapa, y
proponen muestreo probabilístico con inferencia basada en el diseño (verificado, DOI 10.1016/j.ecolmodel.2021.109692). La afirmación de que la validación espacial sería «más sesgada» que la estándar no aparece confirmada en la fuente consultada. Meyer y Pebesma (2022) resumen el debate sin zanjarlo (verificado, DOI
10.1038/s41467-022-29838-9).

(Nuestros experimentos, distribución de entrenamiento) Chignahuapan (Puebla) aporta 71 parcelas; Calpulalpan (Tlaxcala) 30; Singuilucan 16; Almoloya 10; Cuautepec de Hinojosa 5; Emiliano Zapata 3; y Apan, Tepeapulco y Nanacamilpa una cada una. Un bloqueo por municipio deja sin entrenamiento a los municipios de una sola
parcela, y las estimaciones de los municipios pequeños son ruidosas.

(Recomendación) Reportar dos particiones: aleatoria dentro de municipios (si el despliegue cae en municipios ya observados) y por municipio o bloque espacial (si se pregunta por municipios nuevos). Declarar cuál es la cifra principal antes de comparar. La partición por bloques debe justificar su tamaño, porque con 138
parcelas los bloques pequeños tienen muy pocas observaciones.

Fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md; reto_y_datos/HECHOS_CALCULADOS_dataset_oficial.md; Ploton et al. (2020); Wadoux et al. (2021); Meyer y Pebesma (2022)

## Fuga de información: tipos y cómo los detectamos

(Literatura) Kaufman y colaboradores (2012) definen la fuga como la situación en que el modelo tiene acceso a información relacionada con el objetivo que no tendría en el momento real de predecir (verificado, DOI 10.1145/2382577.2382579). Kapoor y Narayanan (2023) clasifican la fuga en ocho tipos (verificado); la
definición literal que usan las notas del corpus, con sus formas comunes (preprocesar con estadísticas de todo el conjunto, seleccionar variables con todos los datos, apilar predicciones mal generadas y ajustar hiperparámetros sobre la misma partición de evaluación), no se leyó en la fuente primaria y debe tomarse como
lista de las notas.

(Nuestras auditorías) Una auditoría de fugas revisó los candidatos de la ronda de iteración y encontró que, en las propuestas revisadas, no se ajustaba ninguna segunda etapa con predicciones fuera de pliegue de parcelas de entrenamiento, y que las construcciones de variables sin etiquetas (por ejemplo, centrado sobre
las 100 parcelas de Chignahuapan con sus rasgos de geometría, o medianas de cohorte) eran legítimas porque no usan rendimientos. Sí detectó fugas reales de otro tipo, descritas en los fragmentos siguientes.

(Regla) Las características pueden construirse con todas las parcelas porque no requieren etiquetas; los coeficientes, los umbrales y las selecciones deben aprenderse solo con las etiquetas del pliegue de entrenamiento.

Fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_feasibility.md; Kaufman et al. (2012), https://doi.org/10.1145/2382577.2382579

## Fuga por apilamiento con predicciones fuera de pliegue

(Literatura) Apilar (stacking) requiere predicciones de nivel uno generadas por validación cruzada, de modo que ninguna predicción use la etiqueta de la parcela que predice. Breiman (1996, Machine Learning, DOI 10.1007/bf00117832) es la referencia original de stacking; la referencia está verificada, pero la afirmación
de que los pesos no negativos son esenciales no se leyó en el texto (no verificado). Para evaluar el conjunto apilado de forma honesta hace falta una capa adicional de validación cruzada anidada (Varma y Simon, 2006, BMC Bioinformatics 7, 91, referencia verificada; Super Learner: van der Laan, Polley y Hubbard (2007),
Statistical Applications in Genetics and Molecular Biology 6(1), DOI 10.2202/1544-6115.1309, verificado en Crossref).

(Nuestros experimentos) Medimos el margen para apilar y ponderar los miembros del conjunto. La diversidad (ambigüedad) representaba cerca de 3.7 % del error cuadrático medio. Concluimos que el margen para apilar era de unas milésimas, y que una nueva combinación exige miembros con errores poco correlacionados.

(Regla de la auditoría) No ajustar una segunda etapa sobre predicciones de entrenamiento fuera de pliegue. Un miembro nuevo entra con peso fijo declarado de antemano; si los pesos se aprenden, deben aprenderse en modo anidado y encogerse hacia pesos iguales.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/iterate_20261017__research__critique_leakage.md

## Selección de variables y transformaciones fuera del pliegue

(Literatura) Seleccionar variables con la correlación con la etiqueta de todo el conjunto y después validar con las mismas particiones produce un error optimista que puede ser tan grande como la diferencia entre algoritmos (Cawley y Talbot, 2010, JMLR 11(70), 2079-2107, referencia verificada; la magnitud del sesgo no
se leyó en el texto). La selección debe ocurrir dentro de cada pliegue de entrenamiento.

(Nuestros experimentos) Una de las hipótesis evaluadas, un coeficiente de pendiente para el área de la parcela dentro de Chignahuapan, se eligió después de que una descomposición de los residuos (con todas las 138 etiquetas) sugiriera el efecto. La restricción a Chignahuapan también se eligió por la ausencia de efecto
en otros municipios observada en esos mismos datos. La auditoría concluyó que el candidato no era válido como prueba confirmatoria porque su descubrimiento y su evaluación compartían datos.

(Recomendación) Cuando una variable o una restricción geográfica se descubre con etiquetas, la evaluación posterior debe ser anidada: el descubrimiento se repite dentro de cada pliegue, o se usa un conjunto de datos que no participó en el descubrimiento.

Fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_expected_value.md

## Ajustes de hiperparámetros sobre las mismas divisiones

(Literatura) El mínimo de un error de validación cruzada usado para elegir un modelo está sesgado a la baja (Tibshirani y Tibshirani, 2009, verificado, DOI 10.1214/08-AOAS224; Varma y Simon, 2006, referencia verificada, DOI 10.1186/1471-2105-7-91). Un procedimiento que elige hiperparámetros y reporta el error de los
mismos pliegues sobreestima el desempeño, y el sesgo crece con el número de configuraciones probadas. Bates, Hastie y Tibshirani (2024, JASA; título verificado) estudian qué estima la validación cruzada; el resumen indica que los intervalos de validación cruzada ingenuos pueden tener una cobertura «muy por debajo del
nivel deseado» (verificado en arXiv 2104.00673 y DOI 10.1080/01621459.2023.2197686).

(Nuestros experimentos) Varias propuestas se evaluaron con las mismas 20 particiones. La auditoría de la ronda contabilizó las familias de hipótesis, incluidas aquellas que aparecían como "nuevas" pero compartían datos con pruebas previas. Una lección operativa fue registrar cada consulta a las etiquetas antes de
puntuar cualquier candidato nuevo.

(Regla) Declarar en un libro de decisiones cada consulta de etiquetas, el tipo de consulta (diagnóstico, prueba o ajuste), las particiones usadas y el número de candidatos. Sin ese libro, el sesgo de selección no puede corregirse.

Fuente: validacion/iterate_20261017__research__critique_expected_value.md; validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__B3_small_n_methods.md

## Maldición del ganador: probar muchos candidatos

(Literatura) Cuando se prueban muchos candidatos y se reporta el mejor, la ganancia observada contiene una componente de azar que no se repetirá. White (2000) propuso una prueba de realidad (reality check) que compara el mejor candidato contra la hipótesis de que ninguno es mejor (citada de forma indirecta en Hansen,
2005; no leída en su fuente primaria). Hansen (2005) propone la prueba de capacidad predictiva superior (SPA), que modifica la de White normalizando las diferencias medias por una estimación de su desviación estándar, lo que da más potencia (verificado en descripción secundaria).

(Nuestros experimentos) Con 37 candidatos, la corrección por validación cruzada con bootstrap (BBC-CV, Tsamardinos et al., 2018) estimó un efecto de selección de +0.0028 t/ha (desarrollo) y +0.0027 t/ha (confirmación) frente a la referencia C2; es decir, el mejor candidato resultó peor fuera de bolsa. La probabilidad
de que el seleccionado superara a C2 fue de 0.38. El candidato más frecuentemente seleccionado en las remuestras lo fue solo entre 20 % y 25 % de las veces. La prueba de realidad sobre los 31 candidatos competitivos dio p = 0.63.

(Nota de nombre) El artículo de Tsamardinos, Greasidou y Borboudakis (2018, Machine Learning, DOI 10.1007/s10994-018-5714-4) se titula «Bootstrapping the out-of-sample predictions for efficient and accurate cross-validation». Su versión publicada llama BBCD-CV a la variante con descarte de candidatos; «BBC-CV» es el
nombre usado en las notas del corpus.

(Cifra clave) Una comparación única y preespecificada frente a la referencia tuvo −0.0025 t/ha con error estándar 0.0030. El efecto de selección tenía una desviación estándar cercana a 0.01 t/ha. Con esos números, la ganancia de selección no es distinguible de cero.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; Tsamardinos et al. (2018), https://doi.org/10.1007/s10994-018-5714-4; Hansen (2005), Journal of Business and Economic Statistics, 23(4), 365-380

## Caso de la pendiente de área: la hipótesis se eligió con todas las etiquetas

(Nuestros experimentos, diagnóstico) Dentro de Chignahuapan, la correlación entre el residuo del modelo de referencia y el logaritmo del área de la parcela fue −0.225 en la primera exploración. Esa exploración usó las 21 particiones, incluidas las 10 de confirmación. La hipótesis se propuso como puntuación
preregistrada solo después de esa exploración, y su evaluación posterior en particiones nuevas no era independiente de la elección.

(Cálculo de la auditoría) Un análisis de selección por permutación de residuos dentro de municipio dio, para la mejor geometría descriptiva, una ganancia aparente con media 0.0055, mediana 0.0042 y percentil 95 de 0.0163 t/ha. El umbral de aceptación del candidato era 0.0064, entre la mediana y el percentil 95 del
nulo. El precursor de esa hipótesis tuvo p = 0.59 en su propia prueba de selección.

(Advertencia) La auditoría señaló que la regla de referencia usó un método de pendiente residual con fuga, por lo que solo es indicativa para la versión dentro de los miembros del conjunto; todavía no existe un nulo de selección para esa versión.

Fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_feasibility.md

## Caso de la forma de la curva: el ganador de muchas correlaciones

(Nuestros experimentos) Un parámetro de la curva de reflectancia de Sentinel-2 (la pendiente de la línea base previa a la temporada) se seleccionó entre 357 filas de un tamizaje por bloques; el mejor tuvo un q de Benjamini-Hochberg de 0.095. Entre 5,096 correlaciones univariadas dentro de municipio, la misma variable
tuvo ρ = +0.318 con q = 0.185, es decir, no significativa tras corrección. La auditoría la calificó como la señal satelital más fuerte del proyecto, lo que es justamente el síntoma de una búsqueda muy amplia.

(Cálculo) Bajo la hipótesis nula, un umbral z = 1.4, usado como criterio para esta familia, aceptaría alrededor de 8 % de los candidatos nulos; un z = 1.6 aceptaría 5.5 %. El umbral correcto para una búsqueda de miles de correlaciones no se ha calculado todavía y, según la auditoría, está lejos de 1.4.

(Recomendación) Tratar la búsqueda completa como familia: anotar todas las filas tamizadas, aplicar corrección por comparaciones múltiples y, si la variable se conserva, validarla con una selección anidada dentro de los pliegues.

Fuente: validacion/iterate_20261017__research__critique_expected_value.md; validacion/iterate_20261017__research__critique_leakage.md

## Controles de robustez: exclusiones que no deben decidir

(Nuestros experimentos) La regla de robustez de un candidato excluía los dos casos con mayor error cuadrático. Al revisar la ganancia por parcela de una pendiente de área, la suma del cambio en error cuadrático fue −0.425 con 31 parcelas mejoradas y 40 empeoradas. Excluyendo los dos casos de mayor error, la suma seguía
en −0.310 (ganancia), porque uno de los dos casos sí empeoraba. Excluyendo solo el mayor contribuyente, la suma pasó a +0.093 (pérdida). Excluyendo los tres mayores casos mejorados, la suma fue +0.933.

(Lección) La prueba de robustez debe emparejarse con el tipo de candidato. Una regla que favorece candidatos "de área" puede pasar aunque el efecto dependa de unos pocos casos. Una exclusión que elimine a los que más ayudan muestra la fragilidad.

(Recomendación) Usar como controles: retirar solo el mayor contribuyente, retirar los tres casos que más ayudan y exigir que la ganancia venga de al menos dos parcelas con fallas.

Fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_feasibility.md

## Reutilizar el conjunto de confirmación erosiona su valor

(Literatura) Un conjunto de prueba reutilizado para decidir entre candidatos deja de ser independiente. Dwork y colaboradores (2015) proponen holdouts reutilizables con garantías (referencia verificada, arXiv 1411.2664; el contenido técnico no se leyó); una práctica sencilla es aceptar un nuevo mejor modelo solo si
supera un umbral.

(Nuestros experimentos) Los pliegues de confirmación se usaron para diagnósticos y para evaluar tres hipótesis. Además, las ganancias de desarrollo y confirmación se correlacionaron 1.000 para diferencias fijas por parcela, y difirieron como máximo 0.0015 en pares de modelos reales. Por eso una comparación "mismo signo
y al menos la mitad de la ganancia" resulta casi automática para cualquier candidato que ya pasó desarrollo. Las auditorías advierten que una réplica sobre la misma partición de 138 parcelas aporta poca evidencia independiente y sirve sobre todo contra el ajuste a una partición concreta.

(Recomendación) Mantener un conjunto de control que nunca se use para decidir, y registrar cada vez que se mira.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/iterate_20261017__research__critique_expected_value.md; validacion/iterate_20261017__research__critique_leakage.md

## Pruebas de permutación y prueba de realidad

(Literatura) Una prueba de permutación construye la distribución nula rompiendo la relación entre predictores y etiqueta, y compara la ganancia observada con esa distribución. Para datos agrupados, la permutación debe respetar la estructura: permutar residuos dentro de municipio, en lugar de entre todas las parcelas.

(Nuestros experimentos) En la auditoría de selección, el nulo por permutación dentro de municipio sirvió como referencia para juzgar el umbral del candidato de área (véase el fragmento correspondiente). La prueba de realidad sobre candidatos competitivos dio p = 0.63: en la mayoría de los nulos, la selección pura
produce una ganancia igual o mayor a la observada.

(Recomendación) Para cada candidato nuevo, generar el nulo con las mismas particiones, la misma selección y la misma permutación por bloque, y registrar la proporción de nulos que superan la ganancia real. Si se prueban varias hipótesis, corregir el conjunto con el procedimiento de Holm (1979).

Fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/iterate_20261017__research__critique_feasibility.md

## Bootstrap por parcela y por bloque espacial

(Literatura) El bootstrap para diferencias de desempeño debe remuestrear unidades independientes: parcelas o bloques espaciales, no píxeles ni fechas repetidas. Con solo tres estados o nueve municipios, remuestrear municipios no produce una inferencia sólida porque hay muy pocas realizaciones.

(Nuestros experimentos) La BBC-CV con 4,000 remuestreos por parcela dio +0.0028 (desarrollo) y +0.0027 (confirmación) t/ha; con bloques espaciales de 25 grupos dio +0.0027 en ambos conjuntos. Las probabilidades de que el seleccionado superara a la referencia fuera de bolsa fueron 0.38 y 0.35. Ambos resultados
coinciden, lo que aumenta la confianza en que el efecto de selección es pequeño.

(Advertencia) Un intervalo bootstrap sobre un RMSE de 138 parcelas puede subcubrir cuando hay dependencia no modelada. Presentarlo junto con la distribución por municipio y con la comparación contra una línea base.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/literature_review__report__sections__06_validacion.typ.txt

## Corrección de Holm y familias de pruebas

(Literatura) Holm (1979) es un procedimiento secuencial que controla la tasa de error familiar (family-wise error rate): ordena los valores p y compara cada uno con α/(m − i + 1). Verificado en línea: artículo en Scandinavian Journal of Statistics, 6(2), 65-70, DOI 10.2307/4615733. Es más potente que la corrección de
Bonferroni.

(Nuestros experimentos) La auditoría contó tres pruebas de la familia de "fenómenos de encharcamiento": el encharcamiento de junio–julio (una prueba previa), la caída de NDVI en julio y la profundidad de depresiones. La caída de NDVI en julio fue la mejor de ocho pruebas declaradas, con p = 0.054 (n = 67 en
Chignahuapan). Tratada como hipótesis nueva, una profundidad de depresión con z = 1.25 parecía independiente, pero su condicionamiento sobre esa variable la hacía parte de la misma familia.

(Recomendación) Incluir cada prueba de la familia en el conjunto de Holm, y reportar el número de pruebas ajustado con la misma familia que se usó para elegir.

Fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_expected_value.md; Holm (1979), https://doi.org/10.2307/4615733

## Preregistro de signos y criterios de aceptación

(Literatura) El preregistro de criterios (hipótesis, variable, signo, umbral y comparación) reduce la flexibilidad en el análisis. Sin preregistro, cualquier dirección del efecto puede justificarse después de ver los datos.

(Nuestros experimentos) Varias compuertas de aceptación de la ronda no fijaban el signo esperado del coeficiente. Un criterio que solo exigía que el coeficiente "conserve su signo" en 90 % de los pliegues aceptaría cualquiera de los dos signos. En un caso, el gate de la profundidad de depresión exigía una relación cuyo
signo predecía la dirección contraria al mecanismo hidrológico, y el análisis B2 había encontrado que caídas de NDVI en julio se asociaban con rendimientos más altos (r = −0.236).

(Recomendación) Fijar antes de puntuar el signo esperado. Un efecto con signo contrario al mecanismo debe contar como rechazo, no como evidencia. Escribir la decisión en el libro antes de cualquier mirada a las etiquetas.

Fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_feasibility.md

## Compuertas sin etiquetas: descartar antes de mirar el rendimiento

(Nuestros experimentos) Algunas compuertas pudieron evaluarse con datos sin etiquetas, lo que evitó consultas innecesarias. Dos casos ilustran el procedimiento. (a) Para la profundidad de depresión, el modelo de elevación GLO-30 a 30 m dio, en 84 parcelas no reiniciadas de Chignahuapan, cero parcelas con profundidad
mayor que 0.05 m (máximo 0.018 m); la compuerta exigía al menos 10. (b) Para un componente de retardo de cosecha con Sentinel-1, el cociente entre la varianza del cambio en VH durante la tormenta y la del par previo fue 0.91; la compuerta exigía 1.5.

(Regla) Antes de descargar datos o consultar etiquetas, calcular la compuerta con datos disponibles y estimar la ganancia que el candidato podría producir. Si la ganancia máxima plausible es menor que la resolución del criterio, descartar.

(Advertencia) La auditoría advirtió que redefinir la variable hasta que pase la compuerta es "compra de compuertas" y tiene el mismo problema que el ajuste sobre etiquetas.

Fuente: validacion/iterate_20261017__research__critique_feasibility.md; validacion/iterate_20261017__research__critique_expected_value.md

## Muestras pequeñas: panorama del problema

(Nuestros experimentos y hechos) El conjunto de entrenamiento tiene 138 parcelas con rendimiento, media 3.955 t/ha, mediana 4.34, desviación estándar 0.851, mínimo 2.00 y máximo 5.59. La distribución por municipio es extremadamente desigual (véase el fragmento de distribución). Dentro de Chignahuapan, la desviación
estándar es 0.58 t/ha; dentro de Calpulalpan, 0.37; la desviación estándar dentro de municipio global, que usan las auditorías como referencia, es 0.475 t/ha.

(Implicación) Con tan pocas observaciones, un error de 0.47 t/ha equivale casi exactamente a la dispersión dentro del municipio, de modo que un modelo que solo predice la media municipal obtiene un RMSE parecido. Cualquier mejora debe demostrarse frente a esa línea base, no frente a una media global.

Fuente: reto_y_datos/HECHOS_CALCULADOS_dataset_oficial.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md

## Contracción empírica bayesiana y modelos jerárquicos

(Literatura) Los estimadores de James-Stein y empirical Bayes encogen las medias de grupo hacia la media global. Efron y Morris (1975) reportan, en su resumen, que el error cuadrático medio de estas reglas es menor que la mitad del de la media muestral en sus tres ejemplos (verificado; la cifra exacta por ejemplo no se
consultó). Los modelos de área pequeña, como el de Battese, Harter y Fuller (1988; verificado), aplican la misma idea para estimar medias de área, no predicciones de parcelas individuales. El modelo de Fay y Herriot (1979, JASA 74(366), DOI 10.2307/2286322) es el análogo de área con covariables (referencia verificada);
se describe en el apartado de estimación en áreas pequeñas.

(Cálculo propio) El factor de contracción es B = σ²/(σ² + n·τ²), con σ = 0.475 y τ ≈ 0.75. Para Chignahuapan (71 parcelas) B ≈ 0.006: el prior es irrelevante. Para Cuautepec (5) B ≈ 0.08; para una sola parcela (Nanacamilpa) B ≈ 0.3.

(Resultado) Con los grupos de este conjunto, la contracción recupera como máximo unas 0.01 t/ha de RMSE, casi todo en municipios de diez o menos parcelas. Es una mejora pequeña pero honesta, y debe reportarse como tal.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; Efron y Morris (1975), JASA 70(350), 311-319; Battese, Harter y Fuller (1988), JASA 83(401), 28-36,
https://doi.org/10.1080/01621459.1988.10478561

## SIAP como prior municipal: se descartó

(Nuestros experimentos) Se probó usar los rendimientos municipales del SIAP como prior de la media de cada municipio. La correlación entre el rendimiento medio de las parcelas y la media SIAP 2010–2024 fue −0.22 entre los nueve municipios; con el valor SIAP 2025, −0.49. Ponderando por número de parcelas, las
correlaciones fueron −0.05 y −0.21. Las parcelas de FIRA son una población seleccionada con insumos más altos, y su ranking no sigue las estadísticas municipales.

(Resultado) La ganancia en validación cruzada se concentró en dos municipios de una sola parcela y el coeficiente resultó negativo, sin sentido agronómico. Ponderada a la mezcla de municipios del conjunto oculto, la ganancia fue de 0.0004 o 0.0001 t/ha. La decisión de la auditoría fue no adoptarlo.

(Lección) Un prior externo solo ayuda si la relación con la variable objetivo tiene el signo esperado y sobrevive a la validación por grupo. Un prior con signo invertido es una señal de que los datos no son comparables.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md

## Ruido de etiquetas: qué parte del error no es modelable

(Cálculo propio y literatura) Si la etiqueta observada es el rendimiento verdadero más un error independiente de varianza σe², el MSE observado es el MSE verdadero más σe². Por eso, el RMSE contra etiquetas ruidosas no puede bajar de σe, aunque el modelo sea perfecto. Además, la confiabilidad es λ = 1 − (σe² +
g²/12)/0.2256, donde 0.2256 es la varianza dentro de municipio y g²/12 el ruido de redondeo.

(Escenarios) Con σe = 0.10 t/ha, λ ≈ 0.86; con σe = 0.20, λ ≈ 0.73; con σe = 0.30, λ ≈ 0.51. Bajo esos escenarios, el R² verdadero dentro de municipio sería de 0.07 a 0.12. Los resultados de Lobell y colaboradores (2020) sobre cómo el ruido en las etiquetas de entrenamiento y de evaluación afecta la eficiencia y el R²
aparente no se confirmaron: el artículo de Lobell y colaboradores (2020) es de acceso cerrado y no se pudo leer (sin evidencia, no verificado); la atribución se retira hasta confirmarla.

(Advertencia) Estos escenarios son supuestos. No existe en el corpus una medición del error de los reportes de rendimiento para estas parcelas.

Fuente: validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md

## Redondeo de rendimientos: h²/12 y frecuencias observadas

(Cálculo propio) Redondear a una rejilla de ancho h añade un error con varianza aproximada h²/12. Para h = 0.5 t/ha, la varianza es 0.0208 (t/ha)² y la desviación estándar, 0.144 t/ha.

(Nuestros experimentos, datos oficiales) Los valores más repetidos de rendimiento son 4.5 (27 parcelas), 3.0 (20), 3.5 (14), 2.5 (11), 4.6 (9), 4.4 (8), 4.7 (7) y 4.1 (5). Calpulalpan usa solo 2.5, 3.0 y 3.5, con 8, 14 y 8 parcelas.

(Verificado con el archivo oficial de etiquetas) 45 de 138 etiquetas (32.6 %) caen exactamente en la rejilla de 0.5 t/ha: 19 en 3.0, 13 en 3.5, 11 en 2.5 y 2 en otros valores de la rejilla. Los valores próximos a 4.5 (4.49, 4.52, 4.55…) no son exactos; contarlos como 4.5 tras redondear a 0.1 t/ha es un error.

Fuente: reto_y_datos/HECHOS_CALCULADOS_dataset_oficial.md; validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md

## Corrección de Sheppard y verosimilitud por intervalo: resultados negativos

(Literatura) La corrección de Sheppard indica que la varianza de datos agrupados se infla en aproximadamente h²/12 cuando h es pequeño frente a la dispersión, y que el sesgo de la media es despreciable (la fórmula de −h²/12 se confirmó en fuentes secundarias; el año de Sheppard se resolvió: Crossref da 1897 para el
artículo del volumen 29 de Proc. London Math. Soc. (DOI 10.1112/plms/s1-29.1.353), y ProofWiki cita 1898 por el volumen; conviene citar el DOI junto con el año). Heitjan y Rubin (1991), «Ignorability and Coarse Data», Annals of Statistics, DOI 10.1214/aos/1176348396, referencia verificada; el contenido técnico no se
leyó. Cheng y colaboradores (ICML 2023) y XGBoost con intervalos (Barnwal et al., 2022) ofrecen formas de entrenar con etiquetas intervalo (verificados).

La probabilidad marginal dentro de cada pliegue no eligió ruido adicional en 105 de 105 pliegues. Conclusión: la ganancia es negligible.

(Cálculo) El sesgo de E[round(y)] frente a E[y] es menor que 10⁻⁵ t/ha; el redondeo no sesga la media, solo añade ruido, que ya está en el término gaussiano.

Fuente: validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md; Cheng et al. (2023), https://proceedings.mlr.press/v202/cheng23a.html; Barnwal et al. (2022), JCGS 31(4), 1292-1302

## Redondear predicciones a la rejilla: cuándo ayuda y la trampa de la validación

(Cálculo propio) Bajo error cuadrático el óptimo es la media condicional E[y|x]. Redondear la predicción a la rejilla de 0.5 solo ayuda si la desviación predictiva es menor que alrededor de h/8 ≈ 0.065 t/ha. Con σ = 0.474, redondear empeora el RMSE: 0.495 sin redondear frente a 0.516 redondeado.

Esa ganancia no es una evidencia válida: 3.0 es la media y la moda del municipio con datos completos, de modo que el nivel del conjunto completo, que incluye las etiquetas del pliegue de prueba, entra en la validación. Además, la predicción de Calpulalpan casi no varía (desviación 0.039).

(Regla) Reportar cualquier ajuste de rejilla como decisión de métrica (MAE) y no como mejora de RMSE validada.

Fuente: validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/iterate_20261017__research__critique_leakage.md

## Redondeo y procedencia: modelos de mezcla y reportes heaped

(Literatura) Heaping es la preferencia por valores redondos al reportar cantidades. Wang y Heitjan (2008), en un estudio sobre conteos de cigarros autorreportados, modelan la respuesta como una mezcla de reportes exactos y redondeados, con una clase latente de comportamiento de reporte (verificado, Statistics in
Medicine 27(19), 3789-3804). Wang y colaboradores (2012) extienden el modelo a un proceso de recuerdo y redondeo en dos etapas (sin evidencia: no localizado en OpenAlex en dos búsquedas), y Crawford y colaboradores (2015) señalan que el heaping es no ignorable cuando su probabilidad depende del valor verdadero (no
verificado: el candidato encontrado, «Sex, lies and self-reported counts», Annals of Applied Statistics, DOI 10.1214/15-aoas809, existe, pero la autoría se confirmó en Crossref (Crawford, Weiss y Suchard; Annals of Applied Statistics 9(2):572–596), pero el contenido no se leyó).

(Nuestros experimentos y análisis) Las etiquetas de Calpulalpan (solo 2.5, 3.0 y 3.5) sugieren estimaciones de recuerdo más que pesadas. Un modelo ordinal por grupo produciría la esperanza Σ p_k g_k y no la clase más probable; si las clases son casi uniformes, colapsa a la media municipal (≈3.0).

(Recomendación) Si se modela la mezcla, ajustar un componente de error mayor para reportes redondeados por municipio, sin usar snap. La procedencia de las etiquetas (dos formatos de polígono en la base) importa más que el redondeo mismo.

Fuente: validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md; Wang y Heitjan (2008), Statistics in Medicine 27(19), 3789-3804

## Errores de reporte de agricultores: sesgos no clásicos

(Literatura) En encuestas de pequeños productores, los reportes de rendimiento tienen errores no clásicos. En Uganda, Gourlay, Kilic y Lobell (2019), con un panel de dos rondas de hogares del este del país, encuentran que la relación inversa entre tamaño de parcela y productividad aparece con producción autorreportada
y se debilita con cortes de cosecha, y atribuyen el patrón a una sobreestimación persistente de la producción autorreportada frente a los cortes, sobre todo en la mitad inferior de la distribución de áreas (verificado en resumen y ficha del artículo). En Etiopía, Desiere y Jolliffe (2018) documentan un patrón de
sobrerreporte en parcelas pequeñas y subreporte en las grandes, con la relación inversa que desaparece al usar cortes de cosecha (verificado en resumen). Abay, Tadesse, Barrett y Bernard (2019) muestran que, con errores no clásicos correlacionados en área y producción, corregir solo uno de los dos puede aumentar el
sesgo (verificado en diapositivas del equipo de los autores).

(Aplicación) Lobell y colaboradores (2020) comparan rendimientos autorreportados, cortes de subparcela y cosecha de parcela completa, y encuentran brechas grandes entre métodos terrestres; sus cifras específicas (1,826, 728 y 676 kg/ha) no pudieron confirmarse: el artículo (DOI 10.1093/ajae/aaz051) es de acceso
cerrado, no hay PDF accesible y la fuente no pudo leerse (sin evidencia; no verificado en las cifras). Las parcelas de FIRA son comerciales y se venden por peso, pero no hay estudio en el corpus que mida el error de reporte de cebada comercial en México. Se recomienda probar si los residuos del modelo se correlacionan
con el área de la parcela: una correlación así indicaría un artefacto de reporte.

(Gap) No se encontró una medición del error de reporte para cebada maltera en México.

Fuente: validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md; validacion/iterate_20261017__research__B3_small_n_methods.md; Gourlay, Kilic y Lobell (2019), JDE, DOI 10.1016/j.jdeveco.2019.102376; Desiere y Jolliffe (2018), JDE 130, 84-98; Abay et al. (2019), JDE
139, 171-184; Lobell et al. (2020), AJAE, DOI 10.1093/ajae/aaz051

## Intervalos de predicción y calibración conformal

(Literatura) La regresión por cuantiles conformalizada (Romano, Patterson y Candès, 2019; referencia verificada, arXiv 1905.03222; las garantías se describen según el método y no se leyó el texto completo) ofrece cobertura marginal bajo intercambiabilidad. La calibración con residuos absolutos usa un cuantil finito de
los errores de un conjunto de calibración que no participó en el ajuste. Con pocos casos, el cuantil es discreto y el intervalo es ancho. Las garantías no cubren dependencia espacial ni cobertura condicional por parcela.

(Recomendación) Calibrar intervalos al 80 % o 90 % con validación por municipio (conformal estratificado), reportando cobertura observada y ancho medio, global y por grupo. Si la calibración reutiliza las etiquetas de ajuste, la garantía se pierde.

(Límite) Con 138 parcelas, la cobertura por municipio será ruidosa y no debe prometerse como exacta. El intervalo expresa incertidumbre de la parcela, no solo precisión de un promedio.

Fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/iterate_20261017__research__critique_expected_value.md

## Dominio de aplicabilidad y extrapolación

(Literatura, verificado) Meyer y Pebesma (2021) estiman un área de aplicabilidad (AOA) a partir de un índice de disimilitud: la distancia, en el espacio de predictores, entre cada punto nuevo y los datos de entrenamiento, comparada con la distribución de esas distancias en la validación. Estar dentro de la región
geográfica no garantiza estar dentro del dominio ambiental del modelo. Los autores recomiendan presentar predicciones solo dentro del AOA; un resumen de 2024 (EGU24-10278) critica que el criterio depende solo de la distancia al dato más cercano.

(Recomendación) Agregar una bandera de extrapolación basada en distancias a los datos de entrenamiento, cobertura de sensores y valores fuera de rango, con escalas aprendidas sin etiquetas de evaluación. La bandera informa la condición de aplicación; no reemplaza un intervalo.

(Ejemplo general) Un término de área lineal puede extrapolarse a parcelas mucho más grandes que cualquiera con etiqueta dentro de su municipio. Esa extrapolación debe declararse en la interfaz y, de ser necesario, acotarse; las auditorías de despliegue la tratan como punto de revisión.

Fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/iterate_20261017__research__critique_expected_value.md; Meyer y Pebesma (2021), Methods in Ecology and Evolution 12, 1620-1633, https://doi.org/10.1111/2041-210X.13650

## Valor esperado de seguir iterando

(Nuestros experimentos y auditorías) La auditoría de valor esperado estimó que los candidatos restantes de la ronda aportaban, en conjunto, del orden de milésimas de t/ha, y que varios no tenían poder para detectar un efecto de 0.002 t/ha: la probabilidad de aceptar un efecto real de 0.002 fue de alrededor de 0.12,
frente a 0.03 sin efecto. El costo de esos candidatos (horas de cómputo y de análisis) superaba el beneficio esperado.

(Recomendación) Asignar el tiempo a la justificación técnica (sesgos conocidos, pruebas negativas, incertidumbre) y a la calidad del despliegue (revisiones de extrapolación y de formato), antes que a búsquedas adicionales sobre las mismas 138 parcelas. Cada consulta adicional tiene un valor esperado negativo cuando se
corrige el sesgo de selección.

Fuente: validacion/iterate_20261017__research__critique_expected_value.md; validacion/iterate_20261017__research__critique_feasibility.md

## Por qué una mejora de 0.003 t/ha no es significativa

(Cálculo) Un RMSE de 0.47 t/ha con n = 138 tiene error estándar de alrededor de 0.029 t/ha. Una diferencia de 0.003 t/ha equivale a un décimo de ese error y a unas 0.6 % del RMSE. Con el error estándar de la comparación única (0.0030), z ≈ 1 y p ≈ 0.3; con el error del efecto de selección (≈ 0.01), z ≈ 0.3 y p ≈ 0.8.

(Nuestros experimentos) En remuestreos de 59 parcelas, la desviación estándar de la diferencia de RMSE entre dos modelos fue 0.0045 t/ha. Una mejora de 0.003 cae dentro del ruido de muestreo de la propia métrica.

(Conclusión) Una mejora de 0.003 t/ha no justifica decir que un modelo es mejor. Debe reportarse como empate, con intervalo, y solo puede considerarse decisión si se preregistró como criterio y la diferencia sobrevive a un control independiente.

Fuente: validacion/iterate_20261017__research__critique_expected_value.md; validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md

## Comparación pareada, repeticiones y reporte de incertidumbre

(Recomendación) Comparar modelos con la diferencia pareada del error cuadrático por parcela (o por pliegue), sobre las mismas particiones repetidas, y reportar media, error estándar e intervalo bootstrap por parcela o bloque. Un modelo debe reportarse frente a su línea base de municipio y frente a la media global.

(Nuestros experimentos) Las auditorías del proyecto compararon candidatos frente a una referencia común y encontraron que, sin pareado y sin repeticiones, las diferencias de unas milésimas no eran distinguibles.

(Advertencia) Las diferencias de RMSE se comprimen frente a las de MSE: ΔRMSE ≈ ΔMSE/(2·RMSE). Una diferencia de 0.003 en MSE corresponde a unas 0.003 t/ha de RMSE; la comparación debe hacerse sobre la diferencia pareada por parcela, no sobre el RMSE de cada modelo por separado.

Fuente: validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md

## Métricas: RMSE, MAE, R² y sesgo

(Literatura y definición) RMSE = √((1/n) Σ (ŷᵢ − yᵢ)²) penaliza más los errores grandes; MAE = (1/n) Σ |ŷᵢ − yᵢ| es el error absoluto típico; el sesgo = (1/n) Σ (ŷᵢ − yᵢ) detecta sobreestimación o subestimación. R² de predicción = 1 − Σ(yᵢ − ŷᵢ)²/Σ(yᵢ − ȳ)² puede ser negativo y no equivale al cuadrado de la correlación
en general.

(Proyecto) Todas las métricas se expresan en t/ha. Para RMSE, la media es el objetivo correcto; para MAE, la mediana. En Chignahuapan, la mediana (4.52) supera a la media (4.48) por una asimetría de −1.28, de modo que las dos métricas tiran en direcciones ligeramente distintas.

(Recomendación) Reportar RMSE, MAE, R² y sesgo, guardando las predicciones fuera de pliegue de todas las parcelas y calculando las métricas sobre ese conjunto. Promediar RMSE de grupos de tamaños distintos no equivale al RMSE conjunto.

Fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/iterate_20261017__research__B3_small_n_methods.md

## Línea base por municipio y habilidad relativa

(Nuestros experimentos) El RMSE de validación de la mejor versión evaluada es prácticamente igual a la desviación estándar dentro de municipio (0.474 frente a 0.475 t/ha). Con un RMSE de 0.46 y la varianza dentro de municipio, el R² de predicción dentro de municipio es de alrededor de 0.06. En Calpulalpan las
predicciones casi no se mueven (rango de la media entre 2.93 y 3.08) y no tienen habilidad dentro del municipio.

(Recomendación) Calcular la habilidad relativa como 1 − MSE del modelo / MSE de la media municipal, fuera de pliegue. Reportar el desglose por municipio con su tamaño de muestra.

Cuando un municipio tiene una sola parcela, su media municipal fuera de pliegue no existe; en ese caso la línea base debe ser la media global o la media contraída hacia ella, y debe declararse así. Un RMSE global bajo puede ocultar que la mayor parte de la ganancia viene de diferencias entre municipios que ya eran
conocidas.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md; validacion/iterate_20261017__research__critique_feasibility.md

## Modelos tabulares preentrenados con muestras pequeñas

(Literatura) TabPFN v2 (Hollmann et al., Nature 2025, DOI 10.1038/s41586-024-08328-6; referencia verificada) es un modelo preentrenado para datos tabulares pequeños. TabArena (Erickson et al., arXiv 2506.16791) incluye conjuntos con al menos 500 muestras de entrenamiento y deja fuera los muy pequeños en su versión 0.1
(verificado en el texto), por lo que su evidencia no cubre n ≈ 138. El análisis JRC "From Rows to Yields" (validación dejando un año fuera; el número de filas de la versión previa no se verificó) encontró que TabPFN fue ligeramente peor que el mejor pipeline ML con selección anidada (maíz: TabPFN 8.8 % frente a 6.8 %
del mejor modelo de aprendizaje automático en rRMSEp; R² 0.86 y 0.91; Sabo et al., 2026, Scientific Reports, DOI 10.1038/s41598-026-50338-z), diferencia no significativa (sin
evidencia: la búsqueda no localizó el informe).

(Recomendación) Probar TabPFN o modelos similares con un conjunto compacto de variables (≤ 30 a 50), dentro de la misma validación anidada y por grupos, comparando con pares de pliegues. No ajustar hiperparámetros sobre las mismas particiones; afinar sumaría sesgo de selección.

(Nuestros experimentos) El corpus no contiene evidencia de que un modelo tabular preentrenado supere, con 138 parcelas, a un pipeline ajustado con selección anidada; por eso su aporte esperado se consideró pequeño.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md

## Ablaciones e interpretación de importancia

(Literatura y definición) Una ablación compara modelos que difieren en un componente definido, evaluados sobre las mismas particiones externas. La importancia por permutación agrupada y su estabilidad entre particiones son más informativas que un ranking único, porque la colinealidad (NDVI y bandas NIR, por ejemplo)
hace que permutar una variable subestime su utilidad.

(Límites) Una importancia alta no es causalidad. SHAP describe el comportamiento del modelo, no una intervención. Si el clima aporta poco tras incluir vegetación, eso indica contribución incremental bajo esa representación, no ausencia de mecanismo climático.

(Ejemplo de lectura) Una ablación que retire la familia óptica y conserve clima y relieve debe reportar su diferencia de RMSE con el mismo error estándar y las mismas particiones que cualquier otra comparación. Si la diferencia es de unas milésimas, la conclusión correcta es que la familia no se puede distinguir de
cero con 138 parcelas.

(Recomendación) Reportar intervalos de variación de la importancia entre particiones y ejemplos de parcelas donde la explicación cambia. Si el orden es inestable, esa inestabilidad es el resultado.

Fuente: validacion/literature_review__report__sections__06_validacion.typ.txt

## Distribución de etiquetas por municipio: hechos para validar

(Hechos del dataset oficial, parcelas con rendimiento en entrenamiento) Almoloya 10 (media 4.52 t/ha, desviación 0.19); Apan 1 (3.00); Cuautepec de Hinojosa 5 (4.60, 0.15); Emiliano Zapata 3 (3.50, sin variación); Singuilucan 16 (3.08, 0.43); Tepeapulco 1 (4.45); Chignahuapan 71 (4.48, 0.58; rango 2.15 a 5.59);
Calpulalpan 30 (3.00, 0.37; rango 2.50 a 3.50); Nanacamilpa de Mariano Arista 1 (2.50). El total es 138 parcelas de entrenamiento y 59 de predicción; 197 en total.

(Implicación) Cinco de los nueve municipios tienen 5 parcelas o menos de entrenamiento, y tres tienen una sola. Cualquier resultado por municipio con n ≤ 5 es una anécdota y debe reportarse como tal.

Esta distribución condiciona las validaciones posibles: con particiones por municipio, los municipios de una o tres parcelas no pueden evaluarse de forma honesta, y el error de Chignahuapan y Calpulalpan domina las métricas globales. Por eso cualquier conclusión sobre municipios pequeños debe presentarse como
exploratoria.

Fuente: reto_y_datos/HECHOS_CALCULADOS_dataset_oficial.md

## Validación por bloques espaciales: lo que muestra Roberts et al. (2017)

(Literatura, verificado.) Roberts y colaboradores revisaron la validación cruzada para datos con estructura temporal, espacial, jerárquica o filogenética. Su conclusión central es que la validación cruzada aleatoria ignora esas dependencias, y que cuando las dependencias persisten en los residuos del modelo el error
predictivo se subestima de forma seria. En sus simulaciones y casos de estudio, la validación por bloques funcionó mejor que la aleatoria para predecir hacia datos o espacios de predictores nuevos y para seleccionar predictores causales. Su recomendación práctica es usar validación por bloques siempre que exista
estructura de dependencia, aun cuando los residuos no muestren correlación visible. Para el proyecto, una cifra de RMSE obtenida con particiones aleatorias de parcelas agrupadas por municipio no equivale a una estimación para municipios no observados; el tipo de partición debe declararse junto con la cifra.

Fuente: Roberts, D. R. et al. (2017). Cross-validation strategies for data with temporal, spatial, hierarchical, or phylogenetic structure. Ecography, 40(8), 913-929. https://doi.org/10.1111/ecog.02881

## Mapas de biomasa y validación no espacial: el caso de Ploton et al. (2020)

(Literatura, verificado.) Ploton y colaboradores reprodujeron el enfoque de mapas de biomasa forestal a gran escala con un inventario de 11.8 millones de árboles en África central, usando un modelo de bosque aleatorio alimentado con variables multiespectrales y ambientales. Con validación no espacial, el modelo parecía
explicar más de la mitad de la variación de biomasa. Con una validación espacial que considera la autocorrelación, el poder predictivo resultó casi nulo. Los autores concluyen que el análisis de grandes volúmenes de datos puede parecer altamente predictivo aun cuando los predictores tienen relaciones débiles con la
variable ecológica, lo que puede producir mapas erróneos. Para nuestro caso, la lección es que un buen resultado en validación aleatoria no basta para afirmar que el modelo funciona en zonas o municipios sin observaciones. Esta es una advertencia sobre la validación; no mide el desempeño de nuestro modelo, que depende
de sus propias particiones.

Fuente: Ploton, P. et al. (2020). Spatial validation reveals poor predictive performance of large-scale ecological mapping models. Nature Communications, 11, 4540. https://doi.org/10.1038/s41467-020-18321-y

## El debate sobre la validación espacial: Wadoux et al. (2021) frente a Meyer y Pebesma (2022)

(Literatura y recomendación.) Wadoux y colaboradores sostienen que la validación cruzada espacial no tiene un fundamento teórico claro para estimar la exactitud de un mapa, y proponen obtener la exactitud a partir de muestreo probabilístico con inferencia basada en el diseño. Meyer y Pebesma (2022) resumen esta
discusión junto con la posición de Ploton y colaboradores (2020), que defiende la validación espacial, y no la zanjan. Para el proyecto, la recomendación práctica es declarar qué pregunta responde la cifra: si el despliegue cae en municipios ya observados, la partición aleatoria dentro de municipios es la pertinente;
si pregunta por municipios sin observaciones, la partición por municipio o bloque es la pertinente. Esta distinción es una recomendación propia del proyecto; las dos cifras son estimaciones de desempeño bajo supuestos distintos, y ninguna se presenta como exactitud de mapa en el sentido de Wadoux et al.

Fuente: Wadoux, A. M. J.-C. et al. (2021). Spatial cross-validation is not the right way to evaluate map accuracy. Ecological Modelling, 457, 109692. https://doi.org/10.1016/j.ecolmodel.2021.109692; Meyer, H. y Pebesma, E. (2022). Machine learning-based global maps of ecological variables and the challenge of assessing
them. Nature Communications, 13. https://doi.org/10.1038/s41467-022-29838-9

## Área de aplicabilidad: cuándo un modelo predice fuera de su dominio

(Literatura, verificado.) Meyer y Pebesma (2021) proponen estimar un área de aplicabilidad (AOA, por sus siglas en inglés) para modelos de predicción espacial. Calculan un índice de disimilitud a partir de la distancia, en el espacio de predictores, entre cada punto nuevo y los datos de entrenamiento, y definen el AOA
como la zona donde el modelo aprendió de datos parecidos y donde se sostiene el desempeño estimado por validación. Los autores recomiendan presentar predicciones solo dentro del AOA. La implementación está disponible en el paquete CAST de R. Un resumen de congreso de 2024 (EGU24-10278) critica que el criterio depende
solo de la distancia al dato de referencia más cercano, de modo que un único punto de entrenamiento puede declarar aplicable una zona. Para el reto, un predictor como el área de la parcela puede extrapolarse a valores que no tienen etiqueta en su municipio. Un índice de este tipo sirve como bandera de extrapolación, no
como sustituto de un intervalo (recomendación propia).

Fuente: Meyer, H. y Pebesma, E. (2021). Predicting into unknown space? Estimating the area of applicability of spatial prediction models. Methods in Ecology and Evolution, 12, 1620-1633. https://doi.org/10.1111/2041-210X.13650; EGU24-10278 (2024), https://meetingorganizer.copernicus.org/EGU24/EGU24-10278.html

## Validación por bloques con blockCV

(Literatura, verificado.) Valavi y colaboradores (2019) presentaron blockCV, un paquete de R para generar pliegues separados espacial o ambientalmente en la validación cruzada de modelos de distribución de especies. Su argumento coincide con el de Roberts et al. (2017): la validación cruzada aleatoria puede subestimar
el error de predicción cuando los datos tienen estructura espacial, y eso además puede llevar a elegir mal entre modelos. El paquete incluye herramientas para estimar el rango de autocorrelación espacial de las covariables y para construir bloques, aunque su uso no se limita a especies. Como práctica recomendada para
estudios como el nuestro, conviene estimar el rango de autocorrelación de las variables de teledetección antes de fijar el tamaño de los bloques, y comparar las particiones por bloque con las particiones por municipio. Con 138 parcelas agrupadas en nueve municipios, los bloques pequeños tendrán muy pocas observaciones
y su cifra será ruidosa; por eso el tamaño del bloque debe declararse y justificarse.

Fuente: Valavi, R., Elith, J., Lahoz-Monfort, J. J. y Guillera-Arroita, G. (2019). blockCV: An R package for generating spatially or environmentally separated folds for k-fold cross-validation of species distribution models. Methods in Ecology and Evolution, 10(2), 225-232. https://doi.org/10.1111/2041-210X.13107

## Fuga de información: definición según Kaufman et al. (2012)

(Literatura, verificado.) Kaufman, Rosset, Perlich y Stitelman (2012) definen la fuga de datos como la situación en que el modelo tiene acceso a información relacionada con el objetivo que no tendría en el momento real de predecir. Plantean que la fuga puede evitarse con un manejo cuidadoso de los datos seguido de una
separación entre aprendizaje y predicción (learn-predict separation), y proponen métodos para detectarla cuando el analista no controló cómo se recolectaron los datos. Su análisis incluye también una mirada desde modelos causales. Para el proyecto, la separación implica que las etapas que usan rendimientos (ajuste de
coeficientes, selección de variables, elección de hipótesis) deben ocurrir solo con datos de entrenamiento de cada partición, mientras que las etapas que no usan etiquetas pueden calcularse sobre todas las parcelas.

Fuente: Kaufman, S., Rosset, S., Perlich, C. y Stitelman, O. (2012). Leakage in data mining: formulation, detection, and avoidance. ACM Transactions on Knowledge Discovery from Data, 6(4), 15. https://doi.org/10.1145/2382577.2382579

## Fuga en ciencia con aprendizaje automático: Kapoor y Narayanan (2023)

(Literatura, verificado.) Kapoor y Narayanan (2023) revisaron literatura de ciencias que adoptaron aprendizaje automático y encontraron fuga de información en 17 campos, en 294 artículos según la versión publicada (el preprint reportaba 329). Clasifican la fuga en ocho tipos, desde errores de procedimiento básicos
hasta problemas abiertos de investigación, y proponen "model info sheets" para documentar cada modelo y prevenir cada tipo. Un caso ilustrativo es la predicción de guerras civiles: al corregir la fuga, la ventaja que el aprendizaje automático parecía tener sobre métodos tradicionales desapareció. Los autores definen la
irreproducibilidad como errores de análisis que hacen que un modelo no sea tan predictivo como se afirma. Para el reto, una práctica derivada es llevar una hoja de información del modelo que liste las particiones, los pasos ajustados con etiquetas y las consultas a las etiquetas. Algunos autores criticados en el
artículo han cuestionado sus conclusiones, por lo que conviene leer la fuente original.

Fuente: Kapoor, S. y Narayanan, A. (2023). Leakage and the reproducibility crisis in machine-learning-based science. Patterns, 4, 100804. https://doi.org/10.1016/j.patter.2023.100804

## Corregir la elección del mejor candidato: Tibshirani y Tibshirani (2009) y Tsamardinos et al. (2018)

(Literatura, verificado.) Tibshirani y Tibshirani (2009) muestran que el error mínimo de validación cruzada usado para elegir el parámetro de ajuste está sesgado a la baja como estimador del error de prueba, y proponen una corrección que se obtiene de las curvas de error de cada pliegue, sin costo computacional
adicional. Tsamardinos, Greasidou y Borboudakis (2018) proponen un procedimiento bootstrap que corrige el puntaje de validación cruzada del mejor candidato usando sus predicciones fuera de pliegue, sin reentrenar el modelo; en su versión publicada la variante con descarte de candidatos se llama BBCD-CV, y los autores
afirman que es más barato que la validación cruzada anidada y que sirve para cualquier métrica. El nombre BBC-CV de las notas del corpus es cercano a esa familia, pero no es el título del artículo. La corrección no elimina el sesgo de elegir entre muchos candidatos: lo estima. Por eso el resultado de la comparación
debe reportarse con su corrección junto a la cifra de cada candidato.

Fuente: Tibshirani, R. J. y Tibshirani, R. (2009). A bias correction for the minimum error rate in cross-validation. Annals of Applied Statistics, 3(2), 822-829. https://doi.org/10.1214/08-AOAS224; Tsamardinos, I., Greasidou, E. y Borboudakis, G. (2018). Bootstrapping the out-of-sample predictions for efficient and
accurate cross-validation. Machine Learning. https://doi.org/10.1007/s10994-018-5714-4

## Comparar candidatos frente a una referencia: prueba de realidad y SPA de Hansen (2005)

(Literatura, verificado en parte.) White (2000) propuso una prueba de realidad (reality check) que compara el mejor de muchos modelos con la hipótesis de que ninguno supera a una referencia, para controlar el azar de la búsqueda; su descripción se confirmó de forma indirecta, a través de Hansen (2005), y el artículo
original no se leyó. Hansen (2005) propone la prueba de capacidad predictiva superior (SPA), que modifica la de White normalizando las diferencias medias por una estimación de su desviación estándar, lo que aumenta la potencia. Ambas usan un bootstrap estacionario con longitud de bloque geométrica para construir la
distribución nula. Una limitación reportada es que estas pruebas no funcionan bien cuando la referencia está anidada en los modelos alternativos, salvo que la referencia no tenga parámetros estimados. Para comparar candidatos del proyecto, esta familia de pruebas exige que todos los candidatos evaluados se cuenten, no
solo el mejor, y que las diferencias se calculen por unidad independiente (parcela o bloque), no por pliegue repetido.

Fuente: Hansen, P. R. (2005). A test for superior predictive ability. Journal of Business and Economic Statistics, 23(4), 365-380; White, H. (2000). A reality check for data snooping. Econometrica (citada de forma indirecta).

## Contracción hacia la media de grupo: Efron y Morris (1975)

(Literatura, verificado.) Efron y Morris (1975) aplicaron el estimador de Stein y sus generalizaciones a promedios de bateo, a tasas de prevalencia de toxoplasmosis y al tamaño exacto de una prueba chi-cuadrada de Pearson. En cada ejemplo, el error cuadrático medio de estas reglas fue menor que la mitad del de la media
muestral (resumen del artículo). El principio es encoger las medias de grupos pequeños hacia la media global, con una cantidad que depende de cuánta varianza hay entre grupos frente a la varianza de muestreo. Con grupos de tamaño muy distinto, como los municipios de este conjunto, la contracción es fuerte para
municipios de una o pocas parcelas y casi nula para municipios grandes. Los resultados de Efron y Morris no implican que la contracción mejore siempre el RMSE en nuestro caso: el beneficio depende de la estructura de varianzas, y en nuestros datos la recuperación es pequeña (como máximo unas 0.01 t/ha de RMSE; véase la
sección de contracción empírica).

Fuente: Efron, B. y Morris, C. (1975). Data analysis using Stein's estimator and its generalizations. Journal of the American Statistical Association, 70(350), 311-319.

## Estimación en áreas pequeñas: el modelo de Battese, Harter y Fuller (1988)

(Literatura, verificado.) Battese, Harter y Fuller (1988) propusieron un modelo de componentes de error para predecir áreas de cultivo por condado combinando una encuesta de campo con datos del satélite Landsat. El caso original usa 12 condados de Iowa, datos de la encuesta de junio de 1978 del USDA y lecturas Landsat
de la temporada 1978, con una estructura de error anidado que captura la correlación de hectáreas dentro de cada condado. El artículo destaca que la predicción para áreas pequeñas rara vez se intentaba porque las encuestas tenían pocos datos en esas áreas. La idea transferible al reto es que un municipio con pocas
parcelas puede estimarse usando la información del conjunto (préstamo de información entre grupos), siempre que se declare la incertidumbre de esa estimación. Sin embargo, el modelo estima medias de área y no predicciones de parcelas individuales; el reto mide parcelas, por lo que su aplicación directa es limitada y
debe describirse como análoga.

Fuente: Battese, G. E., Harter, R. M. y Fuller, W. A. (1988). An error-components model for prediction of county crop areas using survey and satellite data. Journal of the American Statistical Association, 83(401), 28-36. https://doi.org/10.1080/01621459.1988.10478561

## Reportes con heaping: el modelo de Wang y Heitjan (2008)

(Literatura, verificado.) Wang y Heitjan (2008) estudiaron cómo las personas reportan cantidades autorreportadas, como cigarros fumados, y mostraron que una parte de las respuestas son valores exactos y otra parte son valores redondeados (múltiplos de 20, 10 o 5). Modelaron la respuesta como una mezcla de reportes
exactos y redondeados, con una clase latente que describe el comportamiento de reporte, y mostraron que el heaping puede sesgar la media estimada del consumo. Para etiquetas de rendimiento agrícola, la traslación es directa en la forma pero no en el contexto: el reto usa rendimientos pesados o estimados por
productores, no conteos personales. En nuestros datos, la mayoría de las etiquetas no cae en la rejilla de 0.5 t/ha (45 de 138). Si el heaping existe, es plausible que afecte sobre todo a Calpulalpan, donde solo aparecen 2.5, 3.0 y 3.5 (hipótesis, no resultado). Un modelo de mezcla es una recomendación posible, no un
resultado del proyecto.

Fuente: Wang, H. y Heitjan, D. F. (2008). Modeling heaping in self-reported cigarette counts. Statistics in Medicine, 27(19), 3789-3804.

## Errores de reporte de rendimiento: Uganda, Etiopía y la corrección de un solo error

(Literatura.) En Uganda, Gourlay, Kilic y Lobell (2019), con un panel de dos rondas de hogares del este del país, encontraron que la relación inversa entre tamaño de parcela y productividad aparece con producción autorreportada y desaparece con estimaciones basadas en cortes de cosecha y satélite, que apuntan a
rendimientos a escala constante. Atribuyen el patrón a una sobreestimación persistente de la producción autorreportada frente a los cortes, sobre todo en la mitad inferior de la distribución de áreas (verificado en el resumen del artículo). Desiere y Jolliffe (2018) documentan un patrón similar en Etiopía:
sobrerreporte en parcelas pequeñas y subreporte en las grandes, con la relación inversa que desaparece al usar cortes de cosecha (verificado en el resumen). Abay, Tadesse, Barrett y Bernard (2019) muestran que, con errores no clásicos correlacionados en área y producción, corregir solo uno de los dos puede aumentar el
sesgo (verificado en diapositivas de los autores). Lobell y colaboradores (2020) comparan rendimientos autorreportados, cortes de subparcela y cosecha de parcela completa en Uganda, y encuentran brechas grandes entre métodos terrestres; sus cifras específicas no pudieron confirmarse en esta revisión. Para cebada
comercial de Hidalgo, Puebla y Tlaxcala, el corpus no contiene una medición de este error; la prueba recomendada es correlacionar los residuos del modelo con el área de la parcela, porque una correlación así indicaría un artefacto de reporte.

Fuente: Gourlay, S., Kilic, T. y Lobell, D. B. (2019). A new spin on an old debate. Journal of Development Economics. https://doi.org/10.1016/j.jdeveco.2019.102376; Desiere, S. y Jolliffe, D. (2018). Land productivity and plot size: Is measurement error driving the inverse relationship? Journal of Development
Economics, 130, 84-98; Abay, K. A. et al. (2019). Journal of Development Economics, 139, 171-184; Lobell, D. B. et al. (2020). American Journal of Agricultural Economics, https://doi.org/10.1093/ajae/aaz051

## Etiquetas por intervalo: alternativas al redondeo (Cheng et al., 2023; Barnwal et al., 2022)

(Literatura, verificado.) Cuando la etiqueta es un intervalo y no un valor exacto, Cheng y colaboradores (2023) estudian la regresión con objetivos de intervalo: proponen un modelo estadístico del proceso de generación de datos, analizan un método base que elige un valor dentro de cada intervalo como objetivo, y
proponen un método que restringe las predicciones a caer dentro del intervalo, que es estadísticamente consistente y tiene una cota de error. Barnwal, Cho y Hocking (2022) incorporan el modelo de tiempo de falla acelerado a XGBoost con soporte para censura por intervalo. Para el reto, la pertinencia es que el
rendimiento de Calpulalpan, con valores en rejilla de 2.5 a 3.5, podría tratarse como intervalo en lugar de como valor exacto. Esta es una alternativa a estudiar, no un resultado del proyecto. Cualquier uso debe evaluarse con la misma validación anidada y por grupos, y no sustituye la medición del error de reporte.

Fuente: Cheng, X., Cao, Y., Li, X., An, B. y Feng, L. (2023). Weakly supervised regression with interval targets. ICML 2023, PMLR 202, 5428-5448. https://proceedings.mlr.press/v202/cheng23a.html; Barnwal, A., Cho, H. y Hocking, T. (2022). Survival regression with accelerated failure time model in XGBoost. Journal of
Computational and Graphical Statistics, 31(4), 1292-1302.

## Aptitud para cebada en Calpulalpan, Tlaxcala: contexto de modelado

(Literatura, resumen de búsqueda) Un artículo de Ra Ximhai (2015) modeló la producción de cebada en el municipio de Calpulalpan, Tlaxcala, con el modelo de cultivo AquaCrop de la FAO bajo escenarios climáticos históricos y futuros. Según el resumen consultado, más de 70 % de la superficie municipal resultó apta para
cebada. El artículo no se leyó completo, por lo que la cifra debe citarse como resumen.

(Relevancia para el proyecto) Calpulalpan tiene 30 parcelas de entrenamiento, con una desviación estándar de 0.37 t/ha dentro del municipio. La aptitud municipal describe clima y suelo a escala de municipio; la variación que sigue sin explicar está dentro del municipio, así que la aptitud no implica que los
rendimientos parcelarios sean predecibles con las variables disponibles.

(Prensa, solo contexto) Una nota de Mexico Business News (2024), que cita datos del SIAP, reporta que la sequía en el Altiplano redujo el rendimiento de cebada en 2023 a unas 1.78 t/ha, frente a unas 3.5 t/ha típicas. (prensa) Se usa solo como contexto y no como dato validado.

Fuente: Ra Ximhai (2015), https://doaj.org/article/788f53d631594409addaca7f48af033d; (prensa) Mexico Business News (2024), https://mexicobusiness.news/agribusiness/news/climate-change-threatens-barley-supply

## Comparar clasificadores: pruebas aproximadas de Dietterich (1998)

(Literatura.) Al comparar dos algoritmos de aprendizaje supervisado sobre un mismo conjunto de datos, una diferencia pequeña en el error de validación cruzada no siempre es significativa. Dietterich (1998) evaluó cinco pruebas estadísticas aproximadas para decidir si un algoritmo supera a otro, midiendo su error tipo I
(declarar una diferencia que no existe) y su potencia. Según el resumen del artículo, dos pruebas usadas con frecuencia, la prueba de dos proporciones y la prueba t pareada sobre varias divisiones aleatorias entre entrenamiento y prueba, tienen un error tipo I alto y no deben usarse. La t de validación cruzada de 10
pliegues tiene un error tipo I algo elevado. La prueba 5×2 cv, basada en cinco repeticiones de validación cruzada de dos pliegues, tiene un error tipo I aceptable. Su recomendación depende del costo computacional: si los algoritmos solo pueden ejecutarse una vez, la prueba de McNemar es la única con error tipo I
aceptable; si pueden ejecutarse diez veces, se recomienda la prueba 5×2 cv, ligeramente más potente que McNemar. Con 138 parcelas, una diferencia de 0.003 t/ha no justifica una conclusión sin una prueba de este tipo o un intervalo pareado (recomendación).

Fuente: Dietterich, T. G. (1998). Approximate statistical tests for comparing supervised classification learning algorithms. Neural Computation, 10, 1895-1923. https://doi.org/10.1162/089976698300017197

## Pruebas t corregidas para validación cruzada: Nadeau y Bengio (2003)

(Literatura y cálculo propio.) Una prueba t pareada aplicada a los errores de validación cruzada trata las diferencias entre pliegues como independientes, pero los conjuntos de entrenamiento se traslapan. Nadeau y Bengio (2003) mostraron que, por esa dependencia, la varianza de la diferencia de errores se subestima y
la prueba rechaza en exceso. Su corrección multiplica la varianza de las diferencias por un factor 1/k + n_prueba/n_entrenamiento, válido para validación cruzada con k pliegues o para particiones aleatorias. Con 138 parcelas y 10 pliegues, n_prueba/n_entrenamiento = 1/9, de modo que el factor pasa de 0.10 (prueba
ingenua) a 0.21, y el error estándar crece unas 1.45 veces. La corrección no sustituye la unidad de análisis: sirve cuando se compara dos modelos sobre las mismas particiones. El cálculo es propio sobre la fórmula; el resumen del artículo no se leyó en esta ronda.

Fuente: Nadeau, C. y Bengio, Y. (2003). Inference for the generalization error. Machine Learning, 52, 239-281. https://doi.org/10.1023/A:1024068626366

## Prueba de Diebold–Mariano: comparar dos pronósticos con la misma pérdida

(Literatura y recomendación.) La prueba de Diebold y Mariano (1995) compara la precisión predictiva de dos pronósticos sobre los mismos casos. Se define la diferencia de pérdidas d_t = L(e1_t) − L(e2_t), por ejemplo con error cuadrático en cada modelo, y se contrasta si su media es cero. El estadístico divide la media
de d entre su error estándar, que se estima con una varianza de largo plazo (HAC) para permitir autocorrelación en las diferencias, y bajo la hipótesis nula es aproximadamente normal. La prueba fue pensada para pronósticos de series de tiempo, donde las pérdidas se autocorrelacionan. En nuestro caso las parcelas no
tienen orden temporal, pero las diferencias de parcelas vecinas o de un mismo municipio pueden estar correlacionadas, y la validación cruzada reutiliza datos entre pliegues. Por eso la prueba debe aplicarse con cautela: sirve como referencia cuando las predicciones vienen de un solo esquema de particiones, y conviene
acompañarla con el bootstrap pareado por parcela del fragmento siguiente. La prueba no se aplicó a nuestros experimentos.

Fuente: Diebold, F. X. y Mariano, R. S. (1995). Comparing predictive accuracy. Journal of Business & Economic Statistics. https://doi.org/10.1080/07350015.1995.10524599

## Bootstrap pareado por parcela para comparar dos modelos

(Método estándar y recomendación.) Para comparar dos modelos sobre las mismas parcelas, se calcula para cada parcela i la diferencia de pérdida d_i = e1_i² − e2_i² (o con valor absoluto), a partir de predicciones fuera de pliegue. El bootstrap pareado por unidad remuestrea las parcelas con reemplazo, conservando cada
par (d_i), recalcula la media de d en cada remuestra y toma los percentiles 2.5 y 97.5 como intervalo. Un procedimiento habitual usa B = 2000 remuestras. El intervalo refleja la incertidumbre de muestreo de las parcelas, no la de la elección de particiones: para cubrir esta última conviene repetir la validación cruzada
con varias particiones. Si las parcelas se agrupan en municipios, el remuestreo debe ser por municipio o por bloque espacial. Un intervalo que contiene el cero indica que la diferencia no se distingue del azar con este conjunto. La referencia general (Efron y Tibshirani, 1993) no se consultó en línea en esta ronda.

Fuente: método general; referencia de apoyo Efron, B. y Tibshirani, R. J. (1993). An introduction to the bootstrap. Chapman & Hall (no consultada en línea en esta ronda).

## Regresión cuantílica conformalizada: intervalos con garantía finita

(Literatura.) Romano, Patterson y Candès (2019) proponen la regresión cuantílica conformalizada (CQR). El método ajusta dos cuantiles condicionales (por ejemplo, 5 % y 95 %) con los datos de entrenamiento, calcula en un conjunto de calibración independiente un puntaje de no conformidad para cada caso (qué tanto la
observación cae fuera del intervalo ajustado) y usa el cuantil finito de esos puntajes para ensanchar o encoger el intervalo. Bajo intercambiabilidad, el intervalo tiene cobertura marginal de al menos 1 − α en muestra finita, sin supuestos de normalidad. Con pocas observaciones el problema es práctico: el conjunto de
calibración reduce el tamaño de entrenamiento, el cuantil se vuelve discreto y el intervalo se ensancha. Las garantías son marginales, no condicionales a una parcela o a un municipio, y no cubren dependencia espacial entre parcelas. Con 138 parcelas, un intervalo de 90 % debe reportarse con su cobertura empírica en
validación cruzada, no solo con la garantía teórica.

Fuente: Romano, Y., Patterson, E. y Candès, E. (2019). Conformalized quantile regression. NeurIPS 2019; arXiv:1905.03222. https://doi.org/10.48550/arxiv.1905.03222

## Análisis multiverso: reportar las decisiones razonables

(Literatura y recomendación.) Steegen et al. (2016) proponen el análisis multiverso: enumerar todas las decisiones de análisis defendibles (exclusiones de datos, transformaciones, covariables y definiciones de la variable de resultado), ejecutarlas todas y presentar la distribución de estimaciones en lugar de una sola
combinación. Para nuestro problema, las decisiones incluyen el tipo de validación (aleatoria, por municipio o por bloque espacial), la transformación del rendimiento, la inclusión de cada covariable y las exclusiones de parcelas atípicas. El multiverso no corrige por sí solo la búsqueda de hipótesis: si el conjunto de
decisiones se define después de ver los datos, la distribución sigue siendo optimista. Su valor es mostrar cuánto depende la conclusión de las decisiones, y debe combinarse con un preregistro del conjunto de decisiones y con confirmación en parcelas no usadas para elegirlas. No se aplicó a nuestros experimentos.

Fuente: Steegen, S. et al. (2016). Increasing transparency through a multiverse analysis. Perspectives on Psychological Science. https://doi.org/10.1177/1745691616658637

## Estimación en áreas pequeñas aplicada a rendimientos municipales

(Literatura y propuesta.) El modelo de Fay y Herriot (1979) combina, para cada área, una estimación directa ruidosa con un modelo de regresión sobre covariables. La estimación directa se escribe y_i = θ_i + e_i, con varianza de muestreo ψ_i conocida, y θ_i = x_i'β + v_i, con varianza σ_v² del efecto de área. La
predicción de θ_i es un promedio ponderado con peso γ_i = σ_v² / (σ_v² + ψ_i) entre la estimación directa y la regresión. Cuando el área tiene pocas parcelas, ψ_i es grande, γ_i es pequeño y la predicción se acerca a la media del modelo. Aplicado a rendimientos de cebada, las áreas serían los municipios (nueve en el
reto, con tamaños muy desiguales). El riesgo principal es estimar σ_v² con tan pocas áreas, lo que vuelve inestable la contracción. Por eso esta estimación sirve para medias municipales y no para predicciones de parcelas individuales. Es una propuesta metodológica; no se aplicó a nuestros experimentos.

Fuente: Fay, R. E. y Herriot, R. A. (1979). Estimates of income for small places: an application of James-Stein procedures to census data. Journal of the American Statistical Association, 74(366). https://doi.org/10.2307/2286322

## Error de medición en las etiquetas de rendimiento: cosecha, autorreporte y satélite

(Literatura y recomendación.) Burke y Lobell (2017) compararon rendimientos de maíz de pequeños productores en Kenia medidos con imágenes satelitales de 1 m y con encuestas de campo intensivas en miles de parcelas durante dos años. Según su resumen, la concordancia entre ambos métodos depende de la calidad de la
medición de campo: fue mayor (coeficiente de determinación de hasta 0.4) cuando el área de la parcela se midió con precisión y cuando las parcelas eran grandes, porque en ellas el error de redondeo es menor. Para las etiquetas de rendimiento esto implica que el método de medición (cosecha de muestra, autorreporte o
monitor) define una parte del error que ningún modelo puede explicar. Recomendación: documentar por parcela cómo se obtuvo cada rendimiento y el área medida, y tratar el error de medición como una fuente de ruido separada en el análisis de error (ver el apartado de ruido de etiquetas). Lobell y colaboradores (2020)
reportan brechas entre métodos terrestres, pero sus cifras no se verificaron.

Fuente: Burke, M. y Lobell, D. B. (2017). Satellite-based assessment of yield variation and its determinants in smallholder African systems. PNAS, 114(9). https://doi.org/10.1073/pnas.1616919114

## Mapas de rendimiento de trigo con Sentinel-2 y monitores de cosecha (Reino Unido)
Hunt, Blackburn, Carrasco, Redhead y Rowland (2019) produjeron mapas de rendimiento de trigo a 10 m en Reino Unido con Sentinel-2 y un modelo de bosque aleatorio. Su conjunto de entrenamiento y validación fueron 39 campos de trigo, con más de 8 000 puntos registrados por monitores de rendimiento instalados en
combinadas. Según el resumen consultado, con Sentinel-2 solo el error fue de 0.66 t/ha, y al añadir variables ambientales (meteorología, topografía y humedad del suelo durante la temporada) bajó a 0.61 t/ha. Los autores señalan también que, con pocos campos bien medidos, el modelo puede estimar la variabilidad del
rendimiento dentro de un paisaje. Para el proyecto, la lección es que el monitor de cosecha es una etiqueta por punto con error de medición propio, que no equivale a una estadística de municipio. Los resultados son de trigo en Reino Unido y no son comparables con las 138 parcelas del reto, que son de cebada en México.
Es literatura, no un resultado de nuestros experimentos.
Fuente: Hunt, M. L., Blackburn, G. A., Carrasco, L., Redhead, J. W., Rowland, C. S. (2019). High resolution wheat yield mapping using Sentinel-2. Remote Sensing of Environment 233:111410, DOI 10.1016/j.rse.2019.111410 (metadatos de Crossref; cifras del resumen de búsqueda, no del texto completo).

## Validar modelos de rendimiento con pocos años de datos
Con pocas observaciones anuales, la validación de un modelo de rendimiento es inestable. Un artículo de Geoscientific Model Development (2022) señala que unos 20 registros anuales son pocos para modelos guiados por datos, y que con muestras pequeñas es difícil tanto elegir el modelo como evaluar su calidad. Propone una
validación cruzada anidada de dejar dos fuera (leave-two-out), de modo que cada partición de prueba contenga datos que no intervinieron al elegir hiperparámetros. Para el proyecto, esto coincide con lo que documenta esta ficha: cuando el número de años o de localidades es bajo, el error depende de qué años quedan en
prueba, y el conteo de parcelas sobreestima la información independiente si varias comparten campaña o localidad. Un resultado con 138 parcelas no equivale a 138 casos independientes. La fuente propone un procedimiento de evaluación; no aporta una cifra de desempeño transferible a la cebada de temporal.
Fuente: Geoscientific Model Development 15(9), artículo 3519, 2022, DOI 10.5194/gmd-15-3519-2022 (DOI inferido de la URL; resumen consultado en búsqueda; título y autores no obtenidos).

## Rendimiento en leave-one-year-out: el caso de TabPFN frente a un pipeline clásico (maíz)
Sabo et al. (2026, Scientific Reports, DOI 10.1038/s41598-026-50338-z) pronostican el rendimiento de cultivos de verano en Sudáfrica con FAPAR decádico, humedad del suelo y clima en malla, y validan dejando un año fuera. Para el maíz, el mejor modelo de aprendizaje automático tuvo 6.8 % de rRMSEp y TabPFN 8.8 %; a
escala nacional, los R² fueron 0.91 y 0.86 respectivamente. El rRMSEp es el RMSE dividido entre el rendimiento medio observado, calculado sobre todos los años y provincias. Los autores argumentan que TabPFN compensa su menor precisión con menor tiempo de ajuste y menos ingeniería de variables. La lección para el reto
es doble: con datos limitados, un modelo preentrenado puede ser una línea base competitiva, y diferencias de un par de puntos porcentuales deben evaluarse con intervalos y no como ganadores. Los resultados son de maíz en Sudáfrica, no de cebada en México. Esta cifra corrige la versión previa de esta ficha (8.9 % frente
a 7.4 %).
Fuente: Sabo, F. et al. (2026). From rows to yields: how foundation models for tabular data simplify crop yield prediction. Scientific Reports, DOI 10.1038/s41598-026-50338-z (texto consultado en el repositorio JRC142524).

## Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** "El RMSE bajó de 0.471 a 0.468; el modelo nuevo es mejor." → **Corrección:** Con n = 138 el error estándar del RMSE es ≈ 0.029 t/ha y la diferencia de 0.003 no es distinguible sin prueba pareada y repeticiones (validación de muestras pequeñas del proyecto).
- **Afirmación errónea:** "Apilar las predicciones de validación cruzada da una evaluación honesta." → **Corrección:** El apilamiento requiere predicciones fuera de pliegue sin la etiqueta propia y evaluación anidada; en nuestra auditoría el margen para apilar era de 0.0003 in-sample.
- **Afirmación errónea:** "Como la variable explica bien las etiquetas, la validación cruzada la confirma." → **Corrección:** Si la variable se eligió con las mismas etiquetas, la validación está contaminada; la auditoría de área mostró que la correlación de −0.225 usó las 21 particiones, incluidas las de confirmación.
- **Afirmación errónea:** "Excluir las dos parcelas de mayor error es una prueba de robustez." → **Corrección:** Esa exclusión puede dejar intacta una ganancia (−0.310 en la auditoría); hay que excluir también el mayor contribuyente y los que más ayudan.
- **Afirmación errónea:** "El RMSE global es bajo, luego el modelo funciona en todos los municipios." → **Corrección:** Desglosar por municipio: en Calpulalpan las predicciones casi no varían y no tienen habilidad dentro del municipio.
- **Afirmación errónea:** "Redondear las predicciones a 0.5 mejora el RMSE." → **Corrección:** Solo ayuda con desviación predictiva menor que ≈ h/8 (0.065); con σ ≈ 0.47 empeora (0.495 frente a 0.516).
- **Afirmación errónea:** "El mínimo del error de validación cruzada es una buena estimación del desempeño." → **Corrección:** Está sesgado a la baja; la BBC-CV estimó +0.0028 t/ha de efecto de selección.
- **Afirmación errónea:** "Un intervalo conforme siempre tiene la cobertura prometida." → **Corrección:** La garantía es marginal, bajo intercambiabilidad, y no cubre dependencia espacial ni cobertura por parcela.
- **Afirmación errónea:** "El ruido de las etiquetas redondeadas explica el RMSE." → **Corrección:** El redondeo explica como máximo unos 0.007 del MSE; la mayor parte del error es variación dentro de municipio.
- **Afirmación errónea:** "Como Ploton et al. (2020) muestran que la validación no espacial sobreestima, la validación espacial siempre es la correcta." → **Corrección:** Wadoux et al. (2021) cuestionan la validación espacial como estimador de exactitud de un mapa; la elección depende de la pregunta que se quiere
  responder.
- **Afirmación errónea:** "Un R² alto en validación aleatoria garantiza que el modelo sirve en municipios sin observaciones." → **Corrección:** Roberts et al. (2017) y Ploton et al. (2020) muestran que la validación aleatoria puede sobreestimar la capacidad para predecir en zonas nuevas.
- **Afirmación errónea:** "El estimador de Stein reduce siempre el error a la mitad." → **Corrección:** Efron y Morris (1975) reportan un error cuadrático menor que la mitad en sus ejemplos; la ganancia depende de la estructura de varianzas, y en nuestro conjunto es pequeña.
- **Afirmación errónea:** "«BBC-CV» es el título del artículo de Tsamardinos et al. (2018)." → **Corrección:** El título es «Bootstrapping the out-of-sample predictions for efficient and accurate cross-validation»; la versión publicada usa BBCD-CV para la variante con descarte.
- **Afirmación errónea:** "Wang y Heitjan (2008) demuestran heaping en rendimientos agrícolas." → **Corrección:** Su estudio trata conteos de cigarros autorreportados; sirve como referencia metodológica, no como evidencia para rendimientos.

## Preguntas y respuestas

**P:** ¿Por qué no basta un k-fold aleatorio para evaluar el modelo?
**R:** Porque las parcelas están agrupadas por municipio, productor y localidad; un k-fold aleatorio puede subestimar el error si el despliegue requiere estimar municipios no observados. Conviene reportar también la partición por municipio o espacial.

**P:** ¿Qué error estándar tiene el RMSE con 138 parcelas?
**R:** Con desviación de error cercana a 0.474 t/ha, el error estándar aproximado es 0.474/√276 ≈ 0.029 t/ha (aproximación heurística de las notas de métodos).

**P:** ¿Por qué una mejora de 0.003 t/ha no es significativa?
**R:** Porque es igual al error estándar de la comparación única (0.0030) y una décima parte del error estándar del RMSE (≈ 0.029), y cae dentro del ruido de muestreo de la métrica (desviación de 0.0045 en remuestreos de 59 parcelas). Solo se reporta como empate.

**P:** ¿Qué es la maldición del ganador en nuestros experimentos?
**R:** Es el sesgo por elegir el mejor de muchos candidatos. La corrección BBC-CV estimó que el mejor candidato resultó +0.0028 t/ha peor que la referencia fuera de bolsa.

**P:** ¿Qué diferencia hay entre fuga de información y sesgo de selección?
**R:** La fuga es que información de la prueba entra al entrenamiento o a la selección; el sesgo de selección es el optimismo al elegir el mejor de muchos candidatos, aunque ninguno use información de prueba. Ambos inflan la evaluación.

**P:** ¿Cuál es la distribución de parcelas por municipio?
**R:** Chignahuapan 71, Calpulalpan 30, Singuilucan 16, Almoloya 10, Cuautepec de Hinojosa 5, Emiliano Zapata 3, y Apan, Tepeapulco y Nanacamilpa una cada una; total 138 de entrenamiento.

**P:** ¿Por qué no se adoptó el prior de SIAP?
**R:** Porque la correlación entre el rendimiento medio de las parcelas y el SIAP fue negativa (−0.22 con la historia y −0.49 con 2025), y su ganancia en validación dependió de dos municipios de una sola parcela.

**P:** ¿Cuánto explica el redondeo del rendimiento en el RMSE?
**R:** Con h = 0.5, la varianza del redondeo es 0.0208 (t/ha)². Según las notas, su aporte es menor que 0.007 del MSE, con 45 de 138 etiquetas (32.6 %) exactamente sobre la rejilla de 0.5 t/ha.

**P:** ¿Conviene redondear nuestras predicciones a la rejilla de 0.5?
**R:** Solo si la desviación predictiva es menor que alrededor de 0.065 t/ha. Con la nuestra, empeora el RMSE; la mejora de validación es un artefacto de la media del municipio y no debe reportarse como mejora de RMSE.

**P:** ¿Qué es BBC-CV y qué estimó?
**R:** Es una corrección de la validación cruzada por bootstrap de las predicciones fuera de pliegue de todos los candidatos (familia de Tsamardinos et al., 2018). Estimó un efecto de selección de +0.0027 a +0.0028 t/ha frente a la referencia C2.

**P:** ¿Por qué fijar el signo esperado antes de evaluar un coeficiente?
**R:** Porque un criterio que solo exige que el signo sea estable acepta también efectos con signo contrario al mecanismo. Un efecto con signo opuesto debe contar como rechazo.

**P:** ¿Vale la pena seguir iterando sobre las mismas 138 parcelas?
**R:** Según la auditoría de valor esperado, cada candidato adicional aportaba del orden de milésimas de t/ha, con poca capacidad para detectar efectos de 0.002, y el sesgo de selección crece con cada consulta. La recomendación es priorizar la justificación técnica y la validación de calidad.

**P:** ¿Qué validación recomienda la literatura para mapas de variables ecológicas con datos agrupados?
**R:** Roberts et al. (2017) recomiendan validación por bloques cuando hay estructura de dependencia; Ploton et al. (2020) muestran que la validación no espacial puede sobreestimar el poder predictivo; Wadoux et al. (2021) cuestionan la validación espacial como estimador de exactitud y proponen muestreo probabilístico.
Conviene declarar qué pregunta responde la cifra antes de elegir la partición.

**P:** ¿Qué es el área de aplicabilidad de un modelo espacial?
**R:** Es la zona en la que el modelo aprendió de datos parecidos a los de entrenamiento, según Meyer y Pebesma (2021), que la definen con un índice de distancia en el espacio de predictores. Las predicciones fuera de esa zona no deben presentarse como confiables.

**P:** ¿Qué es la fuga de datos según Kaufman et al. (2012)?
**R:** Es cuando el modelo tiene acceso a información relacionada con el objetivo que no tendría al predecir en la práctica. Su remedio es separar el aprendizaje de la predicción con un manejo cuidadoso de los datos.

**P:** ¿Cuántos campos y artículos tenían fuga según Kapoor y Narayanan (2023)?
**R:** Según la versión publicada en Patterns, 294 artículos en 17 campos; el preprint reportaba 329. Los autores la clasifican en ocho tipos.

**P:** ¿Las cifras de Lobell et al. (2020) para Uganda están verificadas?
**R:** No. El artículo existe y compara rendimientos autorreportados con cortes de subparcela y de parcela completa, pero las cifras de 1,826, 728 y 676 kg/ha no pudieron confirmarse en el texto consultado.

**P:** ¿Por qué la contracción de Efron y Morris no garantiza una mejora en nuestro caso?
**R:** Porque su ganancia depende de cuánta información aporta cada grupo frente a la variación entre grupos. Con nuestros datos, la contracción solo importa para municipios de pocas parcelas (con 71 parcelas en Chignahuapan el prior casi no pesa), y recupera como máximo unas 0.01 t/ha de RMSE.
