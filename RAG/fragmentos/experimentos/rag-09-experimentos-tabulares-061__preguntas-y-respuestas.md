@id: rag-09-experimentos-tabulares-061
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Preguntas y respuestas
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error frente maiz modelos rendimiento validacion datos proyecto arxiv base embeddings error fundacionales municipal parcelas pruebas radiacion referencia senal campo cebada cruzada espacial estados estudio
@fuente: [experimentos_tabulares/spatial_regression__README.md, experimentos_tabulares/modelado__WITHIN_MUNICIPALITY.md, experimentos_tabulares/modelado__CANOPY_JOINT.md, experimentos_tabulares/modelado__CROSS_SENSOR.md, experimentos_tabulares/modelado__CROPLAND_PRETRAINING.md,
# Preguntas y respuestas

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
