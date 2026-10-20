@id: rag-20-datos-mcp-007
@documento: rag-20-datos-mcp | temas/20_datos_estructurados_y_herramientas_mcp.md
@categoria: datos
@titulo: Tabla alphaearth_anual: embeddings de 64 dimensiones
@titulo_documento: Datos estructurados del proyecto y su consulta con el servidor MCP agrocebada
@etiquetas: datos; mcp; sqlite; sql; parcelas; sentinel-2; landsat; planet; hls; alphaearth; chirps; siap; herramientas
@claves: datos mcp sqlite sql parcelas sentinel-2 landsat planet hls alphaearth chirps siap herramientas anual dimensiones area tabla embeddings filas media parcela proyecto agrocebada anos coincide comparar coseno dataset dentro descargo descuantizacion dimension documentacion ejemplo embedding
@fuente: dataset/alphaearth/README.md del proyecto; datos/agrocebada.sqlite, tabla alphaearth_anual.
# Tabla alphaearth_anual: embeddings de 64 dimensiones

`alphaearth_anual` tiene 1,773 filas: un vector de 64 dimensiones (a00–a63) por parcela y año, de 2017 a 2025, obtenido de AlphaEarth Foundations Satellite Embedding V1 a 10 m. El proyecto descargó los rasters de las 197 parcelas y los resumió como indica su documentación: descuantización con signo·(x/127.5)², media
ponderada por la fracción de área de cada píxel dentro de la parcela y normalización a norma 1. Las dimensiones no tienen significado físico individual: se usan para comparar parcelas o años (por ejemplo, similitud coseno) o como entrada de un modelo, no para interpretar «la dimensión a17». En 9 filas la malla del año
no coincide con la máscara de área y se usó media simple (`ponderado_por_area = 0`).

Fuente: dataset/alphaearth/README.md del proyecto; datos/agrocebada.sqlite, tabla alphaearth_anual.
