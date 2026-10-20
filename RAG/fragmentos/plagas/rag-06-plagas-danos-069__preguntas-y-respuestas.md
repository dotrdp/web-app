@id: rag-06-plagas-danos-069
@documento: rag-06-plagas-danos | temas/06_plagas_enfermedades_y_deteccion_de_danos.md
@categoria: plagas
@titulo: Preguntas y respuestas
@titulo_documento: Plagas, enfermedades y detección de daños en cebada de temporal con satélite
@etiquetas: plagas; enfermedades; cebada; valles altos; detección de daño; ndvi; anomalía; teledetección; malezas; roya
@claves: plagas enfermedades cebada valles altos deteccion de dano ndvi anomalia teledeteccion malezas roya puede perdida rendimiento dano frente pixel plaga caida chignahuapan estudio mexico porque pulgon ruso agua causa cultivo olivar parcela parcelas resumen satelite
@fuente: [segmentation_pests_ndvi_water__research__prior_work.md, iterate_20261017__research__B1_damage_detection.md, iterate_20261017__research__A2_outlier_forensics.md, webapp__README.md, webapp__PLAN.md, error-spotting-ai-agent-dataset__barley-agronomy-mexico-2026-10-02__problems.csv]
# Preguntas y respuestas

**P:** ¿Cuál es la clase de daño que el proyecto recomienda para el satélite?
**R:** "Pérdida de vegetación / anomalía (causa desconocida)". La causa se asigna después, con calendario, clima y datos de campo.

**P:** ¿Por qué el NDVI no basta para atribuir una plaga?
**R:** Porque una caída de NDVI indica pérdida de vegetación, no su causa. Adams et al. (2021) no separaron langosta de senescencia, y Buchaillot et al. (2022) concluyeron que las anomalías de NDVI no identifican de forma única al gusano cogollero.

**P:** ¿Existe un modelo publicado que segmente cultivo, agua y daño por plagas?
**R:** No. Tres búsquedas independientes en varios idiomas no encontraron ninguno. Los antecedentes más cercanos son Gunawan et al. (2021), con kappa de 0.82 en Sentinel-2 de una fecha, y Prithvi-EO-1.0, que tiene clases de agua y cultivo pero no de daño.

**P:** ¿Qué productos de NASA pueden usarse como etiquetas de agua?
**R:** OPERA DSWx-HLS, desde abril de 2023, con clases 0, 1, 2, 252, 253 y 255. Las cifras de 96 % y 88 % del ATBD no se verificaron en la ronda 4. Para 2022 y Landsat 9 no hay etiquetas oficiales; PROTEUS permite generarlas.

**P:** ¿Cuál es el tamaño típico de parcela frente al píxel?
**R:** La mediana es 5.5 ha (rango 0.35–64 ha). Un píxel de 30 m es de 900 m², así que la mediana tiene unos 61 píxeles y la más pequeña unos 4.

**P:** ¿Qué detectó el análisis B1 sobre tormentas y granizo en 2025?
**R:** Con PlanetScope, 63 eventos de caída en 55 parcelas, 45 en Chignahuapan, casi todos en julio y de reinicio de siembra. Después del pico sólo una caída llegó a −0.10. No hay indicio de un trayecto de granizo, aunque la cobertura de septiembre es escasa.

**P:** ¿Cuántas parcelas tuvieron reinicios de siembra y dónde?
**R:** 18 de 197: 16 en Chignahuapan y 2 en Calpulalpan. Sus picos llegan en el día 274 (1 de octubre), frente al 241 de las demás.

**P:** ¿Qué encontró A2 sobre las parcelas atípicas de Chignahuapan?
**R:** AGC_171 (residual −2.20 t/ha) y AGC_024 (−1.35 t/ha) tienen trayectorias casi idénticas a las de sus vecinos de rendimiento normal. Ninguna de las 19 puntuaciones preregistradas pasó la corrección de Holm (menor p ajustado 0.24).

**P:** ¿Recortar los atípicos mejora el RMSE?
**R:** No. A2 recomienda no recortarlos: subir Chignahuapan 0.04 t/ha aumentaría el RMSE unos 0.002.

**P:** ¿Qué error de datos afecta a las variables de PlanetScope?
**R:** Un parseo de fechas dd/mm/aaaa como mm/dd en la línea 117 del script de variables de literatura: 28,304 de 47,804 filas quedan NaT y 17,835 tienen día y mes intercambiados.

**P:** ¿Cuál es la pérdida documentada de la roya amarilla en México?
**R:** Hasta 53 % de pérdida de rendimiento en el ensayo de 2018 de Rodríguez-García et al. (2021), según el resumen en inglés, con seis variedades y tres ambientes de temporal. Es un valor de ensayo, no un promedio regional. La cifra de 50 % atribuida a 1988 no tiene fuente verificada.

**P:** ¿Cuál fue la severidad de roya amarilla en La Unión y Nanacamilpa en 2022?
**R:** Según Rodríguez-García et al. (2025, Revista Mexicana de Fitopatología 43(4):60), 6.66 % en La Unión (Tlaxco) y 5.41 % en Nanacamilpa, promedios de los tratamientos del Cuadro 1. Son valores de un año y dos localidades, no un promedio regional.

**P:** ¿Hay un umbral de pulgón ruso para cebada en Valles Altos?
**R:** No documentado. El estudio australiano de Van Helden et al. (2022) da cerca de 0.28 % de pérdida por cada punto porcentual de macollos infestados, pero no fija umbrales antes de GS30.

**P:** ¿Qué dice el resumen de Adabella sobre plagas?
**R:** El resumen no menciona plagas: habla de tolerancia a enfermedades y de un rendimiento unos 15 % superior al de Esmeralda en más de 50 combinaciones año-localidad. El texto completo, en la sección de manejo, dice que en general las plagas no causan daños de importancia económica, salvo el pulgón ruso en plántula.

**P:** ¿Cuál es la referencia correcta de la distribución de Rhynchosporium en México?
**R:** Carvajal-Moreno (1988), Boletín de la Sociedad Botánica de México 48:3–11, "Distribución de Rhynchosporium secalis en el mundo y en México".

**P:** ¿Qué especie y lugar describe el artículo de nematodos de Nematropica (2008)?
**R:** *Cactodera rosae* n. sp., descrita por Cid del Prado Vázquez y Miranda (2008) en raíces de cebada var. Esmeralda y suelo asociado de San Juan Ixtilmaco, Apan, Hidalgo.

**P:** ¿En qué etapa es más dañino el pulgón ruso para Adabella?
**R:** En plántula, donde puede matar la planta o reducir el rendimiento. En amacollo el efecto es menor, y en encañe produce espigas estériles (Zamora Díaz et al., 2008).

**P:** ¿Cuánto pierde el rendimiento por cada punto de macollos infestados por pulgón ruso?
**R:** Cerca de 0.28 % en el estudio australiano de Van Helden et al. (2022). Es un valor de otro país; no hay equivalente medido en Valles Altos.


**P:** ¿Por qué un satélite puede no detectar una plaga que sí está en la parcela?
**R:** Porque la señal de la plaga puede ser demasiado pequeña para el píxel (un píxel HLS de 30 m cubre 900 m²), porque puede no haber síntomas en el dosel, por ejemplo en fases asintomáticas o con daño de raíz, o porque las nubes impiden observar la parcela entre pasadas. Esta explicación es la hipótesis del
proyecto.

**P:** ¿El NDVI basta para atribuir una caída del rendimiento a una plaga?
**R:** No. En el olivar de Zarco-Tejada et al. (2018), el NDVI no difirió de forma significativa entre árboles asintomáticos y sintomáticos, y los modelos de banda ancha tuvieron 65.4% de exactitud frente a 80.9% del modelo con SIF y temperatura.

**P:** ¿Qué tan rápido puede un árbol o una planta infectada pasar de asintomático a sintomático?
**R:** En el estudio de olivar, a cuatro meses de la primera fecha, 61% de los árboles falsos positivos remotos había desarrollado síntomas, frente a 39% de los asintomáticos clasificados como no afectados. Es un cultivo leñoso y no equivale a la dinámica en cebada.

**P:** ¿Cuánto daño puede causar la gallina ciega en raíces de cereales?
**R:** Según la ficha de SENASICA, las pérdidas citadas son de 50 a 90% en maíz en Oaxaca y de 22 a 48% en Puebla sin manejo adecuado, ambas citadas de estudios anteriores. En condiciones simuladas en Tamaulipas, larvas de tercer estadio de *Phyllophaga crinita* causaron 66 a 88% de pérdida de raíz en maíz entre julio
y septiembre.

**P:** ¿Qué resolución necesita un sensor para detectar un foco de 10 m de diámetro?
**R:** Un foco de 10 m de diámetro ocupa unos 79 m². Con Sentinel-2 (10 m) puede resolverse solo si domina el píxel; con HLS (30 m) queda diluido. Los autores de Zarco-Tejada et al. (2018) sostienen que la detección temprana requiere imagen submétrica.

**P:** ¿La ausencia de anomalía en satélite prueba que no hay plaga?
**R:** No. Ni siquiera la inspección visual la prueba: en el estudio de olivar tuvo 77.62% de exactitud frente a qPCR. La vigilancia requiere muestreo de campo, trampas o conteos y diagnóstico de laboratorio.
