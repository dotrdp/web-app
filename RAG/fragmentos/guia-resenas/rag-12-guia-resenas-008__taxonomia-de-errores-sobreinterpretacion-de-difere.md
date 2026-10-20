@id: rag-12-guia-resenas-008
@documento: rag-12-guia-resenas | temas/12_guia_analista_de_resenas.md
@categoria: guia-resenas
@titulo: Taxonomía de errores: sobreinterpretación de diferencias pequeñas de RMSE
@titulo_documento: Guía operativa para analizar reseñas del Reto AgroCebada (verificación de afirmaciones, taxonomía de errores, rúbrica y análisis de datos)
@etiquetas: analisis de resenas; verificacion de afirmaciones; errores frecuentes; rubrica de evaluacion; plantillas de respuesta; analisis de datos; mapa de documentos; reto agrocebada; jerga agronomica; clima de temporal; mercado de la cebada; malteo y calidad; medicion del rendimiento; fisiologia de la cebada
@claves: analisis de resenas verificacion de afirmaciones errores frecuentes rubrica de evaluacion plantillas de respuesta analisis de datos mapa de documentos reto agrocebada jerga agronomica clima de temporal mercado de la cebada malteo y calidad medicion del rendimiento fisiologia de la cebada diferencia rmse estandar pequenas diferencias ejemplo error errores intervalos modelos parcelas sobreinterpretacion tampoco taxonomia validacion afirmar aproximacion aunque base cero comparar contra contraccion correcto cruzada
@fuente: 10_validacion_fugas_y_muestras_pequenas.md (error estándar y pruebas pareadas); 08_experimentos_modelos_profundos_y_fundacionales.md (intervalos pareados de validación cruzada).
# Taxonomía de errores: sobreinterpretación de diferencias pequeñas de RMSE

Con 138 parcelas, el error estándar del RMSE ronda 0.03 t/ha (aproximación heurística del proyecto, σ/√(2n); no es una fórmula estándar). Una diferencia de 0.003 t/ha (por ejemplo, de 0.471 a 0.468) no es distinguible sin prueba pareada con repeticiones; en remuestreos de 59 parcelas, la desviación de la diferencia
entre dos modelos fue de 0.0045 t/ha. Tampoco se debe afirmar que un modelo es "superior" cuando su intervalo pareado incluye cero, aunque su RMSE puntual sea menor. Una diferencia de 0.01 t/ha tampoco demuestra mejora por sí sola. Lo correcto es comparar contra una línea base fuerte (por ejemplo, la media o un
promedio
municipal con contracción), reportar intervalos y declarar cuando la diferencia es ruido.

Fuente: 10_validacion_fugas_y_muestras_pequenas.md (error estándar y pruebas pareadas); 08_experimentos_modelos_profundos_y_fundacionales.md (intervalos pareados de validación cruzada).
