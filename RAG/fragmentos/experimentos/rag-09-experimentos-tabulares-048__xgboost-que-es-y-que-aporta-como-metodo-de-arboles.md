@id: rag-09-experimentos-tabulares-048
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: XGBoost: qué es y qué aporta como método de árboles potenciados
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error arboles arxiv metodo potenciados xgboost aporta boosting chen guestrin proyecto resumen sistema afirma algoritmo anade anteriores aparecen aprender aprendizaje aproximados cache compresion consciente contribuciones corregir
@fuente: Chen y Guestrin (2016), KDD 2016, DOI 10.1145/2939672.2939785; arXiv:1603.02754. https://arxiv.org/abs/1603.02754
# XGBoost: qué es y qué aporta como método de árboles potenciados

Chen y Guestrin (2016, KDD, «XGBoost: A Scalable Tree Boosting System», DOI 10.1145/2939672.2939785; arXiv:1603.02754) describen un sistema de boosting de árboles de decisión que añade árboles de forma secuencial para corregir el error de los anteriores. Según el resumen, sus contribuciones principales son un algoritmo
consciente de la dispersión (sparsity-aware) para manejar valores faltantes, un esbozo de cuantiles ponderado para aprender árboles aproximados y optimizaciones de sistema para caché, compresión de datos y particionamiento; el resumen afirma que escala a más de mil millones de ejemplos. Para tablas pequeñas, como las
138 parcelas del proyecto, la escalabilidad no es lo relevante; lo que determina el sobreajuste son la profundidad, la tasa de aprendizaje y el submuestreo. Los árboles potenciados aparecen en nuestros experimentos como familia de referencia; este fragmento describe el método y no su desempeño en el proyecto.

Fuente: Chen y Guestrin (2016), KDD 2016, DOI 10.1145/2939672.2939785; arXiv:1603.02754. https://arxiv.org/abs/1603.02754
