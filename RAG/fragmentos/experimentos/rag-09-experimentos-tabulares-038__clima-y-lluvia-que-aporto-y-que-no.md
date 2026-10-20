@id: rag-09-experimentos-tabulares-038
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Clima y lluvia: qué aportó y qué no
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error clima agera5 aporto explica modelado municipal tabulares version algo antes beneficio campo climaticas control conviene curva deficit dias directo empeoro entradas estudio
@fuente: experimentos_tabulares/modelado__KUMO_V2.md; experimentos_tabulares/modelado__KUMO_RAINFED.md
# Clima y lluvia: qué aportó y qué no

Las entradas meteorológicas se probaron en varias formas: AgERA5 en Kumo (rachas secas, picos de lluvia de 5 y 10 días, déficit hídrico), la historia municipal de temporal, y el preentrenamiento sobre 27 variables. En Kumo versión 2, el control FIRA-only, sin clima municipal, dio 0.317586 de MAE frente a 0.317526 del
procedimiento líder, así que el clima no explica el beneficio. La versión medium, con clima directo, empeoró a 0.327020. El estudio de 1,036,225 registros tampoco incluye un predictor de riego, y el régimen se usa sólo para filtrar. Importante: AgERA5 es un reanálisis, no una observación de humedad de suelo en el
campo. Por eso, antes de invertir en nuevas fuentes climáticas, conviene separar en la validación si el clima explica algo que la curva fenológica o el municipio no expliquen ya.

Fuente: experimentos_tabulares/modelado__KUMO_V2.md; experimentos_tabulares/modelado__KUMO_RAINFED.md
