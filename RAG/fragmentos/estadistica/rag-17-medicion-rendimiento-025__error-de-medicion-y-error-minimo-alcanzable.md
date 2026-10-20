@id: rag-17-medicion-rendimiento-025
@documento: rag-17-medicion-rendimiento | temas/17_medicion_del_rendimiento_y_estadistica_agricola.md
@categoria: estadistica
@titulo: Error de medición y error mínimo alcanzable
@titulo_documento: Medición del rendimiento en campo y estadística agrícola: métodos, errores y límites para las etiquetas del reto
@etiquetas: rendimiento; cosecha de muestra; crop cut; autorreporte; humedad del grano; redondeo; heaping; siap; inegi; error de medición
@claves: rendimiento cosecha de muestra crop cut autorreporte humedad del grano redondeo heaping siap inegi error de medicion error medicion etiquetas frente minimo alcanzable cuadratico esperanza etiqueta medio piso propiedad puede rmse seria valor aproximadamente bajar base calculo centesimas cero contienen
@fuente: Cálculo propio sobre la propiedad de la esperanza del error cuadrático medio; valor 0.144 t/ha a partir de h²/12 (ver fragmento de redondeo). Para el piso con error de autorreporte, ver Gourlay et al. (2019) y Lobell et al. (2020).
# Error de medición y error mínimo alcanzable

Si las etiquetas contienen un error de medición independiente del predictor y de media cero, con desviación estándar σ_e, ningún modelo puede bajar el RMSE frente a las etiquetas observadas por debajo de σ_e. Esto no es una opinión, sino una propiedad de la esperanza: el error cuadrático medio frente a la etiqueta
observada es igual al error frente al valor verdadero más la varianza del error de medición. Si el único error de la etiqueta fuera el redondeo a 0.5 t/ha, σ_e sería 0.144 t/ha y el RMSE mínimo sería aproximadamente 0.144 t/ha. Con error de autorreporte, de método o de base de humedad, el piso sube. Por eso una mejora
de unas centésimas de t/ha puede ser indistinguible del ruido de las etiquetas.

Fuente: Cálculo propio sobre la propiedad de la esperanza del error cuadrático medio; valor 0.144 t/ha a partir de h²/12 (ver fragmento de redondeo). Para el piso con error de autorreporte, ver Gourlay et al. (2019) y Lobell et al. (2020).
