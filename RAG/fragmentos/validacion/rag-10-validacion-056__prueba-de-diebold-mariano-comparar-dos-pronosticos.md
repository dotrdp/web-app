@id: rag-10-validacion-056
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Prueba de Diebold–Mariano: comparar dos pronósticos con la misma pérdida
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping prueba diebold mariano pronosticos comparar diferencias error media misma parcelas perdida perdidas accuracy acompanarla aplicarse aplico aproximadamente autocorrelacion autocorrelacionan bajo business caso casos cautela
@fuente: Diebold, F. X. y Mariano, R. S. (1995). Comparing predictive accuracy. Journal of Business & Economic Statistics. https://doi.org/10.1080/07350015.1995.10524599
# Prueba de Diebold–Mariano: comparar dos pronósticos con la misma pérdida

(Literatura y recomendación.) La prueba de Diebold y Mariano (1995) compara la precisión predictiva de dos pronósticos sobre los mismos casos. Se define la diferencia de pérdidas d_t = L(e1_t) − L(e2_t), por ejemplo con error cuadrático en cada modelo, y se contrasta si su media es cero. El estadístico divide la media
de d entre su error estándar, que se estima con una varianza de largo plazo (HAC) para permitir autocorrelación en las diferencias, y bajo la hipótesis nula es aproximadamente normal. La prueba fue pensada para pronósticos de series de tiempo, donde las pérdidas se autocorrelacionan. En nuestro caso las parcelas no
tienen orden temporal, pero las diferencias de parcelas vecinas o de un mismo municipio pueden estar correlacionadas, y la validación cruzada reutiliza datos entre pliegues. Por eso la prueba debe aplicarse con cautela: sirve como referencia cuando las predicciones vienen de un solo esquema de particiones, y conviene
acompañarla con el bootstrap pareado por parcela del fragmento siguiente. La prueba no se aplicó a nuestros experimentos.

Fuente: Diebold, F. X. y Mariano, R. S. (1995). Comparing predictive accuracy. Journal of Business & Economic Statistics. https://doi.org/10.1080/07350015.1995.10524599
