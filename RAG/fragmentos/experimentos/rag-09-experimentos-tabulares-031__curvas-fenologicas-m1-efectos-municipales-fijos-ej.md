@id: rag-09-experimentos-tabulares-031
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Curvas fenológicas (M1): efectos municipales fijos, eje temporal y selección
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error curvas ridge seleccion columnas efectos municipales municipio solo calendario control correlacion curva decir fenologicas fijos grados-dia maximo senal temporal alfa alineado anaden aprendiz area
@fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md
# Curvas fenológicas (M1): efectos municipales fijos, eje temporal y selección

Al tratar el municipio como efecto fijo sin penalizar (ridge_fe), las curvas no añaden nada: RMSE 0.5136 frente a 0.5126 de B0 (diferencia +0.001; IC [−0.017, +0.018]), con alfa entre 316 y 562 y coeficientes de curva de como máximo 0.024 t/ha por desviación. Entre las 46 familias de curva, sumadas al control sin
curvas (sólo estático y municipio, RMSE 0.5002), sólo 3 de 146 comparaciones con el mismo aprendiz bajaron el RMSE, y como máximo en 0.0022 t/ha. La mediana del cambio fue de +0.006 con ridge_fe y de +0.032 con LightGBM. La mejor configuración con curvas, F_BAK_re_ndre740, dio 0.5008, es decir +0.0006 respecto al
control. La señal intramunicipal de estos modelos (correlación de ganancia con residuo hasta 0.23) viene de elevación, pendiente y área, no de las curvas.

M1 probó tres ejes temporales: calendario, grados-día (GDD) y alineado al calendario de siembra. Con ridge, los RMSE fueron 0.5841, 0.5808 y 0.5790; con ridge_fe, 0.5136, 0.5159 y 0.5129. Las diferencias son ≤0.005, es decir, ruido: los grados-día sólo reescalan el tiempo sin reordenar parcelas. La selección interna de
4,098 columnas (depuradas por correlación mayor de 0.995) no mejoró el nivel de B0: TabPFN con 20 columnas dio 0.5119 y ridge con efectos municipales 0.5127. Una regresión lasso sobre todas las columnas dio 0.5954. Conclusión: la selección automática de curvas no encuentra señal que el municipio no tenga ya.

Fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md
