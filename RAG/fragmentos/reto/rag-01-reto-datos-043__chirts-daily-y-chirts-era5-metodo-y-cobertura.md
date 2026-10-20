@id: rag-01-reto-datos-043
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: CHIRTS-daily y CHIRTS-ERA5: método y cobertura
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem chirts chirts-daily data estaciones mexico producto ronda serie verdin cobertura estudios leida maxima metodo minima temperatura validacion abarca absoluta antes articulo baja base buscar
@fuente: Verdin, A., Funk, C., Peterson, P., Landsfeld, M., Tuholske, C. y Grace, K. (2020). Development and validation of the CHIRTS-daily quasi-global high-resolution daily temperature data set. Scientific Data 7, 303. doi:10.1038/s41597-020-00643-7; https://www.chc.ucsb.edu/data/chirts-era5 (leída en la…
# CHIRTS-daily y CHIRTS-ERA5: método y cobertura

Verdin et al. (2020) describen CHIRTS-daily, un producto cuasi-global de temperatura diaria máxima y mínima a 0.05° (unos 5 km) para 60°S a 70°N. Su serie base abarca 1983 a 2016. Está diseñado para regiones con baja densidad de estaciones y combina estimaciones infrarrojas satelitales con observaciones de estaciones.
CHIRTS-ERA5 extiende la serie después de 2016 y es una versión del reanálisis ERA5 corregida por sesgo y reescalada para ser compatible con CHIRTS, según el CHC. Los valores de la serie son promedios de las temperaturas diarias mínimas o máximas del mes, en °C; no son la mínima ni la máxima absoluta del mes. Para el
reto, esto cambia la interpretación de cualquier umbral térmico. La validación del producto en México no se localizó en la ronda 3 (búsquedas en OpenAlex y Crossref sin estudios de CHIRTS en México; sí hay estudios de CHIRTS en Kenia y Mozambique, véase el fragmento nuevo sobre CHIRTS fuera de México): el artículo de
Verdin et al. (2020) incluye una validación del producto (no leída en detalle en esta ronda), y conviene buscar comparaciones con estaciones del SMN en los valles de Tlaxcala y Puebla antes de usar la temperatura como variable de campo.

Fuente: Verdin, A., Funk, C., Peterson, P., Landsfeld, M., Tuholske, C. y Grace, K. (2020). Development and validation of the CHIRTS-daily quasi-global high-resolution daily temperature data set. Scientific Data 7, 303. doi:10.1038/s41597-020-00643-7; https://www.chc.ucsb.edu/data/chirts-era5 (leída en la ronda 2).
