@id: rag-01-reto-datos-049
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Delimitación de campos pequeños: 10 m frente a 3 m
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem campos arxiv delimitacion frente preprint cerca menores parcelas pequenos pixeles recomendacion solo buffer cuantos https indices interiores leido limites mayores mayoria mediana metodologica mide minima
@fuente: [BASES_oficiales_Reto_AgroCebada.txt, DESCRIPCION_oficial_dataset.txt, Descripcion_general_variables_DataSet.txt, Diccionario_de_indices_satelitales.txt, HECHOS_CALCULADOS_dataset_oficial.md, modelado__ORIGINAL_FIRA_AUDIT.md, modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md, modelado__DATASET.md,
# Delimitación de campos pequeños: 10 m frente a 3 m

Un preprint de 2026 sobre delimitación de límites de campos (arXiv 2607.04449, sin revisión por pares) reporta que a 10 m solo cerca de 7.5 % de los campos menores de 0.5 ha permanecen como polígonos separados, frente a cerca de 88 % a 3 m. Para el reto, la mayoría de las parcelas son mayores de 0.5 ha (la mediana es
5.46 ha), pero la parcela mínima mide 0.35 ha Recomendación metodológica: en parcelas menores de 1 ha, usar solo los píxeles interiores (un buffer negativo sobre el polígono) para promediar índices, y reportar cuántos píxeles quedaron tras el recorte. Esta recomendación no es un resultado del preprint. Fuente: arXiv
2607.04449, https://arxiv.org/pdf/2607.04449 (resumen leído; preprint).
