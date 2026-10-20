@id: rag-09-experimentos-tabulares-006
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Centrado dentro de municipio con 2,968 columnas
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error centro columnas municipio dentro seleccion candidatos centrado datos global interno municipales municipality pliegue tres variable within ajustar ajuste alcanzo ancla anos-municipio antes apoya archivos
@fuente: experimentos_tabulares/modelado__WITHIN_MUNICIPALITY.md
# Centrado dentro de municipio con 2,968 columnas

Este experimento (WITHIN_MUNICIPALITY) reunió 2,968 columnas de nueve archivos verificados: historia óptica original, fenología de Planet, datos ópticos por fase, geometría y terreno, clima y exposiciones de vegetación, espectros conjuntos y MRA entregado. Para cada variable calculamos un centro global y un centro por
municipio con contracción (shrinkage 0 o 5), y lo restamos antes de ajustar. Ese centro se estima solo con filas de entrenamiento; los municipios no vistos usan el centro global. Probamos 52 candidatos, con ridge, selección de columnas, PCA con kernel RBF y CatBoost, y una selección interna con tres subpliegues dentro
de cada pliegue canónico. El municipio no entra como variable numérica y los identificadores de parcela quedan excluidos. Se usaron 3,437 registros municipales de temporal primavera-verano, de 1,791 años-municipio, para preentrenar el contexto.

Con la selección primaria por RMSE interno, el mejor candidato obtuvo MAE 0.364310, RMSE 0.506110 t/ha y R² 0.643857. Seleccionar por MAE interno dio 0.358898 / 0.503160 / 0.647996, y promediar los tres mejores candidatos internos dio 0.357858 / 0.503259 / 0.647858. Ninguna variante mejoró la línea base fija ni alcanzó
la meta del 30 %, así que no se promovió. Un diagnóstico del ancla de atención mostró RMSE de ajuste entre 0.431 y 0.492 y RMSE fuera de muestra entre 0.394 y 0.590 según el pliegue; esto no apoya que una brecha grande de optimismo explique el fracaso de los modelos residuales. En estos datos, quitar niveles
municipales no reveló una señal intramunicipal que mejore la predicción.

Fuente: experimentos_tabulares/modelado__WITHIN_MUNICIPALITY.md
