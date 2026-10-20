@id: rag-20-datos-mcp-012
@documento: rag-20-datos-mcp | temas/20_datos_estructurados_y_herramientas_mcp.md
@categoria: datos
@titulo: Recetas de SQL frecuentes
@titulo_documento: Datos estructurados del proyecto y su consulta con el servidor MCP agrocebada
@etiquetas: datos; mcp; sqlite; sql; parcelas; sentinel-2; landsat; planet; hls; alphaearth; chirps; siap; herramientas
@claves: datos mcp sqlite sql parcelas sentinel-2 landsat planet hls alphaearth chirps siap herramientas municipio poligono rendimiento select group where anio frecuentes ndvi parcela recetas agrocebada basico between chignahuapan ciclo clima consultas count despejado etiquetas
@fuente: datos/agrocebada.sqlite (consultas verificadas con el servidor MCP).
# Recetas de SQL frecuentes

Rendimiento por municipio: `SELECT municipio, count(rendimiento_t_ha) n, round(avg(rendimiento_t_ha),3) media FROM parcelas GROUP BY municipio`. NDVI máximo de 2025 por parcela con Sentinel-2 despejado: `SELECT id_poligono, max(ndvi_promedio) FROM obs_basico WHERE sensor='Sentinel-2' AND fecha LIKE '2025%' AND
porcentaje_nubosidad <= 10 GROUP BY id_poligono`. Lluvia de la temporada por parcela: `SELECT id_poligono, sum(precip_mm_mes) FROM clima_mensual WHERE mes BETWEEN '2025-05' AND '2025-10' GROUP BY id_poligono`. Unir con etiquetas: `JOIN parcelas USING (id_poligono)` y filtrar `rendimiento_t_ha IS NOT NULL`. Serie del
SIAP de un municipio: `SELECT anio, rendimiento_t_ha FROM siap_municipal WHERE municipio='Chignahuapan' AND ciclo='Primavera-Verano' ORDER BY anio`.

Fuente: datos/agrocebada.sqlite (consultas verificadas con el servidor MCP).
