@id: rag-12-guia-resenas-020
@documento: rag-12-guia-resenas | temas/12_guia_analista_de_resenas.md
@categoria: guia-resenas
@titulo: Rúbrica: criterio 1, desempeño predictivo y justificación técnica (70 %)
@titulo_documento: Guía operativa para analizar reseñas del Reto AgroCebada (verificación de afirmaciones, taxonomía de errores, rúbrica y análisis de datos)
@etiquetas: analisis de resenas; verificacion de afirmaciones; errores frecuentes; rubrica de evaluacion; plantillas de respuesta; analisis de datos; mapa de documentos; reto agrocebada; jerga agronomica; clima de temporal; mercado de la cebada; malteo y calidad; medicion del rendimiento; fisiologia de la cebada
@claves: analisis de resenas verificacion de afirmaciones errores frecuentes rubrica de evaluacion plantillas de respuesta analisis de datos mapa de documentos reto agrocebada jerga agronomica clima de temporal mercado de la cebada malteo y calidad medicion del rendimiento fisiologia de la cebada criterio debe desempeno justificacion predictivo rmse tecnica agrocebada bases error estandar fugas oficiales parcelas particion protocolo rag-10-validacion resena reto rubrica sensor validacion amplitud aproximacion asignan
@fuente: 01_reto_agrocebada_y_datos.md (criterios de evaluación de la primera etapa); BASES_oficiales_Reto_AgroCebada.txt (criterio 1, 70 %); 10_validacion_fugas_y_muestras_pequenas.md.
# Rúbrica: criterio 1, desempeño predictivo y justificación técnica (70 %)

Las bases oficiales asignan 70 % al desempeño predictivo y a la justificación técnica, medidos con RMSE, MAE, r² u otras métricas definidas por el Comité Organizador. Para evaluar una reseña en este criterio, verifica tres subcriterios. **Precisión de las cifras:** la métrica debe reportarse con unidad (t/ha), con su
protocolo y con su error estándar o intervalo; el RAG indica que con 138 parcelas el error estándar del RMSE ronda 0.03 t/ha, según una aproximación heurística del proyecto (rag-10-validacion). **Solidez metodológica:** el reseñador debe declarar la partición, evitar fugas (rag-10-validacion), comparar contra una línea
base (rag-08-experimentos-profundos) y no
confundir una partición única de entrenamiento y prueba con la validación cruzada sobre las 138 parcelas (rag-08). **Variables empleadas:** debe justificar sus índices, su sensor y su clima con la evidencia del RAG (rag-07-teledeteccion para el sensor, rag-01-reto-datos para CHIRPS y CHIRTS-ERA5, rag-04-amplitud para
la amplitud). Una reseña que sólo reporte un RMSE
sin protocolo recibe un veredicto "imprecisa" en este criterio.

Fuente: 01_reto_agrocebada_y_datos.md (criterios de evaluación de la primera etapa); BASES_oficiales_Reto_AgroCebada.txt (criterio 1, 70 %); 10_validacion_fugas_y_muestras_pequenas.md.
