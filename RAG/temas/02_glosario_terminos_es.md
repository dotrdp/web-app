---
id: rag-02-glosario
titulo: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
categoria: glosario
etiquetas: [glosario, cebada maltera, temporal, fenología de la cebada, zadoks, índices de vegetación, rmse, validación cruzada, fuga de información, regionalismos]
idioma: es
fecha: 2026-10-18
fuentes_internas: [reto_y_datos/Diccionario_de_indices_satelitales.txt, reto_y_datos/Descripcion_general_variables_DataSet.txt, reto_y_datos/literature_review__report__sections__04_datos.typ.txt, teledeteccion_fenologia/literature_review__report__chapters__02_observacion.typ.txt,
teledeteccion_fenologia/literature_review__report__chapters__03_representaciones.typ.txt, teledeteccion_fenologia/literature_review__reports__Panicle_coverage_and_barley_yield.md, agronomia/literature_review__report__chapters__01_cebada.typ.txt,
agronomia/literature_review__report__sections__03_agronomia_literatura.typ.txt, agronomia/literature_review__research_notes__Panicle_coverage_and_barley_yield__mexico_rainfed_malting_barley.md, agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md,
agronomia/iterate_20261017__research__B2_season_2025.md, agronomia/error-spotting-ai-agent-dataset__barley-agronomy-mexico-2026-10-02__problems.csv, plagas_danos/iterate_20261017__research__B1_damage_detection.md, plagas_danos/iterate_20261017__research__A2_outlier_forensics.md,
plagas_danos/segmentation_pests_ndvi_water__research__prior_work.md, literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt, literatura_aplicacion/literature_review__report__sections__05_modelos.typ.txt,
literatura_aplicacion/literature_review__report__sections__07_economia_aplicacion.typ.txt, literatura_aplicacion/literature_review__report__sections__08b_lecturas.typ.txt, literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt,
experimentos_tabulares/iterate_20261017__research__A3_headroom.md, experimentos_tabulares/modelado__KUMO.md, validacion/iterate_20261017__research__critique_leakage.md, validacion/iterate_20261017__research__B3_small_n_methods.md,
validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md, validacion/literature_review__report__sections__06_validacion.typ.txt, experimentos_profundos/mmst-vit__docs__model_selection_20261006.md, experimentos_tabulares/dynamic_change__phenocurve__docs__F1_fits.md,
temas/03_agronomia_cebada_altiplano.md, temas/05_acelerar_crecimiento_a_costa_del_piso.md, temas/11_revision_de_literatura_y_transferencia.md, temas/13_variedades_dona_josefa_y_voyager.md]
fuentes_externas: [Zadoks, J. C., Chang, T. T. y Konzak, C. F. (1974). A decimal code for the growth stages of cereals. Weed Research, 14(6), 415-421 (referencia bibliográfica, no abierta en esta sesión); Meier, U. (ed.) (2018, versión en español). Estadios fenológicos de las plantas mono- y dicotiledóneas (monografía
BBCH), Julius Kühn-Institut, https://www.openagrar.de/servlets/MCRFileNodeServlet/openagrar_derivate_00051858/Meier_BBCH-Monograph_III%20Estadios%20fenol%C3%B3gicos%20de%20las%20plantas%20mono-%20y%20dicotiledoneas_es.pdf (consultada solo por resumen de búsqueda); SAG Chile, Metodología de evaluación de cebada,
https://www.sag.gob.cl/sites/default/files/metodologia_evaluacion_cebada.pdf (criterio de espigamiento, según resumen de búsqueda); SMN-CONAGUA, Comunicado de prensa 0533-23, https://www.gob.mx/cms/uploads/attachment/file/842799/Comunicado_de_Prensa_0533-23.pdf (canícula; resumen de búsqueda, documento no abierto
completo); SEMARNAT, metadatos de indicador 3-1 que citan definiciones SAGARPA-SIAP (2002) de superficie de temporal y de riego, https://apps1.semarnat.gob.mx:8443/dgeia/indicadores18/conjuntob/indicador/archivos/pdf/03_suelos/indicadores/3-1.pdf; Universidad Autónoma Chapingo (2026), Current Topics in Agronomic
Science, vol. 6 (2026), Cruz-González et al., artículo sobre unidades de calor del maíz, DOI https://doi.org/10.5154/r.ctasci.2025.03.001 (verificado; corrige la referencia anterior); Chicco, D., Warrens, M. J. y Jurman, G. (2021). The coefficient of determination R-squared is more informative than SMAPE, MAE, MAPE,
MSE and RMSE in regression analysis evaluation. PeerJ Computer
Science, 7:e623, https://doi.org/10.7717/peerj-cs.623; Kapoor, S. y Narayanan, A. (2023). Leakage and the reproducibility crisis in machine-learning-based science. Patterns, https://pmc.ncbi.nlm.nih.gov/articles/PMC10499856 (citada en el corpus, no abierta); Humboldt, A. von (1811). Essai politique sur le royaume de la
Nouvelle-Espagne (pisos térmicos; por resumen de búsqueda); Funk, C. et al. (2015). Scientific Data, 2, 150066, https://doi.org/10.1038/sdata.2015.66 (CHIRPS); Climate Hazards Center (2025), CHIRTS-ERA5, https://doi.org/10.15780/G2F08J; INIFAP, Agenda Técnica Agrícola Hidalgo 2017,
https://vun.inifap.gob.mx/VUN_MEDIA/BibliotecaWeb/_media/_agendas/4131_4828_Agenda_T%C3%A9cnica_Hidalgo_2017.pdf (citada en el corpus; no abierta); Universidad Veracruzana (2023), nota sobre milpa citando a CONABIO, https://www.uv.mx/saisuv/files/2023/10/Nota_Milpa_121023-1.pdf; Gómez Mercado et al., Terra
Latinoamericana, sobre milpa maíz-frijol, https://doaj.org/article/ecac3163afd3420db48bb78d8eddf17f; SEMARNAT, metadatos del indicador 3-1 «Superficie agrícola» (verificado): https://apps1.semarnat.gob.mx:8443/dgeia/indicadores16/conjuntob/indicador/archivos/pdf/03_suelos/metadatos/3-1%20met.pdf; SMN-CONAGUA,
comunicado 0533-23 (21 de julio de 2023, verificado): https://www.gob.mx/cms/uploads/attachment/file/842799/Comunicado_de_Prensa_0533-23.pdf; MAPA, Labor secundario (España, verificado): https://servicio.mapa.gob.es/ca/ministerio/servicios/informacion/Labor-secundario_tcm34-58149.pdf; CSIC, Dra. (barbecho, definición
académica española), https://dra.revistas.csic.es/index.php/dra/article/download/781/870/1089; Secretaría de Economía, ficha de la NMX-FF-043-SCFI-2003 (verificada): https://platiica.economia.gob.mx/normalizacion/?p=158873; Revista Fitotecnia Mexicana (pesos hectolítricos y uniformidad de dos hileras):
https://revistafitotecniamexicana.org/documentos/48-3/9a.pdf; estudio de cebadas de Hidalgo (Doña Josefa, 2019): https://www.redalyc.org/pdf/2631/263144153014.pdf; UAEH, Valorización y uso de cebada: https://repository.uaeh.edu.mx/revistas/index.php/icbi/article/view/571; Universidad Nacional Autónoma de México y
Universidad Autónoma de Querétaro (tepetate): https://rmcg.geociencias.unam.mx/index.php/rmcg/article/download/1644/1632; Terra Latinoamericana (suelos Estado de México, WRB 2006 y 2022): https://www.terralatinoamericana.org.mx/index.php/terra/article/view/1795; Flora de Aranzadi, Hordeum vulgare:
https://monteriza.aranzadi.eus/wp-content/uploads/flora/169.hordeum-vulgare.pdf; Universidad de Minnesota, tabla de grados-día (base 40 °F): https://conservancy.umn.edu/bitstream/handle/11299/207440/MN2500_AGFO_2548.pdf; CropWatch, guía de grados-día (base 0 °C en anuales de invierno):
https://CropWatch.unl.edu/documents/gdd.pdf; estudio de cebada de invierno en Serbia (base 0 °C): https://fiver.ifvcns.rs/handle/123456789/424; FAO y CONABIO, milpa (nota): https://www.fao.org/newsroom/story/traditional-agrifood-systems-conserve-biodiversity-and-support-nutrition-in-mexico/en; Escuela Politécnica
Nacional, tesis sobre aptitud maltera de 15 genotipos: https://bibdigital.epn.edu.ec/handle/15000/15157; especificación comercial de malta diastásica (fabricante, no norma): https://alt.bestmalz.de/en/?p=12588; INIFAP, Revista Mexicana de Ciencias Agrícolas (mejoramiento genético de cebada 1985–2020):
https://cienciasagricolas.inifap.gob.mx/index.php/agricolas/article/view/2807; FIRA, fira.gob.mx (sitio oficial: informes de gestión 2018–2024, Garantía FIRA, micrositio de seguros; consultado 2026-10-18); gob.mx/agroasemex (consultado); DOF nota 5690272, extinción de la FND (29/05/2023); Paz et al. (2018), Terra
Latinoamericana 36(2):131–152, DOI 10.28940/terra.v36i2.231; Miranda y Farrin (2012), Applied Economic Perspectives and Policy 34(3):391–427, DOI 10.1093/aepp/pps031; Gyamerah y Boiquaye (2026), DOI 10.1080/10920277.2026.2626903; Routledge Handbook of Contract Farming (2026), DOI 10.4324/9781003513674-21; SIAP,
Normatividad Técnica para la Generación de Estadística Básica Agropecuaria (NTGEBAP_2022), https://www.gob.mx/cms/uploads/attachment/file/789519/NTGEBAP_2022.pdf; Li et al. (2018), IEEE JSTARS, DOI 10.1109/jstars.2018.2835823; Sentinel-2 MSI Level-2A BOA Reflectance, DOI 10.5270/s2_-6eb6imz; Zhu y Woodcock (2012), DOI
10.1016/j.rse.2011.10.028; Zhu, Wang y Woodcock (2015), DOI 10.1016/j.rse.2014.12.014; Drusch et al. (2012), DOI 10.1016/j.rse.2011.11.026; Ecological Indicators (2021), DOI 10.1016/j.ecolind.2020.106876; Remote Sensing 15(24) (2023), DOI 10.3390/rs15245694; PE&RS (2026), DOI 10.14358/pers.26-00028r3; Noise estimation
in NOAA AVHRR maximum-value composite NDVI images (1995), DOI 10.1080/01431169508954601; López Báez et al. (2018), RMCA 9(1), DOI 10.29312/remexca.v9i1.848; Martínez-Gamiño et al. (2019), RMCA (cienciasagricolas.inifap.gob.mx); Ventura (1998), Purdue AAI9939435; FAO, Conservation Agriculture,
fao.org/conservation-agriculture/en/ (consultado); WRB, wrb.isric.org (Phaeozem; Durisol); Magliano et al. (2014), Journal of the Institute of Brewing, DOI 10.1002/jib.161; Agu (2009), Technical Quarterly 46(1), DOI 10.1094/tq-46-1-0226-01; ASBC (2011), DOI 10.1094/asbcmoa-malt-12; Soto Carrasquel et al. (2016),
repositorio UAEH; González-González et al. (2016), SciELO; European Journal of Agronomy (2024), DOI 10.1016/j.eja.2024.127118; Secretaría de Economía, ficha PLATIICA NMX-FF-043-SCFI-2003; FIRA, Programa Institucional 2025, https://www.fira.gob.mx/Files/ProgramaInstitucional2025.pdf (glosario de siglas, verificado);
FIRA, documento de 29/08/2024 sobre el Fondo Especial de Asistencia Técnica y Garantía para Créditos Agropecuarios, https://www.fira.gob.mx:443/Files/IGGFIRMAFEGA.pdf; Cámara de Diputados, LXIV Legislatura, Grupo Parlamentario del PRI, punto de acuerdo (20/07/2020),
https://infosen.senado.gob.mx/sgsp/gaceta/64/2/2020-07-20-1/assets/documentos/PA_PRI_Dip_Mier_Teran_Apoyos_Esquemas_Comercializacion_Productores.pdf (cita a la FAO); Copernicus, misión Sentinel-2, https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-2; UBA (2026), Cultivos de grano,
https://ri.agro.uba.ar/files/download/libros/2026satorrecultivosdegrano.pdf; SIAP, NTGEBAP 2022, https://www.gob.mx/cms/uploads/attachment/file/789519/NTGEBAP_2022.pdf (leída en esta ronda); Alqudah y Schnurbusch (2013), DOI 10.1071/FP13248; Pourkheirandish y Komatsuda (2007), DOI 10.1093/aob/mcm139; Fincher (1989),
DOI 10.1146/annurev.pp.40.060189.001513; Gubler, Millar y Jacobsen (2005), DOI 10.1016/j.pbi.2005.01.011; Benech-Arnold (2024), DOI 10.1201/9781003578536-17; Cannell (1969), DOI 10.1017/s0021859600024837; Easterling et al. (1997), DOI 10.1126/science.277.5324.364; Magaña, Amador y Medina (1999), DOI
10.1175/1520-0442(1999)012<1577:TMDOMA>2.0.CO;2; Trenberth (1997), DOI 10.1175/1520-0477(1997)078<2771:TDOENO>2.0.CO;2; Hayes et al. (1999), DOI 10.1175/1520-0477(1999)080<0429:MTDUTS>2.0.CO;2; Vicente-Serrano et al. (2010), DOI 10.1175/2009JCLI2909.1; Snyder y de Melo-Abreu (2005), Frost protection: fundamentals,
practice and economics, vol. 1, FAO, Roma (reseña: DOI 10.1017/S0014479706273794)]
---

# Glosario del Reto AgroCebada (FIRA 2026)

**Resumen.** Este glosario define en español los términos que aparecen en el proyecto de predicción del rendimiento de cebada maltera de temporal en Hidalgo, Puebla y Tlaxcala: 197 parcelas, de las cuales 138 tienen rendimiento conocido y 59 son de predicción, con rendimiento en toneladas por hectárea (t/ha) del ciclo
abril–octubre de 2025. Reúne vocabulario de índices satelitales, fenología de la cebada, clima, suelo, plagas, estadística, aprendizaje automático y regionalismos de productores. Cada entrada indica su origen cuando importa: literatura, dato oficial del reto o resultado del proyecto. Cuando una definición no está
documentada en las fuentes, se dice explícitamente. Las definiciones de índices son conceptuales: las fórmulas exactas dependen de la implementación del proveedor de datos.

## Glosario: índices de vegetación (verdor y estructura del dosel)

Contexto: índices calculados por el proveedor para las 197 parcelas, en el Dataset Básico (Sentinel-2 y Landsat, 2022–2025) y en el Dataset PRO (Planet, 2025). Cada índice se resume por parcela y fecha con promedio, desviación estándar (std), máximo y mínimo.

- **NDVI (Normalized Difference Vegetation Index; Índice de Vegetación de Diferencia Normalizada)**: indicador general de presencia, vigor y actividad de vegetación verde. Es adimensional. Aparece en ambos datasets, pero proviene de sensores distintos y no debe fusionarse automáticamente.
- **EVI (Enhanced Vegetation Index)**: índice de vigor vegetal que reduce parte de la influencia del suelo y de la atmósfera. Está en ambos datasets.
- **SAVI (Soil-Adjusted Vegetation Index; índice de vegetación ajustado al suelo)**: reduce la influencia del brillo del suelo, útil cuando la cubierta vegetal aún es incompleta.
- **MSAVI (Modified Soil-Adjusted Vegetation Index)**: variante de SAVI que reduce de forma adaptativa la influencia del suelo. Solo está en el Dataset PRO.
- **LAI (Leaf Area Index; índice de área foliar)**: superficie foliar por unidad de superficie de terreno (m²/m²). Variable biofísica presente en ambos datasets.
- **FAPAR (Fraction of Absorbed Photosynthetically Active Radiation)**: fracción de la radiación fotosintéticamente activa que absorbe la vegetación (adimensional, de 0 a 1).
- **NDSVI (Normalized Difference Senescent Vegetation Index)**: sensible a vegetación senescente y a material no fotosintético. Ayuda a ubicar la maduración.
- **SRNDI (Shortwave Red Normalized Difference Index)**: contrasta el infrarrojo de onda corta con la región roja del espectro.
- **MRA**: variable entregada con esa abreviatura por el proveedor. El diccionario no la desarrolla; su interpretación queda como **no documentada** hasta confirmar la ficha del proveedor.

Fuente: reto_y_datos/Diccionario_de_indices_satelitales.txt; reto_y_datos/Descripcion_general_variables_DataSet.txt

## Glosario: índices de agua, humedad y estrés hídrico

Contexto: índices del Dataset Básico (Sentinel-2), salvo que se indique otra cosa. Sirven para caracterizar estrés hídrico durante la temporada, y su lectura depende de la fecha y de la fase del cultivo. El diccionario advierte que no existen umbrales universales válidos para todas las parcelas, fechas y etapas.

- **NDWI (Normalized Difference Water Index)**: índice relacionado con agua o humedad a partir del contraste entre bandas.
- **ENDWI (Enhanced Normalized Difference Water Index)**: variante "enhanced" del índice anterior.
- **MSI (Moisture Stress Index; índice de estrés por humedad)**: sensible al contenido de agua de la vegetación y al estrés hídrico.
- **EMSI (Enhanced Moisture Stress Index)**: variante orientada a ampliar la sensibilidad a cambios de humedad.
- **DSWI2, DSWI3, DSWI4 y DSWI5 (Disease-Water Stress Index)**: familia de índices con distintas combinaciones de bandas. El nombre contiene "disease", pero el diccionario los describe como indicadores de estrés hídrico y condición vegetal; **no deben leerse como detección de enfermedades**.
- **NDDI (Normalized Difference Drought Index)**: integra vegetación y humedad para caracterizar sequedad.
- **ENDDI (Enhanced Normalized Difference Drought Index)**: variante que incorpora una señal hídrica complementaria.
- **VI6T**: índice espectral-térmico de Landsat que combina una banda espectral con información térmica de superficie. Es la única variable de Landsat en el Dataset Básico.

Fuente: reto_y_datos/Diccionario_de_indices_satelitales.txt

## Glosario: índices de labranza, residuos y estadísticos por parcela

Contexto: los índices de residuos y labranza describen la superficie del suelo después de la cosecha o antes de la siembra. En la literatura consultada se usan para distinguir manejo de conservación de manejo convencional (agricultura de conservación en México, 2009–2022).

- **CRC (Crop Residue Cover Index)**: respuesta espectral asociada con cobertura de residuos de cultivo sobre la superficie.
- **MCRC (Modified Crop Residue Cover)**: variante modificada orientada a detectar residuos.
- **NDTI (Normalized Difference Tillage Index)**: índice de infrarrojo de onda corta para caracterizar suelo, residuos y labranza. El manuscrito de Ferguson y colaboradores usa su mínimo anual como señal de residuos y labranza (literatura).
- **STI (Simple Tillage Index)**: relación espectral para residuos y condiciones de labranza.
- **Promedio, std, max y min**: estadísticos por parcela en cada fecha. La **std** mide variabilidad espacial dentro de la parcela, no variación entre fechas.
- **Porcentaje de nubosidad (cloud cover)**: variable de calidad que el reto deja a cada equipo para definir su filtrado y el tratamiento de datos faltantes.
- **IRECI**: índice óptico que, según Iranzo y colaboradores, se combina con el cociente radar CR. Su fórmula no se detalla en el resumen consultado (**no documentada** en el corpus).

Fuente: reto_y_datos/Diccionario_de_indices_satelitales.txt; teledeteccion_fenologia/literature_review__report__chapters__02_observacion.typ.txt; literatura_aplicacion/literature_review__report__sections__07_economia_aplicacion.typ.txt

## Glosario: sensores y conceptos de percepción remota

Contexto: las observaciones del reto combinan imágenes ópticas y radar, así como series de fechas por parcela. Cada sensor tiene resolución espacial, frecuencia y procesamiento propios, por lo que el diccionario recomienda conservar la identificación del sensor en el análisis.

- **Sentinel-2 (nivel L2A)**: satélite óptico con bandas visibles e infrarrojo cercano a 10 m; red-edge y SWIR a 20 m; otras bandas a 60 m.
- **Sentinel-1**: radar de apertura sintética. Es sensible a estructura, humedad y geometría de adquisición, y su complementariedad con el óptico es una hipótesis física que debe probarse en la campaña concreta.
- **Landsat**: serie de satélites que el reto usa para VI6T. Landsat 6 no alcanzó órbita y no aporta observaciones.
- **Planet / PlanetScope**: fuente comercial del Dataset PRO (2025), con acceso y fechas sujetos a disponibilidad.
- **Banda red-edge (borde rojo)**: bandas entre el rojo y el infrarrojo cercano, sensibles a la clorofila.
- **SWIR (infrarrojo de onda corta)**: banda usada en varios índices de humedad y labranza.
- **Retrodispersión (backscatter)**: intensidad de la señal radar devuelta por el terreno y la vegetación.
- **Cociente radar CR**: relación entre señales radar que Iranzo y colaboradores combinan con ópticos (literatura; definición exacta no verificada).
- **Fluorescencia inducida por el sol (SIF)**: señal de fluorescencia de la vegetación. Li y colaboradores la combinan con índices para estimar rendimiento distrital en Suecia (R² de 0.77; literatura).
- **Resolución espacial (píxel)**: tamaño del área que representa cada valor de imagen. Un píxel de 10 m no es una medición de un punto; es un promedio de su superficie.
- **Mezcla espacial (mixed pixel)**: situación en que un píxel contiene varias cubiertas, como cultivo, camino o suelo desnudo.

Fuente: reto_y_datos/Diccionario_de_indices_satelitales.txt; teledeteccion_fenologia/literature_review__report__chapters__02_observacion.typ.txt; literatura_aplicacion/literature_review__report__sections__05_modelos.typ.txt

## Glosario: representaciones aprendidas y modelos fundacionales geoespaciales

Contexto: además de los índices definidos por el investigador, el corpus revisa representaciones aprendidas a partir de grandes colecciones de observaciones de la Tierra. El proyecto las evalúa como alternativas, sin asumir que mejoran el rendimiento de cebada.

- **Modelo fundacional geoespacial (geospatial foundation model)**: modelo preentrenado con observaciones de satélite, reutilizable en tareas posteriores. Presto, Galileo, Prithvi, SatMAE, CROMA y TerraMind son ejemplos citados en la literatura revisada.
- **Embedding o vector de representación**: vector numérico que resume una observación o una serie. Una dimensión individual no se interpreta como fertilidad, lluvia o manejo sin evidencia adicional.
- **AlphaEarth**: producto de representación anual a 10 m, de 64 dimensiones, que resume un año natural. La ficha del catálogo consultada mostraba 2017–2024, pero el proyecto descargó y validó capas de 2017 a 2025.
- **Fusión de sensores (sensor fusion)**: integración de observaciones de sensores distintos, como radar y óptico.
- **Representación multimodal**: vector que combina fuentes distintas, por ejemplo óptico, radar y clima.
- **Modalidad ausente**: fuente sin observación en una parcela o fecha. En estas representaciones, la ausencia forma parte del problema de modelado.

Fuente: teledeteccion_fenologia/literature_review__report__chapters__03_representaciones.typ.txt; reto_y_datos/literature_review__report__sections__04_datos.typ.txt; literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt

## Glosario: fenología de la cebada I (calendario y escalas)

Contexto: la cebada de temporal del Altiplano se siembra de mayo a inicios de julio. Según INIFAP (Agenda Técnica Hidalgo 2017, citada en el corpus), el espigamiento o floración ocurre entre 46 y 72 días después de la siembra (DDS), y la madurez fisiológica entre 90 y 132 DDS, según ambiente y fecha de siembra.

- **Fenología (phenology)**: estudio de los eventos del ciclo de vida de la planta, como emergencia, espigamiento y madurez, y de su calendario.
- **Fase fenológica (phenological stage)**: etapa identificable del desarrollo, por ejemplo amacollamiento o llenado de grano.
- **Escala Zadoks (Zadoks decimal code)**: código decimal de 0 a 99 para los estadios de cereales, propuesto en 1974 por Zadoks, Chang y Konzak (verificado por citas en fuentes secundarias; artículo original no abierto). Es la escala más citada en la literatura de cereales. Los nombres en español de los estadios **no
  están verificados**: la monografía BBCH en español (Meier, 2018) no pudo descargarse en esta ronda (error 504 del servidor, dos intentos). Una publicación en español de la UBA (2026) usa el término «encañazón» y cita la escala de Zadoks en su Cuadro 2.1, que no está en el extracto consultado: los códigos Z en español
quedan **SIN EVIDENCIA**.
- **Escala BBCH**: escala decimal generalizada para mono y dicotiledóneas, que incluye cereales. Sirve para comparar estudios con distinta nomenclatura. Se basa en la escala de cereales de Zadoks (verificado en fuentes secundarias; los códigos de cereales en español **no verificados**).
- **Siembra (sowing)**: colocación de la semilla en el suelo preparado.
- **Emergencia (emergence)**: aparición de las plántulas sobre el suelo.
- **DDS / DAS (días después de siembra)**: unidad de calendario agronómico. No equivale al día del año y cambia con la fecha de siembra; por eso dos parcelas con la misma imagen pueden estar en fases distintas.
- **Madurez fisiológica (physiological maturity)**: punto en que el grano alcanza su peso máximo. Precede a la cosecha.

Fuente: agronomia/literature_review__research_notes__Panicle_coverage_and_barley_yield__mexico_rainfed_malting_barley.md; teledeteccion_fenologia/literature_review__reports__Panicle_coverage_and_barley_yield.md; teledeteccion_fenologia/literature_review__report__chapters__02_observacion.typ.txt; Zadoks et al. (1974);
Meier (2018, JKI).

## Glosario: fenología de la cebada II (macollaje, encañe, embuche, espigamiento, antesis)

Contexto: estas fases ocurren durante el crecimiento vegetativo y la transición a la reproducción. El corpus usa los nombres en español de las guías de INIFAP. En la literatura internacional se corresponden con los estadios de Zadoks indicados entre paréntesis, de forma aproximada.

- **Amacollamiento / macollamiento (tillering; ahijamiento)**: emisión de tallos laterales desde la base de la planta. INIFAP recomienda herbicidas durante el amacollamiento, a 25–30 DDS. La densidad de espigas por metro cuadrado queda parcialmente fijada en esta etapa.
- **Encañazón / encañe / encañado (stem elongation)**: alargamiento de los entrenudos del tallo (Zadoks 30–39; en fuentes en inglés, el estadio 3 de Zadoks es la elongación del tallo, según resumen de búsqueda de una guía de Victoria, Australia; **parcialmente verificado**). «Encañazón» está verificado en español (UBA,
  2026, *Cultivos de grano*, foto 2.3: «período de encañazón» y «elongación de los entrenudos»). Los términos «encañe» y «encañado» en español **no están
  verificados** en una fuente en español. El término "encañe" no aparece en el corpus; la literatura consultada usa "encañado" o "elongación del tallo". La duración de esta fase se ha propuesto como determinante del potencial de rendimiento.
- **Embuche (booting; hoja bandera)**: la espiga se desarrolla dentro de la vaina de la última hoja. INIFAP recomienda un fungicida sistémico entre embuche y espigamiento.
- **Espigamiento (heading)**: emergencia de la espiga fuera de la vaina. Un criterio operativo de SAG Chile lo define cuando la primera espiguilla es visible en 50 % de las espigas de la parcela (**verificado**: «Época de espigado. Primera espiguilla visible en el 50% de las espigas de la parcela», Metodología de
  evaluación de cebada, SAG, con pauta UPOV TG/19/10). Una nota de investigación del corpus reporta espigamiento promedio a 46–57 DAS en un estudio citado de la región (sitio
  exacto no verificado).
- **Antesis (anthesis; floración)**: apertura de las flores y polinización. INIFAP reporta floración a 48–72 DDS. El número de granos por espiga se fija alrededor del espigamiento y antes de él.
- **Hoja bandera (flag leaf)**: la última hoja del tallo, que influye en el llenado del grano.

Fuente: agronomia/literature_review__research_notes__Panicle_coverage_and_barley_yield__mexico_rainfed_malting_barley.md; teledeteccion_fenologia/literature_review__reports__Panicle_coverage_and_barley_yield.md; agronomia/literature_review__report__sections__03_agronomia_literatura.typ.txt; SAG Chile (criterio de
espigamiento, según resumen de búsqueda).

## Glosario: fenología de la cebada III (llenado, madurez y senescencia)

Contexto: el llenado de grano determina en buena parte el peso del grano, y por tanto el rendimiento. Dos parcelas con verdor semejante pueden diferir en esta fase por estrés terminal, enfermedades foliares o granizo, según la literatura de Hidalgo.

- **Llenado de grano (grain filling)**: acumulación de materia seca en el grano después de la antesis. Es sensible al estrés hídrico y térmico al final del ciclo.
- **Senescencia (senescence)**: envejecimiento y pérdida de verdor de las hojas. El proyecto la ubica como la fecha en que la curva del índice cae por debajo de la base más 50 % de la amplitud, después del pico (criterio de análisis fenológico del proyecto, resultado interno).
- **Ciclo de cultivo (crop cycle)**: duración de la siembra a la cosecha. El rendimiento del reto corresponde al ciclo abril–octubre de 2025.
- **Cosecha (harvest)**: corte del grano. INIFAP indica cosechar con combinada cuando el grano está maduro y con 13–14 % de humedad.
- **Cebada de seis hileras (six-row barley)**: tipo de espiga con tres espiguillas fértiles por nudo. Doña Josefa es de seis hileras según la verificación local del proyecto (**no confirmado en fuentes externas**). Para Esmeralda y Adabella no se verificó el tipo de hilera (**SIN EVIDENCIA**). Una flora regional
  describe que en la cebada cultivada todas las espiguillas son fértiles.
- **Cebada maltera (malting barley)**: cebada de calidad destinada a la elaboración de malta para cerveza. Se distingue de la cebada forrajera.

Fuente: agronomia/literature_review__research_notes__Panicle_coverage_and_barley_yield__mexico_rainfed_malting_barley.md; plagas_danos/iterate_20261017__research__A2_outlier_forensics.md; teledeteccion_fenologia/literature_review__report__chapters__02_observacion.typ.txt; reto_y_datos/DESCRIPCION_oficial_dataset.txt

## Glosario: clima y modalidad hídrica (temporal, riego y ciclos)

Contexto: las 197 parcelas están en Hidalgo, Puebla y Tlaxcala y el reto se refiere a cebada maltera de temporal. Según INIFAP, más del 90 % de la cebada de Hidalgo se cultiva en el ciclo primavera–verano del Altiplano (dato citado en el corpus).

- **Temporal (rainfed)**: modalidad en que el cultivo depende de la lluvia o de la humedad residual del suelo. La definición de superficie de temporal de SIAP-SAGARPA (2002) es (**verificado**: ficha de metadatos del indicador 3-1 de SEMARNAT, que cita esa fuente) "el área en la que el desarrollo completo de los
  cultivos depende exclusivamente de las lluvias o de la humedad residual del suelo".
- **Riego (irrigated)**: superficie donde se aplica agua artificialmente, con independencia de la precipitación (**verificado**: misma ficha SEMARNAT, que cita SIAP-SAGARPA 2002).
- **Superficie sembrada**: «espacio de tierra en la cual se deposita la semilla de cualquier cultivo, previa preparación del suelo» (**verificado**: ficha de metadatos del indicador 3-1 de SEMARNAT, que cita SIAP-SAGARPA). Esa ficha también señala que la estimación la hace el Distrito de Desarrollo Rural con base en el
  SIACON.
- **Superficie cosechada**: área en la que se cosechó un producto agrícola, en una sola ocasión o en varios cortes (verificado: SIAP, NTGEBAP 2022, p. 22, leído en el PDF oficial en esta ronda). Se distingue de la superficie sembrada.
- **Ciclo primavera–verano (PV)**: siembra en primavera o inicios de verano y cosecha en otoño. Es el ciclo de la cebada de temporal del Altiplano.
- **Ciclo otoño–invierno (OI)**: siembra en otoño con cosecha en primavera, típico de la cebada de riego del Bajío.
- **Temporada de lluvias**: periodo de mayo a octubre en gran parte del centro del país, según el SMN citado en notas de prensa. Es el periodo en que transcurre el ciclo de temporal.

Fuente: reto_y_datos/Descripcion_general_variables_DataSet.txt; agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md; experimentos_tabulares/modelado__KUMO.md; SEMARNAT (definiciones SAGARPA-SIAP 2002, resumen de búsqueda).

## Glosario: clima y eventos extremos (heladas, canícula, granizo, sequía)

Contexto: los eventos extremos explican gran parte de los daños documentados en la región. Las cifras son de prensa o de boletines oficiales citados en el corpus, no de la base del reto.

- **Helada (frost)**: temperatura igual o menor a 0 °C que daña tejidos vegetales. **Helada temprana**: la que ocurre antes de la madurez. En septiembre de 2011 las heladas dañaron unas 380 000 ha de cultivos básicos en México, con Puebla, Hidalgo y Tlaxcala entre los estados más afectados (prensa, citada en el
  corpus). En octubre de 2024 se reportaron unas 2 000 ha de cebada dañadas en Apan (prensa).
- **Canícula (sequía de medio verano o sequía intraestival)**: reducción temporal de lluvias dentro de la temporada de lluvias, con un ligero aumento de la temperatura (verificado: SMN-CONAGUA, comunicado 0533-23, 21 de julio de 2023; no hay fecha exacta de inicio y término, y suele presentarse a finales de julio o
  inicios de agosto). En agosto de 2025, Hidalgo registró 58 % de su lluvia normal, el 29.º valor más bajo de 35 años (SMN, citado en el corpus; **cifra no verificada**). El efecto cuantificado sobre la cebada del Altiplano
  **no está documentado**.
- **Sequía intraestival**: sinónimo de canícula. El SMN-CONAGUA escribe: «La canícula, también llamada sequía intraestival o veranillo, es un evento climático que ocurre durante el verano» (verificado: comunicado 0533-23, 21 de julio de 2023).
- **Granizo (hail)**: daño mecánico a hojas y espigas. Las granizadas de agosto de 2025 en Puebla e Hidalgo afectaron ciudades cercanas; en el caso de Tulancingo analizado en el corpus no se reportó daño a la cebada.
- **Acame (lodging)**: tallos doblados por viento, lluvia o granizo. En cebada Bere, el acame en Zadoks 77 causó la mayor pérdida en un ensayo citado en el corpus (ensayo en Orcadas; no mexicano).

Fuente: agronomia/iterate_20261017__research__B2_season_2025.md; agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md; plagas_danos/iterate_20261017__research__B1_damage_detection.md; SMN-CONAGUA (comunicado 0533-23, resumen de búsqueda).

## Glosario: clima en el reto (precipitación, temperatura y grados-día)

Contexto: el reto entrega precipitación y temperaturas mensuales en rásteres (.tif) para 2022–2025, en los tres estados. Los acumulados, promedios y grados-día se construyen por cada equipo a partir de estas capas.

- **Precipitación mensual acumulada (CHIRPS)**: suma mensual de lluvia en milímetros (mm). CHIRPS tiene malla de 0.05° (Funk et al., 2015).
- **Temperatura mínima mensual y máxima mensual (CHIRTS-ERA5)**: promedio mensual de las temperaturas mínimas y máximas, en grados Celsius (°C). Son promedios de meses, no extremos diarios.
- **Temperatura media**: indicador que el reto sugiere construir; puede aproximarse con el promedio de la mínima y la máxima mensuales.
- **Grados-día de desarrollo (GDD; growing degree days)**: acumulado de temperatura por encima de una temperatura base, en °C·día. **CORREGIDO**: el artículo de Chapingo citado (Cruz-González et al., Current Topics in Agronomic Science, vol. 6, publicado el 24 de marzo de 2026, DOI 10.5154/r.ctasci.2025.03.001) trata
  sobre maíz, no sobre cebada, y no fija una temperatura base para cebada. Describe los grados-día como un método sencillo para seguir las etapas fenológicas del maíz. Franch y colaboradores lo usan para alinear
  observaciones de cebada en España.
- **Temperatura base (Tb)**: umbral por debajo del cual el desarrollo se detiene. El proyecto usa base 0 °C en su análisis fenológico, pero **no hay una Tb documentada para cebada en el Altiplano** en las fuentes revisadas. En literatura internacional, un estudio de cebada de invierno en Serbia usó base 0 °C (24
  cultivares; unos 1223 GDD de emergencia a emergencia de la hoja bandera en dos hileras y 1304 en seis hileras; verificado en resumen de la publicación). Una tabla de la Universidad de Minnesota con estadios Zadoks usa base 4.4 °C (40 °F). Las bases no son intercambiables.
- **Reanálisis (ERA5-Land, AgERA5)**: productos que combinan modelo y observaciones. ERA5-Land tiene malla aproximada de 9 km. Un reanálisis no es una estación en cada parcela.
- **Malla (grid)**: unidad espacial de un producto. Un contraste débil entre parcelas cercanas puede reflejar que comparten la misma celda.

Fuente: reto_y_datos/Descripcion_general_variables_DataSet.txt; teledeteccion_fenologia/literature_review__report__chapters__02_observacion.typ.txt; teledeteccion_fenologia/literature_review__report__chapters__03_representaciones.typ.txt; experimentos_tabulares/dynamic_change__phenocurve__docs__F1_fits.md; Funk et al.
(2015); Chapingo (2025, resumen de búsqueda).

## Glosario: suelo, topografía y relieve

Contexto: el reto entrega elevación y pendiente del Continuo de Elevaciones Mexicano (CEM 4.0 de INEGI, 15 m). Las propiedades de suelo son de fuentes globales de menor resolución y deben tratarse como contexto.

- **Suelo (soil)**: capa superficial donde crece el cultivo. Su capacidad de retención de agua condiciona la humedad disponible en temporal.
- **Humedad residual (residual soil moisture)**: agua almacenada en el perfil que sostiene al cultivo de temporal cuando no llueve. La definición SIAP la menciona junto con la lluvia.
- **Capacidad de retención de humedad (water-holding capacity)**: cantidad de agua que el suelo puede retener para las plantas. En los llanos de Apan, los suelos profundos amortiguan la canícula (literatura regional).
- **SoilGrids**: propiedades de suelo estimadas globalmente a 250 m, con profundidades e incertidumbre. Es contexto de capacidad productiva, no medición de la parcela.
- **Elevación (elevation)**: altitud del terreno sobre el nivel del mar, en metros (msnm). Es raster estático del reto.
- **Pendiente (slope)**: inclinación del terreno, en grados o porcentaje. Derivada del CEM.
- **CEM (Continuo de Elevaciones Mexicano)**: modelo digital de elevación del INEGI, fuente de la elevación y la pendiente del reto.
- **Posición topográfica**: lugar de la parcela en el relieve. Las celdas bajas de la llanura endorreica conservan humedad y verdor por más tiempo (literatura regional).
- **Labranza (tillage)**: preparación mecánica del suelo. La agricultura de conservación reduce la alteración del suelo y mantiene cobertura orgánica permanente.

Fuente: reto_y_datos/Descripcion_general_variables_DataSet.txt; literatura_aplicacion/literature_review__report__sections__07_economia_aplicacion.typ.txt; agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md;
literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt

## Glosario: plagas, enfermedades y daños

Contexto: los reportes oficiales de plagas de SENASICA para Hidalgo de 2025 son de nivel municipal y están orientados al maíz. Por eso no sirven para explicar variación dentro de un municipio. Las enfermedades y plagas de la cebada del reto no tienen registro parcelario.

- **Plaga (pest)**: organismo que causa daño económico a un cultivo.
- **Gallina ciega (white grubs)**: larvas de escarabajos que dañan raíces. SENASICA publica fichas técnicas sobre el complejo.
- **Chapulín (grasshopper)**: insecto defoliador. SENASICA emitió alertas de Hidalgo en 2025, con orientación al maíz.
- **Mancha foliar (leaf spot)**: enfermedad de hojas. INIFAP recomienda una segunda aplicación entre espigamiento y llenado de grano.
- **Roya amarilla (yellow rust)**: enfermedad de la cebada. En Hidalgo su incidencia cayó cerca de cero después de 2000, tras la liberación de la variedad Esmeralda y las campañas químicas (literatura regional).
- **Daño por heladas (frost damage)**: tejido quemado, órganos reproductivos dañados o calidad de semilla afectada. Conviene separar el daño vegetativo del reproductivo al inspeccionar la espiga.
- **Recuperación (compensación)**: capacidad de la planta de reponer tejido tras el daño. En un estudio de heladas en cebada, un daño observado mayor no implicó necesariamente menor rendimiento.

Fuente: plagas_danos/iterate_20261017__research__B1_damage_detection.md; plagas_danos/segmentation_pests_ndvi_water__research__prior_work.md; agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md;
agronomia/error-spotting-ai-agent-dataset__barley-agronomy-mexico-2026-10-02__problems.csv; literatura_aplicacion/literature_review__report__sections__07_economia_aplicacion.typ.txt

## Glosario: rendimiento y sus componentes

Contexto: el rendimiento del reto se expresa en toneladas por hectárea (t/ha) y resulta de un proceso acumulativo. Un índice de vegetación es un predictor potencial, no una medición directa de rendimiento.

- **Rendimiento de grano (grain yield)**: cosecha de grano por unidad de superficie. Se expresa en t/ha o kg/ha; 1 t/ha = 1 000 kg/ha.
- **Tonelada por hectárea (t/ha)**: unidad del reto. Para convertir, 737 kg/ha equivalen a 0.737 t/ha.
- **Biomasa (biomass)**: materia seca total de la planta.
- **Índice de cosecha (harvest index)**: fracción de la biomasa que se convierte en grano. Una descomposición clásica es rendimiento igual a biomasa por índice de cosecha.
- **Densidad de espigas (spikes/m²)**: número de espigas por metro cuadrado. El método FAO calibrado en Hidalgo (Gómez Mercado y colaboradores) propone un ajuste vinculado con esta variable.
- **Etiqueta en rejilla de 0.5 t/ha (heaped label)**: rendimiento registrado en múltiplos de 0.5 t/ha. Parte de las parcelas de Calpulalpan, Apan y Emiliano Zapata tienen esta forma en el reto.
- **Rendimiento estimado por el productor**: etiqueta distinta de la cosecha pesada y de la producción dividida entre superficie; sus denominadores y su error pueden diferir.

Fuente: reto_y_datos/Descripcion_general_variables_DataSet.txt; agronomia/literature_review__report__sections__03_agronomia_literatura.typ.txt; experimentos_tabulares/iterate_20261017__research__A3_headroom.md; teledeteccion_fenologia/literature_review__report__chapters__02_observacion.typ.txt

## Glosario: estadística y validación (métricas de error)

Contexto: las métricas se calculan sobre las 138 parcelas con rendimiento conocido, en validación cruzada. Todas usan las mismas unidades que la variable (t/ha), salvo R². Un valor de error solo es comparable con otro si se usó el mismo conjunto de parcelas y la misma partición.

- **RMSE (Root Mean Squared Error; raíz del error cuadrático medio)**: raíz de la media de los errores al cuadrado. Penaliza más los errores grandes. Ejemplo del proyecto (validación cruzada, media de 20 particiones): la media municipal del entrenamiento, con la media de la misma fuente cuando el municipio no estaba en
  entrenamiento, tuvo RMSE de 0.4929 t/ha; un modelo de referencia tuvo 0.4802 t/ha.
- **MAE (Mean Absolute Error; error absoluto medio)**: promedio del valor absoluto del error. Es menos sensible a errores extremos. Ejemplo del proyecto: 0.322601 t/ha para la selección por MAE en cinco pliegues sobre 138 etiquetas.
- **R² (coeficiente de determinación)**: proporción de la varianza explicada. Puede ser negativo si el modelo es peor que predecir la media. Chicco y colaboradores (2021) argumentan que es más informativo que RMSE o MAE.
- **R² de Pearson (r²)**: cuadrado de la correlación de Pearson. Ignora desplazamientos y cambios de escala, por lo que no equivale al R² de scikit-learn.
- **Error medio con signo (sesgo; bias)**: promedio de predicción menos observado. Indica sobreestimación o subestimación sistemática.
- **Residual (residuo)**: observado menos predicho, por parcela.
- **Varianza explicada por el municipio**: en las etiquetas del reto, el municipio explica 68.6 % de la varianza del rendimiento (resultado interno).

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt; Chicco et al. (2021); reto_y_datos/Descripcion_general_variables_DataSet.txt

## Glosario: estadística y validación (particiones y validación cruzada)

Contexto: como hay 138 parcelas con rendimiento conocido, cada estimación de error depende de cómo se parten los datos. Las particiones usadas por el proyecto son aleatorias dentro de una misma campaña y se reportan con su número de pliegues.

- **Validación cruzada (cross-validation)**: estimación del desempeño dividiendo los datos en subconjuntos de entrenamiento y prueba. Ejemplo del proyecto: cinco pliegues con 110 u 111 parcelas de entrenamiento y 27 o 28 de evaluación.
- **Pliegue (fold)**: cada partición de prueba en una validación cruzada.
- **Predicción fuera de pliegue (OOF; out-of-fold)**: predicción de una parcela hecha por un modelo que no la usó para entrenar. Con 138 parcelas, el proyecto obtiene una predicción OOF por parcela.
- **Validación cruzada anidada (nested cross-validation)**: selección de hiperparámetros dentro de cada pliegue externo. Es necesaria cuando la selección usa las mismas etiquetas que la evaluación.
- **Partición espacial (validación por bloques)**: separación por zonas para medir generalización espacial. Arizo-García y colaboradores muestran que la predicción a 10 m debe validarse por parcela y no por píxel.
- **Partición por campaña**: entrenar con una temporada y probar con otra. Franch y colaboradores obtuvieron R² superior a 0.65 para cebada entre campañas, y cerca de 0.45 entre regiones (literatura).
- **Conjunto de confirmación**: subconjunto de particiones reservado para verificar una decisión tomada en el conjunto de desarrollo. El proyecto lo usa en sus análisis de validación (resultado interno).

Fuente: experimentos_tabulares/modelado__KUMO.md; validacion/iterate_20261017__research__B3_small_n_methods.md; experimentos_tabulares/iterate_20261017__research__A3_headroom.md; agronomia/literature_review__report__sections__03_agronomia_literatura.typ.txt;
literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt

## Glosario: estadística y validación (fuga, sesgo de selección y dominio)

Contexto: en un conjunto pequeño, la forma de evaluar puede inflar los resultados sin que el modelo sea mejor. Los riesgos más citados en el proyecto son la fuga de información, la selección con las mismas etiquetas y el cambio de distribución entre campañas o regiones.

- **Fuga de información (data leakage)**: uso de información que no estaría disponible al predecir, como la etiqueta de la parcela, datos posteriores al horizonte o el orden de filas del archivo. La auditoría del proyecto trata el orden de almacenamiento de las filas como fuga de la etiqueta.
- **Fuga temporal**: uso de imágenes o datos posteriores a la fecha de corte de predicción. Por ejemplo, usar observaciones después del 31 de octubre si la predicción debe hacerse antes.
- **Sesgo de selección**: elegir variables, modelos o restricciones mirando el desempeño en las mismas etiquetas. Infla la validación aunque cada paso parezca razonable.
- **Efecto de conjunto fijo (fixed-pool effect)**: en un conjunto fijo de parcelas, la validación cruzada infla las ganancias de reglas que fijan niveles municipales (resultado interno).
- **Línea base (baseline)**: referencia sencilla para comparar. Meroni y colaboradores hallaron que referencias sencillas superaban hasta 60 % de las configuraciones de aprendizaje automático (literatura).
- **Desplazamiento de distribución (distribution shift)**: cambio entre entrenamiento y prueba por región, campaña, sensor o fuente. EarthShift reporta un deterioro medio de 15 a 20 % fuera de distribución, en sus tareas (literatura).
- **Área de aplicabilidad (AOA)**: región del espacio de predictores donde el modelo es confiable, según Meyer y Pebesma.
- **Semivariograma**: gráfica de la diferencia entre pares de observaciones contra la distancia. Muestra hasta qué distancia las parcelas se parecen.

Fuente: validacion/iterate_20261017__research__critique_leakage.md; experimentos_tabulares/iterate_20261017__research__A3_headroom.md; literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt;
Kapoor y Narayanan (2023).

## Glosario: aprendizaje automático (conceptos básicos)

Contexto: el problema del reto es de regresión: predecir un valor numérico (t/ha) con unas 138 etiquetas y 59 casos de predicción. La escasez de etiquetas favorece modelos simples y regularizados, aunque el proyecto evalúa varias familias.

- **Aprendizaje automático (machine learning)**: ajuste de un modelo a partir de datos para predecir o clasificar.
- **Regresión**: predicción de un valor numérico continuo, como el rendimiento.
- **Etiqueta o variable objetivo (label, target)**: valor que se quiere predecir. En el reto, el rendimiento de cada parcela con dato conocido.
- **Característica (feature)**: variable de entrada del modelo, como un índice, la precipitación o la elevación.
- **Entrenamiento (fit)**: ajuste de los parámetros del modelo con datos de entrenamiento.
- **Sobreajuste (overfitting)**: el modelo memoriza el ruido de su entrenamiento y generaliza mal. El corpus advierte que los modelos de boosting con búsqueda extensa son propensos a él.
- **Subajuste (underfitting)**: el modelo es demasiado simple para captar la relación.
- **Regularización**: penalización que limita la complejidad del modelo, como en la regresión Ridge.
- **Hiperparámetro**: configuración que no se aprende de los datos, como la profundidad de los árboles.

Fuente: literatura_aplicacion/literature_review__report__sections__05_modelos.typ.txt; reto_y_datos/literature_review__report__sections__02_reto_corpus.typ.txt; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt

## Glosario: aprendizaje automático (familias de modelos)

Contexto: estas familias se han usado en la literatura de cebada y en los experimentos del proyecto. Su desempeño en el reto se reporta solo en validación cruzada; no se afirma superioridad de ninguna.

- **Regresión lineal múltiple**: modelo lineal con varias variables. Iranzo y colaboradores la usan con radar, óptico y clima.
- **Bosque aleatorio (random forest)**: conjunto de árboles entrenados con muestras aleatorias. Li y colaboradores lo usan para rendimiento distrital en Suecia, con R² de 0.77 y RMSE de 488 kg/ha.
- **Boosting (gradient boosting, XGBoost, CatBoost)**: conjunto de árboles entrenados en secuencia. El proyecto lo incluye como referencia.
- **Proceso gaussiano (GP, GPR)**: regresión no paramétrica con incertidumbre explícita. Sharifi y colaboradores lo reportan como el mejor de cuatro modelos, con R² de 0.84 (literatura).
- **Red neuronal y aprendizaje profundo (deep learning)**: modelos con muchas capas. Las representaciones multimodales se entrenan con este tipo de modelos.
- **Transformador (Transformer; ViT)**: arquitectura basada en atención. Los experimentos del proyecto con transformadores para datos tabulares o de imagen son resultados internos.
- **Modelo tabular fundacional (Kumo, TabPFN)**: modelo preentrenado sobre datos tabulares que se ajusta al problema. El proyecto probó Kumo con datos municipales de SIAP y luego con parcelas, con resultados solo de validación cruzada.
- **Ajuste fino (fine-tuning)**: actualización de los pesos de un modelo preentrenado con datos del problema.
- **Conjunto (ensemble) y apilamiento (stacking)**: combinación de predicciones de varios modelos, directamente o con un metamodelo entrenado sobre predicciones fuera de pliegue.

Fuente: teledeteccion_fenologia/literature_review__report__chapters__03_representaciones.typ.txt; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt; experimentos_tabulares/modelado__KUMO.md; experimentos_profundos/mmst-vit__docs__model_selection_20261006.md;
literatura_aplicacion/literature_review__report__sections__05_modelos.typ.txt

## Glosario: aprendizaje automático (incertidumbre, calibración y reproducibilidad)

Contexto: el reto pide presentar cada estimación con su incertidumbre. Un intervalo solo es útil si se conocen su procedimiento y las condiciones en que fue calibrado.

- **Intervalo de predicción**: rango plausible alrededor de una predicción.
- **Amplitud del intervalo**: diferencia entre el límite superior y el inferior del intervalo. Véase el glosario de regionalismos sobre "amplitud".
- **Cobertura (coverage)**: fracción de observaciones que caen dentro de su intervalo. Un intervalo calibrado al 90 % debe cubrir cerca de 90 % de los casos de prueba.
- **Predicción conforme (conformal prediction)**: método de intervalos con garantías de cobertura bajo intercambiabilidad. Romano, Patterson y Candès lo aplican con regresión por cuantiles (literatura).
- **Intercambiabilidad (exchangeability)**: supuesto de que el orden de las observaciones no importa. La dependencia espacial y los cambios de distribución lo violan.
- **Regresión por cuantiles**: estimación de cuantiles condicionales, como el 10 % o el 90 %, en lugar de la media.
- **Calibración**: concordancia entre la cobertura nominal y la empírica de un intervalo.
- **Huella digital (hash, SHA-256)**: suma de verificación que identifica un archivo. El proyecto la usa para verificar que las predicciones de comparación no cambiaron.

Fuente: literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt; validacion/literature_review__report__sections__06_validacion.typ.txt; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt

## Glosario: regionalismos y términos de productores (labranza y cultivo)

Contexto: estos términos aparecen en el lenguaje de productores y en las guías técnicas de la región. Algunos no están definidos en las fuentes consultadas y se marcan como tales.

- **Temporal (regionalismo)**: "sembrar de temporal" es sembrar sin riego, dependiendo de la lluvia. El mismo término también designa la temporada de lluvias, y en el corpus "temporal" aparece además como adjetivo de tiempo en "espacial y temporal". Conviene desambiguar.
- **Barbecho**: terreno sin sembrar que, en una rotación, recibe labores de preparación después de la cosecha para la siguiente siembra (definición académica de un artículo del CSIC, España; **no es una definición oficial mexicana**). Un material didáctico español indica 20 a 40 cm de profundidad según suelo y cultivo,
  sin fuente oficial. La definición oficial de SADER e INIFAP no se localizó (**SIN EVIDENCIA**: búsqueda en glosarios SADER e INIFAP sin resultado).
- **Rastra o rastreo**: la rastra de discos es un apero básico de la labor secundaria (verificado: MAPA, España, y Universidad Nacional de La Plata). Esa labor nivela, mulle y termina el perfil para dejar una cama de siembra; su profundidad de acción suele ser menor de 10–12 cm. «Rastreo» como sinónimo no tiene
  definición formal en las fuentes consultadas. El número de pasadas y el control de la primera generación de malezas no están verificados (**SIN EVIDENCIA**).
- **Sembradora**: máquina que deposita la semilla a la profundidad y espaciamiento deseados.
- **Milpa**: sistema de policultivo tradicional mesoamericano, con maíz, frijol, calabaza y chile. No es un cultivo de cebada. En el corpus, "Milpa" solo aparece dentro del topónimo Nanacamilpa. Verificado con fuentes secundarias (FAO y CONABIO citados en la nota de la FAO sobre sistemas agroalimentarios tradicionales;
  ficha de CONABIO no abierta directamente, **parcialmente verificado**).
- **Humedad del grano**: porcentaje de agua en el grano en la cosecha. INIFAP recomienda 13–14 %.

Fuente: agronomia/literature_review__research_notes__Panicle_coverage_and_barley_yield__mexico_rainfed_malting_barley.md; agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md; validacion/iterate_20261017__research__B3_small_n_methods.md; Universidad Veracruzana (2023) y
Terra Latinoamericana sobre milpa (resúmenes de búsqueda); barbecho y rastra, fuentes técnicas (resumen de búsqueda).

## Glosario: regionalismos, acepciones de "piso" (todas las documentadas)

Contexto: en el corpus, "piso" aparece sobre todo como "piso de desempeño". Las acepciones agronómicas se expresan más a menudo como altitud o elevación. Esta lista cubre cada acepción encontrada y señala las que no están documentadas.

- **Piso térmico (altitudinal belt)**: franja de altitud con temperatura y vegetación característicos. Humboldt (1811) propuso tierra caliente (bajo unos 900 m), tierra templada y tierra fría, términos que siguen usados. El Altiplano y el Valle de México corresponden sobre todo a tierra templada y fría. El corpus da
  los Valles Altos de Hidalgo entre 2 100 y 2 700 m, y los Llanos de Apan cerca de 2 500 m.
- **Piso de arado (plow pan)**: capa compactada bajo la profundidad de la labor. **No documentado** en el corpus ni en las fuentes consultadas.
- **Piso como superficie o terreno**: uso coloquial de "piso" por suelo o terreno. **No documentado** en el corpus como término técnico.
- **Piso de desempeño (performance floor)**: nivel mínimo de error que un modelo debe superar, usualmente una referencia regional simple. Es la acepción que aparece en el corpus (modelos de referencia y sesgo). No es un término agronómico.

Fuente: literatura_aplicacion/literature_review__report__sections__05_modelos.typ.txt; agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md; validacion/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__small_label_methods.md; Humboldt (1811, resumen de
búsqueda).

## Glosario: regionalismos, acepciones de "amplitud" (todas las documentadas)

Contexto: la palabra "amplitud" tiene varios sentidos en el proyecto. Se distinguen cuatro acepciones documentadas, y se indica una que no está documentada.

- **Amplitud térmica (thermal range; rango térmico diario)**: diferencia entre la temperatura máxima y la mínima. El reto la menciona como indicador derivado. Con promedios mensuales de CHIRTS-ERA5 se obtiene una **amplitud media mensual**, no la amplitud diaria extrema (inferencia metodológica).
- **Amplitud de la curva estacional de un índice (seasonal amplitude)**: diferencia entre el pico y la base de una serie de NDVI u otro índice por parcela. En el análisis fenológico del proyecto, una parcela con amplitud menor de 0.25 se considera de respuesta débil. En 2023, 20 parcelas quedaron bajo ese umbral
  (resultado interno).
- **Amplitud de intervalo (interval width)**: longitud de un intervalo de predicción. Las comparaciones de intervalos del corpus reportan la amplitud por región junto con la cobertura.
- **Amplitud de rendimiento**: rango de variación de los rendimientos entre años, usado en la literatura regional (0.5 a 3.5 t/ha en el Altiplano). Aparece como "oscilación" o "rango", no como "amplitud" en las fuentes.
- **Amplitud geográfica o ecológica**: **no documentada** en el corpus.

Fuente: reto_y_datos/Descripcion_general_variables_DataSet.txt; plagas_danos/iterate_20261017__research__A2_outlier_forensics.md; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt;
agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md

## Glosario: regionalismos, malta, compradores y norma de recepción

Contexto: la cadena de la cebada maltera en el Altiplano está dominada por pocos compradores. Estos términos provienen de fuentes de prensa, presentaciones de la industria y registros de contratos. No son fuentes institucionales de la base del reto, por lo que se usan solo como contexto.

- **Malta (malt)**: grano germinado y secado, base de la cerveza. La cebada maltera requiere alto extracto y bajo contenido de proteína, dentro de rangos de la industria (extracto de al menos 78 %, proteína de 10 a 12.5 %, según una presentación de IASA hacia 2013). El rango de proteína coincide con una especificación
  comercial de malta diastásica de un fabricante (10.0–12.5 % en base seca; extracto fino mínimo de 81.5 %), pero el umbral de 78 % de extracto **no está verificado**.
- **Impulsora Agrícola, S.A. (IASA)**: empresa fundada en 1958 por cerveceras que registraba proveedores, distribuía semilla y agroquímicos, y contrataba la compra. Desde alrededor de 2016, Grupo Modelo y Heineken México compran de forma directa (literatura de prensa y presentación de la industria).
- **Cebadas y Maltas (Grupo Modelo, Calpulalpan, Tlaxcala)**: planta maltera que procesa 186 000 t de cebada al año, según prensa de 2020.
- **Grano lleno (plump grain)**: fracción de grano de tamaño suficiente. La norma mexicana NMX-FF-043-SCFI-2003 (DOF 18 de noviembre de 2003) fija la calidad de la cebada maltera. Un estudio de Hidalgo que la aplica reporta germinación mínima de 85 % (verificado, fuente secundaria). El umbral de 85 % de grano lleno
  **no está verificado** (SIN EVIDENCIA: texto de la norma no accesible).
- **Germinación (germination)**: capacidad del grano para brotar; requisito de recepción para la malta.
- **Deducciones por calidad**: descuentos al precio por humedad, peso hectolítrico o calidad del grano en la recepción.
- **ACYD**: abreviatura usada en el corpus junto con SIAP. **No definida** en las fuentes revisadas.

Fuente: agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md; agronomia/literature_review__research_notes__Panicle_coverage_and_barley_yield__mexico_rainfed_malting_barley.md; literatura_aplicacion/literature_review__research__cebada_comparison_20261011__comparison.typ.txt

## Glosario: registros de productores, estadísticas oficiales y seguros

Contexto: las etiquetas y estadísticas del reto provienen de fuentes distintas, con unidades y niveles de agregación que no son equivalentes. Por eso conviene identificar a qué nivel corresponde cada registro antes de compararlos.

- **SIAP (Servicio de Información Agroalimentaria y Pesquera)**: servicio de estadística agrícola de SADER, con cifras municipales por ciclo y modalidad. El reto usa un subconjunto de cebada de temporal de SIAP para antecedentes municipales.
- **Campaña agrícola**: periodo de cultivo con su propio ciclo, por ejemplo abril–octubre de 2025.
- **Bitácora (registro de manejo)**: registro de prácticas, siembra, cosecha y rendimiento de un productor. El conjunto BEM/e-Agrology de CIMMYT tiene 968 bitácoras de cebada, con coordenadas truncadas a tres decimales.
- **Sistema Producto**: organización de productores y gobierno por cadena productiva. Un representante de cebada en Hidalgo informó en 2025 que la lluvia llegó antes de lo normal (prensa).
- **Seguro catastrófico (SAC)**: cubre solo pérdidas totales. En 2025 Hidalgo dejó de contratarlo y destinó 120 millones de pesos a apoyos directos por sequía y heladas (prensa regional).
- **Nivel de agregación**: escala de la unidad observada, como parcela, municipio, distrito o estado. Un promedio municipal no mide cada parcela.

Fuente: literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt; literatura_aplicacion/literature_review__report__sections__08b_lecturas.typ.txt; agronomia/literature_review__research_notes__Panicle_coverage_and_barley_yield__mexico_rainfed_malting_barley.md;
agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md; reto_y_datos/modelado__DATASET.md

## Glosario: calidad maltera (proteína, extracto, poder diastásico y friabilidad)

Contexto: la cebada maltera se evalúa por parámetros que predicen su comportamiento en el malteo. Las cifras de esta sección vienen de fuentes técnicas y de fabricantes; no son umbrales de una norma mexicana, salvo que se indique.

- **Proteína total (total protein)**: contenido de proteína del grano, en porcentaje. Una especificación comercial de malta diastásica la fija entre 10.0 % y 12.5 % en base seca (fabricante; no es norma). Una tesis de la Escuela Politécnica Nacional la midió junto con el poder diastásico en 15 genotipos de cebada.
- **Poder diastásico (diastatic power; WK)**: capacidad enzimática de la malta para convertir almidón en azúcares fermentables, en unidades Windisch-Kolbach (WK). Según un fabricante, las maltas pálidas rondan 300 WK y las diastásicas superan 520 WK. Un estudio agronómico rumano reporta entre 189 y 419 WK según la
  variedad de cebada.
- **Extracto fino (fine extract)**: porcentaje de materia soluble que la malta cede en el mosto. La especificación comercial de malta diastásica citada fija un mínimo de 81.5 % en base seca.
- **Friabilidad (friability)**: medida de qué tanto se modifica el endospermo durante el malteo. Un estudio mexicano señala que se correlaciona negativamente con la proteína total y con el poder diastásico.
- **Recuperación maltera (malting recovery)** e **índice de harinosidad**: parámetros de la tesis de la Escuela Politécnica Nacional, junto con la α-amilasa de la malta obtenida. Miden la aptitud maltera de cada genotipo; la tesis no fija umbrales.

Fuente: bibdigital.epn.edu.ec/handle/15000/15157 (tesis sobre aptitud maltera de 15 genotipos); alt.bestmalz.de/en/?p=12588 (especificación de fabricante); estudio mexicano sobre friabilidad citado en resumen de búsqueda (URL exacta no confirmada).

## Glosario: calidad maltera (peso hectolítrico, calibre y norma mexicana)

Contexto: la norma NMX-FF-043-SCFI-2003 regula la cebada destinada a malta en México. Sus especificaciones se verificaron en el texto oficial (ver rag-16-malteo-calidad): humedad 11.5–13.5 %, 85 % de grano de tamaño maltero (criba 2.18 × 19 mm), germinación ≥ 85 %, grano dañado ≤ 10 %, peso hectolítrico ≥ 56 kg/hL
(seis hileras) y ≥ 58 kg/hL (dos hileras); no fija proteína.

- **Peso hectolítrico (test weight; kg/hL)**: masa de un hectolitro de grano. Según la Revista Fitotecnia Mexicana, la norma exige un mínimo de 56 kg/hL para cebada de seis hileras y de 58 kg/hL para la de dos hileras.
- **Calibre o tamaño de grano (grain size)**: tamaño del grano, que puede medirse por retención en tamiz (método no verificado). La cebada de dos hileras presenta mejor uniformidad y tamaño de grano, lo que facilita el malteo (Revista Fitotecnia Mexicana).
- **NMX-FF-043-SCFI-2003**: norma «Cereal-cebada maltera (Hordeum vulgare L. y Hordeum distichum L.)-Especificaciones y métodos de prueba». Publicada en el Diario Oficial de la Federación el 18 de noviembre de 2003, entró en vigor en enero de 2004 y cancela la NMX-FF-043-1982 (ficha de la Secretaría de Economía).

Fuente: revistafitotecniamexicana.org/documentos/48-3/9a.pdf (peso hectolítrico y uniformidad de grano); platiica.economia.gob.mx/normalizacion/?p=158873 (ficha de la norma).

## Glosario: morfología de la cebada (género, espiga, espiguilla, raquis y arista)

Contexto: estas estructuras definen el tipo de espiga, por lo que son la base de la distinción entre cebada de dos y de seis hileras. Los datos provienen de floras regionales, que describen la cebada cultivada como Hordeum vulgare.

- **Hordeum (género)**: género de gramíneas (Poaceae), con especies anuales y perennes. La cebada cultivada es Hordeum vulgare.
- **Espiga (spike; inflorescencia)**: inflorescencia de la cebada. Puede ser dística o comprimida, con raquis frágil o tenaz.
- **Espiguilla (spikelet)**: unidad elemental de la inflorescencia de las gramíneas. En Hordeum se disponen en grupos de tres en cada nudo del raquis. La central siempre es hermafrodita; las laterales pueden ser fértiles o estériles.
- **Raquis (rachis)**: eje de la espiga, donde se insertan las espiguillas. Es frágil en especies silvestres y tenaz en las cultivadas, por lo que la cebada cultivada no se desarticula en la madurez.
- **Arista (awn)**: prolongación en forma de pelo de las espiguillas. En la cebada cultivada, según una flora de Aranzadi, todas las espiguillas son fértiles y largamente aristadas.

Fuente: monteriza.aranzadi.eus/wp-content/uploads/flora/169.hordeum-vulgare.pdf (flora de Aranzadi); floracatalana.cat (género Hordeum); flora de Uruguay (raquis frágil o tenaz, resumen de búsqueda).

## Glosario: cebada de dos hileras y de seis hileras

Contexto: la diferencia está en la fertilidad de las espiguillas laterales. En el reto, las parcelas se reparten entre una variedad de seis hileras y una de dos hileras (hecho confirmado por el proyecto).

- **Cebada de seis hileras (six-row barley; Hordeum vulgare)**: las tres espiguillas de cada nudo son fértiles, por lo que la espiga tiene seis hileras de grano. Un trabajo del INIFAP señala que en México el cultivo se hace básicamente para grano de calidad maltera, con variedades de seis hileras.
- **Cebada de dos hileras (two-row barley; Hordeum distichum)**: solo la flor central de cada nudo es fértil (flora de Pina de Ebro). La Revista Fitotecnia Mexicana indica que presenta mejores características de uniformidad y tamaño de grano, lo que facilita el malteo, y que crece la demanda de variedades de dos
  hileras con buen rendimiento y calidad.

Fuente: flora de Pina de Ebro (Hordeum vulgare, resumen de búsqueda); revistafitotecniamexicana.org/documentos/48-3/9a.pdf; trabajo del INIFAP sobre cebada de malta (resumen de búsqueda).

## Glosario: variedades de cebada en Hidalgo (Doña Josefa, Esperanza, Esmeralda y Voyager)

Contexto: estas variedades aparecen en estudios de calidad maltera de Hidalgo y en la literatura de INIFAP. Se indica cuál dato proviene del proyecto y cuál de la literatura.

- **Doña Josefa (variedad)**: cebada maltera estudiada en la región de Apan, Hidalgo, junto con Esmeralda y Pastor Ortiz. Un estudio de 2019 la reporta con germinación de 86 a 92 %, la más alta de las tres. Una publicación de la UAEH la describe como variedad nueva, con mayor resistencia a enfermedades. Que sea de seis
  hileras es un dato de la verificación local del proyecto, no confirmado en fuentes externas.
- **Esperanza (variedad)**: variedad de cebada liberada por INIFAP, citada entre las más importantes del instituto junto con Emerald.
- **Esmeralda (variedad)**: variedad citada en estudios de Hidalgo. No se confirmó que la variedad Emerald citada por INIFAP sea la misma.
- **Programa Nacional de Cebada**: ha liberado 22 variedades desde 1959, 17 malteras y 5 forrajeras (Revista Mexicana de Ciencias Agrícolas, citada por resumen de búsqueda).
- **Voyager (variedad)**: en el proyecto se confirma como variedad de dos hileras por verificación local. No se encontró ficha técnica ni registro de liberación en la búsqueda (**SIN EVIDENCIA** en fuentes externas).

Fuente: redalyc.org/pdf/2631/263144153014.pdf (estudio de cebadas de Hidalgo, 2019); repository.uaeh.edu.mx/revistas/index.php/icbi/article/view/571 (UAEH); cienciasagricolas.inifap.gob.mx/index.php/agricolas/article/view/2807 (INIFAP, 1985–2020); verificación local del proyecto (18 de octubre de 2026).

## Glosario: tepetate, duripán y horizontes endurecidos del Altiplano

Contexto: el tepetate es una capa volcánica endurecida que dificulta la labranza en partes de México. Los datos siguientes son de estudios regionales y no describen una parcela concreta del reto.

- **Tepetate (tepetate)**: horizonte endurecido, compactado o cementado, de origen volcánico, que se encuentra bajo los suelos o aflorando en paisajes volcánicos de México. Un estudio cita que ocupa cerca de 30 % de la superficie del país, mientras que el IRD da un intervalo de 30 000 a 140 000 km² para el Eje
  Neovolcánico; las dos cifras no se reconcilian en las fuentes.
- **Duripán (duripan)**: tepetate cementado sobre todo por sílice. Su clasificación se basa en el agente cementante (UNAM).
- **Propiedades restrictivas**: alta densidad, baja conductividad hidráulica, baja retención de humedad y pobre fertilidad. Dificultan la labranza, y su rehabilitación es costosa (estudio citado en la búsqueda).
- **Paleosuelo (paleosol)**: suelo formado en un periodo anterior. Un estudio de Buenavista, Morelos, sostiene que algunos tepetates son paleosuelos con distinto grado de desarrollo.
- **Meteorización química incipiente a moderada**: grado observado en siete perfiles de tepetate del Estado de México.

Fuente: rmcg.geociencias.unam.mx/index.php/rmcg/article/download/1644/1632 (UNAM); redalyc.org/pdf/943/94320861011.pdf (los tepetates y su dinámica ambiental); horizon.documentation.ird.fr (IRD, resumen de búsqueda).

## Glosario: grupos de suelo WRB presentes en el centro de México (Phaeozem, Andosol, Vertisol)

Contexto: estas cifras son del Estado de México y del territorio nacional (INEGI), no de Hidalgo, Puebla o Tlaxcala. La clasificación WRB 2022 es la referencia de nomenclatura.

- **Phaeozem (grupo WRB)**: según INEGI cubre cerca de 11.7 % del territorio nacional (cifra citada en resumen de búsqueda). En el Estado de México ocupa 476 768 ha (estudio 1:50 000 con WRB 2006 y 2022). La definición WRB detallada no se verificó en esta revisión.
- **Andosol (grupo WRB)**: según INEGI cubre cerca de 1.2 % del territorio, concentrado en el Eje Neovolcánico y en Chiapas. En el Estado de México ocupa 479 908 ha, la mayor superficie del estudio. La definición WRB detallada no se verificó.
- **Vertisol (grupo WRB)**: según INEGI cubre cerca de 8.6 % del territorio nacional. En el Estado de México ocupa 317 503 ha. La definición WRB detallada no se verificó.
- **Rendzic Leptosol (leptosol rendzico)**: nombre WRB 2022 que, en el estudio del Estado de México, reemplaza a las antiguas rendzinas.
- **Secuencia de evolución**: en climas más secos, los suelos volcánicos pueden pasar de Andosol a Phaeozem y luego a Vertisol, según una fuente citada en la búsqueda (inferencia regional; no es una cartografía del Altiplano).

Fuente: terralatinoamericana.org/index.php/terra/article/view/1795 (actualización cartográfica 1:50 000 del Estado de México); INEGI, cifras de participación nacional citadas en la misma búsqueda; apps1.semarnat.gob.mx (compendio de suelos, resumen de búsqueda).

## Glosario: labranza primaria y secundaria (laboreo)

Contexto: estas labores preparan el suelo antes de la siembra. Las fuentes son españolas (MAPA) y de la Universidad Nacional de La Plata; no hay una definición mexicana verificada.

- **Laboreo primario (primary tillage)**: labor que actúa sobre todo el perfil del suelo, antes de la labor secundaria.
- **Laboreo o labor secundaria (secondary tillage)**: termina de preparar el perfil y el lecho donde germina la semilla. Su profundidad de acción suele ser menor de 10–12 cm.
- **Gradas de discos (disc harrow)**: apero básico de la labor secundaria. Por el desplazamiento lateral de los discos produce asentamiento y nivelación del suelo.
- **Lecho de siembra (seedbed)**: capa algo compactada a unos 2–8 cm de profundidad, con tierra fina para la germinación, y una capa superficial suelta que evita la costra.

Fuente: servicio.mapa.gob.es (Labor secundario, MAPA, España); mapa.gob.es (Agrotec, 2014); aulavirtual.agro.unlp.edu.ar (Universidad Nacional de La Plata, resumen de búsqueda).

## Glosario: instituciones de crédito y garantía agropecuaria en México (FIRA, fideicomisos, FND)

Contexto: el crédito y la garantía para el sector agropecuario mexicano se canalizan en buena parte por fideicomisos públicos. Las siglas siguientes aparecen en documentos del proyecto y del corpus; para cada una se indica su estado en las fuentes oficiales consultadas en octubre de 2026.

- **FIRA (Fideicomisos Instituidos en Relación con la Agricultura, Ganadería y Avicultura)**: conjunto de fideicomisos públicos que ofrece garantías y financiamiento al sector agropecuario y publica informes de gestión de 2018 a 2024 (fira.gob.mx; corpus doc 11).
- **FEFA (Fondo Especial para Financiamientos Agropecuarios)**: fideicomiso de FIRA con informe de gestión 2018–2024; aparece como encabezado de la sección «Relación con Inversionistas» (fira.gob.mx). Expansión verificada en el Programa Institucional 2025 de FIRA.
- **FEGA (Fondo Especial de Asistencia Técnica y Garantía para Créditos Agropecuarios)**: fideicomiso de FIRA que otorga garantías de crédito y asistencia técnica (verificado: FIRA, Programa Institucional 2025, glosario de siglas; FIRA, documento de 29/08/2024).
- **FONDO (Fondo de Garantía y Fomento para la Agricultura, Ganadería y Avicultura) y FOPESCA (Fondo de Garantía y Fomento para las Actividades Pesqueras)**: fideicomisos de FIRA con informes de gestión 2018–2024 publicados en el sitio oficial; FONDO aparece también como encabezado de inversionistas (fira.gob.mx).
  Expansiones verificadas en el Programa Institucional 2025 de FIRA.
- **FONAGA (Fondo Nacional de Garantías)**: la expansión está en el glosario de siglas del Programa Institucional 2025 de FIRA (verificado). FIRA lo menciona como fondo cuyas garantías pagadas se suman a las de FEGA («FEGA, otros fondos y FONAGA»), pero no lo incluye entre sus cuatro fideicomisos. Su naturaleza
  jurídica y su relación con FEGA **no están documentadas**.
- **Garantía FIRA**: garantía que FIRA ofrece para dar certidumbre a los intermediarios financieros que otorgan crédito agropecuario (fira.gob.mx, sección «Crédito y Garantía»).
- **Cotizador de coberturas**: herramienta de FIRA para estimar coberturas de seguros agropecuarios (fira.gob.mx, micrositio de seguros).
- **AGROASEMEX**: entidad de seguros cuyo sitio en gob.mx se identifica como «Sitio de Agroasemex, S.A.». Aparece en el micrositio de seguros de FIRA; su sitio no describe productos agrícolas (gob.mx/agroasemex).
- **Agricultura por contrato (contract farming)**: esquema en el que el productor se compromete a vender una producción a un comprador en condiciones fijadas antes de la cosecha. Definición de la FAO citada en un documento legislativo mexicano de 2020 (verificado: Cámara de Diputados, LXIV Legislatura, Grupo
  Parlamentario del PRI): acuerdo entre agricultores y compradores que fija por adelantado el precio, la cantidad y calidad y la fecha de entrega, y que puede incluir insumos y asesoría técnica. En México, la Agricultura por Contrato (AxC) funcionó desde 2004 para granos y oleaginosas; el mismo documento afirma que el
  gobierno federal la desmanteló (afirmación de parte, sin confirmación en fuentes oficiales). El término también aparece en el Routledge Handbook of Contract Farming (2026, DOI 10.4324/9781003513674-21, solo título
  verificado). No hay evidencia de contratos de cebada en Hidalgo, Puebla o Tlaxcala.
- **SAC y CADENA**: nombres de programas de seguro que surgieron en búsquedas; SIN EVIDENCIA de que ofrezcan seguro de cebada (corpus doc 11).
- **FND (Financiera Nacional de Desarrollo Agropecuario, Rural, Forestal y Pesquero)**: extinta por decreto publicado en el DOF el 29 de mayo de 2023; conserva personalidad solo para la liquidación, con el INDEP como liquidador. No debe citarse como financiadora vigente.

Fuente: fira.gob.mx (sitio oficial, consultado 18 de octubre de 2026); gob.mx/agroasemex (consultado); DOF nota 5690272, decreto de extinción de la FND (29/05/2023), https://dof.gob.mx/nota_detalle.php?codigo=5690272&fecha=29/05/2023; corpus doc 11 (verificado).

## Glosario: seguros agropecuarios e índices (paramétrico, por índice, catastrófico)

Contexto: el seguro agropecuario convencional indemniza la pérdida de producción verificada en cada parcela. El seguro por índice paga según el valor de una variable medible, como un índice climático o satelital, y no según la pérdida de la parcela. En la literatura citada, estos diseños se han documentado para
ganadería y pastizales, no para cebada maltera de México.

- **Seguro agropecuario (agricultural insurance)**: protección económica frente a sequías, inundaciones, plagas y enfermedades. FIRA lo describe como «crucial para la estabilidad y desarrollo del sector» (fira.gob.mx).
- **Seguro convencional o de indemnización (indemnity insurance)**: paga la pérdida de producción verificable en campo. Miranda y Farrin (2012) lo comparan con el seguro indexado, que tiene costos de transacción menores según el resumen del artículo.
- **Seguro por índice (index insurance)**: paga según el valor observado de un índice correlacionado con las pérdidas. Miranda y Farrin (2012, Applied Economic Perspectives and Policy 34(3):391–427, DOI 10.1093/aepp/pps031) revisan su aplicación en países en desarrollo.
- **Seguro paramétrico (parametric insurance)**: seguro por índice en el que el pago se activa cuando una variable medible supera un umbral pactado. AGROASEMEX documentó un diseño de este tipo en Terra Latinoamericana 36(2) (2018), con índice 1/NDVIcp y modelo de biomasa Bm = k·IV, para ganadería y pastizales.
- **Seguro catastrófico (catastrophic insurance)**: cobertura que paga ante eventos extremos de gran magnitud. El diseño de AGROASEMEX de 2018 se clasifica como de tipo catastrófico (Paz et al., 2018).
- **Umbral de activación (trigger)**: valor del índice a partir del cual se paga la indemnización. Definición general; no hay umbral verificado para cebada en México.
- **Riesgo de base (basis risk)**: diferencia entre lo que paga el índice y la pérdida real del productor. Es el problema central del diseño de seguros por índice; Gyamerah y Boiquaye (2026, North American Actuarial Journal, DOI 10.1080/10920277.2026.2626903) lo abordan en seguros por índice de rendimiento (según el
  título).
- **Seguro de cebada por rendimiento satelital en México**: SIN EVIDENCIA. No se encontró un producto así en FIRA, AGROASEMEX ni en la literatura consultada; el diseño de 2018 es para ganadería.

Fuente: Paz et al. (2018), Terra Latinoamericana 36(2):131–152, DOI 10.28940/terra.v36i2.231; Miranda y Farrin (2012), Applied Economic Perspectives and Policy 34(3):391–427, DOI 10.1093/aepp/pps031 (resumen); Gyamerah y Boiquaye (2026), DOI 10.1080/10920277.2026.2626903 (título); fira.gob.mx (micrositio de seguros);
corpus doc 11.

## Glosario: estadística agropecuaria del SIAP (superficie, rendimiento, siniestralidad y milpa)

Contexto: las variables de superficie del SIAP se definen en su Normatividad Técnica para la Generación de Estadística Básica Agropecuaria (NTGEBAP, archivo NTGEBAP_2022.pdf, publicado en gob.mx en 2023). Estas definiciones son las que usan las estadísticas de producción de los estados del reto. Las páginas del SIAP no
definen estos términos por sí mismas; la definición está en el PDF.

- **Superficie sembrada (planted area)**: área agrícola en la que se deposita la semilla de un cultivo, previa preparación del suelo; es la variable base de la estadística agrícola (SIAP, NTGEBAP 2022).
- **Superficie cosechada (harvested area)**: área en la que se cosechó un producto, en una sola ocasión o en varios cortes. No puede ser mayor que la superficie sembrada (verificado: SIAP, NTGEBAP 2022, sección de coherencia entre variables).
- **Superficie siniestrada (damaged area)**: área sembrada que, en el ciclo y mes de reporte, registra pérdida total por sequía, exceso de humedad, helada, bajas temperaturas, vientos, inundaciones, granizo, onda cálida o plagas y enfermedades (SIAP, NTGEBAP 2022, pp. 22–23).
- **Índice de siniestralidad (damage index)**: superficie siniestrada entre superficie sembrada, multiplicada por cien (SIAP, NTGEBAP 2022). No es la razón de pérdida de un seguro, que compara indemnizaciones con primas.
- **Rendimiento obtenido (obtained yield)**: producción obtenida entre superficie cosechada; puede medirse en campo o estimarse por entrevista (SIAP, NTGEBAP 2022, p. 28).
- **Producción obtenida (obtained production)**: volumen cosechado, igual al rendimiento por la superficie cosechada (SIAP, NTGEBAP 2022).
- **Superficie de temporal (rainfed area)**: área cuyo desarrollo depende solo de lluvias o de humedad residual; las áreas de riego que no recibieron riego en el ciclo cuentan como temporal (SIAP, NTGEBAP 2022; SEMARNAT, metadatos del indicador 3-1, verificado en corpus doc 02).
- **Barbecho (fallow)**: en la NTGEBAP aparece como labor de mecanización, junto con rastra, subsoleo, nivelación y siembra; el documento no la define. Definición oficial SIN EVIDENCIA.
- **Milpa (milpa)**: policultivo tradicional de maíz, frijol y calabaza, conocido como «tres hermanas» en la literatura. Las cifras y la definición de CONABIO no se pudieron abrir; la literatura de polycultivo se cita en Eur. J. Agron. 2024, DOI 10.1016/j.eja.2024.127118 (título verificado). No es categoría estadística
  del SIAP.

Fuente: SIAP, Normatividad Técnica para la Generación de Estadística Básica Agropecuaria (NTGEBAP_2022), https://www.gob.mx/cms/uploads/attachment/file/789519/NTGEBAP_2022.pdf (PDF leído con pdftotext); SEMARNAT, metadatos del indicador 3-1 (corpus doc 02); «The Three Sisters» polyculture, European Journal of Agronomy
(2024), DOI 10.1016/j.eja.2024.127118 (título).

## Glosario: percepción remota con Sentinel-2 (reflectancia, corrección atmosférica y máscaras)

Contexto: el proyecto usa imágenes Sentinel-2 e índices espectrales. Estos términos describen el procesamiento y la limpieza de nubes antes de calcular un índice; las cifras de resolución y revisita no se verificaron.

- **Reflectancia de superficie (surface reflectance)**: fracción de la radiación que la superficie refleja, corregida de los efectos de la atmósfera. Se deriva de medidas al tope de la atmósfera (Li et al., 2018, IEEE JSTARS, DOI 10.1109/jstars.2018.2835823, resumen).
- **Nivel L2A (Level-2A)**: producto de Sentinel-2 con reflectancia de superficie (BOA, bottom of atmosphere) ya corregida; L1C es la reflectancia al tope de la atmósfera (DOI 10.5270/s2_-6eb6imz, título).
- **Corrección atmosférica (atmospheric correction)**: estimación de aerosoles y vapor de agua para pasar de radiancia a reflectancia de superficie; Sen2Cor es el procesador de Sentinel-2 y tiene límites en aerosoles (Li et al., 2018, resumen).
- **Borde rojo (red edge)**: zona espectral entre rojo e infrarrojo cercano donde la reflectancia de la vegetación sube abruptamente; sirve para estimar clorofila (definición general; DOI 10.1016/j.ecolind.2020.106876, título).
- **Máscara de nubes (cloud mask)**: capa que marca los píxeles con nubes para excluirlos (definición general).
- **Fmask**: algoritmo de detección de nubes, sombra de nube y nieve. Se publicó para Landsat en Zhu y Woodcock (2012, RSE, DOI 10.1016/j.rse.2011.10.028) y se amplió a Sentinel-2 en Zhu, Wang y Woodcock (2015, RSE, DOI 10.1016/j.rse.2014.12.014).
- **Sombra de nube (cloud shadow)**: zona oscurecida por una nube; Fmask la detecta junto con las nubes.
- **Compuesto temporal (temporal composite)**: imagen que resume varias fechas, por ejemplo con el valor máximo de NDVI por píxel (Noise estimation in NOAA AVHRR maximum-value composite NDVI images, 1995, DOI 10.1080/01431169508954601, título).
- **Revisita (revisit time)**: intervalo entre dos capturas del mismo punto. Sentinel-2 tiene una revisita de 5 días con su constelación de dos satélites (verificado: Copernicus, página de la misión Sentinel-2). Drusch et al. (2012, RSE, DOI 10.1016/j.rse.2011.11.026) describe la misión.
- **Resolución espacial, temporal, espectral y radiométrica**: tamaño del píxel; frecuencia de captura; número y ancho de bandas; niveles de codificación de la señal. Definiciones generales. Sentinel-2: 10 m de resolución espacial (verificado: Copernicus, misión Sentinel-2); las resoluciones de 20 m y 60 m de otras
  bandas no se verificaron en esta ronda (**SIN EVIDENCIA**).
- **Píxel mixto (mixed pixel)**: píxel cuya señal combina varias coberturas (suelo, planta, sombra). Se trata con desmezcla espectral (spectral unmixing), como en Remote Sensing 15(24), 2023, DOI 10.3390/rs15245694 (título).
- **Armonización entre sensores (harmonization)**: ajuste de productos de distintos satélites para que sean comparables; HLS armoniza Landsat y Sentinel-2 (PE&RS 2026, DOI 10.14358/pers.26-00028r3, título).

Fuente: Li et al. (2018), IEEE JSTARS, DOI 10.1109/jstars.2018.2835823; Zhu y Woodcock (2012), DOI 10.1016/j.rse.2011.10.028; Zhu et al. (2015), DOI 10.1016/j.rse.2014.12.014; Drusch et al. (2012), DOI 10.1016/j.rse.2011.11.026; PE&RS (2026), DOI 10.14358/pers.26-00028r3; DOI 10.5270/s2_-6eb6imz (títulos y resúmenes de
Crossref y Semantic Scholar).

## Glosario: suelo, compactación y labranza en el Altiplano (piso de arado, tepetate, Phaeozem, Durisol)

Contexto: propiedades físicas del suelo y prácticas de labranza que afectan la cebada de temporal. Las cifras provienen de estudios mexicanos del corpus, de la FAO y de la WRB; los rangos sin fuente se marcan.

- **Compactación del suelo (soil compaction)**: reducción del volumen de poros por carga mecánica. En parcelas mecanizadas de Chiapas (maíz), las cifras reportadas fueron 83.3 % a 0–20 cm y 94.6 % a 20–40 cm (López Báez et al., 2018, RMCA 9(1), DOI 10.29312/remexca.v9i1.848).
- **Densidad aparente (bulk density; g/cm³)**: masa de suelo seco por unidad de volumen total, con poros. Un valor alto indica compactación. Un ensayo INIFAP de 22 años en San Luis Potosí (maíz) reportó que la labranza cero mejoró la porosidad, la densidad aparente y la infiltración (Martínez-Gamiño et al., 2019,
  RMCA).
- **Materia orgánica (soil organic matter)**: fracción orgánica del suelo, que incluye carbono orgánico y residuos. En tepetates recientes, el manejo orgánico aumentó el carbono orgánico y la cobertura (Haulon et al., resumen verificado en corpus doc 05).
- **Piso de arado (plow pan; suela de labor)**: capa compactada bajo la profundidad de labor, causada por el paso repetido de implementos. López Báez et al. (2018) midieron una capa dura promedio de 12.4 cm (±4.1) en suelos mecanizados. El rango de 12 a 30 cm no tiene fuente (SIN EVIDENCIA).
- **Tepetate**: horizonte endurecido presente en el Altiplano y la cuenca de México (corpus doc 05). Ventura (1998, Purdue) lo describe en sitios de hasta 800 mm de lluvia, con arcillas de halloysita y esmectita.
- **Erosión hídrica (water erosion)**: pérdida de suelo por escurrimiento. Haulon et al. reportan 8.6–19.1 t/ha/año en tepetates convencionales (2002) y 1.1–5.6 t/ha/año en tepetates de 1989.
- **Labranza de conservación (conservation agriculture)**: sistema que combina mínima alteración mecánica del suelo, cobertura orgánica de al menos 30 % y secuencias o asociaciones de al menos tres cultivos (FAO, fao.org/conservation-agriculture/en/).
- **Labranza mínima (minimum tillage)**: reduce la perturbación del suelo al mínimo necesario; la no labranza es su forma más estricta (FAO).
- **Phaeozem (WRB)**: grupo de suelos con horizonte móllico, saturación de bases de al menos 50 % entre 25 y 100 cm y matriz libre de carbonatos hasta 100 cm (WRB, wrb.isric.org/soilgroups/phaeozem.html).
- **Durisol (WRB)**: grupo de suelos con un horizonte (petro-)dúrico dentro de los primeros 100 cm, formado por acumulación de sílice secundaria (WRB, wrb.isric.org/soilgroups/durisol.html).

Fuente: López Báez et al. (2018), RMCA 9(1), DOI 10.29312/remexca.v9i1.848 (PDF leído); Martínez-Gamiño et al. (2019), RMCA (corpus doc 05); Haulon et al. y Ventura (1998) (corpus doc 05); FAO, fao.org/conservation-agriculture/en/; WRB, wrb.isric.org.

## Glosario: calidad maltera del grano (germinación, grano malteable, extracto y proteína por fracción)

Contexto: la calidad maltera de la cebada se evalúa con pruebas de germinación, de tamaño de grano y de composición. Los umbrales de la NMX-FF-043-SCFI-2003 se verificaron en el texto oficial (rag-16-malteo-calidad).

- **Germinación (germination; %)**: porcentaje de granos que brotan en la prueba de laboratorio. La norma citada pide al menos 85 % (estudio de Hidalgo de 2019 que la aplica; corpus doc 02). Soto Carrasquel et al. (2016, UAEH) reportaron germinación mayor de 85 % en Esmeralda, Pastor Ortiz y Doña Josefa, con 86 a 92 %
  en Doña Josefa.
- **Grano lleno (plump grain; %)**: fracción de grano de tamaño completo. Una cifra de 85 % se atribuye a la norma; SIN EVIDENCIA en el texto consultado.
- **Humedad del grano (grain moisture; %)**: rango de 11.5 a 13.5 % atribuido a la norma; SIN EVIDENCIA en el texto consultado (corpus doc 03).
- **Grano malteable (malting grain fraction)**: porcentaje de grano retenido en criba de 5.5/64 de pulgada. González-González et al. (2016, SciELO) lo reportaron en ensayos de temporal de 2012–2013 en Calpulalpan y Tlacatecpan (corpus doc 03).
- **Proteína por fracción de tamaño (grain protein by size fraction)**: el contenido de proteína del grano varía según la fracción de tamaño; Magliano et al. (2014, Journal of the Institute of Brewing, DOI 10.1002/jib.161, título). La cebada maltera suele buscar proteína baja.
- **Extracto de malta (malt extract)**: proporción de materia soluble que la malta cede al mosto; es parámetro de calidad maltera junto con el poder diastásico (Agu, 2009, Technical Quarterly 46(1), DOI 10.1094/tq-46-1-0226-01, título).
- **Viscosidad del mosto (wort viscosity)**: resistencia del mosto a fluir. Según el corpus (doc 13), en un estudio de 1989 las cebadas coreanas de seis hileras tuvieron mayor viscosidad y menor extracto que las de dos hileras.
- **Modificación de la malta (malt modification)**: grado en que el endospermo se degrada durante el malteo; se mide, entre otros métodos, por friabilidad (método ASBC, Malt Modification by Friability, DOI 10.1094/asbcmoa-malt-12, título).

Fuente: Secretaría de Economía, ficha PLATIICA de la NMX-FF-043-SCFI-2003 (corpus doc 03); Soto Carrasquel et al. (2016), repositorio UAEH; González-González et al. (2016), SciELO (corpus doc 03); Magliano et al. (2014), DOI 10.1002/jib.161; Agu (2009), DOI 10.1094/tq-46-1-0226-01; ASBC (2011), DOI
10.1094/asbcmoa-malt-12; corpus doc 13.

## Glosario: fisiología y desarrollo de la cebada (macollo, espiga, grano, latencia, acame)

Contexto: cebada (*Hordeum vulgare*) de temporal en el Altiplano central, sembrada de mayo a inicios de julio en el ciclo abril–octubre de 2025 del reto. Definiciones de fisiología de la planta; no incluyen cifras del proyecto.

- **Macollo (tiller; macollamiento)**: tallo lateral que brota de la base de la planta. Su número y supervivencia fijan la densidad de espigas (Cannell, 1969).
- **Entrenudo (internode)**: segmento del tallo entre dos nudos; su elongación es la encañazón.
- **Nudo (node)**: punto del tallo donde se insertan hojas y, en la espiga, grupos de espiguillas.
- **Vaina (sheath)**: base envolvente de la hoja que rodea el tallo.
- **Espiga (spike; ear)**: inflorescencia terminal que contiene las espiguillas.
- **Espiguilla (spikelet)**: unidad de la espiga; en cebada se agrupan de tres en cada nudo del raquis.
- **Raquis (rachis)**: eje de la espiga. En la cebada cultivada es tenaz; en la silvestre, frágil (Pourkheirandish y Komatsuda, 2007).
- **Arista (awn)**: prolongación en forma de pelo de la espiguilla. Su desarrollo decide la supervivencia de la espiguilla (Alqudah y Schnurbusch, 2013).
- **Hilera (row)**: número de espiguillas fértiles por nudo; seis hileras si las tres son fértiles, dos si solo es fértil la central.
- **Grano o cariópside (caryopsis)**: fruto de la gramínea, con cubierta, embrión y endospermo.
- **Pericarpio (pericarp)**: cubierta externa del grano.
- **Endospermo (endosperm)**: tejido de reserva, rico en almidón, que se moviliza en la germinación (Fincher, 1989).
- **Aleurona (aleurone layer)**: capa externa del endospermo que secreta enzimas hidrolíticas en la germinación (Fincher, 1989).
- **Embrión (embryo; escutelo)**: eje embrionario con el escutelo, que absorbe los nutrientes del endospermo.
- **Antesis (anthesis)**: apertura de las flores y polinización.
- **Espigamiento (heading)**: emergencia de la espiga fuera de la vaina de la hoja bandera.
- **Llenado de grano (grain filling)**: acumulación de materia seca en el grano tras la antesis.
- **Latencia (dormancy)**: estado de una semilla viable que no germina aun en condiciones favorables (Gubler et al., 2005).
- **Germinación precosecha (preharvest sprouting)**: brote del grano en la espiga antes de cosechar, favorecido por humedad; reduce la calidad maltera (Benech-Arnold, 2024, título).
- **Acame (lodging)**: caída o doblamiento del tallo por viento, lluvia o granizo. Definición general; sin fuente verificada en esta ronda.
- **Hoja bandera (flag leaf)**: última hoja del tallo; aporta asimilados al llenado del grano.

Fuente: Cannell (1969), J. Agric. Sci., DOI 10.1017/s0021859600024837; Alqudah y Schnurbusch (2013), Funct. Plant Biol., DOI 10.1071/FP13248; Pourkheirandish y Komatsuda (2007), Ann. Bot., DOI 10.1093/aob/mcm139; Fincher (1989), Annu. Rev. Plant Physiol., DOI 10.1146/annurev.pp.40.060189.001513; Gubler, Millar y
Jacobsen (2005), Curr. Opin. Plant Biol., DOI 10.1016/j.pbi.2005.01.011; Benech-Arnold (2024), DOI 10.1201/9781003578536-17; UBA (2026), Cultivos de grano (encañazón).

## Glosario: estimación del rendimiento por conteo en campo y plagas no visibles por satélite

Términos ligados a dos hechos locales del proyecto: la estimación del rendimiento por conteo (follaje o espigas por densidad por m², extrapolado a la parcela) y la propagación de plagas que el satélite no percibe.

- **componentes del rendimiento (yield components)**: partes numéricas que forman el rendimiento: espigas/m², granos por espiga y peso de grano.
- **peso de mil granos, PMG (thousand-kernel weight, TKW)**: masa en gramos de 1 000 granos; se usa para convertir número de granos a kg/ha.
- **verdad de terreno (ground truth)**: medición directa en campo que sirve para calibrar o validar una estimación de teledetección.
- **coeficiente de variación, CV (coefficient of variation)**: desviación estándar dividida entre la media, en porcentaje.
- **infección asintomática (asymptomatic infection)**: planta infectada que no muestra síntomas visibles en la inspección de campo.
- **objetivo subpíxel (subpixel target)**: objeto o foco más pequeño que el tamaño de píxel del sensor, cuya señal se mezcla con el resto del píxel.
- **imagen hiperespectral (hyperspectral imaging)**: captura de reflectancia en decenas o cientos de bandas estrechas por píxel.
- **fluorescencia inducida por la luz solar, SIF (solar-induced fluorescence)**: emisión de luz de la clorofila en el rango rojo y del infrarrojo cercano, usada como rasgo funcional de la planta.
- **transmisión circulativa (circulative transmission)**: forma de transmisión en la que el virus pasa del insecto vector a la hemolinfa y luego a las glándulas salivales.
- **qPCR (PCR cuantitativa)**: prueba molecular que cuantifica el ADN del patógeno en una muestra de tejido.

Fuente: 17_medicion_del_rendimiento_y_estadistica_agricola.md y 06_plagas_enfermedades_y_deteccion_de_danos.md (ronda 5); Zarco-Tejada et al. (2018), Nature Plants 4:432–439, DOI 10.1038/s41477-018-0189-7; Gómez Mercado et al. (2009), Agricultura Técnica en México 35(1):13–23.

## Glosario: clima, oscilación térmica, ENSO y SPI (vocabulario ampliado), heladas, granizo, canícula, ENSO y SPI)

Contexto: el ciclo de temporal de la cebada en Hidalgo, Puebla y Tlaxcala (abril–octubre de 2025) está expuesto a heladas, granizo y sequías dentro de la temporada de lluvias. Las definiciones son conceptuales; las cifras de daño no se incluyen aquí.

- **Oscilación térmica diaria (diurnal temperature range; DTR)**: diferencia entre la temperatura máxima y la mínima de un mismo día, en °C. Easterling et al. (1997) analizan las tendencias de máximas y mínimas.
- **Amplitud térmica media mensual**: promedio mensual de esa diferencia. Es lo que se obtiene de los promedios de CHIRTS-ERA5 del reto, no la oscilación diaria extrema (inferencia metodológica).
- **Helada radiativa (radiation frost)**: helada de noches despejadas y calmas, por pérdida de calor de la superficie por radiación de onda larga. Definición general; véase Snyder y de Melo-Abreu (2005).
- **Helada advectiva (advection frost)**: helada causada por la llegada de aire frío desde otra región, con viento; puede dañar aun con cielo nublado. Definición general (Snyder y de Melo-Abreu, 2005).
- **Granizo (hail)**: precipitación de hielo en forma de partículas que daña hojas y espigas por impacto. El daño depende de la fase fenológica. Definición general.
- **Canícula (midsummer drought)**: disminución de lluvias a mitad de la temporada, caracterizada en México y Centroamérica (Magaña, Amador y Medina, 1999, título verificado).
- **Sequía intraestival**: sinónimo de canícula en el SMN (verificado: SMN-CONAGUA, comunicado 0533-23).
- **ENSO (El Niño–Oscilación del Sur)**: acoplamiento entre océano y atmósfera en el Pacífico tropical. Su fase cálida es El Niño (Trenberth, 1997, título verificado).
- **El Niño**: fase cálida del ENSO, con anomalías positivas de temperatura superficial del mar en el Pacífico ecuatorial central y oriental (definición general; Trenberth, 1997, artículo titulado «The Definition of El Niño»).
- **Helada (frost)**: temperatura del aire igual o menor a 0 °C que daña tejidos vegetales (definición general; los rangos de daño dependen de la fase del cultivo).
- **La Niña**: fase fría del ENSO (Trenberth, 1997).
- **Índice estandarizado de precipitación (SPI; Standardized Precipitation Index)**: precipitación acumulada en una escala de tiempo, transformada a distribución normal estándar; valores negativos indican sequía (Hayes et al., 1999, título verificado).
- **SPEI (Standardized Precipitation Evapotranspiration Index)**: variante del SPI que resta la evapotranspiración potencial, sensible al calentamiento (Vicente-Serrano et al., 2010).
- **Evapotranspiración potencial (ET0)**: pérdida de agua de una superficie vegetal bien abastecida de agua. Definición general.
- **Sequía meteorológica**: déficit prolongado de precipitación. **Sequía agrícola**: déficit de humedad disponible para el cultivo. Definiciones generales.

Fuente: Easterling et al. (1997), Science, DOI 10.1126/science.277.5324.364; Snyder y de Melo-Abreu (2005), Frost protection: fundamentals, practice and economics, vol. 1, FAO, Roma (reseña en Experimental Agriculture, DOI 10.1017/S0014479706273794); Magaña, Amador y Medina (1999), J. Climate, DOI
10.1175/1520-0442(1999)012<1577:TMDOMA>2.0.CO;2; Trenberth (1997), BAMS, DOI 10.1175/1520-0477(1997)078<2771:TDOENO>2.0.CO;2; Hayes et al. (1999), BAMS, DOI 10.1175/1520-0477(1999)080<0429:MTDUTS>2.0.CO;2; Vicente-Serrano, Beguería y López-Moreno (2010), J. Climate, DOI 10.1175/2009JCLI2909.1; SMN-CONAGUA, comunicado
0533-23.


## Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** "Un índice de vegetación alto indica rendimiento alto en t/ha." → **Corrección:** El NDVI y otros índices son predictores potenciales, no mediciones de toneladas por hectárea. Dos parcelas con verdor semejante pueden diferir en llenado de grano, manejo o daños.
- **Afirmación errónea:** "El R² de 0.79 de García-Martínez en Acambay valida la estimación de cebada." → **Corrección:** Ese R² es de maíz bajo sequía, de ajuste y no de validación externa. La propia fuente señala sobreestimación en valores altos del índice.
- **Afirmación errónea:** "Piso siempre significa suelo." → **Corrección:** En el corpus, "piso" aparece como piso de desempeño. La acepción altitudinal se expresa como elevación o piso térmico, y el piso de arado y el piso como terreno no están documentados.
- **Afirmación errónea:** "La amplitud térmica se calcula con la temperatura máxima y mínima diarias." → **Corrección:** Las capas del reto son promedios mensuales de CHIRTS-ERA5, por lo que la amplitud derivada es una amplitud media mensual.
- **Afirmación errónea:** "Temporal significa temporada de lluvias." → **Corrección:** Temporal es la modalidad hídrica sin riego. La temporada de lluvias es un periodo del año; el dataset distingue "Temporal" y "Riego" como modalidades.
- **Afirmación errónea:** "Una helada que daña la hoja reduce el rendimiento." → **Corrección:** En los contextos estudiados, las plantas se recuperaron y el mayor daño observado no implicó menor rendimiento. El daño transitorio y la pérdida final de grano no son equivalentes.
- **Afirmación errónea:** "Un R² alto en validación cruzada garantiza buen desempeño en parcelas nuevas." → **Corrección:** La validación cruzada en un mismo conjunto puede inflar ganancias, y el desempeño cae al cambiar de campaña o región (Franch y colaboradores reportan R² cercano a 0.45 entre regiones).
- **Afirmación errónea:** "El orden de las filas del archivo es una variable válida." → **Corrección:** El orden de almacenamiento se asocia con la etiqueta por causas de recolección. Usarlo es fuga de información.
- **Afirmación errónea:** "Una diferencia de 0.01 t/ha entre dos modelos demuestra que uno es mejor." → **Corrección:** Diferencias de esa magnitud pueden quedar dentro del ruido de la validación cruzada. Hay que comparar con una línea base fuerte y con intervalos.
- **Afirmación errónea:** "Milpa es un cultivo de cebada en el Altiplano." → **Corrección:** La milpa es un policultivo de maíz, frijol y calabaza. En el corpus solo aparece en el topónimo Nanacamilpa.
- **Afirmación errónea:** "El artículo de Chapingo de 2025 fija la temperatura base de grados-día para cebada." → **Corrección:** El artículo de Chapingo (2026) trata sobre maíz. Para cebada de invierno, la base 0 °C aparece en un estudio de Serbia, y una tabla de Minnesota usa 4.4 °C; las bases no son intercambiables.
- **Afirmación errónea:** "Doña Josefa, la cebada de Hidalgo, es de seis hileras según la literatura." → **Corrección:** El dato de seis hileras viene de la verificación local del proyecto; las fuentes externas consultadas no lo confirman.

Fuente: agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md; literatura_aplicacion/literature_review__report__sections__08b_lecturas.typ.txt; reto_y_datos/Descripcion_general_variables_DataSet.txt;
literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt; literatura_aplicacion/literature_review__report__chapters__03_representaciones.typ.txt; validacion/iterate_20261017__research__critique_leakage.md; experimentos_tabulares/iterate_20261017__research__A3_headroom.md;
literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt

- **Afirmación errónea:** AGROASEMEX tiene un seguro paramétrico satelital de cebada basado en NDVI. → **Corrección:** el diseño documentado en Terra Latinoamericana 36(2) (2018) es para ganadería y pastizales, con índice 1/NDVIcp; no hay evidencia de un seguro de cebada.
- **Afirmación errónea:** FIRA publica pronósticos de rendimiento con satélite para su crédito. → **Corrección:** las páginas oficiales consultadas listan informes de gestión, garantías y cotizador de coberturas; no describen pronósticos de rendimiento (SIN EVIDENCIA).
- **Afirmación errónea:** el índice de siniestralidad es la razón de indemnizaciones a primas. → **Corrección:** en el SIAP es la superficie siniestrada entre la superficie sembrada, multiplicada por cien (NTGEBAP 2022).
- **Afirmación errónea:** "FONAGA es uno de los fideicomisos de FIRA." → **Corrección:** FIRA se integra por cuatro fideicomisos (FONDO, FEFA, FEGA y FOPESCA); FONAGA (Fondo Nacional de Garantías) aparece como fondo de garantías pagadas, no entre los cuatro (FIRA, Programa Institucional 2025).
- **Afirmación errónea:** "El SPI incluye la evapotranspiración y por eso mide el calor." → **Corrección:** el SPI usa solo precipitación; el SPEI resta la evapotranspiración potencial y es la variante sensible al calentamiento (Vicente-Serrano et al., 2010).
- **Afirmación errónea:** "Sentinel-2 revisita cada 10 días." → **Corrección:** con su constelación de dos satélites, la revisita es de 5 días (Copernicus, misión Sentinel-2).
- **Afirmación errónea:** "La superficie cosechada puede ser mayor que la sembrada." → **Corrección:** la NTGEBAP 2022 del SIAP establece que no puede serlo.

## Preguntas y respuestas

**P:** ¿Qué significa NDVI y qué mide?
**R:** Es el Índice de Vegetación de Diferencia Normalizada, un indicador de presencia, vigor y actividad de vegetación verde. El diccionario del reto lo describe de forma conceptual y advierte que sus fórmulas dependen de la implementación del proveedor.

**P:** ¿En qué fase de la cebada de temporal se usa el término "espigamiento"?
**R:** Es la emergencia de la espiga fuera de la vaina. INIFAP reporta espigamiento o floración entre 46 y 72 días después de la siembra en el Altiplano.

**P:** ¿Cuánto dura el ciclo de la cebada de temporal en el Altiplano?
**R:** Según INIFAP, la madurez fisiológica ocurre entre 90 y 132 días después de la siembra, según ambiente y fecha de siembra.

**P:** ¿Qué es la canícula y por qué importa para el reto?
**R:** Es una reducción temporal de lluvias dentro de la temporada, con más calor, también llamada sequía intraestival. Hidalgo tuvo 58 % de su lluvia normal en agosto de 2025, pero el efecto cuantificado sobre la cebada no está documentado.

**P:** ¿Qué diferencia hay entre temporal y riego?
**R:** Temporal es la modalidad en que el cultivo depende de la lluvia o de la humedad residual; riego aplica agua artificialmente. Las capas del reto son mensuales y cubren Hidalgo, Puebla y Tlaxcala.

**P:** ¿Qué unidad usa el reto para el rendimiento?
**R:** Toneladas por hectárea (t/ha). Un valor de 737 kg/ha equivale a 0.737 t/ha.

**P:** ¿Qué es el RMSE y cómo se compara en el proyecto?
**R:** Es la raíz del error cuadrático medio, en las mismas unidades que el rendimiento. En validación cruzada, la referencia de media municipal tuvo 0.4929 t/ha y un modelo de referencia 0.4802 t/ha.

**P:** ¿Qué es la fuga de información?
**R:** Es el uso de información que no estaría disponible al predecir, como la etiqueta de la parcela o datos posteriores al corte. La auditoría del proyecto trata el orden de almacenamiento como fuga.

**P:** ¿Qué es la validación cruzada de cinco pliegues en el proyecto?
**R:** Es repartir las 138 parcelas con rendimiento conocido en cinco subconjuntos, entrenar con cuatro y evaluar con el restante, de modo que cada parcela se predice una vez fuera de su entrenamiento.

**P:** ¿Qué significa "piso" en el corpus?
**R:** Aparece sobre todo como piso de desempeño, un nivel mínimo de error. La acepción altitudinal se describe como piso térmico, con tierra templada y fría en el Altiplano. Las acepciones de piso de arado y de piso como terreno no están documentadas.

**P:** ¿Qué acepciones de amplitud aparecen en el proyecto?
**R:** Amplitud térmica, amplitud de la curva estacional de un índice, amplitud de intervalo de predicción y amplitud de rendimiento. Amplitud geográfica no está documentada.

**P:** ¿Qué es una etiqueta en rejilla de 0.5 t/ha?
**R:** Es un rendimiento registrado en múltiplos de 0.5 t/ha, presente en parte de las parcelas de Calpulalpan, Apan y Emiliano Zapata. Introduce un error de redondeo de variancia 0.0208.

**P:** ¿Qué es la milpa?
**R:** Es un policultivo tradicional de maíz, frijol y calabaza, no un cultivo de cebada. En el corpus solo aparece en el topónimo Nanacamilpa.

**P:** ¿Qué significa FEGA?
**R:** Fondo Especial de Asistencia Técnica y Garantía para Créditos Agropecuarios. Es uno de los cuatro fideicomisos de FIRA y otorga garantías de crédito y asistencia técnica (FIRA, Programa Institucional 2025).

**P:** ¿Qué es FONAGA?
**R:** Fondo Nacional de Garantías, según el glosario de siglas del Programa Institucional 2025 de FIRA. No es uno de los cuatro fideicomisos; su naturaleza jurídica y su relación con FEGA no están documentadas.

**P:** ¿Qué es la encañazón?
**R:** Es el alargamiento de los entrenudos del tallo de la cebada. El término aparece en una publicación en español de la UBA (2026); la equivalencia con los códigos de la escala de Zadoks no está verificada en español.

**P:** ¿Qué es el índice SPI?
**R:** Es el índice estandarizado de precipitación: la precipitación acumulada en una escala de tiempo, transformada a una distribución normal estándar, donde valores negativos indican sequía (Hayes et al., 1999).
