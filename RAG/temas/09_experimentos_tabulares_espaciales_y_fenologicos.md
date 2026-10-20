---
id: rag-09-experimentos-tabulares
titulo: "Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones"
categoria: experimentos
etiquetas: [experimentos, validación cruzada, rmse, kumo, modelos fundacionales, regresión espacial, fenología, señal intramunicipal, lluvia, ndvi, mtci, área de parcela, techo de error]
idioma: es
fecha: 2026-10-18
fuentes_internas: [experimentos_tabulares/spatial_regression__README.md, experimentos_tabulares/modelado__WITHIN_MUNICIPALITY.md, experimentos_tabulares/modelado__CANOPY_JOINT.md, experimentos_tabulares/modelado__CROSS_SENSOR.md, experimentos_tabulares/modelado__CROPLAND_PRETRAINING.md,
experimentos_tabulares/modelado__KUMO.md, experimentos_tabulares/modelado__KUMO_V2.md, experimentos_tabulares/modelado__KUMO_RAINFED.md, experimentos_tabulares/modelado__GPU_EXPERIMENTS.md, experimentos_tabulares/literature_vars_20261017__README.md, experimentos_tabulares/iterate_20261017__research__A3_headroom.md,
experimentos_tabulares/iterate_20261017__research__A5_kumo.md, experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md, experimentos_tabulares/iterate_20261017__research__B4_foundation_models.md, experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md,
experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md]
fuentes_externas:
  - "Ma, Y., Shen, Y., Swatantran, A., Lobell, D. B. (2025, enviado 30 dic; citado como 2026 en el corpus). Harvesting AlphaEarth: Benchmarking the Geospatial Foundation Model for Agricultural Downstream Tasks. arXiv:2601.00857. https://arxiv.org/abs/2601.00857"
  - "Nedungadi, V., Xiong, X., Potze, A., Van Bree, R., Lin, T., Rußwurm, M., Athanasiadis, I. N. (2025). From General to Specialized: The Need for Foundational Models in Agriculture. arXiv:2507.05390 (SEA Workshop, ICCV 2025). https://arxiv.org/html/2507.05390v2"
  - "Nedungadi, V., Xiong, X., Rußwurm, M., Athanasiadis, I. N. (2026). Foundation Models Meet Agriculture: Challenges Beyond Pretraining. arXiv:2608.30392. https://arxiv.org/abs/2608.30392"
  - "Hollmann, N., Müller, S., Purucker, L., Krishnakumar, A., Körfer, M., Hoo, S. B., Schirrmeister, R. T., Hutter, F. (2025). Accurate predictions on small data with a tabular foundation model. Nature 637, 319-326. DOI 10.1038/s41586-024-08328-6"
  - "Hollmann, N., Müller, S., Eggensperger, K., Hutter, F. (2022/2023). TabPFN: A Transformer That Solves Small Tabular Classification Problems in a Second. arXiv:2207.01848. https://arxiv.org/abs/2207.01848"
  - "Chen, T., Guestrin, C. (2016). XGBoost: A Scalable Tree Boosting System. KDD 2016. DOI 10.1145/2939672.2939785. arXiv:1603.02754"
  - "Monteith, J. L. (1972). Solar radiation and productivity in tropical ecosystems. Journal of Applied Ecology 9, 747-766. https://britishecologicalsociety.org/applied-ecology-resources/document/19730706997"
  - "Rasmussen, C. E., Williams, C. K. I. (2006). Gaussian Processes for Machine Learning. MIT Press. ISBN 0-262-18253-X"
  - "Bates, D., Mächler, M., Bolker, B., Walker, S. (2015). Fitting Linear Mixed-Effects Models Using lme4. Journal of Statistical Software 67(1), 1-48. https://www.jstatsoft.org/article/view/v067i01"
  - "Sabo, F., Meroni, M., Piles, M., Claverie, M., Ferreira, F., Van Den Berg, E., Collivignarelli, F., Rembold, F. (2025). From Rows to Yields: How Foundation Models for Tabular Data Simplify Crop Yield Prediction. arXiv:2506.19046. https://arxiv.org/abs/2506.19046"
  - "Jeong, J. H., Resop, J. P., Mueller, N. D., Fleisher, D. H., Yun, K., Butler, E. E., Timlin, D. J., Shim, K.-M., Gerber, J. S., Reddy, V. R., Kim, S.-H. (2016). Random Forests for Global and Regional Crop Yield Predictions. PLoS ONE 11(6): e0156571. DOI 10.1371/journal.pone.0156571"
  - "Crane-Droesch, A. (2018). Machine learning methods for crop yield prediction and climate change impact assessment in agriculture. Environmental Research Letters 13, 114003. DOI 10.1088/1748-9326/aae159"
  - "NVIDIA. Kumo Tabular model card. https://build.nvidia.com/nvidia/kumo-tabular/modelcard"
  - "Prior Labs. TabPFN, README del repositorio (licencias de pesos TabPFN-2.5 a TabPFN-3.5). https://cdn.jsdelivr.net/gh/PriorLabs/TabPFN@main/README.md"
  - "ESA WorldCover 2021 (v200). https://esa-worldcover.org/en/data-access; manual del producto WorldCover v2.0, https://esa-worldcover.s3.eu-central-1.amazonaws.com/v200/2021/docs/WorldCover_PUM_V2.0.pdf"
  - "Imran, H. A., Stein, A. y Zurita-Milla, R. (2015). Using geographically weighted regression kriging for crop yield mapping in West Africa. International Journal of Geographical Information Science 29: 234-257. doi:10.1080/13658816.2014.959522"
  - "Revista CERES (2026). Gaussian process regression as an alternative to kriging and SVM for spatial yield prediction. doi:10.71252/2177-34912026730004"
  - "Climate (2024). A Common Climate-Yield Relationship for Wheat and Barley in Japan and the United Kingdom. doi:10.3390/cli12080125"
  - "McMaster, G. S. y Wilhelm, W. W. (1997). Growing degree-days: one equation, two interpretations. Agricultural and Forest Meteorology 87: 291-300. doi:10.1016/S0168-1923(97)00027-0"
  - "Desiere, S. y Jolliffe, D. (2018). Land productivity and plot size: Is measurement error driving the inverse relationship? Journal of Development Economics 130: 84-98. doi:10.1016/j.jdeveco.2017.10.002"
  - "Carletto, C., Savastano, S. y Zezza, A. (2013). Fact or artifact: The impact of measurement errors on the farm size-productivity relationship. Journal of Development Economics 103: 254-261. doi:10.1016/j.jdeveco.2013.03.004"
  - "Kimhi, A. (2006). Plot size and maize productivity in Zambia: is there an inverse relationship? Agricultural Economics 35: 1-9. doi:10.1111/j.1574-0862.2006.00133.x"
  - "Bevis, L. E. M. y Barrett, C. B. (2020). Close to the edge: High productivity at plot peripheries and the inverse size-productivity relationship. Journal of Development Economics 143: 102377. doi:10.1016/j.jdeveco.2019.102377"
  - "Lowder, S. K., Skoet, J. y Raney, T. (2016). The Number, Size, and Distribution of Farms, Smallholder Farms, and Family Farms Worldwide. World Development 87: 16-29. doi:10.1016/j.worlddev.2015.10.041"
  - "Ajae (2023). Revisiting the size-productivity relationship with imperfect measures of production and plot size. American Journal of Agricultural Economics. doi:10.1111/ajae.12417"
  - "Sugasawa, S. y Kubokawa, T. (2023), Basic Mixed-Effects Models for Small Area Estimation, SpringerBriefs in Statistics, pp. 37-56, doi:10.1007/978-981-19-9486-9_4"
  - "Zimmermann, S. y Münnich, R. (2018), Small Area Estimation with a Lognormal Mixed Model under Informative Sampling, Journal of Official Statistics 34(2): 523-542, doi:10.2478/jos-2018-0024"
  - "Revista Ceres (2026), doi:10.71252/2177-34912026730004 (metadatos verificados en Crossref, 16 mar 2026)"
---


**Resumen.** Este documento resume los experimentos tabulares, espaciales y fenológicos del proyecto FIRA 2026 "Reto AgroCebada", que predice el rendimiento de cebada maltera de temporal en Hidalgo, Puebla y Tlaxcala a partir de 138 parcelas con rendimiento conocido; la métrica principal es el RMSE en t/ha. Ninguno de
nuestros experimentos superó de forma robusta la referencia del proyecto ni alcanzó la meta de mejora de 30 % sobre la línea base. Los modelos fundacionales (Kumo, TabPFN, embeddings satelitales) y las curvas fenológicas no añadieron señal demostrable dentro de los municipios. El error se concentra entre municipios y
en unas pocas parcelas con fallas de cultivo, por lo que estimamos un techo práctico de RMSE de 0.465 a 0.470 t/ha en validación cruzada.


## Glosario de validación: OOF, pliegues, splits y métricas

En nuestros experimentos, "OOF" (out-of-fold, predicción fuera de pliegue) es la predicción de cada parcela hecha por un modelo que no la vio durante el entrenamiento. Un "pliegue" o "fold" es uno de los bloques en que se reparten las 138 parcelas etiquetadas; los "pliegues canónicos" son los cinco de 80/20 que fija el
proyecto. Un "split" es una partición nueva y aleatoria con la que repetimos la prueba, normalmente 10 o 20 veces. RMSE (raíz del error cuadrático medio, en t/ha) penaliza más los errores grandes y es la métrica principal; MAE (error absoluto medio) penaliza de forma lineal; R² indica la fracción de la varianza
explicada. El bootstrap remuestrea parcelas con reemplazo para estimar incertidumbre; una prueba de permutación reasigna etiquetas al azar para construir la distribución nula; BH (Benjamini-Hochberg) corrige por comparaciones múltiples controlando la proporción de falsos descubrimientos.

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md; experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md; experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md


## Glosario de métodos citados en los experimentos

Ridge es una regresión lineal con penalización L2 que encoge los coeficientes hacia cero; es nuestra referencia lineal. Un proceso gaussiano (GP) predice con una función de covarianza o kernel; en la regresión espacial usamos un kernel exponencial, de modo que parcelas cercanas comparten información. GLS (mínimos
cuadrados generalizados) admite errores correlacionados en el espacio. XGBoost, LightGBM y CatBoost son métodos de árboles con refuerzo secuencial sobre tablas; ExtraTrees promedia árboles aleatorios; kNN predice con los vecinos más cercanos. PCA reduce columnas a componentes principales. TabPFN (Hollmann et al. 2023,
arXiv:2207.01848; Nature 2025) es un transformador
preentrenado con tablas sintéticas que predice sin entrenar pesos nuevos por conjunto de datos. Kumo-Tabular de NVIDIA es un modelo tabular de pesos abiertos (licencia OpenMDW 1.1, según su ficha en NVIDIA) que, en nuestros experimentos, se ajustó por completo; predice 999 cuantiles y, según la documentación del
proyecto, se entrena con pérdida pinball (no verificado: la ficha pública de NVIDIA, revisada en la ronda 3, no menciona pérdida pinball ni función de pérdida, solo salidas de 999 cuantiles), que promedia el error de cada cuantil. La "mediana"
de Kumo es el cuantil 500.

Fuente: experimentos_tabulares/spatial_regression__README.md; experimentos_tabulares/modelado__KUMO_V2.md; experimentos_tabulares/iterate_20261017__research__A5_kumo.md


## Mapa de experimentos del proyecto y su pregunta

Cada experimento respondió una pregunta distinta. La regresión espacial con índice APAR preguntó si la luz absorbida por el dosel explica el rendimiento. El centrado dentro de municipio preguntó si quitar las diferencias entre municipios revela diferencias entre parcelas. CANOPY_JOINT midió la covarianza entre índices
dentro de cada parcela. CROSS_SENSOR comparó Sentinel-2 con PlanetScope en fechas cercanas. CROPLAND_PRETRAINING ponderó el contexto municipal hacia la superficie agrícola. Kumo probó si un modelo tabular preentrenado con registros municipales SIAP ayuda a las parcelas. Kumo rainfed construyó un corpus de más de un
millón de rendimientos. Las campañas de GPU midieron el modelo conjunto. Las variables de literatura probaron los índices recomendados por la bibliografía. M1 y M2 estudiaron la curva fenológica. A3, A5 y A6 auditaron la señal y el margen de mejora, y B4 evaluó embeddings de modelos fundacionales.

Fuente: experimentos_tabulares/spatial_regression__README.md; experimentos_tabulares/modelado__CANOPY_JOINT.md; experimentos_tabulares/modelado__CROSS_SENSOR.md; experimentos_tabulares/modelado__CROPLAND_PRETRAINING.md; experimentos_tabulares/modelado__KUMO_RAINFED.md;
experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md


## Regresión espacial con el índice de luz absorbida APAR

Esta prueba partió de imágenes HLS de 2025 (seis bandas) y de un modelo de hoja con valores típicos de hojas de cebada, PROSPECT-D, acoplado a un modelo de dosel 4SAIL. Con una tabla de consulta de 30,000 dosel simulados, por cada fecha despejada obtuvimos el fAPAR (fracción de radiación fotosintéticamente activa
absorbida). El índice "apar_dj" es la media estacional del fAPAR entre el 15 de junio y el 27 de octubre de 2025, es decir, la fracción acumulada de luz absorbida. Su correlación de Spearman entre tablas con clorofila fija en 30 y en 60 fue de 0.997, de modo que depende poco de la clorofila desconocida de la variedad.
El modelo base era un GP espacial con tendencia GLS y efectos de municipio y estado; probamos añadir NDVI, el índice APAR y las seis bandas, en 20 splits. No documentado: el corpus no detalla cómo se calcula la Δ respecto a la referencia M0.

Los resultados de RMSE medio sobre 20 splits (t/ha) fueron: M1 con NDVI 0.5140 (Δ −0.0049; mejor que la referencia en 0 de 20 splits); M2 con índice APAR 0.5135 (Δ −0.0043; 0/20); M3 con NDVI y APAR 0.5172 (Δ −0.0080; 0/20); M4 con las seis bandas HLS 0.5279 (Δ −0.0187; 0/20); M5 con bandas y APAR 0.5295 (Δ −0.0203;
0/20); y M3 con ventana de llenado de grano del 15 de agosto al 27 de octubre 0.5154 (Δ −0.0062; 1/20). La correlación dentro de municipios (con al menos 12 etiquetas) fue de −0.11 para NDVI y −0.14 para APAR; en la ventana de llenado de grano fue de +0.05 y +0.03. La conclusión del proyecto es que el dosel que captó
más luz no produjo más grano en 2025, y que el GP ya capta el nivel municipal, donde está la señal del NDVI; las covariables sólo añaden varianza.

Fuente: experimentos_tabulares/spatial_regression__README.md


## Centrado dentro de municipio con 2,968 columnas

Este experimento (WITHIN_MUNICIPALITY) reunió 2,968 columnas de nueve archivos verificados: historia óptica original, fenología de Planet, datos ópticos por fase, geometría y terreno, clima y exposiciones de vegetación, espectros conjuntos y MRA entregado. Para cada variable calculamos un centro global y un centro por
municipio con contracción (shrinkage 0 o 5), y lo restamos antes de ajustar. Ese centro se estima solo con filas de entrenamiento; los municipios no vistos usan el centro global. Probamos 52 candidatos, con ridge, selección de columnas, PCA con kernel RBF y CatBoost, y una selección interna con tres subpliegues dentro
de cada pliegue canónico. El municipio no entra como variable numérica y los identificadores de parcela quedan excluidos. Se usaron 3,437 registros municipales de temporal primavera-verano, de 1,791 años-municipio, para preentrenar el contexto.

Con la selección primaria por RMSE interno, el mejor candidato obtuvo MAE 0.364310, RMSE 0.506110 t/ha y R² 0.643857. Seleccionar por MAE interno dio 0.358898 / 0.503160 / 0.647996, y promediar los tres mejores candidatos internos dio 0.357858 / 0.503259 / 0.647858. Ninguna variante mejoró la línea base fija ni alcanzó
la meta del 30 %, así que no se promovió. Un diagnóstico del ancla de atención mostró RMSE de ajuste entre 0.431 y 0.492 y RMSE fuera de muestra entre 0.394 y 0.590 según el pliegue; esto no apoya que una brecha grande de optimismo explique el fracaso de los modelos residuales. En estos datos, quitar niveles
municipales no reveló una señal intramunicipal que mejore la predicción.

Fuente: experimentos_tabulares/modelado__WITHIN_MUNICIPALITY.md


## Relaciones espectrales conjuntas dentro de la parcela (CANOPY_JOINT)

CANOPY_JOINT extrajo información que comparten varias imágenes de Sentinel-2 de 2022 a 2025, dentro de cada parcela, en celdas de 20 m. Calculó NDVI, NDRE, NDMI y MSI; para cada parcela obtuvo cuatro medias ponderadas por área, tres covarianzas, correlaciones y pendientes entre índices, y estadísticas en subconjuntos
de vegetación densa (NDVI mayor que 0.2 y 0.5). Son 756 columnas para 197 parcelas, con un soporte mínimo de 50 % del área. Estas variables describen mezclas espectrales, no cobertura de cebada, daño ni nitrógeno. Se ajustaron 80 modelos Daily, 411 de atención y 210 estadísticos, con cuatro recetas Daily y atenciones
de dos o cuatro cabezas.

La atención primaria obtuvo MAE 0.344238, RMSE 0.490955 t/ha y R² 0.664866. Su variante seleccionada por MAE alcanzó 0.332045 / 0.481819 / 0.677222: menor RMSE pero mayor MAE que la línea base fija. El procedimiento estadístico primario obtuvo 0.350804 / 0.495321 / 0.658879. Ningún procedimiento cumplió los umbrales de
mejora de 30 % y la línea base se mantuvo. Este resultado debe leerse como exploratorio, porque los mismos pliegues de 2025 se usaron repetidamente. Para el proyecto, la lección es que las covarianzas espectrales intraparcela no revelan rendimiento, aunque sí describen la heterogeneidad de la parcela.

Fuente: experimentos_tabulares/modelado__CANOPY_JOINT.md


## Sensores cruzados: Sentinel-2 contra PlanetScope (CROSS_SENSOR)

CROSS_SENSOR preguntó si las diferencias entre Sentinel y Planet en fechas cercanas aportan información. Emparejamos observaciones de ambos productos con como máximo dos días de separación, sin interpolar ni arrastrar extremos, y cada observación se usó una sola vez: 8,837 pares para las 197 parcelas, con 445
variables. Las diferencias de índices (NDVI, EVI y LAI) se resumieron por ventana: diferencia mediana con signo, desviación, correlación de Pearson y deriva de 30 días. Las diferencias no se tratan como daño medido, porque reflejan respuesta espectral, tamaño de píxel y procesamiento distintos. La búsqueda declaró 13
configuraciones con selección interna en tres subpliegues y 210 ajustes auditados. Cada modelo corregía la predicción del modelo original de atención.

La configuración primaria obtuvo MAE 0.355416, RMSE 0.507008 t/ha y R² 0.642592. Los tres mejores procedimientos internos dieron 0.352152 / 0.507155 / 0.642385. Ninguno mejoró la línea base ni alcanzó la meta de 30 %. Un diagnóstico con TabPFN 3.5 congelado, usando las 445 variables, dio con la media MAE 0.355986, RMSE
0.512704 y R² 0.634515; con la mediana, 0.332336 / 0.503646 / 0.647316, también sin mejora. El uso de TabPFN 3.5 está limitado por una licencia no comercial (verificado en el README de Prior Labs, que indica que los pesos de TabPFN-3.5 son no comerciales y que la producción requiere una licencia comercial aparte), por
lo que no se promovió. Conclusión: las diferencias entre sensores son reales pero no ayudan a predecir el rendimiento de estas parcelas.

Fuente: experimentos_tabulares/modelado__CROSS_SENSOR.md


## Ponderación de contexto hacia superficie agrícola (CROPLAND_PRETRAINING)

Este experimento reemplazó el soporte espacial de los municipios, que incluía bosque y asentamientos, por pesos de la cobertura ESA WorldCover 2021, clase 40 (cultivo anual; la versión 2021 v200 y el código 40 se verificaron en el manual del producto WorldCover v2.0 en la ronda 3, donde la clase 40 es «Cropland»,
cultivo anual sembrado y cosechado). Probamos dos perfiles: "soft", que multiplica el área de superposición por la fracción muestreada de cultivo, y "majority", que retiene sólo
celdas con al menos 50 % de cultivo. Ambos perfiles preentrenaron el modelo MMST durante 36 épocas sobre 1,791 registros temporales de primavera-verano, con tres semillas, y luego se ajustaron por pliegue. WorldCover es una máscara de cultivo anual; no es un mapa de cebada ni de temporal y, como es de 2021, aplicarla a
años anteriores es una restricción retrospectiva de dominio. Los datos de FIRA y las 27 variables de AgERA5 no cambiaron.

El MMST con perfil soft obtuvo MAE 0.379000, RMSE 0.556481 y R² 0.569437; el perfil majority, 0.351485 / 0.511730 / 0.635903. En la atención, el procedimiento primario soft_2 obtuvo 0.391157 / 0.516587 / 0.628959; soft_4, 0.391755 / 0.515297 / 0.630809; majority_2, 0.403958 / 0.521035 / 0.622542, y majority_4, 0.401606
/ 0.520196 / 0.623756. Ningún procedimiento mejoró la línea base fijada ni la meta de 30 %, y no se promovió ningún modelo de reemplazo. El perfil majority mejoró el MMST frente al soft, pero sus cifras de atención quedaron por encima de la línea base.

Fuente: experimentos_tabulares/modelado__CROPLAND_PRETRAINING.md


## Kumo, primer estudio: diseño y resultados

Kumo (NVIDIA Kumo-Tabular, versión small) es un modelo tabular de pesos abiertos que en este estudio se ajustó por completo en dos etapas. Primero, 200 episodios de optimización sobre 1,791 registros municipales SIAP de temporal primavera-verano (2003-2024), con 474 columnas numéricas y dos categóricas que resumen
AgERA5, AlphaEarth previo, geografía e historia SIAP. Después, por cada uno de los cinco pliegues canónicos, 100 episodios sobre 110 o 111 parcelas de entrenamiento, con tasa de aprendizaje 1e-5. Se compararon dos inicializaciones: "fira_only", desde los pesos originales de NVIDIA, y "municipal_then_fira", desde el
checkpoint municipal. Los controles de paso 0 usan las etiquetas de entrenamiento como contexto, sin actualizar pesos. Las predicciones usan ocho estimadores y se reportan la media de los 999 cuantiles y la mediana.

El primario declarado, Kumo canopy_mra con adaptación municipal y paso 100 en media, obtuvo MAE 0.403162, RMSE 0.558267 t/ha y R² 0.566670. Frente a este, la misma arquitectura solo con datos FIRA alcanzó 0.395159 / 0.537672 / 0.598052, y el Kumo congelado de NVIDIA, 0.380212 / 0.528519 / 0.611620. La adaptación
municipal sin actualizar pesos FIRA dio 0.380850 / 0.522351 / 0.620632. La referencia histórica "aspiring_sota" (atención sobre MMST original y Daily DeepCropNet) obtuvo 0.322601 / 0.489072 / 0.667431, y la atención retenida en 90/10, 0.321798 / 0.487283 / 0.669861. Conclusión: el ajuste fino no superó la referencia, y
el municipio no aportó una ventaja verificable. El MAE de Kumo fue 25 % mayor que el de la referencia.

Fuente: experimentos_tabulares/modelado__KUMO.md


## Kumo versión 2: entradas meteorológicas y alcance de la mejora

La versión 2 añadió resúmenes de AgERA5 de los 27 variables: rachas secas y húmedas, picos de lluvia de 5 y 10 días, conteos de lluvia intensa, extremos de temperatura, grados-día y déficit de precipitación frente a evapotranspiración de referencia. El procedimiento líder, "small_lean_geo_municipal" con diez pasos y
mediana, obtuvo MAE 0.317526, RMSE 0.484850 t/ha y R² 0.673149. Su control "FIRA-only" dio 0.317586 / 0.485121 / 0.672783; la adaptación municipal sin pasos FIRA dio 0.317740 / 0.484330 / 0.673849; Kumo congelado, 0.318874 / 0.485383 / 0.672429; la referencia aspiring_sota, 0.322601 / 0.489072 / 0.667431. La versión
medium, con las entradas meteorológicas directas, obtuvo 0.327020 / 0.497589 / 0.655748. Las campañas pasaron auditorías independientes de las 500 predicciones por pliegue y de las 200 lecturas.

El procedimiento líder reduce el MAE en 0.004272 t/ha (1.33 %) y el RMSE en 0.002433 t/ha (0.50 %) frente a la referencia. Los intervalos pareados por fila al 95 % son [−0.016874, 0.009125] para el MAE y [−0.013490, 0.010861] para el RMSE; ambos incluyen cero. Además, esos intervalos no reflejan la dependencia
geográfica, los contextos de entrenamiento compartidos ni la selección adaptativa de procedimientos. La versión 2 no demuestra superioridad en temporadas o regiones nuevas. Su control FIRA-only tiene prácticamente el mismo resultado, por lo que las entradas meteorológicas no pueden atribuirse el beneficio. Para el
proyecto, Kumo es una señal débil y no una mejora probada.

Fuente: experimentos_tabulares/modelado__KUMO_V2.md


## Kumo sobre lluvia: corpus de rendimientos de temporal

El estudio Kumo rainfed reunió un corpus de fuentes de rendimientos de temporal: SIAP 2003-2024 (338,607 registros distintos de temporal), NASS de Estados Unidos no irrigado (88,351), IBGE de Brasil censo 2006 (46,732), CIMMYT MasAgro (50,616), IWIN (468,175 registros de ensayos), IBGE de cultivos permanentes (13,802)
y MAPA de España (29,945). Las fuentes numéricamente calificadas aportaron 1,036,228 observaciones de rendimiento. Los registros de un mismo dato, como producción, área y rendimiento, no se cuentan dos veces, y un total de un millón no equivale a un millón de parcelas independientes. Las 3,437 filas de cebada
primavera-verano de México son el subconjunto de adaptación. Las 197 parcelas FIRA usan área real entre 0.35 y 64.3 ha, con mediana de 5.46 ha.

Fuente: experimentos_tabulares/modelado__KUMO_RAINFED.md


## Kumo sobre lluvia: entradas y estado del entrenamiento

El esquema activo tiene 486 columnas numéricas y 7 categóricas, que tras la expansión de Kumo quedan en 500 columnas. Incluye 338 columnas de AgERA5 v2 con las 27 variables en ventanas estacionales, 25 de geografía e historia de rendimiento estrictamente anterior, 66 de AlphaEarth previo, 10 de área, 42 de
observaciones ópticas originales, el año y 4 de área de parcela experimental. No hay ninguna columna de riego ni de "Temporal": el régimen sólo se usa para filtrar. Estado al cierre del documento: el corpus y las tablas de preentrenamiento están verificados, pero el entrenamiento completo quedó programado y no hay
evaluación held-out completa. Por tanto, no existe un R² nuevo que reportar. Lo que sí está verificado es que las columnas de área de parcela se conservan.

Fuente: experimentos_tabulares/modelado__KUMO_RAINFED.md


## Kumo sobre lluvia: exclusión de registros y errores de clima

El 15 de octubre de 2026 excluimos 3,336 registros: 13 rendimientos físicamente implausibles (por encima de 200 t/ha, desde 7,000 t/ha en marañón hasta 209 t/ha en plátano) y 3,320 observaciones de trigo IWIN en ambientes con riego completo o suplementario explícito. Tras la exclusión, la tabla de preentrenamiento
quedó en 1,032,892 filas; la desviación estándar del rendimiento bajó de 12.38 a 9.13 t/ha y el máximo es 196.9 t/ha. También detectamos un error en AgERA5 v2: cuatro días de invierno con Tmin mayor que Tmax (la inversión máxima fue de 0.5071 °C) y 169 días con Tmedia menor que Tmin, más dos con Tmedia mayor que Tmax.
El proveedor documenta que las correcciones independientes pueden romper el orden de las temperaturas. Decidimos conservar los valores originales con sus banderas de calidad, sin corregirlos.

Fuente: experimentos_tabulares/modelado__KUMO_RAINFED.md


## Campaña conjunta en GPU: resultados, umbral y advertencias

La campaña conjunta entrenó Kumo y el MMST en un único modelo con 5,338,004,856 parámetros, preentrenado con 3,437 registros nacionales de cebada de temporal de 254 municipios y 18 estados entre 2003 y 2024. Sus dos configuraciones completas dieron R² de 0.648252 para la salida residual conjunta y 0.634960 para la
cabeza de regresión MMST, ambas en las mismas 138 parcelas. Ninguna superó la referencia histórica aspiring_sota (0.667431). Para llegar a R² de 0.85 con la varianza de la meta (0.7192248821494842) el RMSE debe ser de 0.3284565912 t/ha o menos, un nivel que nuestras pruebas no alcanzaron. Esta campaña usó sólo 3,437
registros nacionales; la propia fuente indica que el siguiente requisito es de al menos un millón de ejemplos de preentrenamiento.

Una prueba en la nube, ya cerrada, con cuatro GPUs ejecutó el grafo completo de precisión total; en el primer paso de actualización la pérdida subió de 2.18 a 962.30, lo que indica que la tasa de 1e-4 del MMST era inestable. Las ejecuciones locales usaron BF16 y el optimizador Adafactor con varianza factorizada, con un
pico de 24.58 GiB, pero solo como verificación de software y no como evaluación. La conclusión operativa es que el rendimiento de la campaña no justifica más cómputo sin datos nuevos: la fuente recomienda priorizar la preparación de datos antes de otro entrenamiento.

Fuente: experimentos_tabulares/modelado__GPU_EXPERIMENTS.md


## Kumo recalculado por split: optimismo de los pliegues canónicos

La columna de Kumo que usaban las combinaciones previas está fuera de pliegue solo para los cinco pliegues canónicos, y el marco de evaluación la reutilizó en las 21 divisiones. Como cada división hereda el error de partición de los canónicos, el RMSE de Kumo canónico (0.4848) queda cuarto de 21. Al recalcular Kumo por
división, con la receta exacta de diez pasos, el RMSE fue de 0.4899 en desarrollo y 0.4933 en confirmación; el control sin ajuste FIRA dio 0.4904 y 0.4934. Con Kumo recalculado por split, la versión honesta dio 0.4805 y 0.4820, frente a 0.4793 y 0.4800 de la versión que hereda la columna canónica. El margen sobre la
referencia C2 se mantuvo en 0.0027 (desarrollo) y 0.0032 (confirmación). Lección: las cifras con pliegues reutilizados subestiman el RMSE real por unas milésimas.

Fuente: experimentos_tabulares/iterate_20261017__research__A5_kumo.md


## Kumo relacional y KumoRFM alojado: no recomendados

Investigamos dos variantes relacionales: KumoRelational, un modelo abierto basado en KumoRFM-2 (no verificado en la web), y el KumoRFM alojado. Kumo-Tabular procesa una sola tabla, sin tablas relacionadas, y selecciona como máximo 500 columnas por estimador, así que las relaciones (observaciones por fecha, vecinos,
tablas municipales) tendrían
que aplanarse. Probando el aplanado con Kumo sola obtuvimos 0.4896 frente a 0.4899, con 6 de 10 victorias, pero no pasó la regla de validación, así que no miramos los pliegues de confirmación. KumoRelational necesita librerías de muestreo que no estaban instaladas; la ganancia esperada es de −0.005 a +0.002 y el costo
alrededor de un día. Sobre la licencia del NIM de KumoRFM, la búsqueda de la ronda 4 no encontró términos de licencia no comercial o de investigación (SIN EVIDENCIA; antes figuraba como «no verificado»). La página de Kumo ofrece KumoRFM en un nivel gratuito con API y SDK, sin describir sus condiciones de uso, y la
ficha de NVIDIA de Kumo-Tabular no menciona KumoRFM. Una nota de prensa, de una sola fuente y no verificada, afirma que NVIDIA adquirió Kumo AI; si fuera cierto, las condiciones podrían haber cambiado. La pérdida de entrenamiento de KumoRFM tampoco aparece documentada públicamente (SIN EVIDENCIA). Por eso no lo
recomendamos sin revisar los términos del servicio y las reglas del reto.

Fuente: experimentos_tabulares/iterate_20261017__research__A5_kumo.md


## Variables de literatura: método

El experimento literature_vars probó las variables que la bibliografía asocia con el rendimiento de cebada: vigor y tamaño del dosel alrededor de la floración (NDVI y EVI a 80 días de la siembra, GCVI al encañado), índices de borde rojo para el llenado de grano (CIRE, NDRE740, MTCI) e índices de humedad SWIR (NDMI,
MSI). Usamos también versiones ancladas al pico de NDVI de cada parcela y siete variables de PlanetScope (LAI, NDVI y EVI). En total hubo 26 variables candidatas. Cada variable se probó sola y con selección hacia adelante: sólo entra si baja el RMSE medio de las divisiones en al menos 0.001. La corrección
intramunicipal usó una ridge sobre los residuos del modelo base, con penalización por validación cruzada dejando uno fuera. El modelo base era C2, con RMSE de 0.4793 en las 10 divisiones frescas.

Fuente: experimentos_tabulares/literature_vars_20261017__README.md


## Variables de literatura: error de fechas en Planet corregido

Detectamos un error en el script que construye las variables: leía la columna de fecha de captura de PlanetScope, en formato día/mes/año, con análisis de mes primero. De las 47,804 filas, 28,304 quedaron sin fecha (los días mayores que 12) y 17,835 tenían día y mes intercambiados; sólo 1,665 (día igual a mes) eran
correctas. De las 31,708 filas despejadas de 2025, sólo 12,789 llegaron a las curvas, y 11,566 de ellas con fecha equivocada. El error afectó sólo a las 7 variables planet_*. Tras corregirlo, la conclusión no cambió: las siete variables corregidas dieron RMSE medios peores que C2, y la mejor, planet_evi_flower_pk, dio
0.4799 frente a 0.4793. Antes de la corrección, la aparente concordancia entre sensores se apoyaba en fechas revueltas; con fechas correctas, Sentinel, HLS y Planet coinciden.

Fuente: experimentos_tabulares/literature_vars_20261017__README.md


## Variables de literatura: resultados por ruta

En la ruta 1, ninguna variable individual bajó el RMSE de C2 (0.4793): la mejor, ndmi_grain_fill, empató con 0/10 victorias, y la selección hacia adelante no eligió nada. En la ruta 2, con XGBoost, el conjunto literal (sincronizado a la siembra, 9 variables) dio RMSE medio 0.4807 y 3/10 victorias, con probabilidad de
mejora por bloques de 0.34; el conjunto anclado al pico, 0.4835 (0/10; P 0.10); y las 19 variables, 0.4841 (0/10; P 0.11). Dentro de municipios, la señal aparece en Singuilucan (un dosel más verde en floración, y más índice de borde rojo y humedad SWIR en el llenado de grano, se asocian con mayor rendimiento), pero no
en Chignahuapan, donde hay 71 etiquetas y las correlaciones son ≤0.17. Calpulalpan tiene rendimientos redondeados a 2.5, 3.0 y 3.5 t/ha.

Fuente: experimentos_tabulares/literature_vars_20261017__README.md


## Descomposición del error: dónde está el error

El análisis A3 mostró que el error del modelo de referencia es casi todo intramunicipal. El municipio explica 68.6 % de la varianza del rendimiento; la desviación intramunicipal agrupada es de 0.491 t/ha. Por municipio, el RMSE del modelo de referencia fue: Chignahuapan (71 parcelas) 0.563, con 71.7 % del error
cuadrático; Calpulalpan (30) 0.378, con 13.6 %; Singuilucan (16) 0.443, con 10.0 %; Almoloya (10) 0.166 y Cuautepec (5) 0.237. Dentro de Chignahuapan, el modelo explica sólo cerca de 7 % de la varianza. Cuatro parcelas con fallas (AGC_171, AGC_015, AGC_024 y AGC_034) suman 38 % del error cuadrático, y las diez peores
suman 55 %. Los residuos son asimétricos (skew −1.28) y de colas pesadas (curtosis en exceso 4.4), por lo que el error está dominado por pocos casos.

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md


## Margen de mejora: piso de ruido y techo práctico

El análisis A3 cuantificó las fuentes de mejora posibles en RMSE de validación cruzada. Redondeo de las etiquetas en rejilla de 0.5 t/ha (Calpulalpan, Apan, Emiliano Zapata y Nanacamilpa) y 0.1 en Singuilucan: ≈0.007, irreducible. Incertidumbre de los niveles municipales: 0.006 a 0.014 si se conocieran exactamente, lo
cual no es alcanzable. Detector de fallas de cultivo: 0.006 a 0.013 con AUC 0.8, y 0.018 a 0.031 con AUC 0.9. Interpolación espacial de vecinos: ≤0.004. Prior externo SIAP: ≤0.001. Por eso estimamos un techo práctico de 0.465 a 0.470 t/ha. Un RMSE de 0.46 requiere un detector de fallas con AUC cercano a 0.9, que los
datos actuales no sostienen. Estas cifras son cotas teóricas con supuestos optimistas (tasas de falla y pérdidas tomadas de las mismas etiquetas), así que deben leerse como límites y no como pronósticos de una mejora concreta.

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md


## Estructura espacial dentro de municipios

Un semivariograma empírico con pares dentro del mismo municipio mostró que la estructura espacial sólo existe a escala muy corta: el rango práctico es de 0.6 a 0.8 km, y más allá de unos 600 m no hay estructura. El ajuste exponencial dio un rango de 185 a 265 m, pero se apoya en una sola clase de distancia. Los vecinos
no coinciden mucho: entre parcelas a menos de 300 m, la correlación de los rendimientos desviados es 0.58 (0.18 sin el par con fallas), y la de los residuos del modelo de referencia es 0.52 cuando están en el mismo pliegue y 0.21 en pliegues distintos. Los grupos de parcelas contiguas, probablemente del mismo
productor, no comparten rendimiento: ICC de +0.08 (p = 0.23). Por eso la cota de la interpolación espacial es ≤0.004 RMSE, y el modelo ya la aprovecha.

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md


## Detectores de fallas: AUC necesaria para mejorar

Una falla se definió como residuo menor que −1 t/ha (4 parcelas, 2.9 %) o menor que −0.75 (7 parcelas, 5.1 %). Simulando un detector calibrado con AUC (área bajo la curva ROC: probabilidad de que una falla puntúe por encima de una parcela normal), el RMSE del modelo de referencia baja a 0.4709 con AUC 0.8, 0.4587 con
AUC 0.9 y 0.4423 con AUC 0.95, para cuatro fallas en todas las parcelas. Para ganar 0.005 se necesita una AUC de 0.75 a 0.8; para 0.010, de 0.80 a 0.85; para 0.020, de 0.88 a 0.90. Con 4 a 7 positivos entre 138 parcelas, el error estándar de la AUC es de 0.08 a 0.13, así que no podemos validar un detector con estas
etiquetas. Las fallas se ven normales en las variables de dosel (z entre −0.8 y +2.3), por lo que la AUC actual de las variables de dosel sería presumiblemente cercana a 0.5.

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md


## Regla de validación, conjunto fijo y métricas

Para aceptar un modelo nuevo sobre la referencia, A3 propone exigir una ganancia media Δ̂ de al menos max(0.002, z_N · 0.08 · D), donde D es la diferencia cuadrática media entre las predicciones de ambos modelos. El factor z_N vale 1.25 para un candidato preregistrado, 1.9 para el mejor de unos 20 variantes y 2.4 para
el mejor de unos 70. Por ejemplo, con D = 0.05 se requiere Δ̂ ≥ 0.005 para un candidato único. Además, como las 138 parcelas son un conjunto fijo, en validación cruzada un pliegue con nivel municipal alto tiende a tener otro bajo: esto infla las ganancias de cualquier regla que fije niveles municipales, como el
desplazamiento por mediana dentro de pliegue (0.4720 en CV, artefacto) o el redondeo a rejilla (0.4745). Cualquier cambio que toque niveles municipales debe evaluarse por pliegue.

En un mismo conjunto de prueba, R² de sklearn es 1 − MSE/Var(y), así que ordena los modelos igual que el RMSE; por tanto, son un solo criterio. El coeficiente de correlación de Pearson al cuadrado (r²) ignora desplazamientos y escalas, y está dominado por la diferencia entre municipios: los niveles municipales por sí
solos dan r² de 0.66 a 0.69 y el modelo de referencia de 0.68 a 0.71. Por eso, un ajuste que sólo mueve niveles puede mejorar r² sin mejorar el RMSE. El MAE prefiere medianas: en CV, la mediana municipal obtuvo MAE 0.307 frente a 0.322 de la media del modelo de referencia, pero su RMSE fue peor. Al estirar o desplazar
el modelo de referencia no se obtiene ninguna mejora robusta; el propio A3 recomienda mantener la media condicional tal como está.

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md


## Auditoría de señal: 170,496 pruebas sin señal robusta

A6 probó 9,536 variables ensambladas y 24,766 columnas diarias oficiales sobre el residuo del modelo y sobre el rendimiento, en todos los municipios y en Chignahuapan. En total hubo 170,496 pruebas a nivel de variable en la familia principal y 244,005 en la familia de datos diarios. Ninguna variable alcanzó BH q < 0.10
en ninguna familia, y ninguna alcanzó una p de máximo estadístico menor que 0.05 para el residuo en las cuatro familias primarias de Spearman. Lo que sí aparece es señal en el rendimiento: la razón de energía frente a la permutación fue de 1.73 (p = 0.013) en todos los municipios y 1.75 (p = 0.033) en Chignahuapan. En
el residuo, las razones caen a 0.82 (p = 0.78) y 0.63 (p = 0.96). Es decir, el modelo ya absorbió la señal que las variables explican y el residuo es casi ortogonal a ellas.

Fuente: experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md


## Auditoría de señal: los residuos no replican

A6 seleccionó variables según su correlación con el residuo en una mitad aleatoria de las parcelas y las midió en la otra. El acuerdo de signo fue de 0.41 en todos los municipios (nulo 0.51) y de 0.24 en Chignahuapan (nulo 0.46). Para K = 1, el residuo medio en la segunda mitad fue de −0.042 (todos) y −0.100
(Chignahuapan). En cambio, las correlaciones con el rendimiento sí replican débilmente: acuerdo de signo 0.63 frente a 0.51 nulo. La explicación es que, en predicciones fuera de pliegue, la etiqueta de cada parcela entra en las predicciones de las demás, empujando sus correlaciones residuales hacia cero y en
direcciones opuestas en cada mitad. Por tanto, seleccionar variables por correlación con el residuo empeora la predicción fuera de muestra. Recomendación: no usar la correlación con el residuo para elegir variables.

Fuente: experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md


## Sesgo de selección: el ajuste "ae2020_43"

Una variable de AlphaEarth, ae2020_43, al reajustarse dentro de cada pliegue dio RMSE 0.4599 y ganó en 10 de 10 divisiones, lo que parecía un gran avance. A6 demostró que es un sesgo de selección: al elegir la mejor variable de entre puro ruido sobre todos los datos, la ganancia media dentro del pliegue fue de −0.0139
(5 % a 95 %: −0.025 a −0.004), y la de ae2020_43, de −0.0169, tiene p = 0.33. Las variantes honestas pierden entre 0.015 y 0.049. Por la misma razón, la mejora de 0.0033 de la pendiente de log-área en Chignahuapan tiene p = 0.59 bajo la selección de descriptores geométricos. Regla: ninguna ganancia obtenida tras mirar
todas las etiquetas debe reportarse como mejora sin una prueba de selección.

Fuente: experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md


## Área de parcela: la señal está sólo en Chignahuapan

El área tiene una señal débil y local. En Chignahuapan (71 parcelas), el rendimiento correlaciona con log-área en −0.315 (p = 0.007), y el residuo del modelo aún en −0.227 (p = 0.057). Las parcelas más pequeñas (0.4 a 1.6 ha) tienen residuo medio de +0.28 t/ha, es decir, están subestimadas. Pero la señal la generan las
colas: parcelas muy pequeñas con rendimiento alto (AGC_069, AGC_049, AGC_127 y AGC_055) y parcelas grandes con rendimiento bajo (AGC_171 y AGC_024). En los demás municipios la correlación del área con el rendimiento es ≈0 (Calpulalpan −0.04; Singuilucan +0.05).

Fuente: experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md


## Curvas fenológicas (M1): primario declarado y causa del fallo

M1 modeló el rendimiento a partir de los parámetros de una curva de desarrollo del dosel ajustada a los índices (subida, meseta, senescencia y momentos de inicio), con 76 variables: 64 de curva para Planet NDVI, Planet LAI, fAPAR de Sentinel-2 y NDRE705, más área, elevación, pendiente y nueve indicadores municipales.
El primario, preregistrado antes de ver resultados, fue una ridge estandarizada. Resultado: RMSE de 0.5841 y MAE de 0.4405, R² 0.526, frente a 0.5126 del promedio municipal con contracción (B0); la diferencia es +0.0715 con IC 95 % [+0.021, +0.122]. Como
referencia de comparación, el ensamble del corpus (ENS3) dio 0.4744. Las curvas no mejoran la línea base con la regla declarada.

La causa es que una sola penalización trata igual a los indicadores municipales y a las 64 columnas de curva. El alfa elegido por validación interna (18 a 56) encoge los efectos municipales a ±0.11 a 0.23 t/ha por desviación estándar, y las columnas de curva, confundidas con el municipio, llenan ese hueco. Dentro de
Chignahuapan la desviación de las predicciones sube a 0.29 frente a 0.58 real, y la habilidad dentro del municipio es −0.07 frente a B0. Las curvas capturan sobre todo el nivel entre municipios: la ridge sólo con curva llega a R² 0.25, pero la correlación de la ganancia con el residuo es de 0.045. Esto muestra que el
problema no es de datos sino de cómo se mezcla la información de municipio con la de parcela.

Fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md


## Curvas fenológicas (M1): efectos municipales fijos, eje temporal y selección

Al tratar el municipio como efecto fijo sin penalizar (ridge_fe), las curvas no añaden nada: RMSE 0.5136 frente a 0.5126 de B0 (diferencia +0.001; IC [−0.017, +0.018]), con alfa entre 316 y 562 y coeficientes de curva de como máximo 0.024 t/ha por desviación. Entre las 46 familias de curva, sumadas al control sin
curvas (sólo estático y municipio, RMSE 0.5002), sólo 3 de 146 comparaciones con el mismo aprendiz bajaron el RMSE, y como máximo en 0.0022 t/ha. La mediana del cambio fue de +0.006 con ridge_fe y de +0.032 con LightGBM. La mejor configuración con curvas, F_BAK_re_ndre740, dio 0.5008, es decir +0.0006 respecto al
control. La señal intramunicipal de estos modelos (correlación de ganancia con residuo hasta 0.23) viene de elevación, pendiente y área, no de las curvas.

M1 probó tres ejes temporales: calendario, grados-día (GDD) y alineado al calendario de siembra. Con ridge, los RMSE fueron 0.5841, 0.5808 y 0.5790; con ridge_fe, 0.5136, 0.5159 y 0.5129. Las diferencias son ≤0.005, es decir, ruido: los grados-día sólo reescalan el tiempo sin reordenar parcelas. La selección interna de
4,098 columnas (depuradas por correlación mayor de 0.995) no mejoró el nivel de B0: TabPFN con 20 columnas dio 0.5119 y ridge con efectos municipales 0.5127. Una regresión lasso sobre todas las columnas dio 0.5954. Conclusión: la selección automática de curvas no encuentra señal que el municipio no tenga ya.

Fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md


## Curvas fenológicas (M2): protocolo de la prueba intramunicipal

M2 midió cuánta varianza dentro de cada municipio explican los bloques de curva, con la métrica within-R² = 1 − SSE(modelo)/SSE(media municipal) agrupada sobre 10 repeticiones de 5 pliegues. El objetivo se centró dentro de cada municipio y se restó la media de entrenamiento. Se usaron ridge con validación cruzada
leave-one-out y PCA de 8, 16, 32 o todas las columnas, con 300 permutaciones dentro de municipio para la prueba nula. La calibración reproduce los valores del README: Galileo +0.024 y S2 reflectancia cruda −0.015 (de referencia, 0.023 y −0.015). La ganancia aproximada en RMSE es RMSE_muni × (1 − √(1 − R²)); un
within-R² de 0.01 vale unos 0.0026 t/ha. Se usaron 138 etiquetas y el RMSE de la media municipal es 0.5123.

Fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md


## Curvas fenológicas (M2): dónde está la señal intramunicipal

El primario de M1 (curva más estáticos) obtuvo within-R² de +0.051 con 16 componentes (p = 0.003) y +0.071 con 8 (p = 0.003), frente a un nulo de 0.000 a 0.001. Su ganancia aproximada es de 0.013 a 0.019 t/ha de RMSE, pero en los pliegues canónicos sólo +0.025. La señal más fuerte es la línea base b del ajuste (suelo y
residuo antes del verdeo): S2 NDVI b tiene within-R² de +0.099 (p = 0.003 con 5,000 permutaciones: 4e-4), y S2 fAPAR b +0.077. Sin embargo, un control estático de terreno, área y coordenadas ya da +0.056 (p = 0.007), así que parte de esa línea base refleja tamaño de parcela y terreno. Con correcciones por comparaciones
múltiples, de 357 filas sólo tres pasan BH q < 0.10 (q = 0.095) y ninguna q < 0.05.

Fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md


## Curvas fenológicas (M2): parámetros de forma y varianza entre y dentro de municipios

Los parámetros de forma de la curva (K, g, d0, d1 y a) no aportan señal intramunicipal. Con la línea base retirada, los bloques de K, meseta, g, d0, d1 y a dan within-R² entre −0.009 y +0.002: S2 NDVI −0.009 (p = 0.525), S2 fAPAR −0.008 (p = 0.542), Planet NDVI −0.005 y Planet LAI −0.003. Agrupar las 1,842 columnas de
curva da −0.001. Los tiempos de verdeo (d0 y greenup50) tienen la asociación univariada más consistente, con ρ entre +0.215 y +0.263, pero ninguna de las 5,096 pruebas univariadas sobrevive BH (q mínimo 0.185) y, como bloque lineal, aportan +0.010 (p = 0.043). Conclusión: la forma de la curva no ofrece ventaja, sólo la
línea base b.

El 68.6 % de la varianza del rendimiento es entre municipios. Los parámetros de curva tienen mediana de 13.7 % entre municipios, así que alrededor de 86 % de su variación es intramunicipal, y esa variación no es variación del rendimiento. La correlación entre municipios se calculó con sólo 6 municipios (con al menos 3
etiquetas), y sólo |r| mayor que 0.811 es significativa; de 5,096 parámetros de curva, 329 superan p < 0.05, casi lo esperado por azar (unas 255). Por eso esa correlación no sirve para rankear parámetros. Advertencia: las correlaciones entre municipios reflejan nivel, no intra-municipal, así que no deben usarse como
señal de predicción de parcela.

Fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md


## Curvas fenológicas (M2): la senescencia retrospectiva

Se probó si observar la senescencia completa hasta el 31 de diciembre ayuda. El primario retrospectivo dio within-R² de +0.067 (k = 16) frente a +0.051 del corte al 31 de octubre; la diferencia es +0.016. Pero el bloque de decaimiento sólo, añadido al primario, dio +0.045 con p = 0.282, y la mejora atribuible al
decaimiento no es robusta. La ganancia viene de una línea base mejor estimada, porque el ajuste ve el suelo desnudo de noviembre y diciembre, no de la forma del decaimiento. Lección: el corte de observación no es lo que limita la señal de curvas.

Fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md


## Embeddings de modelos fundacionales (B4)

B4 probó embeddings de AlphaEarth, TESSERA, Prithvi, Galileo, Presto, Clay, AnySat y OlmoEarth. Con AlphaEarth, 64 bandas en XGBoost municipal dieron un RMSE de ensamble de 0.5015 frente a 0.4576 de la referencia (peor); el kernel GP con las variables ae2024 y aesum2325 dio 0.4860 y 0.4858 frente a 0.4853 (sin
ganancia); y 10 componentes PCA en XGBoost dieron 0.4828 frente a 0.4791 (peor). Con TESSERA 2025 se probaron tres variantes preregistradas (kernel de embedding, componentes PCA centradas por municipio, y dispersión y cambio): ninguna superó de forma convincente a la referencia.

B4 identificó cuatro desajustes. Soporte espacial: un token de Prithvi-600M mide 420 m (17.6 ha), y 186 de 197 parcelas son más pequeñas (mediana 5.5 ha), así que el token describe sobre todo a los vecinos. Suavizado: AlphaEarth tiene autocorrelación de 0.90 en desviaciones dentro de parcela y una razón de varianza
intra/entre de 0.42; TESSERA, pixel a pixel, 0.85 y 0.71. Temporal: ambos resumen enero a diciembre, mientras la temporada de cebada es de junio a octubre. Reubicación: los ejes principales de AlphaEarth son regionales, y PCA sobre las parcelas recoge direcciones entre municipios que el GP ya explica. Con n ≈ 71 en
Chignahuapan, las dimensiones extra sólo añaden varianza. Recomendación de B4: dejar de gastar cómputo en embeddings para la puntuación.

Fuente: experimentos_tabulares/iterate_20261017__research__B4_foundation_models.md


## Literatura sobre embeddings y rendimiento: hechos citados

Verificación en línea de las referencias citadas por el corpus (B4). Ma, Shen, Swatantran y Lobell comparan AlphaEarth con índices Landsat y clima a nivel de campo en arXiv:2601.00857 (enviado el 30 de diciembre de 2025; el año 2026 del corpus corresponde al identificador 2601). El resumen confirma que AlphaEarth es
competitivo con modelos de teledetección específicos cuando se entrena con datos locales y que su transferibilidad espacial es limitada; las cifras de R² de la Tabla 4 (evaluación a nivel de campo con validación por año de condado; XGB; AlphaEarth frente a teledetección: 0.44 frente a 0.46 en maíz; 0.37 frente a 0.35
en soya; 0.43 frente a 0.41 en trigo) y la transferencia de condado a campo (−0.04 frente a 0.22 en trigo) se verificaron en la ronda 4 con el PDF completo (verificado: arXiv:2601.00857). No son cifras intra-condado y los datos son de Estados Unidos. Nedungadi, Xiong, Potze, Van Bree, Lin, Rußwurm y Athanasiadis (2025,
arXiv:2507.05390), en su Tabla 2 para maíz de España, reportan nRMSE de 14.28 para un RF específico de la tarea (RFTS), 26.59 para RF sobre entradas de modelos
fundacionales (RFFM), 29.32 con Galileo y 31.10 con Presto (verificado; menor es mejor). Los embeddings congelados, por tanto, no igualan a la RF específica: casi duplican su error relativo en esta evaluación, aunque el contexto (España, maíz) no es el de la cebada del proyecto.

Fuente: experimentos_tabulares/iterate_20261017__research__B4_foundation_models.md


## Clima y lluvia: qué aportó y qué no

Las entradas meteorológicas se probaron en varias formas: AgERA5 en Kumo (rachas secas, picos de lluvia de 5 y 10 días, déficit hídrico), la historia municipal de temporal, y el preentrenamiento sobre 27 variables. En Kumo versión 2, el control FIRA-only, sin clima municipal, dio 0.317586 de MAE frente a 0.317526 del
procedimiento líder, así que el clima no explica el beneficio. La versión medium, con clima directo, empeoró a 0.327020. El estudio de 1,036,225 registros tampoco incluye un predictor de riego, y el régimen se usa sólo para filtrar. Importante: AgERA5 es un reanálisis, no una observación de humedad de suelo en el
campo. Por eso, antes de invertir en nuevas fuentes climáticas, conviene separar en la validación si el clima explica algo que la curva fenológica o el municipio no expliquen ya.

Fuente: experimentos_tabulares/modelado__KUMO_V2.md; experimentos_tabulares/modelado__KUMO_RAINFED.md


## NDVI, MTCI y área: resumen por variable

El NDVI de temporada no mejora el modelo: en la regresión espacial, M1 con NDVI dio RMSE 0.5140 (Δ −0.0049) y 0 de 20 splits mejores que la referencia. En las curvas, la ridge con NDVI de M1 quedó por encima del control (0.5054 frente a 0.5033). El MTCI (índice de borde rojo) tampoco: en M1 la versión con MTCI dio
0.5035 frente a 0.5033 sin él; en A6, una señal de MTCI p10 en Chignahuapan (−0.34) fue nominal y no pasó la corrección. El área de parcela sólo tiene señal local en Chignahuapan (ver el fragmento correspondiente). Las pruebas con clima de Kumo no mostraron una ventaja identificable. Ninguna de estas variables fue
suficiente para justificar un cambio en el modelo.

Fuente: experimentos_tabulares/spatial_regression__README.md; experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md; experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md


## Techo práctico de RMSE y conclusiones globales

Consolidando los experimentos: el municipio explica 68.6 % de la varianza; el error está en Chignahuapan y en unas pocas parcelas con fallas; ninguna fuente de señal probada (APAR, centrado, CANOPY_JOINT, sensores cruzados, contexto cultivo, Kumo, GPU conjunta, variables de literatura, curvas fenológicas, embeddings)
superó la referencia de forma robusta. El techo práctico de RMSE en validación cruzada es de 0.465 a 0.470 t/ha, y el objetivo de R² 0.85 exigiría un RMSE de 0.3285 t/ha, muy por debajo de ese techo. La mayoría de las mejoras menores son ruido: en un conjunto fijo de 138 parcelas, con pocos splits, una diferencia de
0.002 a 0.005 no es distinguible. Las recomendaciones son: reportar intervalos y pruebas de selección, no reutilizar pliegues, y buscar señal de parcela (manejo, daño o reporte) fuera de la reflectancia.

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md; experimentos_tabulares/modelado__GPU_EXPERIMENTS.md; experimentos_tabulares/modelado__KUMO_RAINFED.md


## TabPFN con tablas pequeñas: lo que demostró la versión original y la publicada en Nature

TabPFN es un transformador preentrenado con tablas sintéticas que predice tablas pequeñas sin ajustar pesos nuevos para cada conjunto de datos. La versión original, de Hollmann, Müller, Eggensperger y Hutter (arXiv:2207.01848, 2022, revisada hasta 2023), se evaluó en clasificación: según su resumen, resuelve problemas
de clasificación con pocos datos en menos de un segundo, no necesita ajuste de hiperparámetros y, en 18 conjuntos de OpenML-CC18, supera a los árboles potenciados. El resumen reporta una aceleración de hasta 230 veces frente a esos métodos y de 5,700 veces con GPU; estas cifras son de tiempo de cómputo, no de error de
predicción. La versión publicada en Nature (Hollmann et al., 2025, vol. 637, pp. 319-326, DOI 10.1038/s41586-024-08328-6) reporta mejor desempeño que los métodos previos en conjuntos de hasta 10,000 muestras; esta cifra se verificó con el resumen del buscador, no con el texto completo. Para nuestros proyectos, TabPFN
es una referencia legítima con pocos datos, pero su ventaja en rendimiento agrícola depende de la tarea (ver el fragmento de Nedungadi et al. 2026). Esto es un hecho de la literatura, no un resultado del proyecto.

Fuente: Hollmann, Müller, Eggensperger, Hutter (2022/2023), arXiv:2207.01848; Hollmann, Müller, Purucker et al. (2025), Nature 637, 319-326, DOI 10.1038/s41586-024-08328-6.

## TabPFN frente a modelos de aprendizaje automático en rendimiento subnacional (Sudáfrica)

Sabo, Meroni, Piles, Claverie, Ferreira, Van Den Berg, Collivignarelli y Rembold (2025, arXiv:2506.19046) evaluaron TabPFN para predecir el rendimiento de cultivos de verano a escala subnacional en hasta ocho provincias de Sudáfrica, a lo largo de 23 años. Usaron como covariables el FAPAR y la humedad del suelo de
observación de la Tierra, y temperatura, precipitación y radiación de datos de rejilla, agregados mensualmente por región. Compararon TabPFN con seis modelos tradicionales de aprendizaje automático y tres líneas base, con validación de dejar un año fuera, es decir, predicción de un año no visto. Según la versión
consultada, TabPFN y los modelos de aprendizaje automático tienen precisión comparable y superan a las líneas base, y TabPFN requiere menos tiempo de ajuste y menos ingeniería de variables. El texto consultado no reporta valores de R² ni de RMSE, así que no se citan cifras. Recomendación, no resultado: con 138
parcelas, la ventaja de TabPFN sobre un modelo lineal o de árboles debe medirse con validación que respete la estructura por municipio y por pliegue, no suponerse.

Fuente: Sabo et al. (2025), «From Rows to Yields: How Foundation Models for Tabular Data Simplify Crop Yield Prediction», arXiv:2506.19046. https://arxiv.org/abs/2506.19046

## Random forest frente a regresión lineal en predicción de rendimiento

Jeong et al. (2016, PLoS ONE 11(6): e0156571, DOI 10.1371/journal.pone.0156571) compararon random forests (RF) con regresión lineal múltiple (MLR) para rendimiento de trigo, maíz grano, papa y maíz forrajero. En trigo a escala de megaentornos globales, el RF dio un RMSE de 0.32 t/ha (11.9 % del rendimiento medio), con
eficiencia de modelo (EF) de 0.96; la MLR dio 1.32 t/ha (49.2 %) y EF de 0.31. En maíz grano en condados de Estados Unidos (30 años), el RF dio 1.13 t/ha (16.7 %) y la MLR 1.94 t/ha (28.7 %). El RF superó a la MLR en todas las métricas reportadas. Estos resultados son de otros cultivos, escalas y tamaños de muestra
mayores, por lo que no se transfieren directamente a cebada de temporal con 138 parcelas. Recomendación, no resultado: un RF tiene más varianza con muestras pequeñas; sin una línea base lineal con regularización (ridge) y validación repetida, no se puede atribuir una mejora a la no linealidad.

Fuente: Jeong, Resop, Mueller, Fleisher, Yun, Butler, Timlin, Shim, Gerber, Reddy, Kim (2016), PLoS ONE 11(6): e0156571. DOI 10.1371/journal.pone.0156571

## Grados-día y lluvia en un modelo de rendimiento de maíz por condado (Estados Unidos)

Crane-Droesch (2018, Environmental Research Letters 13: 114003, DOI 10.1088/1748-9326/aae159) estimó el rendimiento de maíz por condado en nueve estados del Medio Oeste de Estados Unidos entre 1979 y 2016. Usó grados-día (GDD) contados en bandas de 1 °C entre 0 y 40 °C, precipitación total con término lineal y
cuadrático, y tendencias temporales. Su red semiparamétrica (SNN) anida un modelo paramétrico dentro de una red neuronal. En la tabla de error fuera de bolsa (MSE, sin unidades indicadas), la SNN con bagging dio 251.5, frente a 334.4 de la regresión paramétrica con bagging y 638.6 de una red totalmente no paramétrica
con bagging. El autor señala que la parte paramétrica (tendencia y GDD) pesa más que la no paramétrica. Para la cebada, lo transferible es el uso de GDD como predictor térmico. En las fuentes consultadas no hay una base de grados-día validada para cebada de temporal en Hidalgo, Puebla o Tlaxcala (no verificado).

Fuente: Crane-Droesch, A. (2018), «Machine learning methods for crop yield prediction and climate change impact assessment in agriculture», Environmental Research Letters 13, 114003. DOI 10.1088/1748-9326/aae159

## Embeddings de modelos fundacionales frente a una RF específica en maíz de España

Nedungadi, Xiong, Potze, Van Bree, Lin, Rußwurm y Athanasiadis (2025, arXiv:2507.05390, «From General to Specialized: The Need for Foundational Models in Agriculture», SEA Workshop, ICCV 2025) compararon en maíz de España una RF específica de la tarea (RFTS) con una RF sobre entradas crudas de modelos fundacionales
(RFFM), Galileo-RF y Presto-RF. En la Tabla 2, el nRMSE del rendimiento fue 14.28 para RFTS, 26.59 para RFFM, 29.32 para Galileo-RF y 31.10 para Presto-RF; menor es mejor. En esta evaluación, los embeddings congelados casi duplicaron el error relativo de la RF específica. La tabla rotula la métrica como nRMSE, mientras
el texto de la sección 4.3 habla de RMSE; las unidades y el protocolo de partición deben leerse en el texto completo. Son hechos de la literatura, no resultados del proyecto.

Fuente: Nedungadi et al. (2025), arXiv:2507.05390, Tabla 2 y sección 4.3. https://arxiv.org/html/2507.05390v2

## TabPFN frente a RF en R² de rendimiento: resultados por conjunto de datos

Nedungadi, Xiong, Rußwurm y Athanasiadis (2026, arXiv:2608.30392, «Foundation Models Meet Agriculture: Challenges Beyond Pretraining», enviado el 31 de agosto de 2026) evaluaron dos modelos fundacionales de observación de la Tierra, un modelo tabular y líneas base supervisadas en siete conjuntos reales de rendimiento,
fenología y clasificación de cultivos. En su Tabla 3 (apéndice B), el R² medio de rendimiento en tres semillas fue: TabPFN 0.65 frente a RF 0.55 en CY-US (Estados Unidos); 0.22 frente a -0.05 en CY-SN (Senegal); 0.53 frente a 0.53 en CY-DE (Alemania); y 0.31 frente a 0.13 en YS-AR (Argentina). La ventaja de TabPFN
sobre la RF no es uniforme: en Alemania empatan y en Senegal la RF no tiene capacidad predictiva. Los autores también señalan que el ranking de modelos cambia entre contextos. Son resultados de otros datos y no de cebada mexicana; el procedimiento sirve como plantilla de comparación.

Fuente: Nedungadi et al. (2026), arXiv:2608.30392, Tabla 3 (apéndice B). https://arxiv.org/abs/2608.30392

## Ma et al. (2026): embeddings de AlphaEarth en rendimiento a nivel de campo

Ma, Shen, Swatantran y Lobell («Harvesting AlphaEarth: Benchmarking the Geospatial Foundation Model for Agricultural Downstream Tasks», arXiv:2601.00857, enviado el 30 de diciembre de 2025) evaluaron los embeddings de AlphaEarth Foundations en predicción de rendimiento, clasificación de labranza y mapeo de cultivos de
cobertera, a escala de condado y de campo, con datos de Estados Unidos aportados por Corteva Agriscience. El resumen señala que los modelos basados en AlphaEarth son competitivos frente a modelos de teledetección específicos cuando se entrenan con datos locales, y que tienen una transferibilidad espacial limitada, baja
interpretabilidad y poca sensibilidad temporal. Las cifras de la Tabla 4 del PDF completo (ronda 4) son: en evaluación a nivel de campo con validación por año de condado, XGB con AlphaEarth frente a teledetección obtuvo R² de 0.44 frente a 0.46 en maíz, 0.37 frente a 0.35 en soya y 0.43 frente a 0.41 en trigo; en la
transferencia de condado a campo, AlphaEarth queda atrás: 0.25 frente a 0.38 en maíz y −0.04 frente a 0.22 en trigo (verificado: arXiv:2601.00857). Los datos son de Corteva en Estados Unidos, no de México. Por eso el año de publicación debe leerse como 2025 (identificador 2601). El hecho relevante para el
proyecto es la transferibilidad limitada, que justifica la misma cautela que aplicó el corpus al evaluar AlphaEarth.

Fuente: Ma, Shen, Swatantran, Lobell (2025/2026), arXiv:2601.00857. https://arxiv.org/abs/2601.00857

## XGBoost: qué es y qué aporta como método de árboles potenciados

Chen y Guestrin (2016, KDD, «XGBoost: A Scalable Tree Boosting System», DOI 10.1145/2939672.2939785; arXiv:1603.02754) describen un sistema de boosting de árboles de decisión que añade árboles de forma secuencial para corregir el error de los anteriores. Según el resumen, sus contribuciones principales son un algoritmo
consciente de la dispersión (sparsity-aware) para manejar valores faltantes, un esbozo de cuantiles ponderado para aprender árboles aproximados y optimizaciones de sistema para caché, compresión de datos y particionamiento; el resumen afirma que escala a más de mil millones de ejemplos. Para tablas pequeñas, como las
138 parcelas del proyecto, la escalabilidad no es lo relevante; lo que determina el sobreajuste son la profundidad, la tasa de aprendizaje y el submuestreo. Los árboles potenciados aparecen en nuestros experimentos como familia de referencia; este fragmento describe el método y no su desempeño en el proyecto.

Fuente: Chen y Guestrin (2016), KDD 2016, DOI 10.1145/2939672.2939785; arXiv:1603.02754. https://arxiv.org/abs/1603.02754

## Monteith (1972): radiación interceptada, eficiencia de uso y APAR

Monteith (1972, Journal of Applied Ecology 9: 747-766) planteó que la producción de materia seca de un cultivo es proporcional a la radiación fotosintéticamente activa (PAR) que intercepta el dosel; la pendiente de esa relación es la eficiencia de uso de la radiación (RUE). Su modelo separa el papel del dosel en
interceptar energía del papel en convertirla en biomasa. Según el registro de la British Ecological Society, sus estimaciones para cultivos entre 14° S y 43° N coincidieron con las mediciones durante el crecimiento vegetativo, pero sobreestimaron la producción en el crecimiento reproductivo, lo que se atribuyó a una
fotosíntesis sobreestimada, una respiración subestimada, o ambas. Los modelos actuales de eficiencia de producción usan la radiación absorbida (APAR, igual a fAPAR por PAR) y un término de eficiencia. En nuestros experimentos, el índice apar_dj es la media estacional de fAPAR, es decir, una fracción acumulada de luz
absorbida; su desempeño se describe en la sección de regresión espacial. Los valores de RUE por cultivo no se verificaron en esta revisión.

Fuente: Monteith, J. L. (1972), Journal of Applied Ecology 9, 747-766. https://britishecologicalsociety.org/applied-ecology-resources/document/19730706997

## Procesos gaussianos: fundamento de la regresión espacial

Rasmussen y Williams (2006, Gaussian Processes for Machine Learning, MIT Press, ISBN 0-262-18253-X) presentan los procesos gaussianos (GP) para regresión y clasificación supervisadas: una distribución sobre funciones definida por una función media y un kernel de covarianza, que produce predicciones con incertidumbre.
Un kernel exponencial, como el usado en la regresión espacial del proyecto, hace que la covarianza decaiga con la distancia, de modo que parcelas cercanas comparten información; la escala del kernel controla qué tan lejos llega esa dependencia. Si el GP incluye una tendencia lineal con mínimos cuadrados generalizados y
efectos de municipio, la distancia captura la vecindad y los efectos fijos capturan el nivel municipal. Este fragmento describe el fundamento del método. La aplicación de kriging o GP al rendimiento agrícola no se verificó con una fuente específica (SIN EVIDENCIA en esta revisión).

Fuente: Rasmussen, C. E. y Williams, C. K. I. (2006), Gaussian Processes for Machine Learning, MIT Press. ISBN 0-262-18253-X

## Modelos mixtos con efecto aleatorio por municipio: fundamento

Bates, Mächler, Bolker y Walker (2015, «Fitting Linear Mixed-Effects Models Using lme4», Journal of Statistical Software 67(1): 1-48) describen cómo ajustar modelos lineales de efectos mixtos con la función lmer de R, que combina efectos fijos con efectos aleatorios por grupo. En nuestro caso, las 138 parcelas se
agrupan en al menos cinco municipios, con 71 parcelas en Chignahuapan, 30 en Calpulalpan, 16 en Singuilucan, 10 en Almoloya y 5 en Cuautepec. Un efecto aleatorio por municipio comparte información entre parcelas del mismo municipio y encoge hacia la media los grupos pequeños. Con grupos de 5 a 10 parcelas, la varianza
entre grupos se estima con poca precisión. Esto es una recomendación metodológica, no un resultado: en nuestros experimentos el efecto de municipio se usó como efecto fijo en la regresión espacial y en el centrado intramunicipal, no como modelo mixto formal.

Fuente: Bates, Mächler, Bolker, Walker (2015), Journal of Statistical Software 67(1), 1-48. https://www.jstatsoft.org/article/view/v067i01


## Kriging por regresión ponderada geográficamente para mapear rendimiento: Burkina Faso

En África Occidental, Imran, Stein y Zurita-Milla (2015) relacionaron rendimientos observados en campo con el NDVI de SPOT-VEGETATION para escalarlos a todo Burkina Faso. Su método, el kriging por regresión ponderada geográficamente (GWRK, por sus siglas en inglés), combina una regresión con coeficientes que varían en
el espacio con kriging sobre los residuos, y cuantifica la incertidumbre de la predicción. Los autores analizaron dos fuentes de error antes de escalar: la incertidumbre que introduce la red de encuestas de campo, mediante análisis de patrones de puntos, y la de cada paso del escalamiento. Para un conjunto de parcelas
dispersas, la lección es que el kriging depende de la densidad del muestreo: a distancias mayores que la autocorrelación del rendimiento, la predicción se apoya sobre todo en la regresión con covariables, no en la interpolación. Esto es un principio general, no un resultado de cebada. El estudio no es de cebada ni de
México; en esta ronda no se localizó un estudio de kriging del rendimiento de cebada en Hidalgo, Tlaxcala o Puebla.

Fuente: Imran, H. A., Stein, A. y Zurita-Milla, R. (2015), «Using geographically weighted regression kriging for crop yield mapping in West Africa», International Journal of Geographical Information Science 29: 234–257, doi:10.1080/13658816.2014.959522.

## Kriging ordinario, procesos gaussianos y SVM con muestras escasas: soya en Brasil

Un estudio de 2026 en la Revista CERES, en Patos de Minas (Brasil), usó 795 muestras georreferenciadas de rendimiento de soya en 3.7 ha para comparar la regresión por procesos gaussianos (GPR) con el kriging ordinario (OK) y una máquina de vectores de soporte (SVM). Con alta densidad de muestreo, GPR y OK se
comportaron de forma similar; con pocas muestras, GPR tuvo mayor exactitud. Los autores indican que se necesita al menos el 60 % del conjunto completo para mantener predicciones espaciales confiables. Para la cebada del proyecto, la relevancia está en el régimen de muestreo escaso: es una hipótesis que habría que
probar con validación cruzada, no un resultado. Limitaciones: es una sola finca de soya de 3.7 ha en Brasil, no evidencia directa para cebada de temporal en el Altiplano.

Fuente: Revista CERES (2026), «Gaussian process regression as an alternative to kriging and SVM for spatial yield prediction», doi:10.71252/2177-34912026730004.

## Efectos mixtos por municipio o región: cómo separar el efecto de grupo

Los modelos lineales de efectos mixtos combinan efectos fijos, como covariables climáticas o de terreno, con efectos aleatorios de grupos como municipio, región o estado. Los efectos aleatorios encogen las estimaciones de los grupos con pocas observaciones hacia la media general. Bates, Mächler, Bolker y Walker (2015)
describen su ajuste en R con el paquete lme4 y la función lmer, que por defecto estima por máxima verosimilitud restringida (REML). Para rendimiento de cebada con parcelas anidadas en municipios, la recomendación es reportar por separado la varianza entre municipios y la varianza dentro de cada municipio, y no
interpretar el efecto aleatorio como causal. Este fragmento es método y recomendación. En esta ronda no se localizó literatura regional mexicana que aplique modelos de efectos mixtos al rendimiento de cebada (SIN EVIDENCIA).

Fuente: Bates, D., Mächler, M., Bolker, B. y Walker, S. (2015), «Fitting Linear Mixed-Effects Models Using lme4», Journal of Statistical Software 67(1): 1–48, https://www.jstatsoft.org/article/view/v067i01.

## Grados-día y aridez como predictores climáticos de rendimiento: trigo y cebada

Un estudio de 2024 en la revista Climate comparó el rendimiento real de trigo y cebada en Japón y el Reino Unido con tres factores de la zonificación climática del Atlas de Brechas de Rendimiento Global: grados-día (GDD), índice de aridez (AI) y estacionalidad de temperatura (TS). Encontró una relación significativa
entre el índice de aridez y el rendimiento en ambos países: a mayor aridez, menor rendimiento, y la pendiente fue mayor en Japón. El índice de aridez combina precipitación y evapotranspiración, por lo que puede ser más informativo que el acumulado térmico en un municipio con lluvia de temporal. Los grados-día se
calculan sobre una temperatura base; McMaster y Wilhelm (1997) dedicaron su artículo a dos interpretaciones de la ecuación de grados-día. La temperatura base específica de la cebada no se cita aquí, porque el resumen de ese artículo no se consultó (no verificado). En la ronda 4, una búsqueda encontró un estudio
brasileño con centeno y cebada que toma para la cebada una temperatura base inferior de 0 °C, óptima de 22 °C y superior de 35 °C, citando a Monteiro (2009) (solo resumen de búsqueda; SIN EVIDENCIA en fuente primaria). Otro estudio, de Montecillo (campo e invernadero con cebada y trigo), reporta unos 1,320 °Cd a
antesis en campo y 2,003 °Cd a madurez fisiológica en campo (solo resumen de búsqueda; referencia no completa; cifras dependientes de la localidad y el genotipo). Es una hipótesis a probar con validación cruzada, no
una conclusión del proyecto.

Fuente: Climate (2024), «A Common Climate–Yield Relationship for Wheat and Barley in Japan and the United Kingdom», doi:10.3390/cli12080125; McMaster, G. S. y Wilhelm, W. W. (1997), «Growing degree-days: one equation, two interpretations», Agricultural and Forest Meteorology 87: 291–300,
doi:10.1016/S0168-1923(97)00027-0.

## Tamaño de parcela y productividad: la relación inversa puede ser un artefacto de medición

La relación inversa entre tamaño de parcela y productividad, según la cual las parcelas pequeñas rinden más por hectárea, es un hallazgo clásico. Desiere y Jolliffe (2018) encontraron que, con producción autorreportada, la relación inversa es fuerte, pero desaparece cuando el rendimiento se mide con cortes de cosecha
(crop cut) en Etiopía. Interpretan que es un artefacto: los agricultores sobrerreportan la producción en parcelas pequeñas y la subreportan en las grandes. Carletto, Savastano y Zezza (2013) plantearon el mismo riesgo con errores de medición. Kimhi (2006), para maíz en Zambia, encontró que la endogeneidad del tamaño de
parcela es muy importante en el análisis. Bevis y Barrett (2020), según el título de su artículo, asocian la alta productividad en la periferia de las parcelas con la relación inversa. Un estudio de 2023 en la American Journal of Agricultural Economics concluye que la relación inversa aparente en sus datos se explica
por completo por error de medición, tanto de la producción como del tamaño de parcela. Para el reto, el área de parcela no debe interpretarse como causa de productividad sin revisar su error de medición.

Fuente: Desiere, S. y Jolliffe, D. (2018), Journal of Development Economics 130: 84–98, doi:10.1016/j.jdeveco.2017.10.002; Carletto, C., Savastano, S. y Zezza, A. (2013), Journal of Development Economics 103: 254–261, doi:10.1016/j.jdeveco.2013.03.004; Kimhi, A. (2006), Agricultural Economics 35: 1–9,
doi:10.1111/j.1574-0862.2006.00133.x; Bevis, L. E. M. y Barrett, C. B. (2020), Journal of Development Economics 143: 102377, doi:10.1016/j.jdeveco.2019.102377; American Journal of Agricultural Economics (2023), doi:10.1111/ajae.12417.

## ESA WorldCover 2021: la clase 40 como máscara de cultivo anual

ESA WorldCover 2021 (versión v200) es un mapa global de cobertura del suelo a 10 m. Su clase 40, «Cropland», agrupa la cobertura de cultivos anuales que se siembran o plantan y son cosechables al menos una vez en los 12 meses siguientes a la siembra; produce cubierta herbácea y a veces se combina con árboles o
arbustos. Los cultivos perennes leñosos se clasifican en la clase de cobertura arbórea o arbustiva correspondiente, y los invernaderos cuentan como zona construida. Por tanto, la clase 40 es una máscara de cultivo anual en general, no un mapa de cebada ni de temporal: un píxel de cebada de temporal puede caer en otra
clase si el año de referencia o el manejo difieren. Como el mapa es de 2021, no representa necesariamente los ciclos de 2022 a 2025 del reto. Fuente: ESA WorldCover 2021, Product User Manual v2.0, https://esa-worldcover.s3.eu-central-1.amazonaws.com/v200/2021/docs/WorldCover_PUM_V2.0.pdf (leído en la ronda 3).
## Estimación en áreas pequeñas: qué es y qué aporta al rendimiento municipal

La estimación en áreas pequeñas (small area estimation, SAE) produce estimaciones para dominios, como municipios, con pocas observaciones directas. Combina el dato de cada dominio con información de otros dominios mediante un modelo, y así reduce la varianza a costa de cierto sesgo. Sugasawa y Kubokawa (2023) presentan
los modelos básicos de efectos mixtos para SAE: un efecto aleatorio por dominio más un término de error individual, con predicción empírica del mejor predictor lineal insesgado. Para el rendimiento de cebada, la analogía es directa: un municipio con pocas parcelas medidas toma fuerza de los demás municipios de la
región mediante el efecto aleatorio, mientras que las estimaciones directas de municipios con muchas parcelas se conservan casi sin cambio. Zimmermann y Münnich (2018) extienden el modelo a respuestas con distribución lognormal y a muestreo informativo, un caso frecuente cuando las parcelas no se eligen al azar.
Hipótesis para el proyecto: en un conjunto de 197 parcelas con municipios desiguales, la SAE podría estabilizar la estimación municipal, pero requeriría validación cruzada por municipio y no está probada aquí. No se localizó literatura mexicana que aplique SAE al rendimiento de cebada (SIN EVIDENCIA).

Fuente: Sugasawa, S. y Kubokawa, T. (2023), «Basic Mixed-Effects Models for Small Area Estimation», en Mixed-Effects Models and Small Area Estimation, SpringerBriefs in Statistics, pp. 37–56, doi:10.1007/978-981-19-9486-9_4 (verificado en Crossref). Zimmermann, S. y Münnich, R. (2018), «Small Area Estimation with a
Lognormal Mixed Model under Informative Sampling», Journal of Official Statistics 34(2): 523–542, doi:10.2478/jos-2018-0024 (verificado en Crossref).

## Efecto aleatorio por municipio: qué exigen los datos del reto

Un modelo de efectos mixtos con municipio como efecto aleatorio separa la variación entre municipios de la variación dentro de cada municipio. Para el reto, la pregunta práctica es si hay suficientes parcelas por municipio para estimar ese componente. Según el conteo del dataset oficial, las 197 parcelas se reparten en
nueve municipios: Chignahuapan concentra 100, Calpulalpan 44 y Singuilucan 23, y varios municipios tienen 1 a 14 parcelas (cálculo derivado del proyecto). Por tanto, la varianza entre municipios se estima con pocos grupos de tamaño muy desigual. Esta es una limitación de los datos del proyecto y no un resultado del
modelo. Recomendaciones: (a) reportar el número de parcelas por municipio junto con cualquier efecto aleatorio; (b) comparar con efectos fijos de municipio, que el proyecto ya usó en su modelo espacial de referencia; (c) validar por municipio, no solo por parcela, porque las parcelas cercanas comparten clima y manejo.
Como advierte la literatura de SAE, la estimación del efecto aleatorio es sensible al número de grupos y a la forma de la distribución del error; los resultados de estas comparaciones son hipótesis hasta que se calculen con validación cruzada.

Fuente: datos del proyecto (HECHOS_CALCULADOS_dataset_oficial.md, tabla por municipio); método: Sugasawa y Kubokawa (2023), doi:10.1007/978-981-19-9486-9_4; Zimmermann y Münnich (2018), doi:10.2478/jos-2018-0024.

## Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** "Kumo mejora el RMSE del proyecto." → **Corrección:** la mejora de Kumo versión 2 fue de 0.002433 t/ha (0.50 %), con IC [−0.013490, 0.010861] que incluye cero, y los pliegues canónicos se reutilizaron muchas veces.
- **Afirmación errónea:** "Kumo rainfed alcanzó R² de 0.85." → **Corrección:** no hay evaluación held-out completa del corpus de un millón de registros; el R² de 0.85 exige RMSE ≤ 0.3285 t/ha y el objetivo de RMSE ≤ 0.10 sigue sin cumplirse.
- **Afirmación errónea:** "El APAR o el NDVI mejoran la regresión espacial." → **Corrección:** en 20 splits, ninguna de las variantes con APAR o NDVI superó la referencia (0/20).
- **Afirmación errónea:** "El área de parcela explica el rendimiento." → **Corrección:** sólo en Chignahuapan (correlación −0.315); en Calpulalpan y Singuilucan es ≈0.
- **Afirmación errónea:** "Las curvas fenológicas predicen el rendimiento." → **Corrección:** el primario de M1 dio RMSE 0.5841 frente a 0.5126 de B0; con efectos municipales, la ganancia es 0.0006.
- **Afirmación errónea:** "El ajuste de ae2020_43 reduce el RMSE a 0.4599." → **Corrección:** es sesgo de selección (p = 0.33 bajo un nulo de selección de ruido).
- **Afirmación errónea:** "Un desplazamiento por mediana municipal mejora la validación." → **Corrección:** es un artefacto del conjunto fijo; el beneficio esperado en datos nuevos es de −0.001 a +0.001.
- **Afirmación errónea:** "AlphaEarth o TESSERA mejoran la predicción." → **Corrección:** AlphaEarth en XGBoost municipal empeoró por +0.044 t/ha (RMSE de ensamble 0.5015 frente a 0.4576 de la referencia; B4).
- **Afirmación errónea:** "Las fechas de PlanetScope confirman que los sensores coinciden." → **Corrección:** las fechas estaban leídas mes-primero; 28,304 de 47,804 filas quedaron sin fecha y 17,835 estaban intercambiadas. Tras corregirlas, la conclusión se mantiene.
- **Afirmación errónea:** "Las fallas de cultivo se ven en el dosel." → **Corrección:** las parcelas con fallas tienen z de dosel entre −0.8 y +2.3, es decir, aparentan normalidad.
- **Afirmación errónea:** "Los embeddings de modelos fundacionales igualan a una RF específica en maíz de España (Nedungadi et al. 2025)." → **Corrección:** en la Tabla 2 el nRMSE fue 26.59 (RFFM), 29.32 (Galileo-RF) y 31.10 (Presto-RF), frente a 14.28 de la RF específica (RFTS); casi el doble de error relativo.
- **Afirmación errónea:** "Ma et al. (2026) muestran R² intra-condado de 0.44 frente a 0.46 en maíz." → **Corrección (ronda 4):** los valores 0.44 y 0.46 son correctos según la Tabla 4 de arXiv:2601.00857, pero son R² a nivel de campo con validación por año de condado, no intra-condado, y los datos son de Estados
  Unidos; el artículo se envió el 30 de diciembre de 2025 (arXiv:2601.00857) y su resumen solo afirma competitividad con datos locales y transferibilidad
  espacial limitada.
- **Afirmación errónea:** "TabPFN supera siempre a los árboles o a la regresión en rendimiento agrícola." → **Corrección:** en Nedungadi et al. (2026, Tabla 3) la ventaja sobre RF fue de 0.65 frente a 0.55 en Estados Unidos, empate a 0.53 en Alemania y, en Sabo et al. (2025), precisión comparable con modelos de ML; la
  ventaja depende del conjunto de datos.
- **Afirmación errónea:** "La eficiencia de uso de la radiación de Monteith es constante durante todo el ciclo del cultivo." → **Corrección:** en el modelo original de Monteith (1972), la producción se sobreestimó durante el crecimiento reproductivo; la relación lineal con la radiación interceptada no describe igual
  todas las fases.

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md; experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md; experimentos_tabulares/literature_vars_20261017__README.md; experimentos_tabulares/modelado__KUMO_V2.md; experimentos_tabulares/modelado__KUMO_RAINFED.md


- **Afirmación errónea:** Lowder et al. (2016) muestra que las parcelas pequeñas son más productivas. → **Corrección:** Lowder, Skoet y Raney (2016, World Development 87: 16–29) describen el número, tamaño y distribución de granjas en el mundo; no miden la productividad por parcela.
- **Afirmación errónea:** McMaster y Wilhelm (1997) fijan la base térmica de los grados-día para la cebada. → **Corrección:** ese artículo trata dos interpretaciones de la ecuación de grados-día; la base de la cebada no se verificó en esta ronda ni en la ronda 4; sigue sin fuente primaria.
- **Afirmación errónea:** La pérdida pinball de Kumo-Tabular está documentada por NVIDIA. → **Corrección:** su ficha pública no la menciona; solo documenta salidas de 999 cuantiles y la licencia OpenMDW 1.1.
- **Afirmación errónea:** El kriging del rendimiento de cebada en México está establecido en la literatura. → **Corrección:** los estudios localizados son de Burkina Faso (2015) y de soya en Brasil (2026). En la ronda 4, las búsquedas en México encontraron kriging de lluvia en Nuevo León, de materia orgánica de suelos
  en Zapopan y de plagas del maíz en el Estado de México, pero ninguno de rendimiento de cebada (SIN EVIDENCIA).

- **Afirmación errónea:** El NIM de KumoRFM tiene licencia no comercial de investigación. → **Corrección:** la búsqueda de la ronda 4 no encontró esa licencia (SIN EVIDENCIA); el servicio ofrece un nivel gratuito sin condiciones descritas.
- **Afirmación errónea:** Los efectos mixtos por municipio ya se aplican al rendimiento de cebada en México. → **Corrección:** no se localizó literatura mexicana de modelos mixtos o SAE para rendimiento de cebada (SIN EVIDENCIA).
- **Afirmación errónea:** La base térmica de 0 °C para la cebada está establecida. → **Corrección:** solo hay citas de resumen de un estudio brasileño (Tb 0, óptima 22 y Tmax 35 °C); sin fuente primaria, debe calibrarse con fenología local.

## Preguntas y respuestas

**P:** ¿Qué métrica usa el proyecto para comparar experimentos?
**R:** El RMSE en t/ha, que penaliza más los errores grandes; también se reportan MAE y R² de validación cruzada.

**P:** ¿Qué significa OOF?
**R:** Out-of-fold: la predicción de cada parcela se hace con un modelo que no la vio en el entrenamiento; es la base de las métricas de CV.

**P:** ¿Algún experimento superó la referencia de forma robusta?
**R:** No. Ni APAR, ni centrado intramunicipal, ni CANOPY_JOINT, ni sensores cruzados, ni Kumo, ni curvas fenológicas superaron la referencia con una regla honesta de validación.

**P:** ¿Cuál es la señal más fuerte del proyecto?
**R:** El nivel entre municipios, que explica 68.6 % de la varianza del rendimiento.

**P:** ¿Cuánto error puede eliminarse en teoría?
**R:** Según A3, el techo práctico es de 0.465 a 0.470 t/ha de RMSE en validación cruzada; el piso de ruido por redondeo es de unos 0.007.

**P:** ¿Por qué no usar embeddings de modelos fundacionales?
**R:** Por el desajuste de soporte espacial (token de 420 m frente a parcelas de 5.5 ha mediana), la suavidad de los embeddings y la falta de señal en las pruebas.

**P:** ¿La lluvia mejora la predicción?
**R:** En las pruebas del corpus no. El control sin clima municipal de Kumo versión 2 tuvo prácticamente el mismo MAE.

**P:** ¿Qué pasó con las variables de PlanetScope?
**R:** Tenían un error de fechas (mes y día intercambiados) que se corrigió; tras la corrección, siguen sin mejorar el RMSE.

**P:** ¿El área de parcela es una variable útil?
**R:** Sólo dentro de Chignahuapan, con una señal que no es robusta al sesgo de selección; la ganancia realista es de 0 a 0.003 RMSE.

**P:** ¿Qué significa "pliegue canónico"?
**R:** Cada uno de los cinco pliegues 80/20 que fija el proyecto; reutilizarlos en muchas pruebas infla las mejoras aparentes.

**P:** ¿Por qué la mediana municipal puede parecer mejor en validación?
**R:** Porque en un conjunto fijo de parcelas un pliegue con nivel alto suele tener otro bajo; la mejora no se sostiene en datos nuevos.

**P:** ¿Qué exige el proyecto para aceptar un modelo nuevo?
**R:** Una ganancia media de al menos max(0.002, z·0.08·D), con z entre 1.25 y 2.4 según el número de variantes probadas (A3).

**P:** ¿Qué limitación tiene la campaña de GPU?
**R:** Su evaluación con R² de 0.648 y 0.635 queda por debajo de la referencia de 0.667, y la fuente indica que el siguiente paso requiere al menos un millón de ejemplos de preentrenamiento.

**P:** ¿Qué dice la literatura sobre si TabPFN supera a los modelos tradicionales con pocos datos?
**R:** Hollmann et al. (2023, arXiv:2207.01848) reportan buen desempeño en clasificación de tablas pequeñas, sin ajuste de hiperparámetros. En rendimiento agrícola la ventaja varía: en Nedungadi et al. (2026) TabPFN obtuvo R² de 0.65 frente a 0.55 de una RF en Estados Unidos, pero empató en Alemania (0.53 en ambos
casos).

**P:** ¿Qué error relativo tuvieron los embeddings de modelos fundacionales en maíz de España?
**R:** En Nedungadi et al. (2025, arXiv:2507.05390, Tabla 2), el nRMSE fue de 14.28 para una RF específica de la tarea, frente a 26.59 (RF sobre entradas de modelos fundacionales), 29.32 (Galileo-RF) y 31.10 (Presto-RF). Menor es mejor.

**P:** ¿Qué establece Monteith (1972) sobre la radiación y la producción de biomasa?
**R:** Que la materia seca producida es proporcional a la radiación fotosintéticamente activa interceptada por el dosel; la pendiente es la eficiencia de uso de la radiación. Sus estimaciones se ajustaron bien en el crecimiento vegetativo, pero sobreestimaron la producción en el reproductivo.

**P:** ¿Qué cifras de Ma et al. (2026) sobre AlphaEarth podemos citar como verificadas?
**R:** Las afirmaciones cualitativas del resumen de arXiv:2601.00857 (competitividad frente a modelos de teledetección con datos locales y transferibilidad espacial limitada) y, desde la ronda 4, los valores de la Tabla 4: en campo, R² de 0.44 frente a 0.46 en maíz, 0.37 frente a 0.35 en soya y 0.43 frente a 0.41 en
trigo; en transferencia de condado a campo, 0.25 frente a 0.38 en maíz y −0.04 frente a 0.22 en trigo. Son datos de Estados Unidos y no son intra-condado.

**P:** ¿KumoRFM tiene una licencia no comercial de investigación publicada?
**R:** No se encontró. La búsqueda de la ronda 4 no halló términos de licencia para ese uso (SIN EVIDENCIA); antes de usarlo hay que revisar los términos del servicio.

**P:** ¿Hay un estudio de kriging del rendimiento de cebada en México?
**R:** No se localizó (SIN EVIDENCIA). Los estudios de kriging encontrados en México tratan lluvia, materia orgánica de suelos y plagas del maíz; los de rendimiento son de Burkina Faso (maíz y otros cultivos) y de soya en Brasil.

**P:** ¿Qué temperatura base usar para grados-día de cebada?
**R:** No hay cifra verificada en fuente primaria. Un estudio brasileño citado en resumen usa 0 °C como base inferior, 22 °C óptima y 35 °C superior; debe calibrarse con fenología local.

**P:** ¿Qué método permite estimar el rendimiento municipal cuando hay pocas parcelas en varios municipios?
**R:** La estimación en áreas pequeñas con efectos aleatorios por municipio (Sugasawa y Kubokawa, 2023; Zimmermann y Münnich, 2018). Para el reto es una hipótesis que requiere validación por municipio.
