@id: rag-12-guia-resenas-002
@documento: rag-12-guia-resenas | temas/12_guia_analista_de_resenas.md
@categoria: guia-resenas
@titulo: Flujo de trabajo: segmentar la reseña en afirmaciones
@titulo_documento: Guía operativa para analizar reseñas del Reto AgroCebada (verificación de afirmaciones, taxonomía de errores, rúbrica y análisis de datos)
@etiquetas: analisis de resenas; verificacion de afirmaciones; errores frecuentes; rubrica de evaluacion; plantillas de respuesta; analisis de datos; mapa de documentos; reto agrocebada; jerga agronomica; clima de temporal; mercado de la cebada; malteo y calidad; medicion del rendimiento; fisiologia de la cebada
@claves: analisis de resenas verificacion de afirmaciones errores frecuentes rubrica de evaluacion plantillas de respuesta analisis de datos mapa de documentos reto agrocebada jerga agronomica clima de temporal mercado de la cebada malteo y calidad medicion del rendimiento fisiologia de la cebada afirmaciones resena puede afirmacion ejemplo flujo frase segmentar solo trabajo agrocebada antes atomicas bien cebada cita comprobar concluir conserva contiene corrijas dashboard datos despues distinto
@fuente: FORMATO_RAG.md; 01_reto_agrocebada_y_datos.md (sección "Lo que no se puede concluir sobre la predicción").
# Flujo de trabajo: segmentar la reseña en afirmaciones

Antes de juzgar una reseña, separa su texto en afirmaciones atómicas. Una afirmación es una frase que se puede comprobar o refutar, por ejemplo "la cebada de temporal rinde 1.5 a 3 t/ha" o "el NDVI de Planet y Sentinel-2 es equivalente". Las frases que sólo expresan preferencia o juicio ("el dashboard se ve bien") se
marcan como opinión y no se verifican. Si una frase contiene dos hechos (por ejemplo, "138 parcelas con rendimiento y 59 ocultas, con RMSE de 0.30"), sepárala en dos afirmaciones, porque cada una puede tener un veredicto distinto. Conserva la cita textual de cada afirmación, con su número de línea o de párrafo si la
reseña lo permite, para poder señalarla después. No corrijas en este paso; sólo segmenta y numera.

Fuente: FORMATO_RAG.md; 01_reto_agrocebada_y_datos.md (sección "Lo que no se puede concluir sobre la predicción").
