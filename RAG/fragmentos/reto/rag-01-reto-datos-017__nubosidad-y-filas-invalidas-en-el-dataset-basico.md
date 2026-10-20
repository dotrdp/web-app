@id: rag-01-reto-datos-017
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Nubosidad y filas inválidas en el Dataset Básico
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem filas nubosidad tienen basico cuatro dataset invalidas ademas aparece audit ausentes carecen cero conjunto cuartetos cumple demas desviaciones diciembre docs estadisticos estandar fapar fila
@fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (sección BASICO records and quality).
# Nubosidad y filas inválidas en el Dataset Básico

Todas las 14,163 filas de Sentinel-2 con 100 % de nubosidad carecen de NDVI; las demás filas de Sentinel-2 sí lo tienen. En Landsat, 14,521 filas tienen 100 % de nubosidad y 3,056 no tienen metadatos de nubosidad; en conjunto, 17,577 filas no tienen VI6T. Ningún índice primario numérico aparece en una fila 100 %
nublada. Además, cuatro parcelas (AGC_019, AGC_086, AGC_103 y AGC_173) tienen los cuatro estadísticos de FAPAR ausentes en observaciones de Sentinel-2 del 7 de diciembre de 2022 con nubosidad cero. Las desviaciones estándar son no negativas y se cumple min ≤ promedio ≤ max en todos los cuartetos no vacíos.

Fuente: modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (sección BASICO records and quality).
