@id: rag-20-datos-mcp-006
@documento: rag-20-datos-mcp | temas/20_datos_estructurados_y_herramientas_mcp.md
@categoria: datos
@titulo: Tabla clima_mensual: precipitación y temperatura
@titulo_documento: Datos estructurados del proyecto y su consulta con el servidor MCP agrocebada
@etiquetas: datos; mcp; sqlite; sql; parcelas; sentinel-2; landsat; planet; hls; alphaearth; chirps; siap; herramientas
@claves: datos mcp sqlite sql parcelas sentinel-2 landsat planet hls alphaearth chirps siap herramientas clima mensual precipitacion tabla temperatura media mensuales parcela absolutos agrocebada anual calculo chirts-era5 comparten conjunto contrastarse cualquier cuentan deben diaria diarias dias
@fuente: LEEME de los rasters oficiales de temperatura y CHIRPS; datos/agrocebada.sqlite, tabla clima_mensual (cálculo propio).
# Tabla clima_mensual: precipitación y temperatura

`clima_mensual` tiene 9,456 filas (197 parcelas × 48 meses, 2022-01 a 2025-12) con la media de cada raster oficial sobre la parcela: `precip_mm_mes` de CHIRPS y `tmin_c`/`tmax_c` de CHIRTS-ERA5 (medias mensuales de la mínima y la máxima diarias). La resolución es de 0.05° (unos 5 km), mayor que cualquier parcela, así
que parcelas vecinas comparten valor. Los promedios de precipitación anual del conjunto fueron de unos 609 mm en 2022, 668 en 2023, 1,006 en 2024 y 1,054 en 2025 (media de parcelas). Con datos mensuales no se cuentan días de helada ni lluvia diaria; las temperaturas son de un producto en malla, no de estación, y sus
valores absolutos deben contrastarse con estaciones del SMN.

Fuente: LEEME de los rasters oficiales de temperatura y CHIRPS; datos/agrocebada.sqlite, tabla clima_mensual (cálculo propio).
