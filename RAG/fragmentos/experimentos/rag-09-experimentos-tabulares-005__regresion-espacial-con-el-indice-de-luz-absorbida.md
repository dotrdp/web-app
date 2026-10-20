@id: rag-09-experimentos-tabulares-005
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Regresión espacial con el índice de luz absorbida APAR
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error apar indice absorbida bandas dosel espacial grano modelo seis splits clorofila correlacion fapar fraccion llenado octubre referencia regresion ventana acoplado activa acumulada agosto anaden
@fuente: experimentos_tabulares/spatial_regression__README.md
# Regresión espacial con el índice de luz absorbida APAR

Esta prueba partió de imágenes HLS de 2025 (seis bandas) y de un modelo de hoja con valores típicos de hojas de cebada, PROSPECT-D, acoplado a un modelo de dosel 4SAIL. Con una tabla de consulta de 30,000 dosel simulados, por cada fecha despejada obtuvimos el fAPAR (fracción de radiación fotosintéticamente activa
absorbida). El índice "apar_dj" es la media estacional del fAPAR entre el 15 de junio y el 27 de octubre de 2025, es decir, la fracción acumulada de luz absorbida. Su correlación de Spearman entre tablas con clorofila fija en 30 y en 60 fue de 0.997, de modo que depende poco de la clorofila desconocida de la variedad.
El modelo base era un GP espacial con tendencia GLS y efectos de municipio y estado; probamos añadir NDVI, el índice APAR y las seis bandas, en 20 splits. No documentado: el corpus no detalla cómo se calcula la Δ respecto a la referencia M0.

Los resultados de RMSE medio sobre 20 splits (t/ha) fueron: M1 con NDVI 0.5140 (Δ −0.0049; mejor que la referencia en 0 de 20 splits); M2 con índice APAR 0.5135 (Δ −0.0043; 0/20); M3 con NDVI y APAR 0.5172 (Δ −0.0080; 0/20); M4 con las seis bandas HLS 0.5279 (Δ −0.0187; 0/20); M5 con bandas y APAR 0.5295 (Δ −0.0203;
0/20); y M3 con ventana de llenado de grano del 15 de agosto al 27 de octubre 0.5154 (Δ −0.0062; 1/20). La correlación dentro de municipios (con al menos 12 etiquetas) fue de −0.11 para NDVI y −0.14 para APAR; en la ventana de llenado de grano fue de +0.05 y +0.03. La conclusión del proyecto es que el dosel que captó
más luz no produjo más grano en 2025, y que el GP ya capta el nivel municipal, donde está la señal del NDVI; las covariables sólo añaden varianza.

Fuente: experimentos_tabulares/spatial_regression__README.md
