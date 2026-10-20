@id: rag-06-plagas-danos-040
@documento: rag-06-plagas-danos | temas/06_plagas_enfermedades_y_deteccion_de_danos.md
@categoria: plagas
@titulo: Errores de datos encontrados por A2
@titulo_documento: Plagas, enfermedades y detección de daños en cebada de temporal con satélite
@etiquetas: plagas; enfermedades; cebada; valles altos; detección de daño; ndvi; anomalía; teledetección; malezas; roya
@claves: plagas enfermedades cebada valles altos deteccion de dano ndvi anomalia teledeteccion malezas roya errores datos encontrados erroneas fechas linea pico primero tienen variables aaaa afectan analisis bajo base carpeta claras concordancia correccion corregidas corregirlo correlacionan cualquier curvas desfase
@fuente: `iterate_20261017__research__A2_outlier_forensics.md` (§6).
# Errores de datos encontrados por A2

Dos errores afectan cualquier análisis de imágenes del proyecto. Primero, en el script de variables de PlanetScope de la carpeta de literatura, la línea 117 parsea fechas dd/mm/aaaa con mes primero: 28,304 de 47,804 filas quedan como NaT y 17,835 tienen día y mes intercambiados. Sólo 12,789 de 31,708 observaciones
claras de 2025 entran a las curvas, sobre todo con fechas erróneas. Las variables corregidas correlacionan 0.48 con las erróneas en el índice LAI al pico y 0.06 en otra variable. Segundo, 490 de 500 escenas de Sentinel-2 L2A a 10 m (línea base de procesamiento ≥ 04.00) tienen un desfase de −0.1 en reflectancia. Sin
corregirlo, el NDVI al pico se lee unos 0.3 más bajo. Con la corrección, la concordancia con HLS es r = 0.99.

Fuente: `iterate_20261017__research__A2_outlier_forensics.md` (§6).
