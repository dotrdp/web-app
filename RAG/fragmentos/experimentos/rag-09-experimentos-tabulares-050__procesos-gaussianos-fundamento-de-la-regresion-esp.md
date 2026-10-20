@id: rag-09-experimentos-tabulares-050
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Procesos gaussianos: fundamento de la regresión espacial
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error regresion espacial fundamento gaussianos kernel procesos covarianza distancia efectos gaussian isbn learning machine press processes rasmussen williams agricola aplicacion captura capturan cercanas clasificacion comparten controla
@fuente: Rasmussen, C. E. y Williams, C. K. I. (2006), Gaussian Processes for Machine Learning, MIT Press. ISBN 0-262-18253-X
# Procesos gaussianos: fundamento de la regresión espacial

Rasmussen y Williams (2006, Gaussian Processes for Machine Learning, MIT Press, ISBN 0-262-18253-X) presentan los procesos gaussianos (GP) para regresión y clasificación supervisadas: una distribución sobre funciones definida por una función media y un kernel de covarianza, que produce predicciones con incertidumbre.
Un kernel exponencial, como el usado en la regresión espacial del proyecto, hace que la covarianza decaiga con la distancia, de modo que parcelas cercanas comparten información; la escala del kernel controla qué tan lejos llega esa dependencia. Si el GP incluye una tendencia lineal con mínimos cuadrados generalizados y
efectos de municipio, la distancia captura la vecindad y los efectos fijos capturan el nivel municipal. Este fragmento describe el fundamento del método. La aplicación de kriging o GP al rendimiento agrícola no se verificó con una fuente específica (SIN EVIDENCIA en esta revisión).

Fuente: Rasmussen, C. E. y Williams, C. K. I. (2006), Gaussian Processes for Machine Learning, MIT Press. ISBN 0-262-18253-X
