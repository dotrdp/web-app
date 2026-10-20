@id: rag-20-datos-mcp-008
@documento: rag-20-datos-mcp | temas/20_datos_estructurados_y_herramientas_mcp.md
@categoria: datos
@titulo: Tablas hls_2025 y rasgos_hls_2025
@titulo_documento: Datos estructurados del proyecto y su consulta con el servidor MCP agrocebada
@etiquetas: datos; mcp; sqlite; sql; parcelas; sentinel-2; landsat; planet; hls; alphaearth; chirps; siap; herramientas
@claves: datos mcp sqlite sql parcelas sentinel-2 landsat planet hls alphaearth chirps siap herramientas rasgos parcela tablas bandas experimento octubre agosto agrocebada apar area cebada clorofila despejada despejados enero error estimado estimados experimentos fapar fecha filas frente grano
@fuente: spatial_regression/README.md del proyecto (método); datos/agrocebada.sqlite, tablas hls_2025 y rasgos_hls_2025.
# Tablas hls_2025 y rasgos_hls_2025

`hls_2025` tiene 26,805 filas de reflectancia HLS v2.0 (L30 de Landsat y S30 de Sentinel-2, 30 m) por parcela y fecha, del 5 de enero al 28 de octubre de 2025; 12,354 tienen más de la mitad de la parcela despejada, y las bandas son NULL cuando no hay píxeles despejados. `rasgos_hls_2025` resume la temporada 2025 de
cada parcela con rasgos de un experimento propio: fAPAR estimado por inversión de PROSAIL con una hoja tipo cebada (`apar_dj`), NDVI medio, LAI y clorofila estimados, bandas medias y sus versiones en el llenado de grano (15 de agosto a 27 de octubre). Son rasgos de experimento, no datos oficiales, y en nuestros
experimentos no mejoraron el error frente a usar solo el área.

Fuente: spatial_regression/README.md del proyecto (método); datos/agrocebada.sqlite, tablas hls_2025 y rasgos_hls_2025.
