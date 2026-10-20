@id: rag-12-guia-resenas-017
@documento: rag-12-guia-resenas | temas/12_guia_analista_de_resenas.md
@categoria: guia-resenas
@titulo: Tabla de afirmaciones típicas (parte 4: modelos, variedades, literatura y opinión)
@titulo_documento: Guía operativa para analizar reseñas del Reto AgroCebada (verificación de afirmaciones, taxonomía de errores, rúbrica y análisis de datos)
@etiquetas: analisis de resenas; verificacion de afirmaciones; errores frecuentes; rubrica de evaluacion; plantillas de respuesta; analisis de datos; mapa de documentos; reto agrocebada; jerga agronomica; clima de temporal; mercado de la cebada; malteo y calidad; medicion del rendimiento; fisiologia de la cebada
@claves: analisis de resenas verificacion de afirmaciones errores frecuentes rubrica de evaluacion plantillas de respuesta analisis de datos mapa de documentos reto agrocebada jerga agronomica clima de temporal mercado de la cebada malteo y calidad medicion del rendimiento fisiologia de la cebada incorrecta rag-13-variedades temporal variedad voyager dona hileras imprecisa josefa modelos rag-09-experimentos-tabulares cebada literatura opinion rag-08-experimentos-profundos rag-11-literatura rendimiento tres variedades afirmaciones altiplano bien cero documento estados
@fuente: 08_experimentos_modelos_profundos_y_fundacionales.md; 09_experimentos_tabulares_espaciales_y_fenologicos.md; 11_revision_de_literatura_y_transferencia.md; 13_variedades_dona_josefa_y_voyager.md; 02_glosario_terminos_es.md; 07_teledeteccion_y_fenologia.md.
# Tabla de afirmaciones típicas (parte 4: modelos, variedades, literatura y opinión)

| # | Afirmación típica | Veredicto | Documento de referencia |
|---|---|---|---|
| 54 | Kumo mejora el RMSE del proyecto | imprecisa | rag-09-experimentos-tabulares (0.002433 t/ha, IC incluye cero) |
| 55 | Kumo rainfed alcanzó R² de 0.85 | incorrecta | rag-09-experimentos-tabulares (no hay evaluación held-out completa) |
| 56 | El APAR o el NDVI mejoran la regresión espacial | incorrecta | rag-09-experimentos-tabulares (0 de 20 splits) |
| 57 | El área de parcela explica el rendimiento | imprecisa | rag-09-experimentos-tabulares (sólo Chignahuapan) |
| 58 | Las curvas fenológicas predicen el rendimiento | incorrecta | rag-09; rag-07-teledeteccion |
| 59 | MMST-ViT es superior a los demás modelos del benchmark | incorrecta | rag-08-experimentos-profundos (IC incluye cero) |
| 60 | Los embeddings AlphaEarth mejoran significativamente el random forest | incorrecta | rag-08-experimentos-profundos (0.0124 t/ha) |
| 61 | Doña Josefa y Voyager responden igual a los fungicidas | incorrecta | rag-06-plagas-danos; rag-13-variedades (el resumen de 2021 reporta respuestas distintas por variedad; Voyager requiere el texto completo) |
| 62 | WOFOST o SCYM predicen bien con parámetros genéricos | incorrecta | rag-08-experimentos-profundos (RMSE 0.877 a 0.892) |
| 63 | Doña Josefa es una variedad del INIFAP | incorrecta | rag-13-variedades (el estudio arbitrado de 2021 la atribuye al ICAMEX; no se encontró atribución al INIFAP) |
| 64 | El dataset FIRA trae la variedad de cada parcela | incorrecta | rag-13-variedades |
| 65 | Voyager es una variedad desarrollada para el Altiplano mexicano | no verificable | rag-13-variedades (sin obtentor documentado; se evaluó en tres sitios de temporal de México en 2018) |
| 66 | La cebada de 2 hileras rinde más que la de 6 hileras | imprecisa | rag-13-variedades (depende de variedad y ambiente: en el ensayo de temporal de 2018, Doña Josefa de 6 hileras rindió más que Voyager de 2 hileras) |
| 67 | Los 968 registros CIMMYT son cebada de temporal en tres estados | incorrecta | rag-11-literatura (el artículo reporta 968 registros a escala nacional, sin separar régimen ni estado; nuestro filtro da 94 de temporal en tres estados) |
| 68 | La agricultura de conservación aumenta el rendimiento según Ferguson et al. | incorrecta | rag-11-literatura |
| 69 | Un pronóstico satelital mejora el crédito rural en México | no verificable | rag-11-literatura |
| 70 | La milpa es un cultivo de cebada en el Altiplano | incorrecta | rag-02-glosario |
| 71 | Temporal significa temporada de lluvias | incorrecta | rag-02-glosario |
| 72 | La mancha verde de enero indica suelo fértil | imprecisa | rag-07-teledeteccion |
| 73 | El dashboard se ve bien y es fácil de usar | opinión | este documento (sección de flujo) |

Fuente: 08_experimentos_modelos_profundos_y_fundacionales.md; 09_experimentos_tabulares_espaciales_y_fenologicos.md; 11_revision_de_literatura_y_transferencia.md; 13_variedades_dona_josefa_y_voyager.md; 02_glosario_terminos_es.md; 07_teledeteccion_y_fenologia.md.
