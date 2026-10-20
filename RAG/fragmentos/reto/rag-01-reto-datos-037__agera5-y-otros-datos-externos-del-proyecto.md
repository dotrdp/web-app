@id: rag-01-reto-datos-037
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: AgERA5 y otros datos externos del proyecto
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem agera5 datos proyecto variables externos cifra conjunto masagro mexico observaciones otros registros siap temporal total admisibles agregan agronomicas alteradas area audit cebada cimmyt climate climaticas
@fuente: modelado__DATASET.md (secciones Yield sources, Area and model schema y Audit limits).
# AgERA5 y otros datos externos del proyecto

El proyecto preparó un conjunto tabular de datos de rendimiento externos de referencia que incluye AgERA5 versión 2, con 27 variables meteorológicas diarias a 0.1° (corregido en la ronda 2: la documentación del Copernicus Climate Data Store y de ECMWF describe unas 22 variables agronómicas para AgERA5 v2.0; la cifra de
27 del proyecto debe revisarse o explicarse, por ejemplo por variables derivadas; en las rondas 3 y 4, la página del CDS del conjunto sis-agrometeorological-indicators lista 16 «variables principales» (con enlaces «Show more» que no se pudieron leer) sin dar un total, así que la cifra de 27 sigue SIN EVIDENCIA y la de
unas 22 no se reconfirmó), y predictores de ventanas
climáticas de la temporada. Al mismo tiempo, combina registros de SIACON–SIAP (Mexico, 2003–2024, 338,607 registros admisibles de
temporal), USDA NASS, CIMMYT MasAgro (2012–2022), IBGE y MAPA España. El total de 1,032,892 observaciones es multicultivo y de temporal, no 1,032,892 parcelas de cebada; las observaciones de México (SIAP y MasAgro) se agregan por municipio o cuentan con coordenadas alteradas. Estos datos son contexto de entrenamiento
externo y no reemplazan las etiquetas de FIRA.

Fuente: modelado__DATASET.md (secciones Yield sources, Area and model schema y Audit limits).
