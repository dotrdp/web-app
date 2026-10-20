@id: rag-10-validacion-038
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Distribución de etiquetas por municipio: hechos para validar
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping hechos municipio parcelas distribucion entrenamiento municipios calpulalpan chignahuapan cualquier dataset debe etiquetas oficial rango tienen total tres validar almoloya anecdota apan arista calculados cinco conclusion
@fuente: reto_y_datos/HECHOS_CALCULADOS_dataset_oficial.md
# Distribución de etiquetas por municipio: hechos para validar

(Hechos del dataset oficial, parcelas con rendimiento en entrenamiento) Almoloya 10 (media 4.52 t/ha, desviación 0.19); Apan 1 (3.00); Cuautepec de Hinojosa 5 (4.60, 0.15); Emiliano Zapata 3 (3.50, sin variación); Singuilucan 16 (3.08, 0.43); Tepeapulco 1 (4.45); Chignahuapan 71 (4.48, 0.58; rango 2.15 a 5.59);
Calpulalpan 30 (3.00, 0.37; rango 2.50 a 3.50); Nanacamilpa de Mariano Arista 1 (2.50). El total es 138 parcelas de entrenamiento y 59 de predicción; 197 en total.

(Implicación) Cinco de los nueve municipios tienen 5 parcelas o menos de entrenamiento, y tres tienen una sola. Cualquier resultado por municipio con n ≤ 5 es una anécdota y debe reportarse como tal.

Esta distribución condiciona las validaciones posibles: con particiones por municipio, los municipios de una o tres parcelas no pueden evaluarse de forma honesta, y el error de Chignahuapan y Calpulalpan domina las métricas globales. Por eso cualquier conclusión sobre municipios pequeños debe presentarse como
exploratoria.

Fuente: reto_y_datos/HECHOS_CALCULADOS_dataset_oficial.md
