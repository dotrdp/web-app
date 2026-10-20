@id: rag-01-reto-datos-052
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: AgERA5: variables agronómicas diarias a 0.1°
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem agera5 variables copernicus ecmwf agronomicas climate confluence diarias https agregan agricultura alta alterna chirts comparacion conjunto contrastar corrige cubre data datasets datos declarar
@fuente: [BASES_oficiales_Reto_AgroCebada.txt, DESCRIPCION_oficial_dataset.txt, Descripcion_general_variables_DataSet.txt, Diccionario_de_indices_satelitales.txt, HECHOS_CALCULADOS_dataset_oficial.md, modelado__ORIGINAL_FIRA_AUDIT.md, modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md, modelado__DATASET.md,
# AgERA5: variables agronómicas diarias a 0.1°

AgERA5 es un conjunto diario de variables meteorológicas para agricultura del Copernicus Climate Data Store, que cubre de 1979 al presente a 0.1° (unos 11 km en el ecuador). Se deriva de ERA5 horario: los datos se agregan a días en hora local y se reescalan con ecuaciones de regresión entrenadas con el modelo de alta
resolución del ECMWF. Documenta unas 22 variables, entre ellas viento, temperatura, precipitación, humedad, nubosidad, radiación y evapotranspiración de referencia. La versión 2.0 corrige problemas de la v1.1, como valores de Tmin erróneos y Tmean mayores que Tmax. Para el reto, AgERA5 ofrece más variables que CHIRPS o
CHIRTS, pero su escala sigue siendo de varios kilómetros y no distingue parcelas dentro de un municipio. Recomendación: usar AgERA5 como fuente alterna para contrastar CHIRPS y CHIRTS-ERA5 en la misma ventana temporal, y declarar que la comparación es entre productos de malla. Fuente: Copernicus CDS,
https://cds.climate.copernicus.eu/datasets/sis-agrometeorological-indicators; ECMWF Confluence (AgERA5), https://confluence.ecmwf.int/x/3FmaE.
