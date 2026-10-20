@id: rag-20-datos-mcp-014
@documento: rag-20-datos-mcp | temas/20_datos_estructurados_y_herramientas_mcp.md
@categoria: datos
@titulo: Errores frecuentes y cómo detectarlos
@titulo_documento: Datos estructurados del proyecto y su consulta con el servidor MCP agrocebada
@etiquetas: datos; mcp; sqlite; sql; parcelas; sentinel-2; landsat; planet; hls; alphaearth; chirps; siap; herramientas
@claves: datos mcp sqlite sql parcelas sentinel-2 landsat planet hls alphaearth chirps siap herramientas afirmacion correccion erronea rendimiento ndvi base basico detectarlos errores etiquetas frecuentes municipio parcela prediccion trae automaticamente campo chirts-era5 clima comparten
@fuente: [datos/agrocebada.sqlite, mcp/servidor_agrocebada.py, 01_reto_agrocebada_y_datos.md, 14_clima_y_riesgo_climatico_altiplano.md, 17_medicion_del_rendimiento_y_estadistica_agricola.md]
# Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** "El rendimiento del SIAP del municipio es el rendimiento de la parcela." → **Corrección:** Es producción entre superficie cosechada de todo el municipio. En los municipios del reto, 2015–2024, quedó entre 2.26 y 2.79 t/ha, por debajo de las etiquetas.
- **Afirmación errónea:** "La base de datos trae el rendimiento de las 59 parcelas de predicción." → **Corrección:** `rendimiento_t_ha` es NULL en las 59 parcelas de PREDICCION; no hay etiquetas ocultas en la base.
- **Afirmación errónea:** "El NDVI de Planet y el de Sentinel-2 son la misma variable y se pueden promediar." → **Corrección:** El diccionario oficial indica que vienen de fuentes distintas y no deben fusionarse automáticamente.
- **Afirmación errónea:** "La dimensión a17 de AlphaEarth mide la humedad del suelo." → **Corrección:** Las dimensiones del embedding no tienen significado físico individual.
- **Afirmación errónea:** "Landsat del dataset Básico trae NDVI." → **Corrección:** En el Básico, las filas de Landsat solo traen VI6T; el NDVI es de Sentinel-2.
- **Afirmación errónea:** "clima_mensual da la temperatura de cada parcela medida en campo." → **Corrección:** Es la media de una malla de unos 5 km (CHIRTS-ERA5 y CHIRPS); parcelas vecinas comparten valor.
