@id: rag-09-experimentos-tabulares-040
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Techo práctico de RMSE y conclusiones globales
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error techo practico tabulares conclusiones globales modelado parcelas senal apar buscar canopy centrado chignahuapan conjunta conjunto consolidando contexto cruzada cruzados cultivo curvas dano
@fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md; experimentos_tabulares/modelado__GPU_EXPERIMENTS.md; experimentos_tabulares/modelado__KUMO_RAINFED.md
# Techo práctico de RMSE y conclusiones globales

Consolidando los experimentos: el municipio explica 68.6 % de la varianza; el error está en Chignahuapan y en unas pocas parcelas con fallas; ninguna fuente de señal probada (APAR, centrado, CANOPY_JOINT, sensores cruzados, contexto cultivo, Kumo, GPU conjunta, variables de literatura, curvas fenológicas, embeddings)
superó la referencia de forma robusta. El techo práctico de RMSE en validación cruzada es de 0.465 a 0.470 t/ha, y el objetivo de R² 0.85 exigiría un RMSE de 0.3285 t/ha, muy por debajo de ese techo. La mayoría de las mejoras menores son ruido: en un conjunto fijo de 138 parcelas, con pocos splits, una diferencia de
0.002 a 0.005 no es distinguible. Las recomendaciones son: reportar intervalos y pruebas de selección, no reutilizar pliegues, y buscar señal de parcela (manejo, daño o reporte) fuera de la reflectancia.

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md; experimentos_tabulares/modelado__GPU_EXPERIMENTS.md; experimentos_tabulares/modelado__KUMO_RAINFED.md
