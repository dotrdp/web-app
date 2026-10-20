@id: rag-01-reto-datos-058
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Nubosidad de Sentinel-2 en la temporada de lluvias del centro de México
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem resumen mexico observaciones centro devolvio espaciotemporales hasta leido lluvias lluviosos meses nubes nubosidad octubre patrones pixel publicacion referencia riunet ronda solorzano temporada validas brasil
@fuente: [BASES_oficiales_Reto_AgroCebada.txt, DESCRIPCION_oficial_dataset.txt, Descripcion_general_variables_DataSet.txt, Diccionario_de_indices_satelitales.txt, HECHOS_CALCULADOS_dataset_oficial.md, modelado__ORIGINAL_FIRA_AUDIT.md, modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md, modelado__DATASET.md,
# Nubosidad de Sentinel-2 en la temporada de lluvias del centro de México

En la ronda 3 se localizó la publicación de Solórzano et al. (2020) sobre patrones espaciotemporales de las observaciones Sentinel-2 en México entre 2015 y 2019 (repositorio de la Universidad Iberoamericana; el PDF no devolvió un documento legible, así que sus cifras no se usan). El resumen de la publicación (leído en
RiuNet en la ronda 4) da conteos y no porcentajes: hasta 121 observaciones válidas por píxel al año y hasta 6.58 por mes, según el resumen. El PDF completo no se pudo descargar (la descarga devolvió HTML), así que el porcentaje de escenas válidas de junio a octubre sigue SIN EVIDENCIA. Como referencia de otra región,
un estudio del noreste de Brasil con MODIS, Landsat-8 y Sentinel-2 encontró una reducción de cerca de 50 % de las imágenes libres de nubes en los meses lluviosos, con mejores condiciones entre mayo y octubre. Implicación para el reto: el
número de fechas ópticas útiles es menor en los meses lluviosos, por lo que una fecha de Sentinel-2 sin máscara de nubes o con cobertura parcial no debe tratarse como observación válida. Fuente: Solórzano, J. V., Mas, J. F., Gao, Y. y Gallardo Cruz, J. A. (2020), «Patrones espaciotemporales de las observaciones de
Sentinel-2 a nivel de imagen y píxel sobre el territorio mexicano entre 2015 y 2019», Revista de Teledetección 56: 103–115, doi:10.4995/raet.2020.14044; resumen en https://riunet.upv.es/handle/10251/159566 (solo resumen leído); referencia brasileña no localizada.
