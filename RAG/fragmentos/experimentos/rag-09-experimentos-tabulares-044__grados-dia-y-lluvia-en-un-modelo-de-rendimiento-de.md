@id: rag-09-experimentos-tabulares-044
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Grados-día y lluvia en un modelo de rendimiento de maíz por condado (Estados Unidos)
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error estados grados-dia parametrica bagging condado maiz modelo rendimiento unidos aae159 cebada crane-droesch environmental letters research agriculture anida assessment autor bandas base bolsa change climate
@fuente: Crane-Droesch, A. (2018), «Machine learning methods for crop yield prediction and climate change impact assessment in agriculture», Environmental Research Letters 13, 114003. DOI 10.1088/1748-9326/aae159
# Grados-día y lluvia en un modelo de rendimiento de maíz por condado (Estados Unidos)

Crane-Droesch (2018, Environmental Research Letters 13: 114003, DOI 10.1088/1748-9326/aae159) estimó el rendimiento de maíz por condado en nueve estados del Medio Oeste de Estados Unidos entre 1979 y 2016. Usó grados-día (GDD) contados en bandas de 1 °C entre 0 y 40 °C, precipitación total con término lineal y
cuadrático, y tendencias temporales. Su red semiparamétrica (SNN) anida un modelo paramétrico dentro de una red neuronal. En la tabla de error fuera de bolsa (MSE, sin unidades indicadas), la SNN con bagging dio 251.5, frente a 334.4 de la regresión paramétrica con bagging y 638.6 de una red totalmente no paramétrica
con bagging. El autor señala que la parte paramétrica (tendencia y GDD) pesa más que la no paramétrica. Para la cebada, lo transferible es el uso de GDD como predictor térmico. En las fuentes consultadas no hay una base de grados-día validada para cebada de temporal en Hidalgo, Puebla o Tlaxcala (no verificado).

Fuente: Crane-Droesch, A. (2018), «Machine learning methods for crop yield prediction and climate change impact assessment in agriculture», Environmental Research Letters 13, 114003. DOI 10.1088/1748-9326/aae159
