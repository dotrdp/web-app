---
id: rag-04-amplitud
titulo: Significados de "amplitud" en el Reto AgroCebada (térmica, NDVI estacional, intervalos e ventanas)
categoria: concepto
etiquetas: [amplitud, amplitud térmica, tmax tmin, chirts-era5, ndvi, amplitud estacional, línea base, intervalo de predicción, ancho de intervalo, ventana de siembra, fenología, heladas, temperatura base, grados-día, predicción conformal]
idioma: es
fecha: 2026-10-18
fuentes_internas: [reto_y_datos/DESCRIPCION_oficial_dataset.txt, reto_y_datos/Descripcion_general_variables_DataSet.txt, reto_y_datos/dataset__DATASET_RETO_AGRO_2026__plot_features__README.md, reto_y_datos/plots__README.md, reto_y_datos/modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md,
reto_y_datos/dataset__qgis__README.md, teledeteccion_fenologia/dynamic_change__phenocurve__docs__F1_fits.md, teledeteccion_fenologia/dynamic_change__phenocurve__docs__A1_series.md, teledeteccion_fenologia/literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md,
teledeteccion_fenologia/literature_review__reports__Panicle_coverage_and_barley_yield.md, agronomia/literature_review__research_notes__Panicle_coverage_and_barley_yield__mexico_rainfed_malting_barley.md, agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md,
agronomia/literature_review__report__sections__03_agronomia_literatura.typ.txt, plagas_danos/iterate_20261017__research__A2_outlier_forensics.md, experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md, experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md,
experimentos_tabulares/modelado__KUMO_V2.md, literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt, literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt, validacion/iterate_20261017__research__critique_expected_value.md,
validacion/iterate_20261017__research__B3_small_n_methods.md, validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md, validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md,
experimentos_profundos/benchmark_20260930__REPORT.md]
fuentes_externas:
  - "Jönsson, P. y Eklundh, L. (2004). TIMESAT: a program for analyzing time-series of satellite sensor data. Computers & Geosciences, 30(8), 833–845. https://doi.org/10.1016/j.cageo.2004.05.006 (referencia y DOI verificados; definición de amplitud confirmada en los manuales de TIMESAT 3.1 y 3.3)"
  - "Climate Hazards Center (2025). CHIRTS-ERA5 Data Repository. UC Santa Barbara. https://doi.org/10.15780/G2F08J; https://chc.ucsb.edu/data/chirts-era5 (título, resolución 0.05° y variables Tmax/Tmin diarias verificados)"
  - "Lobell, D. B., Sibley, A. y Ortiz-Monasterio, J. I. (2012). Extreme heat effects on wheat senescence in India. Nature Climate Change, 2, 186–189. https://doi.org/10.1038/nclimate1356 (resumen verificado)"
  - "Lobell, D. B., Ortiz-Monasterio, J. I., Asner, G. P., Matson, P. A., Naylor, R. L. y Falcon, W. P. (2005). Analysis of wheat yield and climatic trends in Mexico. Field Crops Research, 94, 250–256, DOI 10.1016/j.fcr.2005.01.007 (DOI y metadatos verificados en Crossref; resumen verificado en la ronda 2)"
  - "Bates, S., Hastie, T. y Tibshirani, R. (2024). Cross-validation: what does it estimate and how well does it do it? Journal of the American Statistical Association, 119(546), 1434–1445. https://arxiv.org/abs/2104.00673 (verificado en resumen)"
  - "Angelopoulos, A. N. y Bates, S. (2023). A gentle introduction to conformal prediction and distribution-free uncertainty quantification. Foundations and Trends in Machine Learning, 16(4). https://doi.org/10.1561/2200000101; arXiv:2107.07511 (resumen verificado)"
  - "Reyes-García, C., Vaquera-Huerta, H., Rendón-Sánchez, G. y Valdez-Lazalde, J. R. (2021). Estimación del riesgo de ocurrencia de heladas aplicando teoría de valores extremos. Tecnología y Ciencias del Agua, 12(6), 328–362. https://doi.org/10.24850/j-tyca-2021-06-08 (resumen verificado)"
  - "Savin, R., Stone, P. J. y Nicolas, M. E. (1996). Responses of grain growth and malting quality of barley to short periods of high temperature in field studies using portable chambers. Australian Journal of Agricultural Research, 47, 465–477. https://doi.org/10.1071/AR9960465 (resumen verificado)"
  - "Qureshi et al. (2026). AgroX-MoE-CP. Journal of Computers and Intelligent Systems. https://journals.iub.edu.pk/index.php/JCIS/article/view/4398 (solo resumen; datos tabulares, no satelitales)"
  - "Magney, T. S., Eitel, J. U. H., Huggins, D. R. y Vierling, L. A. (2016). Proximal NDVI derived phenology improves in-season predictions of wheat quantity and quality. Agricultural and Forest Meteorology, 217, 46–60. https://doi.org/10.1016/j.agrformet.2015.11.009 (verificado en Crossref; el título correcto dice
    «quantity», no «yield»)"
  - "Frontiers in Plant Science (2023). Modelos de rendimiento con NDVI de dron y rasgos agronómicos. https://doi.org/10.3389/fpls.2023.1063983 (título y autores no leídos; solo resumen de búsqueda)"
  - "Single, W. V. (1988), citado en tesis doctoral de la Universidad de Adelaida: https://thesis.library.adelaide.edu.au/dspace/bitstream/2440/62523/8/02chapters1-3.pdf (referencia primaria no leída; búsqueda en Crossref sin resultado)"
  - "NDSU Extension (Dakota del Norte). Small Grain Damage from Frost Dependent on Many Factors. https://www.ndsu.edu/agriculture/node/411"
  - "FCA-UNL. Informe final Trigo2020 (UECE). https://www.fca.unl.edu.ar/investigacion/wp-content/uploads/sites/16/2018/08/Informe_final-Trigo2020-UECE.pdf"
  - "CONAGUA/SMN (2026). Normales Climatológicas 1991–2020, archivos por estación (emisión 09/10/2026): https://smn.conagua.gob.mx/tools/RESOURCES/Normales_Climatologicas/Normales9120/hgo/nor9120_13022.txt (Pachuca), nor9120_13002 (Apan), nor9120_13041 (Tulancingo), nor9120_13027 (San Jerónimo Tepeapulco), y análogos
    en las carpetas pue y tlax; catálogo: https://smn.conagua.gob.mx/tools/RESOURCES/Normales_Climatologicas/catalogo/cat_hgo.html"
  - "Universidad Nacional Autónoma de México (2016). Variabilidad climática regional del Altiplano central de México (presentación de curso). https://ruoa.unam.mx/cursos/Curso_2016_CCA/source/C.%20Cliamtico%20o%20variabilidad%20climatica.pdf"
  - "INIFAP (2017). Agenda Técnica Hidalgo. https://vun.inifap.gob.mx/VUN_MEDIA/BibliotecaWeb/_media/_agendas/4131_4828_Agenda_T%C3%A9cnica_Hidalgo_2017.pdf (PDF leído con pdftotext en la ronda 3: cuadro 2 de fechas de siembra verificado; las cifras de días a floración y madurez no aparecen en la agenda)"
  - "INIFAP Campo Experimental Zacatecas. Folleto sobre problemas por heladas. http://zacatecas.inifap.gob.mx/publicaciones/probHeladas.pdf (PDF no legible en esta ronda: no verificado)"
  - "Universidad de Minnesota (MN2500). Barley growth stages and GDD base 40 °F. https://conservancy.umn.edu/bitstream/handle/11299/207440/MN2500_AGFO_2548.pdf"
  - "Eklundh, L. y Jönsson, P. (2011). TIMESAT 3.1 Software Manual. Lund University (definiciones de parámetros estacionales verificadas en el PDF): https://web.nateko.lu.se/timesat/docs/timesat3_1_1_SoftwareManual.pdf"
  - "TIMESAT 3.3 Software Manual (2017), Lund University (el umbral de inicio y fin de temporada lo define el usuario): https://web.nateko.lu.se/timesat/docs/TIMESAT33_SoftwareManual.pdf"
  - "Frederiks, T. M., Christopher, J. T., Sutherland, M. W. y Borrell, A. K. (2015). Post-head-emergence frost in wheat and barley: defining the problem, assessing the damage, and identifying resistance. Journal of Experimental Botany, 66(12), 3487–3498. https://doi.org/10.1093/jxb/erv088 (resumen extraído con
    WebFetch; cifras de daño verificadas en el texto de la revisión en la Ronda 4; Crossref para volumen y páginas)"
  - "Frederiks, T. M., Christopher, J. T., Fletcher, S. E. H. y Borrell, A. K. (2011). Post head-emergence frost resistance of barley genotypes in the northern grain region of Australia. Crop & Pasture Science, 62(9), 736–745. https://doi.org/10.1071/CP11079 (resumen extraído con WebFetch)"
  - "Passarella, V. S., Savin, R. y Slafer, G. A. (2005). Breeding effects on sensitivity of barley grain weight and quality to events of high temperature during grain filling. Euphytica, 141(1–2). https://doi.org/10.1007/s10681-005-5068-4 (referencia verificada en Crossref; resumen no leído)"
  - "Wallwork, M. A. B., Jenner, C. F., Logue, S. J. y Sedgley, M. (1998). Effect of high temperature during grain-filling on the structure of developing and malted barley grains. Annals of Botany, 82(5), 587–599. https://doi.org/10.1006/anbo.1998.0721 (resumen extraído con WebFetch)"
  - "Magney, T. S., Eitel, J. U. H., Huggins, D. R. y Vierling, L. A. (2016). Proximal NDVI derived phenology improves in-season predictions of wheat quantity and quality. Agricultural and Forest Meteorology, 217, 46–60. https://doi.org/10.1016/j.agrformet.2015.11.009 (verificado en Crossref, Ronda 4)"
  - "Ferrante, A., Cullis, B. R., Smith, A. B. y Able, J. A. (2021). A Multi-Environment Trial Analysis of Frost Susceptibility in Wheat and Barley Under Australian Frost-Prone Field Conditions. Frontiers in Plant Science, 12, 722637. https://doi.org/10.3389/fpls.2021.722637 (texto leído con WebFetch, Ronda 4)"
  - "Morales-Acoltzi, T. (2016). Variabilidad climática regional del Altiplano central de México (presentación de curso, UNAM), https://ruoa.unam.mx/cursos/Curso_2016_CCA/source/C.%20Cliamtico%20o%20variabilidad%20climatica.pdf (no arbitrada; resumen de buscador)"
  - "Ruíz Álvarez et al. (2016), «Tendencia de temperaturas máximas y mínimas mensuales en Aguascalientes, México», Ciencias Agrícolas (INIFAP), https://cienciasagricolas.inifap.gob.mx/index.php/agricolas/en/article/view/477 (resumen de buscador)"
  - "Santillán-Espinoza et al. (2011), tendencias de temperatura en Zacatecas con 24 estaciones (revista no identificada; resumen de buscador)"
  - "Terra Latinoamericana, artículo sobre agricultura de Tlaxcala y eventos climáticos extremos, https://www.terralatinoamericana.org.mx/index.php/terra/article/download/2351/2011/25305 (autores y año no verificados; resumen de buscador)"
  - "Investigaciones Geográficas (UNAM), granizadas en el Altiplano mexicano, 1981-2017, https://www.investigacionesgeograficas.unam.mx/index.php/rig/article/download/60741/54637/180743 (resumen de buscador)"
  - "La Jornada de Oriente, 14-ago-2002, nota sobre sequía en cebada de Calpulalpan y Nanacamilpa, https://www.jornada.com.mx/2002/08/14/oriente-y.htm (prensa)"
---

## Resumen

La palabra "amplitud" aparece en el proyecto con tres significados principales y uno secundario. En clima, "amplitud térmica" es la oscilación entre la temperatura máxima y la mínima; en el Reto se puede calcular mes a mes con los rasters CHIRTS-ERA5 de Tmax y Tmin. En teledetección, "amplitud" de la curva de NDVI es
la diferencia entre el pico y la línea base; el proyecto la usó para fijar fechas de verdor y de senescencia. En estadística, "amplitud" de un intervalo de predicción es su ancho. Los experimentos del proyecto no encontraron que la amplitud fenológica del NDVI mejore la predicción dentro de municipio, y no hay
resultados medidos de cobertura por región. Este archivo separa las acepciones, da cifras con su fuente y ofrece pistas para interpretar una reseña.

## Amplitud térmica: definición y cálculo con los rasters del reto

La amplitud térmica es la diferencia entre la temperatura máxima y la mínima. En la forma diaria es Tmax del día menos Tmin del mismo día. En el Reto, los rasters entregan un promedio mensual: cada archivo tiene la media mensual de las mínimas diarias y la media mensual de las máximas diarias, en °C. La descripción
oficial sugiere explícitamente calcular "amplitud térmica" a partir de estos insumos (sección 3 del documento oficial).

Hay 48 rasters de Tmin y 48 de Tmax, de enero de 2022 a diciembre de 2025, cada uno de 65 × 72 píxeles en EPSG:4326 con celdas de unos 0.05° (cerca de 5 km) y NoData −9999. Por tanto, la amplitud mensual de un píxel es Tmax_mes − Tmin_mes. Como ambas son medias, su diferencia es la media mensual de la oscilación diaria
(la linealidad de la media lo garantiza si se usan los mismos días).

Fuente: reto_y_datos/DESCRIPCION_oficial_dataset.txt; reto_y_datos/modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md

## Amplitud térmica mensual frente a otras formas de medirla

Con promedios mensuales hay tres cantidades distintas que no deben confundirse. (1) Amplitud térmica mensual, Tmax_mes − Tmin_mes, que es el promedio de las oscilaciones diarias del mes. (2) Oscilación extrema del mes, máxima Tmax del mes menos mínima Tmin del mes; los rasters no la contienen, porque los valores son
medias. (3) Amplitud estacional entre meses, por ejemplo la diferencia entre la Tmax de mayo y la Tmin de diciembre; no mide oscilación diaria, sino el cambio a lo largo del año.

Por eso, una reseña que diga "la amplitud térmica de julio fue de 15 °C" no se puede verificar directamente con los rasters, porque no son valores diarios. El documento de auditoría del proyecto lo dice así: Tmin y Tmax son "medias mensuales de mínimos y máximos diarios, no el día más frío o más caluroso del mes".

Fuente: reto_y_datos/modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md; reto_y_datos/DESCRIPCION_oficial_dataset.txt

## Cómo se extrae la amplitud térmica por parcela

Las 197 parcelas se cruzan con cada raster. El proyecto calculó, por parcela y mes, la media ponderada por área de los píxeles válidos, la desviación estándar poblacional, y los valores mínimo y máximo de los píxeles que intersectan la parcela. La cobertura válida de cada parcela queda en `row_quality.csv`. Las
columnas tienen el formato `raster__{variable}__{YYYY-MM}__{estadístico}`.

Ojo: la desviación estándar dentro de la parcela mide variación espacial entre píxeles, no variación de un día a otro dentro del mes. Una amplitud calculada a partir de la media de Tmax y la media de Tmin de la misma parcela y mes es válida; la dispersión espacial no debe interpretarse como oscilación temporal.

Fuente: reto_y_datos/dataset__DATASET_RETO_AGRO_2026__plot_features__README.md

## Estimación de temperatura media en el proyecto

El proyecto no tiene temperatura media medida en los rasters. Para la figura ambiental, se estimó cada mes como (Tmin_media + Tmax_media) / 2 y se promediaron los siete meses del ciclo abril–octubre de 2025. El documento lo identifica como estimación. Esta media es la de Tmin y Tmax, no una media de 24 horas medida,
así que no equivale a la temperatura media diaria de una estación.

Fuente: reto_y_datos/plots__README.md

## Resolución de los rasters térmicos y advertencias

CHIRTS-ERA5 es un producto derivado de reanálisis, citado por el Climate Hazards Center con DOI 10.15780/G2F08J. Su celda de unos 5 km es más gruesa que una parcela media de 5.46 ha en el Reto, y el proyecto advierte que recortar a los tres estados "no crea mediciones más finas". Por eso, la amplitud térmica de una
parcela es una aproximación regional, no una medición del campo. Para una reseña que mencione diferencias térmicas entre parcelas vecinas, la respuesta correcta es que la resolución no basta para distinguirlas.

Fuente: reto_y_datos/modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md; reto_y_datos/DESCRIPCION_oficial_dataset.txt; reto_y_datos/dataset__qgis__README.md

## Efecto fisiológico de la oscilación térmica en cebada (hipótesis)

La literatura general sugiere que una noche fría con días cálidos y despejados reduce la respiración nocturna del cultivo y favorece la acumulación de asimilados en el grano. El corpus no contiene un estudio que cuantifique este efecto para cebada en el Altiplano. La búsqueda de la ronda 2 tampoco encontró un estudio
de oscilación térmica diaria en cebada (sin evidencia). Esto es una hipótesis agronómica: el proyecto la
plantea como posible mecanismo, no como resultado.

Lo que sí documenta el corpus es el efecto de temperaturas altas. El estudio satelital en trigo del norte de la India (Lobell, Sibley y Ortiz-Monasterio, 2012) reporta, en su resumen, que el calor extremo por encima de 34 °C acelera el envejecimiento del cultivo y reduce el rendimiento, un efecto que los modelos de
cultivo subestiman (verificado). El corpus lo usa como antecedente de estrés térmico al final del ciclo,
no de oscilación térmica.

Fuente: teledeteccion_fenologia/literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md (hipótesis y cita de Lobell et al. 2012); agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md; https://doi.org/10.1038/nclimate1356 (resumen
verificado)

## Heladas en el Altiplano y amplitud térmica nocturna

La amplitud térmica importa sobre todo por las heladas: las noches despejadas y secas del Altiplano enfrían por radiación, y el día cálido no compensa una mínima bajo cero. El proyecto propone, como variable a calcular, la fecha de la primera helada otoñal respecto a la madurez del cultivo, a partir de la Tmin diaria y
una fecha de siembra estimada. Ese indicador necesita datos diarios, que los rasters mensuales no tienen.

El corpus advierte que no encontró una función publicada de daño por helada para cebada mexicana (temperatura por etapa fenológica). La búsqueda de la ronda 2 tampoco la encontró (sin evidencia), aunque sí halló umbrales generales por etapa en literatura de extensión y de otros países (ver los fragmentos sobre umbrales
de helada más abajo). Un folleto de INIFAP Zacatecas incluye una tabla de daño por heladas en cereales, pero el PDF no fue legible en esta ronda, así que no se usa aquí como cifra (sin evidencia).

Fuente: agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md (secciones de variables propuestas y de heladas); http://zacatecas.inifap.gob.mx/publicaciones/probHeladas.pdf (no legible)

## Valores típicos de amplitud térmica en el Altiplano central

Con las normales climatológicas oficiales del SMN-CONAGUA, periodo 1991–2020, la amplitud térmica mensual (Tmax normal menos Tmin normal, en °C) de estaciones del Altiplano cercanas al reto es la siguiente. Cada cifra es una diferencia de medias mensuales; cada mes tiene entre 25 y 30 años con datos.

- Pachuca (Obs), 2,425 msnm, Hidalgo: de 9.2 °C (septiembre) a 14.5 °C (marzo); media de los doce meses 12.1 °C.
- Tulancingo (Obs), 2,207 msnm, Hidalgo: de 11.0 °C (septiembre) a 16.3 °C (marzo); media 14.0 °C. La Tmax normal de mayo es 27.1 °C.
- Apan (DGE), 2,496 msnm, Hidalgo: de 14.9 °C (septiembre) a 21.0 °C (marzo); media 18.3 °C.
- San Jerónimo Tepeapulco, 2,535 msnm, Hidalgo: de 12.3 °C (septiembre) a 21.9 °C (febrero); media 17.6 °C.
- Singuilucan, 2,650 msnm, Hidalgo: de 11.6 °C (septiembre) a 18.0 °C (marzo); media 15.1 °C.
- San Marcos Huaquilpan (Calpulalpan), 2,601 msnm, Tlaxcala: de 14.5 °C (septiembre) a 20.9 °C (marzo); media 17.9 °C.
- Tlaxcala de Xicohténcatl (Obs), 2,281 msnm, Tlaxcala: de 13.0 °C (septiembre) a 19.6 °C (marzo); media 16.7 °C.
- Huamantla, 2,475 msnm, Tlaxcala (estación suspendida, pero su archivo 1991–2020 existe): de 13.5 °C (septiembre) a 20.2 °C (febrero y marzo); media 17.1 °C.
- Puebla (Obs), 2,179 msnm: de 11.5 °C (septiembre) a 17.4 °C (febrero); media 14.9 °C.
- Teziutlán, 1,964 msnm, Puebla: de 10.0 °C (septiembre) a 13.3 °C (abril); media 11.6 °C.

Para Pachuca, la cifra comercial de la ronda 2 (unos 10 a 14 °C mensuales, promedio cercano a 12 °C) era aproximadamente correcta, pero ahora la fuente es oficial. Las cifras de Tulancingo y Huamantla de los sitios comerciales no se usan. No se obtuvo el archivo 1991–2020 de Chignahuapan (21066), y en el catálogo
Zacatlán (21107) solo aparece con normales 1961–1990.

Estas normales son de estación, no de parcela ni de celda de 5 km. Los rasters CHIRTS-ERA5 del reto usan otro periodo, así que su diferencia Tmax − Tmin no debe compararse con ellas sin declarar los años.

Fuente: CONAGUA/SMN (2026). Normales Climatológicas 1991–2020, archivos nor9120_13022 (Pachuca), nor9120_13041 (Tulancingo), nor9120_13002 (Apan), nor9120_13027 (San Jerónimo Tepeapulco), nor9120_13033 (Singuilucan), nor9120_29025 (San Marcos Huaquilpan), nor9120_29031 (Tlaxcala Obs), nor9120_29011 (Huamantla),
nor9120_21065 (Puebla Obs) y nor9120_21091 (Teziutlán): https://smn.conagua.gob.mx/tools/RESOURCES/Normales_Climatologicas/Normales9120/hgo/nor9120_13022.txt (las carpetas pue y tlax tienen la misma estructura); catálogo: https://smn.conagua.gob.mx/tools/RESOURCES/Normales_Climatologicas/catalogo/cat_hgo.html

## Amplitud fenológica del NDVI: definición del proyecto

En el proyecto, la amplitud fenológica es la diferencia entre el pico y la línea base de la curva de NDVI suavizada: amplitude = peak − baseline. La línea base (baseline) es el mínimo de la curva suavizada entre el 1 de abril y el pico. La curva se suaviza con un Whittaker de segundas diferencias y λ = 100, en la
escala calendárica (días desde el 1 de abril de 2025). Es la métrica de nivel más usada para definir verdor y senescencia.

Cifras de Planet NDVI para las 197 parcelas, con el eje calendárico y el corte del 31 de octubre: línea base mediana 0.1945 (p10 0.1706, p90 0.234); amplitud mediana 0.545 (p10 0.4525, p90 0.6297); pico mediano 0.7438.

Fuente: teledeteccion_fenologia/dynamic_change__phenocurve__docs__F1_fits.md

## Fechas de verdor y umbral del 50 % de amplitud

El verdor (green-up) se define como la última vez que la curva cruza, hacia arriba, la línea base más el 50 % de la amplitud antes del pico. El proyecto usa la última cruce, no la primera, para que un colapso a mitad de temporada y un rebrote den la fecha del dosel final. La primera cruce y el número de cruces se
guardan aparte.

Otra versión usa Sentinel-2 con mediana móvil de 3 puntos sobre observaciones claras: el verdor es la primera fecha en que la curva alcanza el 50 % de la amplitud sobre la línea base de mayo. Resultado: mediana 14 de julio (p10 4 de julio, p90 13 de agosto; rango 9 de junio a 2 de septiembre).

Fuente: teledeteccion_fenologia/dynamic_change__phenocurve__docs__F1_fits.md; agronomia/literature_review__research_notes__Panicle_coverage_and_barley_yield__mexico_rainfed_malting_barley.md

## Senescencia y censura por el corte del 31 de octubre

La senescencia usa el 50 % de la amplitud después del pico. Según el documento de fits, la pérdida se mide como frac_amp_lost = pérdida / amplitud, y decline_observed = frac_amp_lost ≥ 0.5. Una parcela censurada (decline_censored) es aquella que, hasta la última observación del modo, no ha perdido la mitad de su
amplitud.

En Planet NDVI, 5.1 % de las parcelas no alcanzan el hombro (90 % de la amplitud) antes del 31 de octubre, y 65.5 % han perdido menos de la mitad de su amplitud. En modo retrospectivo, hasta el 31 de diciembre, esa censura baja a 0.5 %. Esto es un hecho del proyecto: la mayoría de las parcelas, al corte de octubre, aún
no han completado la caída.

Fuente: teledeteccion_fenologia/dynamic_change__phenocurve__docs__F1_fits.md

## Cifras de senescencia por otra fuente (Sentinel-2 y HLS)

Con otro método, la amplitud sobre línea base de mayo tiene mediana 0.50 (p10 0.39), y la fecha en que el NDVI baja del 50 % de la amplitud después del pico tiene mediana 1 de noviembre (p10 7 de octubre, p90 16 de noviembre). 114 de 197 parcelas no la alcanzan antes del 31 de octubre. El documento advierte que el
rastrojo, las malezas y los rebrotes probablemente mantienen el NDVI sobre el umbral, así que esta métrica tiende a retrasar la madurez real.

Otra revisión forense, con HLS, reporta que la senescencia se alcanza antes del 28 de octubre solo en 90 parcelas y que 107 quedan censuradas. La diferencia entre 90 y 114 no es un error: son sensores y definiciones distintas. Antes de citar una de las cifras, el agente debe indicar cuál sensor y qué ventana usó.

Fuente: agronomia/literature_review__research_notes__Panicle_coverage_and_barley_yield__mexico_rainfed_malting_barley.md; plagas_danos/iterate_20261017__research__A2_outlier_forensics.md

## Límites de la amplitud NDVI: píxeles mixtos y doble pico

Las parcelas pequeñas se ven afectadas por píxeles mixtos. La parcela más pequeña (0.35 ha) tiene unos 4 píxeles de 30 m y la mediana (5.46 ha) unos 61. Los píxeles con caminos, bordes o cultivos vecinos distorsionan la fecha y la amplitud de la caída. Además, 17 parcelas presentan doble pico (un dosel verde a inicios
de julio, desnudo a finales de julio y un segundo cultivo o rebrote en septiembre–octubre). Ese patrón no es una amplitud de cebada de temporal y debe tratarse como anomalía.

Fuente: teledeteccion_fenologia/literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; plagas_danos/iterate_20261017__research__A2_outlier_forensics.md

## Amplitud NDVI como predictor en nuestros experimentos

Nuestros experimentos probaron la amplitud y otras métricas de la curva en un marco de validación dentro de municipio. El resultado fue nulo para la mayoría. Un modelo de dos variables, pico de Planet NDVI más verdor al 50 %, dio un resultado nulo frente a la línea base de municipio (0.5190 con municipio frente a
0.5151 con estáticas y municipio, con un control B0 de +0.003 y un intervalo [-0.024, +0.031]).

En la prueba de sonda (M2), con la línea base previa al verdor retirada, los parámetros K, g, d0, d1 y a no mostraron señal dentro de municipio. Lo único con señal fue la línea base previa al verdor (b), con un techo dentro de municipio de R² cerca de 0.05–0.10, equivalente a 0.013–0.026 t/ha de RMSE.

Fuente: experimentos_tabulares/dynamic_change__phenocurve__docs__M1_models.md; experimentos_tabulares/dynamic_change__phenocurve__docs__M2_probe.md

## Amplitud en TIMESAT y en la literatura de fenología

TIMESAT (Jönsson y Eklundh, 2004) ajusta curvas suaves a series de NDVI y extrae parámetros estacionales. La referencia está verificada (Computers & Geosciences, 30(8), 833–845). La definición de sus parámetros está en el manual del software (Eklundh y Jönsson, versión 3.1, sección de definiciones de parámetros
estacionales):

- Base (base level): promedio del mínimo izquierdo y el mínimo derecho de la curva ajustada.
- Amplitud estacional: diferencia entre el máximo de la temporada y la base.
- Inicio y fin de temporada: el momento en que el borde izquierdo o el derecho alcanza un nivel definido por el usuario, medido desde el mínimo de ese lado. El manual lo describe como una proporción de la amplitud o como un valor umbral fijo. No fija el 50 % ni el 90 % por defecto.
- Punto medio de la temporada: promedio de los tiempos en que cada borde alcanza el 80 % de su nivel.

El proyecto no usa esa base. Toma como línea base el mínimo de la curva suavizada antes del pico (ver la sección de amplitud fenológica del NDVI). Por tanto, la amplitud del proyecto y la de TIMESAT no son comparables sin declararlo. El producto HR-VPP de Copernicus define la amplitud como máximo menos mínimo de la
temporada sobre PPI, otro índice; esa definición vino de una búsqueda de la ronda 2 y no se leyó en la documentación completa.

Fuente: manual TIMESAT 3.1 (Eklundh y Jönsson, 2011), sección de definiciones de parámetros: https://web.nateko.lu.se/timesat/docs/timesat3_1_1_SoftwareManual.pdf (PDF leído con pdftotext); TIMESAT 3.3 (umbral definido por el usuario): https://web.nateko.lu.se/timesat/docs/TIMESAT33_SoftwareManual.pdf;
https://doi.org/10.1016/j.cageo.2004.05.006 (Jönsson y Eklundh, 2004)

## Amplitud como ancho de intervalo de predicción

En estadística, la amplitud de un intervalo de predicción es la distancia entre sus extremos, por ejemplo 2 × 1.96 × σ en un intervalo normal al 95 %. Sirve para medir la incertidumbre de una estimación, y se evalúa junto con su cobertura: la proporción de observaciones que caen dentro. Un intervalo estrecho con
cobertura baja no es mejor que uno amplio con cobertura adecuada.

En el proyecto, el documento de comparación de modelos propone evaluar "intervalos calibrados con residuales excluidos, coverage y amplitud por región". Es una propuesta de trabajo futuro: no hay cifras de cobertura ni de amplitud por región en el corpus. El mismo documento advierte que un intervalo estrecho no
demuestra que una meta de 100 kg/ha sea alcanzable.

Fuente: literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt; validacion/iterate_20261017__research__critique_expected_value.md

## Cobertura, intervalos de validación cruzada y comparación entre modelos

Una validación cruzada (CV) tiende a dar intervalos demasiado estrechos. Bates, Hastie y Tibshirani (2024) muestran que la CV no estima el error del modelo ajustado con sus propios datos de entrenamiento, sino el error promedio de modelos ajustados con otros conjuntos de entrenamiento de la misma población. Sus
intervalos estándar basados en CV pueden cubrir muy por debajo del nivel deseado, porque cada punto sirve a la vez para entrenar y para probar, y la varianza usual sale demasiado pequeña. La CV anidada, propuesta por los autores, da intervalos con cobertura aproximadamente correcta en muchos de sus ejemplos (verificado
en el resumen del artículo). El proyecto usa el intervalo bootstrap pareado (95 %) de la diferencia de RMSE entre el mejor y el segundo
modelo, que en el benchmark fue [-0.0506, 0.0390] t/ha. Como ese intervalo incluye el cero, el resultado es inconcluso. Su amplitud es de 0.0896 t/ha, pero esa amplitud no mide la incertidumbre de una predicción individual.

Fuente: experimentos_profundos/benchmark_20260930__REPORT.md; validacion/iterate_20261017__research__B3_small_n_methods.md; https://arxiv.org/abs/2104.00673 (Bates et al. 2024, JASA 119(546), verificado en resumen)

## Ancho de intervalo por piso de redondeo en las etiquetas

Las etiquetas de rendimiento redondeadas imponen un piso al error alcanzable. Con un redondeo de paso w, el ruido uniforme tiene desviación estándar w/√12: aproximadamente 0.14 t/ha para w = 0.5 y 0.29 t/ha para w = 1.0. Esta es una cota matemática sobre el error de la etiqueta, no la amplitud de un intervalo de
predicción. Sin embargo, un intervalo de predicción más estrecho que este piso no es creíble sin mejores etiquetas.

Fuente: validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md

## Otras acepciones: amplitud de la ventana de siembra

En el Altiplano de temporal de Hidalgo, la agenda técnica INIFAP Hidalgo (2017, cuadro 2 de la sección de cebada) da fechas de siembra según el ambiente de productividad: del 1 de mayo al 15 de junio en ambientes de muy buena productividad, del 15 de mayo al 20 de junio en los de buena productividad, y del 1 al 30 de
junio en los de mediana y baja productividad. Son orientaciones de la agenda, no fechas por parcela. Las duraciones de floración y madurez no aparecen en esa agenda, así que quedan como no documentadas (sin evidencia).

"Amplitud de la ventana" significa en este caso el número de días entre la primera y la última siembra posibles: 45 días en el primer ambiente, 36 días en el segundo y 29 días en el tercero. El corpus no documenta la ventana exacta de las 197 parcelas.

En el análisis de observaciones, "ventana" también indica el periodo en que se cuentan fechas claras: por ejemplo, el 1 de septiembre al 31 de octubre tiene una mediana de 7 observaciones de Sentinel-2 y 16 de Planet por parcela.

Fuente: INIFAP (2017). Agenda Técnica Hidalgo, cuadro 2 «Fechas de siembra para el cultivo de cebada de acuerdo al ambiente de producción» (PDF leído con pdftotext): https://vun.inifap.gob.mx/VUN_MEDIA/BibliotecaWeb/_media/_agendas/4131_4828_Agenda_T%C3%A9cnica_Hidalgo_2017.pdf;
teledeteccion_fenologia/literature_review__reports__Panicle_coverage_and_barley_yield.md (conteo de observaciones)

## Otras acepciones: amplitud del rango de rendimientos

"Amplitud del rango de rendimientos" es la diferencia entre el valor más alto y el más bajo de las etiquetas de rendimiento (en t/ha, con 138 parcelas de entrenamiento). Un rango amplio infla el R² aunque no cambie el RMSE. El corpus lo advierte como condición para leer resultados de la literatura: la variabilidad
entre campos hace que el R² sea engañoso. El valor exacto del rango para las 138 parcelas no se citó en las fuentes revisadas; debe calcularse de la tabla de rendimientos.

Fuente: validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__accuracy_and_label_noise.md

## Cómo desambiguar "amplitud" en una reseña

Usa el contexto de la oración para decidir el significado:
- Si habla de temperatura, clima, noches, heladas, máximas o mínimas, o grados, es **amplitud térmica**: Tmax − Tmin, en °C, calculada con los rasters mensuales (y con la advertencia de que son medias mensuales).
- Si habla de NDVI, curva, pico, verdor, senescencia, caída, dosel o fenología, es **amplitud estacional (fenológica)**: pico menos línea base, en unidades de NDVI (0.0 a 1.0), con los umbrales del 50 % y 90 %. Conviene declarar qué definición de línea base se usa, porque TIMESAT y el proyecto no la calculan igual.
- Si habla de intervalo, incertidumbre, cobertura, error, ±, o de qué tan confiable es una predicción, es **ancho de intervalo**: la distancia entre el límite inferior y el superior, en t/ha.
- Si habla de fechas de siembra, días entre siembra y cosecha, o periodos posibles, es **amplitud de la ventana**, en días.
- Si habla del rango de los rendimientos de las parcelas, o de la dispersión de la variable objetivo, es **amplitud del rango de rendimientos**, en t/ha.
- Si no hay pistas, pregunta cuál es la magnitud medida y en qué unidades. No inventes un significado.

Fuente: síntesis de las secciones anteriores de este archivo

## Temperatura base y grados-día en cebada: no hay una base única

Los grados-día (GDD) acumulan la temperatura media diaria por encima de una temperatura base. En cebada, la base elegida cambia mucho el total necesario para cada fase, así que cualquier umbral debe declarar su base. Un estudio de cebada de invierno (2006) calculó todas las fases en GDD con base 0 °C. Un estudio checo
de cebada de primavera usó base 5 °C y reportó la espigazón entre unos 450 y 645 GDD en un trabajo, y entre 418 y 500 GDD en otro del mismo grupo. Un estudio indio usó base 4.4 °C (40 °F), siguiendo a Nuttonson (1956); la guía de la Universidad de Minnesota (MN2500) también usa base 40 °F para sus etapas de cebada.

Por tanto, no hay una base única verificada para la cebada de temporal del Altiplano. Para el proyecto, una fecha de siembra estimada con GDD debe reportar la base, la fecha de inicio de la acumulación y el método (media diaria o máxima y mínima). Los totales de un estudio no se deben comparar con los de otro sin esa
aclaración.

Fuente: estudio checo de cebada de primavera (base 5 °C; referencia incompleta en la búsqueda de la ronda 2); https://conservancy.umn.edu/bitstream/handle/11299/207440/MN2500_AGFO_2548.pdf (base 40 °F); referencias de búsqueda de la ronda 2 para base 0 °C (estudio de cebada de invierno, 2006; referencia incompleta)

## Umbrales de helada por etapa en cebada (literatura de extensión)

La literatura consultada coincide en que la cebada es más sensible a la helada durante la bota, el espigado y la floración que en las etapas vegetativas. Una guía de extensión de Dakota del Norte (NDSU) indica que, de bota a floración, los cereales de grano pequeño son los más sensibles y no toleran temperaturas por
debajo de unos −2 °C (28 °F); añade que la cebada es más vulnerable que el trigo en bota porque florece dentro de la bota. Una tesis de la Universidad de Adelaida, citando a Single (1988), reporta que la humedad dentro de la bota puede congelarse hacia −2 °C y dañar el tallo, y que el punto de crecimiento, aunque
protegido por la vaina, puede dañarse de forma irreversible alrededor de −5 °C durante la elongación del tallo.

Estos son umbrales generales de literatura de extensión y de otros países, no una función validada para la cebada maltera mexicana. La misma fuente indica que los periodos fríos previos inducen endurecimiento y que el daño crece con la duración de las temperaturas bajas. El corpus no tiene una función de daño por
helada para cebada mexicana: el hueco sigue abierto.

Fuente: https://www.ndsu.edu/agriculture/node/411 (NDSU Extension); https://thesis.library.adelaide.edu.au/dspace/bitstream/2440/62523/8/02chapters1-3.pdf (citando a Single, 1988; referencia primaria no leída)

## Heladas en encañado y espigado: el caso de la cebada de Argentina y Perú

Un informe de trigo y cebada en Argentina (FCA-UNL, Trigo2020) señala que la cebada y la avena toleran temperaturas de hasta −6 °C mientras el meristemo apical está bajo el suelo, hasta el fin del macollaje. Las heladas tardías de septiembre y octubre, en cambio, coinciden con encañado, espigado o floración y son las
que causan daño. El mismo informe describe que una helada en antesis afectó el número potencial de granos en trigo.

Un estudio de cebada en la sierra central peruana, citado en una búsqueda de la ronda 2 (referencia incompleta), encontró que una helada durante la floración comprometió el desarrollo de los cultivares en el sitio más alto, mientras que una helada en crecimiento vegetativo no causó daño en el valle. Esto apoya el
criterio de que la fecha de la helada respecto a la etapa importa más que su magnitud sola.

Para el Altiplano de temporal, la implicación es que la fecha de floración de la cebada, y no solo la temperatura mínima del mes, determina el riesgo. Esto es una recomendación basada en literatura de otros países, no un resultado del proyecto.

Fuente: https://www.fca.unl.edu.ar/investigacion/wp-content/uploads/sites/16/2018/08/Informe_final-Trigo2020-UECE.pdf; referencia peruana incompleta (búsqueda de la ronda 2)

## Calor en el llenado de grano de cebada maltera: un estudio de campo

Savin, Stone y Nicolas (1996) expusieron cebada maltera a periodos cortos de alta temperatura en campo, con cámaras portátiles, comenzando 17 días después de la antesis. El resumen reporta que el calor redujo el peso individual del grano en 14 % en la variedad Schooner y 25 % en Parwan, y que el calor bajó la calidad
de malta en las parcelas calentadas. Estas cifras se verificaron con el resumen y la sección de resultados del artículo (WebFetch, Ronda 4): las cámaras calentaron la parcela a unos 40 °C durante 6 h al día, 5 días, a partir de 17 días después de la antesis; el extracto de malta bajó de 79 % a 73 % en Schooner y de
68.4 % a 66.2 % en Parwan.

El estudio trata calor y llenado de grano, no oscilación térmica ni helada. Sirve como referencia de que un evento térmico corto en la fase de llenado afecta la calidad maltera, lo que es relevante para la cebada de malta, que en México se destina en su mayor parte a malta (cerca de 80 %, según un informe de búsqueda
sin fuente primaria verificada).

Fuente: https://doi.org/10.1071/AR9960465 (Savin, Stone y Nicolas, 1996; resumen y resultados verificados en la Ronda 4)

## Temperaturas mínimas y rendimiento de trigo en México

Lobell y colaboradores (2005), en Field Crops Research, analizaron las tendencias de rendimiento del trigo en México. Su resumen atribuye gran parte de un aumento de cerca de 25 % en dos décadas a tendencias climáticas en los estados del noroeste, en particular al enfriamiento de las temperaturas nocturnas de la
temporada de crecimiento, y advierte que las ganancias futuras serán menores que las recientes. Esto apoya que la temperatura mínima, y no solo la máxima, puede pesar en el rendimiento en México.

Esa relación es una asociación climática, no una prueba experimental. Un estudio de trigo de riego del Valle Yaqui (Agronomy Journal) encontró que el efecto histórico de la Tmin podía deberse en buena parte a su covariación con la radiación solar. Un preprint de 2026 sobre trigo a escala global estima que 1 °C más de
Tmin reduce el rendimiento en unas 0.5 t/ha, pero no está revisado por pares y no debe citarse como cifra firme.

Para el reto, la amplitud térmica combina Tmax y Tmin, así que su efecto sobre el rendimiento no puede separarse de estos componentes sin datos diarios.

Fuente: Lobell et al. (2005), Field Crops Research, 94, 250–256, DOI 10.1016/j.fcr.2005.01.007 (DOI y metadatos verificados en Crossref; resumen verificado en la ronda 2); preprint bioRxiv 2026 (no revisado por pares)

## Calor extremo y senescencia acelerada en trigo de India

Lobell, Sibley y Ortiz-Monasterio (2012), en Nature Climate Change, usaron datos satelitales de trigo en el norte de la India. Su resumen reporta que las temperaturas por encima de 34 °C aceleran el envejecimiento del cultivo y reducen el rendimiento, y que la mayoría de los modelos de cultivo subestima este efecto. El
artículo es un estudio de trigo en India y no de cebada en México; su aplicación al Altiplano es una extrapolación.

Para la amplitud térmica, la lección es que el estrés térmico al final del ciclo puede deberse a días muy cálidos y no a la oscilación diaria. Los rasters mensuales del reto no separan días de 34 °C, así que no permiten verificar este mecanismo.

Fuente: https://doi.org/10.1038/nclimate1356 (resumen verificado)

## Verdor y amplitud del NDVI como indicador de productividad: evidencia indirecta

No se encontró literatura que demuestre que la amplitud pico menos línea base del NDVI prediga el rendimiento de cebada. La evidencia disponible es indirecta. Magney y colaboradores mostraron, con NDVI diario proximal en trigo de primavera, que las tasas y duraciones de los periodos fenológicos derivados del NDVI
predicen mejor la cantidad (biomasa, rendimiento) y la calidad (proteína) en temporada que el NDVI bruto, que es débil al inicio del ciclo. En un estudio de 2023 en Frontiers in Plant Science, añadir la fecha de espigado, la altura o la densidad de espigas a modelos con NDVI de dron mejoró en general la predicción del
rendimiento, con la mayor
ganancia cuando el NDVI satura por encima de unas 8 t/ha.

Estos resultados apoyan usar métricas de fenología derivadas del NDVI como variables, pero no la amplitud en particular. En nuestros experimentos, la amplitud no mejoró la predicción dentro de municipio (ver el fragmento correspondiente más arriba). La conclusión que sí es consistente con la literatura es que la fecha
de las fases pesa más que el valor del pico.

Fuente: Magney et al. (2016), Agricultural and Forest Meteorology 217:46–60, DOI 10.1016/j.agrformet.2015.11.009 (verificado en Crossref; resumen de buscador); https://doi.org/10.3389/fpls.2023.1063983 (resumen de búsqueda; título no leído)

## Amplitud del ciclo en el producto de Copernicus (HR-VPP)

El producto HR-VPP de Copernicus define la amplitud estacional (AMPL) como la diferencia entre el valor máximo de la temporada (MAXV, valor pico) y el mínimo de la temporada (MINV, base), sobre el índice PPI y no sobre NDVI. Es una definición de producto operativo, distinta de la de TIMESAT en su forma del resumen de
búsqueda y de la del proyecto, que usa el mínimo de la curva suavizada antes del pico.

La consecuencia práctica es que dos cifras de "amplitud" con el mismo nombre pueden diferir por la línea base, aunque se calculen sobre la misma serie. Antes de comparar valores con una fuente externa, la reseña debe indicar el índice (NDVI o PPI), la ventana temporal y la definición de la base.

Fuente: definición del producto HR-VPP de Copernicus (búsqueda de la ronda 2; documentación técnica no leída completa); https://doi.org/10.1016/j.cageo.2004.05.006 (para la comparación con TIMESAT)

## Predicción conformal: garantía de cobertura para intervalos

La predicción conformal construye conjuntos o intervalos de predicción alrededor de cualquier modelo ya entrenado, sin suponer una distribución particular de los errores. Su garantía básica es de cobertura marginal: si los datos son intercambiables (por ejemplo, observaciones i.i.d. o con permutación simétrica), el
intervalo contiene el valor verdadero con la probabilidad nominal elegida, por ejemplo 90 %. Angelopoulos y Bates (2021, arXiv:2107.07511; monografía de 2023) presentan este enfoque para lectores no estadísticos, con ejemplos en Python.

La garantía es marginal, es decir, en promedio sobre las predicciones, y no condicional a una región o a una parcela. Además, depende de la intercambiabilidad, que puede fallar con datos espaciales o temporales dependientes, como las parcelas de un mismo municipio o las series de un mismo año. Un intervalo conformal de
90 % no es más estrecho ni más confiable por el hecho de serlo; su amplitud sigue dependiendo del modelo base y de la calibración.

Recomendación para el proyecto, no resultado: si se reporta un intervalo, indicar su nivel nominal, la cobertura medida en validación cruzada por grupos (por municipio o por año) y la amplitud media en t/ha.

Fuente: https://arxiv.org/pdf/2107.07511 (Angelopoulos y Bates, resumen verificado); https://doi.org/10.1561/2200000101

## Predicción conformal aplicada a rendimientos de cultivos

Qureshi y colaboradores (2026, Journal of Computers and Intelligent Systems) proponen AgroX-MoE-CP, con calibración conforme dividida (split conformal) para intervalos de 90 %. Su resumen reporta cobertura empírica cercana a 0.90 tanto en datos de microparcelas como a escala de país, con anchos medios de unos 1.66 t/ha
en micro y 8.88 t/ha en macro. Son datos tabulares agronómicos, no imágenes de satélite, y solo se leyó el resumen.

Hasta donde se encontró, no hay un estudio que pruebe la cobertura conformal con datos de teledetección de rendimiento bajo dependencia espacial o temporal, que es donde más falla la intercambiabilidad. Un trabajo de 2024 sobre regresión multimodal con conformal sugiere que el método puede extenderse a rendimiento de
cultivos, pero no lo prueba.

Para el reto, un intervalo de 1.66 t/ha en micro no es comparable con los resultados del proyecto, porque la escala y los datos son distintos. Esta comparación no debe usarse para afirmar que el intervalo del proyecto es estrecho o amplio.

Fuente: https://journals.iub.edu.pk/index.php/JCIS/article/view/4398 (Qureshi et al. 2026, resumen de búsqueda; no leído completo)

## Heladas tempranas y tardías en Valles Altos: marco metodológico sin cifras regionales

Las heladas tempranas (finales de septiembre) y tardías (abril–mayo) limitan los cultivos de Valles Altos, pero no se encontraron fechas de probabilidad por estación para cebada en Hidalgo, Puebla o Tlaxcala en esta ronda (sin evidencia). Un estudio de 2021 (Reyes-García y colaboradores, Tecnología y Ciencias del Agua,
12(6), 328–362, DOI 10.24850/j-tyca-2021-06-08) estima el riesgo de heladas tardías y tempranas y los periodos libres de heladas con teoría de valores extremos, usando temperatura mínima diaria de 77 estaciones del Estado de México entre 1980 y 2010.

El método es el adecuado para estimar fechas con una probabilidad dada, pero sus resultados son para el Estado de México, no para los tres estados del reto. Otro documento citado en la búsqueda menciona heladas tempranas en la última semana de septiembre que limitan maíz, frijol, cebada y trigo, y un año con pérdidas
muy altas de trigo harinero en Tlaxcala; esa fuente no está identificada con precisión, así que sus cifras no se usan aquí.

Para el reto, la recomendación es calcular la probabilidad de helada por fecha con las Tmin diarias de las estaciones del SMN de la zona (CLICOM) o con datos de reanálisis diarios. Esto es un método sugerido, no un resultado del proyecto.

Fuente: Reyes-García et al. (2021), Tecnología y Ciencias del Agua, 12(6), https://doi.org/10.24850/j-tyca-2021-06-08 (resumen verificado)

## Calor de llenado y calidad maltera en cebada: peso del grano y estructura del grano

En cebada maltera, la fase de llenado del grano es la más sensible a las temperaturas altas para el peso del grano y la calidad de malta. Passarella, Savin y Slafer (2005), en Euphytica, estudiaron cómo la sensibilidad del peso del grano y de la calidad a eventos de temperatura alta durante el llenado depende del
genotipo, lo que hace de la respuesta una característica del mejoramiento y no solo del ambiente. Su resumen no se leyó en esta ronda, así que no se citan cifras de ese trabajo.

Savin, Stone y Nicolas (1996) reportan, en su resumen, que periodos cortos de calor de campo durante el llenado redujeron el peso individual del grano (14 % en la variedad Schooner y 25 % en Parwan) y bajaron la calidad de malta.

Wallwork y colaboradores (1998), en Annals of Botany, expusieron la variedad Schooner a temperaturas de hasta 35 °C durante 5 días en el llenado. Encontraron cambios fuertes en la estructura del grano maduro: endospermo degradado, menor desarrollo de almidón en las células subaleurona y sobremodificación durante la
malteada.

Para la cebada de temporal del Altiplano, la implicación es que un episodio cálido durante el llenado puede afectar la calidad maltera aunque la amplitud térmica mensual sea moderada. Esto es una inferencia desde estudios de otras condiciones, no un resultado del proyecto. Como los rasters del reto son medias
mensuales, no separan estos eventos cortos.

Fuente: Passarella, V. S., Savin, R. y Slafer, G. A. (2005). Euphytica, 141(1–2). https://doi.org/10.1007/s10681-005-5068-4 (referencia verificada; resumen no leído); Savin, R., Stone, P. J. y Nicolas, M. E. (1996). https://doi.org/10.1071/AR9960465 (resumen verificado); Wallwork, M. A. B., Jenner, C. F., Logue, S. J.
y Sedgley, M. (1998). Annals of Botany, 82(5), 587–599. https://doi.org/10.1006/anbo.1998.0721 (resumen extraído con WebFetch)

## Heladas posteriores a la emergencia de la espiga: definición y umbrales de temperatura de la planta

Frederiks, Christopher, Sutherland y Borrell (2015), en Journal of Experimental Botany, definen la helada posterior a la emergencia de la espiga (post-head-emergence frost, PHEF) y la distinguen de otros tipos de helada. Las cebadas y trigos son más vulnerables cuando las aristas o espigas emergen de la vaina de la
hoja bandera, en la etapa Zadoks 49. Su revisión reporta que el daño en cebada aparece hacia −4 a −5 °C de temperatura del aire a la altura del dosel, y que los floretes se dañan comúnmente a unos −6.5 °C de temperatura de la planta.

Un punto práctico es que la planta puede estar entre 1 y 3 °C más fría que el aire del dosel en heladas suaves. Además, la parte alta del dosel puede estar unos 2 °C más fría que el centro. La revisión tampoco encontró, para estos cereales, una resistencia útil a la helada posterior a la emergencia.

Para el Altiplano, la consecuencia es que la misma temperatura mínima de la estación puede dar daños distintos según la etapa y la temperatura real de la planta. Esta es una lectura de literatura de otras regiones, no un umbral validado para la cebada de Hidalgo. Los valores se verificaron en el texto de la revisión
(WebFetch de la página del artículo, Ronda 4); el PDF completo no se descargó.

Fuente: Frederiks, T. M., Christopher, J. T., Sutherland, M. W. y Borrell, A. K. (2015). Journal of Experimental Botany, 66(12), 3487–3498. https://doi.org/10.1093/jxb/erv088 (resumen extraído con WebFetch; cifras de daño verificadas en el texto de la revisión en la Ronda 4; Crossref para volumen y páginas)

## Heladas posteriores a la emergencia de la espiga en cebada del norte de Australia

Frederiks, Christopher, Fletcher y Borrell (2011), en Crop & Pasture Science, probaron cinco genotipos de cebada con resistencia previa a la helada reproductiva, frente a dos testigos locales, en la región de granos del norte de Australia durante 2003, 2004 y 2005. Según el resumen, todos los genotipos sufrieron daño
severo en espigas y tallos cuando la temperatura mínima de la planta bajó de −8 °C. Heladas de alrededor de −6.5 °C no eliminaron el rendimiento, aunque sí hubo llenado parcial.

Los autores concluyen que los genotipos con resistencia en el sur no son fuentes útiles en el norte, porque los rankings cambian entre regiones. Los testigos locales tuvieron al menos el mismo cuajado que cualquier genotipo probado.

Para el proyecto, la lección es que el umbral de daño depende de la temperatura de la planta, del genotipo y de la región. Una cifra de helada de otra región no se traslada directamente al Altiplano de Hidalgo, Puebla o Tlaxcala.

Fuente: Frederiks, T. M., Christopher, J. T., Fletcher, S. E. H. y Borrell, A. K. (2011). Crop & Pasture Science, 62(9), 736–745. https://doi.org/10.1071/CP11079 (resumen extraído con WebFetch)

## Heladas tempranas y pérdidas en Hidalgo según la agenda técnica INIFAP 2017

La agenda técnica INIFAP Hidalgo (2017), en su introducción de la agricultura de temporal, señala que los principales riesgos son las heladas tempranas y las sequías, que pueden provocar pérdidas de entre 30 y 35 % de la superficie sembrada. La cifra se refiere a la agricultura de temporal del estado en su conjunto y
no indica el periodo de cálculo ni separa la cebada.

La misma agenda reporta que en 2015 se sembraron 101,065 ha de cebada en Hidalgo, se cosecharon 92,531 ha y la producción fue de 250,296 t, con un rendimiento promedio de 2,705 kg/ha. Más de 90 % de esa superficie se produce en el ciclo primavera–verano en el Altiplano, y cerca de 80 % se comercializa para la industria
maltera-cervecera. Los Valles Altos de Hidalgo, entre 2,100 y 2,700 msnm, tienen cuatro ambientes de producción según la lluvia y el suelo.

La agenda no incluye fechas medias de helada por estación. Esas fechas requieren series diarias de temperatura mínima, por ejemplo con el método de valores extremos (sin evidencia de cifras por estación en esta ronda).

Fuente: INIFAP (2017). Agenda Técnica Hidalgo, sección de agricultura de temporal y sección de cebada de temporal (PDF leído con pdftotext): https://vun.inifap.gob.mx/VUN_MEDIA/BibliotecaWeb/_media/_agendas/4131_4828_Agenda_T%C3%A9cnica_Hidalgo_2017.pdf

## Temperaturas mínimas normales del SMN en el Altiplano: dónde la media de las mínimas queda bajo cero

Las normales climatológicas 1991–2020 del SMN-CONAGUA muestran que la temperatura mínima media mensual baja de 0 °C en enero y diciembre en algunas estaciones del Altiplano de Hidalgo. En San Jerónimo Tepeapulco (2,535 msnm) es de −1.0 °C en enero y −0.6 °C en diciembre. En Apan (2,496 msnm) es de 0.7 °C en enero y 1.3
°C en diciembre. En Pachuca (2,425 msnm) es de 5.9 °C en enero y 6.6 °C en diciembre.

Estas son medias mensuales de las mínimas diarias. No son fechas de helada, ni extremos, ni probabilidades para una fecha dada. Para estimar la fecha de la primera helada de otoño o la última de primavera hacen falta series diarias de la estación o un análisis de extremos, y no basta con la media del mes.

Para el reto, las medias mensuales de Tmin de los rasters CHIRTS-ERA5 permiten comparar meses, pero no reemplazan las fechas de helada. Esta distinción es importante al leer reseñas que hablan de "temperaturas bajo cero" sin especificar si son medias, extremos o frecuencias.

Fuente: CONAGUA/SMN (2026). Normales Climatológicas 1991–2020: nor9120_13027 (San Jerónimo Tepeapulco), nor9120_13002 (Apan) y nor9120_13022 (Pachuca): https://smn.conagua.gob.mx/tools/RESOURCES/Normales_Climatologicas/Normales9120/hgo/nor9120_13027.txt

## Parámetros de TIMESAT: base, amplitud, inicio y fin de temporada

TIMESAT ajusta funciones a una serie temporal de un índice de vegetación y de ahí extrae parámetros de cada temporada. Según el manual de la versión 3.1 (Eklundh y Jönsson, 2011), la base (base level) es el promedio de los dos mínimos, izquierdo y derecho, de la curva ajustada. La amplitud estacional es el máximo de la
temporada menos esa base.

El inicio y el fin de temporada se fijan con un nivel que define el usuario. Ese nivel se puede dar como una proporción de la amplitud medida desde cada mínimo, o como un valor umbral fijo. El punto medio de la temporada se calcula con el 80 % del nivel en los dos bordes.

Por tanto, una "amplitud" de TIMESAT depende de cómo se elija la base y de los umbrales. Una cifra de amplitud sin su definición de base no permite comparar estudios. El manual no fija 50 % ni 90 % por defecto para el inicio y el fin de temporada.

Fuente: Eklundh, L. y Jönsson, P. (2011). TIMESAT 3.1 Software Manual, sección de definiciones de parámetros: https://web.nateko.lu.se/timesat/docs/timesat3_1_1_SoftwareManual.pdf; Jönsson, P. y Eklundh, L. (2004). Computers & Geosciences, 30(8), 833–845. https://doi.org/10.1016/j.cageo.2004.05.006

## Tendencias de Tmax y Tmin en el centro de México: resultados por estación

Las series de temperatura del Servicio Meteorológico Nacional (SMN) no muestran una tendencia uniforme en el centro de México. Morales-Acoltzi (2016), en una presentación de curso de la UNAM, usó 334 estaciones del SMN de nueve estados del Altiplano mexicano y comparó 1961–1990 con 1991–2012. En Tlaxcala, la
temperatura máxima media anual subió 2.4 °C en Tlaxco, pero bajó levemente en Atlanga y Huamantla; la mínima subió 1.3 °C en la capital del estado y bajó en El Carmen Tequexquitla y Atlanga. En Aguascalientes, Ruíz Álvarez et al. (2016) analizaron tendencias mensuales de Tmax y Tmin con series de al menos 30 años, con
la prueba de Mann-Kendall y la pendiente de Theil. En Zacatecas, Santillán-Espinoza et al. (2011), con 24 estaciones, encontraron aumento de la Tmax y descenso de la Tmin en gran parte del estado. Para el proyecto, el signo de la tendencia cambia de una estación a otra, así que un promedio regional puede ocultarlo, y
las medias mensuales de los rasters no separan esos efectos. Hecho de literatura (la presentación no es arbitrada; los otros dos son artículos leídos por resumen).

Fuente: Morales-Acoltzi (2016), presentación de curso UNAM, https://ruoa.unam.mx/cursos/Curso_2016_CCA/source/C.%20Cliamtico%20o%20variabilidad%20climatica.pdf (no arbitrada); Ruíz Álvarez et al. (2016), Ciencias Agrícolas (INIFAP), https://cienciasagricolas.inifap.gob.mx/index.php/agricolas/en/article/view/477
(resumen de buscador); Santillán-Espinoza et al. (2011), resumen de buscador (revista no identificada).

## Heladas y granizo en Tlaxcala y el Altiplano: evidencia regional disponible

En Tlaxcala, un artículo de Terra Latinoamericana identifica las heladas y las bajas precipitaciones como los principales eventos climáticos extremos que afectan la agricultura del estado. Según el resumen, las heladas se presentan sobre todo en las noches de invierno y causan daños severos a la agricultura de
temporal. Para el granizo, un estudio de Investigaciones Geográficas (UNAM) analiza estadísticamente las granizadas del Altiplano mexicano con datos del SMN de observatorios de Puebla, Tlaxcala, Estado de México, Hidalgo y Ciudad de México, para 1981–2017, y describe una gran cantidad de eventos cada año; no cuantifica
daños al cultivo. Una nota periodística de 2002 sobre Calpulalpan y Nanacamilpa describe una afectación de unas 7 mil hectáreas de cebada por sequía, no por helada ni granizo; la región se considera una de las principales proveedoras de materia prima para la industria maltera del país (prensa). No se encontró un
estudio que cuantifique la pérdida de rendimiento de cebada por helada o granizo en Hidalgo o Tlaxcala: sin evidencia. Los umbrales por etapa de los fragmentos anteriores son de otras regiones.

Fuente: Terra Latinoamericana, artículo sobre agricultura de Tlaxcala, https://www.terralatinoamericana.org.mx/index.php/terra/article/download/2351/2011/25305 (resumen de buscador; autores y año no verificados); Investigaciones Geográficas (UNAM),
https://www.investigacionesgeograficas.unam.mx/index.php/rig/article/download/60741/54637/180743 (resumen de buscador); La Jornada de Oriente, 14-ago-2002, https://www.jornada.com.mx/2002/08/14/oriente-y.htm (prensa).

## Ventana de sensibilidad a la helada en cebada de dos hileras (Ferrante et al., 2021)

Ferrante, Cullis, Smith y Able (2021), en Frontiers in Plant Science, analizaron ensayos multiambiente de 2010 a 2019 en Australia, con más de 557,000 espigas, para estudiar la esterilidad floral y la pérdida de rendimiento por helada en trigo y cebada. Según su revisión, en cebada de dos hileras la ventana sensible a
la helada va de 40 a 10 días antes del espigamiento (heading). En trigo, la ventana empieza con la emergencia de la penúltima hoja (20 a 30 días antes de la antesis) y termina de 7 a 10 días después de la antesis. Los autores definen la helada de radiación primaveral como una temperatura del aire menor a 0 °C a nivel
del dosel. Para el Altiplano, la ventana no se puede trasladar sin fenología local: los días al espigamiento de las variedades de la parcela serían los que fijan su inicio. Hecho de literatura (artículo consultado con WebFetch en la Ronda 4; las cifras de ventana vienen del texto).

Fuente: Ferrante, A., Cullis, B. R., Smith, A. B. y Able, J. A. (2021). A Multi-Environment Trial Analysis of Frost Susceptibility in Wheat and Barley Under Australian Frost-Prone Field Conditions. Frontiers in Plant Science, 12, 722637. https://doi.org/10.3389/fpls.2021.722637

## Errores frecuentes y cómo detectarlos

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

## Preguntas y respuestas

**P:** ¿Qué es la amplitud térmica en el contexto del Reto AgroCebada?
**R:** Es la diferencia entre la temperatura máxima y la mínima. Con los rasters del reto se calcula como Tmax_mes − Tmin_mes, usando medias mensuales de los mínimos y máximos diarios, en °C.

**P:** ¿Los rasters CHIRTS-ERA5 del reto dan la temperatura máxima y mínima diaria?
**R:** No. Son promedios mensuales de las mínimas y las máximas diarias, no el día más frío o más caluroso del mes.

**P:** ¿Cuál es la resolución de los rasters térmicos?
**R:** Unos 0.05° (cerca de 5 km), con 65 × 72 píxeles por raster y NoData −9999.

**P:** ¿Cómo se calcula la amplitud NDVI en el proyecto?
**R:** Como pico menos línea base: amplitude = peak − baseline, donde la línea base es el mínimo de la curva suavizada entre el 1 de abril y el pico.

**P:** ¿Qué umbral se usa para el verdor?
**R:** El 50 % de la amplitud sobre la línea base. Con Planet NDVI se usa la última cruce antes del pico.

**P:** ¿Cuántas parcelas no llegan al 50 % de caída antes del 31 de octubre?
**R:** Con Sentinel-2 y el umbral del 50 % tras el pico, 114 de 197 no lo alcanzan (mediana 1 de noviembre). Con HLS, 107 quedan censuradas. Las cifras dependen del sensor.

**P:** ¿La amplitud NDVI mejoró la predicción del rendimiento dentro de municipio?
**R:** No en nuestros experimentos. El modelo de pico y verdor dio un resultado nulo, y la línea base previa al verdor fue la única métrica con señal.

**P:** ¿Qué valores típicos de amplitud térmica hay en el Altiplano central?
**R:** Según las normales oficiales del SMN 1991–2020, la diferencia mensual Tmax − Tmin de estaciones del Altiplano va de unos 9 a 14 °C en Pachuca (media 12.1 °C) a unos 15 a 21 °C en Apan (media 18.3 °C). Son valores de estación, no de parcela.

**P:** ¿Qué significa "amplitud" cuando se habla de un intervalo?
**R:** Es el ancho del intervalo, la distancia entre sus límites. Debe leerse junto con su cobertura. En el proyecto, la cobertura por región es trabajo futuro.

**P:** ¿Qué es la amplitud de la ventana de siembra?
**R:** Son los días entre la primera y la última siembra posibles. Según la agenda INIFAP Hidalgo (2017, cuadro 2), en el Altiplano de temporal la siembra va del 1 de mayo al 15 de junio (muy buena productividad, unos 45 días), del 15 de mayo al 20 de junio (buena, 36 días) o del 1 al 30 de junio (mediana y baja, 29
días).

**P:** ¿Qué temperatura base se usa para grados-día en cebada?
**R:** No hay una base única. Los estudios usan 0 °C, 4.4 °C (40 °F) o 5 °C, y los totales de GDD no son comparables entre sí sin declarar la base.

**P:** ¿A qué temperatura puede dañarse la cebada durante la bota o el espigado?
**R:** Literatura de extensión y de otros países indica unos −2 °C en bota a floración (la humedad de la bota puede congelarse) y unos −5 °C en el punto de crecimiento durante la elongación. Son umbrales generales, no una función validada para la cebada mexicana.

**P:** ¿Qué dice la literatura sobre el calor y la senescencia del trigo?
**R:** Lobell, Sibley y Ortiz-Monasterio (2012) reportan que temperaturas por encima de 34 °C aceleran el envejecimiento del trigo en el norte de la India, y que los modelos de cultivo subestiman este efecto.

**P:** ¿Qué garantía da la predicción conformal para un intervalo?
**R:** Una cobertura marginal, en promedio, igual al nivel nominal (por ejemplo 90 %), si los datos son intercambiables. No es una garantía condicional por región o parcela, y puede fallar con datos espaciales o temporales dependientes.

**P:** ¿La validación cruzada simple da intervalos fiables para el error del modelo?
**R:** No necesariamente. Bates, Hastie y Tibshirani (2024) muestran que los intervalos estándar basados en CV pueden cubrir muy por debajo del nivel deseado, y que la CV anidada da cobertura aproximadamente correcta en muchos de sus ejemplos.

**P:** ¿Cuál es la base de TIMESAT para calcular la amplitud?
**R:** Según el manual de TIMESAT 3.1, la base es el promedio del mínimo izquierdo y el mínimo derecho de la curva ajustada, y la amplitud es el máximo de la temporada menos esa base. El proyecto usa como línea base el mínimo de la curva suavizada antes del pico, así que sus cifras no son comparables con las de TIMESAT
sin declararlo.

**P:** ¿A qué temperatura de la planta se daña la cebada después de que emerge la espiga?
**R:** Frederiks et al. (2015) reportan daño hacia −4 a −5 °C de aire en el dosel y floretes dañados comúnmente cerca de −6.5 °C de temperatura de la planta. En un estudio del norte de Australia, el daño fue severo por debajo de −8 °C de mínima de la planta. Son umbrales de otras regiones, no validados para Hidalgo.

**P:** ¿El calor durante el llenado del grano afecta la calidad maltera de la cebada?
**R:** Sí, según estudios de campo y de cámaras de calor. Savin et al. (1996) reportan que calor corto en el llenado redujo el peso del grano (14 % en Schooner y 25 % en Parwan) y bajó la calidad de malta. Wallwork et al. (1998) reportan cambios en la estructura del grano con hasta 35 °C durante 5 días.
