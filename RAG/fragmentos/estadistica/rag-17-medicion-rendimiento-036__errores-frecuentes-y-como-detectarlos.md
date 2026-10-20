@id: rag-17-medicion-rendimiento-036
@documento: rag-17-medicion-rendimiento | temas/17_medicion_del_rendimiento_y_estadistica_agricola.md
@categoria: estadistica
@titulo: Errores frecuentes y cómo detectarlos
@titulo_documento: Medición del rendimiento en campo y estadística agrícola: métodos, errores y límites para las etiquetas del reto
@etiquetas: rendimiento; cosecha de muestra; crop cut; autorreporte; humedad del grano; redondeo; heaping; siap; inegi; error de medición
@claves: rendimiento cosecha de muestra crop cut autorreporte humedad del grano redondeo heaping siap inegi error de medicion afirmacion correccion erronea base espigas parcela produccion area errores etiqueta granos medida altos citada conteo corregir cosecha densidad detectarlos error espiga etiquetas exactamente
@fuente: [01_reto_agrocebada_y_datos.md, 10_validacion_fugas_y_muestras_pequenas.md]
# Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** El rendimiento de una parcela se mide directamente en campo. → **Corrección:** Es el cociente entre una producción medida o autorreportada y un área medida con error; ambos componentes deben documentarse (Carletto et al., 2017; SIAP, 2022).
- **Afirmación errónea:** El autorreporte de productores es insesgado y basta como etiqueta. → **Corrección:** Lobell et al. (2020) encuentran que explica menos de 1 % de la variabilidad del rendimiento de parcela completa, y Gourlay et al. (2019) documentan sobreestimación en parcelas pequeñas.
- **Afirmación errónea:** Un valor de 3.5 t/ha en las etiquetas es exactamente 3.5 t/ha medidos. → **Corrección:** Puede ser un redondeo o un amontonamiento; 45 de 138 etiquetas caen exactamente en la rejilla de 0.5 y su error de redondeo tiene desviación estándar de 0.144 t/ha si el redondeo fue a esa rejilla.
- **Afirmación errónea:** Corregir solo el área o solo la producción siempre reduce el sesgo. → **Corrección:** Con errores correlacionados en área y producción, corregir una de las dos puede aumentar el sesgo (Abay et al., 2019).
- **Afirmación errónea:** El rendimiento municipal del SIAP sirve como etiqueta de la parcela. → **Corrección:** El municipal es producción total entre superficie cosechada total; no es el promedio de parcelas, y en el proyecto su correlación con la etiqueta de parcela fue baja (Spearman −0.30, n = 8, cifra del
  corpus).
- **Afirmación errónea:** El rendimiento a 12 % de humedad se calcula sumando o restando un porcentaje fijo. → **Corrección:** Se usa Y_base = Y × (100 − H_medida) / (100 − H_base); el ajuste es proporcional, no aditivo.
- **Afirmación errónea:** La norma mexicana de cebada fija la base de humedad a 12 %. → **Corrección:** La base de 12 % citada es argentina (Norma V, Res. 27/2013). No se localizó una NMX mexicana (no documentado).
- **Afirmación errónea:** "El follaje por m² determina el rendimiento." → **Corrección:** el follaje es una variable intermedia; el rendimiento requiere espigas/m², granos por espiga y peso de grano, y depende del índice de cosecha y del llenado (Gómez Mercado et al., 2009; Gracia-Romero et al., 2023).
- **Afirmación errónea:** "kg/ha = espigas × granos × PMG." → **Corrección:** kg/ha = espigas/m² × granos/espiga × PMG (g) / 100. Sin dividir entre 100 el resultado sale 100 veces mayor.
- **Afirmación errónea:** "El NDVI cuenta espigas." → **Corrección:** el NDVI estima verdor; en trigo satura por encima de 8 t/ha y no detecta número ni tamaño de grano (Gracia-Romero et al., 2023).
- **Afirmación errónea:** "La densidad de 100 kg/ha es la recomendada para Valles Altos." → **Corrección:** la ficha citada es de Zacatecas (INIFAP-CEZAC); la densidad para Valles Altos no está documentada.
- **Afirmación errónea:** "Un conteo temprano predice la cosecha." → **Corrección:** según resúmenes de guías no verificadas, la precisión mejora cerca de la madurez; la sequía terminal o el calor en llenado pueden cambiar el resultado después del conteo.
