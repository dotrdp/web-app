@id: rag-01-reto-datos-029
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Problemas de calidad detectados: unión por ID y no por posición
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem posicion rendimiento audit calidad detectados fira identificadores modelado original parcelas problemas shapefile union unir activa ademas area asignaria auditorias campo coinciden column confirmaron constructores contiene
@fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (sección Terrain, geometry and column filtering); modelado__ORIGINAL_FIRA_AUDIT.md.
# Problemas de calidad detectados: unión por ID y no por posición

El shapefile de parcelas no sigue el mismo orden que el CSV de rendimiento: sus primeros identificadores son AGC_196, AGC_044, AGC_020, AGC_174 y AGC_083, mientras el CSV empieza en AGC_001. Unir por posición de fila asignaría mal los 197 registros. Al unir ID_POLIGON con ID_POLIGONO, el área y la partición coinciden
exactamente en todas las parcelas. Las auditorías confirmaron que los constructores usan identificadores explícitos y que no hay una desalineación activa. Además, el shapefile no contiene campo de rendimiento: el rendimiento viene solo del CSV.

Fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (sección Terrain, geometry and column filtering); modelado__ORIGINAL_FIRA_AUDIT.md.
