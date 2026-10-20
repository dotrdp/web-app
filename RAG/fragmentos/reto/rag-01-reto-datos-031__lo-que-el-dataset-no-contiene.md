@id: rag-01-reto-datos-031
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Lo que el dataset no contiene
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem dataset contiene original rasters variable adicionales ancha aportan audit auditorias campo carencias causa celda clima climate climatica climaticos concluyen cosecha cualquier cultivar cultivo danos desviacion
@fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (secciones Climate raster support y Label provenance).
# Lo que el dataset no contiene

Las auditorías concluyen que el dataset original no incluye mediciones de suelo, manejo, fechas de siembra y cosecha, cultivar, fertilizantes, riego ni daños al cultivo, y tampoco rasters de clima a escala de campo. La precipitación y las temperaturas son de celda de unos 5 km; el terreno, de 120 m. Las estadísticas
espaciales adicionales de los rasters climáticos existen en la tabla ancha, pero solo 31 de 197 parcelas tienen variación superior a 10⁻⁶ en la desviación estándar de cada variable climática, por lo que aportan poca información. Estas carencias limitan la interpretación de cualquier variable como causa del rendimiento.

Fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (secciones Climate raster support y Label provenance).
