@id: rag-01-reto-datos-041
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: CHIRPS: cobertura, resolución y qué representa una celda
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem celda data representa resolucion area center climate cobertura estaciones estimaciones funk hazards malla precipitacion producto scientific advierte areas basadas casi centro chirps2 combina complejo
@fuente: https://www.chc.ucsb.edu/data/chirps (leída en la ronda 2); Funk, C., et al. (2015). Scientific Data 2, 150066. doi:10.1038/sdata.2015.66.
# CHIRPS: cobertura, resolución y qué representa una celda

CHIRPS (Climate Hazards Center InfraRed Precipitation with Stations) es un producto de precipitación en malla que combina estimaciones satelitales infrarrojas con datos de estaciones pluviométricas. Según el Climate Hazards Center (CHC), cubre 50°S a 50°N y todas las longitudes, desde 1981 hasta casi el presente, con
resolución de 0.05° (unos 5 km). Funk et al. (2015) describen la versión CHIRPS2 en Scientific Data. Para el centro de México, cada celda de 0.05° representa un área de unos 29 km², no un punto: una parcela de 5 ha es menos de 2 % de esa área. El CHC advierte que las estimaciones basadas solo en satélite promedian
áreas y sufren sesgos en terreno complejo, con tendencia a subestimar la intensidad de eventos extremos. El producto mitiga parcialmente este problema con un término de realce de la precipitación inducido por el relieve y con interpolación de estaciones. Recomendación: al interpretar CHIRPS en parcelas, declarar que el
valor es una estimación de malla y no una medición local.

Fuente: https://www.chc.ucsb.edu/data/chirps (leída en la ronda 2); Funk, C., et al. (2015). Scientific Data 2, 150066. doi:10.1038/sdata.2015.66.
