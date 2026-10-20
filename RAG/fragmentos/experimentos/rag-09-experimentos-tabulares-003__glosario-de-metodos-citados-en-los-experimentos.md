@id: rag-09-experimentos-tabulares-003
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Glosario de métodos citados en los experimentos
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error predice metodos nvidia perdida tabulares arboles citados cuantil cuantiles ficha funcion glosario kernel lineal pesos pinball promedia regresion segun tablas abiertos admite ajusto
@fuente: experimentos_tabulares/spatial_regression__README.md; experimentos_tabulares/modelado__KUMO_V2.md; experimentos_tabulares/iterate_20261017__research__A5_kumo.md
# Glosario de métodos citados en los experimentos

Ridge es una regresión lineal con penalización L2 que encoge los coeficientes hacia cero; es nuestra referencia lineal. Un proceso gaussiano (GP) predice con una función de covarianza o kernel; en la regresión espacial usamos un kernel exponencial, de modo que parcelas cercanas comparten información. GLS (mínimos
cuadrados generalizados) admite errores correlacionados en el espacio. XGBoost, LightGBM y CatBoost son métodos de árboles con refuerzo secuencial sobre tablas; ExtraTrees promedia árboles aleatorios; kNN predice con los vecinos más cercanos. PCA reduce columnas a componentes principales. TabPFN (Hollmann et al. 2023,
arXiv:2207.01848; Nature 2025) es un transformador
preentrenado con tablas sintéticas que predice sin entrenar pesos nuevos por conjunto de datos. Kumo-Tabular de NVIDIA es un modelo tabular de pesos abiertos (licencia OpenMDW 1.1, según su ficha en NVIDIA) que, en nuestros experimentos, se ajustó por completo; predice 999 cuantiles y, según la documentación del
proyecto, se entrena con pérdida pinball (no verificado: la ficha pública de NVIDIA, revisada en la ronda 3, no menciona pérdida pinball ni función de pérdida, solo salidas de 999 cuantiles), que promedia el error de cada cuantil. La "mediana"
de Kumo es el cuantil 500.

Fuente: experimentos_tabulares/spatial_regression__README.md; experimentos_tabulares/modelado__KUMO_V2.md; experimentos_tabulares/iterate_20261017__research__A5_kumo.md
