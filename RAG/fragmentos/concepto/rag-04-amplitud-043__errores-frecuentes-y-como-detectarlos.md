@id: rag-04-amplitud-043
@documento: rag-04-amplitud | temas/04_amplitud_significados.md
@categoria: concepto
@titulo: Errores frecuentes y cómo detectarlos
@titulo_documento: Significados de "amplitud" en el Reto AgroCebada (térmica, NDVI estacional, intervalos e ventanas)
@etiquetas: amplitud; amplitud térmica; tmax tmin; chirts-era5; ndvi; amplitud estacional; línea base; intervalo de predicción; ancho de intervalo; ventana de siembra; fenología; heladas; temperatura base; grados-día; predicción conformal
@claves: amplitud amplitud termica tmax tmin chirts-era5 ndvi amplitud estacional linea base intervalo de prediccion ancho de intervalo ventana de siembra fenologia heladas temperatura base grados-dia prediccion conformal afirmacion correccion erronea cebada altiplano etapa helada mensual datos floracion minimo normales pachuca parcela pico termica tiene tmin cerca cobertura cualquier dentro docs estacion
@fuente: [reto_y_datos/DESCRIPCION_oficial_dataset.txt, reto_y_datos/Descripcion_general_variables_DataSet.txt, reto_y_datos/dataset__DATASET_RETO_AGRO_2026__plot_features__README.md, reto_y_datos/plots__README.md, reto_y_datos/modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md,
# Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** "La amplitud térmica de la parcela en julio fue de 12 °C, medida cada día."
  → **Corrección:** Los rasters son medias mensuales de mínimos y máximos diarios, en celdas de unos 5 km. La amplitud mensual es Tmax_mes − Tmin_mes y no es una medición diaria de la parcela (reto_y_datos/modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md).

- **Afirmación errónea:** "La amplitud del NDVI es el máximo menos el mínimo del año."
  → **Corrección:** En el proyecto, amplitud = pico suavizado − línea base de la curva antes del pico (baseline_pregreenup), no el mínimo anual (teledeteccion_fenologia/dynamic_change__phenocurve__docs__F1_fits.md). Otros productos, como HR-VPP de Copernicus, sí usan máximo menos mínimo de la temporada, pero sobre PPI.

- **Afirmación errónea:** "Un intervalo de predicción estrecho demuestra que el rendimiento de 100 kg/ha es alcanzable."
  → **Corrección:** El documento de comparación dice lo contrario: un intervalo estrecho no prueba la meta, y la cobertura por región no está medida (literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt).

- **Afirmación errónea:** "La amplitud de la curva NDVI mejoró la predicción dentro de municipio."
  → **Corrección:** En nuestros experimentos, la combinación de pico y verdor al 50 % dio un resultado nulo; solo la línea base previa al verdor tuvo señal (experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md).

- **Afirmación errónea:** "Las 114 parcelas sin senescencia al 31 de octubre son la misma cifra que las 107 censuradas del análisis forense."
  → **Corrección:** No es la misma cifra. Son métricas distintas: 114 con Sentinel-2 y umbral del 50 % tras el pico, 107 censuradas con HLS. Se deben citar con su sensor y su definición (agronomia/literature_review__research_notes__Panicle_coverage_and_barley_yield__mexico_rainfed_malting_barley.md;
plagas_danos/iterate_20261017__research__A2_outlier_forensics.md).

- **Afirmación errónea:** "La helada mata la cebada a −7 °C en todo el Altiplano."
  → **Corrección:** No documentado para el Altiplano. El corpus no tiene función de daño por helada para cebada mexicana. Los umbrales de literatura de extensión (cerca de −2 °C en bota a floración; cerca de −5 °C en el punto de crecimiento durante la elongación) dependen de la etapa, la duración y el endurecimiento, y
no son un umbral único de muerte.

- **Afirmación errónea:** "La variación de las parcelas dentro del mes es la desviación estándar del raster."
  → **Corrección:** Esa desviación es espacial, entre píxeles de la parcela, no temporal dentro del mes (reto_y_datos/dataset__DATASET_RETO_AGRO_2026__plot_features__README.md).

- **Afirmación errónea:** "Las normales de Pachuca, Tulancingo o Huamantla dan la amplitud térmica oficial del Altiplano."
  → **Corrección:** Las normales oficiales del SMN (1991–2020) sí están disponibles por estación. Pachuca tiene una diferencia Tmax − Tmin mensual de 9.2 a 14.5 °C (media 12.1 °C). Tulancingo, de 11.0 a 16.3 °C. Huamantla, de 13.5 a 20.2 °C (estación suspendida). Estas cifras son de estación, no del Altiplano completo,
y no reemplazan a los rasters de la parcela (SMN, normales 1991–2020).

- **Afirmación errónea:** "La amplitud térmica afecta el rendimiento de la cebada del Altiplano, como lo demuestran los estudios de trigo en México."
  → **Corrección:** Los estudios de trigo (Lobell y colaboradores, 2005) muestran una asociación climática con la temperatura nocturna, no una prueba experimental. Además, en el Valle Yaqui la Tmin se confunde con la radiación. El efecto de la amplitud en cebada del Altiplano no está documentado.

- **Afirmación errónea:** "Un intervalo conformal de 90 % tiene siempre la cobertura prometida, también con datos de parcelas vecinas o series de un mismo año."
  → **Corrección:** La garantía es marginal y requiere intercambiabilidad. Con datos espaciales o temporales dependientes puede fallar, y no se ha probado con teledetección de rendimiento (Angelopoulos y Bates, 2021; Qureshi et al., 2026, solo resumen). Hay que reportar la cobertura medida por grupos.

- **Afirmación errónea:** "La helada es igual de dañina en cualquier etapa de la cebada, así que basta con la temperatura mínima mensual."
  → **Corrección:** La sensibilidad depende de la etapa: de bota a floración es la más alta, y en macollaje con el meristemo bajo el suelo la cebada tolera hasta cerca de −6 °C (NDSU Extension; informe Trigo2020, FCA-UNL). La fecha de la helada respecto a la fenología importa más que el mínimo mensual.

- **Afirmación errónea:** "La cebada se siembra en Hidalgo de mayo a inicios de julio, y la floración ocurre 46 a 72 días después."
  → **Corrección:** La agenda INIFAP Hidalgo (2017, cuadro 2) da del 1 de mayo al 15 de junio, del 15 de mayo al 20 de junio o del 1 al 30 de junio, según el ambiente de productividad. Las cifras de días a floración y madurez no aparecen en esa agenda (sin evidencia).

- **Afirmación errónea:** "Apan y Pachuca tienen la misma amplitud térmica porque están en el mismo Altiplano."
  → **Corrección:** No. En las normales del SMN 1991–2020, Apan tiene de 14.9 a 21.0 °C de Tmax − Tmin mensual (media 18.3 °C), y Pachuca de 9.2 a 14.5 °C (media 12.1 °C). La altitud y la posición topográfica cambian la amplitud.

- **Afirmación errónea:** "Una helada de −4 °C en el aire daña a la cebada igual en cualquier etapa y en cualquier genotipo."
  → **Corrección:** El daño depende de la etapa (la emergencia de la espiga es la etapa más sensible), de la temperatura real de la planta (que puede ser 1 a 3 °C más fría que el aire del dosel) y del genotipo (Frederiks et al., 2015; Frederiks et al., 2011). Los umbrales de otras regiones no son una función validada
para Hidalgo.

- **Afirmación errónea:** Magney et al., «Proximal NDVI derived phenology improves in-season predictions of wheat quality and yield» (año y revista sin identificar).
  → **Corrección:** El título correcto dice «wheat quantity and quality»; Agricultural and Forest Meteorology 217 (2016), 46–60, DOI 10.1016/j.agrformet.2015.11.009 (verificado en Crossref). Es un estudio de trigo de primavera de temporal, no de cebada.
