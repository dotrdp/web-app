@id: rag-14-clima-036
@documento: rag-14-clima | temas/14_clima_y_riesgo_climatico_altiplano.md
@categoria: clima
@titulo: Errores frecuentes y cómo detectarlos
@titulo_documento: Clima y riesgo climático en el Altiplano central: lluvia de temporal, heladas, sequía e índices agroclimáticos
@etiquetas: clima de temporal; altiplano central; heladas; sequía; spi; spei; grados-día; chirps; chirts-era5; enso
@claves: clima de temporal altiplano central heladas sequia spi spei grados-dia chirps chirts-era5 enso afirmacion correccion erronea minima parcela cebada detectarlos diaria dias errores frecuentes lluvia mensuales puede rasters temperatura umbral absoluta afecto alta altiplano aplica aquacrop area
@fuente: [01_reto_agrocebada_y_datos.md, 03_agronomia_cebada_altiplano.md, 04_amplitud_significados.md]
# Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** Los rasters CHIRTS-ERA5 dan la temperatura mínima del mes → **Corrección:** Son promedios mensuales de la temperatura mínima diaria, en °C; no son la mínima absoluta del mes.
- **Afirmación errónea:** Con los rasters mensuales se cuentan los días con helada de cada parcela → **Corrección:** No se puede; hace falta la serie diaria de Tmin. Un mes con media alta puede tener días bajo 0 °C.
- **Afirmación errónea:** El valor de CHIRPS es la lluvia de la parcela → **Corrección:** Es el promedio de una celda de 0.05° (unos 29 km² en el centro de México). Una parcela de 5 ha es menos del 2 % de esa área.
- **Afirmación errónea:** El umbral de 4 °C aplica a la cebada → **Corrección:** Es el umbral usado para maíz en Toluca (Jasso-Miranda et al., 2022); la cebada tiene umbrales por etapa fenológica.
- **Afirmación errónea:** Los grados-día se calculan igual en todos los estudios → **Corrección:** McMaster y Wilhelm (1997) muestran dos interpretaciones de la misma ecuación; hay que declarar la base y el método.
- **Afirmación errónea:** El SPI y el SPEI son equivalentes → **Corrección:** El SPEI resta la evapotranspiración potencial y responde al calentamiento; el SPI solo usa la lluvia (Vicente-Serrano et al., 2010).
- **Afirmación errónea:** La sequía de 2025 afectó 13.7 % o 21.1 % del territorio → **Corrección:** Son cifras de prensa con cortes distintos que no coinciden entre sí; debe usarse el reporte oficial del Monitor del SMN para la fecha de interés.
- **Afirmación errónea:** Calpulalpan representa todo el Altiplano → **Corrección:** Es un estudio de un municipio con AquaCrop (Calderón-García et al., 2015); la generalización requiere más casos.
