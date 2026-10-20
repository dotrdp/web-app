@id: rag-09-experimentos-tabulares-015
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Campaña conjunta en GPU: resultados, umbral y advertencias
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error campana conjunta mmst advertencias datos indica nacionales registros resultados solo umbral varianza actualizacion adafactor alcanzaron ambas antes aspiring bf16 cabeza cebada cerrada completas completo computo
@fuente: experimentos_tabulares/modelado__GPU_EXPERIMENTS.md
# Campaña conjunta en GPU: resultados, umbral y advertencias

La campaña conjunta entrenó Kumo y el MMST en un único modelo con 5,338,004,856 parámetros, preentrenado con 3,437 registros nacionales de cebada de temporal de 254 municipios y 18 estados entre 2003 y 2024. Sus dos configuraciones completas dieron R² de 0.648252 para la salida residual conjunta y 0.634960 para la
cabeza de regresión MMST, ambas en las mismas 138 parcelas. Ninguna superó la referencia histórica aspiring_sota (0.667431). Para llegar a R² de 0.85 con la varianza de la meta (0.7192248821494842) el RMSE debe ser de 0.3284565912 t/ha o menos, un nivel que nuestras pruebas no alcanzaron. Esta campaña usó sólo 3,437
registros nacionales; la propia fuente indica que el siguiente requisito es de al menos un millón de ejemplos de preentrenamiento.

Una prueba en la nube, ya cerrada, con cuatro GPUs ejecutó el grafo completo de precisión total; en el primer paso de actualización la pérdida subió de 2.18 a 962.30, lo que indica que la tasa de 1e-4 del MMST era inestable. Las ejecuciones locales usaron BF16 y el optimizador Adafactor con varianza factorizada, con un
pico de 24.58 GiB, pero solo como verificación de software y no como evaluación. La conclusión operativa es que el rendimiento de la campaña no justifica más cómputo sin datos nuevos: la fuente recomienda priorizar la preparación de datos antes de otro entrenamiento.

Fuente: experimentos_tabulares/modelado__GPU_EXPERIMENTS.md
