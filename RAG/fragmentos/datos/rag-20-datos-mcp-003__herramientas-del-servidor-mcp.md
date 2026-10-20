@id: rag-20-datos-mcp-003
@documento: rag-20-datos-mcp | temas/20_datos_estructurados_y_herramientas_mcp.md
@categoria: datos
@titulo: Herramientas del servidor MCP
@titulo_documento: Datos estructurados del proyecto y su consulta con el servidor MCP agrocebada
@etiquetas: datos; mcp; sqlite; sql; parcelas; sentinel-2; landsat; planet; hls; alphaearth; chirps; siap; herramientas
@claves: datos mcp sqlite sql parcelas sentinel-2 landsat planet hls alphaearth chirps siap herramientas servidor parcela tabla agrocebada buscar consultar describir serie abre advertencias agente agregados ambito autorizador base citar columnas concepto cualquier ejemplo escritura externos ficha
@fuente: mcp/servidor_agrocebada.py; mcp/LEEME.md.
# Herramientas del servidor MCP

El servidor `agrocebada` funciona por stdio y no necesita paquetes externos. Herramientas: `rag_buscar` (regex con tgrep; ámbito «indices», «temas», «fragmentos» o «todo»), `rag_leer_fragmento` (texto de un fragmento por su @id), `datos_listar_tablas`, `datos_describir_tabla` (columnas, significado, advertencias y
ejemplo), `datos_consultar_sql` (SELECT o WITH, hasta 500 filas y 10 s), `datos_parcela` (ficha de una parcela) y `datos_serie_temporal` (serie de una variable por parcela). La base se abre en modo de solo lectura y un autorizador de SQLite rechaza cualquier escritura, así que el agente no puede modificar los datos.
Flujo recomendado: buscar el concepto en el RAG, describir la tabla, consultar con agregados y citar tanto el @id como la tabla usada.

Fuente: mcp/servidor_agrocebada.py; mcp/LEEME.md.
