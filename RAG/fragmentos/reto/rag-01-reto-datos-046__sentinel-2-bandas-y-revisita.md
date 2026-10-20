@id: rag-01-reto-datos-046
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Sentinel-2: bandas y revisita
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem bandas revisita dias cercano earthdata https infrarrojo nasa parcela rojo wikipedia aerosoles agua antes azul borde cirros combinada confirmar considerar cuantas dato desfasados determina
@fuente: [BASES_oficiales_Reto_AgroCebada.txt, DESCRIPCION_oficial_dataset.txt, Descripcion_general_variables_DataSet.txt, Diccionario_de_indices_satelitales.txt, HECHOS_CALCULADOS_dataset_oficial.md, modelado__ORIGINAL_FIRA_AUDIT.md, modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md, modelado__DATASET.md,
# Sentinel-2: bandas y revisita

Sentinel-2A y Sentinel-2B operan en la misma órbita, desfasados 180 grados. Juntos ofrecen una revisita de unos 5 días; cada satélite, por separado, de unos 10 días. Las bandas de 10 m son azul, verde, rojo e infrarrojo cercano (B2, B3, B4 y B8). Las bandas de borde rojo, infrarrojo cercano estrecho y SWIR se toman a
20 m, y las de aerosoles, vapor de agua y cirros a 60 m. Para una parcela de la mediana del reto (5.46 ha, unos 55,000 m²), esto equivale a unos 550 píxeles de 10 m, lo que da margen para promedios por parcela. La revisita combinada de 5 días es el dato que determina cuántas fechas útiles puede haber en la temporada,
antes de considerar nubes. Fuente: NASA Earthdata, sensor MSI, https://www.earthdata.nasa.gov/sensors/msi; Wikipedia, Sentinel-2, https://en.wikipedia.org/wiki/Sentinel-2 (fuentes secundarias; confirmar con ESA para uso formal).
