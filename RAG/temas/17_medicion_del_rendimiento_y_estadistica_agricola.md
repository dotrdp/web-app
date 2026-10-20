---
id: rag-17-medicion-rendimiento
titulo: Medición del rendimiento en campo y estadística agrícola: métodos, errores y límites para las etiquetas del reto
categoria: estadistica
etiquetas: [rendimiento, cosecha de muestra, crop cut, autorreporte, humedad del grano, redondeo, heaping, siap, inegi, error de medición]
idioma: es
fecha: 2026-10-18
fuentes_internas: [01_reto_agrocebada_y_datos.md, 10_validacion_fugas_y_muestras_pequenas.md]
fuentes_externas: [Fermont, A. y Benson, T. (2011). Estimating yield of food crops grown by smallholder farmers: A review in the Uganda context. IFPRI Discussion Paper 01097. https://hdl.handle.net/10568/154345; Carletto, C., Jolliffe, D. y Banerjee, R. (2015). From tragedy to renaissance: improving agricultural data
for better policies. World Bank Policy Research Working Paper 7150, DOI 10.1596/1813-9450-7150 (publicado también en Journal of Development Studies, 51(2), 133-148, según RePEc); Carletto, C., Gourlay, S., Murray, S. y Zezza, A. (2017). Cheaper, faster, and more than good enough: is GPS the new gold standard in land
area measurement? Survey Research Methods, 11(3), 235-265, DOI 10.18148/srm/2017.v11i3.6791; Desiere, S. y Jolliffe, D. (2018). Land productivity and plot size: Is measurement error driving the inverse relationship? Journal of Development Economics, 130, 84-98 (documento de trabajo del Banco Mundial, DOI
10.1596/28786); Gourlay, S., Kilic, T. y Lobell, D. B. (2019). A new spin on an old debate: Errors in farmer-reported production and their implications for inverse scale-productivity relationship in Uganda. Journal of Development Economics, 141, 102376, DOI 10.1016/j.jdeveco.2019.102376; Lobell, D. B., Azzari, G.,
Burke, M., Gourlay, S. et al. (2020). Eyes in the sky, boots on the ground: Assessing satellite- and ground-based approaches to crop yield measurement and analysis. American Journal of Agricultural Economics, 102(1), 202-219, DOI 10.1093/ajae/aaz051 (publicado en línea en 2019); Abay, K. A., Tadesse, G., Barrett, C. B.
y Bernard, T. (2019). Journal of Development Economics, 139, 171-184; Burke, M. y Lobell, D. B. (2017). Satellite-based assessment of yield variation and its determinants in smallholder African systems. PNAS, 114(9), DOI 10.1073/pnas.1616919114; Allen, Griffith, Shiffman y Heitjan, «Proximity and gravity: modeling
heaped self-reports» (título verificado en búsqueda; contenido no leído); Yacoubou Djima, I. y Kilic, T. (2021). Survey measurement errors and the assessment of the relationship between yields and inputs in smallholder farming systems. Banco Mundial, documento de trabajo (versión posterior en Journal of Development
Economics, 2024, según búsqueda; volumen y páginas no verificados); SIAP (2022). Normatividad Técnica para la Generación de Estadística Básica Agropecuaria. https://www.gob.mx/cms/uploads/attachment/file/789519/NTGEBAP_2022.pdf; SIAP (2017). Cierre de la producción agropecuaria 2017.
https://www.gob.mx/cms/uploads/attachment/file/330747/Cierre_de_la_producci_n_Agropecuaria_2017.pdf; INEGI. Censo Agropecuario 2022, boletines estatales (p. ej. Puebla). https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2023/CA_Def/CA_Def2022_Pue.pdf; World Bank Data Blog (LSMS-ISA). Agricultural survey
design: lessons from LSMS-ISA and beyond. https://blogs.worldbank.org/en/opendata/agricultural-survey-design-lessons-lsms-isa-and-beyond; Norma V, Res. 27/2013 (Argentina), anexos A y B. https://cac.bcr.com.ar/sites/default/files/2019-01/norma_v_-_res_27-2013_-_anexo_a_-_cebada_cervecera.pdf; Agroseguro, NPE 005 00 2.0
(cereales de invierno). https://pecuario.agroseguro.es/wp-content/uploads/2022/10/Cereales-de-invierno-NPE-005-00-2.0.pdf]
---

Resumen

El rendimiento de una parcela de cebada no se observa directamente: se obtiene con un método de medición (cosecha de muestra, cosecha completa, pesaje comercial, monitor en cosechadora o autorreporte del productor) y se divide entre una superficie que también se mide con error. La literatura sobre encuestas agrícolas
muestra que el autorreporte tiene errores no clásicos, correlacionados con el tamaño de la parcela, y que las cifras oficiales por municipio son estadísticas de cierre y no mediciones parcelarias. Las etiquetas de rendimiento del reto, además, no documentan su método, su base de humedad ni su redondeo, y 45 de 138 caen
exactamente sobre una rejilla de 0.5 t/ha. Por eso el error de medición forma parte del error mínimo alcanzable y debe tratarse como un componente separado del error del modelo.

## Qué significa «rendimiento» en las estadísticas oficiales

En la Normatividad Técnica para la Generación de Estadística Básica Agropecuaria del SIAP (edición 2022), el rendimiento es la producción dividida entre la superficie cosechada, normalmente expresada en toneladas por hectárea. La superficie sembrada es el área donde se depositó la semilla, la cosechada es el área donde
se obtuvo producto, y la siniestrada es el área sembrada con pérdida total o parcial. La norma admite que la superficie cosechada puede medirse en campo, en laboratorio o por entrevista. Para el reto, esto significa que el denominador del rendimiento puede no ser el área de la parcela: si una parte sembrada no se
cosechó, el mismo grano produce un rendimiento mayor. Antes de comparar etiquetas conviene saber si el denominador es sembrado, cosechado o estimado.

Fuente: SIAP, Normatividad Técnica para la Generación de Estadística Básica Agropecuaria, edición 2022, https://www.gob.mx/cms/uploads/attachment/file/789519/NTGEBAP_2022.pdf (leída en la ronda 3 del corpus).

## Cosecha de muestra (crop cut): método y límites

La cosecha de muestra, o crop cut, consiste en seleccionar al azar una subparcela dentro de la parcela, cosechar todo el cultivo en ella, secar, trillar y pesar el grano, y extrapolar a la superficie de la subparcela. Es el método que la literatura usa como referencia intermedia porque evita depender de la memoria del
productor. Sus errores vienen del tamaño y la forma de la subparcela, de las pérdidas al cosechar y de la posición de la muestra dentro de la parcela. En el Banco Mundial, los paneles LSMS-ISA de Etiopía y Malí usan cosecha de subparcela para cultivos seleccionados; en Uganda, Lobell et al. (2020) compararon cosecha de
subparcela con cosecha de parcela completa en cientos de parcelas de maíz. Para cebada de temporal en el Altiplano, no se encontró en esta ronda un protocolo oficial de subparcela con dimensiones publicadas (no documentado).

Fuente: Lobell, D. B. et al. (2020). Eyes in the sky, boots on the ground. American Journal of Agricultural Economics, 102(1), 202-219, DOI 10.1093/ajae/aaz051; World Bank Data Blog, https://blogs.worldbank.org/en/opendata/agricultural-survey-design-lessons-lsms-isa-and-beyond.

## Cosecha completa de la parcela: referencia con costo alto

La cosecha completa de la parcela es el método más cercano al rendimiento real, porque no extrapola desde una muestra, pero exige cosechadora o trabajo manual en toda la superficie y, en parcelas comerciales, pérdida de control sobre el grano. En el estudio de Lobell et al. (2020) sobre maíz en Uganda oriental, la
brecha promedio entre cosecha de subparcela y cosecha de parcela completa no fue estadísticamente significativa, pero la cosecha de subparcela solo capturó alrededor de un cuarto de la variabilidad del rendimiento de parcela completa. Esto implica que la muestra puede tener el promedio correcto y aun así ser muy
ruidosa a nivel de parcela individual. Para cebada no hay en el corpus una comparación equivalente publicada (gap de investigación).

Fuente: Lobell, D. B. et al. (2020), American Journal of Agricultural Economics, 102(1), 202-219, DOI 10.1093/ajae/aaz051 (cifras tomadas del resumen y de la síntesis del artículo; texto completo no leído).

## Autorreporte del productor: error no clásico

El autorreporte es el método más barato y el más usado en encuestas de pequeños productores. En Uganda, Gourlay, Kilic y Lobell (2019) mostraron que la relación inversa entre tamaño de parcela y productividad aparece con producción autorreportada y se debilita con cortes de cosecha; atribuyen el patrón a una
sobreestimación persistente de la producción autorreportada, sobre todo en la mitad inferior de la distribución de áreas. En Etiopía, Desiere y Jolliffe (2018) documentaron sobrerreporte en parcelas pequeñas y subreporte en las grandes, y que la relación inversa desaparece al usar cortes. Lobell et al. (2020) reportan
que el rendimiento autorreportado explica menos de 1 % de la variabilidad del rendimiento de parcela completa. El error no es aleatorio: depende del tamaño de la parcela, lo que sesga cualquier relación entre rendimiento y superficie.

Fuente: Gourlay, Kilic y Lobell (2019), Journal of Development Economics, 141, 102376, DOI 10.1016/j.jdeveco.2019.102376; Desiere y Jolliffe (2018), Journal of Development Economics, 130, 84-98; Lobell et al. (2020), AJAE, DOI 10.1093/ajae/aaz051.

## Error no clásico en área y producción a la vez

Abay, Tadesse, Barrett y Bernard (2019) sostienen que, cuando los errores no clásicos de área y de producción están correlacionados, corregir solo una de las dos variables puede aumentar el sesgo del rendimiento. El resultado se deriva de que el rendimiento es un cociente: si el numerador y el denominador comparten el
mismo error de reporte, corregir uno sin el otro cambia la dirección del sesgo en vez de eliminarlo. En la práctica, el sesgo del rendimiento parcelario no puede tratarse como ruido independiente de la superficie usada en el cálculo. Para el reto, si el rendimiento de una parcela se obtuvo dividiendo una producción
autorreportada entre un área también autorreportada, el error de ambos puede estar acoplado y no se cancela.

Fuente: Abay, K. A., Tadesse, G., Barrett, C. B. y Bernard, T. (2019), Journal of Development Economics, 139, 171-184 (resumen del corpus, verificado en diapositivas de los autores según la ronda 4; referencia completa de volumen y páginas no verificada en Crossref).

## Área de la parcela: el error se propaga al rendimiento

Como el rendimiento es producción entre área, un error de área se traslada directamente a la etiqueta. Carletto, Gourlay, Murray y Zezza (2017) comparan métodos de medición de superficie en encuestas de hogares de Etiopía, Nigeria y Tanzania (Zanzibar): trazado con cinta o caminata (preciso pero costoso), autorreporte
del productor (barato y sesgado) y GPS manual. Su conclusión principal es que el GPS es preferible, idealmente junto con el área autorreportada, porque permite detectar errores groseros. Para el reto no se conoce el método de medición del área por parcela. Si el área viene de cartografía o de un polígono de satélite,
es razonable esperar un error menor que el del autorreporte, aunque no hay en el corpus una cifra para cebada (razonamiento propio, no verificado).

Fuente: Carletto, C., Gourlay, S., Murray, S. y Zezza, A. (2017). Cheaper, faster, and more than good enough: is GPS the new gold standard in land area measurement? Survey Research Methods, 11(3), 235-265, DOI 10.18148/srm/2017.v11i3.6791 (DOI tomado del resultado de búsqueda; no verificado en Crossref).

## Pesaje en báscula y venta del grano

En cebada comercial, el pesaje en báscula del grano entregado es una medición física del producto, pero mide la producción vendida, no la cosechada: depende de la humedad al momento de la venta, de impurezas y mermas, de la fecha de entrega y de si la parcela se entregó completa. Si el productor vende en varias
entregas o mezcla lotes de dos parcelas, el peso no corresponde a una sola parcela. No hay en el corpus un estudio que cuantifique el error del pesaje comercial de cebada en México (gap; no documentado). Como hipótesis de trabajo, el pesaje comercial reduce el error de autorreporte, pero introduce error de asignación a
la parcela y de base de humedad, que deben declararse en el metadato de cada etiqueta.

Fuente: Razonamiento a partir de Lobell et al. (2020) y Gourlay et al. (2019) (hipótesis, no verificada con datos de cebada); ausencia de estudio en el corpus documentada en el registro de verificación de esta ronda.

## Monitores de rendimiento en cosechadora

Los monitores de rendimiento estiman la masa de grano que pasa por la cosechadora con sensores de flujo o de impacto y la combinan con la velocidad y el ancho de corte. Un estudio de laboratorio citado en la búsqueda reporta exactitud dentro del ±4 % que promete el fabricante, con errores máximos mayores de 5 %, y que
la calibración en un rango amplio de flujos es lo que más importa; un estudio de campo en Chequia, con un lote de 16 ha, encontró error menor de 4 % con flujos de 4.2 a 16.9 kg/s y de 7.3 % con flujos mayores. Un estudio en el ASAE (Hemming y Chaplin, 2004) concluyó que, con flujo no controlado, la precisión del
sensado tenía margen importante de mejora. Para el reto, un monitor produce rendimiento de cada franja de cosecha y no de la parcela completa, por lo que la etiqueta depende de cómo se agregaron las franjas.

Fuente: Acta Technologica Agriculturae (2015), artículo ata-2015-0003 (referencia parcial; volumen y páginas no verificados); Hemming, J. y Chaplin, J. (2004), ASAE, Universidad de Minnesota (referencia parcial; no verificada en su texto completo); referencias de laboratorio del corpus (no verificadas en su revista).

## Estimación visual y aforo

La estimación visual del rendimiento, que consiste en juzgar la producción a simple vista o por conteo de espigas y de metros lineales, es común en recorridos de supervisión y en peritajes rápidos. No se encontró en esta ronda una medición publicada de su sesgo para cebada en el Altiplano (no documentado). Lo que sí se
sabe por analogía es que cualquier estimación no basada en cosecha tiene un componente de error no medido, y que cuando un mismo conjunto de etiquetas mezcla métodos (cosecha, autorreporte, visual), la varianza del error aumenta y el sesgo puede depender del método. Si el reto no documenta el método por parcela, no es
posible separar esos componentes.

Fuente: Sin fuente verificada específica en esta ronda; ausencia de estudio documentada en el registro de verificación. Ver también Lobell et al. (2020) para el contraste entre métodos terrestres.

## Satélite frente a mediciones de campo

Burke y Lobell (2017) compararon rendimientos de maíz en pequeños productores de Kenia medidos con imágenes satelitales de 1 m y con encuestas de campo intensivas. Según su resumen, la concordancia entre ambos métodos fue mayor, con coeficiente de determinación de hasta 0.4, cuando el área de la parcela se midió con
precisión y cuando las parcelas eran grandes, porque en ellas el error de redondeo es menor. Lobell et al. (2020) encontraron que las mediciones satelitales explican tanto o más variación del rendimiento de parcela completa que el autorreporte o la subparcela. Para el reto, un predictor satelital no sirve como
verificación de la etiqueta si la etiqueta tiene su propio error de método; la concordancia observada siempre está limitada por el peor de los dos métodos.

Fuente: Burke, M. y Lobell, D. B. (2017), PNAS, 114(9), DOI 10.1073/pnas.1616919114 (resumen); Lobell et al. (2020), AJAE, DOI 10.1093/ajae/aaz051.

## Corrección por humedad del grano: fórmula

El grano cosechado contiene agua, y el peso depende de la humedad. Para pasar un rendimiento medido con humedad H_medida a una base comercial H_base se usa Y_base = Y_medido × (100 − H_medida) / (100 − H_base). Ejemplo de cálculo propio: un rendimiento de 3.00 t/ha medido con 14 % de humedad equivale a 3.00 × 86 / 88 =
2.932 t/ha con base de 12 %. La corrección es pequeña en magnitud (unos 0.07 t/ha en este caso), pero es sistemática: si una parte de las etiquetas está a una base y otra a otra, se introduce un sesgo de 2 a 3 % que se confunde con diferencias entre parcelas. El reto no documenta la humedad a la que se pesó el grano ni
la base de cada etiqueta.

Fuente: Cálculo propio a partir de la identidad de peso seco; la base de 12 % es la usada en la norma argentina citada en el fragmento siguiente.

## Base comercial de la cebada: ejemplo argentino

La norma argentina Norma V (Resolución 27/2013, Anexo A, cebada cervecera) fija una humedad máxima de 12 % como base de comercialización; en la tolerancia de recibo la humedad admitida sube a 12.5 %, y las humedades menores de 12 % se bonifican en el precio. Para cebada forrajera (Anexo B), el peso hectolítrico, es
decir la masa de 100 litros de grano tal cual en kilogramos por hectolitro, aparece como criterio de grado, con mínimos de 62, 59 y 56 kg/hl, y la humedad se determina con la norma ISO 712. Estas cifras son de Argentina. No se encontró en esta ronda una norma mexicana (NMX) de cebada con su límite de humedad ni su peso
hectolítrico (no documentado); conviene consultarla en el catálogo de la Secretaría de Economía antes de usar la base argentina como referencia para Hidalgo, Puebla o Tlaxcala.

Fuente: Norma V, Res. 27/2013, Anexo A (cebada cervecera), https://cac.bcr.com.ar/sites/default/files/2019-01/norma_v_-_res_27-2013_-_anexo_a_-_cebada_cervecera.pdf; Anexo B (cebada forrajera), https://cac.bcr.com.ar/sites/default/files/2019-01/norma_v_-_res_27-2013_-_anexo_b_-_cebada_forrajera.pdf.

## Redondeo y amontonamiento (heaping) en datos reportados

Un valor redondeado a una rejilla de ancho h tiene un error de redondeo con varianza aproximada h²/12, si el valor verdadero se distribuye de forma suficientemente continua dentro de cada intervalo. Para h = 0.5 t/ha, la varianza es 0.0208 (t/ha)² y la desviación estándar es 0.144 t/ha. El amontonamiento o heaping es
un patrón más fuerte: los entrevistados prefieren cifras redondas (múltiplos de 5, de 10 o de 0.5), y la distribución se concentra en esos valores. Allen, Griffith, Shiffman y Heitjan proponen modelos para este fenómeno en autorreportes numéricos. El punto para el reto es que el redondeo no es ruido aleatorio: la misma
parcela puede caer en 3.0 o en 3.5 según cómo se redondeó el dato, y eso se confunde con diferencias reales.

Fuente: Cálculo propio para h²/12; Allen, Griffith, Shiffman y Heitjan, «Proximity and gravity: modeling heaped self-reports» (título verificado en búsqueda; contenido no leído en esta ronda).

## Las etiquetas del reto: 45 de 138 exactamente sobre la rejilla de 0.5

En el archivo oficial de etiquetas de entrenamiento, 45 de 138 valores (32.6 %) caen exactamente en múltiplos de 0.5 t/ha: 19 en 3.0, 13 en 3.5, 11 en 2.5 y 2 en otros valores de la rejilla. Los valores 4.49, 4.52, 4.55 y similares no son exactos y no deben contarse como 4.5 tras redondear a 0.1 t/ha; con esa regla la
cifra de 4.5 subiría artificialmente. Que casi un tercio de las etiquetas sea exacto en una rejilla de 0.5 indica que una parte de los datos fue redondeada o registrada en forma aproximada al nivel del productor o del técnico de campo. No es posible saber cuáles etiquetas tienen esa procedencia sin el metadato del
método.

Fuente: 01_reto_agrocebada_y_datos.md del corpus (cifras calculadas sobre el archivo oficial de etiquetas); 10_validacion_fugas_y_muestras_pequenas.md (sección de redondeo, que coincide en cifras).

## Estadísticas oficiales del SIAP: el cierre agrícola

El cierre agrícola del SIAP suma los ciclos otoño-invierno y primavera-verano, y añade los cultivos perennes especiales. Las variables que publica son superficie sembrada, cosechada y siniestrada, volumen de producción y rendimiento por hectárea cosechada. Un documento del SIAP de 2017 precisa que el ciclo
otoño-invierno empieza con siembras de octubre de 2016 y el primavera-verano termina con cosechas de marzo de 2018, es decir, el cierre cubre año agrícola y no año calendario. Las cifras son agregados municipales y estatales: el rendimiento municipal es producción total dividida entre superficie cosechada total del
municipio, no una medición de parcela.

Fuente: SIAP (2017), Cierre de la producción agropecuaria 2017, https://www.gob.mx/cms/uploads/attachment/file/330747/Cierre_de_la_producci_n_Agropecuaria_2017.pdf; SIAP (2022), Normatividad Técnica, ya citada.

## Avance de siembras y cosechas: procedimiento no localizado

El SIAP también publica avances mensuales de siembras y cosechas. Su procedimiento de captura, en el que informantes de las delegaciones o distritos de desarrollo rural reportan superficies y avances, y su procesamiento central no se encontraron en esta ronda en un documento técnico accesible (sin evidencia tras
búsqueda). Los documentos encontrados describen modelos análogos, por ejemplo en Argentina, donde las delegaciones captan la información básica por consultas personales con informantes calificados y un equipo central la procesa con relevamientos de campo. Por tanto, el rendimiento municipal de cierre depende de
estimaciones de informantes que no se conocen con precisión, y el reto no debe tratarlo como medición parcelaria.

Fuente: Búsqueda del SIAP sobre procedimiento de informantes (sin fuente oficial localizada); documento argentino de referencia comparada (búsqueda); la metodología completa debe consultarse en gob.mx/siap.

## Censo Agropecuario 2022 del INEGI

El Censo Agropecuario 2022 del INEGI tiene como periodo de referencia el año agrícola de octubre de 2021 a septiembre de 2022 y busca información sobre producción, tamaño y estructura de las unidades de producción agropecuaria. Según los boletines estatales, el censo registró producción y superficie sembrada y
cosechada de todos los cultivos a cielo abierto, y distingue superficie agrícola sembrada de la no sembrada, que puede estar en descanso o sin siembra por mal temporal o falta de crédito. Un ejemplo de Guanajuato: de 975 124 ha de superficie agrícola, 836 105 ha estaban sembradas. El censo es una fuente de estructura a
escala municipal y estatal; no sustituye la medición de parcela y, para cebada, las cifras deben cruzarse con las del SIAP por la diferencia de definiciones.

Fuente: INEGI, Censo Agropecuario 2022, boletines estatales (p. ej. Puebla), https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2023/CA_Def/CA_Def2022_Pue.pdf; resultados del Censo Agropecuario 2022, metodología completa (CA 2022 Metodología) no leída.

## Encuesta Nacional Agropecuaria del INEGI: lo no documentado

La búsqueda no devolvió la metodología de la Encuesta Nacional Agropecuaria (ENA) del INEGI para rendimiento o para superficie cosechada por cultivo, ni su diseño muestral (no documentado en esta ronda). Por eso no se puede afirmar en el RAG cómo la ENA mide el rendimiento de cebada, ni si usa cosecha de muestra,
autorreporte o estimación de informante. Si se necesita una cifra de ENA para cebada en Hidalgo, Puebla o Tlaxcala, debe obtenerse el documento técnico del INEGI y su diccionario de datos. Mientras tanto, el uso correcto de la ENA en este proyecto sería como referencia de magnitud, sin mezclarla con las etiquetas
parcelarias.

Fuente: Búsqueda sin resultados para la ENA en México (sin evidencia); referencia de la estructura de encuestas de otros países solo como contexto.

## Rendimiento parcelario frente a rendimiento municipal

El rendimiento municipal no es el promedio de los rendimientos parcelarios. Si el municipio tiene parcelas de 1 ha con 4 t/ha y de 3 ha con 2 t/ha, el promedio simple de los rendimientos es (4 + 2) / 2 = 3.0 t/ha, pero la producción total es 4 + 6 = 10 t sobre 4 ha, es decir, 2.5 t/ha ponderado por superficie. Esta
diferencia es de cálculo propio y muestra por qué no se deben comparar cifras parcelarias con cifras municipales de forma directa. Lo mismo ocurre cuando las etiquetas son una muestra de parcelas no representativa del municipio: su promedio no coincide con el del cierre. En el proyecto, la correlación negativa entre la
media municipal de SIAP y la etiqueta de parcela (Spearman −0.30, n = 8, cifra del corpus) es coherente con que el municipio no sirve como sustituto de la parcela.

Fuente: Cálculo propio; cifra de correlación del corpus (10_validacion_fugas_y_muestras_pequenas.md, sección de datos municipales del proyecto, no verificada en línea); Burke y Lobell (2017), PNAS, DOI 10.1073/pnas.1616919114, para la escala de la comparación satélite frente a campo.

## Seguros agrícolas y peritajes de siniestro

Los seguros agrícolas usan el peritaje para estimar el daño cuando el rendimiento cae por un siniestro. En el caso de Agroseguro (España), la norma para cereales de invierno, que incluye la cebada, establece dos fases: una inspección inmediata y una valoración definitiva, y determina el rendimiento esperado y el real
final por muestreo según las características de la parcela. Esto implica que una cifra de producción real reportada en un peritaje no es una cosecha completa de la parcela, sino una estimación muestral. En México, la metodología de AGROASEMEX para la cebada no se localizó en esta ronda (no documentado). Si un
rendimiento del reto proviene de un expediente de siniestro, su etiqueta mezcla pérdida por daño y rendimiento potencial; no debe tratarse como rendimiento de manejo sin ese metadato.

Fuente: Agroseguro, Norma específica de cereales de invierno, NPE 005 00 2.0, https://pecuario.agroseguro.es/wp-content/uploads/2022/10/Cereales-de-invierno-NPE-005-00-2.0.pdf (referencia comparada; el texto se leyó solo en el resumen de búsqueda).

## Estimación del daño por muestreo y escala fenológica

Al estimar el daño de un siniestro por muestreo, el perito marca subparcelas, cuenta o pesa la producción y compara con un rendimiento esperado. Algunas normas ponderan el daño por especie y registran el estado del cultivo con la escala fenológica BBCH en el momento de la pérdida. Una norma de la provincia de Mendoza
(Argentina) describe este enfoque, con pesos de daño por especie y estados BBCH. Para el reto, la consecuencia práctica es que un rendimiento peritado puede depender de la fecha del siniestro y del estado del cultivo, y que el rendimiento esperado no es una cifra observada. Si las etiquetas incluyen parcelas peritadas,
la señal de daño puede separarse del rendimiento de manejo solo con el expediente del siniestro (no documentado en el corpus).

Fuente: Provincia de Mendoza, normas de peritaje de daño por especie y escala BBCH (solo resumen de búsqueda; texto no leído); marco general de muestreo por parcela según la norma de Agroseguro citada en el fragmento anterior.

## Cosecha de muestra en el Altiplano: qué no está documentado

Para cebada de temporal en Hidalgo, Puebla y Tlaxcala no se localizó en esta ronda un protocolo público de cosecha de muestra con tamaño de subparcela, número de cortes por parcela y humedad a la cosecha. Tampoco se encontró una comparación de cosecha de subparcela con cosecha completa para cebada en México. El vacío
es relevante porque los estudios de Uganda y Malí muestran que el autorreporte tiene sesgos que dependen del tamaño de la parcela, y el Altiplano tiene parcelas de tamaños heterogéneos. Recomendación: si el reto necesita una referencia de error, la forma más directa es comparar etiquetas con cortes de muestra de un
subconjunto de parcelas, pero esos datos no están en el corpus.

Fuente: Búsquedas en esta ronda sin resultados específicos (sin evidencia); el contexto de Uganda y Malí se toma de Lobell et al. (2020) y de Yacoubou Djima y Kilic (2021).

## Autorreporte en Malí: error no clásico y corrección por imputación

Yacoubou Djima y Kilic, con datos de una encuesta nacionalmente representativa de Malí y un experimento de encuesta, encuentran que el rendimiento autorreportado de sorgo tiene error no clásico frente a cortes de cosecha, y que ese error sesga las estimaciones de retorno a la tierra, la mano de obra, los fertilizantes
y las semillas. Proponen una imputación dentro de la encuesta: un modelo de aprendizaje automático entrenado con una submuestra de parcelas con corte y autorreporte predice el rendimiento objetivo del resto. Los autores reportan que las predicciones atenúan el error de medición y dan una estimación menos sesgada del
retorno a los insumos. Para el reto, la idea es útil como diagnóstico, pero el reto no tiene una submuestra con corte de referencia, así que la corrección no es aplicable directamente.

Fuente: Yacoubou Djima, I. y Kilic, T. (2021), Banco Mundial, documento de trabajo; versión en Journal of Development Economics (2024), según búsqueda; volumen y páginas no verificados.

## Error de medición y error mínimo alcanzable

Si las etiquetas contienen un error de medición independiente del predictor y de media cero, con desviación estándar σ_e, ningún modelo puede bajar el RMSE frente a las etiquetas observadas por debajo de σ_e. Esto no es una opinión, sino una propiedad de la esperanza: el error cuadrático medio frente a la etiqueta
observada es igual al error frente al valor verdadero más la varianza del error de medición. Si el único error de la etiqueta fuera el redondeo a 0.5 t/ha, σ_e sería 0.144 t/ha y el RMSE mínimo sería aproximadamente 0.144 t/ha. Con error de autorreporte, de método o de base de humedad, el piso sube. Por eso una mejora
de unas centésimas de t/ha puede ser indistinguible del ruido de las etiquetas.

Fuente: Cálculo propio sobre la propiedad de la esperanza del error cuadrático medio; valor 0.144 t/ha a partir de h²/12 (ver fragmento de redondeo). Para el piso con error de autorreporte, ver Gourlay et al. (2019) y Lobell et al. (2020).

## Diagnóstico de error de medición en las etiquetas

Un diagnóstico útil es regresar los residuos del modelo sobre el área de la parcela. Si los residuos se correlacionan con el área, la etiqueta tiene un sesgo ligado al tamaño, como en el patrón de Gourlay et al. (2019) y de Desiere y Jolliffe (2018). Un segundo diagnóstico es revisar si las etiquetas se concentran en
valores redondos, y comparar la densidad de etiquetas exactas en la rejilla con la de valores cercanos. Un tercero es mirar la relación entre área y rendimiento: una pendiente negativa fuerte puede ser artefacto de reporte, no un efecto agronómico. Ninguno de estos diagnósticos prueba la causa, pero indican dónde el
error de medición se comporta como sesgo.

Fuente: Procedimiento propuesto a partir de Gourlay et al. (2019), Desiere y Jolliffe (2018) y Abay et al. (2019); el diagnóstico no ha sido aplicado al reto en esta ronda.

## Qué implica todo esto para interpretar las etiquetas del reto

Las etiquetas del reto son el rendimiento oficial disponible por parcela, pero el corpus no documenta cómo se obtuvieron: no hay método, ni base de humedad, ni superficie cosechada, ni protocolo de pesaje o de monitor, ni repeticiones de medición. Por lo tanto, no se puede suponer un error de medición conocido ni un
techo predecible. Lo que sí se puede afirmar con cifras es que casi un tercio de las etiquetas es exacto en una rejilla de 0.5 t/ha, que la literatura documenta sesgos no clásicos en autorreportes y que los métodos de medición cambian la varianza del error. Estas tres cosas bastan para tratar el error de etiqueta como
un componente que limita la métrica y para no interpretar diferencias pequeñas de RMSE como mejoras reales.

Fuente: 01_reto_agrocebada_y_datos.md del corpus (descripción de las bases oficiales); Lobell et al. (2020); Gourlay et al. (2019); cálculo propio de redondeo.

## Cómo reportar el método de medición en cada etiqueta

Para que una etiqueta de rendimiento sea interpretable en un análisis de error, debe documentarse: método (cosecha de muestra, cosecha completa, pesaje comercial, monitor, autorreporte, estimación visual o peritaje); superficie usada en el denominador y su método de medición; base de humedad y humedad a la que se pesó;
unidad y número de decimales con que se registró; fecha de cosecha; y si la etiqueta es de una parcela completa o de una subparcela. La recomendación se basa en la literatura de encuestas (Carletto et al., 2017; Lobell et al., 2020) y en la norma oficial del SIAP sobre la definición de rendimiento. Esta documentación
no existe en el reto, así que el análisis debe declarar su ausencia y no suponer un valor por defecto.

Fuente: Recomendación a partir de Carletto et al. (2017), Lobell et al. (2020) y SIAP (2022), Normatividad Técnica, ya citadas.

## Error mínimo alcanzable: límites con la información disponible

El error mínimo alcanzable en el reto depende de tres componentes: el error del modelo (que puede reducirse con más información), el error de redondeo y de método de las etiquetas (que no puede reducirse con el modelo) y el error de sesgo por tamaño de parcela, si existe (que solo se reduce con un diagnóstico). Con el
error de redondeo solo, el piso teórico no es 0.144 t/ha sino menor: solo 45 de 138 etiquetas (32.6 %) están en la rejilla de 0.5, de modo que la varianza promedio de redondeo es ≈ 0.326 × 0.0208 = 0.0068 (t/ha)² y su desviación estándar ≈ 0.082 t/ha (cálculo propio, suponiendo que las demás etiquetas no tienen
redondeo apreciable); con error de autorreporte, la cifra sube y no se conoce. Ningún valor de RMSE por debajo de ese piso puede atribuirse al modelo sin evidencia adicional de que las etiquetas son exactas. Cualquier resultado debe presentarse con su intervalo de incertidumbre y la advertencia de que el error de
etiqueta es una cota inferior no medida.

Fuente: Cálculo propio a partir de h²/12 y de la propiedad de la esperanza del error cuadrático medio; Gourlay et al. (2019) y Lobell et al. (2020) para el orden de magnitud del error de autorreporte frente a cortes.

## Conocimiento local: contar el follaje, multiplicar por la densidad por m² y extrapolar a toda la parcela

El equipo del proyecto dejó registrado el 18 de octubre de 2026, como conocimiento local, lo siguiente: «La mejor predicción que puedo dar sería contar la cantidad de follaje en la cebada y multiplicarla por la densidad por m², y realizar ese cálculo para toda la parcela.» Es un hecho del proyecto (conocimiento local
del equipo), igual que el reparto de Doña Josefa y Voyager: no se cuestiona en las reseñas. Los fragmentos siguientes lo relacionan con la literatura publicada.

Su lógica corresponde al método de componentes del rendimiento: rendimiento = espigas/m² × granos/espiga × peso de grano. Con unidades: granos/m² = espigas/m² × granos/espiga; masa de grano (g/m²) = granos/m² × peso de mil granos (PMG, g) / 1000; y como 1 g/m² equivale a 10 kg/ha, kg/ha = espigas/m² × granos/espiga ×
PMG (g) / 100.

Ejemplo hipotético (cálculo, no medición): 500 espigas/m² × 20 granos/espiga × 45 g de PMG / 100 = 4 500 kg/ha, es decir 4,5 t/ha. Para la parcela se multiplica por la superficie: 4,5 t/ha × 10 ha = 45 t (superficie hipotética).

Delimitación: la frase local menciona follaje y densidad por m², pero el método de componentes cuenta espigas (no hojas) y necesita, además, granos por espiga y peso de grano. El protocolo de campo debe fijar qué unidad se cuenta antes de extrapolar a la parcela.

Fuente: conocimiento local del equipo del proyecto, 18 de octubre de 2026 (cita textual); fórmula y conversión de unidades: cálculo propio a partir de 1 g/m² = 10 kg/ha.

## Métodos de conteo para estimar el rendimiento de trigo y cebada antes de la cosecha

No encontramos, en fuentes cuyo texto completo verificamos, un protocolo oficial de INIFAP, SIAP o FAO que estime el rendimiento de cebada por conteo previo a la cosecha. Las guías de extensión australianas (Agriculture Victoria y APO) devolvieron error 403 al intentar leerlas, así que solo citamos sus resúmenes de
búsqueda, marcados como no verificados.

Según esos resúmenes (no verificado), el procedimiento habitual es: medir cuadros de 1 m² y contar las espigas, repetir unas cinco veces para promediar, contar granos en al menos 20 espigas y aplicar un peso de grano. Una guía sudafricana (no verificado) divide espigas/m² × granos por espiga entre una constante de unos
3 500 para trigo de temporal. Los mismos resúmenes indican que la estimación mejora cerca de la madurez y que las parcelas poco uniformes necesitan más muestras (no verificado).

El error típico frente a la cosecha real no está documentado en las fuentes verificadas. El único método publicado y verificado para cebada en Hidalgo es el de biomasa FAO (fragmento 4), que no cuenta espigas.

Hipótesis para el proyecto (no de literatura): calibrar el conteo con cosechas de cuadros de 1 m² en las mismas parcelas antes de usarlo como verdad de terreno.

Fuente: Agriculture Victoria, «A brief guide to estimating crop yields» (no verificado: acceso denegado, error 403), https://agriculture.vic.gov.au/crops-and-horticulture/grains-pulses-and-cereals/crop-production/general-agronomy/a-brief-guide-to-estimating-crop-yields; APO, «Estimating Crop Yields; A Brief Guide» (no
verificado: error 403), https://apo.org.au/sites/default/files/resource-files/2010-11/apo-nid56597_0.htm.

## Densidad de siembra y componentes del rendimiento en cebada de temporal

La ficha técnica de INIFAP-CEZAC (Zacatecas) para cebada maltera de temporal indica 100 kg/ha de semilla en surcos a doble hilera con pileteo, y 130 kg/ha en corrugaciones con pileteo o al voleo. Las variedades de la ficha son Puebla y Esmeralda; la alineación del PDF no permite asignar la fila con certeza. La misma
ficha da un rendimiento potencial alto de 3,5 a 4,0 t/ha y mediano de 2 a 3 t/ha. Estas cifras son de Zacatecas, no de Valles Altos: sirven como referencia, no como recomendación para Hidalgo, Puebla o Tlaxcala.

Como componente, el número de espigas/m² tuvo el mayor efecto directo sobre el rendimiento de cebada de invierno en dos localidades de Macedonia (2012–2014), según Markova Ruzdik et al. (2015). Es un contexto de otra región y otro tipo de cebada.

Plantas/m², espigas/m² y la compensación del macollamiento a densidades bajas para cebada maltera de temporal en Valles Altos no quedaron documentados con cifras verificadas. Este punto queda como no documentado.

Fuente: Medina et al. (2003), «Potencial productivo de especies agrícolas en el estado de Zacatecas», INIFAP-CEZAC, https://zacatecas.inifap.gob.mx/PotAgric/CebadaT.pdf (verificado con pdftotext). Markova Ruzdik, N. et al. (2015), «Correlation between grain yield and yield components in winter barley varieties»,
Agricultural Science and Technology 7(1): 40–44, https://eprints.ugd.edu.mk/13014/ (verificado; DOI no indicado en la página).

## Por qué el follaje no determina solo el rendimiento

El follaje (biomasa verde e índice de área foliar, IAF) se relaciona con el rendimiento, pero no lo determina por sí solo. En el método FAO aplicado en Hidalgo, el rendimiento se calcula como Y = Bn × Hi, donde Bn es la biomasa neta y Hi el índice de cosecha. Gómez Mercado et al. (2009) presentan una relación entre el
factor de ajuste del rendimiento y la densidad de espigas por hectárea. El follaje entra al modelo como variable, no como resultado final.

El grano depende también de la partición a grano y del llenado. En trigo, Gracia-Romero et al. (2023) atribuyen la sobrestimación del NDVI en parcelas de alto rendimiento a componentes como el número y el tamaño de grano, que el NDVI no detecta. Un conteo de follaje hecho en floración puede sobrestimar el rendimiento
si después hay sequía terminal, calor durante el llenado o helada. Para heladas no encontramos fuente verificada (no documentado). Un estudio de trigo de temporal en Marruecos (no verificado) reporta que el estrés antes de antesis redujo los granos por espiga de 32,7 a 13.

Por ello, el conteo es más fiable cerca de madurez y con muestreo representativo.

Fuente: Gómez Mercado, R. et al. (2009), «Estimación del rendimiento de cebada (Hordeum vulgare L.) maltera con el método FAO», Agricultura Técnica en México 35(1): 13–23, https://www.scielo.org.mx/pdf/agritm/v35n1/v35n1a2.pdf (verificado). Gracia-Romero, A. et al. (2023), Frontiers in Plant Science 14, DOI
10.3389/fpls.2023.1063983 (verificado).

## Variabilidad dentro de la parcela y número de muestras

La variabilidad interna de la parcela determina cuántos cuadros hacen falta para extrapolar a toda la superficie. Un estudio de trigo de 2022 (no verificado: no pudimos leer el texto; el resumen de búsqueda lo atribuye a China, pero la URL corresponde a Chilean Journal of Agricultural Research,
https://oes.chileanjar.cl/files/CJAR210373-82-3-2022.pdf) reporta que se necesitaban de 3 a 10 cuadros de 1 m² por parcela para una desviación relativa menor de 5 % en dos tercios de las parcelas, y propone 10 m² como mínimo.

Con esos valores no verificados solo se puede plantear un método de cálculo. Como hipótesis metodológica (fórmula estadística estándar, no de literatura), el número de cuadros es n ≈ (t × CV / E)², donde CV es el coeficiente de variación entre cuadros, E el error relativo deseado y t ≈ 2 para 95 % de confianza. Ejemplo
hipotético: con CV = 30 % (supuesto, no dato del proyecto) y E = 10 %, n ≈ 36 cuadros por parcela.

La distribución en zigzag frente a la estratificada por zonas de suelo o de vigor no quedó comparada en la búsqueda (no documentado).

Fuente: Estudio de trigo de 2022 (no verificado), https://oes.chileanjar.cl/files/CJAR210373-82-3-2022.pdf; fórmula de tamaño de muestra: cálculo estadístico estándar aplicado por el autor del fragmento.

## Teledetección y conteo de campo

Los índices de verdor como el NDVI estiman el follaje por píxel, pero no cuentan espigas ni granos. En trigo, Gracia-Romero et al. (2023) encontraron que el NDVI satura por encima de 8 t/ha. Con parcelas de más de 8 t/ha, el NDVI con días a espigamiento alcanzó R² = 0,595, frente a R² = 0,150 con NDVI solo. Con
parcelas de menos de 8 t/ha, NDVI + días a espigamiento + densidad de espigas alcanzó R² = 0,651, frente a 0,536 con NDVI solo. La densidad de espigas medida en campo aportó información que el satélite no obtiene.

Consecuencia: el conteo de campo (espigas/m² y granos por espiga) es la verdad de terreno para calibrar cualquier estimación satelital en la parcela, y el follaje detectado por satélite es una variable auxiliar. Estos resultados son de trigo y de un estudio concreto; no se generalizan a cebada de Hidalgo sin
calibración local.

Fuente: Gracia-Romero, A., Rufo, R., Gómez-Candón, D., Soriano, J.M., Bellvert, J., Yannam, V.R.R., Gulino, D., Lopes, M.S. (2023), «Improving in-season wheat yield prediction using remote sensing and additional agronomic traits as predictors», Frontiers in Plant Science 14, DOI 10.3389/fpls.2023.1063983 (verificado).

## Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** El rendimiento de una parcela se mide directamente en campo. → **Corrección:** Es el cociente entre una producción medida o autorreportada y un área medida con error; ambos componentes deben documentarse (Carletto et al., 2017; SIAP, 2022).
- **Afirmación errónea:** El autorreporte de productores es insesgado y basta como etiqueta. → **Corrección:** Lobell et al. (2020) encuentran que explica menos de 1 % de la variabilidad del rendimiento de parcela completa, y Gourlay et al. (2019) documentan sobreestimación en parcelas pequeñas.
- **Afirmación errónea:** Un valor de 3.5 t/ha en las etiquetas es exactamente 3.5 t/ha medidos. → **Corrección:** Puede ser un redondeo o un amontonamiento; 45 de 138 etiquetas caen exactamente en la rejilla de 0.5 y su error de redondeo tiene desviación estándar de 0.144 t/ha si el redondeo fue a esa rejilla.
- **Afirmación errónea:** Corregir solo el área o solo la producción siempre reduce el sesgo. → **Corrección:** Con errores correlacionados en área y producción, corregir una de las dos puede aumentar el sesgo (Abay et al., 2019).
- **Afirmación errónea:** El rendimiento municipal del SIAP sirve como etiqueta de la parcela. → **Corrección:** El municipal es producción total entre superficie cosechada total; no es el promedio de parcelas, y en el proyecto su correlación con la etiqueta de parcela fue baja (Spearman −0.30, n = 8, cifra del
  corpus).
- **Afirmación errónea:** El rendimiento a 12 % de humedad se calcula sumando o restando un porcentaje fijo. → **Corrección:** Se usa Y_base = Y × (100 − H_medida) / (100 − H_base); el ajuste es proporcional, no aditivo.
- **Afirmación errónea:** La norma mexicana de cebada fija la base de humedad a 12 %. → **Corrección:** La base de 12 % citada es argentina (Norma V, Res. 27/2013). No se localizó una NMX mexicana (no documentado).
- **Afirmación errónea:** "El follaje por m² determina el rendimiento." → **Corrección:** el follaje es una variable intermedia; el rendimiento requiere espigas/m², granos por espiga y peso de grano, y depende del índice de cosecha y del llenado (Gómez Mercado et al., 2009; Gracia-Romero et al., 2023).
- **Afirmación errónea:** "kg/ha = espigas × granos × PMG." → **Corrección:** kg/ha = espigas/m² × granos/espiga × PMG (g) / 100. Sin dividir entre 100 el resultado sale 100 veces mayor.
- **Afirmación errónea:** "El NDVI cuenta espigas." → **Corrección:** el NDVI estima verdor; en trigo satura por encima de 8 t/ha y no detecta número ni tamaño de grano (Gracia-Romero et al., 2023).
- **Afirmación errónea:** "La densidad de 100 kg/ha es la recomendada para Valles Altos." → **Corrección:** la ficha citada es de Zacatecas (INIFAP-CEZAC); la densidad para Valles Altos no está documentada.
- **Afirmación errónea:** "Un conteo temprano predice la cosecha." → **Corrección:** según resúmenes de guías no verificadas, la precisión mejora cerca de la madurez; la sequía terminal o el calor en llenado pueden cambiar el resultado después del conteo.

## Preguntas y respuestas

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
