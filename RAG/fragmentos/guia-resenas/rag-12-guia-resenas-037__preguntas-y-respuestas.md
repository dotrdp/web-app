@id: rag-12-guia-resenas-037
@documento: rag-12-guia-resenas | temas/12_guia_analista_de_resenas.md
@categoria: guia-resenas
@titulo: Preguntas y respuestas
@titulo_documento: Guía operativa para analizar reseñas del Reto AgroCebada (verificación de afirmaciones, taxonomía de errores, rúbrica y análisis de datos)
@etiquetas: analisis de resenas; verificacion de afirmaciones; errores frecuentes; rubrica de evaluacion; plantillas de respuesta; analisis de datos; mapa de documentos; reto agrocebada; jerga agronomica; clima de temporal; mercado de la cebada; malteo y calidad; medicion del rendimiento; fisiologia de la cebada
@claves: analisis de resenas verificacion de afirmaciones errores frecuentes rubrica de evaluacion plantillas de respuesta analisis de datos mapa de documentos reto agrocebada jerga agronomica clima de temporal mercado de la cebada malteo y calidad medicion del rendimiento fisiologia de la cebada cebada hileras parcelas rag-01-reto-datos amplitud etiquetas hidalgo rendimiento reto solo tienen afirmaciones ndvi prediccion rag-06-plagas-danos rmse segun seis agenda aparece articulo asignar ciclo cifra cuantas
@fuente: [01_reto_agrocebada_y_datos.md, 02_glosario_terminos_es.md, 03_agronomia_cebada_altiplano.md, 04_amplitud_significados.md, 05_acelerar_crecimiento_a_costa_del_piso.md, 06_plagas_enfermedades_y_deteccion_de_danos.md, 07_teledeteccion_y_fenologia.md, 08_experimentos_modelos_profundos_y_fundacionales.…
# Preguntas y respuestas

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
