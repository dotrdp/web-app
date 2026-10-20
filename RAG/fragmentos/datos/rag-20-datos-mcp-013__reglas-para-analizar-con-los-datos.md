@id: rag-20-datos-mcp-013
@documento: rag-20-datos-mcp | temas/20_datos_estructurados_y_herramientas_mcp.md
@categoria: datos
@titulo: Reglas para analizar con los datos
@titulo_documento: Datos estructurados del proyecto y su consulta con el servidor MCP agrocebada
@etiquetas: datos; mcp; sqlite; sql; parcelas; sentinel-2; landsat; planet; hls; alphaearth; chirps; siap; herramientas
@claves: datos mcp sqlite sql parcelas sentinel-2 landsat planet hls alphaearth chirps siap herramientas analizar cifras indices reglas agents anomalia ausencia base calculada calcular causa compares correlacion cruzada dano desempeno distintos documentos error estan etiqueta exploratoria falta
@fuente: rag-10-validacion; rag-06-plagas-danos; documentos_oficiales; AGENTS.md.
# Reglas para analizar con los datos

Una correlación calculada con 138 parcelas es exploratoria: reporta n, el intervalo o al menos el signo y la magnitud, y no la presentes como causa. No compares cifras de error entre protocolos distintos; las cifras de desempeño del proyecto son de validación cruzada sobre las 138 parcelas y están en el texto del RAG,
no en la base. No uses las 59 parcelas de PREDICCION para calcular métricas de rendimiento, porque no tienen etiqueta. No mezcles índices de Planet con los de Sentinel-2 como si fueran la misma variable. Recuerda que el reto no da la variedad, el manejo ni el suelo por parcela, y que una plaga puede propagarse sin que
el satélite la perciba, así que la falta de anomalía en los índices no prueba ausencia de daño.

Fuente: rag-10-validacion; rag-06-plagas-danos; documentos_oficiales; AGENTS.md.
