@id: rag-12-guia-resenas-007
@documento: rag-12-guia-resenas | temas/12_guia_analista_de_resenas.md
@categoria: guia-resenas
@titulo: Taxonomía de errores: protocolos de validación y fuga de información
@titulo_documento: Guía operativa para analizar reseñas del Reto AgroCebada (verificación de afirmaciones, taxonomía de errores, rúbrica y análisis de datos)
@etiquetas: analisis de resenas; verificacion de afirmaciones; errores frecuentes; rubrica de evaluacion; plantillas de respuesta; analisis de datos; mapa de documentos; reto agrocebada; jerga agronomica; clima de temporal; mercado de la cebada; malteo y calidad; medicion del rendimiento; fisiologia de la cebada
@claves: analisis de resenas verificacion de afirmaciones errores frecuentes rubrica de evaluacion plantillas de respuesta analisis de datos mapa de documentos reto agrocebada jerga agronomica clima de temporal mercado de la cebada malteo y calidad medicion del rendimiento fisiologia de la cebada validacion cruzada fuga informacion protocolos cifra datos errores fugas particion protocolo taxonomia usar agrocebada almacenamiento alrededor anidada antes apilamiento apilar asociado cierre cifras comparar cosecha
@fuente: 08_experimentos_modelos_profundos_y_fundacionales.md (protocolo de partición); 10_validacion_fugas_y_muestras_pequenas.md (fugas y apilamiento); 01_reto_agrocebada_y_datos.md (fechas posteriores al cierre de octubre).
# Taxonomía de errores: protocolos de validación y fuga de información

Dos protocolos no deben mezclarse. La validación cruzada repetida sobre las 138 produce cifras de RMSE
alrededor de 0.47–0.48 t/ha. Comparar una cifra de una partición única de entrenamiento y prueba con una cifra de validación cruzada sobre las 138 parcelas es un error de protocolo. Una fuga de información ocurre cuando el modelo ve datos que no tendría al predecir: usar el orden de almacenamiento de las filas
(asociado a la etiqueta), apilar predicciones de validación cruzada
sin evaluación anidada, elegir variables con las mismas etiquetas que luego se validan, o usar observaciones de noviembre y diciembre de 2025 en una predicción pensada para antes de la cosecha.

Fuente: 08_experimentos_modelos_profundos_y_fundacionales.md (protocolo de partición); 10_validacion_fugas_y_muestras_pequenas.md (fugas y apilamiento); 01_reto_agrocebada_y_datos.md (fechas posteriores al cierre de octubre).
