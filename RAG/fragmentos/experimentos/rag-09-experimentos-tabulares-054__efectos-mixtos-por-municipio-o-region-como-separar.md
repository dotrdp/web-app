@id: rag-09-experimentos-tabulares-054
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Efectos mixtos por municipio o región: cómo separar el efecto de grupo
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error efectos mixtos municipio efecto region aleatorios bates bolker cebada chler grupo grupos lme4 modelos municipios recomendacion rendimiento separar varianza walker ajuste aleatorio anidadas aplique article
@fuente: Bates, D., Mächler, M., Bolker, B. y Walker, S. (2015), «Fitting Linear Mixed-Effects Models Using lme4», Journal of Statistical Software 67(1): 1–48, https://www.jstatsoft.org/article/view/v067i01.
# Efectos mixtos por municipio o región: cómo separar el efecto de grupo

Los modelos lineales de efectos mixtos combinan efectos fijos, como covariables climáticas o de terreno, con efectos aleatorios de grupos como municipio, región o estado. Los efectos aleatorios encogen las estimaciones de los grupos con pocas observaciones hacia la media general. Bates, Mächler, Bolker y Walker (2015)
describen su ajuste en R con el paquete lme4 y la función lmer, que por defecto estima por máxima verosimilitud restringida (REML). Para rendimiento de cebada con parcelas anidadas en municipios, la recomendación es reportar por separado la varianza entre municipios y la varianza dentro de cada municipio, y no
interpretar el efecto aleatorio como causal. Este fragmento es método y recomendación. En esta ronda no se localizó literatura regional mexicana que aplique modelos de efectos mixtos al rendimiento de cebada (SIN EVIDENCIA).

Fuente: Bates, D., Mächler, M., Bolker, B. y Walker, S. (2015), «Fitting Linear Mixed-Effects Models Using lme4», Journal of Statistical Software 67(1): 1–48, https://www.jstatsoft.org/article/view/v067i01.
