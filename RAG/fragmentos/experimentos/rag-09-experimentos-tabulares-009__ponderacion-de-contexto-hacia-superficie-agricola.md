@id: rag-09-experimentos-tabulares-009
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Ponderación de contexto hacia superficie agrícola (CROPLAND_PRETRAINING)
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error cultivo majority soft cropland anual mmst perfil pretraining worldcover agricola atencion base clase contexto hacia linea mejoro modelo ningun obtuvo perfiles ponderacion procedimiento reemplazo superficie
@fuente: experimentos_tabulares/modelado__CROPLAND_PRETRAINING.md
# Ponderación de contexto hacia superficie agrícola (CROPLAND_PRETRAINING)

Este experimento reemplazó el soporte espacial de los municipios, que incluía bosque y asentamientos, por pesos de la cobertura ESA WorldCover 2021, clase 40 (cultivo anual; la versión 2021 v200 y el código 40 se verificaron en el manual del producto WorldCover v2.0 en la ronda 3, donde la clase 40 es «Cropland»,
cultivo anual sembrado y cosechado). Probamos dos perfiles: "soft", que multiplica el área de superposición por la fracción muestreada de cultivo, y "majority", que retiene sólo
celdas con al menos 50 % de cultivo. Ambos perfiles preentrenaron el modelo MMST durante 36 épocas sobre 1,791 registros temporales de primavera-verano, con tres semillas, y luego se ajustaron por pliegue. WorldCover es una máscara de cultivo anual; no es un mapa de cebada ni de temporal y, como es de 2021, aplicarla a
años anteriores es una restricción retrospectiva de dominio. Los datos de FIRA y las 27 variables de AgERA5 no cambiaron.

El MMST con perfil soft obtuvo MAE 0.379000, RMSE 0.556481 y R² 0.569437; el perfil majority, 0.351485 / 0.511730 / 0.635903. En la atención, el procedimiento primario soft_2 obtuvo 0.391157 / 0.516587 / 0.628959; soft_4, 0.391755 / 0.515297 / 0.630809; majority_2, 0.403958 / 0.521035 / 0.622542, y majority_4, 0.401606
/ 0.520196 / 0.623756. Ningún procedimiento mejoró la línea base fijada ni la meta de 30 %, y no se promovió ningún modelo de reemplazo. El perfil majority mejoró el MMST frente al soft, pero sus cifras de atención quedaron por encima de la línea base.

Fuente: experimentos_tabulares/modelado__CROPLAND_PRETRAINING.md
