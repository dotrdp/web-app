@id: rag-20-datos-mcp-005
@documento: rag-20-datos-mcp | temas/20_datos_estructurados_y_herramientas_mcp.md
@categoria: datos
@titulo: Tablas obs_basico y obs_pro: índices satelitales oficiales
@titulo_documento: Datos estructurados del proyecto y su consulta con el servidor MCP agrocebada
@etiquetas: datos; mcp; sqlite; sql; parcelas; sentinel-2; landsat; planet; hls; alphaearth; chirps; siap; herramientas
@claves: datos mcp sqlite sql parcelas sentinel-2 landsat planet hls alphaearth chirps siap herramientas indices basico fecha filas oficiales satelitales diccionario ndvi nubosidad oficial tablas trae advierte captura columna conteos deben derivada distintas documentos espectral-termico estadisticos filtra
@fuente: Diccionario de índices satelitales (oficial), tabla documentos_oficiales; conteos sobre obs_basico.
# Tablas obs_basico y obs_pro: índices satelitales oficiales

`obs_basico` trae, por parcela y fecha, estadísticos (promedio, std, max, min) de 22 índices de Sentinel-2 (59,040 filas) y del índice espectral-térmico VI6T de Landsat (48,626 filas, sin NDVI). `obs_pro` trae NDVI, EVI, LAI y MSAVI de Planet en 2025 (47,804 filas). La columna `fecha` es la fecha ISO derivada de
`fecha_captura`. El diccionario oficial advierte que los índices de Planet y los de Sentinel-2 provienen de fuentes distintas y no deben fusionarse como si fueran la misma medición. Filtra por `porcentaje_nubosidad`: de las filas de Sentinel-2, 39,442 tienen nubosidad de 10 % o menos.

Fuente: Diccionario de índices satelitales (oficial), tabla documentos_oficiales; conteos sobre obs_basico.
