@id: rag-09-experimentos-tabulares-058
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Estimación en áreas pequeñas: qué es y qué aporta al rendimiento municipal
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error area estimacion estimation municipios parcelas rendimiento small areas municipal pequenas aleatorio aporta cebada crossref directas dominio dominios efecto estimaciones kubokawa lognormal mediante mixed-effects modelo models
@fuente: Sugasawa, S. y Kubokawa, T. (2023), «Basic Mixed-Effects Models for Small Area Estimation», en Mixed-Effects Models and Small Area Estimation, SpringerBriefs in Statistics, pp. 37–56, doi:10.1007/978-981-19-9486-9_4 (verificado en Crossref). Zimmermann, S. y Münnich, R. (2018), «Small Area Estimati…
# Estimación en áreas pequeñas: qué es y qué aporta al rendimiento municipal

La estimación en áreas pequeñas (small area estimation, SAE) produce estimaciones para dominios, como municipios, con pocas observaciones directas. Combina el dato de cada dominio con información de otros dominios mediante un modelo, y así reduce la varianza a costa de cierto sesgo. Sugasawa y Kubokawa (2023) presentan
los modelos básicos de efectos mixtos para SAE: un efecto aleatorio por dominio más un término de error individual, con predicción empírica del mejor predictor lineal insesgado. Para el rendimiento de cebada, la analogía es directa: un municipio con pocas parcelas medidas toma fuerza de los demás municipios de la
región mediante el efecto aleatorio, mientras que las estimaciones directas de municipios con muchas parcelas se conservan casi sin cambio. Zimmermann y Münnich (2018) extienden el modelo a respuestas con distribución lognormal y a muestreo informativo, un caso frecuente cuando las parcelas no se eligen al azar.
Hipótesis para el proyecto: en un conjunto de 197 parcelas con municipios desiguales, la SAE podría estabilizar la estimación municipal, pero requeriría validación cruzada por municipio y no está probada aquí. No se localizó literatura mexicana que aplique SAE al rendimiento de cebada (SIN EVIDENCIA).

Fuente: Sugasawa, S. y Kubokawa, T. (2023), «Basic Mixed-Effects Models for Small Area Estimation», en Mixed-Effects Models and Small Area Estimation, SpringerBriefs in Statistics, pp. 37–56, doi:10.1007/978-981-19-9486-9_4 (verificado en Crossref). Zimmermann, S. y Münnich, R. (2018), «Small Area Estimation with a
Lognormal Mixed Model under Informative Sampling», Journal of Official Statistics 34(2): 523–542, doi:10.2478/jos-2018-0024 (verificado en Crossref).
