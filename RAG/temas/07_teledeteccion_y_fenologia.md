---
id: rag-07-teledeteccion
titulo: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
categoria: teledeteccion
etiquetas: [teledeteccion, sentinel-2, fenologia satelital, ndvi, red-edge, resolucion espacial, nubosidad, curvas sigmoides, cebada, cobertura de espiga, ventana critica, calibracion entre sensores]
idioma: es
fecha: 2026-10-18
fuentes_internas: [literature_review__report__chapters__02_observacion.typ.txt, literature_review__report__chapters__03_representaciones.typ.txt, literature_review__reports__Panicle_coverage_and_barley_yield.md, literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md,
modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md, dynamic_change__phenocurve__docs__A1_series.md, dynamic_change__phenocurve__docs__A2_rededge.md, dynamic_change__phenocurve__docs__F1_fits.md, reto_y_datos/Diccionario_de_indices_satelitales.txt]
fuentes_externas: [Bak et al. (2025). Deep learning-based semantic segmentation for rice yield estimation by analyzing the dynamic change of panicle coverage. Frontiers in Plant Science 16, doi 10.3389/fpls.2025.1611653 (verificado; arroz, no cebada); Lobell, D.B., Sibley, A., Ortiz-Monasterio, J.I. (2012). Extreme
heat effects on wheat senescence in India. Nature Climate Change 2:186-189, doi 10.1038/nclimate1356 (verificado); Gómez Mercado, R. et al. (2009). Estimación del rendimiento de cebada (Hordeum vulgare L.) maltera con el método FAO. Agricultura Técnica en México 35(1):13-23,
https://www.scielo.org.mx/pdf/agritm/v35n1/v35n1a2.pdf (verificado; corregida la revista, no es Agrociencia); Skakun, S. et al. (2019). Winter Wheat Yield Assessment from Landsat 8 and Sentinel-2 Data: Incorporating Surface Reflectance, Through Phenological Fitting, into Regression Yield Models. Remote Sensing
11(15):1768, doi 10.3390/rs11151768 (verificado; trigo de invierno); Anderegg, J. et al. (2020). Spectral Vegetation Indices to Track Senescence Dynamics in Diverse Wheat Germplasm. Frontiers in Plant Science 10:1749, doi 10.3389/fpls.2019.01749 (verificado); Hassan, M.A. et al. (2018). Time-Series Multispectral
Indices from Unmanned Aerial Vehicle Imagery Reveal Senescence Rate in Bread Wheat. Remote Sensing 10(6):809, doi 10.3390/rs10060809 (verificado; orden de autores no confirmado); Gitelson, A.A., Gritz, Y., Merzlyak, M.N. (2003). Relationships between leaf chlorophyll content and spectral reflectance and algorithms for
non-destructive chlorophyll assessment in higher plant leaves. Journal of Plant Physiology 160:271-282 (verificado en datos bibliográficos; fórmula de CIre confirmada en fuente secundaria); Clevers, J.G.P.W., Gitelson, A.A. (2013). Remote estimation of crop and grass chlorophyll and nitrogen content using red-edge
bands on Sentinel-2 and -3. International Journal of Applied Earth Observation and Geoinformation 23:344-351 (verificado en resumen); Dash, J., Curran, P.J. (2004). The MERIS terrestrial chlorophyll index. International Journal of Remote Sensing 25(23):5403-5413, doi 10.1080/0143116042000274015 (verificado); Eilers,
P.H.C. (2003). A perfect smoother. Analytical Chemistry 75(14):3631-3636, doi 10.1021/ac034173t (verificado); Savitzky, A., Golay, M.J.E. (1964). Smoothing and differentiation of data by simplified least squares procedures. Analytical Chemistry 36(8):1627-1639 (verificado); Chen, J., Jönsson, P., Tamura, M., Gu, Z.,
Matsushita, B., Eklundh, L. (2004). A simple method for reconstructing a high-quality NDVI time-series data set based on the Savitzky-Golay filter. Remote Sensing of Environment 91(3-4):332-344, doi 10.1016/j.rse.2004.03.014 (verificado); Huete, A., Didan, K., Miura, T., Rodriguez, E.P., Gao, X., Ferreira, L.G. (2002).
Overview of the radiometric and biophysical performance of the MODIS vegetation indices. Remote Sensing of Environment 83(1-2):195-213, doi 10.1016/S0034-4257(02)00096-2 (verificado en resumen); Qi, J., Chehbouni, A., Huete, A.R., Kerr, Y.H., Sorooshian, S. (1994). A modified soil adjusted vegetation index. Remote
Sensing of Environment 48(2):119-126, doi 10.1016/0034-4257(94)90134-1 (verificado); Merzlyak, M.N., Gitelson, A.A., Chivkunova, O.B., Rakitin, V.Yu. (1999). Non-destructive optical detection of pigment changes during leaf senescence and fruit ripening. Physiologia Plantarum 106(1):135-141, doi
10.1034/j.1399-3054.1999.106119.x (verificado en fuente secundaria); van Deventer, A.P. et al. (1997), Using Thematic Mapper Data to Identify Contrasting Soil Plains and Tillage Practices, Photogrammetric Engineering & Remote Sensing (resumen verificado; volumen y páginas no verificados); Gao, B.-C. (1996). NDWI: A
normalized difference water index for remote sensing of vegetation liquid water from space. Remote Sensing of Environment 58(3):257-266 (artículo y definición verificados; volumen y páginas no verificados); ESA SNAP, especificación del algoritmo MTCI,
https://step.esa.int/main/wp-content/help/versions/10.0.0/snap-toolboxes/eu.esa.opt.opttbx.radiometric.indices.ui/mtci/MtciAlgorithmSpecification.html; ESA EOPF, especificación MSI L2A, https://s2.pages.eopf.copernicus.eu/pdfs-adfs/MSI/L2/PDFS_S2_MSI_L2.myst.html; NASA HLS, descripción del producto S30,
https://hls.gsfc.nasa.gov/products-description/s30; LP DAAC, HLS User Guide V2 (solo portada consultada), https://lpdaac.usgs.gov/documents/1698/HLS_User_Guide_V2.pdf; NASA, PlanetSuperDove geometric assessment (2024),
https://www.earthdata.nasa.gov/s3fs-public/2024-05/NASA-PlanetSuperDoveGeometricAssessment-04092024%20Report.pdf; USGS, Mapping crop residue and tillage intensity using WorldView-3 SWIR residue indices, https://pubs.usgs.gov/publication/70201200; Terra Latinoamericana, definición de CIre B8/B5-1,
https://www.scielo.org.mx/pdf/tl/v39/2395-8030-tl-39-e899.pdf (leído en resultados de búsqueda); Redalyc, índices radiométricos con Sentinel-2, https://www.redalyc.org/journal/6139/613966750004/html/ (leído en resultados de búsqueda); Revista de Teledetección de la AET,
https://aet.org.es/publicaciones/revista-de-teledeteccion/ (descripción general); Huete, A.R. (1988). A soil-adjusted vegetation index (SAVI). Remote Sensing of Environment 25(3):295-309, doi 10.1016/0034-4257(88)90106-X (registro verificado); Blum, A. (1985). Photosynthesis and transpiration in leaves and ears of
wheat and barley varieties. Journal of Experimental Botany 36(3):432-440, doi 10.1093/jxb/36.3.432 (resumen verificado); Chauhan, S., Darvishzadeh, R., Lu, Y., Boschetti, M., Nelson, A. (2020). Understanding wheat lodging using multi-temporal Sentinel-1 and Sentinel-2 data. Remote Sensing of Environment 243:111804, doi
10.1016/j.rse.2020.111804 (resumen verificado; cifras de exactitud no verificadas); Quantifying Hail Damage in Crops Using Sentinel-2 Imagery. Remote Sensing 14(4):951, doi 10.3390/rs14040951 (resumen verificado); Gabbrielli, Corti, Perfetto, Fassa (2022). Satellite-Based Frost Damage Detection in Support of Winter
Cover Crops Management. Agronomy 12(9):2025, doi 10.3390/agronomy12092025 (resumen); Ursu, Istrate, Jitariu, Lazăr (2025). Hail Damage Detection: Integrating Sentinel-2 Images with Weather Radar Hail Kinetic Energy. Remote Sensing 17(23):3850, doi 10.3390/rs17233850 (resumen); Harfenmeister, Itzerott, Weltzien,
Spengler (2021). Detecting Phenological Development of Winter Wheat and Winter Barley Using Time Series of Sentinel-1 and Sentinel-2. Remote Sensing 13(24):5036, doi 10.3390/rs13245036 (resumen); Jha, Brinkhoff, Robson, Dunn (2026). Rice Flowering Date Retrieval from Sentinel-2 and Planet Fusion Imagery. Journal of the
Indian Society of Remote Sensing 54:4297-4310, doi 10.1007/s12524-026-02557-0 (resumen); Shang, Liu, Poncos, Geng (2020). Detection of Crop Seeding and Harvest through Analysis of Time-Series Sentinel-1 Interferometric SAR Data. Remote Sensing 12(10):1551, doi 10.3390/rs12101551 (resumen); Colonna, Genzano, Ciancia,
Filizzola (2024). A Method to Determine the Optimal Period for Field-Scale Yield Prediction Using Sentinel-2 Vegetation Indices. Land 13(11):1818, doi 10.3390/land13111818 (resumen); Li, Chimimba, Kambombe, Brown (2022). Maize Yield Estimation in Intercropped Smallholder Fields Using Satellite Data in Southern Malawi.
Remote Sensing 14(10):2458, doi 10.3390/rs14102458 (resumen); Kpienbaareh, Mohammed, Luginaah, Wang (2022). Estimating Groundnut Yield in Smallholder Agriculture Systems Using PlanetScope Data. Land 11(10):1752, doi 10.3390/land11101752 (resumen); Burke, M., Lobell, D.B. (2017). Satellite-based assessment of yield
variation and its determinants in smallholder African systems. PNAS 114(9):2189-2194, doi 10.1073/pnas.1616919114 (resumen); Ashourloo, Nematollahi, Huete, Aghighi (2022). A new phenology-based method for mapping wheat and barley using time-series of Sentinel-2 images. Remote Sensing of Environment 280:113206, doi
10.1016/j.rse.2022.113206 (registro); Demirpolat, Leloglu (2018). Barley yield estimation with Sentinel-2 vegetation indices. SIU, doi 10.1109/siu.2018.8404242 (registro); Martínez-Casasnovas, Uribeetxebarría, Escolà (2019). Sentinel-2 vegetation indices and apparent electrical conductivity to predict barley yield.
Precision agriculture '19, doi 10.3920/978-90-8686-888-9_38 (registro); D'Argaignon, Lopez-Lozano, Jay, Ausset (2026). High-throughput phenotyping of wheat ear surface area and ear density in the field. Plant Phenomics 8:100199, doi 10.1016/j.plaphe.2026.100199 (resumen verificado); Fernandez-Gallego, Kefauver,
Gutiérrez, Nieto-Taladriz et al. (2018). Wheat ear counting in-field conditions: high throughput and low-cost approach using RGB images. Plant Methods 14, doi 10.1186/s13007-018-0289-4 (resumen verificado); Tseng, Cartuyvels, Zvonkov, Purohit, Rolnick, Kerner (2023). Lightweight, Pre-trained Transformers for Remote
Sensing Timeseries (Presto), arXiv:2304.14065 (artículo leído: tablas 5, 6 y 8); arXiv:2605.10029 (estudio que usa AlphaEarth, resumen verificado); EGU24, Sub-field detection of cereal yield losses and its causes using Sentinel-2 time series and weather data, doi 10.5194/egusphere-egu24-10831 (resumen de congreso
verificado); Zamora Díaz, M. et al. (2008), Adabella: variedad de cebada maltera para Valles Altos de la Mesa Central de México, Agricultura Técnica en México 34(4):491-493 (ficha leída en PDF; verificado); Solano Hernández, S. et al. (2009), Alina, nueva variedad de cebada maltera para riego en el Bajío, Agricultura
Técnica en México 35(4):467-469 (ficha leída; verificado); Vavlas, S. et al. (2020), Deriving Wheat Crop Productivity Indicators Using Sentinel-1 Time Series, Remote Sensing 12(15):2385, doi 10.3390/rs12152385 (resumen de búsqueda; trigo); Iranzo, Montorio, García-Martín (2022), Revista de Teledetección 59:59-70, doi
10.4995/raet.2022.15099 (resumen de búsqueda); Franch, B. et al. (2026), doi 10.1016/j.jag.2026.105140 (página leída; sin cifras de error); Zhao, Y. et al. (2025), Characterizing wheat and barley growth and phenology using multi-spectral remote sensing for site-specific precision agriculture, in silico Plants 7(2)
(página leída); Dvorakova, K. et al. (2022/2023), Improving soil organic carbon predictions from a Sentinel-2 soil composite, Geoderma 429:116128 (página leída); Cano-Mejía, B. et al. (2023), Estimación de cosecha de maíz forrajero con índices de LANDSAT-8 y SENTINEL-2, Terra Latinoamericana 41:e1696, doi
10.28940/terra.v41i0.1696 (leído en PDF); Lasko, K. (2022), Gap filling cloudy Sentinel-2 NDVI and NDWI pixels..., Remote Sensing 14(17):4221, doi 10.3390/rs14174221 (leído en PDF); Weiss, M., Baret, F. (2016), algoritmo SL2P / S2ToolBox ATBD (citado en resumen de búsqueda; no leído); Kganyago et al. (2020) (resumen de
búsqueda); European Journal of Remote Sensing (2021), https://doaj.org/article/ddb92b0737294a00a2812f7f5159bd8c (resumen); NASA, Landsat 6, https://science.nasa.gov/mission/landsat-6 (verificado); Qi et al. (1994), fórmula de MSAVI en IndexDatabase, https://www.indexdatabase.de/db/i-single.php?id=44 (fórmula
transcrita; divisor no confirmado)]
---

## Resumen

Este fragmento agrupa la teledetección del proyecto AgroCebada: sensores disponibles y su resolución frente al tamaño de las parcelas, nubosidad, índices de vegetación, fenología satelital, cobertura de espiga y calibración entre sensores. Las parcelas de referencia son 197 parcelas de temporal en Hidalgo, Puebla y
Tlaxcala, a 2,500–2,900 m. Separa tres tipos de afirmaciones: hechos de la literatura, resultados de nuestros experimentos y recomendaciones o hipótesis. Nuestros experimentos de fenología describen la forma de la curva, pero no contienen correlaciones con rendimiento, porque sus pipelines no leyeron etiquetas de
rendimiento. Ese punto es clave para no atribuirles resultados que no tienen.

## Sentinel-2 y sus resoluciones nativas

Sentinel-2 Nivel 2A armonizado ofrece bandas visibles, infrarrojo cercano (NIR), red-edge (borde rojo) y SWIR. Las bandas visibles y NIR de uso frecuente (B2, B3, B4 y B8) tienen 10 m de resolución nativa. Las bandas red-edge (B05, B06, B07, B8A) y SWIR (B11, B12) se distribuyen a 20 m, y B1, B9 y B10 a 60 m
(verificado en la documentación ESA EOPF y en NASA Earthdata). En el proyecto, las bandas de 20 m se remuestrearon a 10 m por vecino más cercano, de modo que las parcelas pequeñas tienen pocas muestras red-edge independientes. El conteo n_clear_px cuenta celdas de 10 m, no observaciones independientes. Las
observaciones se filtran por nubes antes de calcular cualquier índice, y la fecha de captura debe conservarse junto a cada valor para reconstruir la serie.

Fuente: literature_review__report__chapters__02_observacion.typ.txt; dynamic_change__phenocurve__docs__A2_rededge.md; ESA EOPF, especificación MSI L2A, https://s2.pages.eopf.copernicus.eu/pdfs-adfs/MSI/L2/PDFS_S2_MSI_L2.myst.html

## HLS y Landsat: 30 m y sin red-edge en L30

HLS (Harmonized Landsat Sentinel) entrega observaciones a 30 m. En la versión 2.0, su componente L30 (HLSL30) proviene de Landsat 8 y Landsat 9 (OLI y OLI-2) y no tiene bandas red-edge; sólo el componente S30 (HLSS30, derivado de Sentinel-2A/B; la lista de v2.0 incluye también 2C) las tiene, con la respuesta espectral
original de MSI. Por eso un análisis red-edge con HLS debe apoyarse en las observaciones S30 o en Sentinel-2 nativo a 10–20 m (verificado: NASA, descripción del producto S30; LP DAAC, guía de usuario v2, sólo portada consultada). Landsat 6 no alcanzó órbita y no aporta observaciones operativas, aunque aparecía en notas
informales del repositorio (verificado: NASA indica que Landsat 6 «failed to achieve orbit» el 5 de octubre de 1993). Para nuestros datos, la serie Landsat usada en la tabla de calidad tiene una mediana de 15 observaciones válidas por parcela (rango 7–30) entre abril y octubre de 2025, y una brecha máxima mediana de 40
días.

Fuente: literature_review__report__chapters__02_observacion.typ.txt; modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md; dynamic_change__phenocurve__docs__A1_series.md; NASA HLS, https://hls.gsfc.nasa.gov/products-description/s30

## PlanetScope: 3 m y ausencia de SWIR

PlanetScope (constelación SuperDove, 8 bandas) ofrece aproximadamente 3 m de resolución en los productos ortorrectificados remuestreados; el tamaño de píxel nadir nativo se reporta como 3.7 m, y algunos artículos citan 4 m (verificado en fuentes de Planet/ESA y en un informe de la NASA de 2024; las cifras difieren
según el producto). Sus 8 bandas incluyen costera, azul, verde I, verde, amarillo, rojo, borde rojo (centro cercano a 705 nm) e infrarrojo cercano; no tiene bandas SWIR, por lo que no sirve para índices de humedad o residuos que dependen de SWIR (NDMI en su versión SWIR, NDTI, CRC). En nuestro conjunto PRO deriva de
Planet, con NDVI, EVI, LAI y MSAVI. Su acceso comercial depende de licencias (NICFI, por ejemplo) y la cobertura para el centro de México en 2025–2026 no está verificada en las fuentes. Entre abril y octubre de 2025 la mediana de observaciones válidas por parcela es de 79 para Planet, frente a 31 para Sentinel-2. En
junio Planet tiene una mediana de 5 observaciones válidas por parcela, frente a 2 de Sentinel-2, y su brecha máxima mediana es de 20 días.

Fuente: literature_review__report__chapters__02_observacion.typ.txt; dynamic_change__phenocurve__docs__A1_series.md; literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; NASA, PlanetSuperDove geometric assessment (2024),
https://www.earthdata.nasa.gov/s3fs-public/2024-05/NASA-PlanetSuperDoveGeometricAssessment-04092024%20Report.pdf

## Resolución frente al tamaño de la parcela

La pregunta práctica es cuántos píxeles puros caben dentro de una parcela. Para una parcela cuadrada de 1 ha (100 m × 100 m), con un píxel de margen hacia adentro para proteger de la mezcla de bordes, el cálculo es el siguiente. Con HLS de 30 m quedan 1–4 píxeles puros. Con Sentinel-2 de 10 m quedan 49–64. Con
PlanetScope de 3 m quedan más de 800. Esta aritmética es un cálculo propio, no un resultado publicado. La parcela más pequeña del conjunto (0.35 ha) contiene unos cuatro píxeles de 30 m, todos mezclados con bordes de campo. Un promedio HLS de parcelas pequeñas de temporal está dominado por píxeles de borde.

Fuente: modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md; literature_review__reports__Panicle_coverage_and_barley_yield.md (cálculo propio con el margen de un píxel)

## Cuándo sirve Landsat térmico (LST) y cuándo no

La temperatura de superficie de Landsat (banda ST_B10, 100 m nativos remuestreados a 30 m) sólo resuelve campos de unas 3–4 ha o más (al menos cuatro píxeles puros). Esta cifra de remuestreo se atribuyó a la documentación de Landsat Colección 2; la página de productos de USGS consultada en la ronda 4 no la menciona
(SIN EVIDENCIA). ECOSTRESS ofrece 70 m, pero en Google Earth Engine
sólo tiene tiles del área de Los Ángeles; para México se debe pedir por AppEEARS o earthaccess (no verificado en esta ronda). MODIS LST, a 1 km, sirve para horas de helada regionales, no para contrastes entre parcelas. La variable más defendible es una diferencia ΔT entre la parcela y la mediana del municipio, en la
misma escena, durante el espigamiento y el llenado de grano. Esta es una recomendación de la fuente, no un resultado del proyecto.

Fuente: modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md

## Nubosidad y filtrado de calidad (QA)

En el proyecto, una observación falla la calidad si cloud_pct > 20 % (o si falta), si el valor es imposible según sus límites (NDVI, EVI, etc. en [-1, 1]; LAI en [-1.5, 10]), si la media cae fuera de [vmin, vmax] por más de 0.002, si la desviación estándar dentro de la parcela es un valor atípico para el nivel de
dosel, o si es un pico detectado con un filtro Hampel. Entre abril y octubre de 2025, pasan la calidad 81.5 % de las filas Landsat, 83.3 % de Planet y 80.9 % de Sentinel-2. Los picos aparecen en 2–5 % de las filas de dosel. En los índices de residuo y SWIR (CRC, DSWI, NDSVI, SRNDI) los picos son dos veces más
frecuentes tras lluvia; en ese caso no son errores de sensor, sino transitorios reales de humedad superficial.

Fuente: dynamic_change__phenocurve__docs__A1_series.md

## Huecos temporales: lo que importa para la fenología

Con el filtro de calidad, la mediana de observaciones válidas en abril–octubre de 2025 es de 31 por parcela para Sentinel-2 (rango 23–40), 79 para Planet (55–93) y 90 para la unión Sentinel-2 + Planet. La brecha máxima mediana entre observaciones consecutivas es de 25 días para Sentinel-2, 20 días para Planet y 18 días
para la unión. Entre 1 de septiembre y 31 de octubre, la mediana de fechas claras es de 7 para Sentinel-2 y de 16 para Planet. El hueco principal se encuentra en junio, en plena temporada de lluvias: la mediana de observaciones Sentinel-2 válidas en junio es de 2, y en algunas parcelas no hay ninguna observación clara
en ese mes. Este hueco cae durante el verdeo, no durante el llenado de grano.

Fuente: dynamic_change__phenocurve__docs__A1_series.md; dynamic_change__phenocurve__docs__A2_rededge.md

## Diccionario de índices del reto: qué representa cada uno

El diccionario del reto describe índices de Sentinel-2 y Landsat en el conjunto Básico, y de Planet en el conjunto PRO. Cada observación trae promedio, desviación estándar (std, variabilidad dentro de la parcela), máximo y mínimo; el porcentaje de nubosidad es una variable de calidad. El Básico incluye NDVI, EVI, CRC,
MCRC, NDSVI, SRNDI, MRA, LAI, FAPAR, SAVI, NDTI, STI, NDWI, ENDWI, MSI, EMSI, DSWI2–5, NDDI, ENDDI y VI6T (de Landsat, espectral-térmico). El PRO incluye NDVI, EVI, LAI y MSAVI. El diccionario advierte que no hay umbrales universales y que los nombres de índices se conservan como vienen en los archivos del proveedor.
Los valores de Planet y de Sentinel-2 que comparten nombre no deben fusionarse automáticamente.

Fuente: reto_y_datos/Diccionario_de_indices_satelitales.txt

## NDVI: qué mide y por qué satura

El NDVI (índice de vegetación de diferencia normalizada) mide presencia y vigor de vegetación verde a partir del contraste entre NIR y rojo. Es el índice más usado para fenología, pero en dosel cerrado satura: un aumento de biomasa ya no se refleja en el valor. Huete et al. (2002) mostraron con MODIS que el NDVI se
estabiliza asintóticamente en regiones de biomasa alta (como la Amazonia), mientras el EVI sigue siendo sensible a la variación del dosel (verificado en resumen). En nuestra serie de Sentinel-2, el pico suavizado de NDVI varía entre parcelas sólo de 0.69 a 0.84 (percentiles 10 y 90). Además, en trigo el NDVI empieza a
bajar al inicio del llenado de grano aunque la inspección visual del verdor no cambie. Por eso una caída de NDVI no siempre es pérdida de verdor, y un pico alto puede esconder diferencias de biomasa.

Fuente: literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; literature_review__reports__Panicle_coverage_and_barley_yield.md; Huete et al. (2002), doi 10.1016/S0034-4257(02)00096-2

## EVI, SAVI y MSAVI: corrección por suelo y atmósfera

EVI (índice de vegetación mejorado) reduce parte de la influencia del suelo y de efectos atmosféricos (Huete et al. 2002; verificado en el resumen de MODIS). SAVI introdujo un factor de ajuste de suelo en el denominador del NDVI (Huete, 1988, Remote Sensing of Environment 25(3):295-309, doi
10.1016/0034-4257(88)90106-X; registro verificado). MSAVI, de Qi et al. (1994), sustituye el factor constante de SAVI por una función variable que se deriva del propio NDVI; en la práctica, muchos programas usan MSAVI2, una versión inductiva sin constante L (la ecuación del artículo original se localizó en
IndexDatabase como 2·NIR + 1 − √((2·NIR + 1)² − 8·(NIR − RED)), citando a Qi et al. 1994; el divisor 1/2 de la forma estándar no apareció en la extracción).
Estos índices son útiles en dosel abierto, como las etapas tempranas de la cebada de temporal, cuando el suelo desnudo pesa en la señal. En nuestros datos, EVI de Sentinel-2 tiene r = 0.997 con el EVI oficial, pero el EVI propio es 0.016 más bajo en promedio. MSAVI de Planet y SAVI de Sentinel-2 tienen r = 0.985. Estos
índices no son intercambiables entre fuentes sin armonizar, aunque ordenen las parcelas de forma similar.

Fuente: dynamic_change__phenocurve__docs__A2_rededge.md; dynamic_change__phenocurve__docs__A1_series.md; reto_y_datos/Diccionario_de_indices_satelitales.txt; Huete et al. (2002), doi 10.1016/S0034-4257(02)00096-2; Qi et al. (1994), doi 10.1016/0034-4257(94)90134-1

## LAI y fAPAR: variables biofísicas

LAI (índice de área foliar) es la superficie foliar por unidad de superficie de terreno. fAPAR es la fracción de radiación fotosintéticamente activa absorbida por la vegetación. Ambas son variables biofísicas que dependen de un modelo de transferencia radiativa, a diferencia de los índices (definición estándar; SIN
EVIDENCIA en línea en la ronda 4). En Sentinel-2, el procesador biofísico de SNAP (algoritmo SL2P, Weiss y Baret 2016) estima ambas variables; su validación en cultivos se resume en el fragmento de LAI y fAPAR de la sección de expansión. Sus valores varían según el proveedor. En nuestros datos, Planet LAI es mayor que
Sentinel-2 LAI por +1.12 en promedio, con r = 0.929. Esto no es un error de medición aislado, sino un desacuerdo de calibración: la regresión de Planet frente a Sentinel-2 es 0.857 + 1.838 ×
S2. Por eso LAI de Planet y de Sentinel-2 no deben combinarse sin armonizar.

Fuente: dynamic_change__phenocurve__docs__A1_series.md; dynamic_change__phenocurve__docs__F1_fits.md

## Índices de red-edge: CIre, MTCI, NDRE

Los índices de borde rojo usan las bandas 705, 740 y 783 nm de Sentinel-2 (B05, B06, B07). El CIre (índice de clorofila de borde rojo) se define como B07/B05 − 1, la forma de Gitelson et al. (2003) aplicada a Sentinel-2 (fórmula confirmada en una fuente secundaria; el artículo de 2003 se confirmó en sus datos
bibliográficos). Clevers y Gitelson (2013) reportaron el CIre, el CIgreen y el MTCI como estimadores lineales y precisos de clorofila y nitrógeno del dosel en cultivos y pastos con bandas red-edge de Sentinel-2 y -3 (verificado en resumen). El MTCI (índice de clorofila de terreno del MERIS) usa B06, B05 y B04, es decir
(B6 − B5)/(B5 − B4) con los centros de 740, 705 y 665 nm; la forma MERIS (R754, R709, R681) es de Dash y Curran (2004) (verificado en la especificación ESA SNAP). Estos índices tienen menos saturación que el NDVI a dosel alto. En el ajuste de nuestros datos, CIre llegó a 2.5 en octubre en la parcela AGC_175, mientras
su NDVI era de unos 0.8. Este comportamiento sugiere que CIre conserva información en dosel alto, aunque no hay evidencia de su relación con el rendimiento en el corpus.

Fuente: dynamic_change__phenocurve__docs__A2_rededge.md; literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; Gitelson et al. (2003), J. Plant Physiol. 160:271-282; Clevers y Gitelson (2013), Int. J. Appl. Earth Obs. Geoinf. 23:344-351; Dash y Curran (2004), Int. J. Remote
Sens. 25(23):5403-5413, doi 10.1080/0143116042000274015

## PSRI y la señal de senescencia

PSRI (índice de reflectancia de senescencia de plantas) sube cuando la clorofila disminuye y el dosel envejece. La definición original de Merzlyak et al. (1999) es (R680 − R500)/R750. El corpus usa la aproximación con bandas de Sentinel-2, (B04 − B02)/B06; B6 está centrada en 740 nm, no en 750 nm, así que es una
equivalencia aproximada. El software SNAP documenta otro cálculo, PSRI = (R − B)/RE2, que no debe mezclarse con el de Merzlyak. En Anderegg et al. (2020), el PSRI siguió la senescencia visual mejor que otros índices evaluados en más de 300 variedades de trigo (verificado). En nuestros datos, PSRI es alto sobre suelo
desnudo (cerca de 0.3 de enero a mayo) y cae a unos 0.05 con el dosel cerrado. Sólo sube de nuevo en la senescencia (en AGC_023, desde finales de septiembre). Por tanto, PSRI sólo se debe leer en el tramo posterior al pico, no antes del cierre del dosel.

Fuente: dynamic_change__phenocurve__docs__A2_rededge.md; literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; Merzlyak et al. (1999), Physiologia Plantarum 106(1):135-141, doi 10.1034/j.1399-3054.1999.106119.x

## NDMI, NDTI, MSI, NDSVI y SRNDI: humedad, residuos y labranza

Estos índices responden sobre todo a humedad del tejido, residuos o suelo expuesto, no a la biomasa verde. NDMI y MSI son sensibles al contenido de agua de la vegetación. NDTI, CRC, NDSVI y SRNDI caracterizan residuos y labranza con bandas SWIR. Sobre el origen de NDMI: Gao (1996) definió un índice NIR–SWIR (0.86 y
1.24 µm) para el agua líquida de la vegetación, que suele llamarse NDMI o «NDWI de Gao»; la atribución a Hunt y Rock (1989) no se confirmó en esta ronda. En nuestro ajuste, MSI y SRNDI tienen signo negativo respecto al NDVI, y NDSVI sube con el dosel (correlación +0.74), contrario a lo que suponía el texto de la tarea.
SRNDI tiene el ajuste más pobre: R² mediana de 0.626 con una curva doble logística. Estos índices sirven como covariables de humedad y residuo, no como sustitutos del verdor.

Fuente: dynamic_change__phenocurve__docs__F1_fits.md; dynamic_change__phenocurve__docs__A1_series.md; reto_y_datos/Diccionario_de_indices_satelitales.txt; Gao (1996), Remote Sensing of Environment 58(3):257-266

## Los índices oficiales no son la reflectancia cruda

Los valores oficiales de Sentinel-2 del reto (ndvi_promedio) y nuestra reflectancia cruda tienen r = 0.988 en todas las parejas, y r = 0.9952 en las limpias (nubosidad oficial 0, cobertura clara de al menos 80 %). Pero la relación es multiplicativa: la pendiente de nuestro NDVI sobre el oficial es 1.118 y el sesgo
crece con el dosel (+0.014 en NDVI ≤ 0.2; +0.097 en NDVI > 0.8). Un modelo aditivo con c = 0.0204 de reflectancia (unos 200 DN) reduce el error absoluto medio de 0.028 a 0.012. La causa más probable es un producto radiométrico diferente, aunque no está documentada. Consecuencia práctica: dentro de una misma fuente las
series se pueden comparar en el tiempo, pero no se deben mezclar niveles oficiales y crudos sin armonizar.

Fuente: dynamic_change__phenocurve__docs__A2_rededge.md

## Calibración entre sensores: Planet y Sentinel-2

En las mismas fechas de abril–octubre de 2025, NDVI de Planet frente a NDVI de Sentinel-2 tiene r = 0.991 (n = 3,819 parejas en 197 parcelas), con diferencia media de +0.075 y RMSD de 0.080; la regresión es 0.063 + 1.035 × S2. La diferencia es casi constante en niveles de dosel (+0.067 a +0.085). EVI tiene r = 0.987 y
diferencia de −0.015. Para LAI la diferencia es grande y no constante (+1.12). Esto indica que la armonización es por índice y no un único ajuste global. El diccionario del reto recomienda conservar la identidad del sensor en todo el análisis.

Fuente: dynamic_change__phenocurve__docs__A1_series.md; reto_y_datos/Diccionario_de_indices_satelitales.txt

## Fenología satelital: las fechas que se pueden extraer

Con una serie de un índice verde se pueden extraer varias fechas: inicio de verdeo (green-up, cuando la señal cruza un porcentaje de la amplitud, por ejemplo 50 %), fecha del pico, fecha de inicio de la senescencia o del hombro (cuando la señal baja del 90 % del pico), y duración del plateau. En nuestro pipeline,
greenup50 se define como el último cruce ascendente del 50 % de la amplitud antes del pico. La fecha de emergencia no se estima directamente en las fuentes: greenup50 es la aproximación más cercana, y greenup50 no equivale a la siembra ni a la emergencia. El espigamiento tampoco se observa; el hombro o d1 marca un
evento del dosel, no una fecha de espigamiento confirmada.

Fuente: dynamic_change__phenocurve__docs__F1_fits.md; literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md

## Curvas sigmoides, doble logística y suavizado

El modelo piecewise de Bak et al. (2025) ajusta un crecimiento logístico K/(1 + e^(−g(x−d0))) hasta un día de transición d1, y después una caída cuadrática con curvatura a. En nuestro pipeline se usan dos familias: la de Bak (bak) y la doble logística (dlog), con parámetros t1, t2, g1 y g2. Como suavizado no
paramétrico se usa Whittaker con lambda = 100, de segundas diferencias (ventana de media potencia cercana a 20 días; la elección de lambda es del proyecto, no de la literatura). Eilers (2003) presentó este suavizador de mínimos cuadrados penalizados, rápido, con control continuo de la suavidad, interpolación automática
de huecos y validación cruzada dejando uno fuera (verificado). El filtro Savitzky–Golay (Savitzky y Golay, 1964) es otra opción clásica, y Chen et al. (2004) lo aplicaron de forma iterativa a series NDVI; en nuestros datos no se usa y el corpus no lo evalúa. Con Planet NDVI, la mediana de R² de la doble logística es
0.975 y la de la forma de Bak 0.973 (cutoff, eje calendario).

Fuente: dynamic_change__phenocurve__docs__F1_fits.md; literature_review__reports__Panicle_coverage_and_barley_yield.md; Eilers (2003), Analytical Chemistry 75(14):3631-3636, doi 10.1021/ac034173t; Chen et al. (2004), doi 10.1016/j.rse.2004.03.014

## Ajuste de curvas: calidad y convergencia en nuestros datos

Con Planet NDVI, el 98 % de los ajustes bak convergen desde los 16 arranques, y el mejor coste se obtiene en todos los arranques cercanos (12 de 16 arranques dentro de 1 % del coste mínimo). Hay límites que se alcanzan: en 19.3 % de los ajustes bak, d1 = d0 (la curva se detiene en el punto de inflexión), y en 4.6 % la
curvatura a es cero. En esos casos K se extrapola y su error estándar es 7.2 veces el de plateau_level (0.071 frente a 0.010). Por eso, la recomendación del propio pipeline es usar plateau_level y su tiempo, no K ni la curvatura. Esta lectura es un resultado propio sobre la identificabilidad del modelo.

Fuente: dynamic_change__phenocurve__docs__F1_fits.md

## Ventana crítica: llenado de grano y saturación

La cebada de temporal en el Altiplano se siembra de mayo a principios de julio, florece entre 48 y 72 días después de la siembra y madura entre 90 y 132 días después, según la ficha de la variedad Adabella para Valles Altos (INIFAP 2008; verificado: Zamora Díaz et al. 2008, Agricultura Técnica en México 34(4):491-493).
La fecha de siembra de mayo a principios de julio no se verificó (SIN EVIDENCIA). Los estudios de trigo indican que el llenado de grano y la senescencia son las
fases más informativas, pero sólo bajo estrés terminal (Hassan et al. 2018 y Anderegg et al. 2020, ver fragmentos de estrés). Un pico de NDVI alto no distingue entre parcelas con mucha biomasa y parcelas con mucho grano por metro cuadrado. Por eso el pico satura y la información útil se encuentra en su tiempo y en la
pendiente de la bajada. Ese tramo es el que el corte del 31 de octubre trunca en muchos casos.

Fuente: literature_review__reports__Panicle_coverage_and_barley_yield.md; modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md

## Corte al 31 de octubre: cuántas parcelas quedan truncadas

El corte del 31 de octubre de 2025 deja fuera gran parte de la senescencia. Con la forma de Bak sobre el HLS binario, 114 de 197 parcelas no habían perdido el 50 % de su amplitud de NDVI en esa fecha, y la mediana del cruce fue el 1 de noviembre. Ese dato (de la línea de análisis con máscara binaria) probablemente
sobrestima el retraso, porque el rastrojo y las malezas mantienen el NDVI tras la cosecha. Con Planet NDVI, en el ajuste de nuestro pipeline, 65.5 % de las parcelas perdieron menos del 50 % de la amplitud, el hombro no se alcanza en 5.1 % de las parcelas, y en modo retrospectivo (datos hasta el 31 de diciembre) la
pérdida de más del 50 % se observa en 99.5 %.

Fuente: literature_review__reports__Panicle_coverage_and_barley_yield.md; dynamic_change__phenocurve__docs__F1_fits.md

## Fenología de nuestros datos: fechas medianas y dispersión

Con Planet NDVI (corte al 31 de octubre de 2025), la mediana de greenup50 es el 6 de julio (p10 17 de junio, p90 15 de agosto), la mediana del pico es el 2 de septiembre (p10 27 de julio, p90 20 de septiembre) y la mediana del hombro al 90 % es el 18 de septiembre (p10 31 de agosto, p90 16 de octubre). El plateau dura
una mediana de 40 días. La pendiente temprana de caída tiene mediana −0.005 por día. Con el NDVI suavizado de Sentinel-2 en nuestro ajuste, el pico tiene mediana el 30 de agosto. En el análisis local de los datos del reto (suavizado del NDVI, no el HLS binario), el pico mediano del NDVI cae el 28 de agosto (p10 29 de
julio, p90 27 de septiembre). Estas diferencias entre métodos reflejan el suavizado y la fuente, no necesariamente la fenología real.

Fuente: dynamic_change__phenocurve__docs__F1_fits.md; literature_review__reports__Panicle_coverage_and_barley_yield.md

## Colapso del dosel a mitad de temporada (A2)

En 30 de 197 parcelas, el NDVI de Sentinel-2 cae 0.30 o más por debajo de un máximo previo de al menos 0.50 y después se recupera. El colapso empieza entre el 14 de julio y el 3 de agosto de 2025. Planet confirma la caída en 28 de las 30 parcelas (caída mediana de 0.30), frente a 6 de 114 parcelas de control (caída
mediana de 0). Por eso el dosel de junio y julio probablemente no es la cebada que se cosecha: puede ser maleza o un cultivo destruido y resembrado. Un ajuste desde abril mezcla los dos dosel. La solución en el pipeline es ajustar sólo desde el último mínimo (ventana final), lo que sube R² de 0.879 a 0.958 en 36
parcelas multi-dosel con Planet NDVI.

Fuente: dynamic_change__phenocurve__docs__A2_rededge.md; dynamic_change__phenocurve__docs__F1_fits.md

## Diferencias por municipio en los datos de fenología

Los 197 parcelas se reparten en 9 municipios: Chignahuapan (100), Calpulalpan (44), Singuilucan (23), Almoloya (14), Cuautepec de Hinojosa (9), Emiliano Zapata (3), Nanacamilpa de Mariano Arista (2), Tepeapulco (1) y Apan (1). Por estado: Puebla 100, Hidalgo 51 y Tlaxcala 46. El colapso a mitad de temporada se
concentra en Chignahuapan (23 de 100 parcelas) y en Calpulalpan (7 de 44). Las diferencias de rendimiento por municipio no están documentadas en las fuentes de fenología, que no leyeron etiquetas de rendimiento. Las comparaciones entre municipios sólo se pueden hacer sobre la señal satelital. Los grupos son muy
desiguales: Chignahuapan concentra casi la mitad de las parcelas, mientras Tepeapulco y Apan tienen una parcela cada uno. Cualquier promedio municipal de la señal debe reconocer ese desbalance y no tratar a los municipios con una parcela como estadísticamente comparables.

Fuente: dynamic_change__phenocurve__docs__A1_series.md; dynamic_change__phenocurve__docs__A2_rededge.md

## Cifras de correlación de nuestros experimentos de fenología

Nuestros experimentos de fenología (A1, A2 y F1) no reportan correlación con rendimiento: el pipeline declara que no abre etiquetas de rendimiento, y la tabla de A1 confirma que no hay columna de rendimiento. Lo que sí se midió es la coherencia interna de los parámetros. Entre parámetros del ajuste de Planet NDVI, el
plateau se relaciona con el pico suavizado (r = 0.952); K con plateau sólo r = 0.517; y d1 con la fecha del pico r = 0.632. En Sentinel-2 LAI, K se relaciona con la amplitud (r = 0.816) y con el plateau (r = 0.843). Cualquier cifra de correlación con rendimiento debe considerarse "no documentada" en este corpus.

Fuente: dynamic_change__phenocurve__docs__A1_series.md; dynamic_change__phenocurve__docs__F1_fits.md

## Cobertura de panícula y espiga: lo que funcionó en arroz

Bak et al. (2025) midieron la cobertura de panícula en fotos RGB de 1 m² de arroz (PC = área de panícula / área total). El conjunto de imágenes de rendimiento procede de 152 parcelas (20 de campo en 2023 y 132 en 2024, de ellas 80 de campo y 52 en suelo, según el artículo), con capturas cada 3–7 días. El parámetro K
(cobertura máxima de panícula) tuvo r = 0.87 con el rendimiento (p < 0.001), r = 0.85 con granos por m² y r = 0.70 con panículas por m² (verificado en el texto del artículo). El índice de cobertura resume número de panículas por tamaño, es decir, espiguillas por m², que explica la mayor parte del rendimiento del arroz
(atribución corregida: es una interpretación de la revisión interna del corpus; el artículo de Bak et al. no lo afirma en esos términos, SIN EVIDENCIA). Sin embargo, el resultado depende de un diseño con contrastes de nitrógeno, trasplante y cultivar, y su validación fue dentro de tratamientos. Estos resultados son de
la literatura de arroz y no se pueden trasladar directamente a la cebada.

Fuente: literature_review__reports__Panicle_coverage_and_barley_yield.md; Bak et al. (2025), Frontiers in Plant Science 16, doi 10.3389/fpls.2025.1611653

## Por qué los satélites no ven la espiga de cebada

Una espiga de cebada necesita píxeles de unos 0.3 mm para verse, lo que es cuatro a cinco órdenes de magnitud más fino que Sentinel-2, PlanetScope o HLS (cifra de la revisión interna; no verificada en esta ronda). Por eso ningún satélite mide la cobertura de espiga de forma directa. Lo que sí puede medirse es el dosel
construido hasta el espigamiento y la fecha en que empieza la senescencia. La espiga aporta asimilados (en cebada de seis hileras la superficie de espiga es 5.5 veces la de la hoja bandera, según Blum (1985, Journal of Experimental Botany 36(3):432-440, doi 10.1093/jxb/36.3.432; verificado en el resumen), pero su señal
se mezcla con la de hojas, y en la fase reproductiva la señal de espiga es de segundo orden frente al dosel. Recordatorio para el proyecto: las parcelas se reparten entre Doña Josefa (6 hileras) y Voyager (2 hileras), sin columna de variedad por parcela, así que una diferencia de superficie de espiga entre variedades
no puede separarse en el dataset.

Fuente: literature_review__reports__Panicle_coverage_and_barley_yield.md; literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md

## Cobertura de espiga en trigo y cebada: referencias de campo

En trigo de pan, un índice de área de espiga (EAI) medido con un robot de campo explicó 83 % de la variación del rendimiento (r² = 0.83) en 10 variedades comerciales y 12 ambientes (D'Argaignon et al. 2026, Plant Phenomics 8:100199; verificado en el resumen). El resumen no reporta el 59 % atribuido a la densidad de
espigas, que queda sin verificar (SIN EVIDENCIA en la ronda 4: el resumen no lo reporta y el texto completo no fue accesible). En un panel de 24 variedades de trigo duro en dos sitios de España, el conteo automático de espigas se correlacionó de forma significativa con el rendimiento, y mejor con imágenes tomadas en
antesis que en llenado tardío (Fernandez-Gallego et al. 2018, Plant Methods 14; verificado en
el resumen). El rango de R² de 0.05–0.30 no aparece en el resumen y queda no verificado. En Hidalgo, los ensayos INIFAP de 2006 con tres genotipos y tres sitios mostraron que la densidad de espigas varió sólo de 355 a 464 espigas/m² (unos 30 %), mientras la biomasa (5.9–11.7 t/ha) y el rendimiento (2.4–4.9 t/ha) casi
se duplicaron (fuente interna; SIN EVIDENCIA en la ronda 4: no se encontró el ensayo publicado). La conclusión práctica es que el dosel construido, no la espiga, es el sustituto medible desde el satélite. No hay estudio publicado que prediga el rendimiento de cebada a partir de densidad o cobertura de espigas en
imágenes (no encontrado en la revisión de esta ronda).

Fuente: literature_review__reports__Panicle_coverage_and_barley_yield.md; D'Argaignon et al. (2026), Plant Phenomics 8:100199, doi 10.1016/j.plaphe.2026.100199; Fernandez-Gallego et al. (2018), Plant Methods 14, doi 10.1186/s13007-018-0289-4; Blum (1985), J. Exp. Bot. 36(3):432-440, doi 10.1093/jxb/36.3.432

## Origen de la señal: reflectancia cruda frente a valores oficiales

Un punto de cuidado es el origen de la señal. Los valores de nuestros pipelines provienen de reflectancia cruda de Sentinel-2 L2A (escenas de 500 archivos, de los tiles 14QNG y 14QNH, con 250 fechas de enero a octubre de 2022–2025), mientras los valores oficiales del reto son otra fuente. Las escenas crudas terminan el
27 de octubre de 2025, así que el análisis de red-edge no tiene modo retrospectivo. Además, la línea de base del offset −0.1 cambia entre procesamientos (377 escenas cortas y 113 largas con línea base ≥ 04.00). Por eso las series de 2022 y 2025 pueden tener un cambio de nivel de unos 0.02–0.03 en NDVI. (El cambio de
offset de línea base de Sentinel-2 es un hecho del producto, pero la cifra de 0.02–0.03 es interna.)

Fuente: dynamic_change__phenocurve__docs__A2_rededge.md

## Meteorología: AgERA5, CHIRPS y ERA5-Land

Para el clima se usan varias fuentes con soportes distintos. AgERA5 (preferido en nuestros pipelines) da temperatura media diaria y precipitación por parcela, con datos hasta el 31 de octubre de 2025. Los grados-día de crecimiento (GDD0 con base 0 °C, GDD5 con base 5 °C) se acumulan desde el 1 de abril. CHIRPS tiene
malla de 0.05° y ERA5-Land de unos 9 km; ambos suelen cubrir varias parcelas. Un contraste débil entre campos cercanos puede deberse a esa resolución compartida, no a ausencia de influencia del ambiente. En nuestros datos, la precipitación de abril a octubre (AgERA5) tiene mediana de 652 mm en 2022, 515 mm en 2023, 983
mm en 2024 y 1,096 mm en 2025. El análisis de Panicle usa CHIRPS de mayo a octubre (mediana de 950 mm en 2025, frente a 484 mm en 2022 y 496 mm en 2023); las ventanas no son comparables directamente.

Fuente: dynamic_change__phenocurve__docs__A1_series.md; literature_review__report__chapters__02_observacion.typ.txt; literature_review__reports__Panicle_coverage_and_barley_yield.md

## Sentinel-1: VH/VV, coherencia y fusión con óptico

Los datos de radar Sentinel-1 (VV, VH, VH/VV y coherencia) aportan señal de estructura y humedad independiente de la óptica, útil cuando hay nubes. En un trabajo de 2026 sobre trigo y cebada con fusión de Sentinel-1 y Sentinel-2 (Franch et al. 2026, doi 10.1016/j.jag.2026.105140), los índices de fusión redujeron el
error frente a los modelos solo ópticos, pero la página consultada no da cifras en kg/ha ni menciona Valladolid; la cifra de unos 1,100 kg/ha con S1 o S2 solos y de 700 kg/ha con fusión no se verificó (SIN EVIDENCIA). Para la fecha de siembra y cosecha, un estudio de coherencia InSAR de Sentinel-1 en Ontario, Canadá
(2019) logró 85 % de exactitud con reglas físicas (Shang et al. 2020, Remote Sensing 12:1551; verificado en el resumen). El error absoluto medio de 6.5 días atribuido a Kazajistán no se encontró en esta ronda. En
Rothamsted (trigo de invierno, Harpenden, Reino Unido, temporadas 2017–2019; no es cebada), el día del pico VH/VV correlacionó negativamente con el rendimiento (r = −0.56), y la duración de la vegetación completa positivamente (r = 0.61) (Vavlas et al. 2020, Remote Sensing 12(15):2385, doi 10.3390/rs12152385; cifras
del resumen de búsqueda, texto completo no accesible). Ningún estudio publicado de rendimiento de cebada con S1 se encontró para el Altiplano
mexicano.

Fuente: modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md; Shang et al. (2020), Remote Sensing 12:1551, doi 10.3390/rs12101551; Chauhan et al. (2020), RSE 243:111804, doi 10.1016/j.rse.2020.111804

## Detectar el espigamiento desde satélite: precisión y límites

Los métodos de detección del espigamiento usan mínimos o máximos en series S1, la fecha del pico o del hombro de una curva doble logística de índices ópticos, o priors de grados-día. Las mejores precisiones reportadas son de unos 4–10 días. Ejemplos verificados: en trigo de invierno y cebada de invierno del noreste de
Alemania, un mínimo local de VH y VV de Sentinel-1 cayó a menos de 5 días de la fecha de entrada en espigamiento (Harfenmeister et al. 2021, Remote Sensing 13:5036; verificado en el resumen). En arroz de Nueva Gales del Sur, Australia, el índice CIG de Planet Fusion, con un desfase de unos 13 días, dio RMSE de 6.56 y 7
días para la fecha de floración (Jha et al. 2026, J. Indian Soc. Remote Sens. 54:4297-4310; verificado en el resumen; es floración, no espigamiento). Un estudio de fenología multiespectral de trigo y cebada en Australia (Zhao et al. 2025, in silico Plants 7(2); verificado en la página del artículo) dio un RMSE de 7.66
días para la floración (R² = 0.7) y de 8.67 días para la hoja bandera (R² = 0.61), con 110 campos en 2021 y 73 en 2022. La cifra de 7.7 días del corpus corresponde, por tanto, a la floración y no al espigamiento, y el sensor no se confirmó en la página. La regla de GRVI con 9.63 días no se encontró en las fuentes
consultadas (SIN EVIDENCIA).
No se encontró ningún estudio que detecte el espigamiento de trigo o cebada directamente con PlanetScope contra registros de campo. Las fechas de espigamiento en el reto no están validadas con datos de campo mexicanos.

Fuente: literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; Harfenmeister et al. (2021), Remote Sensing 13:5036, doi 10.3390/rs13245036; Jha et al. (2026), J. Indian Soc. Remote Sens., doi 10.1007/s12524-026-02557-0

## Estrés por calor y senescencia acelerada

En Lobell, Sibley y Ortiz-Monasterio (2012), la senescencia del trigo en el norte de la India se aceleró de forma significativa tras exposiciones por encima de 34 °C, más allá del efecto del calentamiento medio (verificado). Los autores señalan que los modelos de cultivo pueden subestimar pérdidas de rendimiento de
hasta 50 % en algunas fechas de siembra con +2 °C. Un resumen de prensa (Reuters) habla de hasta 20 % de pérdida según la fecha de siembra; esa cifra es de prensa y no del artículo. En el Altiplano a 2,500–2,900 m, el calor extremo es menos probable que el frío nocturno y la falta de agua de fin de temporada, por lo
que el calor debe tratarse como hipótesis.

Fuente: Lobell et al. (2012), Nature Climate Change 2:186-189, doi 10.1038/nclimate1356; literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md

## Senescencia, rendimiento y estrés hídrico

En Hassan et al. (2018), la senescencia del trigo fue 10–15 % más rápida con riego limitado que con riego completo, y la mayor tasa de senescencia se asoció negativamente con el peso de mil granos y el rendimiento (verificado en el resumen; el rango r = 0.23–0.63 corresponde a correlaciones moderadas a fuertes entre
los índices, el peso de mil granos y el rendimiento, no a cada índice frente al rendimiento). En Anderegg et al. (2020), el retraso visual de la senescencia se asoció con el rendimiento con r = 0.17–0.37 (verificado: r = 0.173 en 2018 a 0.365 en 2016). Estas correlaciones son moderadas y dependen de la variedad y del
estrés. En nuestro caso, la temporada 2025 tuvo poca sequía terminal (mediana de CHIRPS de 950 mm de mayo a octubre), por lo que la senescencia no debería explicar mucho de la variación del rendimiento. Las pérdidas en la cola baja del rango de rendimiento (2.0–5.6 t/ha) probablemente vienen de establecimiento,
encharcamiento, enfermedades, granizo, heladas o acame (hipótesis).

Fuente: Hassan et al. (2018), Remote Sensing 10(6):809, doi 10.3390/rs10060809; Anderegg et al. (2020), Frontiers in Plant Science 10:1749, doi 10.3389/fpls.2019.01749; literature_review__reports__Panicle_coverage_and_barley_yield.md

## Granizo, helada y acame: detección por cambios abruptos

Los daños dejan una señal abrupta en la serie. En las Praderas canadienses, el granizo en 54 campos se midió con el área bajo la curva de 32 días de NDVI, NDWI o PSRI de Sentinel-2, y esa área se correlacionó con el daño de campo: r = −0.86 en trigo y r = −0.90 en canola (y r = 0.80 en lenteja) (Remote Sensing 2022,
doi 10.3390/rs14040951; verificado en el resumen). El índice de daño de cultivo (CDI, diferencia entre EVI2 observado y esperado en tiempo térmico) predijo la reducción de rendimiento con R² = 0.91 en cebada y 0.83 en trigo de invierno, unos dos meses antes de la cosecha, en parcelas del sur de Australia (resumen de la
EGU24; es resumen de congreso, no artículo revisado). Para acame de trigo en Ferrara, Italia (temporada 2018), Chauhan et al. (2020) encontraron que el VH de Sentinel-1 y las bandas red-edge (740 nm) y NIR de Sentinel-2 separaban mejor el trigo sano del acamado. Las exactitudes de 79 %, 80 % y 83 % no aparecen en el
resumen y no se verificaron. Estas cifras son de la literatura y no de Hidalgo.

Fuente: literature_review__research_notes__Panicle_coverage_and_barley_yield__satellite_heading_signals.md; modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md

## Suelo desnudo y verdeo de estación seca

Para propiedades de suelo a nivel de parcela, un compuesto de suelo desnudo de Sentinel-2 entre diciembre y mayo (con NDVI < 0.25 y NBR2 < 0.05, según Dvorakova et al. 2022, Geoderma 429:116128; verificado) dio un RMSE de 3.5 ± 0.3 g C/kg para carbono orgánico en validación cruzada (verificado); el R² de 0.5–0.6 para
textura no se encontró en la fuente (SIN EVIDENCIA) y se retira. SoilGrids, a 250 m, es demasiado grueso para una parcela. El verdor de
enero a mayo del año anterior es una señal confundida: puede indicar riego, cultivos forrajeros, malezas o suelos profundos. Las malezas de barbecho agotan agua y nitrógeno, pero la literatura consultada no cuantifica esas pérdidas en t/ha (SIN EVIDENCIA); Osten et al. (2004) reportan, según el resumen, reducciones del
rendimiento del trigo siguiente en Queensland y Australia Occidental, sin cifra. Por eso el verdor de estación seca debe separarse en componentes
(suelo y riego) antes de probarlo como predictor. Esta es una recomendación de la fuente, no un resultado del proyecto.

Fuente: modelado__research_notes__Barley_yield_predictors_Mexican_highlands__remote_sensing_predictors.md

## Representaciones aprendidas y contexto anual

Las representaciones de modelos fundacionales (Presto, Galileo, Prithvi-EO-2.0, AlphaEarth y otros) resumen series temporales en vectores. Presto (Tseng et al. 2023, arXiv:2304.14065) tiene unos 0.40 millones de parámetros en su codificador (tablas 5 y 6 del artículo) y 0.81 millones en codificador más decodificador en
la variante de profundidad 2 y ancho 128 de su tabla 8 (verificado). AlphaEarth Foundations produce vectores anuales de 64 dimensiones a 10 m, con cobertura publicada de 2017–2024 según estudios que la usan (p. ej. arXiv:2605.10029); el proyecto, además, descargó y validó capas de 2025 para las 197 parcelas, por lo que
la colección disponible ya incluye 2025. Un vector de un año anterior puede servir como contexto, mientras que uno del mismo año aporta información de todo el periodo. Esta distinción importa porque estimar una cosecha histórica y anticiparla son tareas diferentes. Las dimensiones no tienen interpretación directa como
fertilidad o lluvia sin evidencia adicional. Como recomendación (no resultado), cualquier vector de representación debe compararse contra una línea base de índices simples como NDVI o red-edge, con validación agrupada por municipio, para medir cuánto aporta de verdad.

Fuente: literature_review__report__chapters__03_representaciones.typ.txt; Tseng et al. (2023), Presto, arXiv:2304.14065; arXiv:2605.10029 (AlphaEarth, estudio secundario)

## Qué busca cada familia de sensores para AgroCebada

Las tres preguntas principales son independientes. Primero, ¿qué tan alto llegó el dosel y cuándo? Esto se responde con NDVI, EVI, LAI o fAPAR en la fase de espigamiento, y con el tiempo del pico. Segundo, ¿cuánto dura el llenado de grano y cuánto se pierde de amplitud? Esto se responde con las bajadas y el AUC
posterior al pico. Tercero, ¿qué condiciones de agua, calor o estructura tuvo la parcela? Esto se responde con precipitación, LST, S1 y SWIR. Como el corte del 31 de octubre trunca la segunda pregunta, es crucial no atribuir a la bajada cualquier efecto del rendimiento.

Fuente: literature_review__report__chapters__02_observacion.typ.txt; dynamic_change__phenocurve__docs__F1_fits.md; literature_review__reports__Panicle_coverage_and_barley_yield.md

## Literatura: estimación de cebada y trigo con índices de dosel (contexto)

Los estudios de rendimiento con satélite en cereales suelen usar series de índices de dosel más que una sola fecha. Skakun et al. (2019) combinaron Landsat 8 y Sentinel-2 en trigo de invierno: ajustaron modelos fenológicos a los datos de reflectancia y reflectancia normalizada de HLS, y luego usaron esos parámetros en
modelos de regresión de rendimiento. El estudio es de trigo de invierno y no de cebada de temporal, así que su precisión no se traslada al Altiplano. En México, la estimación de rendimiento de cebada maltera de Hidalgo se ha hecho con el método FAO de estimación de rendimiento por biomasa y componentes, que supone que
no hay limitaciones de humedad del suelo; Gómez Mercado et al. (2009) lo aplicaron con tres genotipos (Esmeralda, Adabella y M-152A) en experimentos de Hidalgo. Ese supuesto no se cumple en temporal, así que el método es una referencia de cálculo, no un predictor satelital. No se encontró en esta ronda un estudio de
teledetección de rendimiento de cebada para el Altiplano.

Fuente: Skakun et al. (2019), Remote Sensing 11(15):1768, doi 10.3390/rs11151768; Gómez Mercado et al. (2009), Agricultura Técnica en México 35(1):13-23, https://www.scielo.org.mx/pdf/agritm/v35n1/v35n1a2.pdf

## Madurez del dosel y saturación: la tesis del pico (literatura)

La literatura de dosel coincide en que el pico de un índice verde no es una medida de rendimiento. Huete et al. (2002), con datos MODIS, mostraron que el NDVI se estabiliza en biomasa alta, mientras el EVI conserva sensibilidad (verificado). Anderegg et al. (2020) encontraron que, en más de 300 variedades de trigo, la
calificación visual de senescencia fue el predictor más fuerte del rendimiento, y que el PSRI estuvo entre los predictores más útiles, sin que sumar más bandas hiciera mucha diferencia. Esto respalda usar el tiempo de la senescencia y la forma de la bajada como señal, no sólo el valor máximo. La recomendación para el
proyecto es comparar el pico con el tiempo de la bajada en el mismo modelo, y no interpretar el pico como biomasa de grano. Es una recomendación a partir de la literatura, no un resultado de nuestros experimentos.

Fuente: Huete et al. (2002), doi 10.1016/S0034-4257(02)00096-2; Anderegg et al. (2020), doi 10.3389/fpls.2019.01749

## Armonización por índice: Planet frente a Sentinel-2 en la literatura

Una comparación entre sensores exige ajustar cada índice por separado. Sentinel-2 tiene bandas red-edge a 20 m (B05–B07, B8A) y Planet, en su constelación SuperDove, tiene una banda red-edge cercana a 705 nm; las dos no son equivalentes en ancho de banda ni en respuesta espectral (verificado en la descripción de
bandas). Por eso los productos de Planet no traen bandas SWIR, y los índices que las usan no son comparables entre sensores (ver fragmento de PlanetScope). Clevers y Gitelson (2013) muestran que los índices red-edge de Sentinel-2 son estimadores lineales de clorofila y nitrógeno en cultivos, lo que da un punto de
partida para la armonización, pero no reemplaza la calibración local. Nuestro resultado interno (NDVI de Planet frente a Sentinel-2, r = 0.991; diferencia +0.075) muestra que la armonización debe ser por índice y por sensor, no un solo ajuste global. Esto es un resultado propio del proyecto; la literatura sólo indica
el procedimiento.

Fuente: Clevers y Gitelson (2013), Int. J. Appl. Earth Obs. Geoinf. 23:344-351; literature_review__reports__Panicle_coverage_and_barley_yield.md; dynamic_change__phenocurve__docs__A1_series.md

## Suavizado de NDVI con Savitzky–Golay y su uso en series de Sentinel-2

Chen et al. (2004) propusieron reconstruir series NDVI de alta calidad con un filtro Savitzky–Golay iterativo. El método supone que nubes o mala atmósfera bajan el NDVI, por lo que empuja los valores hacia la envolvente superior de la serie. Lo probaron con compuestos decenales de SPOT VGT-S, dieron recomendaciones de
parámetros y lo compararon con el algoritmo BISE y con un ajuste de Fourier, reportando mejores resultados en conjunto. El filtro original (Savitzky y Golay, 1964) calcula pesos de convolución a partir de polinomios de Gram que reproducen exactamente la regresión polinómica por mínimos cuadrados. Su uso exige fijar la
longitud de la ventana y el grado del polinomio. Para cebada de temporal con pocas observaciones (la mediana de Sentinel-2 válidas es 31 por parcela, con huecos en junio), la longitud de ventana decide cuánto se suaviza el verdeo. Recomendación: probar Savitzky–Golay frente a Whittaker y reportar la sensibilidad a la
ventana, sin atribuir a un filtro la forma real de la fenología.

Fuente: Chen et al. (2004), Remote Sensing of Environment 91(3-4):332-344, doi 10.1016/j.rse.2004.03.014; Savitzky y Golay (1964), Analytical Chemistry 36(8):1627-1639

## Suavizado de Whittaker–Eilers: control continuo de la suavidad

Eilers (2003) presentó el suavizador de Whittaker como alternativa al filtro Savitzky–Golay. Es un suavizado por mínimos cuadrados penalizados que castiga las diferencias de los valores ajustados; el parámetro λ controla la suavidad de forma continua. El método es rápido, interpola automáticamente los huecos de la
serie y permite validación cruzada dejando uno fuera para elegir λ (verificado en el resumen del artículo, Analytical Chemistry 75(14):3631-3636). Por tanto, el suavizado es útil cuando la serie tiene huecos irregulares, como las observaciones de Sentinel-2 en junio. El valor λ = 100 usado en nuestro pipeline es una
elección del proyecto y no un valor recomendado por la literatura; la literatura no fija un λ óptimo para cebada. Recomendación: elegir λ por validación cruzada sobre la serie de cada parcela y reportar cuántas parcelas quedan con λ en el límite del rango.

Fuente: Eilers (2003), doi 10.1021/ac034173t

## Cobertura de dosel y sensores de borde rojo: el caso MERIS y MTCI

Dash y Curran (2004) propusieron el MTCI (MERIS Terrestrial Chlorophyll Index) como sustituto de la posición del borde rojo usando sólo bandas estándar del sensor MERIS. Lo evaluaron con espectros de modelo, espectros de campo y datos MERIS, y encontraron que es fácil de automatizar, que se correlaciona fuertemente con
la posición del borde rojo y que conserva sensibilidad con valores altos de clorofila, donde la posición del borde rojo ya no responde (verificado en el registro del artículo). La Agencia Espacial Europea lo incorporó como producto de nivel 2 de MERIS en marzo de 2004. La forma de Sentinel-2 que usa el ESA SNAP es (B6
− B5)/(B5 − B4), con centros cercanos a 740, 705 y 665 nm, y no es numéricamente idéntica a la de MERIS. Por eso los valores de MTCI de MERIS y de Sentinel-2 no son comparables directamente. Para cebada, la literatura de MTCI es de cultivos en general y no de cebada de temporal en el Altiplano.

Fuente: Dash y Curran (2004), Int. J. Remote Sens. 25(23):5403-5413, doi 10.1080/0143116042000274015; ESA SNAP, https://step.esa.int/main/wp-content/help/versions/10.0.0/snap-toolboxes/eu.esa.opt.opttbx.radiometric.indices.ui/mtci/MtciAlgorithmSpecification.html

## Índices de MSAVI y EVI en dosel abierto: lo que dice la literatura

Qi et al. (1994) propusieron el MSAVI para aumentar el rango dinámico de la señal de vegetación y reducir la influencia del suelo. En lugar del factor constante L de SAVI, usan una función variable que se deriva por inducción o a partir del producto de NDVI y WDVI. Lo probaron en dosel de algodón medido en campo y
desde avión, con una relación entre señal de vegetación y ruido del suelo mayor que la de otros índices (verificado en el resumen). Muchos programas usan MSAVI2, una versión inductiva sin constante L. Para cebada temprana, con suelo visible entre hileras, el MSAVI es una alternativa razonable al NDVI; su ecuación
exacta debe confirmarse en el artículo original. La base IndexDatabase la transcribe como 2·NIR + 1 − √((2·NIR + 1)² − 8·(NIR − RED)); el divisor 1/2 que suele aparecer en la forma estándar queda por confirmar. El EVI de Huete et al. (2002) es otra opción de corrección de suelo y atmósfera, con sensibilidad en dosel
alto.

Fuente: Qi et al. (1994), Remote Sensing of Environment 48(2):119-126, doi 10.1016/0034-4257(94)90134-1; Huete et al. (2002), doi 10.1016/S0034-4257(02)00096-2

## NDTI y residuos: la señal SWIR depende de la humedad del suelo

Van Deventer et al. (1997) usaron Landsat 5 TM (imagen del 11 de mayo de 1990, condado de Seneca, Ohio) y las diferencias normalizadas de las bandas 5 y 7 para clasificar la labranza en 27 campos; el modelo logístico clasificó correctamente 89 % de los campos (verificado en el resumen del artículo). La forma (SWIR1 −
SWIR2)/(SWIR1 + SWIR2), que hoy se llama NDTI, proviene de esa línea de trabajo y es de uso posterior en la literatura. En Sentinel-2 se usan las bandas B11 (1610 nm) y B12 (2190 nm). Un estudio con WorldView-3 encontró que el SINDRI, de banda más estrecha, superó al NDTI para estimar la cobertura de residuo, y que el
NDTI es menos robusto cuando cambia la humedad del suelo; además, el análisis se limitó a campos con NDVI < 0.3 porque la vegetación verde interfiere con los índices SWIR (verificado en el resumen del USGS). Para el proyecto, esto refuerza la recomendación de tratar NDTI como covariable de residuo y humedad, no como
medida de labranza.

Fuente: van Deventer et al. (1997), Photogrammetric Engineering & Remote Sensing (resumen verificado); USGS, https://pubs.usgs.gov/publication/70201200

## Índice NIR–SWIR de Gao (1996): definición y confusión de nombres

Gao (1996) definió un índice de agua líquida de la vegetación desde el espacio, usando la reflectancia en 0.86 µm (NIR) y 1.24 µm (SWIR): (ρ0.86 − ρ1.24)/(ρ0.86 + ρ1.24). Con frecuencia se le llama NDMI o «NDWI de Gao», lo que genera confusión con el NDWI de McFeeters (1996), que usa verde y NIR y se usa para cuerpos
de agua abierta; la literatura recomienda tratarlos como índices distintos (verificado en fuentes de referencia). El NIR–SWIR combina la señal de agua de la hoja con la estructura del mesófilo: el NIR responde sobre todo a la estructura y la materia seca, y el SWIR al agua, así que el cociente reduce el efecto
estructural. Sentinel-2 no tiene una banda de 1.24 µm, por lo que su versión del índice usa otra combinación de bandas y no es numéricamente igual al de Gao. En el proyecto, MSI y NDMI deben nombrarse con su fórmula exacta en cada análisis.

Fuente: Gao (1996), Remote Sensing of Environment 58(3):257-266 (volumen y páginas no verificados en esta ronda); búsqueda en fuentes de referencia sobre el NDMI/NDWI

## Bak et al. (2025): cobertura de panícula y rendimiento de arroz (no cebada)

Bak et al. (2025), en Frontiers in Plant Science vol. 16, describen un método de segmentación semántica con aprendizaje profundo para medir la cobertura de panícula en imágenes RGB de arroz. Cada imagen cubre 1 m² de una parcela, se tomó cada 3–7 días, y el conjunto de rendimiento procede de 152 parcelas (20 de campo
en 2023 y 132 en 2024). Compararon cinco modelos de segmentación; DeepLabv3+ y LinkNet tuvieron el mejor mIoU, por encima de 0.81. La cobertura a lo largo del tiempo se ajustó con una función por partes, y sus parámetros se usaron como predictores de rendimiento y de sus componentes. El parámetro K, la cobertura máxima
de panícula, correlacionó con el rendimiento (r = 0.87, p < 0.001), con el número de granos (r = 0.85) y con el número de panículas por m² (r = 0.70). Según el registro institucional del artículo, los mejores modelos de rendimiento alcanzaron R² = 0.89. Advertencia: es arroz, con fotografías a nivel de suelo y no con
satélite; no mide espiga de cebada desde el espacio, y su resultado no se traslada directamente a la cebada de temporal.

Fuente: Bak et al. (2025), Frontiers in Plant Science 16, doi 10.3389/fpls.2025.1611653

## Calor extremo y senescencia del trigo en el norte de la India (Lobell et al. 2012)

Lobell, Sibley y Ortiz-Monasterio (2012), en Nature Climate Change 2:186–189, usaron nueve años de datos satelitales de trigo en el norte de la India para medir cuánto se acelera la senescencia cuando la temperatura pasa de 34 °C. El resultado es que el calor extremo aceleró la senescencia más allá del efecto de la
temperatura media. Dos modelos de cultivo de uso amplio subestimaron ese efecto. Como la senescencia temprana acorta el llenado de grano, los autores señalan que con +2 °C de calentamiento los modelos podrían subestimar pérdidas de rendimiento de hasta 50 % en algunas fechas de siembra. Un resumen de prensa habló de
hasta 20 % de pérdida, cifra que no aparece como resultado del artículo en el resumen consultado. El estudio es de trigo en la India, con afiliaciones de Stanford y CIMMYT. Para la cebada de temporal del Altiplano no hay una cifra publicada equivalente en el corpus; la aplicación al Altiplano es una hipótesis que debe
tratarse con cautela.

Fuente: Lobell, Sibley y Ortiz-Monasterio (2012), Nature Climate Change 2:186-189, doi 10.1038/nclimate1356

## Senescencia visual y rendimiento en más de 300 variedades de trigo (Anderegg et al. 2020)

Anderegg et al. (2020), en Frontiers in Plant Science 10:1749, midieron durante tres años (2016–2018) el secado del dosel en más de 300 variedades de trigo de invierno, con espectrorradiómetro de 350 a 2500 nm. Usaron 335 cultivares en 2016 y 352 en 2017 y 2018. Entre los índices evaluados, el PSRI siguió la
calificación visual de senescencia más de cerca que los demás, y los modelos de espectro completo variaron mucho entre años. La calificación visual fue el predictor más fuerte del rendimiento en grano. El retraso visual de la senescencia se correlacionó con el rendimiento de forma positiva pero débil y significativa: r
= 0.173 en 2018 y r = 0.365 en 2016. El inicio de la senescencia calculado con PSRI llegó a r = 0.369 en 2016. La lección para la teledetección es que el momento de la senescencia aporta señal, pero su relación con el rendimiento es moderada y depende del año y de la variedad. Estas cifras son de trigo y no se
trasladan a la cebada.

Fuente: Anderegg et al. (2020), Frontiers in Plant Science 10:1749, doi 10.3389/fpls.2019.01749

## Senescencia más rápida con riego limitado en trigo de UAV (Hassan et al. 2018)

Hassan et al. (2018), en Remote Sensing 10(6):809, evaluaron cinco índices de vegetación derivados de imágenes de dron (UAV) para predecir la senescencia de 32 genotipos de trigo de invierno bajo riego completo y riego limitado. La tasa de senescencia fue de 10 a 15 % mayor con riego limitado. La tasa alta de
senescencia se asoció de forma negativa con el peso de mil granos y con el rendimiento, según un análisis de componentes principales. Algunos genotipos mantuvieron una tasa baja de senescencia y un rendimiento estable en ambos riegos. Los autores concluyen que los índices de UAV son prometedores para estimar la tasa de
senescencia en madurez. El orden de autores del registro no es uniforme entre fuentes, por lo que la atribución al primer autor debe confirmarse. El rango r = 0.23–0.63 sí aparece en el resumen, pero corresponde a las correlaciones entre los índices, el peso de mil granos y el rendimiento, no a cada índice frente al
rendimiento.

Fuente: Hassan et al. (2018), Remote Sensing 10(6):809, doi 10.3390/rs10060809

## Fusión de Landsat 8 y Sentinel-2 para el rendimiento de trigo de invierno (Skakun et al. 2019)

Skakun et al. (2019), en Remote Sensing 11(15):1768, combinaron Landsat 8 y Sentinel-2 para estimar el rendimiento de trigo de invierno. Ambos sensores dan una observación cada 3 a 5 días con resolución de 10 a 30 m, según el resumen. Usaron datos de reflectancia superficial y de índices del producto HLS, ajustaron a
esos datos un modelo fenológico, y con los parámetros del ajuste construyeron modelos de regresión de rendimiento. La idea central es que un ajuste fenológico reduce el ruido de la serie antes de la regresión. El estudio es de trigo de invierno en otra región y no de cebada de temporal en el Altiplano; su precisión no
se traslada directamente. Para el proyecto, el procedimiento (ajustar la fenología y luego regresar) es un método a evaluar, no un resultado local.

Fuente: Skakun et al. (2019), Remote Sensing 11(15):1768, doi 10.3390/rs11151768

## CIre y MTCI: índices de clorofila de borde rojo para cultivos (Gitelson y Clevers)

Gitelson et al. (2003) propusieron algoritmos para estimar la clorofila de hojas con pocas bandas amplias, en J. Plant Physiol. 160:271–282. El índice CIre, en Sentinel-2, se calcula como B07/B05 − 1 (banda B07 a 783 nm entre banda B05 a 705 nm), una forma que se encuentra en la documentación de Sentinel Hub atribuida
a Gitelson et al. (2003). Clevers y Gitelson (2013), en Int. J. Appl. Earth Obs. Geoinf. 23:344–351, reportaron que CIre, CIgreen y MTCI son estimadores lineales precisos de clorofila y nitrógeno del dosel en cultivos y pastos usando las bandas red-edge de Sentinel-2 y Sentinel-3, que tienen 20 m. El MTCI de Sentinel-2
en SNAP es (B6 − B5)/(B5 − B4). La razón habitual para preferirlos al NDVI en dosel denso es que el borde rojo responde a la clorofila sin saturarse tan pronto (argumento de la literatura citada; en esta ronda no se midió la saturación en cebada). Para la cebada de temporal, la literatura consultada no reporta una
relación de estos índices con el rendimiento; la prueba debe hacerse con datos locales.

Fuente: Gitelson et al. (2003), J. Plant Physiol. 160:271-282; Clevers y Gitelson (2013), Int. J. Appl. Earth Obs. Geoinf. 23:344-351; ESA SNAP, MTCI, https://step.esa.int/main/wp-content/help/versions/10.0.0/snap-toolboxes/eu.esa.opt.opttbx.radiometric.indices.ui/mtci/MtciAlgorithmSpecification.html

## HLS v2.0: qué bandas tiene cada componente

HLS (Harmonized Landsat Sentinel) distribuye dos productos. El HLSL30 deriva de Landsat 8 y Landsat 9 (sensores OLI y OLI-2) a 30 m y no tiene bandas red-edge. El HLSS30 deriva de Sentinel-2A y 2B, y la lista de la versión 2.0 también incluye 2C; a 30 m conserva la respuesta espectral original de MSI en las bandas NIR
y red-edge, mientras que las demás bandas se ajustan hacia la respuesta de Landsat. Según la guía de usuario de la versión 1.5, la corrección BRDF por ángulo de visión también se aplica a las bandas red-edge de Sentinel-2. Por eso, un análisis red-edge con HLS debe basarse en el componente S30. La guía de la versión
2.0 no se pudo leer completa en esta ronda, así que la tabla exacta de bandas de la versión 2.0 debe confirmarse en la documentación del LP DAAC.

Fuente: NASA HLS, https://hls.gsfc.nasa.gov/products-description/s30; LP DAAC, HLS User Guide V2, https://lpdaac.usgs.gov/documents/1698/HLS_User_Guide_V2.pdf (solo portada consultada)

## PlanetScope SuperDove: 8 bandas, borde rojo cercano a 705 nm y sin SWIR

El satélite SuperDove de Planet tiene 8 bandas: costera, azul, verde I, verde, amarillo, rojo, borde rojo e infrarrojo cercano. La banda de borde rojo tiene un rango cercano a 697–713 nm, con centro cerca de 705 nm. Ninguna de sus bandas es SWIR, por lo que los índices que dependen de SWIR (como NDTI o el NDMI SWIR) no
se pueden calcular con esta constelación. Sobre la resolución, el tamaño de píxel nadir nativo se reporta como 3.7 m en la documentación de Planet y de ESA; los productos remuestreados de 8 bandas se citan como de unos 3 m, y algunos artículos usan 4 m. Las fuentes no son uniformes, así que el producto y la resolución
deben declararse en cada análisis. Para el proyecto, esto implica armonizar el borde rojo de Planet con el de Sentinel-2 por índice y no tratar las bandas como equivalentes.

Fuente: NASA, PlanetSuperDove geometric assessment (2024), https://www.earthdata.nasa.gov/s3fs-public/2024-05/NASA-PlanetSuperDoveGeometricAssessment-04092024%20Report.pdf; ESA eoportal, PlanetScope, https://dragon3.esa.int/eogateway/missions/PlanetScope

## PSRI: definición de Merzlyak (1999) y variantes

El índice de reflectancia de senescencia de plantas (PSRI) se define según Merzlyak et al. (1999), en Physiologia Plantarum 106(1):135–141, como (R680 − R500)/R750. Sube cuando disminuye la clorofila y aumenta la proporción de carotenoides, típica del envejecimiento del dosel y de la maduración de frutos. Una revisión
de 2016 cita una variante con 550 nm en lugar de 500 nm, así que la longitud de onda de referencia verde debe confirmarse en el artículo original. El software SNAP de ESA calcula otra expresión, (R − B)/RE2, que no es el PSRI de Merzlyak. En Sentinel-2, la aproximación del corpus (B04 − B02)/B06 usa bandas centradas en
665, 490 y 740 nm, no exactamente 680, 500 y 750 nm, así que es una equivalencia aproximada. Anderegg et al. (2020) encontraron que el PSRI siguió la senescencia visual mejor que otros índices en trigo.

Fuente: Merzlyak et al. (1999), Physiologia Plantarum 106(1):135-141, doi 10.1034/j.1399-3054.1999.106119.x; Anderegg et al. (2020), doi 10.3389/fpls.2019.01749

## Ventana temporal óptima para predecir el rendimiento con Sentinel-2 (Colonna et al. 2024)

Colonna, Genzano, Ciancia y Filizzola (2024) propusieron un método para elegir, a escala de parcela, el periodo de observaciones de Sentinel-2 que mejor predice el rendimiento. El método analiza la serie histórica de un índice de vegetación (NDVI en su ejemplo) y busca la ventana temporal óptima, ajustando el intervalo
de tiempo, el umbral de probabilidad de nubes y el tipo de compuesto temporal. Lo aplicaron a un campo de trigo en el valle del Po, en Italia. Para la cebada de temporal del Altiplano, el punto útil es que la ventana no se fija de antemano: se busca con datos históricos de cada sitio. Esto importa porque el
espigamiento y el llenado de grano caen en fechas que varían entre años, y porque las nubes limitan las observaciones en los meses de lluvia. El resumen no propone una ventana universal para cereales, así que una ventana de espigamiento a llenado de grano debe calibrarse con datos locales y validarse por años. Es una
recomendación del método, no un resultado del proyecto.

Fuente: Colonna, Genzano, Ciancia, Filizzola (2024). A Method to Determine the Optimal Period for Field-Scale Yield Prediction Using Sentinel-2 Vegetation Indices. Land 13(11):1818, doi 10.3390/land13111818.

## Espigamiento detectado con Sentinel-1: mínimos de VH y VV (Harfenmeister et al. 2021)

Harfenmeister, Itzerott, Weltzien y Spengler (2021) analizaron series de Sentinel-1 (VH, VV, el cociente VH/VV y parámetros polarimétricos) y de NDVI de Sentinel-2 en trigo de invierno y cebada de invierno del noreste de Alemania, en dos sitios y dos años. Compararon los mínimos, máximos y quiebres de las series con
las fechas de campo de cada etapa fenológica. El inicio del alargamiento del tallo produjo un quiebre en la mayoría de los parámetros. El inicio del espigamiento se detectó con todos ellos, y en particular un mínimo local de VH y VV ocurrió a menos de 5 días de la fecha de entrada en espigamiento. La etapa de grano
masoso de la cebada se ubicó alrededor de 6 a 8 días de un máximo local de VH en 2018, y la cosecha de la cebada se detectó con el cuarto quiebre. El grano lechoso medio no se detectó de forma confiable. Los autores muestran que el enfoque es transferible entre sitios y años, aunque con diferencias. Para el Altiplano,
el resultado es una pista metodológica: el espigamiento podría buscarse en Sentinel-1, pero no existe validación con fechas de campo mexicanas, y el cultivo y el clima son distintos.

Fuente: Harfenmeister, Itzerott, Weltzien, Spengler (2021). Detecting Phenological Development of Winter Wheat and Winter Barley Using Time Series of Sentinel-1 and Sentinel-2. Remote Sensing 13(24):5036, doi 10.3390/rs13245036.

## Floración del arroz con Planet Fusion: RMSE de 6.56 y 7 días (Jha et al. 2026)

Jha, Brinkhoff, Robson y Dunn (2026) estimaron la fecha de floración del arroz con imágenes de Sentinel-2 y con Planet Fusion, una serie diaria que combina datos de sensores de Planet. El método identifica el pico de la temporada de un índice de vegetación y le aplica un desfase de unos 13 días para predecir la
floración. Probaron cuatro índices en campos comerciales y experimentales de Nueva Gales del Sur, Australia, en las temporadas 2021–22, 2022–23 y 2023–24. El índice de clorofila verde (CIG) de Planet Fusion dio la relación más consistente, con RMSE de 6.56 días (114 sitios) en 2021–22 y de 7 días (134 sitios) en
2022–23. El método también describió variaciones de floración por diferencias de nitrógeno, con R² entre 0.09 y 0.97 según el sitio. Para el proyecto, el resultado sugiere que el pico de un índice más un desfase podría predecir una fecha fenológica con PlanetScope. Sin embargo, es floración del arroz, no espigamiento
de cebada, y la validación con fechas de campo mexicanas sigue pendiente.

Fuente: Jha, Brinkhoff, Robson, Dunn (2026). Rice Flowering Date Retrieval from Sentinel-2 and Planet Fusion Imagery. Journal of the Indian Society of Remote Sensing 54:4297–4310, doi 10.1007/s12524-026-02557-0.

## Parcelas pequeñas y cultivos intercalados: límites de la estimación con satélite (Li et al. 2022)

Li, Chimimba, Kambombe y Brown (2022) estimaron el rendimiento de maíz en 150 parcelas de pequeños productores del sur de Malaui. Casi la mitad estaban intercaladas con leguminosas, y el tamaño medio de parcela era de 0.17 ha, una escala comparable a la de muchos campos de temporal. Los píxeles mixtos del intercalado
redujeron la precisión: el índice de borde rojo de Sentinel-2 dio R² = 0.51 (nRMSE de 19.95 %), y PlanetScope de 3 m sólo mejoró marginalmente (R² = 0.52). Los valores pico del índice funcionaron mejor que la media o la mediana de temporada; según los autores, probablemente porque el pico refleja la capa superior del
maíz y resiste más la señal del sotobosque de la leguminosa. Los residuales medios fueron de 1 t/ha en maíz puro y de 1.3 t/ha en campos intercalados. Para el proyecto, esto sugiere que una resolución de 3 m no resuelve por sí sola el problema de las parcelas pequeñas. Son resultados de maíz en Malaui, no de cebada en
México.

Fuente: Li, Chimimba, Kambombe, Brown (2022). Maize Yield Estimation in Intercropped Smallholder Fields Using Satellite Data in Southern Malawi. Remote Sensing 14(10):2458, doi 10.3390/rs14102458.

## Rendimiento de pequeños productores con imágenes satelitales: el caso de Kenia (Burke y Lobell 2017)

Burke y Lobell (2017) combinaron datos de campo de miles de parcelas de pequeños productores en Kenia con imágenes satelitales de alta resolución para estimar la productividad de las parcelas y explorar sus determinantes. El resumen del artículo en PNAS indica que las imágenes satelitales permiten estimar la
productividad en un contexto donde la medición convencional es escasa. El trabajo es relevante por su escala y porque usa datos de campo como referencia para parcelas de pocas hectáreas, algo que el Altiplano comparte con esas explotaciones. Sin embargo, no es un estudio de cebada ni de altura tropical, y el tipo de
sensor y el número exacto de parcelas deben tomarse del texto completo, que no se revisó en esta ronda. Para el proyecto, la lección metodológica es validar cualquier estimación satelital con parcelas de campo independientes y reportar el error por tamaño de parcela.

Fuente: Burke, M., Lobell, D.B. (2017). Satellite-based assessment of yield variation and its determinants in smallholder African systems. PNAS 114(9):2189–2194, doi 10.1073/pnas.1616919114.

## PlanetScope en parcelas de pequeños productores: cacahuate en Malaui (Kpienbaareh et al. 2022)

Kpienbaareh, Mohammed, Luginaah y Wang (2022) estimaron el rendimiento de cacahuate en sistemas de pequeños productores del norte de Malaui con datos de PlanetScope. Compararon métodos, índices y etapas de crecimiento para predecir el rendimiento dentro de la temporada. El mejor modelo fue un bosque aleatorio con las
cinco variables más importantes (R² = 0.96 en el resumen), y la etapa más adecuada para predecir fue la de inicio de llenado de semilla (R5). En cuatro granjas, el margen de error de la estimación frente al rendimiento reportado fue de 0.85 a 11 %. Es un resultado útil para mostrar que PlanetScope funciona en campos
pequeños, pero la validación se apoya en pocas granjas y en una leguminosa, no en un cereal. Por eso su R² debe leerse como señal de factibilidad, no como precisión esperable para la cebada del proyecto.

Fuente: Kpienbaareh, Mohammed, Luginaah, Wang (2022). Estimating Groundnut Yield in Smallholder Agriculture Systems Using PlanetScope Data. Land 11(10):1752, doi 10.3390/land11101752.

## Daño por heladas en cultivos con índices de Sentinel-2 (Gabbrielli et al. 2022)

Gabbrielli, Corti, Perfetto y Fassa (2022) propusieron detectar el daño por helada con índices de vegetación de Sentinel-2 en un estudio de caso con mostaza blanca usada como cultivo de cobertura invernal. El daño depende de la tolerancia al frío del cultivo, de las temperaturas y de la etapa de desarrollo al momento
de la helada. El objetivo del estudio fue cuantificar su intensidad, su momento y su variación espacial, para planear la terminación del cultivo. El resumen no reporta un umbral de temperatura ni una cifra de rendimiento. Para el proyecto, el enfoque sirve como referencia de detección posterior al evento: en el corpus,
las heladas aparecen sólo como hipótesis de pérdida en la cola baja del rendimiento. No debe transferirse el umbral a cebada sin calibrarlo, porque la mostaza es un cultivo no cereal y de ciclo distinto.

Fuente: Gabbrielli, Corti, Perfetto, Fassa (2022). Satellite-Based Frost Damage Detection in Support of Winter Cover Crops Management: A Case Study on White Mustard. Agronomy 12(9):2025, doi 10.3390/agronomy12092025.

## Granizo en Rumania: energía cinética del radar y daño con Sentinel-2 (Ursu et al. 2025)

Ursu, Istrate, Jitariu y Lazăr (2025) combinaron datos de radar meteorológico con imágenes de Sentinel-2 para evaluar el daño de granizo en la vegetación de dos eventos del noreste de Rumania: Rădăuți (17 de julio de 2016) y Dolhasca (30 de julio de 2020). La energía cinética del granizo, derivada del radar, sirvió
como indicador temporal rápido del evento, y Sentinel-2 se usó para cuantificar el daño de la vegetación. La combinación separa dos preguntas: el radar indica dónde y cuándo cayó el granizo, y el satélite mide el efecto en el cultivo. El resumen no reporta una pérdida de rendimiento, por lo que no debe citarse como
tal. En el Altiplano, la disponibilidad de radar meteorológico a escala de parcela es limitada. Esto es una recomendación para revisar, no un resultado del proyecto.

Fuente: Ursu, Istrate, Jitariu, Lazăr (2025). Hail Damage Detection: Integrating Sentinel-2 Images with Weather Radar Hail Kinetic Energy. Remote Sensing 17(23):3850, doi 10.3390/rs17233850.

## Rendimiento de cebada con Sentinel-2: actas de congreso, sin revista arbitrada encontrada

En la búsqueda de esta ronda, la literatura sobre rendimiento de cebada con Sentinel-2 que apareció es escasa y en parte de actas de congreso. Demirpolat y Leloglu (2018) estimaron el rendimiento de cebada con índices de vegetación de Sentinel-2 en una conferencia de procesamiento de señales (SIU). Martínez-Casasnovas,
Uribeetxebarría y Escolà (2019) combinaron índices de Sentinel-2 con la conductividad eléctrica aparente del suelo para predecir el rendimiento de cebada en las actas de Precision agriculture '19. El texto completo de ambos no se revisó en esta ronda, por lo que su error de validación no puede trasladarse al Altiplano.
Ashourloo et al. (2022) propusieron un método de mapeo de trigo y cebada con series de Sentinel-2 basado en fenología, que está más cerca del problema de fenología que del de rendimiento. Para el proyecto, la brecha debe declararse: no se encontró en esta ronda una revista arbitrada que estime el rendimiento de cebada
con Sentinel-2.

Fuente: Demirpolat, Leloglu (2018), SIU, doi 10.1109/siu.2018.8404242; Martínez-Casasnovas, Uribeetxebarría, Escolà (2019), Precision agriculture '19, doi 10.3920/978-90-8686-888-9_38; Ashourloo, Nematollahi, Huete, Aghighi (2022). A new phenology-based method for mapping wheat and barley using time-series of
Sentinel-2 images. Remote Sensing of Environment 280:113206, doi 10.1016/j.rse.2022.113206.

## Fenología satelital de cereales de temporal en México y en zonas tropicales de altura: vacío documentado

En esta ronda no se encontró literatura arbitrada que describa la fenología satelital de cereales de temporal en México o en zonas tropicales de altura con series de Sentinel-2, PlanetScope o Landsat. La búsqueda en bases bibliográficas (Crossref y OpenAlex, con cuota agotada en parte) no devolvió estudios mexicanos
sobre este tema. Los métodos disponibles vienen de otras regiones: la fenología de trigo y cebada de invierno en Alemania con Sentinel-1 y Sentinel-2 (Harfenmeister et al. 2021) y el mapeo de trigo y cebada con series de Sentinel-2 basado en fenología (Ashourloo et al. 2022). Estas referencias sirven como método, no
como calibración: las fechas de siembra y espigamiento, y la duración de las etapas, no son comparables con las del Altiplano. Para el proyecto, la conclusión operativa es que la fenología local debe calibrarse con fechas de campo antes de transferir umbrales de otras regiones. Esto es una limitación de la literatura
consultada, no un resultado del proyecto.

Fuente: búsqueda bibliográfica de esta ronda (2026-10-18); Harfenmeister et al. (2021), Remote Sensing 13(24):5036, doi 10.3390/rs13245036; Ashourloo et al. (2022), Remote Sensing of Environment 280:113206, doi 10.1016/j.rse.2022.113206.

## Fenología de la cebada maltera en Valles Altos: floración y madurez según fichas INIFAP

En la Mesa Central de México, la cebada maltera de temporal es de ciclo de primavera, y el calendario de cada variedad depende del ambiente y de la fecha de siembra. La variedad Adabella, liberada por el programa nacional de cebada maltera del INIFAP para los Valles Altos de la Mesa Central, tiene ciclo vegetativo
intermedio: su floración ocurre entre 48 y 72 días y su madurez fisiológica entre 90 y 132 días después de la siembra, según su ficha de liberación de 2008. La misma ficha reporta rendimientos experimentales de 2.9 a 5.4 t/ha. La variedad Alina, de la misma serie de fichas INIFAP pero para riego en el Bajío (ciclo
otoño-invierno), tiene espigamiento a 58–68 días y madurez fisiológica a 106–123 días, lo que muestra que el ciclo se alarga con otro manejo y otra fecha de siembra. Para el proyecto, estos valores son de fichas de variedad y de ensayos, no de las parcelas de Hidalgo, Puebla y Tlaxcala. Recomendación: usar estas
ventanas solo como referencia para contrastar la fecha del pico y del hombro de las curvas satelitales, nunca como fechas observadas.

Fuente: Zamora Díaz et al. (2008), «Adabella: variedad de cebada maltera para Valles Altos de la Mesa Central de México», Agricultura Técnica en México 34(4):491–493; Solano Hernández et al. (2009), «Alina, nueva variedad de cebada maltera para riego en el Bajío», Agricultura Técnica en México 35(4):467–469.

## Maíz forrajero con Sentinel-2 y Landsat-8 en Durango (Cano-Mejía et al. 2023)

Cano-Mejía, Valdez-Cepeda y López-Santos (2023) estimaron la cosecha de maíz forrajero (Zea mays L.) en Bermejillo, Durango, una zona árida de la Universidad Autónoma Chapingo, con imágenes de Landsat-8 y Sentinel-2. Midieron biomasa en campo a los 72 días después de la siembra (dds), en la etapa de floración, y la
relacionaron con la reflectancia y con ocho índices de vegetación (NDVI, TVI, TTVI, RDVI, RVI, RATIO, SAVI y MSAVI2) mediante regresión lineal múltiple. El mejor modelo tuvo R² = 0.66 con las bandas 3 y 8 de Sentinel-2 (verde y NIR). Entre los índices, el RDVI tuvo el mejor desempeño, con R² = 0.75 según el texto, y el
rendimiento de forraje a 72 dds varió de 10.7 a 57.01 Mg/ha. Los autores concluyen que Sentinel-2 superó a Landsat-8 como herramienta libre para evaluar cultivos. Para el reto, es un antecedente mexicano de estimación de biomasa con Sentinel-2, pero no es de cereal de grano ni de temporal de altura. Hipótesis: la banda
NIR de Sentinel-2 podría ser también un predictor útil de biomasa en cebada, a validar con parcelas locales.

Fuente: Cano-Mejía, B., Valdez-Cepeda, R. D., López-Santos, A. (2023), Estimación de cosecha de maíz forrajero (Zea mays L.) mediante índices espectrales derivados de Landsat-8 y Sentinel-2, Terra Latinoamericana 41:e1696, doi 10.28940/terra.v41i0.1696.

## Cebada con Sentinel-1 y Sentinel-2 en Belchite, Aragón (Iranzo et al. 2022)

Iranzo, Montorio y García-Martín (2022) desarrollaron un modelo para estimar la producción de cebada en una explotación de 127 ha en Belchite (Aragón, España). Usaron predictores de dos regiones del espectro, microondas de Sentinel-1 y óptica de Sentinel-2, junto con variables climáticas alineadas con el calendario del
cultivo, y regresión lineal múltiple sobre combinaciones de predictores correlacionados con la producción. Según el resumen, el mejor modelo combinó un índice de radar (Cross Ratio) con un índice óptico de borde rojo (Inverted Red Edge Chlorophyll Index, IRECI) y tuvo un error de 57.38 kg/ha, «unos 4 %». La cifra debe
leerse con cautela: si el error es del 4 %, el rendimiento medio implícito sería de unos 1.4 t/ha (cálculo propio), valor bajo para Aragón, así que conviene confirmar la unidad en el texto completo. Para el proyecto, la lección es que la combinación de radar, óptica y clima es un enfoque razonable en cebada de secano
en Europa, pero su error no se traslada al Altiplano mexicano, donde no hay una validación equivalente.

Fuente: Iranzo, Montorio, García-Martín (2022), Revista de Teledetección 59:59–70, doi 10.4995/raet.2022.15099 (resumen consultado).

## Fusión Sentinel-1 y 2 para trigo y cebada: transferencia entre temporadas (Franch et al. 2026)

Franch et al. (2026), en un artículo de la revista International Journal of Applied Earth Observation and Geoinformation (doi 10.1016/j.jag.2026.105140), calibraron modelos de rendimiento a escala de parcela para trigo y cebada con datos de Sentinel-1 y Sentinel-2 en un único sitio con datos de alta calidad, durante
ocho campañas. Normalizaron la serie por grados-día acumulados, lo que según los autores mejora la estabilidad temporal, y compararon índices de fusión radar-óptica con índices solo ópticos. Los índices de fusión redujeron los errores de predicción frente a los modelos solo ópticos, sobre todo en cebada según el
resumen, pero la página consultada no da cifras de error en kg/ha, y los autores señalan que la transferibilidad entre regiones sigue siendo limitada. Para el proyecto, el resultado apoya normalizar por temperatura acumulada en lugar de por fecha calendario, y validar entre temporadas y no solo dentro de una. La cifra
de 1,100 kg/ha que aparecía en el corpus para Valladolid no se encontró en este artículo.

Fuente: Franch, B. et al. (2026), doi 10.1016/j.jag.2026.105140 (página consultada; texto completo no revisado).

## LAI y fAPAR de Sentinel-2 con el procesador biofísico de SNAP: validación en cultivos

El LAI (índice de área foliar) y la fAPAR (fracción de radiación fotosintéticamente activa absorbida) que se obtienen con SNAP se estiman con el algoritmo SL2P de Weiss y Baret (2016): redes neuronales entrenadas con simulaciones de PROSPECT y 4SAIL, aplicadas a reflectancia corregida atmosféricamente (L2A) para
producir productos L2B. El centro de procesamiento de Sentinel-2 no los genera de forma operativa, por lo que el usuario debe calcularlos en SNAP. Una revisión sobre SL2P reporta que su validación cumple los requisitos en cultivos (Djamai et al. 2019; Hu et al. 2020; Brown et al. 2021a), pero que subestima LAI y fAPAR
en bosques densos (según el resumen de búsqueda). En África, Kganyago et al. (2020) hallaron R² de 0.6 a 0.7 entre el LAI de SNAP y el medido en campo, con RMSE y MAE mayores de 2 m²/m², y concluyeron que el producto no es adecuado para agricultura de precisión a escala de parcela. Un estudio europeo de regresiones con
índices de vegetación en cereales obtuvo fAPAR con rRMSE de 14 % y LAI con 45 %, y recomendó un modelo de LAI en la etapa de macollaje; no usa SNAP. Para el proyecto, el LAI de Planet y el de Sentinel-2 no son intercambiables (diferencia de +1.12), y no encontramos una validación de fAPAR de SNAP en cebada: debe
validarse con mediciones de campo locales.

Fuente: Weiss, M., Baret, F. (2016), algoritmo SL2P (citado en resumen de búsqueda; no leído); Kganyago et al. (2020) (resumen de búsqueda); European Journal of Remote Sensing (2021), https://doaj.org/article/ddb92b0737294a00a2812f7f5159bd8c (resumen).

## Nubosidad en la temporada de lluvias: rellenado de huecos de Sentinel-2 con radar (Lasko 2022)

La nubosidad es la principal limitación de las series ópticas en la temporada de lluvias. Lasko (2022) recuerda que en el este de Norteamérica más de 60 % de las observaciones diarias de MODIS estaban nubladas, y que en Sudamérica ecuatorial, África y el Sudeste asiático la cobertura supera 75 % del tiempo (citando a
otro estudio). Para evaluar el rellenado, el autor usó Sentinel-1 de banda C con eliminación de ruido, UAVSAR de banda L y textura GLCM, con modelos de bosque aleatorio, máquinas de vectores de soporte, gradient boosting y un conjunto, en el río Pee Dee (Carolina del Sur, EE. UU.), a lo largo de tres temporadas. En
septiembre, el mejor modelo predijo el NDVI de Sentinel-2 con R² = 0.868 (MAE = 0.094) y el NDWI con R² = 0.91; en enero y en junio, sin UAVSAR, el R² bajó a 0.60 (NDVI en enero) y llegó a 0.72 (NDVI en junio, MAE = 0.142). Los errores más altos aparecieron sobre suelo desnudo y bosque. Para el proyecto, el dato útil
es que el radar puede rellenar huecos de Sentinel-2 con R² de 0.6 a 0.9 según la fecha y el sensor. El hueco de junio en las parcelas de Hidalgo sería un caso de prueba natural, pero el estudio es de otro clima y otro cultivo, así que su transferencia es una hipótesis.

Fuente: Lasko, K. (2022), Gap filling cloudy Sentinel-2 NDVI and NDWI pixels with multi-frequency denoised C-band and L-band SAR, texture, and shallow learning techniques, Remote Sensing 14(17):4221, doi 10.3390/rs14174221.

## Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** Nuestros experimentos de fenología muestran una correlación de la fecha de pico o de la meseta con el rendimiento. → **Corrección:** Los pipelines de fenología no leyeron etiquetas de rendimiento; sólo hay correlaciones entre parámetros de la curva y entre métodos. Cualquier cifra de
  rendimiento debe marcarse como no documentada en el corpus.
- **Afirmación errónea:** La cobertura de espiga de la cebada se puede medir con Sentinel-2 o PlanetScope. → **Corrección:** La espiga requiere píxeles de unos 0.3 mm; los satélites miden el dosel y la senescencia, no la espiga (Bak et al. 2025, que es de arroz, y referencias de trigo).
- **Afirmación errónea:** El NDVI de Planet y el de Sentinel-2 son equivalentes. → **Corrección:** Tienen r = 0.991, pero Planet es +0.075 mayor en promedio; LAI difiere en +1.12. Hay que conservar la identidad del sensor.
- **Afirmación errónea:** HLS a 30 m es adecuado para parcelas de 1 ha. → **Corrección:** Una parcela de 1 ha tiene sólo 1–4 píxeles puros de 30 m; la parcela de 0.35 ha tiene unos 4 píxeles, todos de borde.
- **Afirmación errónea:** La caída de NDVI al final de la temporada siempre indica senescencia. → **Corrección:** El NDVI cae al inicio del llenado de grano en trigo sin cambio visual del verdor, y el rastrojo mantiene el NDVI después de la cosecha; la caída debe leerse con cuidado.
- **Afirmación errónea:** El corte del 31 de octubre no afecta la fenología. → **Corrección:** Con Planet NDVI, 65.5 % de las parcelas perdieron menos del 50 % de la amplitud, y con el HLS binario 114 de 197 parcelas no lo habían hecho.
- **Afirmación errónea:** El NDVI de Sentinel-2 oficial y el crudo son intercambiables. → **Corrección:** La relación es multiplicativa (pendiente 1.118); con el modelo aditivo c = 0.0204 el error baja de 0.028 a 0.012. No se deben mezclar niveles sin armonizar.
- **Afirmación errónea:** La mancha verde de enero a mayo indica suelo fértil. → **Corrección:** Puede indicar riego, forrajes o malezas, con efectos opuestos sobre el rendimiento; debe separarse en componentes.
- **Afirmación errónea:** La fecha de greenup50 es la fecha de emergencia o siembra. → **Corrección:** greenup50 es el cruce del 50 % de la amplitud del verdeo; es una aproximación al desarrollo, no una fecha de siembra ni de emergencia observada.
- **Afirmación errónea:** El NDVI nunca satura, así que el pico siempre refleja biomasa. → **Corrección:** Huete et al. (2002) mostraron que el NDVI se estabiliza asintóticamente en biomasa alta; el EVI conserva sensibilidad en esos casos.
- **Afirmación errónea:** HLS tiene bandas red-edge en todos sus componentes. → **Corrección:** HLSL30 (Landsat 8 y 9) no tiene red-edge; sólo HLSS30 (Sentinel-2) las tiene.
- **Afirmación errónea:** PlanetScope tiene exactamente 3 m de resolución en todos sus productos. → **Corrección:** El tamaño de píxel nadir nativo se reporta como 3.7 m; los productos remuestreados y ortorrectificados se citan como de unos 3 m, y algunos artículos usan 4 m.
- **Afirmación errónea:** El MTCI de MERIS y el de Sentinel-2 son el mismo índice con los mismos valores. → **Corrección:** Comparten el diseño de Dash y Curran (2004), pero la forma de Sentinel-2 usa centros de banda de 740, 705 y 665 nm; los valores no son comparables directamente.
- **Afirmación errónea:** La relación de Anderegg et al. (2020) entre PSRI y rendimiento es r = 0.17–0.37 para el PSRI. → **Corrección:** Ese rango corresponde a la calificación visual de senescencia retrasada frente a rendimiento; el PSRI llegó a r = 0.369 en 2016 en el mismo estudio.
- **Afirmación errónea:** El método FAO de Gómez Mercado et al. (2009) está publicado en Agrociencia. → **Corrección:** Se publicó en Agricultura Técnica en México 35(1):13-23 (2009).

- **Afirmación errónea:** El índice de daño de cultivo (CDI) predice la pérdida de rendimiento de cebada con R² = 0.91 en Canadá. → **Corrección:** El resumen de la EGU24 reporta R² = 0.91 en cebada y 0.83 en trigo de invierno en parcelas del sur de Australia; es un resumen de congreso, no un artículo revisado.
- **Afirmación errónea:** El conteo de espigas tiene R² de 0.05–0.30 con el rendimiento en trigo duro (Fernandez-Gallego et al. 2018). → **Corrección:** El resumen reporta una correlación significativa del conteo automático con el rendimiento, mayor con imágenes en antesis; el rango de R² no aparece en el resumen.
- **Afirmación errónea:** La r = 0.23–0.63 de Hassan et al. (2018) relaciona cada índice con el rendimiento. → **Corrección:** Es el rango de correlaciones entre los índices, el peso de mil granos y el rendimiento.
- **Afirmación errónea:** El error de 6.5 días en la fecha de cosecha con coherencia de Sentinel-1 viene de Kazajistán. → **Corrección:** El estudio de coherencia más cercano es de Ontario, Canadá (2019), con 85 % de exactitud; el error de 6.5 días no se encontró.
- **Afirmación errónea:** Los RMSE de 6.6–7 días con Planet Fusion son de espigamiento del arroz. → **Corrección:** Son de la fecha de floración del arroz en Nueva Gales del Sur, Australia (Jha et al. 2026).
- **Afirmación errónea:** Con cultivos intercalados, PlanetScope resuelve la estimación en parcelas pequeñas. → **Corrección:** En maíz intercalado de Malaui, PlanetScope de 3 m sólo mejoró marginalmente el R² (0.52, frente a 0.51 de Sentinel-2) (Li et al. 2022).

- **Afirmación errónea:** El RMSE de 7.7 días con Sentinel-2 mide la fecha de espigamiento. → **Corrección:** Zhao et al. (2025) reportan 7.66 días para la floración (R² = 0.7) y 8.67 días para la hoja bandera (R² = 0.61); el espigamiento no aparece en la página consultada.
- **Afirmación errónea:** El r = −0.56 del día del pico VH/VV de Rothamsted es de cebada. → **Corrección:** Es de trigo de invierno en Harpenden (temporadas 2017–2019; Vavlas et al. 2020).
- **Afirmación errónea:** Según INIFAP 2017, la cebada de temporal florece entre 46 y 72 días. → **Corrección:** La ficha de la variedad Adabella (INIFAP 2008, Valles Altos) da 48 a 72 días de floración y 90 a 132 días de madurez fisiológica; el año 2017 y el rango de 46 días no se confirmaron.
- **Afirmación errónea:** Un compuesto de suelo desnudo con NBR2 < 0.075 da R² de 0.5–0.6 para textura. → **Corrección:** El umbral usado en la literatura es NBR2 < 0.05 (Dvorakova et al. 2022); el error reportado para carbono orgánico es un RMSE de 3.5 ± 0.3 g C/kg, y no hay R² de textura en la fuente consultada.
- **Afirmación errónea:** El estudio de Terra Latinoamericana (2023) estima el rendimiento de cebada en Durango. → **Corrección:** Es de maíz forrajero en Bermejillo, Durango; su mejor modelo con Sentinel-2 tuvo R² = 0.66 (Cano-Mejía et al. 2023).
- **Afirmación errónea:** El rellenado de nubes con radar de Lasko (2022) vale para el Altiplano mexicano. → **Corrección:** El estudio es del río Pee Dee, en Carolina del Sur (EE. UU.), con R² de 0.60 a 0.91 según fecha e índice; su transferencia a otro clima y cultivo es una hipótesis.

## Preguntas y respuestas

**P:** ¿Qué resolución nativa tienen las bandas red-edge de Sentinel-2 en el proyecto?
**R:** Las bandas red-edge (B05, B06, B07, B8A) y SWIR (B11, B12) se distribuyen principalmente a 20 m; las visibles y NIR de uso frecuente, a 10 m. En el proyecto, las de 20 m se remuestrearon a 10 m por vecino más cercano.

**P:** ¿Por qué HLS no sirve para índices red-edge?
**R:** HLS sí tiene red-edge, pero sólo en su componente S30 (derivado de Sentinel-2). Su componente L30 (HLSL30, de Landsat 8 y 9) no tiene bandas red-edge.

**P:** ¿Cuántos píxeles puros de HLS caben en una parcela de 1 ha?
**R:** Según un cálculo propio con un margen de un píxel, entre 1 y 4 píxeles de 30 m. Sentinel-2 de 10 m tiene 49–64; PlanetScope de 3 m, más de 800.

**P:** ¿Cuál es el criterio de calidad de nubes del proyecto?
**R:** Una observación falla si cloud_pct es mayor que 20 % o falta. Con todos los criterios de calidad, pasan 80.9 % de las filas de Sentinel-2 entre abril y octubre de 2025.

**P:** ¿Qué diferencia hay entre el NDVI de Planet y el de Sentinel-2 en las mismas fechas?
**R:** Tienen r = 0.991 (n = 3,819 parejas). Planet es +0.075 mayor en promedio, con una regresión 0.063 + 1.035 × S2.

**P:** ¿Por qué el pico de NDVI no basta para estimar el rendimiento de cebada?
**R:** Porque el NDVI satura en dosel cerrado y el pico refleja biomasa, no número de granos. En el corpus, el pico suavizado de Sentinel-2 varía sólo de 0.69 a 0.84 entre parcelas, y la información útil está en su tiempo y en la bajada.

**P:** ¿El corte del 31 de octubre trunca la fenología de nuestros datos?
**R:** Sí, en parte. Con Planet NDVI, 65.5 % de las parcelas perdieron menos del 50 % de su amplitud hasta el 31 de octubre (99.5 % con datos hasta el 31 de diciembre, en modo retrospectivo). Con el HLS binario, 114 de 197 parcelas no habían perdido la mitad de su amplitud.

**P:** ¿Qué correlación con rendimiento encontraron nuestros experimentos de fenología?
**R:** Ninguna documentada. Los pipelines A1, A2 y F1 no leyeron etiquetas de rendimiento. Sus correlaciones son internas, por ejemplo plateau con pico (r = 0.952) o K con plateau (r = 0.517) en Planet NDVI.

**P:** ¿En qué municipios se concentra el colapso del dosel de A2?
**R:** En Chignahuapan, con 23 de sus 100 parcelas, y en Calpulalpan, con 7 de 44. Son 30 de 197 parcelas en total, con el colapso entre el 14 de julio y el 3 de agosto de 2025.

**P:** ¿Qué pasa si se ajusta la curva de Bak a Planet NDVI?
**R:** En 19.3 % de los ajustes d1 = d0, la curva se detiene en el punto de inflexión, y en 4.6 % la curvatura a es cero. K tiene un error estándar 7.2 veces mayor que plateau_level, por lo que se recomienda usar plateau_level y su tiempo.

**P:** ¿Cuál es la cifra de cobertura de panícula de arroz que se sugiere trasladar a la cebada?
**R:** K, la meseta de la curva, con r = 0.87 con el rendimiento en 152 parcelas de arroz (Bak et al. 2025). Su traslado a la cebada es una hipótesis: la espiga de cebada no se ve desde satélite, así que se sugiere usar la forma de la curva con un dosel continuo, no la máscara de espiga.

**P:** ¿Qué se sabe del estrés por calor en cebada de temporal?
**R:** En trigo de la India, la senescencia se aceleró tras exposiciones por encima de 34 °C (Lobell et al. 2012). Para el Altiplano, no hay evidencia publicada en el corpus; el calor debe tratarse como hipótesis y el frío nocturno como un riesgo más probable.

**P:** ¿Qué fuente de precipitación usar para el análisis de lluvia del proyecto?
**R:** Depende del análisis. AgERA5 es la fuente preferida de los pipelines de fenología, con datos hasta el 31 de octubre de 2025. CHIRPS tiene malla de 0.05° y ERA5-Land de unos 9 km; ambos son de soporte más amplio que una parcela.

**P:** ¿Qué transforma el MTCI de Sentinel-2 en la fórmula de MERIS?
**R:** El ESA SNAP usa (B6 − B5)/(B5 − B4), con centros de 740, 705 y 665 nm. El diseño viene de Dash y Curran (2004) para MERIS, pero los valores no son comparables directamente con los de MERIS.

**P:** ¿Por qué el NDVI puede subestimar la diferencia entre parcelas de biomasa alta?
**R:** Porque satura: Huete et al. (2002) mostraron que el NDVI se estabiliza en biomasa alta, mientras el EVI sigue variando. En nuestro caso, el pico de NDVI de Sentinel-2 varía sólo de 0.69 a 0.84 entre parcelas.

**P:** ¿Qué hace el suavizado de Whittaker frente al de Savitzky–Golay?
**R:** Eilers (2003) propuso el de Whittaker con penalización continua de la suavidad (parámetro λ), rápido, con interpolación automática de huecos y validación cruzada. Savitzky–Golay usa una ventana y un grado de polinomio. En nuestro pipeline se usa Whittaker con λ = 100 y Savitzky–Golay no se usa.

**P:** ¿En qué revista se publicó el artículo de Gómez Mercado et al. sobre cebada maltera y el método FAO?
**R:** En Agricultura Técnica en México, volumen 35, número 1, páginas 13–23, en 2009. No es Agrociencia.

**P:** ¿Qué precisión tiene la estimación de rendimiento con satélite en parcelas pequeñas intercaladas?
**R:** En 150 parcelas de maíz de pequeños productores del sur de Malaui, con parcela media de 0.17 ha y cerca de la mitad intercalada con leguminosas, Sentinel-2 dio R² = 0.51 y PlanetScope de 3 m dio R² = 0.52 (nRMSE de 19.95 %; Li et al. 2022). Es una referencia de maíz, no de cebada.
