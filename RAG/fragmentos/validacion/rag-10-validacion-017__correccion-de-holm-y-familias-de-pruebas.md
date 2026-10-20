@id: rag-10-validacion-017
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Corrección de Holm y familias de pruebas
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping holm pruebas familia correccion julio caida critique encharcamiento error familias iterate misma ndvi profundidad prueba research validacion ajustado articulo auditoria bonferroni chignahuapan compara condicionamiento conjunto
@fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_expected_value.md; Holm (1979), https://doi.org/10.2307/4615733
# Corrección de Holm y familias de pruebas

(Literatura) Holm (1979) es un procedimiento secuencial que controla la tasa de error familiar (family-wise error rate): ordena los valores p y compara cada uno con α/(m − i + 1). Verificado en línea: artículo en Scandinavian Journal of Statistics, 6(2), 65-70, DOI 10.2307/4615733. Es más potente que la corrección de
Bonferroni.

(Nuestros experimentos) La auditoría contó tres pruebas de la familia de "fenómenos de encharcamiento": el encharcamiento de junio–julio (una prueba previa), la caída de NDVI en julio y la profundidad de depresiones. La caída de NDVI en julio fue la mejor de ocho pruebas declaradas, con p = 0.054 (n = 67 en
Chignahuapan). Tratada como hipótesis nueva, una profundidad de depresión con z = 1.25 parecía independiente, pero su condicionamiento sobre esa variable la hacía parte de la misma familia.

(Recomendación) Incluir cada prueba de la familia en el conjunto de Holm, y reportar el número de pruebas ajustado con la misma familia que se usó para elegir.

Fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_expected_value.md; Holm (1979), https://doi.org/10.2307/4615733
