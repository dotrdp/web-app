@id: rag-01-reto-datos-014
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Valores de rendimiento repetidos ("amontonados")
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem valores rendimiento tienen amontonados cadenas decimal medicion parcelas precision rejilla repetidos agrupacion archivo artefacto audit auditoria ausencia caen calculados dataset debe describe dicen docs ello
@fuente: HECHOS_CALCULADOS_dataset_oficial.md (frecuencias); modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (precisión de cadenas y ausencia de protocolo).
# Valores de rendimiento repetidos ("amontonados")

Los valores exactos más frecuentes del entrenamiento son 3.0 t/ha (19 parcelas), 3.5 (13) y 2.5 (11); les siguen 4.55 y 4.52 (5 cada uno). Exactamente sobre la rejilla de 0.5 t/ha caen 45 de 138 etiquetas (32.6 %), y sobre la rejilla de 0.1 t/ha, 58 de 138. Los valores próximos a 4.5 (4.49, 4.51, 4.52…) no son 4.5
exacto: si se redondea a 0.1 t/ha parece haber 27 parcelas en 4.5, pero es un artefacto del redondeo. La auditoría de entrada encontró que, en las cadenas del CSV, 20 valores no tienen punto decimal, 38 tienen un decimal y 80 tienen dos. Esto describe la precisión del archivo, no la del método de medición. Las fuentes
no dicen si el rendimiento es medido, reportado por el productor o estimado. Por ello, la agrupación en valores redondeados no debe leerse como evidencia de un error de medición fijo, ni como un techo predecible.

Fuente: HECHOS_CALCULADOS_dataset_oficial.md (frecuencias); modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (precisión de cadenas y ausencia de protocolo).
