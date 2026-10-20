@id: rag-09-experimentos-tabulares-034
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Curvas fenológicas (M2): parámetros de forma y varianza entre y dentro de municipios
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error municipios parametros curva forma solo variacion varianza aportan base correlacion curvas dentro fenologicas intramunicipal linea planet rendimiento senal tienen advertencia agrupar alrededor asociacion azar
@fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md
# Curvas fenológicas (M2): parámetros de forma y varianza entre y dentro de municipios

Los parámetros de forma de la curva (K, g, d0, d1 y a) no aportan señal intramunicipal. Con la línea base retirada, los bloques de K, meseta, g, d0, d1 y a dan within-R² entre −0.009 y +0.002: S2 NDVI −0.009 (p = 0.525), S2 fAPAR −0.008 (p = 0.542), Planet NDVI −0.005 y Planet LAI −0.003. Agrupar las 1,842 columnas de
curva da −0.001. Los tiempos de verdeo (d0 y greenup50) tienen la asociación univariada más consistente, con ρ entre +0.215 y +0.263, pero ninguna de las 5,096 pruebas univariadas sobrevive BH (q mínimo 0.185) y, como bloque lineal, aportan +0.010 (p = 0.043). Conclusión: la forma de la curva no ofrece ventaja, sólo la
línea base b.

El 68.6 % de la varianza del rendimiento es entre municipios. Los parámetros de curva tienen mediana de 13.7 % entre municipios, así que alrededor de 86 % de su variación es intramunicipal, y esa variación no es variación del rendimiento. La correlación entre municipios se calculó con sólo 6 municipios (con al menos 3
etiquetas), y sólo |r| mayor que 0.811 es significativa; de 5,096 parámetros de curva, 329 superan p < 0.05, casi lo esperado por azar (unas 255). Por eso esa correlación no sirve para rankear parámetros. Advertencia: las correlaciones entre municipios reflejan nivel, no intra-municipal, así que no deben usarse como
señal de predicción de parcela.

Fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md
