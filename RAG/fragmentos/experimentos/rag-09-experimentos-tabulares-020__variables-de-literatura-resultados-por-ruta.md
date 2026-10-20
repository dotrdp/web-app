@id: rag-09-experimentos-tabulares-020
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Variables de literatura: resultados por ruta
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error ruta variables conjunto literatura resultados victorias adelante anclado aparece asocian bajo bloques borde calpulalpan chignahuapan correlaciones dentro dosel eligio empato etiquetas fill floracion
@fuente: experimentos_tabulares/literature_vars_20261017__README.md
# Variables de literatura: resultados por ruta

En la ruta 1, ninguna variable individual bajó el RMSE de C2 (0.4793): la mejor, ndmi_grain_fill, empató con 0/10 victorias, y la selección hacia adelante no eligió nada. En la ruta 2, con XGBoost, el conjunto literal (sincronizado a la siembra, 9 variables) dio RMSE medio 0.4807 y 3/10 victorias, con probabilidad de
mejora por bloques de 0.34; el conjunto anclado al pico, 0.4835 (0/10; P 0.10); y las 19 variables, 0.4841 (0/10; P 0.11). Dentro de municipios, la señal aparece en Singuilucan (un dosel más verde en floración, y más índice de borde rojo y humedad SWIR en el llenado de grano, se asocian con mayor rendimiento), pero no
en Chignahuapan, donde hay 71 etiquetas y las correlaciones son ≤0.17. Calpulalpan tiene rendimientos redondeados a 2.5, 3.0 y 3.5 t/ha.

Fuente: experimentos_tabulares/literature_vars_20261017__README.md
