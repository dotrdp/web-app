@id: rag-10-validacion-005
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Validación espacial por bloques y por municipio
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping validacion espacial municipios bloques municipio pequenos verificado aleatoria autocorrelacion biomasa colaboradores conglomerados entrenamiento k-fold mapa meyer parcelas pebesma pliegues ploton rango rmspe tiene wadoux aerea
@fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md; reto_y_datos/HECHOS_CALCULADOS_dataset_oficial.md; Ploton et al. (2020); Wadoux et al. (2021); Meyer y Pebesma (2022)
# Validación espacial por bloques y por municipio

(Literatura) Ploton y colaboradores (2020) mostraron que la validación no espacial sobreestima la capacidad predictiva de un mapa de biomasa basado en bosque aleatorio (verificado, DOI 10.1038/s41467-020-18321-y). Su propuesta de validación espacial (verificada en el texto, PMC7486894) tiene dos variantes: un K-fold
espacial en 44 conglomerados geográficos con un umbral de 150 km, algo mayor que el rango de autocorrelación de la biomasa aérea, y un leave-one-out con buffers de radio creciente (de 0 a 150 km). Con validación aleatoria de 10 pliegues, R² = 0.53 y RMSPE = 56.5 Mg/ha (19 %); con K-fold espacial de 44 pliegues, R² =
0.14 y RMSPE = 77.5 Mg/ha (26 %). Los autores concluyen que los conglomerados fueron demasiado pequeños para sacar todos los píxeles de prueba del rango de autocorrelación. Wadoux y colaboradores (2021) sostienen que la validación espacial no tiene un fundamento teórico claro para estimar la exactitud de un mapa, y
proponen muestreo probabilístico con inferencia basada en el diseño (verificado, DOI 10.1016/j.ecolmodel.2021.109692). La afirmación de que la validación espacial sería «más sesgada» que la estándar no aparece confirmada en la fuente consultada. Meyer y Pebesma (2022) resumen el debate sin zanjarlo (verificado, DOI
10.1038/s41467-022-29838-9).

(Nuestros experimentos, distribución de entrenamiento) Chignahuapan (Puebla) aporta 71 parcelas; Calpulalpan (Tlaxcala) 30; Singuilucan 16; Almoloya 10; Cuautepec de Hinojosa 5; Emiliano Zapata 3; y Apan, Tepeapulco y Nanacamilpa una cada una. Un bloqueo por municipio deja sin entrenamiento a los municipios de una sola
parcela, y las estimaciones de los municipios pequeños son ruidosas.

(Recomendación) Reportar dos particiones: aleatoria dentro de municipios (si el despliegue cae en municipios ya observados) y por municipio o bloque espacial (si se pregunta por municipios nuevos). Declarar cuál es la cifra principal antes de comparar. La partición por bloques debe justificar su tamaño, porque con 138
parcelas los bloques pequeños tienen muy pocas observaciones.

Fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md; reto_y_datos/HECHOS_CALCULADOS_dataset_oficial.md; Ploton et al. (2020); Wadoux et al. (2021); Meyer y Pebesma (2022)
