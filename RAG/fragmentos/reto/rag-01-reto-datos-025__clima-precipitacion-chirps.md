@id: rag-01-reto-datos-025
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Clima: precipitación CHIRPS
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem precipitacion bases clima climate hazards original rasters referencia ronda sdata abarca acumulada advierte agrocebada articulo audit casi celda celdas center cerca chirps2 climaticos cobertura
@fuente: BASES_oficiales_Reto_AgroCebada.txt (sección Dataset, referencias); modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (rasters climáticos); referencia externa https://doi.org/10.1038/sdata.2015.66.
# Clima: precipitación CHIRPS

La precipitación mensual acumulada viene de CHIRPS (Climate Hazards InfraRed Precipitation with Stations), en 48 rasters mensuales de enero de 2022 a diciembre de 2025, en mm por mes. Cada raster tiene 65 × 72 píxeles en EPSG:4326, con celdas de unos 0.05° (cerca de 5 km), y valor de nodata −9999. Un píxel abarca
muchas parcelas, así que no representa un pluviómetro en cada una. La referencia recomendada por las bases es Funk et al. (2015), Scientific Data 2, 150066, doi:10.1038/sdata.2015.66 (verificado en la ronda 2: el Climate Hazards Center enlaza ese artículo como descripción de CHIRPS2, con resolución de 0.05° y cobertura
de 50°S a 50°N desde 1981 hasta casi el presente). Recortar a los tres estados no crea mediciones más finas que la celda original. El CHC advierte que las estimaciones solo satelitales sufren sesgos en terreno complejo y tienden a subestimar eventos extremos; ver los fragmentos de validación en esta ronda.

Fuente: BASES_oficiales_Reto_AgroCebada.txt (sección Dataset, referencias); modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (rasters climáticos); referencia externa https://doi.org/10.1038/sdata.2015.66.
