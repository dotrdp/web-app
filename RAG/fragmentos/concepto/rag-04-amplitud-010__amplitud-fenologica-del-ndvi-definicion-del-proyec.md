@id: rag-04-amplitud-010
@documento: rag-04-amplitud | temas/04_amplitud_significados.md
@categoria: concepto
@titulo: Amplitud fenológica del NDVI: definición del proyecto
@titulo_documento: Significados de "amplitud" en el Reto AgroCebada (térmica, NDVI estacional, intervalos e ventanas)
@etiquetas: amplitud; amplitud térmica; tmax tmin; chirts-era5; ndvi; amplitud estacional; línea base; intervalo de predicción; ancho de intervalo; ventana de siembra; fenología; heladas; temperatura base; grados-día; predicción conformal
@claves: amplitud amplitud termica tmax tmin chirts-era5 ndvi amplitud estacional linea base intervalo de prediccion ancho de intervalo ventana de siembra fenologia heladas temperatura base grados-dia prediccion conformal base curva fenologica linea pico proyecto abril baseline definicion mediana suavizada amplitude calendarica calendarico change cifras corte definir desde dias diferencia diferencias docs
@fuente: teledeteccion_fenologia/dynamic_change__phenocurve__docs__F1_fits.md
# Amplitud fenológica del NDVI: definición del proyecto

En el proyecto, la amplitud fenológica es la diferencia entre el pico y la línea base de la curva de NDVI suavizada: amplitude = peak − baseline. La línea base (baseline) es el mínimo de la curva suavizada entre el 1 de abril y el pico. La curva se suaviza con un Whittaker de segundas diferencias y λ = 100, en la
escala calendárica (días desde el 1 de abril de 2025). Es la métrica de nivel más usada para definir verdor y senescencia.

Cifras de Planet NDVI para las 197 parcelas, con el eje calendárico y el corte del 31 de octubre: línea base mediana 0.1945 (p10 0.1706, p90 0.234); amplitud mediana 0.545 (p10 0.4525, p90 0.6297); pico mediano 0.7438.

Fuente: teledeteccion_fenologia/dynamic_change__phenocurve__docs__F1_fits.md
