@id: rag-20-datos-mcp-002
@documento: rag-20-datos-mcp | temas/20_datos_estructurados_y_herramientas_mcp.md
@categoria: datos
@titulo: Qué datos hay y para qué sirve cada tabla
@titulo_documento: Datos estructurados del proyecto y su consulta con el servidor MCP agrocebada
@etiquetas: datos; mcp; sqlite; sql; parcelas; sentinel-2; landsat; planet; hls; alphaearth; chirps; siap; herramientas
@claves: datos mcp sqlite sql parcelas sentinel-2 landsat planet hls alphaearth chirps siap herramientas tablas catalogo tabla diccionario municipal observaciones oficiales rasgos sirve agrocebada anual anuales apoyo area base basico cebada centroide clima columnas descripcion documentos
@fuente: datos/agrocebada.sqlite, tabla catalogo_tablas.
# Qué datos hay y para qué sirve cada tabla

La base tiene once tablas. Datos oficiales del reto: `parcelas` (197 parcelas con área, rendimiento de las 138 de ENTRENAMIENTO, municipio, estado, centroide y polígono), `obs_basico` (107,666 observaciones de Sentinel-2 y Landsat, 2022–2025), `obs_pro` (47,804 observaciones de Planet en 2025), `clima_mensual`
(precipitación y temperatura mensuales por parcela, 2022–2025) y `terreno` (elevación y pendiente). Datos obtenidos por el proyecto: `alphaearth_anual` (embeddings anuales 2017–2025), `hls_2025` (reflectancia HLS por fecha), `rasgos_hls_2025` (rasgos de temporada de un experimento propio) y `siap_municipal`
(estadística municipal de cebada grano de temporal, 2003–2024). Tablas de apoyo: `catalogo_tablas`, `diccionario_columnas`, `documentos_oficiales` (texto de la descripción oficial y del diccionario de índices) y `catalogo_fuentes` (rasters y escenas que no están tabulados, con su ruta).

Fuente: datos/agrocebada.sqlite, tabla catalogo_tablas.
