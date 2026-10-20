---
id: rag-14-clima
titulo: Clima y riesgo climático en el Altiplano central: lluvia de temporal, heladas, sequía e índices agroclimáticos
categoria: clima
etiquetas: [clima de temporal, altiplano central, heladas, sequía, spi, spei, grados-día, chirps, chirts-era5, enso]
idioma: es
fecha: 2026-10-18
fuentes_internas: [01_reto_agrocebada_y_datos.md, 03_agronomia_cebada_altiplano.md, 04_amplitud_significados.md]
fuentes_externas: [https://smn.conagua.gob.mx/es/climatologia/monitor-de-sequia/monitor-de-sequia-en-mexico, https://doi.org/10.1175/2009JCLI2909.1, https://doi.org/10.5194/hessd-2-1221-2005, https://doi.org/10.1016/S0168-1923(97)00027-0, https://doi.org/10.1175/2009JCLI3080.1,
https://doi.org/10.1007/s00382-014-2106-8, https://doi.org/10.29312/remexca.v13i2.2587, https://doi.org/10.20937/ATM.52430, https://www.redalyc.org/pdf/461/46142593002.pdf, https://www.gob.mx/cms/uploads/attachment/file/785210/TEMA_4_CAMBIO_CLIMATICO.pdf, https://doi.org/10.13031/2013.26773,
https://doi.org/10.1038/sdata.2015.66, https://doi.org/10.28940/terra.v43i.1953, https://smadsot.puebla.gob.mx/images/Cambio-climatico/anteriores/Reporte_Quincenal_SMADSOT_150525.pdf, https://www.unotv.com/nacional/sequia-baja-de-29-en-2024-a-13-7-en-2025-pero-persisten-focos-rojos/,
https://www.milenio.com/comunidad/hidalgo-seis-meses-sin-ninguna-condicion-de-sequia, https://www.elsiglodetorreon.com.mx/noticia/2026/canicula-2026-cuando-termina-la-epoca-mas-calurosa-del-ano-y-estados-afectados.html]
---

# Clima y riesgo climático en el Altiplano central

## Resumen

La cebada maltera de temporal de Hidalgo, Puebla y Tlaxcala crece de forma casi exclusiva con la lluvia del ciclo primavera-verano, así que la variabilidad de las lluvias, las heladas tempranas y tardías y las sequías intraestivales son los factores climáticos que más pesan en el rendimiento. Este documento reúne lo
que se puede afirmar con fuentes verificables (SMN, SMADSOT Puebla, literatura arbitrada y estudios en Tlaxcala y el Valle de Toluca), señala lo que no pudo verificarse (normales de estación del SMN, daños por granizo y sequías específicas de 2011 y 2019–2024) y explica cómo calcular índices agroclimáticos con los
rasters mensuales del reto (CHIRPS y CHIRTS-ERA5, 2022–2025). Las cifras de la temporada 2025 provienen de fuentes oficiales estatales o de prensa, marcadas como tales.

## Régimen de lluvia de temporal: Puebla como referencia estatal

La lluvia del Altiplano se concentra en el verano. Un dato oficial útil es el del Puebla: según el reporte quincenal de la Secretaría de Medio Ambiente, Desarrollo Sustentable y Ordenamiento Territorial (SMADSOT) de Puebla, con datos de CONAGUA, la lluvia acumulada en 2024 fue de 1191 mm, 149 mm menor que el promedio
de los últimos 39 años. Ese promedio, derivado de la misma cifra, es de unos 1340 mm al año a escala estatal (1191 + 149). Es un promedio de todo el estado, que incluye zonas templadas, de valle y de montaña; no sirve como normal de una parcela. Las normales climatológicas por estación del SMN (1981–2010 o 1991–2020)
no pudieron descargarse en esta ronda; cualquier cifra por municipio debe tomarse de ese origen y no de sitios de terceros.
Fuente: SMADSOT Puebla, Reporte quincenal 15 de mayo de 2025, https://smadsot.puebla.gob.mx/images/Cambio-climatico/anteriores/Reporte_Quincenal_SMADSOT_150525.pdf (consultado en la ronda 4). Interno: 01_reto_agrocebada_y_datos.md (rasters mensuales de precipitación).

## Temperatura media de Puebla en 2024

Según el mismo reporte de SMADSOT, la temperatura media del estado de Puebla en 2024 fue 1.5 °C superior al promedio histórico de 17.8 °C del periodo 1985–2024, y el reporte describe un aumento de la temperatura media en los últimos 12 años de la serie. La cifra es estatal y anual. Para el reto, la temperatura
relevante es la del ciclo abril–octubre, que se calcula a partir de los rasters mensuales de CHIRTS-ERA5 y no de este promedio anual.
La anomalía se compara con un promedio de 40 años (1985–2024). Para el reto, la serie CHIRTS-ERA5 solo tiene cuatro años (2022–2025) y no permite fijar una referencia robusta; la línea base larga debe venir de CHIRTS-daily, cuya serie base abarca 1983 a 2016 (Verdin et al., 2020).
Fuente: SMADSOT Puebla, reporte quincenal de mayo de 2025 (https://smadsot.puebla.gob.mx/images/Cambio-climatico/anteriores/Reporte_Quincenal_SMADSOT_150525.pdf).

## Abril de 2025 en Puebla: lluvia muy por debajo de lo normal

El reporte de SMADSOT indica que en abril de 2025 se registraron 11.3 mm de precipitación en el estado de Puebla, lo que representa un decremento de cerca de 75 % frente al promedio histórico de 1985–2024. Es un dato de un mes y de escala estatal. Un solo mes de escala estatal no permite inferir el rendimiento de una
parcela.
El reporte compara con el histórico de 1985 a 2024. Un solo mes seco no equivale a sequía en la escala del Monitor, que para sus índices de lluvia usa ventanas de 30, 90, 180 y 365 días (SMN).
El reporte es de Puebla y no describe Hidalgo ni Tlaxcala, así que no puede extrapolarse a la zona de temporal de esos estados sin datos locales.
Fuente: SMADSOT Puebla, reporte quincenal de mayo de 2025 (https://smadsot.puebla.gob.mx/images/Cambio-climatico/anteriores/Reporte_Quincenal_SMADSOT_150525.pdf).

## El Monitor de Sequía en México: qué mide y con qué escala

El Monitor de Sequía en México (MSM), del Servicio Meteorológico Nacional (SMN, CONAGUA), es el producto oficial de seguimiento de sequía. Combina varios indicadores: el Índice Estandarizado de Precipitación (SPI) a 30, 90, 180 y 365 días; la anomalía de lluvia en porcentaje de lo normal (30, 90, 180 y 365 días); el
Índice Satelital de Salud de la Vegetación (VHI); un modelo de humedad de suelo tipo "leaky bucket" del CPC-NOAA; el NDVI; la anomalía de temperatura media; el porcentaje de agua disponible en presas y la opinión de expertos locales. Las regiones con sequía se delimitan por consenso, con cinco intensidades: D0
anormalmente seco, D1 sequía moderada, D2 sequía severa, D3 sequía extrema y D4 sequía excepcional. Desde 2014 el MSM se emite cada quince días.
Fuente: SMN, Monitor de Sequía en México, metodología (https://smn.conagua.gob.mx/es/climatologia/monitor-de-sequia/monitor-de-sequia-en-mexico, consultada en la ronda 4).

## Conteo de municipios afectados por sequía: regla de 40 %

Para el periodo 2003 a 2015, el SMN asignó la categoría de sequedad o sequía (D0 a D4) a un municipio cuando esa categoría cubría al menos 40 % de su superficie. Después la asignación cambió a un criterio de consenso sobre polígonos. Esto importa al comparar años: un conteo de municipios afectados de 2010 no es
directamente comparable con uno de 2024 sin revisar el criterio de la hoja de cálculo de cada año.
El archivo de municipios del SMN incluye desde anormalmente seco (D0) hasta sequía excepcional (D4), así que un municipio contado como afectado puede estar solo en la categoría D0. Al usar esos conteos hay que declarar la categoría mínima empleada.
Fuente: SMN, Monitor de Sequía en México, sección «Contabilidad de municipios con sequía» (https://smn.conagua.gob.mx/es/climatologia/monitor-de-sequia/monitor-de-sequia-en-mexico).

## Canícula: la reducción de lluvia de julio y agosto

En México, la canícula es una disminución temporal de la lluvia, no los días más calurosos del año. Según un especialista del SMN citado por la prensa, puede empezar en junio o extenderse hasta septiembre, dura entre 20 y 40 días y se concentra sobre todo en julio y agosto. No tiene fecha fija de inicio ni de fin, y en
la fecha de publicación de la nota no existía un método para pronosticarla con anticipación (prensa). Para el reto, conviene revisar la lluvia de julio y agosto por separado y no solo el acumulado anual.
Fuente: El Siglo de Torreón, «Canícula 2026: cuándo termina la época más calurosa del año» (prensa, https://www.elsiglodetorreon.com.mx/noticia/2026/canicula-2026-cuando-termina-la-epoca-mas-calurosa-del-ano-y-estados-afectados.html). Dato de duración sin boletín oficial verificado: marcado como prensa.

## Heladas de invierno en el Altiplano: fuente del aire polar

En el centro y norte de México, las temperaturas menores de 0 °C se presentan sobre todo entre noviembre y febrero, cuando entra aire polar continental, generalmente seco, desde el norte (CENAPRED, 2021, citado en Jasso-Miranda et al., 2022). Con esa referencia, las heladas de invierno quedan fuera del ciclo de
temporal de abril a octubre; el artículo no cuantifica su efecto en cebada. Su evidencia es regional (Valle de Toluca), no de Tlaxcala o Hidalgo.
El artículo aporta además la ventana típica del fenómeno (noviembre a febrero) y su origen (aire polar continental, seco, desde el norte), que sirven para acotar el riesgo en el calendario de siembra de otoño.
Fuente: Jasso-Miranda, M., Soria-Ruiz, J. y Antonio-Némiga, X. (2022). Pérdida de superficies cultivadas de maíz de temporal por efecto de heladas en el valle de Toluca. Revista Mexicana de Ciencias Agrícolas 13(2). https://doi.org/10.29312/remexca.v13i2.2587.

## Heladas en el ciclo de temporal: mayo y agosto en Toluca 2019

En el estudio del valle de Toluca, las temperaturas mínimas diarias de mayo a octubre de 2019 se analizaron con el umbral de 4 °C, que afecta el crecimiento del maíz. Los meses con más superficie por debajo de ese umbral fueron mayo y agosto, con más de 40 % del área de estudio, sobre todo en laderas. En octubre la
mayor superficie registró temperaturas menores de 0 °C, en zonas de montaña del oeste, noroeste y suroeste de la zona. Recomendación: revisar las fechas de siembra y de madurez, no solo el invierno, porque una helada puede ocurrir al inicio y al final del ciclo.
Para la cebada, esto significa que la ventana de helada no se limita al invierno: la fenología del cultivo debe cruzarse con las fechas de helada del año.
Fuente: Jasso-Miranda et al. (2022), https://doi.org/10.29312/remexca.v13i2.2587 (figura 3 y texto de resultados).

## Umbral de 4 °C: dato del maíz, no de la cebada

El estudio de Toluca usa como umbral crítico 4 °C de temperatura mínima para el maíz, citando a Mondragón (2005), y considera que el maíz tolera un intervalo amplio de temperatura (5 a 45 °C) y sufre daños por debajo de 4 °C. Este umbral no puede trasladarse sin cambios a la cebada, cuyos daños dependen de la etapa
fenológica (encañado, espigado y llenado). Los umbrales por etapa de cebada se revisan en el fragmento de heladas de 03_agronomia_cebada_altiplano.md y en la sección «Umbrales de helada por etapa en cebada» de 04_amplitud_significados.md (fuentes internas del corpus, no verificadas de nuevo en esta ronda).
En la práctica, el umbral debe fijarse según la etapa del cultivo y declararse en cada análisis.
Fuente: Jasso-Miranda et al. (2022), citando a Mondragón (2005), https://doi.org/10.29312/remexca.v13i2.2587; interno: 03_agronomia_cebada_altiplano.md.

## Pérdida por heladas en maíz de temporal: Toluca 2019

Con el NDVI de Landsat-8 y las temperaturas mínimas, Jasso-Miranda et al. (2022) estimaron que la helada del ciclo 2019 en el Distrito de Desarrollo Rural de Toluca provocó la pérdida de 3 511.6 ha de maíz de temporal. Esa superficie equivale a 2.77 % de los 126 500.7 ha que había al mes de julio. Los municipios con
mayor pérdida fueron Almoloya de Juárez, con 32 %, y Zinacantepec, con 18 %, del área afectada. La cifra mide superficie siniestrada en un año, no rendimiento por hectárea. Es un ejemplo de la escala de pérdida que puede provocar una helada en temporal.
La cifra mide superficie con afectación, no rendimiento por hectárea, por lo que no se traslada a t/ha de cebada.
Fuente: Jasso-Miranda et al. (2022), https://doi.org/10.29312/remexca.v13i2.2587 (resultados de superficie afectada).

## Altitud, temperatura mínima y riesgo de helada

Jasso-Miranda et al. (2022) aplicaron una técnica estadística y encontraron que la altitud, la temperatura mínima y la frecuencia de días fríos están relacionadas con la presencia de heladas. Con esas variables construyeron un mapa de áreas susceptibles con distintos niveles de riesgo. Para el Altiplano, esto justifica
usar un modelo de riesgo con la altitud del terreno (el reto incluye un modelo digital de elevación de 120 m, según 01_reto_agrocebada_y_datos.md) junto con las temperaturas mínimas, en lugar de un promedio regional. Los pesos de cada variable no se reportan en el resumen del artículo.
Como el riesgo depende de la altitud y de la frecuencia de días fríos, un índice con medias mensuales solo puede describir zonas, no parcelas, salvo que se use el modelo digital de elevación del reto junto con datos diarios.
Fuente: Jasso-Miranda et al. (2022), https://doi.org/10.29312/remexca.v13i2.2587; interno: 01_reto_agrocebada_y_datos.md (resolución del terreno).

## Granizo: lo que no se pudo verificar

No se encontró en esta ronda una fuente verificable que cuantifique la frecuencia de granizo en Hidalgo, Puebla o Tlaxcala, ni su efecto en la cebada o el maíz de temporal. La afirmación de que el granizo causa pérdidas de rendimiento en cereales de temporal sigue sin verificar. Para el análisis, el granizo no debe
tratarse como una variable documentada del reto; el tema se revisa en la sección «Factor limitante: granizo» de 03_agronomia_cebada_altiplano.md (interna).
Hasta contar con una fuente regional, el granizo debe declararse como variable ausente en el análisis y no como efecto estimado. Esa es la postura metodológica que sigue este documento.
Fuente: sin evidencia externa localizada en la ronda 4 (búsquedas en bases de literatura sin resultados para el Altiplano); interno: 03_agronomia_cebada_altiplano.md.

## Sequías de 2011 y 2019–2024: efecto en cebada y maíz de temporal

No se verificó en esta ronda una cifra de pérdida de cebada o maíz de temporal atribuida a la sequía de 2011 ni a la del periodo 2019–2024 en Hidalgo, Puebla o Tlaxcala. La búsqueda en los repositorios consultados no devolvió estudios regionales con cuantificación para esos años. El corpus interno trata la relación
entre secano y pérdidas por sequía en cebada en la sección «Literatura: secano frente a riego y pérdidas de grano por sequía» de 03_agronomia_cebada_altiplano.md. Hasta verificar una fuente, las pérdidas de 2011 y de 2019–2024 deben marcarse como no documentadas.
Además, el reto solo contiene CHIRPS de enero de 2022 a diciembre de 2025 (01_reto_agrocebada_y_datos.md), así que 2011 no puede caracterizarse con los datos del proyecto; la comparación con 2011 requiere otra fuente de lluvia.
Fuente: sin evidencia externa localizada (búsqueda en repositorios y SMN sin cifras de cebada para esos años); interno: 03_agronomia_cebada_altiplano.md.

## Sequía 2025 en el Monitor nacional: cifras de prensa que no coinciden

La prensa reportó cifras distintas del Monitor de Sequía para 2025. Según UnoTV, la superficie del país con sequía bajó de 29 % en 2024 a 13.7 % en 2025, con focos rojos persistentes (prensa). Otra nota del mismo medio, con corte al 31 de diciembre de 2025, indica que 79.9 % del territorio no tuvo afectación y 21.1 %
tuvo algún grado de sequía, desde anormalmente seco hasta excepcional, con la sequía extrema (D3) reducida de 12 % a 0.2 % (prensa). Los dos valores no son compatibles entre sí y los cortes de fecha difieren. No deben citarse como cifra oficial; hay que descargar el reporte del Monitor del SMN para el corte deseado.
Fuente: UnoTV, «La sequía baja de 29 % en 2024 a 13.7 % en 2025, pero persisten focos rojos» (prensa, https://www.unotv.com/nacional/sequia-baja-de-29-en-2024-a-13-7-en-2025-pero-persisten-focos-rojos/); cifra de 21.1 % de prensa sin enlace verificado en esta ronda.

## Hidalgo y Tlaxcala en 2025: estado de sequía según la prensa

Según la prensa, Hidalgo estuvo sin ninguna condición de sequía desde junio de 2025 en sus 84 municipios, y en agosto de 2025 fue uno de los 12 estados sin afectación en el Monitor. Tlaxcala apareció en agosto de 2025 entre los estados sin afectación en ninguno de sus municipios. En febrero de 2025 hubo lluvias por
encima del promedio en zonas puntuales de Tlaxcala y Puebla, mientras que la mayor parte del país estuvo por debajo de lo normal. Estos datos son de prensa y resumen el Monitor; para el reto deben verificarse con el reporte quincenal del SMN del mes correspondiente antes de usarlos como variable.
Fuente: Milenio, «Hidalgo, seis meses sin ninguna condición de sequía» (prensa, https://www.milenio.com/comunidad/hidalgo-seis-meses-sin-ninguna-condicion-de-sequia); UnoTV, «Disminuye sequía en México durante 2025; 13 estados no tuvieron afectación» (prensa,
https://www.unotv.com/nacional/disminuye-sequia-en-mexico-durante-2025-13-estados-no-tuvieron-afectacion/).

## ENSO y sequías en México: anomalías del Atlántico y el Pacífico

Méndez y Magaña (2010) analizaron las sequías meteorológicas prolongadas de México y Centroamérica en el siglo XX. Encontraron un patrón de "balancín" (seesaw): las sequías en el norte de México coinciden con condiciones húmedas en Mesoamérica (sur de México y Centroamérica), y viceversa. Ese patrón está ligado a
anomalías de temperatura superficial del mar tropical. Una fase positiva de la Oscilación Multidecadal del Atlántico (AMO), con el Atlántico Norte más cálido, se relaciona con sequías mayores en Norteamérica por menor flujo de humedad hacia el norte de México. La fase negativa de la Oscilación Decadal del Pacífico
(PDO) se asocia con un Chorro de Bajo Nivel del Caribe más débil y mayor actividad de ondas del este. El artículo trata sequías prolongadas, no la variabilidad de un año, así que no permite estimar el efecto de una temporada concreta sobre la lluvia de Tlaxcala.
Fuente: Méndez, M. y Magaña, V. (2010). Regional aspects of prolonged meteorological droughts over Mexico and Central America. Journal of Climate 23(5), 1175–1188. https://doi.org/10.1175/2009JCLI3080.1 (resumen consultado en Crossref).

## El Niño y sequías en México: variabilidad espacial

Bhattacharya y Chiang (2014) estudiaron la variabilidad espacial y los mecanismos de las sequías inducidas por El Niño en México. El título indica que el efecto de El Niño sobre la lluvia no es uniforme en el territorio, lo que concuerda con que el centro del país responda de forma distinta a las costas. El resumen
completo no se leyó en esta ronda; la afirmación se limita al alcance del título. La magnitud del efecto de El Niño sobre la lluvia de verano en el Altiplano, en milímetros, no está documentada en las fuentes consultadas; tratarla como hipótesis hasta revisar el artículo completo.
Fuente: Bhattacharya, A. y Chiang, J. C. H. (2014). Spatial variability and mechanisms underlying El Niño-induced droughts in Mexico. Climate Dynamics 43, 3309–3326. https://doi.org/10.1007/s00382-014-2106-8 (título verificado en Crossref).

## Índice SPI: definición y escalas

El Índice Estandarizado de Precipitación (SPI) es el índice de sequía más usado para estimar la intensidad, magnitud y extensión espacial de la sequía. Su ventaja es que se calcula para varias escalas de tiempo y puede describir sequías meteorológicas, agrícolas e hidrológicas, porque cada sistema de agua responde a
distinta escala de déficit. El método general del SPI (McKee et al., 1993; no verificado en esta ronda) ajusta una distribución de probabilidad a la lluvia acumulada en k meses y la transforma a una variable normal estándar. Para el reto, los rasters mensuales de CHIRPS permiten calcular un SPI de 3 y 6 meses por
parcela, siempre a partir de una serie de referencia de la misma ventana calendario. El MSM usa 30, 90, 180 y 365 días.
Fuente: Vicente-Serrano, S. M. y López-Moreno, J. I. (2005). Hydrological response to different time scales of climatological drought: an evaluation of the standardized precipitation index. Hydrology and Earth System Sciences Discussions 2, 1221–1252. https://doi.org/10.5194/hessd-2-1221-2005; SMN, Monitor de Sequía en
México (escalas del MSM).

## Índice SPEI: incluye evaporación potencial

El Índice Estandarizado de Precipitación-Evapotranspiración (SPEI) de Vicente-Serrano et al. (2010) amplía el SPI porque resta la evapotranspiración potencial (ET0) a la lluvia. Así, el déficit crece cuando la temperatura sube, algo que el SPI no captura. El artículo se titula «sensible al calentamiento global». Para
el reto, el SPEI requiere ET0, que no está en los datos mensuales; se estima con la ecuación de Hargreaves (sección siguiente). Recomendación metodológica: la serie de referencia debe ser de la misma ventana calendario y lo más larga posible. Con solo 4 años de datos de 2022 a 2025 (48 meses), la distribución del
índice es inestable y debe declararse como tal.
Fuente: Vicente-Serrano, S. M., Beguería, S. y López-Moreno, J. I. (2010). A multiscalar drought index sensitive to global warming: The Standardized Precipitation Evapotranspiration Index. Journal of Climate 23(7), 1696–1718. https://doi.org/10.1175/2009JCLI2909.1.

## Evapotranspiración de referencia con Tmin y Tmax: ecuación de Hargreaves

Hargreaves y Samani (1985) estimaron la evapotranspiración de referencia a partir solo de la temperatura: ET0 = 0.0023 · Ra · (Tmedia + 17.8) · (Tmax − Tmin)^0.5, con ET0 y Ra en mm/día (Ra es la radiación extraterrestre). Con los rasters de CHIRTS-ERA5 (Tmin y Tmax mensuales) puede aproximarse ET0 mensual, pero Ra
debe calcularse por latitud, porque no está en el reto. El coeficiente y la forma de la ecuación deben verificarse en el artículo original antes de un análisis formal, porque la fórmula aquí se cita de memoria de la literatura y no de una lectura del texto en esta ronda.
Fuente: Hargreaves, G. H. y Samani, Z. A. (1985). Reference crop evapotranspiration from temperature. Applied Engineering in Agriculture 1(2), 96–99. https://doi.org/10.13031/2013.26773 (título y referencia verificados en Crossref; fórmula verificada: es la ecuación 52 de FAO-56, Allen et al. 1998, «Crop
evapotranspiration», FAO Irrigation and Drainage Paper 56).

## Déficit hídrico mensual: lluvia menos evapotranspiración

El déficit hídrico mensual es la lluvia de CHIRPS (mm) menos la ET0 mensual estimada (mm). Un valor negativo en julio o agosto indica que la demanda evaporativa superó a la lluvia en ese mes. Es útil para contrastar la canícula, pero el cálculo tiene dos límites: CHIRPS es un producto de malla de unos 5 km, no un
pluviómetro por parcela, y la ET0 de Hargreaves depende de la temperatura y no de la humedad del aire ni del viento. Un déficit acumulado de abril a octubre puede compararse entre años del reto, pero no debe interpretarse como déficit real del cultivo sin un balance de agua en el suelo.
Fuente: Hargreaves y Samani (1985), https://doi.org/10.13031/2013.26773; Funk et al. (2015), https://doi.org/10.1038/sdata.2015.66 (límites de resolución de CHIRPS).

## Grados-día: una ecuación con dos interpretaciones

Los grados-día (GDD) acumulan el exceso de temperatura sobre una base. McMaster y Wilhelm (1997) muestran que la misma ecuación admite dos interpretaciones, así que dos cálculos pueden dar sumas distintas aunque usen la misma base. Para cebada no existe una base única en la literatura consultada: el corpus interno lo
trata en la sección «Temperatura base y grados-día en cebada: no hay una base única» de 04_amplitud_significados.md. Antes de comparar años en el reto hay que fijar la base, el método y la ventana de siembra. Con medias mensuales de CHIRTS-ERA5, el cálculo solo da aproximaciones mensuales, no diarias.
Fuente: McMaster, G. S. y Wilhelm, W. W. (1997). Growing degree-days: one equation, two interpretations. Agricultural and Forest Meteorology 87, 291–300. https://doi.org/10.1016/S0168-1923(97)00027-0; interno: 04_amplitud_significados.md.

## Días con helada: no pueden contarse con medias mensuales

Los rasters CHIRTS-ERA5 del reto son promedios mensuales de la temperatura mínima diaria y de la máxima diaria, en °C. No son la mínima ni la máxima absoluta del mes. Por eso, un mes con media de Tmin de 3 °C puede haber tenido días con −2 °C, y el raster no lo muestra. Contar días con helada (Tmin < 0 °C) o días bajo
4 °C requiere la serie diaria, que el reto no incluye. Cualquier variable de "días con helada" construida con los rasters mensuales es una aproximación y debe declararse así.
Para contar días con helada se requiere una serie diaria, por ejemplo CHIRTS-daily para la línea base de 1983 a 2016, declarando la fuente y la versión en el texto.
Fuente: Verdin et al. (2020), Scientific Data 7, 303, https://doi.org/10.1038/s41597-020-00643-7, y https://www.chc.ucsb.edu/data/chirts-era5 (consultado en la ronda 2 y registrado en 01_reto_agrocebada_y_datos.md).

## CHIRPS: qué representa una celda de 0.05°

CHIRPS (Climate Hazards Center InfraRed Precipitation with Stations) combina estimaciones satelitales infrarrojas con estaciones pluviométricas y cubre 50°S a 50°N desde 1981 con resolución de 0.05° (unos 5 km). En el centro de México, cada celda abarca unos 29 km². Una parcela de 5 ha es menos del 2 % de esa área, así
que el valor de CHIRPS es un promedio regional, no un dato puntual. El Climate Hazards Center advierte que las estimaciones basadas solo en satélite promedian áreas y tienden a subestimar la intensidad de eventos extremos en terreno complejo.
La validación de CHIRPS en el centro de México es escasa y depende del relieve, como se explica en el fragmento de validación regional.
Fuente: Funk, C., et al. (2015). The climate hazards infrared precipitation with stations (CHIRPS). Scientific Data 2, 150066. https://doi.org/10.1038/sdata.2015.66; https://www.chc.ucsb.edu/data/chirps (consultado en la ronda 2).

## CHIRPS frente a estaciones en México: validación regional

Rodríguez-Herrera et al. (2025) compararon CHIRPS con estaciones en tres cuencas: dos de San Luis Potosí (árida y tropical) y una templada del Estado de México. En las tres encontraron una correlación de Spearman positiva y significativa (P < 0.05). El error cuadrático medio (RMSE) fue menor de 21 mm en las regiones
templada y árida. En la cuenca tropical, CHIRPS subestimó la precipitación. La mejor concordancia se dio en la cuenca templada. El resumen no menciona altitud ni relieve montañoso, así que no hay una validación publicada de CHIRPS a más de 2 000 m en el Altiplano; ese vacío sigue abierto. Los valores de ρ por cuenca no
se reportan en el resumen consultado.
Fuente: Rodríguez-Herrera, J. G., Amante-Orozco, A., Muñoz-Robles, C. A., Pimentel-López, J., Ruiz-Vera, V. M. y Salvador-Osuna, E. (2025). Evaluación de datos de precipitación de imágenes CHIRPS en cuencas de clima seco y tropical (San Luis Potosí) y templado (Estado de México). Terra Latinoamericana 43.
https://doi.org/10.28940/terra.v43i.1953 (título y DOI verificados en Crossref).

## CHIRTS-ERA5: método y cobertura

Verdin et al. (2020) describen CHIRTS-daily, un producto cuasi-global de temperatura diaria máxima y mínima a 0.05° (unos 5 km) para 60°S a 70°N. Su serie base abarca 1983 a 2016. CHIRTS-ERA5 extiende la serie después de 2016 y es una versión de ERA5 corregida por sesgo, según el Climate Hazards Center. El artículo de
método se usa como referencia, pero la validación de CHIRTS-ERA5 en México no se localizó en esta ronda; los estudios encontrados corresponden a Kenia y Mozambique. Por eso, las temperaturas del reto deben declararse como productos de malla, no como observaciones de estación.
Fuente: Verdin, A., Funk, C., Peterson, P., Landsfeld, M., Tuholske, C. y Grace, K. (2020). Development and validation of the CHIRTS-daily quasi-global high-resolution daily temperature data set. Scientific Data 7, 303. https://doi.org/10.1038/s41597-020-00643-7; https://www.chc.ucsb.edu/data/chirts-era5 (consultado en
la ronda 2).

## Cambio climático y cebada de temporal en Tlaxcala: Calpulalpan

Calderón-García et al. (2015) modelaron con AquaCrop (FAO) la cebada del municipio de Calpulalpan, Tlaxcala, con datos de 2003 a 2012 y escenarios para 2015–2039 y 2075–2099. El rendimiento simulado (2.53 t/ha) se acercó al de los productores. Los escenarios indican aumento de aptitud en 2 % de la superficie y
reducción de hasta 16 %. Los rendimientos caen alrededor de 5 % y hasta 100 %, según el horizonte. Con costos actuales, la relación beneficio-costo podría bajar de 1.4 a 0.0. Es un estudio de un municipio con modelo de cultivo, no una proyección regional calibrada con experimentos de campo.
Fuente: Calderón-García, J. O., Monterroso-Rivas, A. I. y Gómez-Díaz, J. D. (2015). Cambio climático en el centro de México: impacto en la producción de cebada (Hordeum vulgare) en Tlaxcala. Ra Ximhai 11(5), 37–46. https://www.redalyc.org/pdf/461/46142593002.pdf (resumen y texto consultados).

## Cambio climático en cultivos de temporal de México: modelo multicultivo

Arce Romero et al. (2020) calibraron AquaCrop para 22 casos de estudio en 14 estados, con cinco modelos climáticos, dos forzamientos radiativos (RCP 4.5 y 8.5) y tres horizontes (2015–2039, 2045–2069, 2075–2099). Encontraron disminución de rendimiento en la mayoría de los casos, por menor cantidad y peor distribución
de la lluvia. El maíz en climas cálidos y secos podría perder hasta 84 % en los escenarios más severos. El frijol podría bajar 10 a 40 % en el norte, el trigo 15 % en el noroeste, y la soya podría subir 15 a 40 %. La cebada tuvo aumentos y disminuciones según la zona. Los valores dependen de escenario y modelo; no
deben generalizarse al Altiplano sin separar casos.
Fuente: Arce Romero, A., Monterroso Rivas, A. I., Gómez Díaz, J. D. y Palacios Mendoza, V. (2020). Crop yield simulations in Mexican agriculture for climate change adaptation. Atmósfera 33(3), 215–231. https://doi.org/10.20937/ATM.52430.

## Escenarios institucionales para el maíz de temporal

Una presentación del INECC (2022) con cifras atribuidas a CONAGUA resume que, sin medidas de adaptación, los rendimientos agrícolas podrían bajar entre 5 % y 20 % en las próximas dos décadas y hasta 80 % a finales de siglo para algunos cultivos y estados. Los estados con mayor aptitud actual para maíz de temporal
podrían perder entre 30 % y 40 % de rendimiento a finales de siglo. Hoy hay 23 estados con rendimientos de maíz de temporal superiores a 1 t/ha; a finales de siglo serían 11. Es un informe institucional de presentación, no un artículo arbitrado, y no es específico de cebada.
Fuente: Hernández Rivera, E. (2022). El cambio climático en México y las medidas de adaptación urgentes. INECC, presentación, mayo de 2022. https://www.gob.mx/cms/uploads/attachment/file/785210/TEMA_4_CAMBIO_CLIMATICO.pdf.

## Lo que el reto puede y no puede decir sobre clima

Los datos del reto son de malla: CHIRPS de precipitación mensual (48 rasters, enero de 2022 a diciembre de 2025, en mm) y CHIRTS-ERA5 de Tmin y Tmax mensuales (48 rasters cada una, en °C). Con ellos pueden calcularse índices de déficit, anomalías respecto a una referencia y amplitud térmica mensual, pero no días con
helada, fechas de helada, granizo ni humedad del suelo. Cualquier conclusión sobre heladas o granizo a nivel de parcela debe decir que proviene de una variable que el reto no mide directamente. Las cifras de los experimentos del proyecto no se describen aquí.
Con 48 meses, la serie no basta para fijar una climatología; cualquier anomalía necesita una referencia externa larga, como la serie base de CHIRTS-daily (1983–2016).
Fuente: 01_reto_agrocebada_y_datos.md (sección «Clima: precipitación CHIRPS» y «Clima: temperaturas mínima y máxima CHIRTS-ERA5»).

## Índices agroclimáticos con los datos mensuales del reto: procedimiento

Un procedimiento razonable con los 48 meses disponibles es: (1) calcular la lluvia acumulada de abril a octubre por parcela desde CHIRPS; (2) calcular un SPI a 3 meses para julio–agosto (canícula); (3) calcular ET0 mensual con Hargreaves y el déficit P − ET0; (4) calcular grados-día con una base declarada, por ejemplo
0 °C para la fase de siembra a espigado, y con la aproximación mensual (ver el fragmento de grados-día); (5) declarar que los años 2022–2025 son una serie muy corta y que el SPI o SPEI de 12 meses no es estable. Ningún resultado de este procedimiento es una validación del efecto climático sobre el rendimiento: es un
conjunto de variables candidatas (hipótesis).
Fuente: Vicente-Serrano y López-Moreno (2005), https://doi.org/10.5194/hessd-2-1221-2005; Vicente-Serrano et al. (2010), https://doi.org/10.1175/2009JCLI2909.1; Hargreaves y Samani (1985), https://doi.org/10.13031/2013.26773. Procedimiento propuesto por el autor del fragmento (hipótesis metodológica, no resultado).

## Temporada 2025 en la región: qué fuentes oficiales hay

En la ronda 4 se consultaron los reportes de SMADSOT Puebla, que son fuentes estatales oficiales, y no se localizó un resumen anual de 2025 del SMN por estado ni de Hidalgo o Tlaxcala. Del reporte de Puebla se pueden citar la temperatura media de 2024 (+1.5 °C) y la lluvia de abril de 2025 (11.3 mm, −75 %). Para el
resto de la temporada 2025 y para Hidalgo y Tlaxcala, la información disponible es de prensa, en especial sobre el Monitor de Sequía, y debe marcarse así. El reporte quincenal del SMN del mes de interés es la fuente oficial que debe descargarse antes de dar un dato de 2025 en un documento de proyecto.
Fuente: SMADSOT Puebla, reporte quincenal de mayo de 2025 (https://smadsot.puebla.gob.mx/images/Cambio-climatico/anteriores/Reporte_Quincenal_SMADSOT_150525.pdf); prensa citada en los fragmentos de sequía 2025.

## Heladas tardías y calidad del grano: límites de la evidencia

Las heladas tardías, cercanas a la madurez, pueden afectar el llenado y la calidad maltera. En el corpus interno, la evidencia sobre heladas tardías proviene de trigo de temporal en Valles Altos y de cebada en otros países, no de cebada del Altiplano. La relación entre helada tardía y peso hectolítrico o germinación en
cebada del Altiplano no está documentada en las fuentes verificadas de esta ronda. El corpus interno trata el tema en las secciones «Heladas posteriores a la emergencia de la espiga» y «Calor de llenado y calidad maltera» de 04_amplitud_significados.md.
Cualquier estimación de daño por helada tardía en el reto debe tratarse como hipótesis hasta contar con datos diarios de temperatura.
Fuente: sin evidencia externa localizada para cebada del Altiplano (ronda 4); interno: 04_amplitud_significados.md.

## Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** Los rasters CHIRTS-ERA5 dan la temperatura mínima del mes → **Corrección:** Son promedios mensuales de la temperatura mínima diaria, en °C; no son la mínima absoluta del mes.
- **Afirmación errónea:** Con los rasters mensuales se cuentan los días con helada de cada parcela → **Corrección:** No se puede; hace falta la serie diaria de Tmin. Un mes con media alta puede tener días bajo 0 °C.
- **Afirmación errónea:** El valor de CHIRPS es la lluvia de la parcela → **Corrección:** Es el promedio de una celda de 0.05° (unos 29 km² en el centro de México). Una parcela de 5 ha es menos del 2 % de esa área.
- **Afirmación errónea:** El umbral de 4 °C aplica a la cebada → **Corrección:** Es el umbral usado para maíz en Toluca (Jasso-Miranda et al., 2022); la cebada tiene umbrales por etapa fenológica.
- **Afirmación errónea:** Los grados-día se calculan igual en todos los estudios → **Corrección:** McMaster y Wilhelm (1997) muestran dos interpretaciones de la misma ecuación; hay que declarar la base y el método.
- **Afirmación errónea:** El SPI y el SPEI son equivalentes → **Corrección:** El SPEI resta la evapotranspiración potencial y responde al calentamiento; el SPI solo usa la lluvia (Vicente-Serrano et al., 2010).
- **Afirmación errónea:** La sequía de 2025 afectó 13.7 % o 21.1 % del territorio → **Corrección:** Son cifras de prensa con cortes distintos que no coinciden entre sí; debe usarse el reporte oficial del Monitor del SMN para la fecha de interés.
- **Afirmación errónea:** Calpulalpan representa todo el Altiplano → **Corrección:** Es un estudio de un municipio con AquaCrop (Calderón-García et al., 2015); la generalización requiere más casos.

## Preguntas y respuestas

**P:** ¿Qué indica el Monitor de Sequía de México (MSM) para medir sequía?
**R:** Combina el SPI a 30, 90, 180 y 365 días, la anomalía de lluvia en porcentaje de lo normal, el VHI, un modelo de humedad de suelo, el NDVI, la anomalía de temperatura, el agua disponible en presas y opinión de expertos. Clasifica en D0 a D4 (SMN).

**P:** ¿Cuáles son las categorías de sequía del MSM?
**R:** D0 anormalmente seco, D1 sequía moderada, D2 sequía severa, D3 sequía extrema y D4 sequía excepcional (SMN, Monitor de Sequía en México).

**P:** ¿Con qué frecuencia se emite el MSM?
**R:** Desde 2014 se emite cada quince días; los mapas de mediados de mes se usan para cuantificar la sequía nacional (SMN).

**P:** ¿Cuánta lluvia recibe Puebla en promedio al año?
**R:** A escala estatal, el promedio 1985–2024 se deriva del reporte de SMADSOT: 1191 mm en 2024 fueron 149 mm menos que el promedio, es decir unos 1340 mm. Es un promedio estatal, no el de una parcela.

**P:** ¿Qué temperatura media tuvo Puebla en 2024?
**R:** 1.5 °C por encima del promedio histórico de 17.8 °C del periodo 1985–2024 (SMADSOT Puebla).

**P:** ¿Qué heladas afectan al maíz de temporal en Toluca y con qué umbral?
**R:** Las temperaturas mínimas por debajo de 4 °C afectaron el crecimiento del maíz; en 2019 mayo y agosto tuvieron más de 40 % del área por debajo de ese umbral (Jasso-Miranda et al., 2022).

**P:** ¿Cuánta superficie de maíz de temporal se perdió por heladas en Toluca en 2019?
**R:** 3 511.6 ha, equivalentes a 2.77 % de los 126 500.7 ha que había en julio (Jasso-Miranda et al., 2022).

**P:** ¿Puede CHIRPS usarse como lluvia puntual de cada parcela?
**R:** No. Es un producto de malla de 0.05° (unos 5 km). Su validación regional (Rodríguez-Herrera et al., 2025) cubre cuencas de San Luis Potosí y del Estado de México, y no se localizó validación en el Altiplano a más de 2 000 m (Funk et al., 2015; Rodríguez-Herrera et al., 2025).

**P:** ¿Cuál es la diferencia entre SPI y SPEI?
**R:** El SPI usa solo la lluvia; el SPEI resta la evapotranspiración potencial y por eso responde al aumento de temperatura (Vicente-Serrano et al., 2005 y 2010).

**P:** ¿Qué escenario de cambio climático afecta la cebada de Tlaxcala?
**R:** En Calpulalpan, los escenarios reducen la aptitud hasta 16 % de la superficie y el rendimiento de 5 % hasta 100 %, según el horizonte (Calderón-García et al., 2015).

**P:** ¿Qué pérdidas de maíz de temporal prevé el INECC a finales de siglo?
**R:** Hasta 30 % a 40 % en los estados con mayor aptitud actual, y hasta 80 % en algunos cultivos y estados sin adaptación (Hernández Rivera, INECC, 2022; cifras atribuidas a CONAGUA).

**P:** ¿Cómo influye El Niño en la sequía del centro de México?
**R:** Bhattacharya y Chiang (2014) documentan sequías inducidas por El Niño con variabilidad espacial. La magnitud en el Altiplano no está documentada en las fuentes verificadas.

**P:** ¿Hay datos verificados de granizo para la región?
**R:** No en esta ronda. El granizo queda como variable no documentada.

**P:** ¿Qué puede afirmarse de la canícula?
**R:** Es una reducción temporal de lluvia, típicamente de julio a agosto, de 20 a 40 días según el SMN citado por prensa (prensa). No tiene fecha fija ni es un pronóstico verificable.
