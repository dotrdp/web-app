@id: rag-01-reto-datos-070
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Preguntas y respuestas
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem parcelas rendimiento cebada cubre dataset resolucion segun tiene tienen dias entrenamiento mexico observaciones basico fira grano hasta inegi landsat octubre porcentaje prediccion produccion rasters
@fuente: [BASES_oficiales_Reto_AgroCebada.txt, DESCRIPCION_oficial_dataset.txt, Descripcion_general_variables_DataSet.txt, Diccionario_de_indices_satelitales.txt, HECHOS_CALCULADOS_dataset_oficial.md, modelado__ORIGINAL_FIRA_AUDIT.md, modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md, modelado__DATASET.md,
# Preguntas y respuestas

**P:** ¿Qué pide el Reto AgroCebada 2026?
**R:** Desarrollar un modelo que prediga el rendimiento de parcelas de cebada en Hidalgo, Tlaxcala y Puebla, y una aplicación o interfaz web que permita consultar los resultados.

**P:** ¿Cuántas parcelas tiene el dataset y cómo se dividen?
**R:** 197 parcelas: 138 de ENTRENAMIENTO con rendimiento visible y 59 de PREDICCION con rendimiento oculto.

**P:** ¿Qué peso tiene cada criterio de evaluación en la primera etapa?
**R:** El desempeño predictivo y la justificación técnica pesan 70 % (con RMSE, MAE, r² u otras métricas del comité) y la aplicación o interfaz web 30 %.

**P:** ¿Qué periodo cubre el rendimiento?
**R:** El ciclo de producción de abril a octubre de 2025.

**P:** ¿Cuál es el rendimiento medio de entrenamiento?
**R:** Media de 3.955 t/ha, mediana de 4.34, desviación estándar de 0.851, mínimo de 2.00 y máximo de 5.59.

**P:** ¿Qué municipio tiene más parcelas?
**R:** Chignahuapan (Puebla), con 100 parcelas: 71 de entrenamiento y 29 de predicción.

**P:** ¿Por qué el valor 4.5 t/ha aparece tantas veces?
**R:** Al redondear a 0.1 t/ha, 27 de las 138 parcelas de entrenamiento tienen 4.5. Las fuentes no documentan el método de medición ni de redondeo, así que la causa no está determinada.

**P:** ¿Qué cubre el Dataset Básico?
**R:** Observaciones de Sentinel-2 y Landsat de 2022 a 2025 (107,666 filas, 96 columnas), con 23 índices, cuatro estadísticos por índice y el porcentaje de nubosidad.

**P:** ¿Qué diferencia hay entre el Dataset Básico y el PRO?
**R:** El PRO es de Planet y solo cubre 2025, con NDVI, EVI, LAI y MSAVI. Sus valores no deben fusionarse con los del Básico.

**P:** ¿Qué resolución tienen los rasters de precipitación y temperatura?
**R:** Unos 0.05° (cerca de 5 km), 48 rasters mensuales por variable de 2022 a 2025, en mm para CHIRPS y en °C para CHIRTS-ERA5.

**P:** ¿Qué se sabe de la topografía?
**R:** Elevación y pendiente son rasters estáticos de 120 m derivados del CEM de INEGI; la pendiente se expresa en grados y algunas parcelas tienen cobertura baja.

**P:** ¿Qué datos no incluye el dataset oficial?
**R:** Fechas de siembra y cosecha, manejo, cultivar, fertilización, riego, daños y mediciones de suelo.

**P:** ¿Por qué no se pueden usar las observaciones de noviembre y diciembre de 2025?
**R:** Están fuera del ciclo abril–octubre que el rendimiento describe; usarlas sería una fuga temporal en una predicción emitida antes de la cosecha.


**P:** ¿Qué cubre CHIRPS y con qué resolución?
**R:** Según el Climate Hazards Center, cubre 50°S a 50°N desde 1981 hasta casi el presente, con resolución de 0.05° (unos 5 km). Es una malla que combina satélite y estaciones, no un pluviómetro por parcela.

**P:** ¿Qué validación de CHIRPS existe para México?
**R:** Rodríguez-Herrera et al. (2025) encontraron correlación positiva y significativa con estaciones en tres cuencas, RMSE menor de 21 mm en regiones templada y árida, y subestimación en la cuenca tropical. No se encontró validación específica en el Altiplano de altitud elevada.

**P:** ¿Cuál es la revisita combinada de Sentinel-2 y de Landsat 8/9?
**R:** Sentinel-2A y 2B combinados revisitan cada 5 días (10 días cada uno). Landsat 8 y 9 combinados revisitan cada 8 días (16 días cada uno).

**P:** ¿Qué resolución tiene el CEM de INEGI?
**R:** INEGI documenta 15 m para el CEM 3.0 (2012) y 30 m para versiones anteriores. Las capas del reto tienen 120 m, lo que sugiere remuestreo; no se encontró documentación pública de un CEM 4.0.

**P:** ¿Cuántas variables tiene AgERA5 y qué resolución espacial?
**R:** Según CDS y ECMWF, unas 22 variables agronómicas diarias a 0.1° (unos 11 km), desde 1979. El proyecto menciona 27 variables; esa cifra debe revisarse.

**P:** ¿Qué son los cuatro fideicomisos de FIRA?
**R:** FONDO, FEFA, FEGA y FOPESCA. La SHCP es el fideicomitente y el Banco de México el fiduciario, según la página oficial de FIRA en gob.mx/fira.

**P:** ¿Qué variedades de cebada tienen las parcelas del reto?
**R:** Doña Josefa (6 hileras) y Voyager (2 hileras), confirmado por verificación local del equipo. El dataset no indica qué variedad corresponde a cada parcela.

**P:** ¿Qué porcentaje de la cebada de México se siembra en temporal?
**R:** Según un artículo del INIFAP, alrededor de 67 % de la producción corresponde a temporal (primavera-verano) y 33 % a riego (otoño-invierno). La cifra proviene del resumen y no se confirmó en el texto completo.

**P:** ¿Qué cultivos estima la ESA de SIAP para Hidalgo en primavera-verano 2022?
**R:** Maíz grano, sorgo grano, frijol y trigo grano, con 556 parcelas georreferenciadas y 10 imágenes SPOT. La cebada no está en esa lista.

**P:** ¿El Censo Agropecuario 2022 permite calcular el rendimiento de cebada por hectárea cosechada?
**R:** No. Con producción y superficie sembrada se obtiene un cociente por hectárea sembrada, que no es el rendimiento que define SIAP.

**P:** ¿Qué dice el resumen de Solórzano et al. (2020) sobre las observaciones Sentinel-2 en México?
**R:** Según el resumen, hasta 121 observaciones válidas por píxel al año y hasta 6.58 por mes. El porcentaje de escenas válidas de junio a octubre no se leyó.
