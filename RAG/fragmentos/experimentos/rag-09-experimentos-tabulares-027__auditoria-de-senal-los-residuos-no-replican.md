@id: rag-09-experimentos-tabulares-027
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Auditoría de señal: los residuos no replican
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error residuo correlacion mitad nulo replican variables acuerdo auditoria chignahuapan correlaciones fuera predicciones residuos senal signo todos aleatoria audit cambio cero debilmente demas direcciones elegir empeora
@fuente: experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md
# Auditoría de señal: los residuos no replican

A6 seleccionó variables según su correlación con el residuo en una mitad aleatoria de las parcelas y las midió en la otra. El acuerdo de signo fue de 0.41 en todos los municipios (nulo 0.51) y de 0.24 en Chignahuapan (nulo 0.46). Para K = 1, el residuo medio en la segunda mitad fue de −0.042 (todos) y −0.100
(Chignahuapan). En cambio, las correlaciones con el rendimiento sí replican débilmente: acuerdo de signo 0.63 frente a 0.51 nulo. La explicación es que, en predicciones fuera de pliegue, la etiqueta de cada parcela entra en las predicciones de las demás, empujando sus correlaciones residuales hacia cero y en
direcciones opuestas en cada mitad. Por tanto, seleccionar variables por correlación con el residuo empeora la predicción fuera de muestra. Recomendación: no usar la correlación con el residuo para elegir variables.

Fuente: experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md
