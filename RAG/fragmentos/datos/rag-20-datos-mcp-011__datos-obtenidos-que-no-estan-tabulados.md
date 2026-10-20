@id: rag-20-datos-mcp-011
@documento: rag-20-datos-mcp | temas/20_datos_estructurados_y_herramientas_mcp.md
@categoria: datos
@titulo: Datos obtenidos que no están tabulados
@titulo_documento: Datos estructurados del proyecto y su consulta con el servidor MCP agrocebada
@etiquetas: datos; mcp; sqlite; sql; parcelas; sentinel-2; landsat; planet; hls; alphaearth; chirps; siap; herramientas
@claves: datos mcp sqlite sql parcelas sentinel-2 landsat planet hls alphaearth chirps siap herramientas catalogo escenas estan fuentes obtenidos proyecto rasters ruta tabla tabulados agente agrocebada agua anomalias area base citar corresponda datasets debe embeddings
@fuente: datos/agrocebada.sqlite, tabla catalogo_fuentes.
# Datos obtenidos que no están tabulados

`catalogo_fuentes` lista los datasets del proyecto que quedaron fuera de la base por ser rasters o escenas, con su ruta en fira2026: los 1,773 GeoTIFF de AlphaEarth y sus máscaras de área, los rasters oficiales de CHIRPS, temperatura y topografía INEGI CEM 4, el shapefile y el proyecto QGIS, el manifiesto de escenas
HLS de la segmentación de agua y anomalías, el Sentinel-2 recalculado y las ventanas CHIRPS v3 de los experimentos profundos, las series Sentinel-2 y Granite 2016–2024 de los modelos fundacionales, y los embeddings TESSERA 2024 y 2025. Para preguntas sobre esos datos, el agente debe citar la ruta y la tabla resumida
que corresponda, y no inventar valores por píxel.

Fuente: datos/agrocebada.sqlite, tabla catalogo_fuentes.
