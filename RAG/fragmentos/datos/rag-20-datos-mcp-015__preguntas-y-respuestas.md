@id: rag-20-datos-mcp-015
@documento: rag-20-datos-mcp | temas/20_datos_estructurados_y_herramientas_mcp.md
@categoria: datos
@titulo: Preguntas y respuestas
@titulo_documento: Datos estructurados del proyecto y su consulta con el servidor MCP agrocebada
@etiquetas: datos; mcp; sqlite; sql; parcelas; sentinel-2; landsat; planet; hls; alphaearth; chirps; siap; herramientas
@claves: datos mcp sqlite sql parcelas sentinel-2 landsat planet hls alphaearth chirps siap herramientas base lectura solo tablas agente catalogo columnas estan etiquetas figshare filas oficiales preguntas puebla respuestas servidor tiene tlaxcala abre ademas advertencias
@fuente: [datos/agrocebada.sqlite, mcp/servidor_agrocebada.py, 01_reto_agrocebada_y_datos.md, 14_clima_y_riesgo_climatico_altiplano.md, 17_medicion_del_rendimiento_y_estadistica_agricola.md]
# Preguntas y respuestas

**P:** ¿Qué tablas de datos tiene el RAG?
**R:** Once: parcelas, obs_basico, obs_pro, clima_mensual, terreno, alphaearth_anual, hls_2025, rasgos_hls_2025, siap_municipal, documentos_oficiales y catalogo_fuentes, además de catalogo_tablas y diccionario_columnas. Usa la herramienta datos_listar_tablas.

**P:** ¿Cómo consulta el agente los datos?
**R:** Con el servidor MCP agrocebada: datos_describir_tabla para ver columnas y advertencias, y datos_consultar_sql para consultas SELECT de solo lectura (hasta 500 filas y 10 s).

**P:** ¿Cuál es el rendimiento medio de las etiquetas por estado?
**R:** Puebla 4.477 t/ha (71 parcelas), Hidalgo 3.762 (36) y Tlaxcala 2.984 (31), sobre las 138 de ENTRENAMIENTO.

**P:** ¿En cuántos municipios están las parcelas?
**R:** En nueve; Chignahuapan, Puebla, concentra 100 de las 197 y Calpulalpan, Tlaxcala, 44.

**P:** ¿De dónde salen los datos del SIAP?
**R:** Del SIACON del SIAP, mediante la base armonizada de Zepeda Villarreal, López-Ridaura y Sonder (CIMMYT), Figshare v3, DOI 10.6084/m9.figshare.32065674.v3, licencia CC BY 4.0.

**P:** ¿Qué años cubre AlphaEarth en la base?
**R:** De 2017 a 2025, las 197 parcelas en cada año (1,773 filas).

**P:** ¿Hay predicciones o resultados de modelos en la base?
**R:** No. La base solo tiene datos de entrada, etiquetas oficiales y estadística externa. Las cifras de desempeño del proyecto están en el texto del RAG.

**P:** ¿Puede el agente modificar los datos?
**R:** No. La base se abre en modo de solo lectura y el servidor rechaza cualquier sentencia que no sea de lectura.
