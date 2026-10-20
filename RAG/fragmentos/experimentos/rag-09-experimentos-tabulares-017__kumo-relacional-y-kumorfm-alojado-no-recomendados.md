@id: rag-09-experimentos-tabulares-017
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Kumo relacional y KumoRFM alojado: no recomendados
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error kumorfm alojado sola condiciones evidencia kumo-tabular kumorelational licencia nvidia recomendados relacional tablas terminos verificado abierto adquirio afirma alrededor antes aparece aplanado aplanarse basado busqueda
@fuente: experimentos_tabulares/iterate_20261017__research__A5_kumo.md
# Kumo relacional y KumoRFM alojado: no recomendados

Investigamos dos variantes relacionales: KumoRelational, un modelo abierto basado en KumoRFM-2 (no verificado en la web), y el KumoRFM alojado. Kumo-Tabular procesa una sola tabla, sin tablas relacionadas, y selecciona como máximo 500 columnas por estimador, así que las relaciones (observaciones por fecha, vecinos,
tablas municipales) tendrían
que aplanarse. Probando el aplanado con Kumo sola obtuvimos 0.4896 frente a 0.4899, con 6 de 10 victorias, pero no pasó la regla de validación, así que no miramos los pliegues de confirmación. KumoRelational necesita librerías de muestreo que no estaban instaladas; la ganancia esperada es de −0.005 a +0.002 y el costo
alrededor de un día. Sobre la licencia del NIM de KumoRFM, la búsqueda de la ronda 4 no encontró términos de licencia no comercial o de investigación (SIN EVIDENCIA; antes figuraba como «no verificado»). La página de Kumo ofrece KumoRFM en un nivel gratuito con API y SDK, sin describir sus condiciones de uso, y la
ficha de NVIDIA de Kumo-Tabular no menciona KumoRFM. Una nota de prensa, de una sola fuente y no verificada, afirma que NVIDIA adquirió Kumo AI; si fuera cierto, las condiciones podrían haber cambiado. La pérdida de entrenamiento de KumoRFM tampoco aparece documentada públicamente (SIN EVIDENCIA). Por eso no lo
recomendamos sin revisar los términos del servicio y las reglas del reto.

Fuente: experimentos_tabulares/iterate_20261017__research__A5_kumo.md
