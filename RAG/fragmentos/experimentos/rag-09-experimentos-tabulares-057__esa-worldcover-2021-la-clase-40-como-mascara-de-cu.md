@id: rag-09-experimentos-tabulares-057
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: ESA WorldCover 2021: la clase 40 como máscara de cultivo anual
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error clase worldcover anual cobertura cultivo mapa mascara cebada cultivos temporal v200 agrupa amazonaws anuales arboles arborea arbustiva arbustos caer ciclos clasifican combina construida correspondiente cosechables
@fuente: [experimentos_tabulares/spatial_regression__README.md, experimentos_tabulares/modelado__WITHIN_MUNICIPALITY.md, experimentos_tabulares/modelado__CANOPY_JOINT.md, experimentos_tabulares/modelado__CROSS_SENSOR.md, experimentos_tabulares/modelado__CROPLAND_PRETRAINING.md,
# ESA WorldCover 2021: la clase 40 como máscara de cultivo anual

ESA WorldCover 2021 (versión v200) es un mapa global de cobertura del suelo a 10 m. Su clase 40, «Cropland», agrupa la cobertura de cultivos anuales que se siembran o plantan y son cosechables al menos una vez en los 12 meses siguientes a la siembra; produce cubierta herbácea y a veces se combina con árboles o
arbustos. Los cultivos perennes leñosos se clasifican en la clase de cobertura arbórea o arbustiva correspondiente, y los invernaderos cuentan como zona construida. Por tanto, la clase 40 es una máscara de cultivo anual en general, no un mapa de cebada ni de temporal: un píxel de cebada de temporal puede caer en otra
clase si el año de referencia o el manejo difieren. Como el mapa es de 2021, no representa necesariamente los ciclos de 2022 a 2025 del reto. Fuente: ESA WorldCover 2021, Product User Manual v2.0, https://esa-worldcover.s3.eu-central-1.amazonaws.com/v200/2021/docs/WorldCover_PUM_V2.0.pdf (leído en la ronda 3).
