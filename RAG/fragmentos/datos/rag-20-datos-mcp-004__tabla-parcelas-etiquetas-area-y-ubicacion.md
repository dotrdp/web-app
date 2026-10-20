@id: rag-20-datos-mcp-004
@documento: rag-20-datos-mcp | temas/20_datos_estructurados_y_herramientas_mcp.md
@categoria: datos
@titulo: Tabla parcelas: etiquetas, área y ubicación
@titulo_documento: Datos estructurados del proyecto y su consulta con el servidor MCP agrocebada
@etiquetas: datos; mcp; sqlite; sql; parcelas; sentinel-2; landsat; planet; hls; alphaearth; chirps; siap; herramientas
@claves: datos mcp sqlite sql parcelas sentinel-2 landsat planet hls alphaearth chirps siap herramientas tabla tlaxcala area cebada etiquetas hidalgo hileras puebla ubicacion agrocebada almoloya apan arista calculo calpulalpan chignahuapan columna cuautepec cultivo dona emiliano entrenamiento estado
@fuente: datos/agrocebada.sqlite, tabla parcelas (cálculo propio con datos oficiales).
# Tabla parcelas: etiquetas, área y ubicación

`parcelas` tiene una fila por parcela, de AGC_001 a AGC_197. Las 197 parcelas están en nueve municipios: Chignahuapan, Puebla (100); Calpulalpan, Tlaxcala (44); Singuilucan (23), Almoloya (14), Cuautepec de Hinojosa (9), Emiliano Zapata (3), Apan (1) y Tepeapulco (1), Hidalgo; y Nanacamilpa de Mariano Arista, Tlaxcala
(2). Por estado, las 138 de ENTRENAMIENTO dan medias de 4.477 t/ha en Puebla (71), 3.762 en Hidalgo (36) y 2.984 en Tlaxcala (31). La columna `cultivo` mezcla «Cebada» y «CEBADA» tal como viene en el shapefile oficial. La tabla no registra la variedad (Doña Josefa de 6 hileras o Voyager de 2 hileras), ni manejo, ni
suelo.

Fuente: datos/agrocebada.sqlite, tabla parcelas (cálculo propio con datos oficiales).
