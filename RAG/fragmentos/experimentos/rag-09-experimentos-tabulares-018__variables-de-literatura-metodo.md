@id: rag-09-experimentos-tabulares-018
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Variables de literatura: método
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error variables base divisiones indices literatura literature metodo modelo probo vars adelante alrededor ancladas asocia baja bibliografia borde candidatas cebada cire correccion cruzada dejando
@fuente: experimentos_tabulares/literature_vars_20261017__README.md
# Variables de literatura: método

El experimento literature_vars probó las variables que la bibliografía asocia con el rendimiento de cebada: vigor y tamaño del dosel alrededor de la floración (NDVI y EVI a 80 días de la siembra, GCVI al encañado), índices de borde rojo para el llenado de grano (CIRE, NDRE740, MTCI) e índices de humedad SWIR (NDMI,
MSI). Usamos también versiones ancladas al pico de NDVI de cada parcela y siete variables de PlanetScope (LAI, NDVI y EVI). En total hubo 26 variables candidatas. Cada variable se probó sola y con selección hacia adelante: sólo entra si baja el RMSE medio de las divisiones en al menos 0.001. La corrección
intramunicipal usó una ridge sobre los residuos del modelo base, con penalización por validación cruzada dejando uno fuera. El modelo base era C2, con RMSE de 0.4793 en las 10 divisiones frescas.

Fuente: experimentos_tabulares/literature_vars_20261017__README.md
