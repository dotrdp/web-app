@id: rag-02-glosario-038
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Glosario: percepción remota con Sentinel-2 (reflectancia, corrección atmosférica y máscaras)
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos sentinel-2 reflectancia nubes pixel titulo jstars superficie atmosfera atmosferica correccion espectral mision nube resolucion revisita sombra woodcock aerosoles bandas cloud composite copernicus corregida definicion
@fuente: Li et al. (2018), IEEE JSTARS, DOI 10.1109/jstars.2018.2835823; Zhu y Woodcock (2012), DOI 10.1016/j.rse.2011.10.028; Zhu et al. (2015), DOI 10.1016/j.rse.2014.12.014; Drusch et al. (2012), DOI 10.1016/j.rse.2011.11.026; PE&RS (2026), DOI 10.14358/pers.26-00028r3; DOI 10.5270/s2_-6eb6imz (títulos y…
# Glosario: percepción remota con Sentinel-2 (reflectancia, corrección atmosférica y máscaras)

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
