@id: rag-20-datos-mcp-001
@documento: rag-20-datos-mcp | temas/20_datos_estructurados_y_herramientas_mcp.md
@categoria: datos
@titulo: Resumen del documento
@titulo_documento: Datos estructurados del proyecto y su consulta con el servidor MCP agrocebada
@etiquetas: datos; mcp; sqlite; sql; parcelas; sentinel-2; landsat; planet; hls; alphaearth; chirps; siap; herramientas
@claves: datos mcp sqlite sql parcelas sentinel-2 landsat planet hls alphaearth chirps siap herramientas resumen agrocebada base documento modelos servidor buscar calcularlas cifras cinco consultar contienen datasets evaluacion explica expone incluye lectura obtuvo oficiales particiones
@fuente: [datos/agrocebada.sqlite, mcp/servidor_agrocebada.py, 01_reto_agrocebada_y_datos.md, 14_clima_y_riesgo_climatico_altiplano.md, 17_medicion_del_rendimiento_y_estadistica_agricola.md]
# Resumen del documento

Resumen

El RAG incluye una base de datos SQLite de solo lectura, `datos/agrocebada.sqlite`, con los datasets oficiales del reto y los que obtuvo el proyecto, y un servidor MCP, `mcp/servidor_agrocebada.py`, que expone siete herramientas: dos para buscar en el RAG y cinco para consultar datos. El texto del RAG explica qué
significan las cifras; la base de datos permite calcularlas. Las tablas no contienen predicciones de modelos, resultados de modelos ni particiones de evaluación, y las 59 parcelas de PREDICCION no tienen rendimiento.
