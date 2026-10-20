@id: rag-10-validacion-013
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Controles de robustez: exclusiones que no deben decidir
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping casos mayor robustez suma controles error excluyendo ganancia area ayudan candidato contribuyente critique cuadratico deben decidir exclusiones iterate parcelas regla research retirar solo tres validacion
@fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_feasibility.md
# Controles de robustez: exclusiones que no deben decidir

(Nuestros experimentos) La regla de robustez de un candidato excluía los dos casos con mayor error cuadrático. Al revisar la ganancia por parcela de una pendiente de área, la suma del cambio en error cuadrático fue −0.425 con 31 parcelas mejoradas y 40 empeoradas. Excluyendo los dos casos de mayor error, la suma seguía
en −0.310 (ganancia), porque uno de los dos casos sí empeoraba. Excluyendo solo el mayor contribuyente, la suma pasó a +0.093 (pérdida). Excluyendo los tres mayores casos mejorados, la suma fue +0.933.

(Lección) La prueba de robustez debe emparejarse con el tipo de candidato. Una regla que favorece candidatos "de área" puede pasar aunque el efecto dependa de unos pocos casos. Una exclusión que elimine a los que más ayudan muestra la fragilidad.

(Recomendación) Usar como controles: retirar solo el mayor contribuyente, retirar los tres casos que más ayudan y exigir que la ganancia venga de al menos dos parcelas con fallas.

Fuente: validacion/iterate_20261017__research__critique_leakage.md; validacion/iterate_20261017__research__critique_feasibility.md
