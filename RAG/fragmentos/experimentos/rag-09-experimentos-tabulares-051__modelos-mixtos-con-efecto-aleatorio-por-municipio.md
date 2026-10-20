@id: rag-09-experimentos-tabulares-051
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Modelos mixtos con efecto aleatorio por municipio: fundamento
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error efecto municipio parcelas aleatorio efectos grupos mixtos modelos bates bolker chler fundamento journal software statistical walker agrupan ajustar aleatorios almoloya article calpulalpan caso centrado chignahuapan
@fuente: Bates, Mächler, Bolker, Walker (2015), Journal of Statistical Software 67(1), 1-48. https://www.jstatsoft.org/article/view/v067i01
# Modelos mixtos con efecto aleatorio por municipio: fundamento

Bates, Mächler, Bolker y Walker (2015, «Fitting Linear Mixed-Effects Models Using lme4», Journal of Statistical Software 67(1): 1-48) describen cómo ajustar modelos lineales de efectos mixtos con la función lmer de R, que combina efectos fijos con efectos aleatorios por grupo. En nuestro caso, las 138 parcelas se
agrupan en al menos cinco municipios, con 71 parcelas en Chignahuapan, 30 en Calpulalpan, 16 en Singuilucan, 10 en Almoloya y 5 en Cuautepec. Un efecto aleatorio por municipio comparte información entre parcelas del mismo municipio y encoge hacia la media los grupos pequeños. Con grupos de 5 a 10 parcelas, la varianza
entre grupos se estima con poca precisión. Esto es una recomendación metodológica, no un resultado: en nuestros experimentos el efecto de municipio se usó como efecto fijo en la regresión espacial y en el centrado intramunicipal, no como modelo mixto formal.

Fuente: Bates, Mächler, Bolker, Walker (2015), Journal of Statistical Software 67(1), 1-48. https://www.jstatsoft.org/article/view/v067i01
