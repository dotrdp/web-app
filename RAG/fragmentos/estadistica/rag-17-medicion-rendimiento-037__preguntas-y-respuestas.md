@id: rag-17-medicion-rendimiento-037
@documento: rag-17-medicion-rendimiento | temas/17_medicion_del_rendimiento_y_estadistica_agricola.md
@categoria: estadistica
@titulo: Preguntas y respuestas
@titulo_documento: Medición del rendimiento en campo y estadística agrícola: métodos, errores y límites para las etiquetas del reto
@etiquetas: rendimiento; cosecha de muestra; crop cut; autorreporte; humedad del grano; redondeo; heaping; siap; inegi; error de medición
@claves: rendimiento cosecha de muestra crop cut autorreporte humedad del grano redondeo heaping siap inegi error de medicion error parcela calculo cosecha metodo cebada completa cosechada espiga etiquetas granos produccion propio superficie cuanto espigas promedio puede segun base
@fuente: [01_reto_agrocebada_y_datos.md, 10_validacion_fugas_y_muestras_pequenas.md]
# Preguntas y respuestas

**P:** ¿Qué es el rendimiento según el SIAP?
**R:** La producción dividida entre la superficie cosechada, normalmente en toneladas por hectárea; la superficie cosechada puede medirse en campo, en laboratorio o por entrevista (SIAP, Normatividad Técnica, edición 2022).

**P:** ¿Por qué la cosecha de muestra no es igual a la cosecha completa?
**R:** Porque extrapola desde una subparcela. En Uganda, Lobell et al. (2020) encontraron que la cosecha de subparcela capturó alrededor de un cuarto de la variabilidad del rendimiento de parcela completa, aunque el promedio de la brecha no fue significativo.

**P:** ¿El autorreporte del productor sirve como etiqueta de rendimiento?
**R:** Con reservas. Lobell et al. (2020) reportan que explica menos de 1 % de la variabilidad del rendimiento de parcela completa, y Gourlay et al. (2019) documentan sobreestimación en parcelas pequeñas. No hay en el corpus una medición de su error para cebada en México.

**P:** ¿Qué tanto cambia el rendimiento al pasar de 14 % a 12 % de humedad?
**R:** Con la fórmula Y_base = Y × (100 − H_medida) / (100 − H_base), 3.00 t/ha a 14 % equivalen a 2.932 t/ha a 12 %, una diferencia de unos 0.07 t/ha (cálculo propio).

**P:** ¿Cuánto error introduce el redondeo a 0.5 t/ha?
**R:** Con varianza aproximada h²/12, la varianza es 0.0208 (t/ha)² y la desviación estándar 0.144 t/ha (cálculo propio). Ese valor sería el piso si todas las etiquetas estuvieran redondeadas a 0.5; como solo 45 de 138 lo están, el piso por redondeo es ≈ 0.082 t/ha (cálculo propio).

**P:** ¿Cuántas etiquetas del reto caen exactamente en múltiplos de 0.5 t/ha?
**R:** 45 de 138 (32.6 %): 19 en 3.0, 13 en 3.5, 11 en 2.5 y 2 en otros valores de la rejilla (cifras del corpus, calculadas sobre el archivo oficial de etiquetas).

**P:** ¿El rendimiento municipal del SIAP es el promedio de las parcelas?
**R:** No. Es la producción total entre superficie cosechada total. El promedio simple de rendimientos parcelarios puede diferir: en el ejemplo de cálculo propio, 3.0 t/ha frente a 2.5 t/ha ponderado.

**P:** ¿Qué documenta el INEGI en el Censo Agropecuario 2022?
**R:** Su periodo de referencia es octubre de 2021 a septiembre de 2022, y registra producción y superficie sembrada y cosechada de los cultivos a cielo abierto, además de la estructura de las unidades de producción (INEGI, boletines estatales).

**P:** ¿Qué método usa la ENA del INEGI para el rendimiento de cebada?
**R:** No documentado en esta ronda: la búsqueda no devolvió su metodología. Debe consultarse el documento técnico del INEGI antes de usar sus cifras como referencia.

**P:** ¿Qué pasa con el rendimiento de un siniestro peritado?
**R:** Puede ser una estimación muestral del daño según las características de la parcela, no una cosecha completa. En Agroseguro (España) para cereales de invierno, la valoración es por fases y por muestreo; el método de AGROASEMEX para cebada no se localizó.

**P:** ¿Cuál es el error mínimo alcanzable en el reto?
**R:** Como cota, la desviación estándar del error de etiqueta, que, si el único error fuera el redondeo, sería ≈ 0.082 t/ha (45 de 138 etiquetas en la rejilla de 0.5; 0.144 t/ha solo si todas estuvieran redondeadas). El error de método, de humedad o de autorreporte lo eleva y no se conoce, por lo que las mejoras
menores deben tratarse con cautela.

**P:** ¿Cómo se diagnostica un sesgo ligado al tamaño de la parcela?
**R:** Regresando los residuos del modelo sobre el área de la parcela. Una correlación significativa indica un artefacto de reporte, como en el patrón de Gourlay et al. (2019) y Desiere y Jolliffe (2018).


**P:** ¿Qué método se usa para estimar el rendimiento a partir de conteos en campo?
**R:** El método de componentes del rendimiento: espigas/m² × granos/espiga × peso de grano, convertido a kg/ha con kg/ha = espigas/m² × granos/espiga × PMG (g) / 100.

**P:** ¿Cuánto es 500 espigas/m² × 20 granos/espiga × 45 g de PMG?
**R:** 4 500 kg/ha (4,5 t/ha), por ejemplo hipotético de cálculo.

**P:** ¿Cuánto equivale 1 g/m² en kg/ha?
**R:** 10 kg/ha.

**P:** ¿El follaje basta para estimar el rendimiento?
**R:** No. El follaje es una variable intermedia; el rendimiento también depende de granos por espiga, peso de grano e índice de cosecha (Gómez Mercado et al., 2009; Gracia-Romero et al., 2023).

**P:** ¿Qué densidad de siembra indica la ficha INIFAP para cebada de temporal?
**R:** 100 kg/ha en surcos a doble hilera con pileteo y 130 kg/ha en corrugaciones o al voleo, según la ficha de Zacatecas (Medina et al., 2003). Para Valles Altos no está documentado.

**P:** ¿Cuántos cuadros de 1 m² hacen falta por parcela?
**R:** Depende del coeficiente de variación de la parcela. Con CV = 30 % y error de 10 %, la fórmula (t × CV / E)² da unos 36 cuadros; el CV de 30 % es un supuesto (no verificado en el proyecto).
