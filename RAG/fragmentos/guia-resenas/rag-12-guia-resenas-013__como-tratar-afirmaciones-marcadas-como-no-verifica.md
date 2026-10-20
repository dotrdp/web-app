@id: rag-12-guia-resenas-013
@documento: rag-12-guia-resenas | temas/12_guia_analista_de_resenas.md
@categoria: guia-resenas
@titulo: Cómo tratar afirmaciones marcadas como no verificadas en el RAG
@titulo_documento: Guía operativa para analizar reseñas del Reto AgroCebada (verificación de afirmaciones, taxonomía de errores, rúbrica y análisis de datos)
@etiquetas: analisis de resenas; verificacion de afirmaciones; errores frecuentes; rubrica de evaluacion; plantillas de respuesta; analisis de datos; mapa de documentos; reto agrocebada; jerga agronomica; clima de temporal; mercado de la cebada; malteo y calidad; medicion del rendimiento; fisiologia de la cebada
@claves: analisis de resenas verificacion de afirmaciones errores frecuentes rubrica de evaluacion plantillas de respuesta analisis de datos mapa de documentos reto agrocebada jerga agronomica clima de temporal mercado de la cebada malteo y calidad medicion del rendimiento fisiologia de la cebada dato proyecto prensa verificado cifra literatura local secundaria cita norma oficial verificada academica afirmacion afirmaciones cifras corpus dona estudio evidencia hecho josefa nivel perdida puede
@fuente: [01_reto_agrocebada_y_datos.md, 02_glosario_terminos_es.md, 03_agronomia_cebada_altiplano.md, 04_amplitud_significados.md, 05_acelerar_crecimiento_a_costa_del_piso.md, 06_plagas_enfermedades_y_deteccion_de_danos.md, 07_teledeteccion_y_fenologia.md, 08_experimentos_modelos_profundos_y_fundacionales.…
# Cómo tratar afirmaciones marcadas como no verificadas en el RAG

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
