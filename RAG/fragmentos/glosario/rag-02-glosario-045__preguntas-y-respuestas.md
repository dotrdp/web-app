@id: rag-02-glosario-045
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Preguntas y respuestas
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos amplitud cebada piso rendimiento indice proyecto reto altiplano aparece cuatro error fira segun siembra significa acepciones asistencia cinco corpus cruzada cultivo describe despues dias
@fuente: [reto_y_datos/Diccionario_de_indices_satelitales.txt, reto_y_datos/Descripcion_general_variables_DataSet.txt, reto_y_datos/literature_review__report__sections__04_datos.typ.txt, teledeteccion_fenologia/literature_review__report__chapters__02_observacion.typ.txt,
# Preguntas y respuestas

**P:** ¿Qué significa NDVI y qué mide?
**R:** Es el Índice de Vegetación de Diferencia Normalizada, un indicador de presencia, vigor y actividad de vegetación verde. El diccionario del reto lo describe de forma conceptual y advierte que sus fórmulas dependen de la implementación del proveedor.

**P:** ¿En qué fase de la cebada de temporal se usa el término "espigamiento"?
**R:** Es la emergencia de la espiga fuera de la vaina. INIFAP reporta espigamiento o floración entre 46 y 72 días después de la siembra en el Altiplano.

**P:** ¿Cuánto dura el ciclo de la cebada de temporal en el Altiplano?
**R:** Según INIFAP, la madurez fisiológica ocurre entre 90 y 132 días después de la siembra, según ambiente y fecha de siembra.

**P:** ¿Qué es la canícula y por qué importa para el reto?
**R:** Es una reducción temporal de lluvias dentro de la temporada, con más calor, también llamada sequía intraestival. Hidalgo tuvo 58 % de su lluvia normal en agosto de 2025, pero el efecto cuantificado sobre la cebada no está documentado.

**P:** ¿Qué diferencia hay entre temporal y riego?
**R:** Temporal es la modalidad en que el cultivo depende de la lluvia o de la humedad residual; riego aplica agua artificialmente. Las capas del reto son mensuales y cubren Hidalgo, Puebla y Tlaxcala.

**P:** ¿Qué unidad usa el reto para el rendimiento?
**R:** Toneladas por hectárea (t/ha). Un valor de 737 kg/ha equivale a 0.737 t/ha.

**P:** ¿Qué es el RMSE y cómo se compara en el proyecto?
**R:** Es la raíz del error cuadrático medio, en las mismas unidades que el rendimiento. En validación cruzada, la referencia de media municipal tuvo 0.4929 t/ha y un modelo de referencia 0.4802 t/ha.

**P:** ¿Qué es la fuga de información?
**R:** Es el uso de información que no estaría disponible al predecir, como la etiqueta de la parcela o datos posteriores al corte. La auditoría del proyecto trata el orden de almacenamiento como fuga.

**P:** ¿Qué es la validación cruzada de cinco pliegues en el proyecto?
**R:** Es repartir las 138 parcelas con rendimiento conocido en cinco subconjuntos, entrenar con cuatro y evaluar con el restante, de modo que cada parcela se predice una vez fuera de su entrenamiento.

**P:** ¿Qué significa "piso" en el corpus?
**R:** Aparece sobre todo como piso de desempeño, un nivel mínimo de error. La acepción altitudinal se describe como piso térmico, con tierra templada y fría en el Altiplano. Las acepciones de piso de arado y de piso como terreno no están documentadas.

**P:** ¿Qué acepciones de amplitud aparecen en el proyecto?
**R:** Amplitud térmica, amplitud de la curva estacional de un índice, amplitud de intervalo de predicción y amplitud de rendimiento. Amplitud geográfica no está documentada.

**P:** ¿Qué es una etiqueta en rejilla de 0.5 t/ha?
**R:** Es un rendimiento registrado en múltiplos de 0.5 t/ha, presente en parte de las parcelas de Calpulalpan, Apan y Emiliano Zapata. Introduce un error de redondeo de variancia 0.0208.

**P:** ¿Qué es la milpa?
**R:** Es un policultivo tradicional de maíz, frijol y calabaza, no un cultivo de cebada. En el corpus solo aparece en el topónimo Nanacamilpa.

**P:** ¿Qué significa FEGA?
**R:** Fondo Especial de Asistencia Técnica y Garantía para Créditos Agropecuarios. Es uno de los cuatro fideicomisos de FIRA y otorga garantías de crédito y asistencia técnica (FIRA, Programa Institucional 2025).

**P:** ¿Qué es FONAGA?
**R:** Fondo Nacional de Garantías, según el glosario de siglas del Programa Institucional 2025 de FIRA. No es uno de los cuatro fideicomisos; su naturaleza jurídica y su relación con FEGA no están documentadas.

**P:** ¿Qué es la encañazón?
**R:** Es el alargamiento de los entrenudos del tallo de la cebada. El término aparece en una publicación en español de la UBA (2026); la equivalencia con los códigos de la escala de Zadoks no está verificada en español.

**P:** ¿Qué es el índice SPI?
**R:** Es el índice estandarizado de precipitación: la precipitación acumulada en una escala de tiempo, transformada a una distribución normal estándar, donde valores negativos indican sequía (Hayes et al., 1999).
