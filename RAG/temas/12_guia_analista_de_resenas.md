---
id: rag-12-guia-resenas
titulo: Guía operativa para analizar reseñas del Reto AgroCebada (verificación de afirmaciones, taxonomía de errores, rúbrica y análisis de datos)
categoria: guia_resenas
etiquetas: [analisis de resenas, verificacion de afirmaciones, errores frecuentes, rubrica de evaluacion, plantillas de respuesta, analisis de datos, mapa de documentos, reto agrocebada, jerga agronomica, clima de temporal, mercado de la cebada, malteo y calidad, medicion del rendimiento, fisiologia de la cebada,
socioeconomia de productores]
idioma: es
fecha: 2026-10-18
fuentes_internas: [01_reto_agrocebada_y_datos.md, 02_glosario_terminos_es.md, 03_agronomia_cebada_altiplano.md, 04_amplitud_significados.md, 05_acelerar_crecimiento_a_costa_del_piso.md, 06_plagas_enfermedades_y_deteccion_de_danos.md, 07_teledeteccion_y_fenologia.md, 08_experimentos_modelos_profundos_y_fundacionales.md,
09_experimentos_tabulares_espaciales_y_fenologicos.md, 10_validacion_fugas_y_muestras_pequenas.md, 11_revision_de_literatura_y_transferencia.md, 13_variedades_dona_josefa_y_voyager.md, 14_clima_y_riesgo_climatico_altiplano.md, 15_mercado_cadena_de_valor_y_politica.md, 16_malteo_y_calidad_industrial.md,
17_medicion_del_rendimiento_y_estadistica_agricola.md, 18_fisiologia_y_ecofisiologia_de_la_cebada.md, 19_contexto_socioeconomico_y_productores.md, reto_y_datos/BASES_oficiales_Reto_AgroCebada.txt, FORMATO_RAG.md]
fuentes_externas: []
---

Resumen: esta guía indica al agente cómo analizar una reseña escrita en español sobre el Reto AgroCebada 2026 (predicción del rendimiento de cebada maltera de temporal en Hidalgo, Puebla y Tlaxcala). Describe el flujo de trabajo (segmentar, clasificar, verificar contra el RAG, asignar veredicto y citar), la taxonomía
de errores típicos, una tabla de afirmaciones frecuentes con su veredicto y su documento de referencia, la rúbrica alineada con las bases oficiales, plantillas de respuesta y una guía para contar y reportar resultados sobre conjuntos de reseñas. Todo lo que el agente afirme debe apoyarse en los documentos rag-01 a
rag-19; cuando el corpus no documenta algo, la respuesta debe decir "no documentado" o "no verificable".

## Flujo de trabajo: segmentar la reseña en afirmaciones

Antes de juzgar una reseña, separa su texto en afirmaciones atómicas. Una afirmación es una frase que se puede comprobar o refutar, por ejemplo "la cebada de temporal rinde 1.5 a 3 t/ha" o "el NDVI de Planet y Sentinel-2 es equivalente". Las frases que sólo expresan preferencia o juicio ("el dashboard se ve bien") se
marcan como opinión y no se verifican. Si una frase contiene dos hechos (por ejemplo, "138 parcelas con rendimiento y 59 ocultas, con RMSE de 0.30"), sepárala en dos afirmaciones, porque cada una puede tener un veredicto distinto. Conserva la cita textual de cada afirmación, con su número de línea o de párrafo si la
reseña lo permite, para poder señalarla después. No corrijas en este paso; sólo segmenta y numera.

Fuente: FORMATO_RAG.md; 01_reto_agrocebada_y_datos.md (sección "Lo que no se puede concluir sobre la predicción").

## Flujo de trabajo: clasificar cada afirmación

Cada afirmación se asigna a una sola categoría principal: dato del reto (cifras, municipios, fechas, columnas, sensores), agronomía (fenología, siembra, fertilización, plagas, calidad maltera), teledetección (índices, sensores, píxeles, resolución), método o validación (partición, validación cruzada, fugas, métricas,
intervalos), resultado (cifras de nuestros experimentos), recomendación (qué debería hacerse) u opinión. Si una afirmación toca dos categorías, elige la que determina su veracidad: "el NDVI de Planet es igual al de Sentinel-2" es teledetección aunque suene a dato. Esta clasificación se usa después para agrupar errores
y para el análisis de datos de la sección de conteos. Una afirmación sobre agronomía que se apoya en una cifra del reto (por ejemplo, que los rendimientos de Calpulalpan son los más altos) pertenece a dato del reto y a la vez requiere verificar el municipio y el año. Cuando la categoría no es clara, anótala como la más
probable y registra la duda en la columna de confianza.

Fuente: 02_glosario_terminos_es.md (glosario de agronomía, teledetección y validación); 09_experimentos_tabulares_espaciales_y_fenologicos.md (resultados de experimentos).

## Flujo de trabajo: verificar contra el RAG y asignar veredicto

Busca cada afirmación en el documento temático correspondiente (ver el mapa de documentos) y en la tabla de errores de este archivo. Asigna uno de cinco veredictos. **Correcta:** la evidencia coincide con cifra, unidad y alcance. **Incorrecta:** la evidencia la contradice (cifra distinta, unidad equivocada, fuente mal
atribuida o error metodológico conocido). **Imprecisa:** es correcta en lo esencial pero omite unidad, periodo, municipio, condición o incertidumbre, o usa una cifra redondeada fuera de contexto. **No verificable:** el corpus no la documenta; responde "no documentado" y no la des por falsa. **Opinión:** juicio de valor
o preferencia sin afirmación comprobable. Un veredicto "incorrecta" exige citar la evidencia que la contradice; si sólo falta evidencia, el veredicto es "no verificable".

Fuente: FORMATO_RAG.md (regla de distinguir hechos de la literatura, resultados propios e hipótesis); 10_validacion_fugas_y_muestras_pequenas.md (criterio para declarar diferencias no distinguibles).

## Flujo de trabajo: redactar la respuesta con cita al documento

Cada veredicto que no sea "opinión" debe llevar una cita con el identificador del documento, en la forma rag-XX (por ejemplo, rag-01-reto-datos o rag-10-validacion), y el apartado concreto. Escribe primero la evidencia y después la conclusión: "Según rag-01-reto-datos, la resolución de los rasters entregados es de 120
m (2,900 × 3,362 píxeles), no de 15 m." Distingue siempre tres tipos de fuente: hechos de la literatura, resultados de nuestros experimentos (que se describen como "nuestros experimentos" o "el proyecto") y hecho del dataset oficial. No cites nombres de personas del equipo, correos ni rutas de máquinas. Si la respuesta
depende de una cifra que el corpus no tiene, dilo explícitamente.

Fuente: FORMATO_RAG.md (reglas de contenido y de citación); 01_reto_agrocebada_y_datos.md (hechos del dataset oficial).

## Taxonomía de errores: cifras del reto y unidades

Los errores de cifra son los más frecuentes. El reto tiene 197 parcelas georreferenciadas: 138 de ENTRENAMIENTO con rendimiento visible en t/ha y 59 de PREDICCIÓN con rendimiento oculto (el 70 % y el 30 % de las bases). Confundir estas cifras, o afirmar que las 197 tienen rendimiento medido, es incorrecto. Los nueve
municipios están muy desbalanceados: Chignahuapan (Puebla) tiene 100 parcelas (71 y 29), Calpulalpan (Tlaxcala) 44 (30 y 14). Un rendimiento de "4.5 t/ha" en 27 de las 138 parcelas es efecto de redondeo a 0.1 t/ha, y el método de medición no está documentado. En unidades, el rendimiento es t/ha, no kg/ha ni "toneladas
por parcela"; la precipitación es CHIRPS en mm y la temperatura CHIRTS-ERA5 en °C, como promedios mensuales de mínimas y máximas diarias (no temperaturas diarias de la parcela). Los rasters tienen 120 m, no 15 m, y las capas climáticas tienen unos 0.05° (cerca de 5 km).

Fuente: 01_reto_agrocebada_y_datos.md (secciones "Las 197 parcelas y su partición", "Clima" y "Errores frecuentes").

## Taxonomía de errores: protocolos de validación y fuga de información

Dos protocolos no deben mezclarse. La validación cruzada repetida sobre las 138 produce cifras de RMSE
alrededor de 0.47–0.48 t/ha. Comparar una cifra de una partición única de entrenamiento y prueba con una cifra de validación cruzada sobre las 138 parcelas es un error de protocolo. Una fuga de información ocurre cuando el modelo ve datos que no tendría al predecir: usar el orden de almacenamiento de las filas
(asociado a la etiqueta), apilar predicciones de validación cruzada
sin evaluación anidada, elegir variables con las mismas etiquetas que luego se validan, o usar observaciones de noviembre y diciembre de 2025 en una predicción pensada para antes de la cosecha.

Fuente: 08_experimentos_modelos_profundos_y_fundacionales.md (protocolo de partición); 10_validacion_fugas_y_muestras_pequenas.md (fugas y apilamiento); 01_reto_agrocebada_y_datos.md (fechas posteriores al cierre de octubre).

## Taxonomía de errores: sobreinterpretación de diferencias pequeñas de RMSE

Con 138 parcelas, el error estándar del RMSE ronda 0.03 t/ha (aproximación heurística del proyecto, σ/√(2n); no es una fórmula estándar). Una diferencia de 0.003 t/ha (por ejemplo, de 0.471 a 0.468) no es distinguible sin prueba pareada con repeticiones; en remuestreos de 59 parcelas, la desviación de la diferencia
entre dos modelos fue de 0.0045 t/ha. Tampoco se debe afirmar que un modelo es "superior" cuando su intervalo pareado incluye cero, aunque su RMSE puntual sea menor. Una diferencia de 0.01 t/ha tampoco demuestra mejora por sí sola. Lo correcto es comparar contra una línea base fuerte (por ejemplo, la media o un
promedio
municipal con contracción), reportar intervalos y declarar cuando la diferencia es ruido.

Fuente: 10_validacion_fugas_y_muestras_pequenas.md (error estándar y pruebas pareadas); 08_experimentos_modelos_profundos_y_fundacionales.md (intervalos pareados de validación cruzada).

## Taxonomía de errores: causalidad atribuida al NDVI

El NDVI y otros índices de vegetación son indicadores de vigor del dosel; no miden toneladas por hectárea ni atribuyen causa. Una caída de NDVI puede deberse a senescencia (cierre normal del ciclo), a labranza de una fase verde con malezas antes de una siembra tardía, a granizo, a sequía o a plagas, y el NDVI por sí
solo no distingue estas causas. Adams y colaboradores (2021) no pudieron separar langosta de senescencia con NDVI, y Buchaillot y colaboradores (2022) no hallaron correlación entre gusano cogollero y NDVI en todas las observaciones. Además, la caída de NDVI al inicio del llenado de grano puede ocurrir sin cambio visual
del verdor (caso de trigo citado en el corpus). Una reseña que diga "el NDVI bajó, luego hay plaga" es incorrecta, y "hay plaga" sólo puede ser "no verificable" sin inspección de campo.

Fuente: 06_plagas_enfermedades_y_deteccion_de_danos.md (causas de caída de NDVI; Adams et al., 2021; Buchaillot et al., 2022); 07_teledeteccion_y_fenologia.md (caídas de NDVI y senescencia).

## Taxonomía de errores: ambigüedad de términos del reto

Varios términos tienen más de un significado en las reseñas. **"Amplitud"** puede significar amplitud térmica mensual (Tmax del mes menos Tmin del mes), amplitud fenológica del NDVI (pico suavizado menos línea base antes del pico), ancho de un intervalo de predicción o amplitud de la ventana de siembra; hay que
desambiguar por contexto. **"Piso"** en el corpus aparece sobre todo como "piso de desempeño" (nivel de referencia del error); la acepción altitudinal es piso térmico, el "piso de arado" no está documentado y "piso" como suelo es coloquial. **"Temporal"** es la modalidad hídrica sin riego, no la temporada de lluvias.
**"Espigamiento"** es la emergencia de la espiga fuera de la vaina, no la cosecha ni la floración. Si el término es ambiguo en la reseña, pide aclaración en lugar de juzgar.

Fuente: 04_amplitud_significados.md (acepciones de amplitud); 05_acelerar_crecimiento_a_costa_del_piso.md (acepciones de piso); 02_glosario_terminos_es.md (temporal y espigamiento).

## Taxonomía de errores: variedades y variables no disponibles

Las bases y las auditorías del dataset no registran la variedad de cada parcela. **Doña Josefa** es de 6 hileras y **Voyager** de 2 hileras; el reparto de las parcelas entre ambas está confirmado localmente (dato del proyecto). Sobre Doña Josefa, el estudio arbitrado de 2021 (texto completo leído) la presenta como
liberada por el ICAMEX, citando a Guzmán-Ortiz et al. (2019); no se encontró atribución al INIFAP y el año de liberación no se localizó. Su uso maltero está en disputa: ese estudio la clasifica como grano forrajero y otro trabajo de 2019 la propone para cerveza artesanal (literatura secundaria). Voyager se evaluó en
2018 en tres sitios de temporal de México (139.7 días a madurez; susceptible a roya amarilla). Su ciclo de 120 días corresponde a riego en Montana y no se aplica a temporal. La columna "genotype/variety" de un modelo de nuestros experimentos proviene de ensayos CIMMYT, no de las parcelas FIRA. Tampoco hay datos de
suelo (textura, materia orgánica), manejo (fecha
de siembra y cosecha, fertilización, labranza, riego), cultivar o daños en el dataset oficial; sólo elevación y pendiente como variables de terreno. Afirmar que el modelo "ya considera la variedad" o "el suelo" es incorrecto.

Fuente: 13_variedades_dona_josefa_y_voyager.md (variedades y columna genotype/variety); 01_reto_agrocebada_y_datos.md ("Lo que el dataset no contiene").

## Datos externos y sensores: lo que no debe usarse como prior o como etiqueta

Las estadísticas municipales del SIAP no sustituyen el rendimiento de cada parcela. Su cruce con las etiquetas de las parcelas no es sólido (correlación de Spearman −0.30 con n = 8), y asignar una media municipal a muchas parcelas no aporta observaciones independientes. Las cifras de 4.00 t/ha del cierre SIAP 2025 para
Calpulalpan y Nanacamilpa son redondeadas y no revisadas; no deben usarse como prior. Los sensores tampoco se fusionan: el NDVI de Planet y el de Sentinel-2 tienen r = 0.991, pero Planet es en promedio 0.075 mayor, y el LAI difiere en 1.12; el identificador del sensor debe conservarse. El total de 1,032,892
observaciones no son parcelas de cebada: son observaciones multicultivo y de temporal de varias fuentes. Las lecturas de SIAP usadas como referencia regional deben citarse con su año y fuente.

Fuente: 01_reto_agrocebada_y_datos.md ("Datos municipales: SIAP 2025 frente a las etiquetas"); 03_agronomia_cebada_altiplano.md ("Cierre oficial SIAP 2025"); 07_teledeteccion_y_fenologia.md (comparación Planet y Sentinel-2).

## Cómo tratar afirmaciones marcadas como no verificadas en el RAG

Varios documentos rag-01 a rag-19 marcan afirmaciones con «no verificado», «no documentado», «sin verificar», «(prensa)», «sin evidencia» o «resumen de búsqueda». Esas marcas no son veredictos de falsedad: indican que el corpus no pudo confirmar el dato. Antes de usar una afirmación marcada, indica siempre su nivel de
evidencia con una de estas cinco etiquetas:

- **verificado:** la fuente primaria (norma, Diario Oficial, agenda o informe oficial, catálogo oficial, artículo o PDF leído completo) fue revisada en su texto. Puede citarse como hecho, con su referencia.
- **literatura secundaria:** el dato viene de un resumen, de metadatos, de un estudio que cita a otro o de un texto no leído completo. Puede citarse con la referencia y con el alcance del estudio.
- **prensa:** nota periodística, comunicado o cifra de medios. Sirve como contexto; nunca sustenta un veredicto de desempeño ni contradice una cifra académica por sí sola.
- **no verificado:** no se encontró la fuente o no pudo leerse (PDF bloqueado, norma sin tabla, base de datos sin acceso). No se afirma que sea verdadera ni que sea falsa.
- **dato del proyecto:** cifra o hecho de nuestros experimentos o de una verificación local, como el reparto de variedades. Se describe como «nuestros experimentos» o «el proyecto» y no se contrasta con fuentes externas.

Reglas para el agente:
1. Una afirmación marcada como no verificada no sustenta un veredicto «incorrecta». Si la reseña afirma algo que el RAG solo marca como no verificado, el veredicto es «no verificable» y la respuesta dice «no documentado en el corpus», con el nivel de evidencia.
2. Si la reseña cita una cifra no verificada (por ejemplo, la roya amarilla de 1988 con 50 %, o las 27 variables de AgERA5), no la confirmes ni la desmientas: pide la referencia.
3. Si una cifra de prensa contradice una académica, prevalece la académica y la de prensa se cita como «(prensa)».
4. Si dos fuentes de literatura secundaria dan cifras distintas, señala el conflicto con ambas y no elijas la más favorable.
5. Cuando el RAG registre una discrepancia (por ejemplo, 13 % frente a 13.8 % en Ferguson et al.), presenta ambas cifras con su fuente.
6. Nunca presentes una afirmación no verificada como hecho del reto ni como conclusión del proyecto.

Ejemplos del corpus con su nivel:
- Pérdida de peso de 65 % por pulgón ruso en plántula: verificado (agenda INIFAP de Hidalgo 2017, p. 32).
- Equivalencia de 0.28 % de pérdida por punto de macollos infestados: literatura secundaria (estudios de Australia; sin equivalente local).
- Roya amarilla de 1988 con 50 % de pérdida: no verificado (la URL citada corresponde a otro artículo).
- Norma NMX-FF-043-SCFI-2003: verificada en el texto oficial (humedad 11.5–13.5 %; 85 % de grano de tamaño maltero en criba 2.18 × 19 mm; germinación ≥ 85 %; grano dañado ≤ 10 %; peso hectolítrico ≥ 56 kg/hL para seis hileras y ≥ 58 kg/hL para dos hileras); la norma no fija proteína (rag-16-malteo-calidad).
- Obtentor de Doña Josefa (ICAMEX): literatura secundaria (estudio arbitrado de 2021, que cita a Guzmán-Ortiz et al., 2019).
- Doña Josefa «1 t/ha más que Esmeralda»: prensa (2017); el ensayo académico de 2018 da unos 0.76 t/ha: literatura secundaria.
- Estimación por conteo (follaje × densidad por m², extrapolada a la parcela) como mejor predicción local: dato del proyecto (conocimiento local).
- Una plaga se puede propagar y es imperceptible para el satélite: dato del proyecto (conocimiento local).
- Reparto de Doña Josefa y Voyager entre las parcelas: dato del proyecto.
- Cifras de RMSE de validación cruzada sobre las 138 parcelas: dato del proyecto.

## Tabla de afirmaciones típicas (parte 1: dataset y cifras del reto)

Esta tabla consolida los errores frecuentes de los documentos rag-01 a rag-13. Columnas: número, afirmación típica, veredicto y documento de referencia.

| # | Afirmación típica | Veredicto | Documento de referencia |
|---|---|---|---|
| 1 | Las 197 parcelas tienen rendimiento medido en campo | incorrecta | rag-01-reto-datos (138 visibles, 59 ocultas) |
| 2 | El rendimiento de las 197 parcelas está disponible para entrenar | incorrecta | rag-01-reto-datos |
| 3 | Los rasters tienen resolución de 15 m | incorrecta | rag-01-reto-datos (120 m) |
| 4 | Las temperaturas mensuales son la máxima y la mínima del mes | incorrecta | rag-01-reto-datos (promedios mensuales) |
| 5 | Un 0 en un índice es una medición real de cero | incorrecta | rag-01-reto-datos (celda vacía vs cero) |
| 6 | Unir shapefile y CSV por posición de fila es correcto | incorrecta | rag-01-reto-datos (unir por ID) |
| 7 | Planet y Sentinel-2 dan el mismo NDVI porque el nombre es igual | incorrecta | rag-01-reto-datos; rag-07-teledeteccion |
| 8 | El total de 1,032,892 observaciones son parcelas de cebada | incorrecta | rag-01-reto-datos |
| 9 | La media municipal del SIAP es la etiqueta de cada parcela | incorrecta | rag-01-reto-datos; rag-11-literatura |
| 10 | El valor 4.5 t/ha aparece 27 veces porque así se midió | no verificable | rag-01-reto-datos (redondeo no documentado) |
| 11 | Las 197 parcelas se reparten en nueve municipios | correcta | rag-01-reto-datos |
| 12 | Chignahuapan tiene 100 parcelas (71 de entrenamiento y 29 de predicción) | correcta | rag-01-reto-datos |
| 13 | El rendimiento de entrenamiento tiene media de 4 t/ha | imprecisa | rag-01-reto-datos (media 3.955 t/ha) |
| 14 | Las fechas de noviembre y diciembre de 2025 sirven para predecir en octubre | incorrecta | rag-01-reto-datos; rag-11-literatura |
| 15 | El Dataset Básico y el PRO se pueden fusionar | incorrecta | rag-01-reto-datos |
| 16 | La precipitación está en mm y la temperatura en °C | correcta | rag-01-reto-datos |
| 17 | Las 138 parcelas de entrenamiento tienen rendimiento entre 2.00 y 5.59 t/ha | correcta | rag-01-reto-datos |
| 18 | El valor de 4.5 t/ha en 27 parcelas es un error de captura | no verificable | rag-01-reto-datos (método de redondeo no documentado) |

Fuente: 01_reto_agrocebada_y_datos.md; 02_glosario_terminos_es.md; 07_teledeteccion_y_fenologia.md; 10_validacion_fugas_y_muestras_pequenas.md; 11_revision_de_literatura_y_transferencia.md.

## Tabla de afirmaciones típicas (parte 2: agronomía, plagas y teledetección)

| # | Afirmación típica | Veredicto | Documento de referencia |
|---|---|---|---|
| 19 | La cebada de temporal rinde 1.5 a 3 t/ha según la agenda de Hidalgo | incorrecta | rag-03-agronomia (cifra del capítulo de canola) |
| 20 | La cebada de temporal rinde en promedio 2 a 2.5 t/ha en datos del SIAP 2015–2024 | no verificable | rag-03-agronomia (la serie SIAP no se reconfirmó: nube.siap.gob.mx no fue accesible; la agenda de Hidalgo 2017 da 2,705 kg/ha para 2015, dato de agenda: verificado) |
| 21 | Calpulalpan y Nanacamilpa son las más productivas (4.00 t/ha) | incorrecta | rag-03-agronomia (cifras redondeadas, no revisadas) |
| 22 | Adabella siempre rinde más que Esmeralda | incorrecta | rag-03-agronomia (depende del ambiente) |
| 23 | El pulgón ruso transmite el virus del enanismo amarillo | incorrecta | rag-03-agronomia; rag-06-plagas-danos |
| 24 | Más semilla siempre da más rendimiento | incorrecta | rag-03-agronomia (acame y competencia) |
| 25 | Las heladas de 2025 dañaron la cebada de la zona | no verificable | rag-03-agronomia (sin siniestros SIAP) |
| 26 | El NDVI mide toneladas por hectárea | incorrecta | rag-02-glosario; rag-03-agronomia |
| 27 | Un NDVI alto indica rendimiento alto | imprecisa | rag-02-glosario (predictor potencial) |
| 28 | Una caída de NDVI indica plaga | incorrecta | rag-06-plagas-danos |
| 29 | Una caída de NDVI al final del ciclo siempre es senescencia | imprecisa | rag-07-teledeteccion |
| 30 | DSWx-HLS mapea daño por plagas | incorrecta | rag-06-plagas-danos (sólo agua) |
| 31 | Quitar los atípicos mejora el RMSE | incorrecta | rag-06-plagas-danos (sube unos 0.002) |
| 32 | Las plagas no causan daños económicos en Valles Altos | no verificable | rag-06-plagas-danos |
| 33 | La roya amarilla redujo 50 % la cebada en 1988 | no verificable | rag-06-plagas-danos (la URL citada corresponde a un artículo de Adabella; no hay fuente para la cifra) |
| 34 | En 2022 la roya amarilla afectó 5.4 a 6.7 % de la cebada de Valles Altos como promedio regional | imprecisa | rag-06-plagas-danos (Rodríguez-García et al., 2025: 5.41 % en Nanacamilpa y 6.66 % en La Unión; son promedios de cinco ambientes de un año, no regionales; el grupo G77 queda identificado) |
| 35 | Las cifras de Rhynchosporium (10–45 %) son de México | incorrecta | rag-06-plagas-danos (Etiopía y Australia) |
| 36 | La cobertura de espiga se mide con Sentinel-2 o PlanetScope | incorrecta | rag-07-teledeteccion |

Fuente: 03_agronomia_cebada_altiplano.md; 06_plagas_enfermedades_y_deteccion_de_danos.md; 07_teledeteccion_y_fenologia.md; 02_glosario_terminos_es.md.

## Tabla de afirmaciones típicas (parte 3: amplitud, validación y resultados)

| # | Afirmación típica | Veredicto | Documento de referencia |
|---|---|---|---|
| 37 | HLS a 30 m es adecuado para parcelas de 1 ha | imprecisa | rag-07-teledeteccion (1 a 4 píxeles puros) |
| 38 | El corte del 31 de octubre no afecta la fenología | incorrecta | rag-04-amplitud; rag-07-teledeteccion |
| 39 | La amplitud del NDVI es el máximo menos el mínimo del año | incorrecta | rag-04-amplitud (pico menos línea base) |
| 40 | La amplitud térmica se mide cada día en la parcela | incorrecta | rag-04-amplitud (media mensual en celdas de 5 km) |
| 41 | Un intervalo estrecho demuestra que 100 kg/ha es alcanzable | incorrecta | rag-04-amplitud |
| 42 | La amplitud de la curva NDVI mejoró la predicción dentro del municipio | incorrecta | rag-04-amplitud (resultado nulo) |
| 43 | Las 114 parcelas sin senescencia y las 107 censuradas son la misma cifra | incorrecta | rag-04-amplitud (sensores distintos) |
| 44 | La helada mata la cebada a −7 °C en todo el Altiplano | no verificable | rag-04-amplitud (no documentado) |
| 45 | La desviación estándar del raster es la variación del mes | incorrecta | rag-04-amplitud |
| 46 | El R² de 0.79 de García-Martínez en Acambay valida la estimación de cebada | incorrecta | rag-02-glosario (el corpus lo describe como R² de maíz bajo sequía, sin validación externa; la cifra no se reconfirmó en línea: no verificado) |
| 47 | Un R² alto en validación cruzada garantiza buen desempeño nuevo | incorrecta | rag-02-glosario; rag-10-validacion |
| 48 | Una diferencia de 0.01 t/ha demuestra que un modelo es mejor | incorrecta | rag-02-glosario; rag-10-validacion |
| 49 | El RMSE bajó de 0.471 a 0.468; el modelo nuevo es mejor | incorrecta | rag-10-validacion (error estándar ≈ 0.03, aproximación heurística) |
| 50 | Apilar predicciones de validación cruzada da evaluación honesta | incorrecta | rag-10-validacion |
| 51 | Excluir las dos parcelas de mayor error es prueba de robustez | incorrecta | rag-10-validacion |
| 52 | Redondear predicciones a 0.5 mejora el RMSE | incorrecta | rag-10-validacion |
| 53 | El mínimo del error de validación cruzada estima bien el desempeño | incorrecta | rag-10-validacion (sesgo a la baja) |

Fuente: 04_amplitud_significados.md; 02_glosario_terminos_es.md; 10_validacion_fugas_y_muestras_pequenas.md; 07_teledeteccion_y_fenologia.md.

## Tabla de afirmaciones típicas (parte 4: modelos, variedades, literatura y opinión)

| # | Afirmación típica | Veredicto | Documento de referencia |
|---|---|---|---|
| 54 | Kumo mejora el RMSE del proyecto | imprecisa | rag-09-experimentos-tabulares (0.002433 t/ha, IC incluye cero) |
| 55 | Kumo rainfed alcanzó R² de 0.85 | incorrecta | rag-09-experimentos-tabulares (no hay evaluación held-out completa) |
| 56 | El APAR o el NDVI mejoran la regresión espacial | incorrecta | rag-09-experimentos-tabulares (0 de 20 splits) |
| 57 | El área de parcela explica el rendimiento | imprecisa | rag-09-experimentos-tabulares (sólo Chignahuapan) |
| 58 | Las curvas fenológicas predicen el rendimiento | incorrecta | rag-09; rag-07-teledeteccion |
| 59 | MMST-ViT es superior a los demás modelos del benchmark | incorrecta | rag-08-experimentos-profundos (IC incluye cero) |
| 60 | Los embeddings AlphaEarth mejoran significativamente el random forest | incorrecta | rag-08-experimentos-profundos (0.0124 t/ha) |
| 61 | Doña Josefa y Voyager responden igual a los fungicidas | incorrecta | rag-06-plagas-danos; rag-13-variedades (el resumen de 2021 reporta respuestas distintas por variedad; Voyager requiere el texto completo) |
| 62 | WOFOST o SCYM predicen bien con parámetros genéricos | incorrecta | rag-08-experimentos-profundos (RMSE 0.877 a 0.892) |
| 63 | Doña Josefa es una variedad del INIFAP | incorrecta | rag-13-variedades (el estudio arbitrado de 2021 la atribuye al ICAMEX; no se encontró atribución al INIFAP) |
| 64 | El dataset FIRA trae la variedad de cada parcela | incorrecta | rag-13-variedades |
| 65 | Voyager es una variedad desarrollada para el Altiplano mexicano | no verificable | rag-13-variedades (sin obtentor documentado; se evaluó en tres sitios de temporal de México en 2018) |
| 66 | La cebada de 2 hileras rinde más que la de 6 hileras | imprecisa | rag-13-variedades (depende de variedad y ambiente: en el ensayo de temporal de 2018, Doña Josefa de 6 hileras rindió más que Voyager de 2 hileras) |
| 67 | Los 968 registros CIMMYT son cebada de temporal en tres estados | incorrecta | rag-11-literatura (el artículo reporta 968 registros a escala nacional, sin separar régimen ni estado; nuestro filtro da 94 de temporal en tres estados) |
| 68 | La agricultura de conservación aumenta el rendimiento según Ferguson et al. | incorrecta | rag-11-literatura |
| 69 | Un pronóstico satelital mejora el crédito rural en México | no verificable | rag-11-literatura |
| 70 | La milpa es un cultivo de cebada en el Altiplano | incorrecta | rag-02-glosario |
| 71 | Temporal significa temporada de lluvias | incorrecta | rag-02-glosario |
| 72 | La mancha verde de enero indica suelo fértil | imprecisa | rag-07-teledeteccion |
| 73 | El dashboard se ve bien y es fácil de usar | opinión | este documento (sección de flujo) |

Fuente: 08_experimentos_modelos_profundos_y_fundacionales.md; 09_experimentos_tabulares_espaciales_y_fenologicos.md; 11_revision_de_literatura_y_transferencia.md; 13_variedades_dona_josefa_y_voyager.md; 02_glosario_terminos_es.md; 07_teledeteccion_y_fenologia.md.

## Tabla de afirmaciones típicas (parte 5: errores de las rondas 2 y 3)

Filas añadidas a partir de los errores frecuentes de los documentos rag-01 a rag-13 tras las rondas 2 y 3 de verificación. El nivel de evidencia entre paréntesis sigue la clasificación de la sección «Cómo tratar afirmaciones marcadas como no verificadas en el RAG».

| # | Afirmación típica | Veredicto | Documento de referencia |
|---|---|---|---|
| 74 | AlphaEarth tiene capas anuales hasta 2025 en el catálogo de Google Earth Engine | incorrecta | rag-01-reto-datos (el catálogo indica 2017 a 2024; las capas 2017 a 2025 son descarga del proyecto: dato del proyecto) |
| 75 | AlphaEarth no tiene capa de 2025 | imprecisa | rag-01-reto-datos (el proyecto descargó y validó capas de 2017 a 2025; conviene citar la fecha de descarga: dato del proyecto) |
| 76 | Las Reglas de Operación del DOF de diciembre de 2025 son exclusivas de FIRA | incorrecta | rag-01-reto-datos (nota del DOF del 1 de diciembre de 2025 sobre apoyos de varios sectores; menciona fideicomisos de FIRA como fuente de recursos: verificado) |
| 77 | El CEM 4.0 de INEGI tiene 15 m de resolución | no verificable | rag-01-reto-datos (el 15 m documentado corresponde al CEM 3.0; la versión 4.0 no está documentada: no verificado) |
| 78 | AgERA5 v2 tiene 27 variables diarias | no verificable | rag-01-reto-datos (CDS lista 16 variables principales y ECMWF cita unas 22; el total no está confirmado: no verificado) |
| 79 | Todas las parcelas del reto son de la misma variedad | incorrecta | rag-01-reto-datos; rag-13-variedades (las parcelas se reparten entre Doña Josefa y Voyager: dato del proyecto) |
| 80 | Doña Josefa rinde 1 t/ha más que Esmeralda en temporal | imprecisa | rag-13-variedades (ensayo académico de 2018: unos 0.76 t/ha, promedio de tratamientos: literatura secundaria; la cifra de 1 t/ha es de prensa de 2017) |
| 81 | Esmeralda se liberó en 1991 o en 1993 | incorrecta | rag-03-agronomia (la agenda técnica INIFAP de Hidalgo 2017, pp. 33–34, indica 1992: verificado) |
| 82 | Esmeralda madura en 95 a 115 días según la agenda de Hidalgo | no verificable | rag-03-agronomia (la agenda no da días a madurez; en el ensayo de 2018 fueron 121.4 días: literatura secundaria) |
| 83 | La agenda de Hidalgo 2017 permite sembrar cebada hasta el 10 de junio | incorrecta | rag-03-agronomia (cuadro 2: 1 de mayo a 15 de junio, 15 de mayo a 20 de junio y 1 a 30 de junio; el 10 de junio es de la agenda de Tlaxcala: verificado) |
| 84 | La densidad de siembra de Esmeralda es de 110 kg/ha con sembradora y 130 kg/ha al voleo | correcta (suelo pesado) | rag-03-agronomia (Agenda Técnica Agrícola de Hidalgo 2017, INIFAP, Cuadro 3: 110 kg/ha con sembradora y 130 kg/ha al voleo en suelo pesado; 100 y 120 kg/ha en suelo ligero; verificado en el texto de la agenda) |
| 85 | Hidalgo y Tlaxcala recomiendan la misma fertilización 60-46-30 para la cebada de temporal | incorrecta | rag-03-agronomia (Hidalgo: 60-46-30 solo para muy buena productividad, 46-46-30 para buena; Tlaxcala 2017: 60-40-30 para muy buena y buena: verificado) |
| 86 | El pulgón ruso causa pérdidas de peso de 65 % en la plántula de cebada | correcta | rag-06-plagas-danos; rag-03-agronomia (agenda de Hidalgo 2017, p. 32; hasta 42 % en amacollamiento: verificado) |
| 87 | Cada punto de macollos infestados por pulgón ruso equivale a 0.28 % de pérdida en Valles Altos | no verificable | rag-06-plagas-danos (el 0.28 % es de estudios de Australia; no hay equivalente local: literatura secundaria) |
| 88 | Windels (2000), *Fusarium head blight of barley*, documenta pérdidas de rendimiento de la cebada | incorrecta | rag-06-plagas-danos (el volumen 90:17–21 corresponde a impactos económicos de la fusariosis en las Grandes Llanuras del Norte; las cifras de cebada no están verificadas: verificado el título) |
| 89 | La escaldadura es una de las enfermedades más importantes de la cebada en México según el Boletín de 1988 | no verificable | rag-06-plagas-danos (el artículo de 1988 es una revisión de distribución que confirma presencia en Hidalgo, Puebla y Tlaxcala, sin medir importancia relativa: verificado) |
| 90 | Doña Josefa es la variedad más susceptible a la roya de la hoja | incorrecta | rag-06-plagas-danos; rag-13-variedades (el estudio de 2018 evalúa roya amarilla, no de la hoja; Doña Josefa aparece resistente con severidad final de 0.27 %: literatura secundaria) |
| 91 | Doña Josefa es resistente a la roya amarilla | imprecisa | rag-13-variedades (severidad final de 0.27 % en el ensayo de 2018 y resistencia según la literatura citada; el estudio de 2019 habla de resistencia a enfermedades sin nombrar la roya: literatura secundaria) |
| 92 | Doña Josefa madura a los 125.8 días en cualquier ambiente | imprecisa | rag-13-variedades (125.8 días a madurez en el ensayo de temporal de 2018: literatura secundaria; el ciclo depende del ambiente) |
| 93 | Doña Josefa es cebada maltera de 6 hileras, sin matices | imprecisa | rag-13-variedades (6 hileras es dato del proyecto; su uso maltero está en disputa: el estudio de 2021 la clasifica como grano forrajero y el de 2019 la propone para cerveza artesanal) |
| 94 | Voyager es de 2 hileras y se evaluó en temporal mexicano en 2018 | correcta | rag-13-variedades (2 hileras es dato del proyecto; la evaluación de 2018 en tres sitios de temporal está en el estudio de 2021: literatura secundaria) |
| 95 | Voyager madura en 120 días en temporal | incorrecta | rag-13-variedades (120 días corresponde a riego en Montana; en temporal de 2018 fueron 139.7 días: literatura secundaria) |
| 96 | Voyager no tiene registro en Canadá | incorrecta | rag-13-variedades (existe registro canadiense en el CFIA: verificado; el registro en el SNICS no se pudo confirmar por nombre) |
| 97 | Voyager es susceptible a la mancha neta | no verificable | rag-13-variedades (la ficha de Montana State University es inconsistente: moderada en una sección y susceptible en otra: literatura secundaria) |
| 98 | La pérdida de 53 % por roya amarilla es el promedio del ensayo de 2018 | incorrecta | rag-13-variedades (53 % es la pérdida máxima de Apizaco en Relinas; las pérdidas promedio por variedad van de 12 a 31 %: literatura secundaria) |
| 99 | Un fungicida aumentó 35 % el rendimiento en promedio de las variedades | incorrecta | rag-13-variedades (el promedio de azoxistrobina más tebuconazol frente al testigo fue de +19.8 %; el 35 % corresponde a Apizaco: literatura secundaria) |
| 100 | Adabella tiene ciclo de 98 a 132 días y es de seis hileras | incorrecta | rag-13-variedades (la madurez reportada es de 90 a 132 días; la ficha de liberación no declara el tipo de hilera: literatura secundaria) |
| 101 | Adabella se liberó en 2004 | correcta | rag-13-variedades (ficha de liberación del INIFAP, 2008; cruza de 1989: literatura secundaria) |
| 102 | Adabella se siembra con 90 a 100 kg/ha | incorrecta | rag-13-variedades (el rango de densidad es de 70 a 100 kg/ha: literatura secundaria) |
| 103 | La sequía reduce 80 % el rendimiento de cebada en parcelas de temporal | imprecisa | rag-05-crecimiento-piso (la cifra corresponde a un experimento controlado de 2016 en Montecillo con genotipos seleccionados, tabla 4 de un congreso de 2017: literatura secundaria) |
| 104 | Terra Latinoamericana 2003 mide mineralización de N en cebada del Altiplano | incorrecta | rag-05-crecimiento-piso (es un ensayo de avena forrajera en la Comarca Lagunera, de 1995 a 1999: verificado) |
| 105 | El tepetate cubre 54 % de la superficie de Tlaxcala | incorrecta | rag-05-crecimiento-piso (la cifra verificada es 15 % de la superficie estatal según Haulon et al.: literatura secundaria; la de 54 % no se encontró) |
| 106 | Mg/ha/año y t/ha/año son unidades distintas | incorrecta | rag-05-crecimiento-piso (1 Mg equivale a 1 t: son la misma unidad; las diferencias son de método y sitio: verificado) |
| 107 | La labranza cero de 22 años del INIFAP en San Luis Potosí demuestra más rendimiento de cebada | incorrecta | rag-05-crecimiento-piso (el ensayo es de maíz; mejora porosidad, densidad aparente e infiltración; el rendimiento no está confirmado: literatura secundaria) |
| 108 | El 83.3 % de compactación superficial de López Báez et al. corresponde al Altiplano | incorrecta | rag-05-crecimiento-piso (las cifras son de parcelas mecanizadas de maíz en Chiapas, 2018: verificado) |
| 109 | La urea acidifica siempre el suelo | imprecisa | rag-05-crecimiento-piso (Márquez Aguilar et al. (2025) la asocian a dosis excesivas en suelos ácidos con poca materia orgánica: literatura secundaria) |
| 110 | DeepCropNet usa imágenes satelitales y alcanza 0.82 Mg/ha en cebada | incorrecta | rag-08-experimentos-profundos (Lin et al. (2020) usan solo variables meteorológicas y se evaluaron en maíz de Estados Unidos: literatura secundaria) |
| 111 | El MMST-ViT original reporta resultados de cebada en condados de México | incorrecta | rag-08-experimentos-profundos (el artículo usa condados de Estados Unidos y cuatro cultivos: maíz, algodón, soya y trigo de invierno: literatura secundaria) |
| 112 | WOFOST tiene parámetros de cebada de temporal validados para México | no verificable | rag-08-experimentos-profundos (no se localizaron calibraciones de cebada de temporal en México: no verificado) |
| 113 | Un resultado en una sola partición de entrenamiento y prueba equivale a validación cruzada | incorrecta | rag-08-experimentos-profundos (la validación cruzada es sobre las 138 parcelas; las cifras de desempeño del documento proceden solo de ella: dato del proyecto) |
| 114 | «BBC-CV» es el título del artículo de Tsamardinos et al. (2018) | incorrecta | rag-10-validacion (el título es «Bootstrapping the out-of-sample predictions for efficient and accurate cross-validation»; la versión publicada llama BBCD-CV a la variante con descarte: verificado) |
| 115 | Wang y Heitjan (2008) demuestran heaping en rendimientos agrícolas | incorrecta | rag-10-validacion (el estudio trata conteos de cigarros autorreportados; sirve como referencia metodológica: literatura secundaria) |
| 116 | La validación espacial es siempre la correcta, y la no espacial siempre sobreestima | imprecisa | rag-10-validacion (Ploton et al. (2020) y Roberts et al. (2017) advierten de sobreestimación; Wadoux et al. (2021) cuestionan la validación espacial como estimador de exactitud: la elección depende de la pregunta: literatura secundaria) |
| 117 | El estimador de Stein reduce siempre el error a la mitad | incorrecta | rag-10-validacion (Efron y Morris (1975) reportan una reducción mayor que la mitad en sus ejemplos; la ganancia depende de la estructura de varianzas: literatura secundaria) |
| 118 | Desiere y Jolliffe (2018) muestran el patrón de tamaño de parcela en Uganda | incorrecta | rag-09-experimentos-tabulares (su estudio usa datos de Etiopía; el patrón de Uganda corresponde a Gourlay et al. (2019): literatura secundaria) |
| 119 | Ma et al. (2026) muestran R² de 0.44 frente a 0.46 en maíz dentro del condado | no verificable | rag-09-experimentos-tabulares (el artículo se envió el 30 de diciembre de 2025, arXiv:2601.00857; el PDF no fue legible: no verificado) |
| 120 | Los embeddings fundacionales igualan a una RF específica en maíz de España (Nedungadi et al. 2025) | incorrecta | rag-09-experimentos-tabulares (nRMSE de 26.6 a 31.1 frente a 14.3 de la RF específica: casi el doble de error relativo: literatura secundaria) |
| 121 | TabPFN supera siempre a los árboles o a la regresión en rendimiento agrícola | incorrecta | rag-09-experimentos-tabulares (la ventaja no es universal según Nedungadi et al. (2026) y Sabo et al. (2025): literatura secundaria) |
| 122 | La eficiencia de uso de la radiación de Monteith es constante durante todo el ciclo | incorrecta | rag-09-experimentos-tabulares (el modelo original de Monteith (1972) sobreestima la producción durante el crecimiento reproductivo: literatura secundaria) |
| 123 | Lowder et al. (2016) muestran que las parcelas pequeñas son más productivas | incorrecta | rag-09-experimentos-tabulares (Lowder, Skoet y Raney (2016) describen número, tamaño y distribución de granjas; no miden productividad por parcela: verificado) |
| 124 | McMaster y Wilhelm (1997) fijan la base térmica de los grados-día para la cebada | no verificable | rag-09-experimentos-tabulares (el artículo trata dos interpretaciones de la ecuación; la base de la cebada no se verificó: no verificado) |
| 125 | La pérdida pinball de Kumo-Tabular está documentada por NVIDIA | no verificable | rag-09-experimentos-tabulares (la ficha pública documenta 999 cuantiles y la licencia OpenMDW 1.1, pero no la pérdida pinball: verificado el alcance de la ficha) |
| 126 | El kriging del rendimiento de cebada en México está establecido en la literatura | no verificable | rag-09-experimentos-tabulares (los estudios localizados son de Burkina Faso (2015) y de soya en Brasil (2026); ninguno de cebada en México: no verificado) |
| 127 | El índice de daño de cultivo (CDI) predice con R² de 0.91 el rendimiento de cebada en Canadá | imprecisa | rag-07-teledeteccion (resumen de congreso de EGU24 sobre parcelas del sur de Australia; el R² de 0.91 es de cebada y 0.83 de trigo de invierno: literatura secundaria) |
| 128 | La r de 0.23 a 0.63 de Hassan et al. (2018) relaciona cada índice con el rendimiento | incorrecta | rag-07-teledeteccion (es el rango de correlaciones entre índices, peso de mil granos y rendimiento: literatura secundaria) |
| 129 | Planet Fusion predice el espigamiento del arroz con RMSE de 6.6 a 7 días | incorrecta | rag-07-teledeteccion (los RMSE son de floración del arroz en Nueva Gales del Sur, Australia: literatura secundaria) |
| 130 | PlanetScope tiene exactamente 3 m de resolución en todos sus productos | incorrecta | rag-07-teledeteccion (el píxel nadir nativo es de 3.7 m; los productos remuestreados se citan de unos 3 m y algunos artículos usan 4 m: literatura secundaria) |
| 131 | El NDVI nunca satura, así que el pico siempre refleja biomasa | incorrecta | rag-07-teledeteccion (Huete et al. (2002) muestran saturación asintótica en biomasa alta; el EVI conserva sensibilidad: literatura secundaria) |
| 132 | HLS tiene bandas red-edge en todos sus componentes | incorrecta | rag-07-teledeteccion (HLSL30, de Landsat 8 y 9, no tiene red-edge; solo HLSS30 (Sentinel-2) la tiene: verificado en la documentación de LP DAAC) |
| 133 | greenup50 es la fecha de siembra o de emergencia | incorrecta | rag-07-teledeteccion (es el cruce del 50 % de la amplitud del verdeo, una aproximación al desarrollo: dato del proyecto) |
| 134 | El conteo de espigas tiene R² de 0.05 a 0.30 con el rendimiento en trigo duro (Fernandez-Gallego et al. 2018) | no verificable | rag-07-teledeteccion (el resumen reporta correlación significativa, mayor con imágenes en antesis; el rango de R² no aparece: literatura secundaria) |
| 135 | El error de 6.5 días en la fecha de cosecha con coherencia de Sentinel-1 viene de Kazajistán | incorrecta | rag-07-teledeteccion (el estudio de coherencia más cercano es de Ontario, Canadá (2019), con 85 % de exactitud; el error de 6.5 días no se encontró: literatura secundaria) |
| 136 | El seguro paramétrico satelital de AGROASEMEX es un seguro de cebada | no verificable | rag-11-literatura (el diseño documentado es para ganadería y pastizales, con índice 1/NDVIcp; no hay evidencia de un seguro de cebada con rendimiento satelital: no verificado) |
| 137 | La FND es hoy una institución de crédito y gestión de riesgos agrícolas | incorrecta | rag-11-literatura (el decreto del DOF de 29 de mayo de 2023 la extinguió y la dejó en liquidación (INDEP): verificado) |
| 138 | Presto tiene 0.81 millones de parámetros en su codificador | incorrecta | rag-11-literatura (0.81 millones corresponde al codificador más decodificador; el codificador congelado tiene 402 000 (≈0.40 millones), tablas 4 y 8 del artículo: verificado) |
| 139 | Gómez Mercado et al. (2009) usaron AquaCrop | incorrecta | rag-11-literatura (el texto usa la metodología FAO de zonas agroecológicas; AquaCrop no aparece: verificado en texto completo) |
| 140 | Iranzo et al. (2022) trabajan con etiquetas a escala distrital | incorrecta | rag-11-literatura (el estudio es de un campo de 127 ha en Belchite, España, a escala de parcela: literatura secundaria) |
| 141 | Ferguson et al. reportan 13.8 % de mortalidad atribuible a partículas finas en 2009 a 2022 | no verificable | rag-11-literatura (la fuente pública institucional da 13 % en el máximo diario y no contiene 13.8 % ni el periodo 2009–2022; el manuscrito no fue accesible: no verificado) |
| 142 | EarthShift reporta una caída de 60 % del rendimiento de cebada | incorrecta | rag-11-literatura (es una cifra de un agregador, no del artículo; no se usa: literatura secundaria) |

Fuente: 01_reto_agrocebada_y_datos.md; 03_agronomia_cebada_altiplano.md; 05_acelerar_crecimiento_a_costa_del_piso.md; 06_plagas_enfermedades_y_deteccion_de_danos.md; 07_teledeteccion_y_fenologia.md; 08_experimentos_modelos_profundos_y_fundacionales.md; 09_experimentos_tabulares_espaciales_y_fenologicos.md;
10_validacion_fugas_y_muestras_pequenas.md; 11_revision_de_literatura_y_transferencia.md; 13_variedades_dona_josefa_y_voyager.md; registros de verificación de las rondas 2 y 3.

## Tabla de afirmaciones típicas (parte 6: documentos rag-14 a rag-19 y ronda 4)

Filas añadidas a partir de los errores frecuentes de los documentos rag-14 a rag-19 y de las correcciones de la ronda 4 de verificación. Las cifras de prensa se citan como «(prensa)» y nunca sustentan un veredicto de desempeño.

| # | Afirmación típica | Veredicto | Documento de referencia |
|---|---|---|---|
| 143 | Los rasters CHIRTS-ERA5 dan la temperatura mínima absoluta del mes | incorrecta | rag-14-clima (son promedios mensuales de la temperatura mínima diaria, en °C) |
| 144 | Con los rasters mensuales se cuentan los días con helada de cada parcela | incorrecta | rag-14-clima (hace falta la serie diaria de temperatura mínima) |
| 145 | El valor de CHIRPS es la lluvia de la parcela | incorrecta | rag-14-clima (es una celda de 0.05°, unos 29 km² en el centro de México) |
| 146 | El umbral de 4 °C aplica a la cebada | incorrecta | rag-14-clima (es el umbral del maíz en Toluca, Jasso-Miranda et al., 2022; la cebada tiene umbrales por etapa) |
| 147 | Los grados-día se calculan igual en todos los estudios | incorrecta | rag-14-clima (McMaster y Wilhelm (1997) dan dos interpretaciones de la misma ecuación; hay que declarar base y método) |
| 148 | El SPI y el SPEI son equivalentes | incorrecta | rag-14-clima (el SPEI resta la evapotranspiración potencial; Vicente-Serrano et al., 2010) |
| 149 | La sequía de 2025 afectó 13.7 % o 21.1 % del territorio | no verificable | rag-14-clima (cifras de prensa con cortes distintos; debe usarse el reporte del Monitor de Sequía del SMN) |
| 150 | Calpulalpan representa todo el Altiplano | incorrecta | rag-14-clima (es un estudio de un municipio con AquaCrop, Calderón-García et al., 2015) |
| 151 | El costo de producción de la cebada en Hidalgo es de 7,290 pesos por hectárea | incorrecta | rag-15-mercado (es cifra de maíz en la región de Tulancingo, Ayala-Garay et al., 2013; la única cifra de cebada es de Calpulalpan en 2013: 6,480 pesos por hectárea) |
| 152 | Hidalgo sembró 110,000 ha de cebada según el SIAP | incorrecta | rag-15-mercado (la cifra es de la asociación de cebaderos citada en prensa; el Panorama del SIAP da 105,188 ha para 2022) |
| 153 | El precio de la cebada maltera en 2025 fue de 7,500 pesos por tonelada | no verificable | rag-15-mercado (sin confirmación oficial; la prensa da 8,680 pesos por tonelada en 2024 y 7,000 con fecha no confirmada) |
| 154 | Tlaxco y Calpulalpan tienen 14,864 y 19,709 ha de cebada | incorrecta | rag-15-mercado (14,864 ha en Tlaxco y 13,209 ha en Calpulalpan son cebada grano del Panorama 2023; 19,709 ha es la superficie sembrada total de Calpulalpan) |
| 155 | La superficie sembrada de cebada indica la producción | incorrecta | rag-15-mercado (la producción depende de la superficie cosechada y del rendimiento) |
| 156 | El tonelaje contratado con cerveceras equivale a la producción del Altiplano | incorrecta | rag-15-mercado (es una intención de compra; el acuerdo de 2021 de 500,000 t no es una cifra de producción) |
| 157 | La cadena cebada–malta–cerveza es autosuficiente en México | incorrecta | rag-15-mercado (la industria importa malta y cebada; no hay volumen oficial verificado) |
| 158 | La NMX-FF-043-SCFI-2003 fija un límite de proteína | incorrecta | rag-16-malteo-calidad (el texto oficial no fija proteína; fija humedad, calibre, germinación, grano dañado y peso hectolítrico) |
| 159 | El peso hectolítrico mínimo de la cebada maltera es 56 kg/L | imprecisa | rag-16-malteo-calidad (la unidad es kg/hL: 56 para seis hileras y 58 para dos hileras) |
| 160 | El mínimo de germinación de la norma es 95 % | incorrecta | rag-16-malteo-calidad (el mínimo de la norma es 85 %; 95 % a 72 horas es una meta comercial de referencia) |
| 161 | Un índice de Kolbach entre 36 y 43 % es un requisito de la norma | incorrecta | rag-16-malteo-calidad (es una guía comercial de un laboratorio, no un criterio de la norma) |
| 162 | La cebada de seis hileras es de peor calidad maltera que la de dos hileras | imprecisa | rag-16-malteo-calidad (las guías coinciden en más proteína y enzimas en seis hileras, pero discrepan en la magnitud del extracto) |
| 163 | La lluvia después de la cosecha no afecta la malta | imprecisa | rag-16-malteo-calidad (omite la lluvia antes de la cosecha, que puede iniciar la germinación en la espiga; un número de caída menor a 300 s es inaceptable según la guía australiana) |
| 164 | El calor en el llenado siempre reduce el extracto | incorrecta | rag-16-malteo-calidad (en el estudio de CSIRO citado el extracto no cambió de forma significativa en un experimento y sí se redujo en otro complementario) |
| 165 | Un alto rendimiento garantiza un lote maltero aceptable | incorrecta | rag-16-malteo-calidad (rendimiento y proteína suelen variar en sentido opuesto) |
| 166 | El rendimiento de una parcela se mide directamente en campo | incorrecta | rag-17-medicion-rendimiento (es el cociente entre una producción medida o autorreportada y un área medida con error; Carletto et al., 2017; SIAP, 2022) |
| 167 | El autorreporte de productores es insesgado y basta como etiqueta | incorrecta | rag-17-medicion-rendimiento (Lobell et al. (2020) encuentran que explica menos de 1 % de la variabilidad de parcela completa; Gourlay et al. (2019) documentan sobreestimación en parcelas pequeñas) |
| 168 | Un valor de 3.5 t/ha en las etiquetas son 3.5 t/ha medidos | no verificable | rag-17-medicion-rendimiento (puede ser redondeo o amontonamiento; 45 de 138 etiquetas caen exactamente en la rejilla de 0.5) |
| 169 | Corregir solo el área o solo la producción siempre reduce el sesgo | incorrecta | rag-17-medicion-rendimiento (con errores correlacionados en área y producción, corregir una de las dos puede aumentarlo; Abay et al., 2019) |
| 170 | El rendimiento municipal del SIAP sirve como etiqueta de la parcela | incorrecta | rag-17-medicion-rendimiento (es producción total entre superficie cosechada total; en el proyecto su correlación con la etiqueta fue Spearman −0.30, n = 8) |
| 171 | El rendimiento a 12 % de humedad se obtiene sumando o restando un porcentaje fijo | incorrecta | rag-17-medicion-rendimiento (el ajuste es proporcional: Y × (100 − H medida) / (100 − H base)) |
| 172 | La norma mexicana de cebada fija la base de humedad en 12 % | incorrecta | rag-17-medicion-rendimiento (la base de 12 % es argentina, Norma V, Res. 27/2013; no se localizó una NMX mexicana: no documentado) |
| 173 | La temperatura base para el desarrollo de la cebada es 0 °C en todas las etapas | incorrecta | rag-18-fisiologia (la base cambia con la etapa y el cultivar; Slafer y Rawson, 1994) |
| 174 | Una helada solo daña la cebada cuando el aire llega a 0 °C | incorrecta | rag-18-fisiologia (el daño depende de la temperatura mínima de la planta, de la velocidad de enfriamiento, de la duración y de la etapa; Barrales-Domínguez et al., 2002) |
| 175 | El rendimiento de la cebada depende solo del número de espigas | incorrecta | rag-18-fisiologia (en ambientes cálidos domina el número de espigas y en fríos el peso del grano; García del Moral et al., 2003, en durum) |
| 176 | Las cebadas de dos y seis hileras tienen el mismo número de granos por tener la misma biomasa | incorrecta | rag-18-fisiologia (la ventana de determinación y los componentes difieren entre tipos de hilera; Arisnabarreta y Miralles, 2008; Serrago et al., 2023) |
| 177 | La mayor radiación en altitud aumenta siempre el rendimiento | incorrecta | rag-18-fisiologia (el efecto neto no está documentado para la cebada del Altiplano: es hipótesis) |
| 178 | Una caída temprana del NDVI indica siempre sequía | incorrecta | rag-18-fisiologia (también puede venir de senescencia por nitrógeno, de la cosecha o de píxeles mixtos) |
| 179 | La eficiencia de uso del agua es una constante de la cebada | incorrecta | rag-18-fisiologia (depende de la lluvia del ciclo, de su distribución y de la evaporación; Zhang et al., 2008) |
| 180 | La cebada de Hidalgo rinde 1.5 t/ha, por eso sus productores son menos eficientes que los de Tlaxcala | incorrecta | rag-19-socioeconomia (el cociente del censo mezcla temporal y riego, superficie sembrada y cosechada, y tipos de cebada; no mide la eficiencia de los productores) |
| 181 | Las 197 parcelas representan a 197 productores | incorrecta | rag-19-socioeconomia (el dataset no trae identificador de productor; varias parcelas pueden ser de un mismo productor) |
| 182 | El 50.8 % de la tierra de Tlaxcala es ejidal | no verificable | rag-19-socioeconomia (el 50.8 % es la cifra nacional de ejidos y comunidades de un resumen de búsqueda; el desglose estatal no se confirmó) |
| 183 | Apan tiene 46,681 habitantes y su cabecera está a 2,500–3,000 msnm | imprecisa | rag-19-socioeconomia (la población es de 2020, fuente secundaria; la altitud es del municipio en el compendio 2010, no de la cabecera) |
| 184 | El precio de la cebada es de 8,680 pesos por tonelada | incorrecta | rag-19-socioeconomia (es una cifra de prensa de 2024 sobre una negociación específica; no es un precio oficial ni vigente para 2026) |
| 185 | Hay muchos tractores, así que la mecanización no limita la siembra de cebada | no verificable | rag-19-socioeconomia (el censo no mide cuántos tractores se usan en cebada ni si son propios o rentados) |
| 186 | El crédito y el seguro están generalizados en el Altiplano | incorrecta | rag-19-socioeconomia (en 2022 solo 1.6 % (Hidalgo) y 1.9 % (Tlaxcala) de las unidades obtuvieron crédito, y 0.3 % y 0.4 % tienen seguro) |
| 187 | Hidalgo es el segundo estado con más erosión hídrica | incorrecta | rag-05-crecimiento-piso (ocupa el lugar 12 de 32 en el Cuadro 2 de Bolaños González et al., 2016, con 16.24 % de erosión apreciable) |
| 188 | La pérdida de 17 % por fusariosis en Valles Altos aplica a la cebada | incorrecta | rag-06-plagas-danos (el 17 % (Ireta y Gilchrist, 1994) es de trigo; no hay cifra local para cebada) |
| 189 | Hidalgo rinde 1.55 t/ha de cebada según el Censo Agropecuario 2022 | incorrecta | rag-19-socioeconomia (147,448 t entre 95,432 ha sembradas es producción entre superficie sembrada, no rendimiento por superficie cosechada; Tlaxcala da 2.54 con 111,564 t y 43,929 ha; ver rag-17-medicion-rendimiento) |
| 190 | El pico VH/VV de radar correlaciona con el rendimiento de cebada en Rothamsted (Vavlas et al., 2020) | incorrecta | rag-07-teledeteccion (el estudio es de trigo de invierno en Harpenden, 2017–2019; las r de −0.56 y 0.61 son de trigo) |
| 191 | Piette (2019) muestra que el NDVI informa de la cebada en los reportes del USDA | incorrecta | rag-11-literatura (es maíz: comunicación de conferencia NCCC-134 sobre futuros de 2000 a 2016) |
| 192 | El espigamiento del trigo y la cebada se predice con Sentinel-2 con RMSE de 7.7 días | incorrecta | rag-07-teledeteccion (Zhao et al. (2025): 7.66 días es el error para floración (R² = 0.7) y 8.67 días para hoja bandera; no es espigamiento) |
| 193 | FONAGA es uno de los cuatro fideicomisos de FIRA | incorrecta | rag-02-glosario (FONAGA es el Fondo Nacional de Garantías según el glosario de FIRA 2025; no es uno de los fideicomisos citados) |
| 194 | El nematodo quiste de la cebada en San Juan Ixtilmaco, Apan, es Cactodera galinsogae | incorrecta | rag-06-plagas-danos (es Cactodera rosae n. sp., descrita por Cid del Prado Vázquez y Miranda (2008) en raíces de cebada var. Esmeralda) |
| 195 | DIST-ALERT tiene 94.2 % de precisión y 93.9 % de recall | no verificable | rag-06-plagas-danos (el ATBD v1 solo especifica exactitud mayor a 80 % para alertas de al menos 50 % y mayor a 90 % para DIST-ANN; esas cifras no aparecen) |
| 196 | El NDVI diario predice la calidad del grano de cebada (Magney et al., 2016) | incorrecta | rag-04-amplitud (el estudio es de trigo de primavera en temporal, con 16 parcelas y dos temporadas) |
| 197 | Con Sentinel-1 o Sentinel-2 solos, el error en Valladolid 2018–2023 es de unos 1,100 kg/ha | no verificable | rag-07-teledeteccion (Franch et al. (2026) estudian trigo y cebada en ocho campañas de un sitio, sin cifras en kg/ha y sin Valladolid) |
| 198 | Una helada de −4 °C no daña la cebada una vez emergida la espiga | incorrecta | rag-04-amplitud (Frederiks et al. (2015) reportan daño con −4 a −5 °C de aire en el dosel tras la emergencia de la espiga; los floretes se dañan con frecuencia cerca de −6.5 °C de temperatura de la planta) |
| 199 | El piso de error por redondeo de las etiquetas del reto es 0.144 t/ha | incorrecta | rag-17-medicion-rendimiento (0.144 t/ha solo si todas las etiquetas estuvieran en la rejilla de 0.5; como solo 45 de 138 lo están, el piso es ≈ 0.082 t/ha; cálculo propio) |
| 200 | La mejor predicción del rendimiento que da el equipo local es contar el follaje y multiplicarlo por la densidad por m², y extrapolar a toda la parcela | correcta (hecho local del proyecto) | rag-17-medicion-rendimiento (conocimiento local del equipo, 18 de octubre de 2026; equivale al método de componentes del rendimiento) |
| 201 | kg/ha = espigas/m² × granos/espiga × peso de mil granos (g) | incorrecta | rag-17-medicion-rendimiento (falta dividir entre 100: 500 × 20 × 45 / 100 = 4 500 kg/ha) |
| 202 | El follaje por sí solo determina el rendimiento | incorrecta | rag-17-medicion-rendimiento (también cuentan granos por espiga, peso de grano e índice de cosecha; Gómez Mercado et al., 2009) |
| 203 | El NDVI satelital cuenta espigas | incorrecta | rag-17-medicion-rendimiento (estima verdor; en trigo satura por encima de 8 t/ha, Gracia-Romero et al., 2023) |
| 204 | Una plaga se puede propagar y ser imperceptible para el satélite | correcta (hecho local del proyecto) | rag-06-plagas-danos (conocimiento local del equipo, 18 de octubre de 2026; fase asintomática, daño de raíz, focos subpíxel, nubes entre pasadas) |
| 205 | Si el NDVI de la parcela no cambia, no hay plaga | incorrecta | rag-06-plagas-danos (la ausencia de anomalía no prueba ausencia; en Zarco-Tejada et al. (2018) el NDVI no separó árboles asintomáticos de sintomáticos) |
| 206 | La inspección visual detecta todas las infecciones | incorrecta | rag-06-plagas-danos (77.62 % de exactitud frente a qPCR en Zarco-Tejada et al., 2018; olivo, no cebada) |
| 207 | Un foco de plaga de 10 m siempre aparece en un píxel HLS de 30 m | incorrecta | rag-06-plagas-danos (unos 79 m² dentro de 900 m² quedan diluidos; inferencia por áreas, no medición en cebada) |

Fuente: 14_clima_y_riesgo_climatico_altiplano.md; 15_mercado_cadena_de_valor_y_politica.md; 16_malteo_y_calidad_industrial.md; 17_medicion_del_rendimiento_y_estadistica_agricola.md; 18_fisiologia_y_ecofisiologia_de_la_cebada.md; 19_contexto_socioeconomico_y_productores.md; 02_glosario_terminos_es.md;
04_amplitud_significados.md; 05_acelerar_crecimiento_a_costa_del_piso.md; 06_plagas_enfermedades_y_deteccion_de_danos.md; 07_teledeteccion_y_fenologia.md; 11_revision_de_literatura_y_transferencia.md; 13_variedades_dona_josefa_y_voyager.md; registros de verificación de la ronda 4 (sección «Ronda 4» de los documentos 01
a 11 y 13).

## Rúbrica: criterio 1, desempeño predictivo y justificación técnica (70 %)

Las bases oficiales asignan 70 % al desempeño predictivo y a la justificación técnica, medidos con RMSE, MAE, r² u otras métricas definidas por el Comité Organizador. Para evaluar una reseña en este criterio, verifica tres subcriterios. **Precisión de las cifras:** la métrica debe reportarse con unidad (t/ha), con su
protocolo y con su error estándar o intervalo; el RAG indica que con 138 parcelas el error estándar del RMSE ronda 0.03 t/ha, según una aproximación heurística del proyecto (rag-10-validacion). **Solidez metodológica:** el reseñador debe declarar la partición, evitar fugas (rag-10-validacion), comparar contra una línea
base (rag-08-experimentos-profundos) y no
confundir una partición única de entrenamiento y prueba con la validación cruzada sobre las 138 parcelas (rag-08). **Variables empleadas:** debe justificar sus índices, su sensor y su clima con la evidencia del RAG (rag-07-teledeteccion para el sensor, rag-01-reto-datos para CHIRPS y CHIRTS-ERA5, rag-04-amplitud para
la amplitud). Una reseña que sólo reporte un RMSE
sin protocolo recibe un veredicto "imprecisa" en este criterio.

Fuente: 01_reto_agrocebada_y_datos.md (criterios de evaluación de la primera etapa); BASES_oficiales_Reto_AgroCebada.txt (criterio 1, 70 %); 10_validacion_fugas_y_muestras_pequenas.md.

## Rúbrica: criterio 2 (interfaz, 30 %), etapa 2 y preguntas guía

El criterio de aplicación o interfaz web vale 30 % y evalúa la implementación práctica del modelo y su utilidad para consultar y visualizar resultados. El RAG no documenta requisitos técnicos de la interfaz: si una reseña afirma que la app cumple un requisito concreto, el veredicto es "no verificable" salvo que la
reseña muestre el enlace o el código. En la segunda etapa se evalúa el dominio de los temas, la justificación e interpretación de los valores, la relación con la inclusión financiera del sector agropecuario y la viabilidad de las propuestas; para ello sirve el documento rag-11-literatura, que distingue hechos
verificables de hipótesis (por ejemplo, que un pronóstico satelital mejore el crédito rural es hipótesis, no evidencia). Las preguntas guía de las bases (qué índice es más importante, qué variable climática pesa más, qué combinación funciona mejor) dan bonus; para responderlas usa rag-07-teledeteccion (índices),
rag-01-reto-datos (clima) y rag-09-experimentos-tabulares (combinaciones de variables, con resultados nulos incluidos).

Fuente: BASES_oficiales_Reto_AgroCebada.txt (criterio 2, etapa 2 y preguntas guía); 11_revision_de_literatura_y_transferencia.md; 09_experimentos_tabulares_espaciales_y_fenologicos.md.

## Plantilla de respuesta: corrección cortés

Úsala cuando una afirmación es incorrecta o imprecisa. Estructura: reconocer la intención, citar la afirmación, mostrar la evidencia con su cita, y dar la versión corregida. Ejemplo de plantilla: "Gracias por la reseña. La afirmación de que [afirmación] no coincide con la evidencia del proyecto. Según [rag-XX-nombre],
[dato correcto con cifra, unidad y alcance]. Por ello, la formulación más precisa sería [versión corregida]." Evita tono de juicio, no uses mayúsculas para enfatizar y no acuses de mala fe. Si el error es de protocolo, di cuál protocolo se usó y cuál se requiere. Cierra indicando el documento para profundizar. Si la
corrección afecta a una cifra del reto, incluye también el identificador rag-01-reto-datos para que el lector pueda comprobarla en el dataset oficial.

Fuente: FORMATO_RAG.md (distinción de hechos, resultados e hipótesis); 10_validacion_fugas_y_muestras_pequenas.md (protocolo y diferencias no distinguibles).

## Plantilla de respuesta: solicitud de aclaración y confirmación con evidencia

Para aclaración, usa cuando el término o la cifra es ambigua: "Antes de verificar, ¿a qué se refiere [término] en su reseña? En el corpus, 'amplitud' puede ser térmica mensual, amplitud fenológica del NDVI o ancho de intervalo; cada una se verifica distinto." Para confirmación con evidencia, usa cuando la afirmación es
correcta: "La afirmación es correcta. Según [rag-XX-nombre, sección], [cifra exacta con unidad y periodo].
validación cruzada. Cuando la reseña no indique la fuente de una cifra externa, pide la fuente y no la califiques de falsa: la respuesta correcta es "no verificable en el corpus; por favor indique la referencia".

Fuente: 04_amplitud_significados.md (desambiguación de amplitud); 01_reto_agrocebada_y_datos.md (cifras exactas y redondeo de 4.5 t/ha).

## Plantilla de respuesta: resumen ejecutivo de una reseña

Para resumir una reseña, usa cinco líneas: (1) tema y tipo de reseña (evaluador, jurado, agrónomo o productor); (2) número de afirmaciones y su distribución por veredicto; (3) las dos afirmaciones más graves, con su documento de referencia; (4) afirmaciones que requieren aclaración o no son verificables; (5)
recomendación de corrección prioritaria. Formato: "Reseña [id]: 14 afirmaciones (6 correctas, 3 incorrectas, 2 imprecisas, 2 no verificables, 1 opinión). Afirmación más grave: [texto], incorrecta según rag-06-plagas-danos. Corrección prioritaria: [texto]." No incluyas nombres de autores de la reseña si no están en la
fuente, ni datos personales. Si la reseña contiene menos de cinco afirmaciones verificables, reduce el resumen a tres líneas y di explícitamente que la muestra es insuficiente para una conclusión.

Fuente: FORMATO_RAG.md (no incluir nombres de personas, correos ni detalles irrelevantes); 06_plagas_enfermedades_y_deteccion_de_danos.md (ejemplo de afirmación grave).

## Plantilla de respuesta: reporte de análisis de datos sobre un conjunto de reseñas

Para reportar sobre muchas reseñas, presenta una tabla de conteos y una lectura breve. Ejemplo: "Se analizaron [N] reseñas con [M] afirmaciones verificables. Veredictos: correcta [a] (x %), incorrecta [b] (y %), imprecisa [c], no verificable [d], opinión [e]. Por categoría, la mayor proporción de incorrectas está en
método/validación ([p] %), seguida de teledetección ([q] %). Cifras de referencia: rag-10-validacion para métodos y rag-01-reto-datos para dataset." Indica siempre el denominador (qué afirmaciones se incluyeron), el tamaño de muestra por categoría y que los porcentajes con pocas afirmaciones no son concluyentes.
Incluye una tabla de conteos por categoría en el mismo orden de la taxonomía, y una sección final de limitaciones: qué categorías no cubre bien el RAG y cuántas afirmaciones quedaron como no verificables por falta de evidencia.

Fuente: 10_validacion_fugas_y_muestras_pequenas.md (intervalos con muestras pequeñas); 01_reto_agrocebada_y_datos.md.

## Guía de análisis: etiquetado y esquema de columnas

Para un conjunto de reseñas, crea una tabla con una fila por afirmación y las columnas: **id_resena** (identificador de la reseña, sin datos personales), **afirmacion** (texto citado), **categoria** (dato del reto, agronomía, teledetección, método/validación, resultado, recomendación u opinión), **veredicto**
(correcta, incorrecta, imprecisa, no verificable u opinión), **documento_rag** (id rag-XX), **cita** (apartado o frase de la evidencia) y **confianza** (alta si la cita es textual y la cifra coincide; media si la evidencia es indirecta; baja si la afirmación es ambigua o no hay evidencia). Etiqueta primero las
categorías y después los veredictos, y revisa una muestra de al menos 10 % por una segunda persona para medir acuerdo antes de agregar resultados.

Fuente: FORMATO_RAG.md (estructura de documentos y reglas de citación); 02_glosario_terminos_es.md (términos para la categorización).

## Guía de análisis: conteo, métricas y denominadores

Cuenta afirmaciones por veredicto y por categoría. Define el porcentaje de afirmaciones erróneas como incorrectas dividido entre las afirmaciones verificables (correctas más incorrectas más imprecisas), y reporta aparte las no verificables y las opiniones; no las mezcles en el denominador, porque "no documentado" no
equivale a falso. Reporta por categoría (por ejemplo, porcentaje de incorrectas en método/validación) y, si hay pocas afirmaciones en una categoría, escribe el n junto al porcentaje. Para comparar reseñadores o grupos, usa la misma taxonomía y los mismos documentos de referencia. Evita promedios de confianza sin
ponderar por el tamaño de cada reseña. Si se reporta una tendencia entre dos periodos o dos grupos, presenta los n de ambos y no afirmes diferencia cuando los intervalos se solapen; con muestras pequeñas, la descripción es mejor que la inferencia.

Fuente: 10_validacion_fugas_y_muestras_pequenas.md (intervalos y tamaños de muestra pequeños); 09_experimentos_tabulares_espaciales_y_fenologicos.md (regla de ruido en comparaciones).

## Guía de análisis: agregar por tema, municipio y criterio

Agrega por municipio sólo con el denominador del dataset a la vista: Chignahuapan concentra 100 de las 197 parcelas, mientras que otros municipios tienen decenas o menos, y el reto tiene un desbalance fuerte (rag-01-reto-datos). Una reseña que hable de "la zona" debe asignarse a "general" y no a un municipio. Agrega
por criterio de evaluación (desempeño, interfaz, presentación, preguntas guía) usando la rúbrica de este archivo. Para temas recurrentes, usa un codebook con términos del glosario (rag-02-glosario): por ejemplo, "NDVI", "amplitud", "piso", "temporal", "roya", "heladas", "RMSE", "fuga". Cuenta menciones por reseña, no
por palabra, para no inflar temas repetidos. Reporta los temas en orden de frecuencia y acompaña cada uno con dos ejemplos textuales de la reseña, de modo que el lector pueda comprobar que el tema se entendió bien.

Fuente: 01_reto_agrocebada_y_datos.md ("Municipios y distribución por partición"); 02_glosario_terminos_es.md.

## Guía de análisis: sentimiento, temas y límites del método

Medir sentimiento (positivo, negativo, neutro) no sirve para juzgar veracidad: una reseña puede ser entusiasta y tener afirmaciones incorrectas. Trata el sentimiento como una dimensión aparte, y limítalo a la categoría opinión. Un léxico general del español no reconoce la jerga del reto ("piso de arado", "amplitud",
"espigamiento", "temporal"), así que el sentimiento debe revisarse a mano en una muestra. Para temas recurrentes, prefiere el codebook manual sobre modelos de tópicos entrenados con pocas reseñas. Reporta siempre el método usado y sus límites; si la muestra es pequeña, dilo y no generalices. Por ejemplo, si la mayoría
de las reseñas tienen tono negativo pero sus afirmaciones son mayormente correctas, el reporte debe decir ambas cosas por separado, para no confundir crítica de estilo con error de contenido.

Fuente: FORMATO_RAG.md (jerga y reglas de contenido); 10_validacion_fugas_y_muestras_pequenas.md (muestras pequeñas y límites de inferencia).

## Mapa de documentos: reto, datos y glosario

Usa rag-01-reto-datos para preguntas sobre la estructura del reto, las 197 parcelas, las 138 de entrenamiento, las 59 de predicción, los municipios, los rasters (CHIRPS, CHIRTS-ERA5, AgERA5, Sentinel-2, Planet, HLS, topografía del CEM), las fechas del ciclo de abril a octubre de 2025, las bases, los criterios de
evaluación, las Reglas de Operación del DOF de diciembre de 2025 y las capas de AlphaEarth que descargó el proyecto. Usa rag-02-glosario para definiciones de términos, siglas (OOF, fold, RMSE, MAE, R², BBC-CV) y regionalismos («temporal», «piso», «amplitud», «espigamiento», «milpa»).

Palabras clave para grep en estos documentos (con y sin acentos): «197 parcelas», «ID_POLIGONO», «ID_POLIGON», «Dataset Básico» / «Dataset Basico», «CHIRTS», «CHIRPS», «ERA5», «AgERA5», «CEM», «EPSG:6372», «120 m», «DOF», «Reglas de Operación» / «Reglas de Operacion», «AlphaEarth», «GOOGLE_SATELLITE_EMBEDDING», «2017 a
2025», «1,032,892» / «1032892», «temporal», «espigamiento», «piso de desempeño», «regionalismos». Para el calendario busca «abril» y «octubre» junto a «2025»; para la fecha de corte de las series, «31 de octubre».

## Mapa de documentos: agronomía, plagas, amplitud, suelo y variedades

Usa rag-03-agronomia para siembra y densidades, fertilización, calendario del ciclo, rendimientos regionales, calidad maltera, heladas, granizo y acame. Incluye las agendas técnicas INIFAP de Hidalgo y Tlaxcala de 2017 (ventanas de siembra del cuadro 2 de Hidalgo, densidades, fertilización, la liberación de Esmeralda
en 1992) y la canola de la agenda de Hidalgo, cuyo rango de 1.5 a 3 t/ha no es de cebada. Usa rag-04-amplitud para cualquier pregunta sobre «amplitud» (térmica, NDVI, intervalos, ventanas), incluidas las normales 1991–2020 del SMN. Usa rag-05-crecimiento-piso para suelo, labranza, tepetate, compactación, rotación,
nitrógeno y «piso de arado». Usa rag-06-plagas-danos para plagas, enfermedades (roya amarilla, roya de la hoja, Rhynchosporium, fusariosis), pulgón ruso, daño, granizo y atípicos. Usa rag-13-variedades para Doña Josefa (ICAMEX según el estudio de 2021), Voyager, Adabella, Esmeralda en ensayos, número de hileras y la
columna genotype/variety.

Palabras clave para grep: «peso hectolítrico», «Adabella», «Esmeralda», «Esperanza», «Alina», «Armida», «Maravilla», «acame», «heladas», «pulgón ruso» / «pulgon ruso», «roya amarilla» / «roya lineal amarilla», «roya de la hoja», «G77», «Rhynchosporium», «escaldadura», «Windels», «amplitud térmica» / «amplitud termica»,
«amplitud fenológica» / «amplitud fenologica», «piso de arado», «tepetate», «Haulon», «hileras», «Doña Josefa» / «Dona Josefa», «ICAMEX», «Voyager», «AMBA», «Apizaco», «Relinas», «azoxistrobina», «tebuconazol», «Folicur», «Hidalgo 2017», «Tlaxcala 2017», «cuadro 2», «10 de junio», «NMX-FF-043», «canola», «Montecillo»,
«López Báez» / «Lopez Baez», «Ixtenco», «Comarca Lagunera», «Chiapas», «SMN», «normales», «nor9120», «Pachuca», «Tulancingo», «TIMESAT».

## Mapa de documentos: teledetección, experimentos, validación, literatura y seguros

Usa rag-07-teledeteccion para sensores (Sentinel-2, Sentinel-1, PlanetScope, HLS, Landsat), resolución de píxel, fenología (greenup, senescencia, espigamiento, floración), cobertura de espiga y la comparación entre sensores. Usa rag-08-experimentos-profundos para modelos de aprendizaje profundo y fundacionales
(MMST-ViT, AlphaEarth, Prithvi, DeepCropNet), modelos de proceso (WOFOST, DSSAT, APSIM, SCYM). Usa rag-09-experimentos-tabulares para Kumo, APAR, CANOPY_JOINT, pliegues, OOF, efectos municipales, kriging, tamaño de parcela y grados-día. Usa rag-10-validacion para fugas, validación cruzada, error estándar, muestras
pequeñas, redondeo, selección de modelos y validación espacial. Usa rag-11-literatura para revisión bibliográfica, transferencia, EarthShift, CIMMYT, FND, FIRA, seguros y hipótesis de impacto. Para comparaciones entre modelos, consulta siempre rag-10-validacion antes de citar una diferencia de RMSE de rag-08 o rag-09.

Palabras clave para grep: «PlanetScope» / «Planet», «Sentinel-2» / «Sentinel 2», «Sentinel-1» / «S1», «HLS», «HLSL30», «HLSS30», «DSWx», «píxel» / «pixel», «red-edge» / «red edge», «greenup», «senescencia», «espiga», «CDI», «Hassan», «Blum», «Presto», «EVI», «MTCI», «PSRI», «NDMI», «SAVI», «AlphaEarth»,
«GOOGLE_SATELLITE_EMBEDDING», «MMST», «Prithvi», «DeepCropNet», «WOFOST», «DSSAT», «APSIM», «SCYM», «CANOPY», «GRU», «PANGAEA», «GEO-Bench», «OOF», «fold» / «pliegue», «Kumo», «KumoRFM», «OpenMDW», «pinball», «APAR», «kriging», «Monteith», «Lowder», «McMaster», «WorldCover», «Desiere», «Nedungadi», «TabPFN»,
«validación cruzada» / «validacion cruzada», «fuga», «BBC-CV», «Tsamardinos», «Wang y Heitjan» / «heaping», «Ploton», «Wadoux», «Roberts», «Stein», «Nadeau», «Diebold», «Holm», «conformal», «error estándar» / «error estandar», «CIMMYT», «968», «Gardeazábal» / «Gardeazabal», «Ferguson», «EarthShift», «Franch», «Corley»,
«Iranzo», «Presto», «FND», «Fondo Nacional de Fomento», «liquidación» / «liquidacion», «AGROASEMEX», «seguro paramétrico» / «seguro parametrico», «FIRA», «Miranda», «Jain», «Lobell», «Gómez Mercado» / «Gomez Mercado», «AquaCrop», «Sharifi», «Acambay», «Fonteyne».

Para localizar una evidencia, busca sin distinguir mayúsculas y con y sin acentos, porque las citas y los nombres de archivo usan ambas formas. Ejemplos: `grep -il "fenologia\|fenología"` localiza fenología; `grep -il "piso de arado"` localiza el término de labranza; `grep -il "Doña Josefa\|Dona Josefa"` localiza la
variedad. Si una cifra no aparece en ningún documento, la afirmación es «no verificable» y no debe marcarse como incorrecta sin otra fuente. Antes de declarar que un término está ausente, repite la búsqueda con mayúsculas, con acentos y con guiones bajos, porque varios nombres aparecen como identificadores (por
ejemplo, CANOPY_JOINT o ID_POLIGONO).

Fuente: 01_reto_agrocebada_y_datos.md; 02_glosario_terminos_es.md; 03_agronomia_cebada_altiplano.md; 04_amplitud_significados.md; 05_acelerar_crecimiento_a_costa_del_piso.md; 06_plagas_enfermedades_y_deteccion_de_danos.md; 07_teledeteccion_y_fenologia.md; 08_experimentos_modelos_profundos_y_fundacionales.md;
09_experimentos_tabulares_espaciales_y_fenologicos.md; 10_validacion_fugas_y_muestras_pequenas.md; 11_revision_de_literatura_y_transferencia.md; 13_variedades_dona_josefa_y_voyager.md.

## Mapa de documentos: clima, mercado, malteo, medición, fisiología y socioeconomía

Usa rag-14-clima para lluvia de temporal, heladas, sequía (Monitor de Sequía del SMN, SPI y SPEI), canícula, CHIRPS y CHIRTS-ERA5 a escala mensual, grados-día y umbrales de helada. Usa rag-15-mercado para superficie y producción por estado (cierre SIAP 2022), costos de producción, precios de prensa, la cadena
cebada–malta–cerveza, la agricultura por contrato y la política (Producción para el Bienestar, cupos de importación). Usa rag-16-malteo-calidad para malteo, proteína, extracto, poder diastásico, friabilidad, la NMX-FF-043-SCFI-2003 y el rechazo de lotes. Usa rag-17-medicion-rendimiento para cómo se mide el rendimiento
(cosecha de muestra, autorreporte, humedad), el redondeo y amontonamiento de las etiquetas, y la estadística del SIAP e INEGI. Usa rag-18-fisiologia para escalas de desarrollo, temperatura base, componentes del rendimiento, eficiencia de uso del agua y daño por helada en la planta. Usa rag-19-socioeconomia para
productores, el Censo Agropecuario 2022, tenencia de la tierra, mecanización, crédito y seguro, y los Llanos de Apan.

Palabras clave para grep de cada documento (con y sin acentos): rag-14-clima: «heladas», «CHIRPS», «CHIRTS-ERA5», «Monitor de Sequía» / «Monitor de Sequia», «canícula» / «canicula», «grados-día» / «grados-dia». rag-15-mercado: «cebada maltera», «agricultura por contrato», «Grupo Modelo», «cupos de importación» / «cupos
de importacion», «Producción para el Bienestar» / «Produccion para el Bienestar», «Axapusco». rag-16-malteo-calidad: «NMX-FF-043», «Kolbach», «poder diastásico» / «poder diastasico», «friabilidad», «rechazo de lotes», «extracto». rag-17-medicion-rendimiento: «crop cut», «autorreporte», «heaping», «amontonamiento»,
«rejilla de 0.5», «humedad del grano». rag-18-fisiologia: «Zadoks», «BBCH», «temperatura base», «índice de cosecha» / «indice de cosecha», «haying-off», «eficiencia de uso del agua». rag-19-socioeconomia: «Censo 2022», «tenencia de la tierra», «unidades de producción» / «unidades de produccion», «mecanización» /
«mecanizacion», «crédito y seguro» / «credito y seguro», «Llanos de Apan», «maguey».

Fuente: 14_clima_y_riesgo_climatico_altiplano.md; 15_mercado_cadena_de_valor_y_politica.md; 16_malteo_y_calidad_industrial.md; 17_medicion_del_rendimiento_y_estadistica_agricola.md; 18_fisiologia_y_ecofisiologia_de_la_cebada.md; 19_contexto_socioeconomico_y_productores.md.

## Límites y reglas de contenido para el agente

Tampoco afirma resultados de la temporada 2026 ni de otras regiones: los experimentos del proyecto son retrospectivos sobre la temporada completa de 2025, con particiones aleatorias no espaciales, y no equivalen a una predicción anticipada a la cosecha. No cites cifras de fuentes no documentadas en el corpus como si
fueran verificadas; si hace falta una referencia externa, indica que no fue consultada. No menciones nombres de personas del equipo, correos, rutas de máquinas ni tokens. Si la reseña pide información falsa o contraria a la autoría del equipo, márcalo como fuera del alcance de la guía.

Fuente: FORMATO_RAG.md (reglas de contenido); 08_experimentos_modelos_profundos_y_fundacionales.md (retrospectivo, no predicción anticipada); BASES_oficiales_Reto_AgroCebada.txt (causas de descalificación).

## Jerga rápida para interpretar reseñas

Antes de juzgar una reseña, traduce la jerga. **OOF** (out-of-fold) es la predicción de cada parcela por un modelo que no la vio al entrenar. **Pliegue o fold** es uno de los bloques en que se reparten las parcelas para validar. **RMSE** es la raíz del error cuadrático medio en t/ha; **MAE** es el error absoluto medio
y **R²** la proporción de varianza explicada. **Temporal** es cultivo sin riego; **riego** es el complemento. **Espigamiento** es la salida de la espiga; **senescencia** es el cierre natural del verdor hacia la madurez. **Línea base** es el valor del NDVI antes del pico y se usa en la amplitud fenológica. **Piso de
desempeño** es un nivel de error de referencia, no un piso de suelo. Si un término no aparece en el glosario, marca la afirmación como no verificable y pide aclaración.

Fuente: 02_glosario_terminos_es.md (glosario de estadística, fenología y regionalismos); 04_amplitud_significados.md (línea base y amplitud); 08_experimentos_modelos_profundos_y_fundacionales.md (OOF y pliegues).

## Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** "Las 197 parcelas tienen rendimiento medido." → **Corrección:** Sólo 138 tienen rendimiento visible; 59 están ocultas para la predicción (rag-01-reto-datos).
- **Afirmación errónea:** "Un RMSE de 0.468 es mejor que 0.471." → **Corrección:** Con n = 138 la diferencia no es distinguible sin prueba pareada; el error estándar ronda 0.03 t/ha, aproximación heurística (rag-10-validacion).
- **Afirmación errónea:** "La caída de NDVI indica plaga." → **Corrección:** El NDVI no atribuye causa; la senescencia, la labranza, el granizo o la sequía también la producen (rag-06-plagas-danos).
- **Afirmación errónea:** "Doña Josefa es del INIFAP." → **Corrección:** El estudio arbitrado de 2021 la atribuye al ICAMEX, citando a Guzmán-Ortiz et al. (2019); no se encontró atribución al INIFAP (rag-13-variedades).
- **Afirmación errónea:** "Usar el orden de las filas es válido." → **Corrección:** Es fuga de información porque el orden se asocia con la etiqueta (rag-02-glosario).
- **Afirmación errónea:** "Un R² de 0.79 en Acambay valida la cebada." → **Corrección:** Ese R² es de maíz bajo sequía y no es validación externa (rag-02-glosario).

Fuente: los documentos rag-01 a rag-13 indicados en cada viñeta; ver la tabla de afirmaciones típicas de este archivo.

## Preguntas y respuestas

**P:** ¿Qué flujo debe seguir el agente para analizar una reseña?
**R:** Segmentar en afirmaciones atómicas, clasificar cada una (dato del reto, agronomía, teledetección, método/validación, resultado, recomendación u opinión), verificarla contra el documento temático de rag, asignar uno de cinco veredictos (correcta, incorrecta, imprecisa, no verificable u opinión) y redactar la
respuesta con cita al identificador rag-XX.

**P:** ¿Cuántas parcelas tiene el reto y cuántas tienen rendimiento visible?
**R:** 197 parcelas georreferenciadas; 138 de entrenamiento tienen rendimiento visible en t/ha y 59 de predicción lo tienen oculto (rag-01-reto-datos).

**P:** ¿Qué resolución tienen los rasters del reto?
**R:** 120 m (2,900 × 3,362 píxeles en EPSG:6372), no 15 m como indica la descripción oficial según la auditoría (rag-01-reto-datos).


**P:** ¿Una diferencia de 0.003 t/ha en RMSE demuestra que un modelo es mejor?
**R:** No. El error estándar del RMSE con 138 parcelas ronda 0.03 t/ha (aproximación heurística); la diferencia queda dentro del ruido de muestreo (rag-10-validacion).

**P:** ¿La caída del NDVI al final del ciclo prueba la presencia de plagas?
**R:** No. El NDVI no atribuye causa; la senescencia y otros factores también lo reducen, y los estudios citados no pudieron separar langosta de senescencia (rag-06-plagas-danos; rag-07-teledeteccion).

**P:** ¿Qué significa "amplitud" en una reseña?
**R:** Depende del contexto: amplitud térmica mensual (Tmax menos Tmin del mes), amplitud fenológica del NDVI (pico suavizado menos línea base), ancho de intervalo de predicción o amplitud de la ventana de siembra (rag-04-amplitud).

**P:** ¿Doña Josefa es una cebada de dos o de seis hileras?
**R:** De seis hileras; Voyager es de dos hileras (reparto confirmado localmente). El dataset no trae la variedad de cada parcela. El obtentor de Doña Josefa es el ICAMEX según el estudio de 2021; no se encontró atribución al INIFAP (rag-13-variedades).

**P:** ¿Las estadísticas municipales del SIAP sirven como etiqueta de cada parcela?
**R:** No. Su relación con las etiquetas de las parcelas es débil (Spearman −0.30, n = 8) y asignar una media municipal a muchas parcelas no da observaciones independientes (rag-01-reto-datos; rag-11-literatura).

**P:** ¿Se pueden usar las observaciones de noviembre y diciembre de 2025 para predecir antes de la cosecha?
**R:** No como predicción anticipada, porque están fuera del ciclo abril–octubre y serían fuga temporal; sólo sirven para análisis retrospectivo (rag-01-reto-datos; rag-11-literatura).

**P:** ¿Cómo se reporta un porcentaje de afirmaciones erróneas en un conjunto de reseñas?
**R:** Como incorrectas dividido entre las afirmaciones verificables (correctas, incorrectas e imprecisas), indicando aparte las no verificables y las opiniones, y el n por categoría (esta guía, sección de conteo y métricas).

**P:** ¿Qué criterio de evaluación pesa más en la primera etapa?
**R:** El desempeño predictivo y la justificación técnica, con 70 %, medidos con RMSE, MAE, r² u otras métricas del comité; la aplicación o interfaz web pesa 30 % (BASES_oficiales_Reto_AgroCebada.txt; rag-01-reto-datos).

**P:** ¿En qué año se liberó la variedad Esmeralda y qué fuente lo confirma?
**R:** En 1992, según la agenda técnica INIFAP de Hidalgo 2017 (pp. 33–34). La madurez de 95 a 115 días no aparece en esa agenda, y el dato de ensayo de 2018 es de 121.4 días (rag-03-agronomia; rag-13-variedades).

**P:** ¿Cómo se trata una cifra de roya amarilla de 2022 (5.4 a 6.7 %) que no aparece en el resumen del artículo?
**R:** Como no verificada: los resúmenes del artículo de 2022 no contienen esas cifras y el grupo G77 no está identificado. Se puede citar solo como no verificada, sin afirmar que sea falsa (rag-06-plagas-danos).

**P:** ¿Qué especificaciones fija la NMX-FF-043-SCFI-2003 para la cebada maltera?
**R:** Humedad de 11.5 a 13.5 %, 85 % de grano de tamaño maltero en criba de 2.18 × 19 mm, germinación de al menos 85 %, grano dañado de como máximo 10 % y peso hectolítrico de al menos 56 kg/hL (seis hileras) o 58 kg/hL (dos hileras). La norma no fija proteína (rag-16-malteo-calidad; texto oficial verificado).

**P:** ¿Hidalgo es el estado con más erosión hídrica?
**R:** No. En el Cuadro 2 de Bolaños González et al. (2016), Hidalgo ocupa el lugar 12 de 32 entidades, con 16.24 % de erosión apreciable (rag-05-crecimiento-piso).

**P:** ¿El 17 % de pérdida por fusariosis en Valles Altos se aplica a la cebada?
**R:** No. Ese 17 % (Ireta y Gilchrist, 1994) corresponde al trigo; no hay una cifra local de pérdida por fusariosis en cebada (rag-06-plagas-danos).

**P:** ¿El Censo Agropecuario 2022 da el rendimiento de la cebada de Hidalgo?
**R:** No. Las 147,448 t entre 95,432 ha sembradas dan 1.55 t/ha, que es un cociente de producción entre superficie sembrada y no un rendimiento por superficie cosechada (rag-19-socioeconomia; rag-17-medicion-rendimiento).

**P:** ¿Cuál es el piso de error por redondeo de las etiquetas en la rejilla de 0.5 t/ha?
**R:** Unos 0.082 t/ha, porque sólo 45 de 138 etiquetas caen en esa rejilla. El valor de 0.144 t/ha sólo aplicaría si todas las etiquetas estuvieran redondeadas a 0.5 (cálculo propio; rag-17-medicion-rendimiento).
