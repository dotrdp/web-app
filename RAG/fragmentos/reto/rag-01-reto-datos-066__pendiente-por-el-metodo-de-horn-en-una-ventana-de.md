@id: rag-01-reto-datos-066
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Pendiente por el método de Horn en una ventana de 3 × 3
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem horn pendiente ventana gdal gdaldem metodo nodata parcela terreno accidentado altura antes asigna baja calculo celda centrada cobertura cubre debe detalle directos documentacion escala estadistica
@fuente: [BASES_oficiales_Reto_AgroCebada.txt, DESCRIPCION_oficial_dataset.txt, Descripcion_general_variables_DataSet.txt, Diccionario_de_indices_satelitales.txt, HECHOS_CALCULADOS_dataset_oficial.md, modelado__ORIGINAL_FIRA_AUDIT.md, modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md, modelado__DATASET.md,
# Pendiente por el método de Horn en una ventana de 3 × 3

El cálculo de pendiente con el método de Horn (1981) estima el gradiente de altura a partir de una ventana de 3 × 3 píxeles centrada en cada celda, con pesos que favorecen a los vecinos directos. GDAL, en su herramienta gdaldem, ofrece Horn o Zevenbergen-Thorne; indica que la fórmula de Horn funciona mejor en terreno
más accidentado. Para una malla de 120 m, la ventana cubre unos 360 m por lado, así que la pendiente resume el relieve a esa escala y no la microtopografía de una parcela de 5 ha. Un detalle práctico: GDAL asigna nodata si al menos un píxel de la ventana es nodata. Eso explica por qué una parcela con cobertura baja de
pendiente debe revisarse antes de usar la estadística de terreno. Fuente: Horn, B. K. P. (1981), «Hill shading and the reflectance map», Proceedings of the IEEE 69(1): 14–47, doi:10.1109/PROC.1981.11918; documentación de GDAL, gdaldem, https://gdal.org/en/stable/programs/gdaldem.html (leída en la ronda 3).
