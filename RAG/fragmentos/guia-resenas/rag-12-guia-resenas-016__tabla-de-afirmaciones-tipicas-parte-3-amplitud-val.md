@id: rag-12-guia-resenas-016
@documento: rag-12-guia-resenas | temas/12_guia_analista_de_resenas.md
@categoria: guia-resenas
@titulo: Tabla de afirmaciones típicas (parte 3: amplitud, validación y resultados)
@titulo_documento: Guía operativa para analizar reseñas del Reto AgroCebada (verificación de afirmaciones, taxonomía de errores, rúbrica y análisis de datos)
@etiquetas: analisis de resenas; verificacion de afirmaciones; errores frecuentes; rubrica de evaluacion; plantillas de respuesta; analisis de datos; mapa de documentos; reto agrocebada; jerga agronomica; clima de temporal; mercado de la cebada; malteo y calidad; medicion del rendimiento; fisiologia de la cebada
@claves: analisis de resenas verificacion de afirmaciones errores frecuentes rubrica de evaluacion plantillas de respuesta analisis de datos mapa de documentos reto agrocebada jerga agronomica clima de temporal mercado de la cebada malteo y calidad medicion del rendimiento fisiologia de la cebada incorrecta rag-04-amplitud rag-10-validacion validacion amplitud cruzada error parcelas rag-02-glosario afirmaciones bajo cebada cifra demuestra desempeno estandar fenologia linea mejor minimo modelo ndvi nuevo parte predicciones
@fuente: 04_amplitud_significados.md; 02_glosario_terminos_es.md; 10_validacion_fugas_y_muestras_pequenas.md; 07_teledeteccion_y_fenologia.md.
# Tabla de afirmaciones típicas (parte 3: amplitud, validación y resultados)

| # | Afirmación típica | Veredicto | Documento de referencia |
|---|---|---|---|
| 37 | HLS a 30 m es adecuado para parcelas de 1 ha | imprecisa | rag-07-teledeteccion (1 a 4 píxeles puros) |
| 38 | El corte del 31 de octubre no afecta la fenología | incorrecta | rag-04-amplitud; rag-07-teledeteccion |
| 39 | La amplitud del NDVI es el máximo menos el mínimo del año | incorrecta | rag-04-amplitud (pico menos línea base) |
| 40 | La amplitud térmica se mide cada día en la parcela | incorrecta | rag-04-amplitud (media mensual en celdas de 5 km) |
| 41 | Un intervalo estrecho demuestra que 100 kg/ha es alcanzable | incorrecta | rag-04-amplitud |
| 42 | La amplitud de la curva NDVI mejoró la predicción dentro del municipio | incorrecta | rag-04-amplitud (resultado nulo) |
| 43 | Las 114 parcelas sin senescencia y las 107 censuradas son la misma cifra | incorrecta | rag-04-amplitud (sensores distintos) |
| 44 | La helada mata la cebada a −7 °C en todo el Altiplano | no verificable | rag-04-amplitud (no documentado) |
| 45 | La desviación estándar del raster es la variación del mes | incorrecta | rag-04-amplitud |
| 46 | El R² de 0.79 de García-Martínez en Acambay valida la estimación de cebada | incorrecta | rag-02-glosario (el corpus lo describe como R² de maíz bajo sequía, sin validación externa; la cifra no se reconfirmó en línea: no verificado) |
| 47 | Un R² alto en validación cruzada garantiza buen desempeño nuevo | incorrecta | rag-02-glosario; rag-10-validacion |
| 48 | Una diferencia de 0.01 t/ha demuestra que un modelo es mejor | incorrecta | rag-02-glosario; rag-10-validacion |
| 49 | El RMSE bajó de 0.471 a 0.468; el modelo nuevo es mejor | incorrecta | rag-10-validacion (error estándar ≈ 0.03, aproximación heurística) |
| 50 | Apilar predicciones de validación cruzada da evaluación honesta | incorrecta | rag-10-validacion |
| 51 | Excluir las dos parcelas de mayor error es prueba de robustez | incorrecta | rag-10-validacion |
| 52 | Redondear predicciones a 0.5 mejora el RMSE | incorrecta | rag-10-validacion |
| 53 | El mínimo del error de validación cruzada estima bien el desempeño | incorrecta | rag-10-validacion (sesgo a la baja) |

Fuente: 04_amplitud_significados.md; 02_glosario_terminos_es.md; 10_validacion_fugas_y_muestras_pequenas.md; 07_teledeteccion_y_fenologia.md.
