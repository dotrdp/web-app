@id: rag-04-amplitud-044
@documento: rag-04-amplitud | temas/04_amplitud_significados.md
@categoria: concepto
@titulo: Preguntas y respuestas
@titulo_documento: Significados de "amplitud" en el Reto AgroCebada (térmica, NDVI estacional, intervalos e ventanas)
@etiquetas: amplitud; amplitud térmica; tmax tmin; chirts-era5; ndvi; amplitud estacional; línea base; intervalo de predicción; ancho de intervalo; ventana de siembra; fenología; heladas; temperatura base; grados-día; predicción conformal
@claves: amplitud amplitud termica tmax tmin chirts-era5 ndvi amplitud estacional linea base intervalo de prediccion ancho de intervalo ventana de siembra fenologia heladas temperatura base grados-dia prediccion conformal base pico temperatura cebada dias linea calor cobertura durante minimo reportan segun altiplano antes bota curva grano intervalo junio minima planta proyecto puede
@fuente: [reto_y_datos/DESCRIPCION_oficial_dataset.txt, reto_y_datos/Descripcion_general_variables_DataSet.txt, reto_y_datos/dataset__DATASET_RETO_AGRO_2026__plot_features__README.md, reto_y_datos/plots__README.md, reto_y_datos/modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md,
# Preguntas y respuestas

**P:** ¿Qué es la amplitud térmica en el contexto del Reto AgroCebada?
**R:** Es la diferencia entre la temperatura máxima y la mínima. Con los rasters del reto se calcula como Tmax_mes − Tmin_mes, usando medias mensuales de los mínimos y máximos diarios, en °C.

**P:** ¿Los rasters CHIRTS-ERA5 del reto dan la temperatura máxima y mínima diaria?
**R:** No. Son promedios mensuales de las mínimas y las máximas diarias, no el día más frío o más caluroso del mes.

**P:** ¿Cuál es la resolución de los rasters térmicos?
**R:** Unos 0.05° (cerca de 5 km), con 65 × 72 píxeles por raster y NoData −9999.

**P:** ¿Cómo se calcula la amplitud NDVI en el proyecto?
**R:** Como pico menos línea base: amplitude = peak − baseline, donde la línea base es el mínimo de la curva suavizada entre el 1 de abril y el pico.

**P:** ¿Qué umbral se usa para el verdor?
**R:** El 50 % de la amplitud sobre la línea base. Con Planet NDVI se usa la última cruce antes del pico.

**P:** ¿Cuántas parcelas no llegan al 50 % de caída antes del 31 de octubre?
**R:** Con Sentinel-2 y el umbral del 50 % tras el pico, 114 de 197 no lo alcanzan (mediana 1 de noviembre). Con HLS, 107 quedan censuradas. Las cifras dependen del sensor.

**P:** ¿La amplitud NDVI mejoró la predicción del rendimiento dentro de municipio?
**R:** No en nuestros experimentos. El modelo de pico y verdor dio un resultado nulo, y la línea base previa al verdor fue la única métrica con señal.

**P:** ¿Qué valores típicos de amplitud térmica hay en el Altiplano central?
**R:** Según las normales oficiales del SMN 1991–2020, la diferencia mensual Tmax − Tmin de estaciones del Altiplano va de unos 9 a 14 °C en Pachuca (media 12.1 °C) a unos 15 a 21 °C en Apan (media 18.3 °C). Son valores de estación, no de parcela.

**P:** ¿Qué significa "amplitud" cuando se habla de un intervalo?
**R:** Es el ancho del intervalo, la distancia entre sus límites. Debe leerse junto con su cobertura. En el proyecto, la cobertura por región es trabajo futuro.

**P:** ¿Qué es la amplitud de la ventana de siembra?
**R:** Son los días entre la primera y la última siembra posibles. Según la agenda INIFAP Hidalgo (2017, cuadro 2), en el Altiplano de temporal la siembra va del 1 de mayo al 15 de junio (muy buena productividad, unos 45 días), del 15 de mayo al 20 de junio (buena, 36 días) o del 1 al 30 de junio (mediana y baja, 29
días).

**P:** ¿Qué temperatura base se usa para grados-día en cebada?
**R:** No hay una base única. Los estudios usan 0 °C, 4.4 °C (40 °F) o 5 °C, y los totales de GDD no son comparables entre sí sin declarar la base.

**P:** ¿A qué temperatura puede dañarse la cebada durante la bota o el espigado?
**R:** Literatura de extensión y de otros países indica unos −2 °C en bota a floración (la humedad de la bota puede congelarse) y unos −5 °C en el punto de crecimiento durante la elongación. Son umbrales generales, no una función validada para la cebada mexicana.

**P:** ¿Qué dice la literatura sobre el calor y la senescencia del trigo?
**R:** Lobell, Sibley y Ortiz-Monasterio (2012) reportan que temperaturas por encima de 34 °C aceleran el envejecimiento del trigo en el norte de la India, y que los modelos de cultivo subestiman este efecto.

**P:** ¿Qué garantía da la predicción conformal para un intervalo?
**R:** Una cobertura marginal, en promedio, igual al nivel nominal (por ejemplo 90 %), si los datos son intercambiables. No es una garantía condicional por región o parcela, y puede fallar con datos espaciales o temporales dependientes.

**P:** ¿La validación cruzada simple da intervalos fiables para el error del modelo?
**R:** No necesariamente. Bates, Hastie y Tibshirani (2024) muestran que los intervalos estándar basados en CV pueden cubrir muy por debajo del nivel deseado, y que la CV anidada da cobertura aproximadamente correcta en muchos de sus ejemplos.

**P:** ¿Cuál es la base de TIMESAT para calcular la amplitud?
**R:** Según el manual de TIMESAT 3.1, la base es el promedio del mínimo izquierdo y el mínimo derecho de la curva ajustada, y la amplitud es el máximo de la temporada menos esa base. El proyecto usa como línea base el mínimo de la curva suavizada antes del pico, así que sus cifras no son comparables con las de TIMESAT
sin declararlo.

**P:** ¿A qué temperatura de la planta se daña la cebada después de que emerge la espiga?
**R:** Frederiks et al. (2015) reportan daño hacia −4 a −5 °C de aire en el dosel y floretes dañados comúnmente cerca de −6.5 °C de temperatura de la planta. En un estudio del norte de Australia, el daño fue severo por debajo de −8 °C de mínima de la planta. Son umbrales de otras regiones, no validados para Hidalgo.

**P:** ¿El calor durante el llenado del grano afecta la calidad maltera de la cebada?
**R:** Sí, según estudios de campo y de cámaras de calor. Savin et al. (1996) reportan que calor corto en el llenado redujo el peso del grano (14 % en Schooner y 25 % en Parwan) y bajó la calidad de malta. Wallwork et al. (1998) reportan cambios en la estructura del grano con hasta 35 °C durante 5 días.
